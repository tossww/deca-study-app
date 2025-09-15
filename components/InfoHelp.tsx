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

      {/* Learning Status Explained */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Learning Status Explained</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <h4 className="font-semibold text-blue-900">New</h4>
            </div>
            <p className="text-gray-700 text-sm">
              Questions you&apos;ve never studied. These will appear frequently until you learn them.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <h4 className="font-semibold text-yellow-900">Learning</h4>
            </div>
            <p className="text-gray-700 text-sm">
              Questions you&apos;re actively memorizing. Review intervals are short (minutes to days).
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <h4 className="font-semibold text-green-900">Mature</h4>
            </div>
            <p className="text-gray-700 text-sm">
              Questions you know well. Reviews are spaced weeks or months apart.
            </p>
          </div>
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

      {/* Study Tips */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Study Tips for Success</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-xl mr-3">📅</span>
              <div>
                <p className="font-semibold text-gray-900">Study Daily</p>
                <p className="text-gray-700 text-sm">Consistency beats intensity. 15-30 minutes daily is better than long weekend sessions.</p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-xl mr-3">🎯</span>
              <div>
                <p className="font-semibold text-gray-900">Focus on Due Cards</p>
                <p className="text-gray-700 text-sm">Always review due questions first to prevent forgetting.</p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-xl mr-3">❌</span>
              <div>
                <p className="font-semibold text-gray-900">Don&apos;t Skip Hard Questions</p>
                <p className="text-gray-700 text-sm">Difficult questions need more repetitions to stick.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-xl mr-3">⚡</span>
              <div>
                <p className="font-semibold text-gray-900">Use Keyboard Shortcuts</p>
                <p className="text-gray-700 text-sm">Press 1-4 or A-D to answer quickly. Enter/Space for next question.</p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-xl mr-3">📈</span>
              <div>
                <p className="font-semibold text-gray-900">Track Your Progress</p>
                <p className="text-gray-700 text-sm">Watch your mastery percentage grow as questions move from new to mature.</p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-xl mr-3">🧘</span>
              <div>
                <p className="font-semibold text-gray-900">Trust the Process</p>
                <p className="text-gray-700 text-sm">The algorithm knows when to show you each question for optimal retention.</p>
              </div>
            </div>
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