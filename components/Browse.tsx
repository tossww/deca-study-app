'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'

interface Question {
  id: number
  refId: number | null
  question: string
  answer: string
  topic: string
  learningStatus: 'new' | 'learning' | 'mature'
  masteryLevel?: number
  repetitions: number
  interval: number
  timesCorrect: number
  timesAnswered: number
}

export function Browse() {
  const { user } = useStore()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showAnswers, setShowAnswers] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [topicFilter, setTopicFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions/all', {
        headers: {
          'user-id': user?.id || ''
        }
      })
      const data = await response.json()
      setQuestions(data.questions)
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'learning':
        return 'bg-yellow-100 text-yellow-800'
      case 'mature':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredQuestions = questions.filter(q => {
    if (!q || !q.question || !q.answer || !q.topic) return false

    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = topicFilter === 'all' || q.topic === topicFilter
    const matchesStatus = statusFilter === 'all' || q.learningStatus === statusFilter

    return matchesSearch && matchesTopic && matchesStatus
  })

  const uniqueTopics = Array.from(new Set(questions.filter(q => q && q.topic).map(q => q.topic)))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search questions, answers, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Topics</option>
            {uniqueTopics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="learning">Learning</option>
            <option value="mature">Mature</option>
          </select>

          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showAnswers
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showAnswers ? 'Hide' : 'Show'} Answers
          </button>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ref ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                {showAnswers && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Answer
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-sm text-gray-900 font-medium">
                    {question.id}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 font-medium">
                    {question.refId || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-md">
                      {question.question}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.topic}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(question.learningStatus)}`}>
                      {question.learningStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className="text-gray-900 font-medium">
                      {question.timesCorrect}/{question.timesAnswered}
                    </span>
                    {question.timesAnswered > 0 && (
                      <span className="ml-2 text-gray-500">
                        ({Math.round((question.timesCorrect / question.timesAnswered) * 100)}%)
                      </span>
                    )}
                  </td>
                  {showAnswers && (
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-md">
                        {question.answer}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No questions found matching your filters.
          </div>
        )}
      </div>
    </div>
  )
}