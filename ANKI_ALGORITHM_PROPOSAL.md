# Proposal: Replace Current SM-2 with Proper Anki Algorithm

## Current Implementation Analysis

Our current spaced repetition algorithm is a basic SM-2 variant with these characteristics:
- **Quality levels**: 0-3 (Again, Hard, Good, Easy)
- **Fixed intervals**: 1 day, then 6 days for first repetitions
- **Simple ease factor**: Starts at 2.5, adjusts by 0.1 - (3-quality) * (0.08 + (3-quality) * 0.02)
- **Reset on failure**: Wrong answers reset repetitions to 0

## Anki Algorithm Differences

The Anki.md specification shows a much more sophisticated approach:

### Key Improvements Needed:

1. **Learning Steps System**
   - Current: Direct jump to 1-day interval
   - Anki: Configurable learning steps (e.g., "1m", "10m" for acquisition)
   - New/Learning cards go through short-term steps before becoming Review cards

2. **Proper State Management**
   - Current: Simple repetition counter
   - Anki: Card states (new, learning, review, relearning)
   - Different behavior per state

3. **Enhanced Answer Processing**
   - Current: Simple ease factor adjustment
   - Anki: Specific rules per answer type:
     - Again: -20 percentage points, move to relearning
     - Hard: -15 percentage points, interval × 1.2
     - Good: interval × ease_factor
     - Easy: +15 percentage points, interval × ease_factor × easy_bonus

4. **Relearning System**
   - Current: Complete reset on failure
   - Anki: Separate relearning steps, maintains some progress

## Proposed Implementation Plan

### Phase 1: Database Schema Updates
```sql
-- Add new fields to QuestionStat table
ALTER TABLE QuestionStat ADD COLUMN state TEXT DEFAULT 'new' -- new, learning, review, relearning
ALTER TABLE QuestionStat ADD COLUMN currentStep INTEGER DEFAULT 0 -- for learning steps
ALTER TABLE QuestionStat ADD COLUMN lapses INTEGER DEFAULT 0 -- failure count
ALTER TABLE QuestionStat ADD COLUMN lastReviewDate DATETIME
```

### Phase 2: Algorithm Configuration
```typescript
interface AnkiConfig {
  learningSteps: number[] // [1, 10] minutes for new cards
  relearningSteps: number[] // [10] minutes for failed cards
  graduatingInterval: number // 1 day
  easyInterval: number // 4 days
  hardIntervalMultiplier: number // 1.2
  easyBonus: number // 1.3
  intervalModifier: number // 1.0
  maxEaseFactor: number // 2.5
  minEaseFactor: number // 1.3
}
```

### Phase 3: State Machine Implementation
1. **New → Learning**: First review moves to learning steps
2. **Learning**: Progress through learning steps or graduate to review
3. **Review**: Standard spaced repetition with ease factor adjustments
4. **Review → Relearning**: Failed mature cards enter relearning

### Phase 4: Enhanced Answer Processing
```typescript
function processAnswer(card: Card, rating: Quality, config: AnkiConfig) {
  switch (card.state) {
    case 'new':
    case 'learning':
      return processLearningAnswer(card, rating, config)
    case 'review':
      return processReviewAnswer(card, rating, config)
    case 'relearning':
      return processRelearningAnswer(card, rating, config)
  }
}
```

## Benefits of Anki Algorithm

1. **Better Retention**: More scientific approach with proven track record
2. **Gradual Learning**: Learning steps prevent overwhelming jumps
3. **Forgetting Curve**: More accurate modeling of human memory
4. **Configurable**: Can be tuned for different subjects/users
5. **Industry Standard**: Well-documented and tested by millions of users

## Migration Strategy

1. **Backward Compatibility**: Keep existing SM-2 for current user data
2. **Opt-in Upgrade**: Allow users to switch to Anki algorithm
3. **Data Migration**: Convert existing easeFactor/interval to Anki equivalents
4. **A/B Testing**: Compare retention rates between algorithms

## Time-Based Answer Grading Enhancement

### Current Approach
- User manually selects Again/Hard/Good/Easy after seeing the answer
- No consideration of response time in grading

### Proposed Enhancement
Automatically suggest answer grade based on response time + user can override:

```typescript
interface TimeBasedGrading {
  fastThreshold: number    // < 10 seconds = Easy suggestion
  normalThreshold: number  // 10-20 seconds = Good suggestion
  slowThreshold: number    // 20-40 seconds = Hard suggestion
  verySlowThreshold: number // > 40 seconds = Again suggestion (up to 120s timeout)
}

function suggestGradeFromTime(responseTimeMs: number, wasCorrect: boolean): Quality {
  if (!wasCorrect) return Quality.Again

  const seconds = responseTimeMs / 1000

  if (seconds < 10) return Quality.Easy     // Quick confident recall
  if (seconds < 20) return Quality.Good     // Normal thinking time
  if (seconds < 40) return Quality.Hard     // Slow/uncertain, needed time to think
  return Quality.Again                      // Very slow (40-120s), likely struggling
}
```

### UI Implementation
1. **Auto-suggestion**: Highlight suggested grade based on response time
2. **User Override**: Allow manual selection of any grade
3. **Visual Feedback**: Show response time and why grade was suggested
4. **Learning Hints**: "⚡ Quick response - Easy suggested" or "🤔 Took time to think - Hard suggested"

### Benefits
- **More Accurate Scheduling**: Response time correlates with memory strength
- **Reduced Cognitive Load**: Users don't need to self-assess as much
- **Better Retention**: More precise difficulty assessment leads to optimal intervals
- **Consistent Grading**: Removes subjective bias in self-assessment

## Implementation Effort

- **Database changes**: 2-3 hours
- **Algorithm implementation**: 8-12 hours
- **Time-based grading logic**: 3-4 hours
- **UI enhancements**: 4-6 hours
- **Testing & debugging**: 4-6 hours
- **Total**: ~21-31 hours

## Recommendation

**Implement the full Anki algorithm** to provide users with:
- More effective spaced repetition
- Better long-term retention
- Configurable learning experience
- Industry-standard approach

This would significantly improve the educational effectiveness of the DECA Study App and align with best practices in spaced repetition systems.