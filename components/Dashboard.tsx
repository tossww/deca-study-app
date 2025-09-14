'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { calculateStreak } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DashboardProps {
  onStartStudy: () => void
}

export function Dashboard({ onStartStudy }: DashboardProps) {
  const { user } = useStore()
  const [stats, setStats] = useState({
    totalQuestions: 500,
    reviewedQuestions: 0,
    progressPercentage: 0,
    masteryPercentage: 0,
    masteryLevels: {
      new: 500,
      learning: 0,
      young: 0,
      mature: 0,
      relearning: 0,
    },
    topicProgress: {} as any,
    correctAnswers: 0,
    accuracy: 0,
    dueForReview: 0,
    studyStreak: 0,
    todayMinutes: 0,
    weeklyProgress: [] as any[],
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { sessionToken } = useStore.getState()
      const response = await fetch('/api/stats', {
        headers: {
          'X-Session-Token': sessionToken || '',
        }
      })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const masteryColors = {
    new: '#94a3b8',        // Gray - New
    learning: '#f59e0b',    // Orange - Learning
    young: '#3b82f6',      // Blue - Young
    mature: '#10b981',     // Green - Mature
    relearning: '#ef4444', // Red - Relearning
  }

  const masteryLabels = {
    new: 'New',
    learning: 'Learning',
    young: 'Young',
    mature: 'Mature', 
    relearning: 'Relearning',
  }

  const masteryData = Object.entries(stats.masteryLevels).map(([key, value]) => ({
    name: masteryLabels[key as keyof typeof masteryLabels],
    value: value as number,
    color: masteryColors[key as keyof typeof masteryColors]
  })).filter(item => item.value > 0)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.email}!</h2>
        <p className="text-gray-600 mb-4">Continue your DECA exam preparation journey</p>
        
        <div className="flex items-center justify-between">
          <button
            onClick={onStartStudy}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            {stats.dueForReview > 0 ? `Review ${stats.dueForReview} Cards` : 'Start Study Session'}
          </button>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Overall Progress</div>
            <div className="text-2xl font-bold text-primary-600">{stats.progressPercentage}%</div>
            <div className="text-xs text-gray-500">{stats.reviewedQuestions} of {stats.totalQuestions} questions</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Study Streak</p>
              <p className="text-3xl font-bold text-gray-900">{stats.studyStreak}</p>
              <p className="text-sm text-gray-500">days</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Mastery Level</p>
              <p className="text-3xl font-bold text-green-600">{stats.masteryPercentage}%</p>
              <p className="text-sm text-gray-500">mature + young</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Accuracy</p>
              <p className="text-3xl font-bold text-gray-900">{stats.accuracy}%</p>
              <p className="text-sm text-gray-500">correct</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today&apos;s Study Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayMinutes}</p>
              <p className="text-sm text-gray-500">minutes</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mastery Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Mastery Breakdown</h3>
          <div className="flex items-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={masteryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {masteryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-6 space-y-2">
              {Object.entries(stats.masteryLevels).map(([key, value]) => (
                value > 0 && (
                  <div key={key} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-2" 
                      style={{ backgroundColor: masteryColors[key as keyof typeof masteryColors] }}
                    />
                    <span className="text-sm">
                      <strong>{masteryLabels[key as keyof typeof masteryLabels]}:</strong> {value} cards
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">🆕 New: Never studied</p>
              <p className="text-gray-600">📚 Learning: Still memorizing</p>
            </div>
            <div>
              <p className="text-gray-600">🔵 Young: Recent mastery (&lt;21d)</p>
              <p className="text-gray-600">🟢 Mature: Long-term retention (≥21d)</p>
              <p className="text-gray-600">🔴 Relearning: Need review</p>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} cards`, 'Cards Studied']} />
              <Bar dataKey="questions" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic Progress */}
      {Object.keys(stats.topicProgress).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Progress by Topic</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.topicProgress).map(([topicName, progress]: [string, any]) => {
              const total = Object.values(progress).reduce((sum: number, val: any) => sum + val, 0)
              const mastered = progress.mature + progress.young
              const masteryPercent = total > 0 ? Math.round((mastered / total) * 100) : 0
              
              return (
                <div key={topicName} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">{topicName}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Mastery:</span>
                      <span className="font-bold text-green-600">{masteryPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">New:</span>
                      <span>{progress.new}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-500">Learning:</span>
                      <span>{progress.learning}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-500">Mature:</span>
                      <span>{progress.mature}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Study Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🎯</span>
            <div>
              <p className="font-semibold text-gray-900">Focus on due cards first</p>
              <p className="text-gray-600">Review overdue cards to maintain your memory strength</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">📈</span>
            <div>
              <p className="font-semibold text-gray-900">Consistent daily practice</p>
              <p className="text-gray-600">Short daily sessions are more effective than long cramming sessions</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔄</span>
            <div>
              <p className="font-semibold text-gray-900">Don&apos;t skip difficult cards</p>
              <p className="text-gray-600">Struggling cards need more repetition to reach mastery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}