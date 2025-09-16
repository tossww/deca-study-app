import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('questionId')

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 })
    }

    // Get user ID from session token
    const userId = await getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get question stat for this user and question
    const questionStat = await prisma.questionStat.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId: parseInt(questionId),
        },
      },
      include: {
        question: {
          include: {
            topic: true
          }
        }
      }
    })

    // Calculate mastery level
    let masteryLevel: 'new' | 'apprentice' | 'guru' | 'master' = 'new'
    let masteryPercentage = 0

    if (questionStat) {
      // Calculate mastery percentage
      if (questionStat.timesAnswered > 0) {
        masteryPercentage = Math.round((questionStat.timesCorrect / questionStat.timesAnswered) * 100)
      }

      // Determine mastery level based on spaced repetition criteria
      if (questionStat.repetitions === 0) {
        masteryLevel = 'new'
      } else if (questionStat.repetitions >= 3 && questionStat.easeFactor >= 2.3 && questionStat.interval >= 21) {
        masteryLevel = 'master'
      } else if (questionStat.repetitions >= 3 && questionStat.easeFactor >= 2.3) {
        masteryLevel = 'guru'
      } else {
        masteryLevel = 'apprentice'
      }
    }

    const stats = {
      questionId,
      questionStat: questionStat ? {
        // Basic stats
        timesAnswered: questionStat.timesAnswered,
        timesCorrect: questionStat.timesCorrect,
        lastAnswered: questionStat.lastAnswered,
        
        // Spaced repetition variables
        repetitions: questionStat.repetitions,
        interval: questionStat.interval,
        easeFactor: questionStat.easeFactor,
        state: questionStat.state,
        currentStep: questionStat.currentStep,
        lapses: questionStat.lapses,
        
        // Dates
        nextReview: questionStat.nextReview,
        lastReviewDate: questionStat.lastReviewDate,
        
        // Question info
        question: {
          refId: questionStat.question.refId,
          topic: questionStat.question.topic.name
        }
      } : null,
      
      // Calculated values
      masteryLevel,
      masteryPercentage,
      isNew: !questionStat
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('❌ Question stats fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
