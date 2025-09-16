import { useState, useEffect, useCallback, useRef } from 'react'
import { Quality, suggestGradeFromTime } from '@/lib/spaced-repetition'
import { useStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  topic?: string
  refId?: number | null
  masteryLevel?: 'new' | 'apprentice' | 'guru' | 'master'
}

interface StudySessionProps {
  topics: string[]
  mode: 'test' | 'study'
  limit?: number
  onComplete: () => void
  onQuit: () => void
}

interface AnswerData {
  answerIndex: number
  isCorrect: boolean
  responseTimeMs: number
  suggestedGrade: Quality
  submitted?: boolean
  lastSubmittedGrade?: Quality
  adjustmentHistory?: Quality[]
}

export function useStudySession({ topics, mode, limit, onComplete, onQuit }: StudySessionProps) {
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
  const [currentAnswerData, setCurrentAnswerData] = useState<AnswerData | null>(null)
  const nextQuestionRef = useRef<(() => void) | null>(null)
  const submitAnswerRef = useRef<((grade: Quality) => void) | null>(null)

  // Load questions effect
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const params = new URLSearchParams({ 
          topics: topics.join(','),
          mode: mode
        })
        if (limit) {
          params.append('limit', limit.toString())
        }
        const response = await fetch('/api/questions?' + params)
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
  }, [topics, mode, limit, sessionStartTime])

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

  const handleAnswer = useCallback(async (answerIndex: number) => {
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
    const answerData: AnswerData = {
      answerIndex,
      isCorrect,
      responseTimeMs,
      suggestedGrade,
      submitted: false,
    }
    setCurrentAnswerData(answerData)

    // Submit immediately with suggested grade
    try {
      const { sessionToken } = useStore.getState()
      const payload = {
        questionId: questions[currentIndex].id,
        userAnswer: answerIndex,
        isCorrect: suggestedGrade !== Quality.Again, // Treat as correct unless it's "Again"
        timeSpent: Math.floor(responseTimeMs / 1000),
        quality: suggestedGrade,
      }

      const response = await fetch('/api/questions/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken || '',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`API error: ${result.error || 'Unknown error'}`)
      }

      // Update mastery level in the current question
      if (questions[currentIndex].masteryLevel !== undefined) {
        const updatedQuestions = [...questions]
        const currentLevel = updatedQuestions[currentIndex].masteryLevel || 'new'

        // Simple progression/regression logic for immediate visual feedback
        if (isCorrect) {
          // Progress on correct answer
          if (currentLevel === 'new') {
            updatedQuestions[currentIndex].masteryLevel = 'apprentice'
          } else if (currentLevel === 'apprentice' && suggestedGrade >= Quality.Good) {
            updatedQuestions[currentIndex].masteryLevel = 'guru'
          } else if (currentLevel === 'guru' && suggestedGrade === Quality.Easy) {
            updatedQuestions[currentIndex].masteryLevel = 'master'
          }
        } else {
          // Regress on incorrect answer
          if (currentLevel === 'master') {
            updatedQuestions[currentIndex].masteryLevel = 'guru'
          } else if (currentLevel === 'guru') {
            updatedQuestions[currentIndex].masteryLevel = 'apprentice'
          } else if (currentLevel === 'apprentice') {
            updatedQuestions[currentIndex].masteryLevel = 'new'
          }
        }

        setQuestions(updatedQuestions)
      }

      // Mark as submitted with the grade used
      setCurrentAnswerData(prev => prev ? {
        ...prev,
        submitted: true,
        lastSubmittedGrade: suggestedGrade,
        adjustmentHistory: [suggestedGrade]
      } : null)
    } catch (error) {
      console.error('Failed to save answer:', error)
      toast.error('Failed to save answer')
    }
  }, [showExplanation, questionStartTime, questions, currentIndex])

  const submitAnswer = useCallback(async (selectedGrade: Quality) => {
    console.log('submitAnswer called with grade:', selectedGrade)
    if (!currentAnswerData) {
      console.log('No currentAnswerData, returning')
      return
    }

    const { answerIndex, isCorrect, responseTimeMs, suggestedGrade, lastSubmittedGrade, adjustmentHistory } = currentAnswerData

    // Check if this is an adjustment (not the first submission)
    const isAdjustment = !!lastSubmittedGrade
    const treatAsCorrect = selectedGrade !== Quality.Again

    // Adjust session stats based on the change
    if (isAdjustment && lastSubmittedGrade) {
      const previousCorrect = (lastSubmittedGrade as Quality) !== Quality.Again
      
      if (previousCorrect && !treatAsCorrect) {
        // Was correct, now treating as incorrect
        setSessionStats((prev) => ({
          ...prev,
          correct: prev.correct - 1,
        }))
      } else if (!previousCorrect && treatAsCorrect) {
        // Was incorrect, now treating as correct
        setSessionStats((prev) => ({
          ...prev,
          correct: prev.correct + 1,
        }))
      }
      // If both are correct or both are incorrect, no score change needed
    }

    try {
      const { sessionToken } = useStore.getState()
      const payload = {
        questionId: questions[currentIndex].id,
        userAnswer: answerIndex,
        isCorrect: treatAsCorrect,
        timeSpent: Math.floor(responseTimeMs / 1000),
        quality: selectedGrade,
      }

      const response = await fetch('/api/questions/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken || '',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`API error: ${result.error || 'Unknown error'}`)
      }

      // Update the answer data with the new submission
      setCurrentAnswerData(prev => prev ? {
        ...prev,
        submitted: true,
        lastSubmittedGrade: selectedGrade,
        adjustmentHistory: [...(adjustmentHistory || []), selectedGrade]
      } : null)
    } catch (error) {
      console.error('Failed to save answer:', error)
      toast.error('Failed to save answer')
      // Don't proceed to next question if save failed
      return
    }

    // Hide grade selector after adjustment
    setShowGradeSelector(false)
  }, [currentAnswerData, questions, currentIndex])

  const completeSession = useCallback(async () => {
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
  }, [sessionId, sessionStats])

  const nextQuestion = useCallback(async () => {

    // Clear answer data
    setCurrentAnswerData(null)
    setShowGradeSelector(false)

    if (currentIndex + 1 >= questions.length) {
      await completeSession()
      const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0
      
      if (mode === 'test') {
        toast.success(`Test complete! Score: ${sessionStats.correct}/${sessionStats.total} (${accuracy}%)`)
      } else {
        toast.success(`Study session complete! Reviewed ${sessionStats.total} questions (${accuracy}% correct)`)
      }
      
      onComplete()
      return
    }

    setCurrentIndex(currentIndex + 1)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuestionStartTime(Date.now())

    // Scroll to top for new question
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentIndex, questions.length, completeSession, sessionStats, onComplete, mode])

  // Store callbacks in refs to avoid circular dependencies
  useEffect(() => {
    nextQuestionRef.current = nextQuestion
  }, [nextQuestion])

  useEffect(() => {
    submitAnswerRef.current = submitAnswer
  }, [submitAnswer])

  const handleQuit = useCallback(() => {
    setShowQuitModal(true)
  }, [])

  const confirmQuit = useCallback(async () => {
    await completeSession()
    toast.success(`Study session ended. Score: ${sessionStats.correct}/${sessionStats.total}`)
    onQuit()
  }, [completeSession, sessionStats, onQuit])

  const currentQuestion = questions[currentIndex] || null

  return {
    // State
    questions,
    currentIndex,
    currentQuestion,
    selectedAnswer,
    showExplanation,
    sessionStats,
    showQuitModal,
    setShowQuitModal,
    showGradeSelector,
    setShowGradeSelector,
    currentAnswerData,

    // Actions
    handleAnswer,
    submitAnswer,
    nextQuestion,
    handleQuit,
    confirmQuit,

    // Computed
    isLoading: questions.length === 0,
  }
}