'use client'

import { useState, useEffect } from 'react'
import { TopicSelector } from '@/components/TopicSelector'
import { StudySession } from '@/components/StudySession'
import { StudySessionMobile } from '@/components/StudySessionMobile'
import { Dashboard } from '@/components/Dashboard'
import { Browse } from '@/components/Browse'
import { InfoHelp } from '@/components/InfoHelp'
import { LoginForm } from '@/components/LoginForm'
import { useStore } from '@/lib/store'
import { useMobileDetection } from '@/lib/mobile-utils'

export default function Home() {
  const { user, isLoading, studySessionSize } = useStore()
  const [currentView, setCurrentView] = useState<'dashboard' | 'study' | 'browse' | 'info' | 'login'>('login')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [studyMode, setStudyMode] = useState<'test' | 'study'>('study')
  const isMobile = useMobileDetection()

  useEffect(() => {
    if (user) {
      setCurrentView('dashboard')
    }
  }, [user])

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentView])

  // Scroll to top on initial mount (page refresh)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Determine if we're in active study mode (hide header for both mobile and desktop)
  const isInStudyMode = currentView === 'study' && selectedTopics.length > 0

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className={`bg-white shadow-sm border-b flex-shrink-0 ${isInStudyMode ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 gap-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">D</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900">DECA</span>
            </button>

            <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('study')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                  currentView === 'study'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Study
              </button>

              <div className="relative group">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => setCurrentView('browse')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Browse Questions
                  </button>
                  <button
                    onClick={() => setCurrentView('info')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Help & Info
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={() => {
                      useStore.getState().logout()
                      setCurrentView('login')
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className={`${isInStudyMode ? '' : currentView === 'browse' ? 'flex-1 flex flex-col p-4 sm:p-6 lg:p-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {currentView === 'dashboard' && (
          <Dashboard onStartStudy={() => setCurrentView('study')} />
        )}

        {currentView === 'study' && (
          <div className="max-w-7xl mx-auto">
            {selectedTopics.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg">
                <TopicSelector
                  onTopicsSelected={(topics, mode) => {
                    setSelectedTopics(topics)
                    setStudyMode(mode)
                  }}
                />
              </div>
            ) : (
              isMobile ? (
                <StudySessionMobile
                  topics={selectedTopics}
                  mode={studyMode}
                  limit={studyMode === 'study' ? studySessionSize : undefined}
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
              ) : (
                <StudySession
                  topics={selectedTopics}
                  mode={studyMode}
                  limit={studyMode === 'study' ? studySessionSize : undefined}
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
              )
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