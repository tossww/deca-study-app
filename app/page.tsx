'use client'

import { useState, useEffect } from 'react'
import { TopicSelector } from '@/components/TopicSelector'
import { StudySession } from '@/components/StudySession'
import { Dashboard } from '@/components/Dashboard'
import { Browse } from '@/components/Browse'
import { InfoHelp } from '@/components/InfoHelp'
import { LoginForm } from '@/components/LoginForm'
import { useStore } from '@/lib/store'

export default function Home() {
  const { user, isLoading } = useStore()
  const [currentView, setCurrentView] = useState<'dashboard' | 'study' | 'browse' | 'info' | 'login'>('login')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      setCurrentView('dashboard')
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={() => setCurrentView('dashboard')} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">DECA Study App</h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg ${
                  currentView === 'dashboard'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('study')}
                className={`px-4 py-2 rounded-lg ${
                  currentView === 'study'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Study
              </button>
              <button
                onClick={() => setCurrentView('browse')}
                className={`px-4 py-2 rounded-lg ${
                  currentView === 'browse'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Browse
              </button>
              <button
                onClick={() => setCurrentView('info')}
                className={`px-4 py-2 rounded-lg ${
                  currentView === 'info'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Info
              </button>
              <button
                onClick={() => {
                  useStore.getState().logout()
                  setCurrentView('login')
                }}
                className="px-4 py-2 text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard onStartStudy={() => setCurrentView('study')} />
        )}

        {currentView === 'study' && (
          <div className="max-w-7xl mx-auto">
            {selectedTopics.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg">
                <TopicSelector
                  onTopicsSelected={(topics) => {
                    setSelectedTopics(topics)
                  }}
                />
              </div>
            ) : (
              <StudySession
                topics={selectedTopics}
                onComplete={() => {
                  setSelectedTopics([]) // Clear local state to return to topic selector
                  // Keep store.selectedTopics to remember for next session
                  setCurrentView('dashboard')
                }}
                onQuit={() => {
                  setSelectedTopics([]) // Clear local state to return to topic selector
                  // Keep store.selectedTopics to remember for next session
                  setCurrentView('dashboard')
                }}
              />
            )}
          </div>
        )}

        {currentView === 'browse' && (
          <Browse />
        )}

        {currentView === 'info' && (
          <InfoHelp />
        )}
      </main>
    </div>
  )
}