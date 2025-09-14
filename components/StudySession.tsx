'use client'

import { useState, useEffect } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { Quality } from '@/lib/spaced-repetition'
import { useStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface StudySessionProps {
  topics: string[]
  onComplete: () => void
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export function StudySession({ topics, onComplete }: StudySessionProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    timeSpent: 0,
  })
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/questions?' + new URLSearchParams({ topics: topics.join(',') }))
        const data = await response.json()
        setQuestions(data.questions || [])
      } catch (error) {
        toast.error('Failed to load questions')
      }
    }
    
    loadQuestions()
    const interval = setInterval(() => {
      setSessionStats((prev) => ({ ...prev, timeSpent: prev.timeSpent + 1 }))
    }, 1000)
    return () => clearInterval(interval)
  }, [topics])

  const handleAnswer = async (answerIndex: number) => {
    if (showExplanation) return
    
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    const isCorrect = answerIndex === questions[currentIndex].correctAnswer
    
    setSessionStats((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }))

    const quality = isCorrect ? Quality.Good : Quality.Again
    
    try {
      const { sessionToken } = useStore.getState()
      await fetch('/api/questions/answer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken || '',
        },
        body: JSON.stringify({
          questionId: questions[currentIndex].id,
          userAnswer: answerIndex,
          isCorrect,
          timeSpent,
          quality,
        }),
      })
    } catch (error) {
      console.error('Failed to save answer:', error)
    }
  }

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      toast.success(`Session complete! Score: ${sessionStats.correct}/${sessionStats.total}`)
      onComplete()
      return
    }
    
    setCurrentIndex(currentIndex + 1)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuestionStartTime(Date.now())
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">Time: {formatTime(sessionStats.timeSpent)}</span>
            <span className="text-green-600 font-semibold">
              {sessionStats.correct}/{sessionStats.total} Correct
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showExplanation}
                className={cn(
                  'w-full text-left p-4 rounded-lg border-2 transition-all',
                  showExplanation && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : showExplanation && index === selectedAnswer && index !== currentQuestion.correctAnswer
                    ? 'border-red-500 bg-red-50'
                    : selectedAnswer === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex items-center">
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-slide-up">
            <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
            <p className="text-blue-800">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {showExplanation && (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {currentIndex + 1 >= questions.length ? 'Finish Session' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}