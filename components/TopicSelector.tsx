'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'

interface TopicSelectorProps {
  onTopicsSelected: (topics: string[]) => void
}

const TOPICS = [
  {
    id: 'business-management',
    name: 'Business Management & Administration',
    color: 'bg-blue-500',
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    color: 'bg-green-500',
  },
  {
    id: 'finance',
    name: 'Finance',
    color: 'bg-yellow-500',
  },
  {
    id: 'hospitality-tourism',
    name: 'Hospitality & Tourism',
    color: 'bg-purple-500',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    color: 'bg-red-500',
  },
]

export function TopicSelector({ onTopicsSelected }: TopicSelectorProps) {
  const { selectedTopics: savedTopics, setSelectedTopics: saveTopics } = useStore()
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  useEffect(() => {
    // Initialize with saved topics on mount
    if (savedTopics && savedTopics.length > 0) {
      setSelectedTopics(savedTopics.map(topic => {
        // Convert from topic names to topic IDs if needed
        const topicObj = TOPICS.find(t => t.name === topic || t.id === topic)
        return topicObj?.id || topic
      }))
    }
  }, [savedTopics])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    )
  }

  const handleStart = () => {
    if (selectedTopics.length > 0) {
      saveTopics(selectedTopics) // Save topic IDs to store
      onTopicsSelected(selectedTopics) // Pass topic IDs to parent
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Select Topics</h2>
      </div>

      <div className="grid grid-cols-1 gap-2 mb-4">
        {TOPICS.map((topic) => (
          <div
            key={topic.id}
            onClick={() => toggleTopic(topic.id)}
            className={cn(
              'relative p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all min-h-[48px] flex items-center',
              selectedTopics.includes(topic.id)
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 bg-white'
            )}
          >
            <input
              type="checkbox"
              checked={selectedTopics.includes(topic.id)}
              onChange={() => {}}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 mr-2 sm:mr-3 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">{topic.name}</h3>
            </div>
            <div
              className={cn(
                'w-3 h-3 rounded-full ml-2 flex-shrink-0',
                topic.color
              )}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-2 sm:space-x-3">
        <button
          onClick={() => setSelectedTopics(TOPICS.map(t => t.id))}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          All
        </button>
        <button
          onClick={() => setSelectedTopics([])}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          None
        </button>
        <button
          onClick={handleStart}
          disabled={selectedTopics.length === 0}
          className={cn(
            'px-5 py-2 rounded-lg font-semibold text-sm transition-all',
            selectedTopics.length > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          Start Study ({selectedTopics.length})
        </button>
      </div>
    </div>
  )
}