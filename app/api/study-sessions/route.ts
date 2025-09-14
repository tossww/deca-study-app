import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { startedAt } = await request.json()

    const session = await prisma.studySession.create({
      data: {
        userId,
        startedAt: new Date(startedAt),
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating study session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, completedAt, correctAnswers, totalAnswers } = await request.json()

    // Calculate score as percentage
    const score = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0

    const session = await prisma.studySession.update({
      where: {
        id: sessionId,
        userId // Ensure user can only update their own sessions
      },
      data: {
        completedAt: new Date(completedAt),
        score: score,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing study session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}