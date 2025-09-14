// Anki Algorithm Configuration
// Based on the specification from anki.md

export interface AnkiConfig {
  // Learning Steps (in minutes) - for new and relearning cards
  learningSteps: number[]       // [1, 10] - Default steps for new cards
  relearningSteps: number[]     // [10] - Default steps for failed mature cards

  // Graduation Settings
  graduatingInterval: number    // 1 day - Interval when graduating from learning
  easyInterval: number         // 4 days - Interval when using Easy on new cards

  // Interval Modifiers
  hardIntervalMultiplier: number // 1.2 - Multiplier for Hard answers
  easyBonus: number             // 1.3 - Additional multiplier for Easy answers
  intervalModifier: number      // 1.0 - Global interval modifier

  // Ease Factor Settings
  startingEaseFactor: number    // 2.5 - Initial ease factor for new cards
  minEaseFactor: number         // 1.3 - Minimum ease factor
  maxEaseFactor: number         // 2.5 - Maximum ease factor (optional cap)

  // Ease Factor Adjustments (in decimal, not percentage points)
  againPenalty: number          // -0.20 - Ease factor decrease for Again
  hardPenalty: number          // -0.15 - Ease factor decrease for Hard
  easyBonusEase: number        // +0.15 - Ease factor increase for Easy

  // Daily Limits
  dailyNewCards: number        // 20 - New cards per day
  dailyReviewCards: number     // 200 - Review cards per day

  // Leech Control
  leechThreshold: number       // 8 - Number of lapses before marking as leech
  leechAction: 'suspend' | 'tag' // What to do with leeches
}

// Default Anki Configuration
export const DEFAULT_ANKI_CONFIG: AnkiConfig = {
  // Learning steps: 1 minute, then 10 minutes
  learningSteps: [1, 10],
  relearningSteps: [10],

  // Graduation settings
  graduatingInterval: 1,  // 1 day
  easyInterval: 4,       // 4 days

  // Interval multipliers
  hardIntervalMultiplier: 1.2,
  easyBonus: 1.3,
  intervalModifier: 1.0,

  // Ease factor settings
  startingEaseFactor: 2.5,
  minEaseFactor: 1.3,
  maxEaseFactor: 2.5,

  // Ease factor adjustments
  againPenalty: -0.20,
  hardPenalty: -0.15,
  easyBonusEase: 0.15,

  // Daily limits
  dailyNewCards: 20,
  dailyReviewCards: 200,

  // Leech control
  leechThreshold: 8,
  leechAction: 'suspend'
}

// Card States
export enum CardState {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEW = 'review',
  RELEARNING = 'relearning',
  SUSPENDED = 'suspended'
}

// Answer Quality (matching existing enum)
export enum Quality {
  Again = 0,
  Hard = 1,
  Good = 2,
  Easy = 3,
}

// Time-based grading thresholds (in seconds)
export interface TimeBasedGrading {
  fastThreshold: number    // < 10 seconds = Easy suggestion
  normalThreshold: number  // 10-20 seconds = Good suggestion
  slowThreshold: number    // 20-40 seconds = Hard suggestion
  verySlowThreshold: number // > 40 seconds = Again suggestion (up to 120s timeout)
}

export const DEFAULT_TIME_THRESHOLDS: TimeBasedGrading = {
  fastThreshold: 10,
  normalThreshold: 20,
  slowThreshold: 40,
  verySlowThreshold: 120
}

// Helper function to suggest grade from response time
export function suggestGradeFromTime(
  responseTimeMs: number,
  wasCorrect: boolean,
  thresholds: TimeBasedGrading = DEFAULT_TIME_THRESHOLDS
): Quality {
  if (!wasCorrect) return Quality.Again

  const seconds = responseTimeMs / 1000

  if (seconds < thresholds.fastThreshold) return Quality.Easy      // Quick confident recall
  if (seconds < thresholds.normalThreshold) return Quality.Good    // Normal thinking time
  if (seconds < thresholds.slowThreshold) return Quality.Hard      // Slow/uncertain
  return Quality.Again                                             // Very slow, likely struggling
}