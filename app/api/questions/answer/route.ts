import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { calculateNextReview, Quality, AnkiScheduler, CardState, CardData } from '@/lib/spaced-repetition'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()
const ankiScheduler = new AnkiScheduler()

// Helper function to convert database record to CardData
function questionStatToCardData(stat: any): CardData {
  return {
    id: stat.id,
    userId: stat.userId,
    questionId: stat.questionId,
    timesAnswered: stat.timesAnswered,
    timesCorrect: stat.timesCorrect,
    lastAnswered: stat.lastAnswered,
    nextReview: stat.nextReview,
    easeFactor: stat.easeFactor,
    interval: stat.interval,
    repetitions: stat.repetitions,
    state: (stat.state || 'new') as CardState,
    currentStep: stat.currentStep || 0,
    lapses: stat.lapses || 0,
    lastReviewDate: stat.lastReviewDate,
  }
}

// Helper function to convert CardData back to database update
function cardDataToUpdateData(card: CardData) {
  return {
    timesAnswered: card.timesAnswered,
    timesCorrect: card.timesCorrect,
    lastAnswered: card.lastAnswered,
    nextReview: card.nextReview,
    easeFactor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
    state: card.state,
    currentStep: card.currentStep,
    lapses: card.lapses,
    lastReviewDate: card.lastReviewDate,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { questionId, userAnswer, isCorrect, timeSpent, quality } = await request.json()
    
    console.log(`📝 Answer submission: questionId=${questionId}, isCorrect=${isCorrect}`)
    
    // Get user ID from session token
    const userId = await getUserFromRequest(request)
    
    if (!userId) {
      console.log('❌ Unauthorized request - no valid session token')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`👤 User ID: ${userId}`)

    // Verify question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    })

    if (!question) {
      console.log(`❌ Question not found: ${questionId}`)
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Find or create question stat
    let questionStat = await prisma.questionStat.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    })

    if (!questionStat) {
      // Create new question stat with Anki defaults
      console.log(`➕ Creating new question stat for user ${userId}, question ${questionId}`)

      // Create initial card data for new card
      const initialCardData: CardData = {
        id: '', // Will be set after creation
        userId,
        questionId,
        timesAnswered: 0,
        timesCorrect: 0,
        lastAnswered: null,
        nextReview: null,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        state: CardState.NEW,
        currentStep: 0,
        lapses: 0,
        lastReviewDate: null,
      }

      // Use Anki scheduler to process the answer
      const schedulingResult = ankiScheduler.schedule(initialCardData, quality as Quality, timeSpent)

      questionStat = await prisma.questionStat.create({
        data: {
          userId,
          questionId,
          ...cardDataToUpdateData(initialCardData),
        },
      })

      console.log(`✅ Created question stat: ${questionStat.id} - State: ${schedulingResult.toState}`)
    } else {
      // Update existing question stat using Anki algorithm
      console.log(`🔄 Updating existing question stat: ${questionStat.id}`)

      // Convert to CardData format
      const cardData = questionStatToCardData(questionStat)

      // Use Anki scheduler to process the answer
      const schedulingResult = ankiScheduler.schedule(cardData, quality as Quality, timeSpent)

      questionStat = await prisma.questionStat.update({
        where: {
          userId_questionId: {
            userId,
            questionId,
          },
        },
        data: cardDataToUpdateData(cardData),
      })

      console.log(`✅ Updated question stat - State: ${schedulingResult.fromState} → ${schedulingResult.toState}`)
      console.log(`📊 Interval: ${schedulingResult.prevInterval}d → ${schedulingResult.nextInterval}d`)
      console.log(`🎯 Applied: ${schedulingResult.details.applied.join(', ')}`)
    }

    return NextResponse.json({ 
      success: true, 
      stats: {
        timesAnswered: questionStat.timesAnswered,
        timesCorrect: questionStat.timesCorrect,
        nextReview: questionStat.nextReview
      }
    })
  } catch (error) {
    console.error('❌ Answer save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}