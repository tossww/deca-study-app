'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { Quality } from '@/lib/spaced-repetition'
import { useStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface StudySessionProps {
  topics: string[]
  onComplete: () => void
  onQuit: () => void
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export function StudySession({ topics, onComplete, onQuit }: StudySessionProps) {
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
  const [showQuitModal, setShowQuitModal] = useState(false)

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
      // Only increment timer when quit modal is not open
      if (!showQuitModal) {
        setSessionStats((prev) => ({ ...prev, timeSpent: prev.timeSpent + 1 }))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [topics, showQuitModal])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showExplanation && e.key !== 'Enter' && e.key !== ' ') return

      if (!showExplanation) {
        if (e.key >= '1' && e.key <= '4') {
          const index = parseInt(e.key) - 1
          if (index < questions[currentIndex]?.options.length) {
            handleAnswer(index)
          }
        } else if (e.key.toLowerCase() >= 'a' && e.key.toLowerCase() <= 'd') {
          const index = e.key.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)
          if (index < questions[currentIndex]?.options.length) {
            handleAnswer(index)
          }
        }
      }

      if (showExplanation && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        nextQuestion()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showExplanation, currentIndex, questions])

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

  const handleQuit = () => {
    setShowQuitModal(true)
  }

  const confirmQuit = () => {
    toast.success(`Study session ended. Score: ${sessionStats.correct}/${sessionStats.total}`)
    onQuit()
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
            <button
              onClick={handleQuit}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-semibold transition-colors text-sm shadow-md hover:shadow-lg border-2 border-red-600 hover:border-red-700"
            >
              🚪 Quit Study
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h3>

          <div className="text-xs text-gray-500 mb-4">
            💡 Tip: Use keyboard shortcuts 1-4 or A-D to answer, Enter/Space for next question
          </div>

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
                  <span className="font-semibold mr-3">
                    {String.fromCharCode(65 + index)}.
                    <span className="text-xs text-gray-500">({index + 1})</span>
                  </span>
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

      {/* Quit Confirmation Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">End Study Session?</h3>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to end your current study session? Your progress will be saved.
              </p>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Session Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions Answered:</span>
                    <span className="font-medium">{sessionStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correct Answers:</span>
                    <span className="font-medium text-green-600">{sessionStats.correct}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium">
                      {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Spent:</span>
                    <span className="font-medium">{formatTime(sessionStats.timeSpent)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowQuitModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Continue Studying
              </button>
              <button
                onClick={confirmQuit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}