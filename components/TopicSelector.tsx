'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'

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
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Study Topics</h2>
        <p className="text-gray-600 text-sm">
          {selectedTopics.length > 0
            ? `${selectedTopics.length} topic${selectedTopics.length !== 1 ? 's' : ''} selected. Click topics to change selection.`
            : 'Choose one or more topics to begin your study session'
          }
        </p>
        {savedTopics && savedTopics.length > 0 && selectedTopics.length > 0 && (
          <div className="mt-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            ✨ Restored your previous topic selection
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {TOPICS.map((topic) => (
          <div
            key={topic.id}
            onClick={() => toggleTopic(topic.id)}
            className={cn(
              'relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm',
              selectedTopics.includes(topic.id)
                ? 'border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-200'
                : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
            )}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTopics.includes(topic.id)}
                onChange={() => {}}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 mr-3"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{topic.name}</h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{topic.description}</p>
              </div>
              <div
                className={cn(
                  'w-3 h-3 rounded-full ml-2 flex-shrink-0',
                  topic.color
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-3">
        <button
          onClick={() => setSelectedTopics(TOPICS.map(t => t.id))}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          All
        </button>
        <button
          onClick={() => setSelectedTopics([])}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          None
        </button>
        <button
          onClick={handleStart}
          disabled={selectedTopics.length === 0}
          className={cn(
            'px-6 py-2 rounded-lg font-semibold text-sm transition-all',
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