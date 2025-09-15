'use client'

import { useEffect, useState } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { Quality } from '@/lib/spaced-repetition'
import { useStudySession } from '@/hooks/useStudySession'

interface StudySessionProps {
  topics: string[]
  onComplete: () => void
  onQuit: () => void
}

export function StudySession({ topics, onComplete, onQuit }: StudySessionProps) {

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

  // Keyboard shortcuts for desktop version
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showExplanation && e.key !== 'Enter' && e.key !== ' ') return

      if (!showExplanation && currentQuestion) {
        if (e.key >= '1' && e.key <= '4') {
          const index = parseInt(e.key) - 1
          if (index < currentQuestion.options.length) {
            handleAnswer(index)
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          nextQuestion()
        }

        // Grade override shortcuts
        if (e.key === 'a' || e.key === 'A') {
          submitAnswer(Quality.Again)
        } else if (e.key === 'h' || e.key === 'H') {
          submitAnswer(Quality.Hard)
        } else if (e.key === 'g' || e.key === 'G') {
          submitAnswer(Quality.Good)
        } else if (e.key === 'e' || e.key === 'E') {
          submitAnswer(Quality.Easy)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showExplanation, currentQuestion, handleAnswer, nextQuestion, submitAnswer])

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">No questions available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Score: {sessionStats.correct}/{sessionStats.total}
          </div>
          <button
            onClick={handleQuit}
            className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 rounded font-medium transition-colors"
          >
            Quit
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showExplanation}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all',
                showExplanation && index === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : showExplanation && index === selectedAnswer && index !== currentQuestion.correctAnswer
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : selectedAnswer === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="flex items-center">
                <span className="font-semibold mr-3 flex-shrink-0 text-gray-600">
                  {index + 1}.
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {currentAnswerData && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={cn("font-medium", currentAnswerData.isCorrect ? "text-green-600" : "text-red-600")}>
                  {currentAnswerData.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
                <span className="text-gray-600 text-sm">
                  {(currentAnswerData.responseTimeMs / 1000).toFixed(1)}s
                </span>
                <span className={cn("text-sm font-medium",
                  currentAnswerData.suggestedGrade === Quality.Again ? "text-red-600" :
                  currentAnswerData.suggestedGrade === Quality.Hard ? "text-orange-600" :
                  currentAnswerData.suggestedGrade === Quality.Good ? "text-blue-600" :
                  "text-green-600"
                )}>
                  {Quality[currentAnswerData.suggestedGrade]}
                </span>
                <button
                  onClick={() => setShowGradeSelector(!showGradeSelector)}
                  className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:border-gray-400 transition-colors"
                >
                  Adjust
                </button>
              </div>
              {showExplanation && (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  {currentIndex + 1 >= questions.length ? 'Finish' : 'Continue →'}
                </button>
              )}
            </div>

            {showGradeSelector && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-sm text-gray-600 mb-3">Override suggested grade:</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => submitAnswer(Quality.Again)}
                    className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    Again
                  </button>
                  <button
                    onClick={() => submitAnswer(Quality.Hard)}
                    className="px-4 py-2 rounded border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => submitAnswer(Quality.Good)}
                    className="px-4 py-2 rounded border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => submitAnswer(Quality.Easy)}
                    className="px-4 py-2 rounded border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                  >
                    Easy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showExplanation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
            <p className="text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {showQuitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">End Study Session?</h3>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Your progress will be saved.
              </p>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
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

            <div className="flex space-x-3">
              <button
                onClick={() => setShowQuitModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg font-medium"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setShowQuitModal(false)
                  confirmQuit()
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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