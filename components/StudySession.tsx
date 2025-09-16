'use client'

import { useEffect, useState } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { Quality } from '@/lib/spaced-repetition'
import { useStudySession } from '@/hooks/useStudySession'
import { useStore } from '@/lib/store'
import { MasteryIndicator } from './MasteryIndicator'

interface StudySessionProps {
  topics: string[]
  mode: 'test' | 'study'
  limit?: number
  onComplete: () => void
  onQuit: () => void
}

export function StudySession({ topics, mode, limit, onComplete, onQuit }: StudySessionProps) {
  const { cheatingMode, debugMode } = useStore()
  const [showMasteryModal, setShowMasteryModal] = useState(false)
  const [masteryData, setMasteryData] = useState<any>(null)

  const fetchMasteryData = async () => {
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
        setShowMasteryModal(true)
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

  // Get current mastery level from the question data
  const currentMasteryLevel = currentQuestion?.masteryLevel || 'new'

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
        if (e.key === 'i' || e.key === 'I') {
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
        <div className="flex items-center space-x-4">
          <div className={cn(
            "text-xs font-medium px-2 py-1 rounded",
            mode === 'test' ? 'bg-blue-100 text-blue-700' : 'bg-primary-100 text-primary-700'
          )}>
            {mode === 'test' ? 'Test All' : 'Study Mode'}
          </div>
          <div className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </div>
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
        <div className="bg-gray-50 rounded-lg p-4 mb-4 relative">
          <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h2>
          <div className="absolute bottom-2 right-2">
            <MasteryIndicator level={currentMasteryLevel} className="text-[11px]" />
          </div>
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
                  {index + 1}{cheatingMode && index === currentQuestion.correctAnswer ? '' : '.'}
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
                <span className={cn("font-medium text-lg", currentAnswerData.isCorrect ? "text-green-600" : "text-red-600")}>
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
                    className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:border-gray-400 transition-colors"
                  >
                    Adjust
                  </button>
                )}
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

            {/* Grade selector removed - will implement in future */}

            {/* Debug Panel - Mastery Variables */}
            {debugMode && currentAnswerData && (
              <div className="border-t border-gray-200 pt-3 mt-3 bg-yellow-50 rounded-lg p-3">
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
          </div>
        )}

        {showExplanation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
            <p className="text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
            {(currentQuestion.topic || currentQuestion.refId) && (
              <div className="text-xs text-blue-600 border-t border-blue-200 mt-3 pt-3">
                {currentQuestion.topic}
                {currentQuestion.topic && currentQuestion.refId && ' • '}
                {currentQuestion.refId && `Question #${currentQuestion.refId}`}
              </div>
            )}
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