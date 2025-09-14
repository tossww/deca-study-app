import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topicsParam = searchParams.get('topics')
    
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

    // Fetch questions from database
    const dbQuestions = await prisma.question.findMany({
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
        topic: q.topic.name
      }
    })

    // Shuffle questions
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5)

    console.log(`🎯 Serving ${shuffledQuestions.length} questions for topics: ${topicNames.join(', ')}`)

    return NextResponse.json({ questions: shuffledQuestions })
  } catch (error) {
    console.error('Questions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}