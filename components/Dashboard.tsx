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
      apprentice: 0,
      guru: 0,
      master: 0,
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
    apprentice: '#f59e0b', // Orange - Apprentice
    guru: '#3b82f6',       // Blue - Guru
    master: '#10b981',     // Green - Master
  }

  const masteryLabels = {
    new: 'New',
    apprentice: 'Apprentice',
    guru: 'Guru',
    master: 'Master',
  }

  const masteryData = stats?.masteryLevels ? Object.entries(stats.masteryLevels).map(([key, value]) => ({
    name: masteryLabels[key as keyof typeof masteryLabels],
    value: value as number,
    color: masteryColors[key as keyof typeof masteryColors]
  })).filter(item => item.value > 0) : []

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
            Start Study
          </button>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Overall Progress</div>
            <div className="text-2xl font-bold text-primary-600">{stats?.progressPercentage || 0}%</div>
            <div className="text-xs text-gray-500">{stats?.reviewedQuestions || 0} of {stats?.totalQuestions || 0} questions</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Study Streak</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.studyStreak || 0}</p>
              <p className="text-sm text-gray-500">days</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Mastery Level</p>
              <p className="text-3xl font-bold text-green-600">{stats?.masteryPercentage || 0}%</p>
              <p className="text-sm text-gray-500">master + guru</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Accuracy</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.accuracy || 0}%</p>
              <p className="text-sm text-gray-500">correct</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today&apos;s Study Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.todayMinutes || 0}</p>
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
                    stroke="none"
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
              {stats?.masteryLevels ? Object.entries(stats.masteryLevels).map(([key, value]) => (
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
              )) : null}
            </div>
          </div>
          
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Learning Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.weeklyProgress || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${value} questions`,
                  name === 'learned' ? 'Newly Learned' : name === 'mastered' ? 'Reached Mastery' : 'Total'
                ]}
              />
              <Bar dataKey="learned" stackId="a" fill="#3b82f6" name="learned" />
              <Bar dataKey="mastered" stackId="a" fill="#10b981" name="mastered" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
              <span className="text-gray-600">New Questions Learned</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              <span className="text-gray-600">Questions Mastered</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            Total: {stats?.weeklyProgress?.reduce((sum: number, day: any) => sum + (day.total || 0), 0) || 0} questions learned this week
          </p>
        </div>
      </div>

      {/* Topic Progress */}
      {stats?.topicProgress && Object.keys(stats.topicProgress).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Progress by Topic</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.topicProgress).map(([topicName, progress]: [string, any]) => {
              const total = Object.values(progress).reduce((sum: number, val: any) => sum + val, 0)
              const mastered = (progress.master || 0) + (progress.guru || 0)
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
                      <span>{progress.new || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-500">Apprentice:</span>
                      <span>{progress.apprentice || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-500">Guru:</span>
                      <span>{progress.guru || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-500">Master:</span>
                      <span>{progress.master || 0}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}