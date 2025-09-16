'use client'

import { useState, useEffect } from 'react'
import { useStore, type SortColumn, type SortDirection } from '@/lib/store'

interface Question {
  id: number
  refId: number | null
  question: string
  answer: string
  topic: string
  learningStatus: 'new' | 'apprentice' | 'guru' | 'master'
  masteryLevel?: number
  repetitions: number
  interval: number
  timesCorrect: number
  timesAnswered: number
  isStarred: boolean
}

export function Browse() {
  const { user, browseSortConfig, setBrowseSortConfig } = useStore()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showAnswers, setShowAnswers] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [topicFilter, setTopicFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [starredFilter, setStarredFilter] = useState<'all' | 'starred' | 'unstarred'>('all')

  useEffect(() => {
    fetchQuestions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const toggleStar = async (questionId: number, currentStarred: boolean) => {
    if (!user?.id) return

    try {
      const response = await fetch('/api/questions/star', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.id
        },
        body: JSON.stringify({
          questionId,
          isStarred: !currentStarred
        })
      })

      if (response.ok) {
        // Update local state
        setQuestions(questions.map(q =>
          q.id === questionId ? { ...q, isStarred: !currentStarred } : q
        ))
      }
    } catch (error) {
      console.error('Failed to toggle star:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-gray-100 text-gray-800'
      case 'apprentice':
        return 'bg-yellow-100 text-yellow-800'
      case 'guru':
        return 'bg-blue-100 text-blue-800'
      case 'master':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSort = (column: SortColumn) => {
    if (browseSortConfig.column === column) {
      // Toggle direction if same column
      setBrowseSortConfig({
        column,
        direction: browseSortConfig.direction === 'asc' ? 'desc' : 'asc'
      })
    } else {
      // New column, default to ascending
      setBrowseSortConfig({
        column,
        direction: 'asc'
      })
    }
  }

  const getSortIcon = (column: SortColumn) => {
    if (browseSortConfig.column !== column) {
      return (
        <span className="ml-1 text-gray-400">
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      )
    }

    return browseSortConfig.direction === 'asc' ? (
      <span className="ml-1 text-primary-600">
        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </span>
    ) : (
      <span className="ml-1 text-primary-600">
        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    )
  }

  const sortedAndFilteredQuestions = questions.filter(q => {
    if (!q || !q.question || !q.answer || !q.topic) return false

    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = topicFilter === 'all' || q.topic === topicFilter
    const matchesStatus = statusFilter === 'all' || q.learningStatus === statusFilter
    const matchesStarred = starredFilter === 'all' ||
                           (starredFilter === 'starred' && q.isStarred) ||
                           (starredFilter === 'unstarred' && !q.isStarred)

    return matchesSearch && matchesTopic && matchesStatus && matchesStarred
  }).sort((a, b) => {
    const { column, direction } = browseSortConfig
    let aVal: any, bVal: any

    switch (column) {
      case 'id':
        aVal = a.id
        bVal = b.id
        break
      case 'question':
        aVal = a.question.toLowerCase()
        bVal = b.question.toLowerCase()
        break
      case 'topic':
        aVal = a.topic.toLowerCase()
        bVal = b.topic.toLowerCase()
        break
      case 'status':
        const statusOrder = { 'new': 0, 'apprentice': 1, 'guru': 2, 'master': 3 }
        aVal = statusOrder[a.learningStatus]
        bVal = statusOrder[b.learningStatus]
        break
      case 'score':
        // Sort by percentage correct (with 0 answered at the end)
        aVal = a.timesAnswered > 0 ? (a.timesCorrect / a.timesAnswered) : -1
        bVal = b.timesAnswered > 0 ? (b.timesCorrect / b.timesAnswered) : -1
        break
      case 'answer':
        aVal = a.answer.toLowerCase()
        bVal = b.answer.toLowerCase()
        break
      default:
        aVal = a.id
        bVal = b.id
    }

    if (direction === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
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
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0">
        {/* Filters Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
              <option value="apprentice">Apprentice</option>
              <option value="guru">Guru</option>
              <option value="master">Master</option>
            </select>

            <select
              value={starredFilter}
              onChange={(e) => setStarredFilter(e.target.value as 'all' | 'starred' | 'unstarred')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Questions</option>
              <option value="starred">⭐ Starred Only</option>
              <option value="unstarred">Unstarred Only</option>
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

          <div className="text-sm text-gray-600">
            Showing {sortedAndFilteredQuestions.length} of {questions.length} questions
            {browseSortConfig.column !== 'id' && (
              <span className="ml-2 text-primary-600">
                • Sorted by {browseSortConfig.column} ({browseSortConfig.direction === 'asc' ? 'ascending' : 'descending'})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                ⭐
              </th>
              <th
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('id')}
              >
                ID
                {getSortIcon('id')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('question')}
              >
                Question
                {getSortIcon('question')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('topic')}
              >
                Topic
                {getSortIcon('topic')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('status')}
              >
                Status
                {getSortIcon('status')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                onClick={() => handleSort('score')}
              >
                Score
                {getSortIcon('score')}
              </th>
              {showAnswers && (
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
                  onClick={() => handleSort('answer')}
                >
                  Answer
                  {getSortIcon('answer')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAndFilteredQuestions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-2 py-4 text-center">
                  <button
                    onClick={() => toggleStar(question.id, question.isStarred)}
                    className="text-xl hover:scale-110 transition-transform"
                    title={question.isStarred ? "Unstar question" : "Star question"}
                  >
                    {question.isStarred ? '⭐' : '☆'}
                  </button>
                </td>
                <td className="px-3 py-4 text-sm text-gray-900 font-medium">
                  {question.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-md">
                    {question.question}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  <div className="leading-tight">
                    {question.topic.split(' & ').map((part, index) => (
                      <span key={index}>
                        {part}
                        {index < question.topic.split(' & ').length - 1 && <><br />& </>}
                      </span>
                    ))}
                  </div>
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

        {sortedAndFilteredQuestions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No questions found matching your filters.
          </div>
        )}
      </div>
    </div>
  )
}