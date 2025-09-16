'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

type MasteryLevel = 'new' | 'apprentice' | 'guru' | 'master'

interface AnimatedMasteryIndicatorProps {
  level: MasteryLevel
  questionId: string
  className?: string
}

const masteryConfig = {
  new: {
    label: 'New',
    color: 'text-gray-500',
  },
  apprentice: {
    label: 'Apprentice',
    color: 'text-blue-600',
  },
  guru: {
    label: 'Guru',
    color: 'text-purple-600',
  },
  master: {
    label: 'Master',
    color: 'text-amber-600',
  },
}

export function AnimatedMasteryIndicator({ level, questionId, className }: AnimatedMasteryIndicatorProps) {
  const [currentLevel, setCurrentLevel] = useState(level)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showNewLevel, setShowNewLevel] = useState(false)
  const prevQuestionIdRef = useRef(questionId)
  const prevLevelRef = useRef(level)

  useEffect(() => {
    // Check if this is a new question or a level change on the same question
    const isNewQuestion = prevQuestionIdRef.current !== questionId
    const isLevelChange = prevLevelRef.current !== level && !isNewQuestion

    if (isNewQuestion) {
      // New question: immediate change, no animation
      setCurrentLevel(level)
      setShowNewLevel(false)
      setIsAnimating(false)
    } else if (isLevelChange) {
      // Same question, level changed: animate
      setIsAnimating(true)
      setShowNewLevel(false)

      // Start slide-out animation
      setTimeout(() => {
        setCurrentLevel(level)
        setShowNewLevel(true)
      }, 300)

      // End animation
      setTimeout(() => {
        setIsAnimating(false)
      }, 600)
    }

    prevQuestionIdRef.current = questionId
    prevLevelRef.current = level
  }, [level, questionId])

  const config = masteryConfig[currentLevel]

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "inline-flex items-center text-xs font-medium transition-all duration-300",
          config.color,
          isAnimating && !showNewLevel && "opacity-0 translate-x-full",
          isAnimating && showNewLevel && "opacity-100 translate-x-0",
          !isAnimating && "opacity-100"
        )}
      >
        {config.label}
      </div>
    </div>
  )
}