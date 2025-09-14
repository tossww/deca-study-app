'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { Quality, suggestGradeFromTime } from '@/lib/spaced-repetition'
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
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionStartTime] = useState(Date.now())
  const [showGradeSelector, setShowGradeSelector] = useState(false)
  const [currentAnswerData, setCurrentAnswerData] = useState<{
    answerIndex: number
    isCorrect: boolean
    responseTimeMs: number
    suggestedGrade: Quality
  } | null>(null)
  const [autoGradeTimer, setAutoGradeTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/questions?' + new URLSearchParams({ topics: topics.join(',') }))
        const data = await response.json()
        setQuestions(data.questions || [])

        // Create study session in database
        if (data.questions && data.questions.length > 0) {
          const { sessionToken } = useStore.getState()
          const sessionResponse = await fetch('/api/study-sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Session-Token': sessionToken || '',
            },
            body: JSON.stringify({
              startedAt: sessionStartTime,
            }),
          })
          const sessionData = await sessionResponse.json()
          setSessionId(sessionData.sessionId)
        }
      } catch (error) {
        toast.error('Failed to load questions')
      }
    }

    loadQuestions()
  }, [topics, sessionStartTime])

  // Timer effect - separate to avoid reloading questions
  useEffect(() => {
    const interval = setInterval(() => {
      // Only increment timer when quit modal is not open
      if (!showQuitModal) {
        setSessionStats((prev) => ({ ...prev, timeSpent: prev.timeSpent + 1 }))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [showQuitModal])

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

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return

    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    const responseTimeMs = Date.now() - questionStartTime
    const isCorrect = answerIndex === questions[currentIndex].correctAnswer

    setSessionStats((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }))

    // Get suggested grade based on response time
    const suggestedGrade = suggestGradeFromTime(responseTimeMs, isCorrect)

    // Store answer data for grade selection
    setCurrentAnswerData({
      answerIndex,
      isCorrect,
      responseTimeMs,
      suggestedGrade,
    })

    // Auto-apply suggested grade after 4 seconds unless user intervenes
    const timer = setTimeout(() => {
      submitAnswer(suggestedGrade)
    }, 4000)
    setAutoGradeTimer(timer)
  }

  const submitAnswer = async (selectedGrade: Quality) => {
    if (!currentAnswerData) return

    const { answerIndex, isCorrect, responseTimeMs } = currentAnswerData

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
          timeSpent: Math.floor(responseTimeMs / 1000),
          quality: selectedGrade,
        }),
      })
    } catch (error) {
      console.error('Failed to save answer:', error)
    }

    // Clear auto-grade timer and answer data
    if (autoGradeTimer) {
      clearTimeout(autoGradeTimer)
      setAutoGradeTimer(null)
    }
    setShowGradeSelector(false)
    setCurrentAnswerData(null)

    // Auto-proceed to next question after a short delay
    setTimeout(() => {
      nextQuestion()
    }, 500)
  }

  const completeSession = async () => {
    if (sessionId) {
      try {
        const { sessionToken } = useStore.getState()
        await fetch('/api/study-sessions', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Token': sessionToken || '',
          },
          body: JSON.stringify({
            sessionId,
            completedAt: Date.now(),
            totalAnswers: sessionStats.total,
            correctAnswers: sessionStats.correct,
          }),
        })
      } catch (error) {
        console.error('Failed to complete session:', error)
      }
    }
  }

  const nextQuestion = async () => {
    // Clear any pending auto-grade timer
    if (autoGradeTimer) {
      clearTimeout(autoGradeTimer)
      setAutoGradeTimer(null)
    }

    // Clear answer data
    setCurrentAnswerData(null)
    setShowGradeSelector(false)

    if (currentIndex + 1 >= questions.length) {
      await completeSession()
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

  const confirmQuit = async () => {
    await completeSession()
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
    <div className="max-w-4xl mx-auto h-screen flex flex-col py-4">
      <div className="bg-white rounded-xl shadow-lg p-6 flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
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
              🚪 Quit
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">{currentQuestion.question}</h3>

          <div className="text-xs text-gray-500 mb-3 flex-shrink-0">
            💡 Tip: Use keyboard shortcuts 1-4 or A-D to answer, Enter/Space for next question
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showExplanation}
                className={cn(
                  'w-full text-left p-3 rounded-lg border-2 transition-all',
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

        <div className="flex-shrink-0 space-y-3 mt-4">
          {/* Inline Feedback Section - Show first */}
          {currentAnswerData && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <span className={cn("font-medium", currentAnswerData.isCorrect ? "text-green-600" : "text-red-600")}>
                  {currentAnswerData.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
                <span className="text-gray-600 text-sm">
                  {(currentAnswerData.responseTimeMs / 1000).toFixed(1)}s
                </span>
                <span className="text-gray-600 text-sm">
                  Score: {sessionStats.correct}/{sessionStats.total}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Auto-applying: <span className="font-medium text-blue-600">{Quality[currentAnswerData.suggestedGrade]}</span>
                </span>
                <button
                  onClick={() => setShowGradeSelector(!showGradeSelector)}
                  className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded hover:border-gray-400 transition-colors"
                >
                  Adjust
                </button>
                {showExplanation && (
                  <button
                    onClick={nextQuestion}
                    className="px-3 py-1 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 transition-colors text-sm ml-2"
                  >
                    {currentIndex + 1 >= questions.length ? 'Finish' : 'Next'}
                  </button>
                )}
              </div>
            </div>

            {/* Grade Selector (only shown when user clicks Adjust) */}
            {showGradeSelector && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="text-xs text-gray-600 mb-2">Override suggested grade:</p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => submitAnswer(Quality.Again)}
                    className="px-2 py-1 text-xs rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    Again
                  </button>
                  <button
                    onClick={() => submitAnswer(Quality.Hard)}
                    className="px-2 py-1 text-xs rounded border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => submitAnswer(Quality.Good)}
                    className="px-2 py-1 text-xs rounded border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => submitAnswer(Quality.Easy)}
                    className="px-2 py-1 text-xs rounded border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    Easy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

          {/* Explanation - Show after feedback */}
          {showExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-slide-up">
              <h4 className="font-semibold text-blue-900 mb-1 text-sm">Explanation</h4>
              <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
            </div>
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