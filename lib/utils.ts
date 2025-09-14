import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  
  const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime())
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let currentDate = new Date(today)
  
  for (const date of sortedDates) {
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    
    if (compareDate.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (compareDate.getTime() < currentDate.getTime()) {
      break
    }
  }
  
  return streak
}