'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Quality } from '@/lib/spaced-repetition'
import { useStudySession } from '@/hooks/useStudySession'
import { useStore } from '@/lib/store'
import { MasteryIndicator } from './MasteryIndicator'

interface StudySessionMobileProps {
  topics: string[]
  mode: 'test' | 'study'
  limit?: number
  onComplete: () => void
  onQuit: () => void
}

export function StudySessionMobile({ topics, mode, limit, onComplete, onQuit }: StudySessionMobileProps) {
  const { cheatingMode, debugMode } = useStore()
  const [showMasteryModal, setShowMasteryModal] = useState(false)
  const [masteryData, setMasteryData] = useState<any>(null)
  const [currentMasteryLevel, setCurrentMasteryLevel] = useState<'new' | 'apprentice' | 'guru' | 'master'>('new')

  const fetchMasteryData = async (showModal = true) => {
    if (!currentQuestion) return

    try {
      const { sessionToken } = useStore.getState()
      const response = await fetch(`/api/questions/stats?questionId=${currentQuestion.id}`, {
        headers: {
          'X-Session-Token': sessionToken || '',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMasteryData(data)
        setCurrentMasteryLevel(data.masteryLevel || 'new')
        if (showModal) {
          setShowMasteryModal(true)
        }
      }
    } catch (error) {
      console.error('Failed to fetch mastery data:', error)
    }
  }
  
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

  // Fetch mastery level when question changes
  useEffect(() => {
    if (currentQuestion) {
      fetchMasteryData(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion])

  // Update mastery level after answer submission
  useEffect(() => {
    if (showExplanation && currentAnswerData?.submitted) {
      // Fetch updated mastery level after a brief delay to ensure server has processed the answer
      const timer = setTimeout(() => {
        fetchMasteryData(false)
      }, 500)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showExplanation, currentAnswerData?.submitted])

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
        <div className="bg-white rounded-lg p-4 mb-2 shadow-sm flex-shrink-0 relative">
          <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h2>
          <div className="absolute bottom-2 right-2">
            <MasteryIndicator level={currentMasteryLevel} className="text-[10px] px-1.5 py-0.5" />
          </div>
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
                  {index + 1}{cheatingMode && index === currentQuestion.correctAnswer ? '' : '.'}
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
          {/* Grade Selector Overlay removed - will implement in future */}

          {/* Debug Panel - Mastery Variables */}
          {debugMode && currentAnswerData && (
            <div className="fixed left-0 right-0 bg-yellow-50 border-t border-yellow-200 p-3 shadow-lg z-15" style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}>
              <div className="text-xs font-semibold text-yellow-800 mb-2">DEBUG: Mastery Variables</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium text-gray-600">Last Grade:</span>
                  <span className="ml-1 text-gray-800">{currentAnswerData.lastSubmittedGrade ? Quality[currentAnswerData.lastSubmittedGrade] : 'None'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Submitted:</span>
                  <span className="ml-1 text-gray-800">{currentAnswerData.submitted ? 'Yes' : 'No'}</span>
                </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-600">Adjustment History:</span>
                    <span className="ml-1 text-gray-800">
                      {currentAnswerData.adjustmentHistory ? currentAnswerData.adjustmentHistory.map(g => Quality[g]).join(' → ') : 'None'}
                    </span>
                  </div>
                  <div className="col-span-2 mt-2">
                    <button
                      onClick={() => fetchMasteryData()}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Show Mastery Details
                    </button>
                  </div>
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
                {/* Adjust button hidden for now - will implement in future */}
                {false && (
                  <button
                    onClick={() => setShowGradeSelector(!showGradeSelector)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Adjust
                  </button>
                )}
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

      {/* Mastery Details Modal */}
      {showMasteryModal && masteryData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Mastery Details</h3>
                <button
                  onClick={() => setShowMasteryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {masteryData.isNew ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg mb-2">📝</div>
                  <div className="text-gray-600">This is a new question - no mastery data yet</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mastery Level */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Mastery Level</h4>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        masteryData.masteryLevel === 'new' ? 'bg-gray-100 text-gray-700' :
                        masteryData.masteryLevel === 'apprentice' ? 'bg-orange-100 text-orange-700' :
                        masteryData.masteryLevel === 'guru' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {masteryData.masteryLevel.charAt(0).toUpperCase() + masteryData.masteryLevel.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {masteryData.masteryPercentage}% accuracy
                      </span>
                    </div>
                  </div>

                  {/* Basic Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Basic Stats</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Times Answered:</span>
                          <span className="font-medium">{masteryData.questionStat.timesAnswered}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Times Correct:</span>
                          <span className="font-medium text-green-600">{masteryData.questionStat.timesCorrect}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Answered:</span>
                          <span className="font-medium">
                            {masteryData.questionStat.lastAnswered ? 
                              new Date(masteryData.questionStat.lastAnswered).toLocaleDateString() : 
                              'Never'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Spaced Repetition Variables */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Spaced Repetition</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Repetitions:</span>
                          <span className="font-medium">{masteryData.questionStat.repetitions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interval:</span>
                          <span className="font-medium">{masteryData.questionStat.interval} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ease Factor:</span>
                          <span className="font-medium">{masteryData.questionStat.easeFactor.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">State:</span>
                          <span className="font-medium">{masteryData.questionStat.state}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Step:</span>
                          <span className="font-medium">{masteryData.questionStat.currentStep}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lapses:</span>
                          <span className="font-medium">{masteryData.questionStat.lapses}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Review:</span>
                          <span className="font-medium">
                            {masteryData.questionStat.nextReview ? 
                              new Date(masteryData.questionStat.nextReview).toLocaleDateString() : 
                              'Not scheduled'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Question ID:</span>
                          <span className="font-medium text-xs">{masteryData.questionId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Question Info</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ref ID:</span>
                        <span className="font-medium">{masteryData.questionStat.question.refId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Topic:</span>
                        <span className="font-medium">{masteryData.questionStat.question.topic}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}