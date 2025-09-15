'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
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
    gradeNotification,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
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
      {/* Ultra-Minimal Header - Only essential info */}
      <div className="bg-white px-4 py-2 flex justify-between items-center flex-shrink-0 border-b border-gray-100">
        <button
          onClick={handleQuit}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors py-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-center space-x-3 text-xs font-medium text-gray-500">
          <span>Score: {sessionStats.correct}/{sessionStats.total}</span>
          <span>{currentIndex + 1}/{questions.length}</span>
        </div>
      </div>

      {/* Main Content Area - Optimized spacing */}
      <div className="flex-1 flex flex-col px-3 py-2">
        {/* Question - Compact for mobile */}
        <div className="bg-white rounded-lg p-4 mb-2 shadow-sm flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 leading-relaxed mb-2">
            {currentQuestion.question}
          </h2>
          {(currentQuestion.topic || currentQuestion.refId) && (
            <div className="text-xs text-gray-400">
              {currentQuestion.topic}
              {currentQuestion.topic && currentQuestion.refId && ' • '}
              {currentQuestion.refId && `#${currentQuestion.refId}`}
            </div>
          )}
        </div>

        {/* Answer Options - Enhanced mobile touch targets */}
        <div className="space-y-2 mb-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showExplanation}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all touch-manipulation min-h-[60px] flex items-center active:scale-[0.98]',
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
                  {index + 1}.
                </span>
                <span className="text-base">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback Section - Cleaner mobile design */}
        {currentAnswerData && (
          <div className="space-y-3 mt-3">
            {/* Result Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={cn("text-lg font-semibold", currentAnswerData.isCorrect ? "text-green-600" : "text-red-600")}>
                    {currentAnswerData.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                  <div className="text-sm text-gray-500">
                    <span>{(currentAnswerData.responseTimeMs / 1000).toFixed(1)}s</span>
                    <span className="mx-2">•</span>
                    <span className={cn(
                      "font-medium",
                      currentAnswerData.suggestedGrade === Quality.Easy && "text-green-600",
                      currentAnswerData.suggestedGrade === Quality.Good && "text-blue-600",
                      currentAnswerData.suggestedGrade === Quality.Hard && "text-orange-600",
                      currentAnswerData.suggestedGrade === Quality.Again && "text-red-600"
                    )}>
                      {Quality[currentAnswerData.suggestedGrade]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowGradeSelector(!showGradeSelector)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Adjust
                </button>
              </div>

              {/* Grade Selector */}
              {showGradeSelector && (
                <div className="border-t border-gray-200 pt-3 mt-3 relative">
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => submitAnswer(Quality.Again)}
                      className="px-2 py-2 text-sm rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Again
                    </button>
                    <button
                      onClick={() => submitAnswer(Quality.Hard)}
                      className="px-2 py-2 text-sm rounded-lg border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                    >
                      Hard
                    </button>
                    <button
                      onClick={() => submitAnswer(Quality.Good)}
                      className="px-2 py-2 text-sm rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                      Good
                    </button>
                    <button
                      onClick={() => submitAnswer(Quality.Easy)}
                      className="px-2 py-2 text-sm rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Easy
                    </button>
                  </div>
                  {gradeNotification && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-fade-in-up">
                      <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs rounded-full shadow-lg whitespace-nowrap">
                        {gradeNotification}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Next Button - More prominent */}
            {showExplanation && (
              <button
                onClick={nextQuestion}
                className="w-full px-6 py-3.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-base shadow-md active:scale-[0.98]"
              >
                {currentIndex + 1 >= questions.length ? 'Finish' : 'Next Question →'}
              </button>
            )}

            {/* Explanation - Below Next button */}
            {showExplanation && (
              <div className="bg-blue-50 rounded-lg p-3 shadow-sm">
                <h4 className="font-semibold text-blue-900 mb-1.5 text-sm">Explanation</h4>
                <p className="text-blue-800 text-sm leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}
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
                onClick={() => {
                  setShowQuitModal(false)
                  confirmQuit()
                }}
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