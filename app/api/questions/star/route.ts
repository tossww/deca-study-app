import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id')
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 })
    }

    const { questionId, isStarred } = await request.json()

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 })
    }

    // Update or create the question stat with the starred status
    const questionStat = await prisma.questionStat.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId: parseInt(questionId)
        }
      },
      update: {
        isStarred: isStarred
      },
      create: {
        userId,
        questionId: parseInt(questionId),
        isStarred: isStarred,
        timesAnswered: 0,
        timesCorrect: 0,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        state: 'new',
        currentStep: 0,
        lapses: 0
      }
    })

    return NextResponse.json({
      success: true,
      isStarred: questionStat.isStarred
    })
  } catch (error) {
    console.error('Error toggling star:', error)
    return NextResponse.json({ error: 'Failed to toggle star' }, { status: 500 })
  }
}