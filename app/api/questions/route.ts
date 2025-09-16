import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topicsParam = searchParams.get('topics')
    const mode = searchParams.get('mode') || 'test' // 'test' or 'study'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 25
    
    if (!topicsParam) {
      return NextResponse.json({ error: 'Topics parameter required' }, { status: 400 })
    }

    const requestedTopics = topicsParam.split(',')
    
    // Map frontend topic IDs to database topic names
    const topicMapping: { [key: string]: string } = {
      'business-management': 'Business Management & Administration',
      'entrepreneurship': 'Entrepreneurship',
      'finance': 'Finance',
      'hospitality-tourism': 'Hospitality & Tourism',
      'marketing': 'Marketing',
    }

    const topicNames = requestedTopics.map(topic => topicMapping[topic]).filter(Boolean)
    
    if (topicNames.length === 0) {
      return NextResponse.json({ error: 'No valid topics found' }, { status: 400 })
    }

    // Get user ID (for both modes now, to fetch mastery levels)
    const userId = await getUserFromRequest(request)

    let dbQuestions

    if (mode === 'study' && userId) {
      // Study mode: Use spaced repetition filtering
      const now = new Date()
      
      // Get all questions for selected topics with user stats
      const questionsWithStats = await prisma.question.findMany({
        where: {
          topic: {
            name: {
              in: topicNames
            }
          }
        },
        include: {
          topic: true,
          stats: {
            where: {
              userId: userId
            }
          }
        }
      })

      // Separate questions into categories
      const starredQuestions = []
      const overdueQuestions = []
      const dueQuestions = []
      const newQuestions = []

      for (const q of questionsWithStats) {
        const isStarred = q.stats.length > 0 && q.stats[0].isStarred

        if (q.stats.length === 0) {
          // New question (never answered)
          newQuestions.push(q)
        } else {
          const stat = q.stats[0]

          // Check if starred (starred questions get priority)
          if (isStarred) {
            starredQuestions.push(q)
          } else if (stat.nextReview && stat.nextReview <= now) {
            if (stat.nextReview < new Date(now.getTime() - 24 * 60 * 60 * 1000)) {
              // Overdue (more than 1 day late)
              overdueQuestions.push(q)
            } else {
              // Due today
              dueQuestions.push(q)
            }
          }
        }
      }

      // Combine in priority order: starred > overdue > due > new
      const prioritizedQuestions = [
        ...starredQuestions,
        ...overdueQuestions,
        ...dueQuestions,
        ...newQuestions
      ]

      // Take only the requested limit
      dbQuestions = prioritizedQuestions.slice(0, limit)
      
      console.log(`📚 Study mode: ${starredQuestions.length} starred, ${overdueQuestions.length} overdue, ${dueQuestions.length} due, ${newQuestions.length} new`)
      console.log(`📚 Returning ${dbQuestions.length} questions (limit: ${limit})`)
    } else {
      // Test mode: Get all questions for topics (but still include stats if user is logged in)
      dbQuestions = await prisma.question.findMany({
        where: {
          topic: {
            name: {
              in: topicNames
            }
          }
        },
        include: {
          topic: true,
          stats: userId ? {
            where: {
              userId: userId
            }
          } : false
        }
      })
      
      console.log(`📝 Test mode: Found ${dbQuestions.length} total questions`)
    }

    // Fisher-Yates shuffle algorithm for array with index tracking
    const shuffleArrayWithIndexTracking = (array: string[]) => {
      // Create an array of indices [0, 1, 2, 3]
      const indices = array.map((_, i) => i)
      const shuffled = [...array]

      // Shuffle both the array and track the indices
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        // Swap elements
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        // Swap indices to track where elements moved
        ;[indices[i], indices[j]] = [indices[j], indices[i]]
      }

      return { shuffled, indices }
    }

    // Transform questions to match frontend format
    const questions = dbQuestions.map((q: any) => {
      // Convert letter answer (A, B, C, D) to index (0, 1, 2, 3)
      const letterToIndex = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
      const originalCorrectIndex = letterToIndex[q.correctAnswer as keyof typeof letterToIndex] ?? 0

      // Get the original options array
      const originalOptions = [q.optionA, q.optionB, q.optionC, q.optionD]

      // Shuffle the options and track where each option moved
      const { shuffled: shuffledOptions, indices } = shuffleArrayWithIndexTracking(originalOptions)

      // Find the new position of the correct answer
      const newCorrectIndex = indices.findIndex(idx => idx === originalCorrectIndex)

      // Determine mastery level if user is logged in and has stats
      let masteryLevel: 'new' | 'apprentice' | 'guru' | 'master' = 'new'
      if (userId && q.stats && q.stats.length > 0) {
        const stat = q.stats[0]
        if (stat.repetitions === 0) {
          masteryLevel = 'new'
        } else if (stat.repetitions >= 3 && stat.easeFactor >= 2.3 && stat.interval >= 21) {
          masteryLevel = 'master'
        } else if (stat.repetitions >= 3 && stat.easeFactor >= 2.3) {
          masteryLevel = 'guru'
        } else {
          masteryLevel = 'apprentice'
        }
      }

      return {
        id: q.id,
        question: q.questionText,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex,
        explanation: q.explanation,
        topic: q.topic.name,
        refId: q.refId,
        masteryLevel
      }
    })

    // Shuffle questions
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5)

    console.log(`🎯 Serving ${shuffledQuestions.length} questions in ${mode} mode for topics: ${topicNames.join(', ')}`)

    return NextResponse.json({ questions: shuffledQuestions })
  } catch (error) {
    console.error('Questions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}