# DECA Study App - TODO List

## Quick Wins (1-2 hours each)
- [x] Remove difficulty column and replace with learning status (new/learning/mature)
- [x] Add keyboard shortcuts for answering questions (1-4 or A-D)
- [x] Save and persist topic selection across sessions
- [x] **Mobile-optimized study experience** - Separate mobile/desktop components with touch-first design
- [x] **Hide header during mobile study** - Maximize screen real estate for content
- [x] **Improve mobile navigation** - Back button with arrow icon instead of "Quit"

## Medium Effort (2-4 hours)
- [x] Change weekly progress to show number of questions learned
- [x] Redesign study page to be single-page without scrolling
- [x] Add info/help section explaining app logic and mastery system
- [x] Add dedicated quit button in study mode with summary popup
- [x] **Mobile UX optimization** - Touch targets, spacing, thumb zone design
- [ ] **Progressive Web App (PWA)** - Add service worker and app manifest for mobile installation
- [ ] **Offline mode** - Cache questions for study without internet connection

## Anki Algorithm Implementation (21-31 hours)

### High Priority - Spaced Repetition Enhancement
- [ ] **Replace SM-2 with Anki Algorithm** - Implement proper learning states, relearning system, and more scientific scheduling
- [ ] **Add Time-Based Answer Grading** - Suggest Easy/Good/Hard based on response time (10/20/40/120 second thresholds)
- [ ] **Database Schema Updates** - Add state, currentStep, lapses fields to QuestionStat model
- [ ] **Learning Steps System** - Implement configurable short-term steps before cards become mature
- [ ] **Enhanced Answer Processing** - Specific ease factor adjustments per answer type (-20pp, -15pp, +15pp)

*See ANKI_ALGORITHM_PROPOSAL.md for detailed specifications*

## Other Features (4+ hours)
- [ ] Create review mode for missed questions
- [ ] Add search/filter functionality in Browse mode
- [ ] Create practice test mode with full 100-question exams
- [ ] **Dark mode** - System-aware dark theme with OLED optimization
- [ ] **Gesture enhancements** - Swipe left/right for question navigation, long-press for grade adjustment
- [ ] **Study analytics** - Detailed performance tracking and learning insights
- [ ] **Voice control** - Accessibility feature for hands-free study
- [ ] **Study reminders** - Push notifications for due reviews

## Current Progress

### ✅ Completed
1. **Remove difficulty column** - Replaced with learning status (new/learning/mature)
   - Updated API to calculate status based on repetitions and interval
   - Updated Browse component to show status instead of difficulty
   - Status categories:
     - New: Never studied (repetitions = 0)
     - Learning: Being actively reviewed (interval < 21 days)
     - Mature: Well-known (interval >= 21 days)

2. **Keyboard shortcuts** - Added for faster question answering
   - Press 1-4 or A-D to select answers
   - Press Enter or Space to move to next question
   - Visual hints added to show keyboard options

3. **Persist topic selection** - Topics now saved between sessions
   - Selected topics stored in localStorage via Zustand
   - Topics automatically pre-selected on next visit
   - Improved user experience with consistent preferences

4. **Mobile-first study experience** (Latest - January 2025)
   - **Separate mobile/desktop components** - StudySessionMobile.tsx with touch-optimized UI
   - **Responsive device detection** - Automatic mobile/desktop switching based on screen size and touch capability
   - **Header hiding on mobile** - Main navigation hidden during active study for maximum content area
   - **Touch-optimized design** - 60px+ touch targets, thumb zone optimization, active feedback
   - **Improved navigation** - Back button with arrow icon instead of intimidating "Quit" button
   - **Swipe gestures** - Right swipe for next question navigation
   - **Shared business logic** - useStudySession hook prevents code duplication between platforms
   - **Enhanced mobile layout** - Compact spacing, optimized for portrait orientation
   - **Safe area support** - Works properly with device notches and home indicators

### 🚧 In Progress
- None currently

### 📝 Notes
- Learning status is based on spaced repetition algorithm with 5 states: New → Learning → Young → Mature → Relearning
- Questions progress through states based on performance and time intervals
- Mobile experience uses research-backed UX principles (49% one-handed usage, Material Design touch targets)
- Architecture supports future tablet optimization and PWA features
- Spaced repetition system tracks individual card mastery rather than random study