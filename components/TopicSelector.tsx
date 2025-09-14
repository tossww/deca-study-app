'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TopicSelectorProps {
  onTopicsSelected: (topics: string[]) => void
}

const TOPICS = [
  {
    id: 'business-management',
    name: 'Business Management & Administration',
    description: 'Learn management principles, organizational structures, and business operations',
    color: 'bg-blue-500',
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    description: 'Master startup strategies, innovation, and business development',
    color: 'bg-green-500',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Understand financial markets, analysis, and investment strategies',
    color: 'bg-yellow-500',
  },
  {
    id: 'hospitality-tourism',
    name: 'Hospitality & Tourism',
    description: 'Explore service industry management and tourism operations',
    color: 'bg-purple-500',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Study marketing strategies, consumer behavior, and promotion',
    color: 'bg-red-500',
  },
]

export function TopicSelector({ onTopicsSelected }: TopicSelectorProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    )
  }

  const handleStart = () => {
    if (selectedTopics.length > 0) {
      onTopicsSelected(selectedTopics)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Select Your Study Topics</h2>
        <p className="text-gray-600">Choose one or more topics to begin your study session</p>
      </div>

      <div className="grid gap-4 mb-8">
        {TOPICS.map((topic) => (
          <div
            key={topic.id}
            onClick={() => toggleTopic(topic.id)}
            className={cn(
              'relative p-6 rounded-xl border-2 cursor-pointer transition-all',
              selectedTopics.includes(topic.id)
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            )}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full mt-1',
                    topic.color,
                    selectedTopics.includes(topic.id) ? 'ring-4 ring-offset-2 ring-primary-500' : ''
                  )}
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
                <p className="text-gray-600 mt-1">{topic.description}</p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic.id)}
                  onChange={() => {}}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleStart}
          disabled={selectedTopics.length === 0}
          className={cn(
            'px-8 py-3 rounded-lg font-semibold transition-all',
            selectedTopics.length > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          Start Study Session ({selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''})
        </button>
      </div>
    </div>
  )
}