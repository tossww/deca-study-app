import { cn } from '@/lib/utils'

type MasteryLevel = 'new' | 'apprentice' | 'guru' | 'master'

interface MasteryIndicatorProps {
  level: MasteryLevel
  className?: string
}

const masteryConfig = {
  new: {
    label: 'New',
    color: 'bg-gray-50 text-gray-600 border-gray-200',
  },
  apprentice: {
    label: 'Apprentice',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  guru: {
    label: 'Guru',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  master: {
    label: 'Master',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
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