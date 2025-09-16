import { cn } from '@/lib/utils'

type MasteryLevel = 'new' | 'apprentice' | 'guru' | 'master'

interface MasteryIndicatorProps {
  level: MasteryLevel
  className?: string
}

const masteryConfig = {
  new: {
    label: 'New',
    color: 'text-gray-500',
  },
  apprentice: {
    label: 'Apprentice',
    color: 'text-blue-600',
  },
  guru: {
    label: 'Guru',
    color: 'text-purple-600',
  },
  master: {
    label: 'Master',
    color: 'text-amber-600',
  },
}

export function MasteryIndicator({ level, className }: MasteryIndicatorProps) {
  const config = masteryConfig[level]

  return (
    <div className={cn(
      "inline-flex items-center text-xs font-medium",
      config.color,
      className
    )}>
      {config.label}
    </div>
  )
}