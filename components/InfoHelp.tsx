'use client'

import { STUDY_TIPS } from '@/lib/study-tips'
import { useStore } from '@/lib/store'
import { useState, useEffect } from 'react'

export function InfoHelp() {
  const { studySessionSize, setStudySessionSize, testMode, setTestMode } = useStore()
  const [sessionSize, setSessionSize] = useState(studySessionSize)

  useEffect(() => {
    setSessionSize(studySessionSize)
  }, [studySessionSize])

  const handleSizeChange = (newSize: number) => {
    const clampedSize = Math.max(5, Math.min(100, newSize))
    setSessionSize(clampedSize)
    setStudySessionSize(clampedSize)
  }

  return (
    <div className="space-y-6">
      {/* App Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">DECA Study App</h2>
        <p className="text-gray-700 leading-relaxed">
          This app uses scientifically-proven spaced repetition to help you master DECA exam questions efficiently.
          Instead of cramming, you&apos;ll review questions at optimal intervals to build long-term retention.
        </p>
      </div>

      {/* Session Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Session Settings</h3>
        
        <div className="space-y-4">
          {/* Study Session Size */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Study Session Size</h4>
            <p className="text-sm text-gray-600 mb-3">
              Choose how many questions you want to review in each study session. This only affects Study mode, not Test All mode.
            </p>
            
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={sessionSize}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                min="5"
                max="100"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <span className="text-sm text-gray-500">questions per session (5-100)</span>
            </div>

            {/* Preset buttons */}
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => handleSizeChange(10)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                10
              </button>
              <button
                onClick={() => handleSizeChange(25)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                25
              </button>
              <button
                onClick={() => handleSizeChange(50)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                50
              </button>
              <button
                onClick={() => handleSizeChange(100)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                100
              </button>
            </div>
          </div>

          {/* Test Mode Toggle */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Test Mode</h4>
            <p className="text-sm text-gray-600 mb-3">
              When enabled, the correct answer's number will not have a period, making it easier to identify during practice.
            </p>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Test Mode</span>
            </label>
            
            {testMode && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Test mode is ON - correct answers show without period (e.g., "1" instead of "1.")
              </div>
            )}
          </div>

          {/* Study Modes Explanation */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Study Modes</h4>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-20 text-sm font-medium text-blue-700 flex-shrink-0">Test All</div>
                <div className="text-sm text-gray-600">
                  Practice all questions from your selected topics. Great for comprehensive review or 
                  initial learning. No spaced repetition scheduling - just complete topic coverage.
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-20 text-sm font-medium text-primary-700 flex-shrink-0">Study</div>
                <div className="text-sm text-gray-600">
                  Uses spaced repetition to show you questions when they&apos;re due for review. 
                  Prioritizes overdue questions, then due today, then new questions. Limited to 
                  your session size setting above.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Learning Journey */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Learning Journey</h3>

        {/* Visual Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-600">First Time</span>
            <span className="text-xs font-medium text-gray-600">Apprentice</span>
            <span className="text-xs font-medium text-gray-600">Guru</span>
            <span className="text-xs font-medium text-gray-600">Master</span>
          </div>
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gray-400 via-yellow-400 via-blue-400 to-green-400 rounded-full"></div>
            </div>
            <div className="absolute flex justify-between w-full -mt-1">
              <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
              <div className="w-4 h-4 bg-blue-400 rounded-full border-2 border-white"></div>
              <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>

        {/* Detailed Stage Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold">NEW</span>
            </div>
            <h4 className="font-semibold text-gray-900">New</h4>
            <p className="text-xs text-gray-600 mt-1">Never seen before</p>
            <div className="mt-2 bg-gray-50 rounded px-2 py-1">
              <p className="text-xs font-medium text-gray-700">Next: Immediately</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚔</span>
            </div>
            <h4 className="font-semibold text-yellow-900">Apprentice</h4>
            <p className="text-xs text-gray-600 mt-1">Building memory (&lt; 3 reviews)</p>
            <div className="mt-2 bg-yellow-50 rounded px-2 py-1">
              <p className="text-xs font-medium text-yellow-700">Reviews: Minutes → Hours → Days</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✦</span>
            </div>
            <h4 className="font-semibold text-blue-900">Guru</h4>
            <p className="text-xs text-gray-600 mt-1">3+ successful reviews, &lt;21 days</p>
            <div className="mt-2 bg-blue-50 rounded px-2 py-1">
              <p className="text-xs font-medium text-blue-700">Reviews: Every few days</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">♛</span>
            </div>
            <h4 className="font-semibold text-green-900">Master</h4>
            <p className="text-xs text-gray-600 mt-1">Long-term mastery (≥21 days)</p>
            <div className="mt-2 bg-green-50 rounded px-2 py-1">
              <p className="text-xs font-medium text-green-700">Reviews: Weeks/months apart</p>
            </div>
          </div>
        </div>

        {/* How to Progress Box */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="text-lg mr-2">↗</span>
            Progression Path & Difficulty Impact
          </h5>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside mb-3">
            <li>Answer a new question correctly → Becomes <span className="font-medium text-yellow-700">Apprentice</span></li>
            <li>Review it successfully 3+ times with good ease → Graduates to <span className="font-medium text-blue-700">Guru</span></li>
            <li>After 21 days of successful reviews → Achieves <span className="font-medium text-green-700">Master</span> status</li>
            <li>If you fail any card → Interval drops by 4× (not full reset)</li>
          </ol>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <h6 className="font-medium text-gray-800 mb-2">Your Answer Speed Determines Difficulty:</h6>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><span className="font-medium text-green-700">Easy (&lt;15s):</span> Advances 4× faster - confident recall means less frequent reviews</li>
              <li><span className="font-medium text-blue-700">Good (15-40s):</span> Normal 2.5× progression - standard spacing intervals</li>
              <li><span className="font-medium text-orange-700">Hard (40-120s):</span> Slower 1.2× progression - needs more practice</li>
              <li><span className="font-medium text-red-700">Incorrect (&gt;120s or wrong):</span> Interval drops by 4× - review again soon</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2 italic">Example: A &quot;Good&quot; card at 1 day becomes 2.5 days, an &quot;Easy&quot; card jumps to 4 days!</p>
          </div>
        </div>
      </div>

      {/* How Spaced Repetition Works */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">How Spaced Repetition Works</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-blue-900">The Science</h4>
            <p className="text-gray-700 text-sm">
              Research shows that reviewing information at increasing intervals dramatically improves retention.
              This app automatically schedules your reviews based on how well you know each question.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-green-900">Adaptive Learning</h4>
            <p className="text-gray-700 text-sm">
              Questions you struggle with appear more frequently, while questions you master are shown less often.
              This focuses your study time where it&apos;s needed most.
            </p>
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Study Tips & Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDY_TIPS.map((tip) => (
            <div key={tip.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <span className="text-2xl mr-3 flex-shrink-0">{tip.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{tip.title}</h4>
                  <p className="text-gray-600 text-xs">{tip.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version Info */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-500">
          Version updated: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}