'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Quality } from '@/lib/spaced-repetition'
import { useStudySession } from '@/hooks/useStudySession'
import { useStore } from '@/lib/store'

interface StudySessionMobileProps {
  topics: string[]
  mode: 'test' | 'study'
  limit?: number
  onComplete: () => void
  onQuit: () => void
}

export function StudySessionMobile({ topics, mode, limit, onComplete, onQuit }: StudySessionMobileProps) {
  const { testMode } = useStore()
  
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
  } = useStudySession({ topics, mode, limit, onComplete, onQuit })

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
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white px-4 py-2 flex justify-between items-center border-b border-gray-100 fixed top-0 left-0 right-0 z-10">
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
          <div className={cn(
            "px-2 py-0.5 rounded",
            mode === 'test' ? 'bg-blue-100 text-blue-700' : 'bg-primary-100 text-primary-700'
          )}>
            {mode === 'test' ? 'Test' : 'Study'}
          </div>
          <span>Score: {sessionStats.correct}/{sessionStats.total}</span>
          <span>{currentIndex + 1}/{questions.length}</span>
        </div>
      </div>

      {/* Content Area with proper spacing for fixed elements */}
      <div className="pt-12" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom) + 20px)' }}>
        <div className="px-3 py-2">
        {/* Question - Clean and focused */}
        <div className="bg-white rounded-lg p-4 mb-2 shadow-sm flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h2>
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
                  {index + 1}{testMode && index === currentQuestion.correctAnswer ? '' : '.'}
                </span>
                <span className="text-base">{option}</span>
              </div>
            </button>
          ))}
        </div>


          {/* Explanation with metadata */}
          {showExplanation && (
            <div className="bg-blue-50 rounded-lg p-3 shadow-sm mt-3 mb-4">
              <h4 className="font-semibold text-blue-900 mb-1.5 text-sm">Explanation</h4>
              <p className="text-blue-800 text-sm leading-relaxed mb-3">{currentQuestion.explanation}</p>
              {(currentQuestion.topic || currentQuestion.refId) && (
                <div className="text-xs text-blue-600 border-t border-blue-200 pt-2">
                  {currentQuestion.topic}
                  {currentQuestion.topic && currentQuestion.refId && ' • '}
                  {currentQuestion.refId && `Question #${currentQuestion.refId}`}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      {currentAnswerData && (
        <>
          {/* Grade Selector Overlay */}
          {showGradeSelector && (
            <div className="fixed left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg animate-slide-up z-20" style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}>
              <div className="text-xs text-gray-500 mb-2">Response time: {(currentAnswerData.responseTimeMs / 1000).toFixed(1)}s</div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => submitAnswer(Quality.Again)}
                  className="px-2 py-3 text-sm rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-medium"
                >
                  Incorrect
                </button>
                <button
                  onClick={() => submitAnswer(Quality.Hard)}
                  className="px-2 py-3 text-sm rounded-lg border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors font-medium"
                >
                  Hard
                </button>
                <button
                  onClick={() => submitAnswer(Quality.Good)}
                  className="px-2 py-3 text-sm rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium"
                >
                  Good
                </button>
                <button
                  onClick={() => submitAnswer(Quality.Easy)}
                  className="px-2 py-3 text-sm rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium"
                >
                  Easy
                </button>
              </div>
            </div>
          )}

          {/* Main Bottom Bar */}
          <div className="fixed left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))', bottom: '0' }}>
            {/* Extra background to ensure coverage */}
            <div className="absolute inset-0 bg-white -z-10" style={{ height: 'calc(100% + 20px)' }}></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={cn(
                  "text-lg font-semibold",
                  currentAnswerData.isCorrect ? "text-green-600" : "text-red-600"
                )}>
                  {currentAnswerData.isCorrect ? "✓" : "✗"}
                </span>
                <span className={cn(
                  "font-semibold",
                  currentAnswerData.suggestedGrade === Quality.Easy && "text-green-600",
                  currentAnswerData.suggestedGrade === Quality.Good && "text-blue-600",
                  currentAnswerData.suggestedGrade === Quality.Hard && "text-orange-600",
                  currentAnswerData.suggestedGrade === Quality.Again && "text-red-600"
                )}>
                  {currentAnswerData.isCorrect ? Quality[currentAnswerData.suggestedGrade] : "Incorrect"}
                </span>
                <button
                  onClick={() => setShowGradeSelector(!showGradeSelector)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Adjust
                </button>
              </div>
              {showExplanation && (
                <button
                  onClick={nextQuestion}
                  className="px-5 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm shadow-sm active:scale-[0.98]"
                >
                  {currentIndex + 1 >= questions.length ? 'Finish' : 'Next →'}
                </button>
              )}
            </div>
          </div>

        </>
      )}

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