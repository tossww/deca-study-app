import { useState, useEffect, useCallback } from 'react'
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
}

interface StudySessionProps {
  topics: string[]
  onComplete: () => void
  onQuit: () => void
}

interface AnswerData {
  answerIndex: number
  isCorrect: boolean
  responseTimeMs: number
  suggestedGrade: Quality
}

export function useStudySession({ topics, onComplete, onQuit }: StudySessionProps) {
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
  const [autoGradeTimer, setAutoGradeTimer] = useState<NodeJS.Timeout | null>(null)
  const [gradeNotification, setGradeNotification] = useState<string | null>(null)

  // Load questions effect
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

  const handleAnswer = useCallback((answerIndex: number) => {
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
    }
    setCurrentAnswerData(answerData)

    // Auto-apply suggested grade after 4 seconds unless user intervenes
    const timer = setTimeout(() => {
      submitAnswer(suggestedGrade)
    }, 4000)
    setAutoGradeTimer(timer)
  }, [showExplanation, questionStartTime, questions, currentIndex])

  const submitAnswer = useCallback(async (selectedGrade: Quality) => {
    if (!currentAnswerData) return

    const { answerIndex, isCorrect, responseTimeMs } = currentAnswerData

    // Update score based on quality selection
    // If user selects "Again", treat as incorrect; otherwise treat as correct
    const treatAsCorrect = selectedGrade !== Quality.Again

    // Adjust the score if grade changes the correctness
    if (isCorrect && !treatAsCorrect) {
      // Was correct, now treating as incorrect (user selected Again)
      setSessionStats((prev) => ({
        ...prev,
        correct: prev.correct - 1,
      }))
    } else if (!isCorrect && treatAsCorrect) {
      // Was incorrect, now treating as correct (user selected Hard/Good/Easy)
      setSessionStats((prev) => ({
        ...prev,
        correct: prev.correct + 1,
      }))
    }

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
          isCorrect: treatAsCorrect, // Use the adjusted correctness
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

    // Show notification
    const gradeLabels = {
      [Quality.Again]: 'Incorrect',
      [Quality.Hard]: 'Hard',
      [Quality.Good]: 'Good',
      [Quality.Easy]: 'Easy'
    }
    setGradeNotification(`Adjusted to ${gradeLabels[selectedGrade]}`)

    // Clear notification after animation
    setTimeout(() => {
      setGradeNotification(null)
    }, 2000)

    // Proceed to next question immediately
    nextQuestion()
  }, [currentAnswerData, autoGradeTimer, questions, currentIndex])

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

    // Scroll to top for new question
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [autoGradeTimer, currentIndex, questions.length, completeSession, sessionStats, onComplete])

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
    autoGradeTimer,
    gradeNotification,

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