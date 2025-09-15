import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('user-id')

    const questions = await prisma.question.findMany({
      include: {
        topic: true,
        stats: userId ? {
          where: {
            userId: userId
          }
        } : false
      },
      orderBy: [
        { topic: { name: 'asc' } },
        { refId: 'asc' },
        { id: 'asc' }
      ]
    })

    const questionsWithMastery = questions.map(q => {
      const progress = q.stats?.[0]
      let masteryLevel = 0
      let learningStatus: 'new' | 'learning' | 'mature' = 'new'

      if (progress) {
        const totalAttempts = progress.timesAnswered
        if (totalAttempts > 0) {
          masteryLevel = Math.round((progress.timesCorrect / totalAttempts) * 100)
        }

        // Determine learning status based on repetitions and interval
        if (progress.repetitions === 0) {
          learningStatus = 'new'
        } else if (progress.interval < 21) {
          learningStatus = 'learning'
        } else {
          learningStatus = 'mature'
        }
      }

      // Create answer from correct option
      const options = {
        A: q.optionA,
        B: q.optionB,
        C: q.optionC,
        D: q.optionD
      }
      const correctAnswerText = options[q.correctAnswer as keyof typeof options] || q.correctAnswer

      return {
        id: q.id,
        refId: q.refId,
        question: q.questionText,
        answer: `${q.correctAnswer}: ${correctAnswerText}${q.explanation ? ` - ${q.explanation}` : ''}`,
        topic: q.topic.name,
        learningStatus,
        masteryLevel,
        repetitions: progress?.repetitions || 0,
        interval: progress?.interval || 0,
        timesCorrect: progress?.timesCorrect || 0,
        timesAnswered: progress?.timesAnswered || 0
      }
    })

    return NextResponse.json({ questions: questionsWithMastery })
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}