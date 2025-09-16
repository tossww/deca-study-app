import { formatTime } from '@/lib/utils'

interface SessionSummaryProps {
  stats: {
    correct: number
    total: number
    timeSpent: number
  }
  masteryChanges: {
    improved: number
    regressed: number
  }
  onContinue: () => void
}

export function SessionSummary({ stats, masteryChanges, onContinue }: SessionSummaryProps) {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
  const isGoodScore = accuracy >= 80

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-in fade-in duration-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isGoodScore ? '🎉 Great Job!' : '✅ Session Complete'}
          </h2>
          <p className="text-gray-600">Here&apos;s how you did:</p>
        </div>

        {/* Performance */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-3xl font-bold text-center mb-2">
            {stats.correct}/{stats.total}
          </div>
          <div className="text-center text-gray-600 mb-3">Questions Correct</div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600 mt-2">{accuracy}% Accuracy</div>
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time Spent</span>
            <span className="font-medium">{formatTime(stats.timeSpent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Avg per Question</span>
            <span className="font-medium">
              {stats.total > 0 ? Math.round(stats.timeSpent / stats.total) : 0}s
            </span>
          </div>
        </div>

        {/* Mastery Changes */}
        {(masteryChanges.improved > 0 || masteryChanges.regressed > 0) && (
          <div className="border-t pt-4 mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Mastery Progress</div>
            <div className="flex justify-between text-sm">
              {masteryChanges.improved > 0 && (
                <span className="text-green-600">
                  📈 {masteryChanges.improved} improved
                </span>
              )}
              {masteryChanges.regressed > 0 && (
                <span className="text-red-600">
                  📉 {masteryChanges.regressed} regressed
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  )
}