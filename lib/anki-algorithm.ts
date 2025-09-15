// Anki Algorithm Implementation
// Based on the SM-2 derived algorithm used by Anki

import { AnkiConfig, DEFAULT_ANKI_CONFIG, CardState, Quality } from './anki-config'

export interface CardData {
  // Existing fields from QuestionStat
  id: string
  userId: string
  questionId: number
  timesAnswered: number
  timesCorrect: number
  lastAnswered: Date | null
  nextReview: Date | null
  easeFactor: number
  interval: number
  repetitions: number

  // New Anki fields
  state: CardState
  currentStep: number
  lapses: number
  lastReviewDate: Date | null
}

export interface SchedulingResult {
  cardId: string
  fromState: CardState
  toState: CardState
  prevInterval: number
  nextInterval: number
  nextReview: Date
  easeFactor: number
  details: {
    quality: Quality
    responseTime?: number
    wasLearningStep?: boolean
    stepsCompleted?: boolean
    applied: string[]
  }
}

export class AnkiScheduler {
  private config: AnkiConfig

  constructor(config: AnkiConfig = DEFAULT_ANKI_CONFIG) {
    this.config = config
  }

  /**
   * Main scheduling function - processes an answer and returns the next review schedule
   */
  schedule(card: CardData, quality: Quality, responseTimeMs?: number): SchedulingResult {
    const now = new Date()
    const applied: string[] = []

    // Create result template
    const result: SchedulingResult = {
      cardId: card.id,
      fromState: card.state as CardState,
      toState: card.state as CardState,
      prevInterval: card.interval,
      nextInterval: card.interval,
      nextReview: now,
      easeFactor: card.easeFactor,
      details: {
        quality,
        responseTime: responseTimeMs,
        applied
      }
    }

    // Update basic stats
    card.timesAnswered += 1
    card.lastAnswered = now
    card.lastReviewDate = now

    if (quality >= Quality.Good) {
      card.timesCorrect += 1
    }

    // Route to appropriate handler based on current state
    switch (card.state) {
      case CardState.NEW:
        this.handleNewCard(card, quality, result, applied)
        break
      case CardState.LEARNING:
        this.handleLearningCard(card, quality, result, applied)
        break
      case CardState.REVIEW:
        this.handleReviewCard(card, quality, result, applied)
        break
      case CardState.RELEARNING:
        this.handleRelearningCard(card, quality, result, applied)
        break
      default:
        throw new Error(`Unknown card state: ${card.state}`)
    }

    // Update result with final values
    result.toState = card.state as CardState
    result.nextInterval = card.interval
    result.nextReview = card.nextReview!
    result.easeFactor = card.easeFactor

    return result
  }

  /**
   * Handle scheduling for new cards
   */
  private handleNewCard(card: CardData, quality: Quality, result: SchedulingResult, applied: string[]) {
    if (quality === Quality.Easy) {
      // Easy graduation - skip learning steps
      card.state = CardState.REVIEW
      card.interval = this.config.easyInterval
      card.easeFactor = this.config.startingEaseFactor + this.config.easyBonusEase
      card.repetitions = 1
      applied.push('easy_graduation', 'ease_bonus')
    } else if (quality >= Quality.Good) {
      // Move to learning steps
      card.state = CardState.LEARNING
      card.currentStep = 0
      card.interval = this.minutesToDays(this.config.learningSteps[0])
      applied.push('entered_learning')
    } else {
      // Again - restart
      card.currentStep = 0
      card.interval = this.minutesToDays(this.config.learningSteps[0])
      applied.push('again_restart')
    }

    this.updateNextReview(card)
  }

  /**
   * Handle scheduling for learning cards
   */
  private handleLearningCard(card: CardData, quality: Quality, result: SchedulingResult, applied: string[]) {
    const steps = this.config.learningSteps

    if (quality === Quality.Again) {
      // Go back to first step
      card.currentStep = 0
      card.interval = this.minutesToDays(steps[0])
      applied.push('learning_again_restart')
    } else if (quality === Quality.Easy) {
      // Graduate early with easy interval
      card.state = CardState.REVIEW
      card.interval = this.config.easyInterval
      card.easeFactor = this.config.startingEaseFactor + this.config.easyBonusEase
      card.repetitions = 1
      applied.push('easy_graduation_from_learning', 'ease_bonus')
    } else if (quality === Quality.Hard && card.currentStep > 0) {
      // Repeat current step (but not if on first step)
      card.interval = this.minutesToDays(steps[card.currentStep])
      applied.push('learning_hard_repeat')
    } else {
      // Good or Hard on first step - advance
      card.currentStep += 1

      if (card.currentStep >= steps.length) {
        // Graduate to review
        card.state = CardState.REVIEW
        card.interval = this.config.graduatingInterval
        card.easeFactor = this.config.startingEaseFactor
        card.repetitions = 1
        applied.push('graduated_to_review')
      } else {
        // Continue in learning
        card.interval = this.minutesToDays(steps[card.currentStep])
        applied.push('learning_step_advanced')
      }
    }

    this.updateNextReview(card)
  }

  /**
   * Handle scheduling for review cards (mature cards)
   */
  private handleReviewCard(card: CardData, quality: Quality, result: SchedulingResult, applied: string[]) {
    const oldInterval = card.interval

    if (quality === Quality.Again) {
      // Failed - reduce interval by 4x instead of full reset
      card.state = CardState.RELEARNING
      card.currentStep = 0
      card.lapses += 1
      card.easeFactor = Math.max(
        this.config.minEaseFactor,
        card.easeFactor + this.config.againPenalty
      )
      // Drop interval by 4x but minimum 1 day
      card.interval = Math.max(1, card.interval / 4)
      applied.push('failed_interval_reduced_4x', 'ease_penalty_again', 'lapse_recorded')

      // Check for leech
      if (card.lapses >= this.config.leechThreshold) {
        applied.push('leech_detected')
        if (this.config.leechAction === 'suspend') {
          card.state = CardState.SUSPENDED
          applied.push('leech_suspended')
        }
      }
    } else {
      // Successful review
      card.repetitions += 1

      if (quality === Quality.Hard) {
        card.easeFactor = Math.max(
          this.config.minEaseFactor,
          card.easeFactor + this.config.hardPenalty
        )
        card.interval = Math.max(1, Math.round(oldInterval * this.config.hardIntervalMultiplier))
        applied.push('ease_penalty_hard', 'hard_interval_multiplier')
      } else if (quality === Quality.Easy) {
        card.easeFactor = Math.min(
          this.config.maxEaseFactor,
          card.easeFactor + this.config.easyBonusEase
        )
        card.interval = Math.round(oldInterval * card.easeFactor * this.config.easyBonus)
        applied.push('ease_bonus_easy', 'easy_bonus_multiplier')
      } else {
        // Good
        card.interval = Math.round(oldInterval * card.easeFactor)
        applied.push('good_standard_progression')
      }

      // Apply global interval modifier
      card.interval = Math.max(1, Math.round(card.interval * this.config.intervalModifier))
      if (this.config.intervalModifier !== 1.0) {
        applied.push('interval_modifier')
      }
    }

    this.updateNextReview(card)
  }

  /**
   * Handle scheduling for relearning cards
   */
  private handleRelearningCard(card: CardData, quality: Quality, result: SchedulingResult, applied: string[]) {
    const steps = this.config.relearningSteps

    if (quality === Quality.Again) {
      // Drop interval by 4x again
      card.currentStep = 0
      card.interval = Math.max(1, card.interval / 4)
      applied.push('relearning_again_reduced_4x')
    } else if (quality === Quality.Easy) {
      // Graduate early
      card.state = CardState.REVIEW
      // Set interval based on previous interval before failure, but reduced
      card.interval = Math.max(1, Math.round(card.interval * this.config.easyBonus))
      card.easeFactor = Math.min(
        this.config.maxEaseFactor,
        card.easeFactor + this.config.easyBonusEase
      )
      applied.push('relearning_easy_graduation', 'ease_bonus')
    } else {
      // Good or Hard - advance through relearning steps
      card.currentStep += 1

      if (card.currentStep >= steps.length) {
        // Graduate back to review
        card.state = CardState.REVIEW
        // Keep the interval from before the failure, but apply some reduction
        card.interval = Math.max(1, Math.round(card.interval * 1.0))
        applied.push('relearning_graduated')
      } else {
        // Continue relearning
        card.interval = this.minutesToDays(steps[card.currentStep])
        applied.push('relearning_step_advanced')
      }
    }

    this.updateNextReview(card)
  }

  /**
   * Convert minutes to days (for learning steps)
   */
  private minutesToDays(minutes: number): number {
    return Math.max(0.001, minutes / (24 * 60)) // Minimum of ~1.4 minutes
  }

  /**
   * Update the nextReview date based on current interval
   */
  private updateNextReview(card: CardData) {
    const now = new Date()
    const nextReview = new Date(now.getTime() + (card.interval * 24 * 60 * 60 * 1000))
    card.nextReview = nextReview
  }

  /**
   * Get cards due for review
   */
  isDue(card: CardData, now: Date = new Date()): boolean {
    if (!card.nextReview) return card.state === CardState.NEW
    return card.nextReview <= now
  }

  /**
   * Get a human-readable description of the next interval
   */
  getIntervalDescription(interval: number): string {
    if (interval < 1) {
      const minutes = Math.round(interval * 24 * 60)
      return `${minutes}m`
    } else if (interval < 30) {
      return `${Math.round(interval)}d`
    } else if (interval < 365) {
      const months = Math.round(interval / 30.44)
      return `${months}mo`
    } else {
      const years = Math.round(interval / 365.25)
      return `${years}y`
    }
  }
}