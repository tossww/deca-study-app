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

    // Get user ID for study mode
    const userId = mode === 'study' ? await getUserFromRequest(request) : null

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
      const overdueQuestions = []
      const dueQuestions = []
      const newQuestions = []

      for (const q of questionsWithStats) {
        if (q.stats.length === 0) {
          // New question (never answered)
          newQuestions.push(q)
        } else {
          const stat = q.stats[0]
          if (stat.nextReview && stat.nextReview <= now) {
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

      // Combine in priority order: overdue > due > new
      const prioritizedQuestions = [
        ...overdueQuestions,
        ...dueQuestions,
        ...newQuestions
      ]

      // Take only the requested limit
      dbQuestions = prioritizedQuestions.slice(0, limit)
      
      console.log(`📚 Study mode: ${overdueQuestions.length} overdue, ${dueQuestions.length} due, ${newQuestions.length} new`)
      console.log(`📚 Returning ${dbQuestions.length} questions (limit: ${limit})`)
    } else {
      // Test mode: Get all questions for topics
      dbQuestions = await prisma.question.findMany({
        where: {
          topic: {
            name: {
              in: topicNames
            }
          }
        },
        include: {
          topic: true
        }
      })
      
      console.log(`📝 Test mode: Found ${dbQuestions.length} total questions`)
    }

    // Transform questions to match frontend format
    const questions = dbQuestions.map(q => {
      // Convert letter answer (A, B, C, D) to index (0, 1, 2, 3)
      const letterToIndex = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
      const correctAnswer = letterToIndex[q.correctAnswer as keyof typeof letterToIndex] ?? 0

      return {
        id: q.id,
        question: q.questionText,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer,
        explanation: q.explanation,
        topic: q.topic.name,
        refId: q.refId
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