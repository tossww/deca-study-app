import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { calculateNextReview, Quality } from '@/lib/spaced-repetition'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

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

    const now = new Date()
    
    if (!questionStat) {
      // Create new question stat
      console.log(`➕ Creating new question stat for user ${userId}, question ${questionId}`)
      
      const nextReview = calculateNextReview(
        { easeFactor: 2.5, interval: 1, repetitions: 0 },
        quality as Quality
      )
      
      questionStat = await prisma.questionStat.create({
        data: {
          userId,
          questionId,
          timesAnswered: 1,
          timesCorrect: isCorrect ? 1 : 0,
          lastAnswered: now,
          nextReview: nextReview.nextReviewDate,
          easeFactor: nextReview.easeFactor,
          interval: nextReview.interval,
          repetitions: nextReview.repetitions,
        },
      })
      
      console.log(`✅ Created question stat: ${questionStat.id}`)
    } else {
      // Update existing question stat
      console.log(`🔄 Updating existing question stat: ${questionStat.id}`)
      
      const nextReview = calculateNextReview(
        {
          easeFactor: questionStat.easeFactor,
          interval: questionStat.interval,
          repetitions: questionStat.repetitions,
        },
        quality as Quality
      )
      
      questionStat = await prisma.questionStat.update({
        where: {
          userId_questionId: {
            userId,
            questionId,
          },
        },
        data: {
          timesAnswered: questionStat.timesAnswered + 1,
          timesCorrect: isCorrect ? questionStat.timesCorrect + 1 : questionStat.timesCorrect,
          lastAnswered: now,
          nextReview: nextReview.nextReviewDate,
          easeFactor: nextReview.easeFactor,
          interval: nextReview.interval,
          repetitions: nextReview.repetitions,
        },
      })
      
      console.log(`✅ Updated question stat - Total answered: ${questionStat.timesAnswered}, Correct: ${questionStat.timesCorrect}`)
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