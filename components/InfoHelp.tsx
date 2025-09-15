'use client'

export function InfoHelp() {
  return (
    <div className="space-y-6">
      {/* App Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 DECA Study App</h2>
        <p className="text-gray-700 leading-relaxed">
          This app uses scientifically-proven spaced repetition to help you master DECA exam questions efficiently.
          Instead of cramming, you&apos;ll review questions at optimal intervals to build long-term retention.
        </p>
      </div>

      {/* How Spaced Repetition Works */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🧠 How Spaced Repetition Works</h3>
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

      {/* Your Learning Journey - Enhanced Progression Explanation */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">🚀 Your Learning Journey</h3>

        {/* Visual Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-600">First Time</span>
            <span className="text-xs font-medium text-gray-600">Building Memory</span>
            <span className="text-xs font-medium text-gray-600">Almost There</span>
            <span className="text-xs font-medium text-gray-600">Mastered!</span>
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
              <span className="text-2xl">🆕</span>
            </div>
            <h4 className="font-semibold text-gray-900">New</h4>
            <p className="text-xs text-gray-600 mt-1">Never seen before</p>
            <div className="mt-2 bg-gray-50 rounded px-2 py-1">
              <p className="text-xs font-medium text-gray-700">Next: Immediately</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📚</span>
            </div>
            <h4 className="font-semibold text-yellow-900">Learning</h4>
            <p className="text-xs text-gray-600 mt-1">Building memory</p>
            <div className="mt-2 bg-yellow-50 rounded px-2 py-1">
              <p className="text-xs font-medium text-yellow-700">Reviews: 1min → 10min → 1day</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔵</span>
            </div>
            <h4 className="font-semibold text-blue-900">Young</h4>
            <p className="text-xs text-gray-600 mt-1">Recently learned (&lt;21 days)</p>
            <div className="mt-2 bg-blue-50 rounded px-2 py-1">
              <p className="text-xs font-medium text-blue-700">Reviews: Every few days</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✅</span>
            </div>
            <h4 className="font-semibold text-green-900">Mature</h4>
            <p className="text-xs text-gray-600 mt-1">Long-term memory (≥21 days)</p>
            <div className="mt-2 bg-green-50 rounded px-2 py-1">
              <p className="text-xs font-medium text-green-700">Reviews: Weeks/months apart</p>
            </div>
          </div>
        </div>

        {/* How to Progress Box */}
        <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="text-lg mr-2">📈</span>
            How Questions Become Mature
          </h5>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Answer a new question correctly → Enters <span className="font-medium text-yellow-700">Learning</span> phase</li>
            <li>Review it successfully at 1 minute, 10 minutes, then 1 day intervals</li>
            <li>Graduate to <span className="font-medium text-blue-700">Young</span> status with longer intervals</li>
            <li>After 21 days of successful reviews → Becomes <span className="font-medium text-green-700">Mature</span></li>
            <li>If you fail a mature card → Goes to <span className="font-medium text-red-700">Relearning</span> (starts over)</li>
          </ol>
        </div>
      </div>

      {/* Difficulty Rating Based on Time */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">⏱️ Automatic Difficulty Rating</h3>
        <p className="text-gray-700 text-sm mb-4">
          Your answer speed helps determine question difficulty. You can adjust the rating before moving to the next question.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded mr-2">Easy</span>
              <span className="text-gray-600 text-sm">&lt; 15 seconds</span>
            </div>
            <p className="text-gray-700 text-xs">
              Quick confident recall. Question will be reviewed less frequently.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded mr-2">Good</span>
              <span className="text-gray-600 text-sm">15-40 seconds</span>
            </div>
            <p className="text-gray-700 text-xs">
              Normal thinking time. Standard review intervals apply.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded mr-2">Hard</span>
              <span className="text-gray-600 text-sm">40-120 seconds</span>
            </div>
            <p className="text-gray-700 text-xs">
              Slow or uncertain. Question will appear more frequently.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded mr-2">Again</span>
              <span className="text-gray-600 text-sm">&gt; 120 seconds</span>
            </div>
            <p className="text-gray-700 text-xs">
              Very slow or incorrect. Question will be reset and shown soon.
            </p>
          </div>
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