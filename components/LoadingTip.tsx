'use client'

import { useEffect, useState } from 'react'
import { getRandomTip, StudyTip } from '@/lib/study-tips'

interface LoadingTipProps {
  message?: string
  category?: StudyTip['category']
}

export function LoadingTip({ message = 'Loading questions...', category }: LoadingTipProps) {
  const [tip, setTip] = useState<StudyTip | null>(null)

  useEffect(() => {
    setTip(getRandomTip(category))
  }, [category])

  if (!tip) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-8"></div>

      <div className="max-w-md text-center space-y-4">
        <p className="text-gray-500 text-sm">{message}</p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="text-3xl mb-3">{tip.icon}</div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">{tip.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{tip.content}</p>
        </div>

        <p className="text-xs text-gray-400 italic">Tip #{tip.id}</p>
      </div>
    </div>
  )
}

interface QuickTipProps {
  duration?: number
  onComplete: () => void
}

export function QuickTip({ duration = 3000, onComplete }: QuickTipProps) {
  const [tip, setTip] = useState<StudyTip | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setTip(getRandomTip())

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          onComplete()
          return 100
        }
        return prev + (100 / (duration / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  if (!tip) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-50">
      <div className="max-w-lg w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-4">{tip.icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{tip.title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{tip.content}</p>

          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={onComplete}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}