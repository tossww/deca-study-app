import { cn } from '@/lib/utils'

type MasteryLevel = 'new' | 'apprentice' | 'guru' | 'master'

interface MasteryIndicatorProps {
  level: MasteryLevel
  className?: string
}

const masteryConfig = {
  new: {
    label: 'New',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  apprentice: {
    label: 'Apprentice',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  guru: {
    label: 'Guru',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  master: {
    label: 'Master',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
}

export function MasteryIndicator({ level, className }: MasteryIndicatorProps) {
  const config = masteryConfig[level]

  return (
    <div className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
      config.color,
      className
    )}>
      {config.label}
    </div>
  )
}