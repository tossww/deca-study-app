import { NextRequest, NextResponse } from 'next/server'
import { calculateStreak } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session token
    const userId = await getUserFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get total questions count
    const totalQuestions = await prisma.question.count()
    
    // Get user's question statistics with topic information
    const questionStats = await prisma.questionStat.findMany({
      where: { userId },
      include: {
        question: {
          include: {
            topic: true
          }
        }
      }
    })

    // Calculate mastery levels based on spaced repetition criteria
    const masteryLevels = {
      new: 0,        // Never seen (not in questionStats)
      apprentice: 0, // Learning: Seen but repetitions < 3 or ease factor < 2.3 (includes relearning)
      guru: 0,       // 3+ repetitions, ease factor >= 2.3, interval < 21 days
      master: 0,     // 3+ repetitions, ease factor >= 2.3, interval >= 21 days
    }

    const topicProgress: { [key: string]: typeof masteryLevels } = {}
    
    // Initialize topic progress
    const topics = await prisma.topic.findMany()
    topics.forEach(topic => {
      topicProgress[topic.name] = { ...masteryLevels }
    })

    // Count questions by mastery level
    const now = new Date()
    const reviewedQuestionIds = new Set(questionStats.map(stat => stat.questionId))

    // Process reviewed questions
    questionStats.forEach(stat => {
      const topicName = stat.question.topic.name

      if (stat.repetitions >= 3 && stat.easeFactor >= 2.3 && stat.interval >= 21) {
        // Master cards
        masteryLevels.master++
        topicProgress[topicName].master++
      } else if (stat.repetitions >= 3 && stat.easeFactor >= 2.3) {
        // Guru cards
        masteryLevels.guru++
        topicProgress[topicName].guru++
      } else {
        // Still apprentice (includes learning and relearning)
        masteryLevels.apprentice++
        topicProgress[topicName].apprentice++
      }
    })

    // Count new (unseen) questions by topic
    for (const topic of topics) {
      const topicQuestions = await prisma.question.count({
        where: { topicId: topic.id }
      })
      
      const topicReviewed = questionStats.filter(
        stat => stat.question.topicId === topic.id
      ).length
      
      const newInTopic = topicQuestions - topicReviewed
      masteryLevels.new += newInTopic
      topicProgress[topic.name].new = newInTopic
    }

    // Calculate overall progress percentage
    const totalReviewed = questionStats.length
    const progressPercentage = Math.round((totalReviewed / totalQuestions) * 100)
    
    // Calculate mastery percentage (master + guru cards)
    const masteredQuestions = masteryLevels.master + masteryLevels.guru
    const masteryPercentage = totalQuestions > 0 ? Math.round((masteredQuestions / totalQuestions) * 100) : 0

    // Get user's study sessions from the last 7 days for streak calculation
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentSessions = await prisma.studySession.findMany({
      where: {
        userId,
        startedAt: {
          gte: sevenDaysAgo
        }
      },
      include: {
        items: true
      }
    }).catch(() => [])

    // Calculate study streak
    const sessionDates = recentSessions
      .filter(session => session.completedAt)
      .map(session => session.startedAt)
    
    const studyStreak = calculateStreak(sessionDates)

    // Calculate today's study time
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todaySessions = await prisma.studySession.findMany({
      where: {
        userId,
        startedAt: {
          gte: today,
          lt: tomorrow
        },
        completedAt: { not: null }
      }
    }).catch(() => [])

    const todayMinutes = todaySessions.reduce((total, session) => {
      if (session.completedAt && session.startedAt) {
        const diff = session.completedAt.getTime() - session.startedAt.getTime()
        return total + Math.floor(diff / (1000 * 60))
      }
      return total
    }, 0)

    // Generate weekly progress data (questions learned per day)
    const weeklyProgress = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      // Count questions that moved from 'new' to 'learning' or beyond on this day
      // This means questions with timesAnswered = 1 and lastAnswered on this day
      const newlyLearned = await prisma.questionStat.count({
        where: {
          userId,
          timesAnswered: 1,
          lastAnswered: {
            gte: date,
            lt: nextDate
          }
        }
      }).catch(() => 0)

      // Also count questions that reached 'mature' status on this day
      const reachedMature = await prisma.questionStat.count({
        where: {
          userId,
          repetitions: { gte: 3 },
          easeFactor: { gte: 2.3 },
          interval: { gte: 21 },
          lastAnswered: {
            gte: date,
            lt: nextDate
          }
        }
      }).catch(() => 0)

      weeklyProgress.push({
        day: dayNames[date.getDay()],
        learned: newlyLearned,
        mastered: reachedMature,
        total: newlyLearned + reachedMature
      })
    }

    // Calculate cards due for review
    const dueForReview = await prisma.questionStat.count({
      where: {
        userId,
        nextReview: {
          lte: now
        }
      }
    })

    const stats = {
      // Overall progress
      totalQuestions,
      reviewedQuestions: totalReviewed,
      progressPercentage,
      masteryPercentage,
      
      // Mastery breakdown
      masteryLevels,
      
      // Topic-wise progress
      topicProgress,
      
      // Traditional stats
      correctAnswers: questionStats.reduce((sum, stat) => sum + stat.timesCorrect, 0),
      accuracy: totalReviewed > 0 ? Math.round((questionStats.reduce((sum, stat) => sum + stat.timesCorrect, 0) / questionStats.reduce((sum, stat) => sum + stat.timesAnswered, 0)) * 100) : 0,
      
      // Spaced repetition specific
      dueForReview,
      
      // Activity stats
      studyStreak,
      todayMinutes,
      weeklyProgress,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}