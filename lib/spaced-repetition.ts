export interface ReviewData {
  easeFactor: number
  interval: number
  repetitions: number
}

export enum Quality {
  Again = 0,
  Hard = 1,
  Good = 2,
  Easy = 3,
}

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