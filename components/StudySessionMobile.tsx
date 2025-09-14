'use client'

import { useEffect } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { Quality } from '@/lib/spaced-repetition'
import { useStudySession } from '@/hooks/useStudySession'

interface StudySessionMobileProps {
  topics: string[]
  onComplete: () => void
  onQuit: () => void
}

export function StudySessionMobile({ topics, onComplete, onQuit }: StudySessionMobileProps) {
  const {
    currentQuestion,
    currentIndex,
    questions,
    selectedAnswer,
    showExplanation,
    sessionStats,
    showQuitModal,
    setShowQuitModal,
    showGradeSelector,
    setShowGradeSelector,
    currentAnswerData,
    handleAnswer,
    submitAnswer,
    nextQuestion,
    handleQuit,
    confirmQuit,
    isLoading,
  } = useStudySession({ topics, onComplete, onQuit })

  // Mobile-specific touch gestures
  useEffect(() => {
    let startX = 0
    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches[0]) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaX = endX - startX
      const deltaY = endY - startY

      // Horizontal swipes for navigation
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && showExplanation) {
          // Swipe right for next question
          nextQuestion()
        }
        // Left swipe could be for going back (future feature)
      }

      // Vertical swipe up to show explanation
      if (deltaY < -50 && Math.abs(deltaY) > Math.abs(deltaX) && showExplanation && !showGradeSelector) {
        // This could toggle explanation expansion in future
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [showExplanation, showGradeSelector, nextQuestion])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No questions available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center flex-shrink-0">
        <span className="text-sm font-medium text-gray-700">
          Question {currentIndex + 1}/{questions.length}
        </span>
        <button
          onClick={handleQuit}
          className="px-3 py-1.5 bg-gray-500 text-white hover:bg-gray-600 rounded font-medium transition-colors text-sm"
        >
          Quit
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4">
        {/* Question */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 flex-1">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showExplanation}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all touch-manipulation min-h-[56px] flex items-center',
                showExplanation && index === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : showExplanation && index === selectedAnswer && index !== currentQuestion.correctAnswer
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : selectedAnswer === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50'
              )}
            >
              <div className="flex items-center w-full">
                <span className="font-semibold mr-3 flex-shrink-0 text-gray-600">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-base">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback Section */}
        {currentAnswerData && (
          <div className="bg-white rounded-lg p-4 mt-4 shadow-sm flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3 text-sm">
                <span className={cn("font-medium", currentAnswerData.isCorrect ? "text-green-600" : "text-red-600")}>
                  {currentAnswerData.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
                <span className="text-gray-600">
                  {(currentAnswerData.responseTimeMs / 1000).toFixed(1)}s
                </span>
                <span className="text-gray-600">
                  {sessionStats.correct}/{sessionStats.total}
                </span>
                <span className="font-medium text-blue-600">
                  {Quality[currentAnswerData.suggestedGrade]}
                </span>
                <button
                  onClick={() => setShowGradeSelector(!showGradeSelector)}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded hover:border-gray-400 transition-colors"
                >
                  Adjust
                </button>
              </div>
            </div>

            {/* Grade Selector */}
            {showGradeSelector && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-xs text-gray-600 mb-3">Override grade:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => submitAnswer(Quality.Again)}
                    className="px-3 py-2 text-sm rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors min-h-[44px]"
                  >
                    Again
                  </button>
                  <button
                    onClick={() => submitAnswer(Quality.Hard)}
                    className="px-3 py-2 text-sm rounded border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors min-h-[44px]"
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => submitAnswer(Quality.Good)}
                    className="px-3 py-2 text-sm rounded border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors min-h-[44px]"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => submitAnswer(Quality.Easy)}
                    className="px-3 py-2 text-sm rounded border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors min-h-[44px]"
                  >
                    Easy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 shadow-sm flex-shrink-0">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Explanation</h4>
            <p className="text-blue-800 text-sm leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Time: {formatTime(sessionStats.timeSpent)}
          </div>
          {showExplanation && (
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-base shadow-md min-h-[48px] touch-manipulation"
            >
              {currentIndex + 1 >= questions.length ? 'Finish' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>

      {/* Quit Confirmation Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-xl p-6 w-full max-w-md mx-4 mb-0 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">End Study Session?</h3>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Your progress will be saved.
              </p>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{sessionStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correct:</span>
                    <span className="font-medium text-green-600">{sessionStats.correct}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{formatTime(sessionStats.timeSpent)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowQuitModal(false)}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg font-medium min-h-[48px]"
              >
                Continue
              </button>
              <button
                onClick={confirmQuit}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium min-h-[48px]"
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