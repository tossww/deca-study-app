// Legacy SM-2 Interface (kept for backwards compatibility)
export interface ReviewData {
  easeFactor: number
  interval: number
  repetitions: number
}

// Re-export Quality from anki-config for consistency
export { Quality } from './anki-config'

// Import Anki types and scheduler
export type { CardData, SchedulingResult } from './anki-algorithm'
export { AnkiScheduler } from './anki-algorithm'
export { CardState, DEFAULT_ANKI_CONFIG, suggestGradeFromTime } from './anki-config'

// Import Quality for the legacy function
import { Quality } from './anki-config'

export function calculateNextReview(
  current: ReviewData,
  quality: Quality
): ReviewData & { nextReviewDate: Date } {
  let { easeFactor, interval, repetitions } = current

  if (quality < Quality.Good) {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02)
  )

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
  }
}