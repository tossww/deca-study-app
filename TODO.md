# DECA Study App - TODO List

## 🎯 **Current Status Summary (September 2025)**
✅ **COMPLETED MAJOR FEATURES:**
- **Full Anki Algorithm** - Complete spaced repetition system with learning states
- **Mobile-First Experience** - Separate touch-optimized mobile components
- **Time-Based Grading** - Auto-suggestion based on response time
- **Advanced UI/UX** - No-scroll study page, mobile header hiding, gesture support

🔄 **HIGH-PRIORITY REMAINING:**
- **PWA Implementation** - Service worker, offline mode, mobile app installation
- **Enhanced Gestures** - Left swipe, long-press interactions

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

### High Priority - Spaced Repetition Enhancement ✅ COMPLETED
- [x] **Replace SM-2 with Anki Algorithm** - ✅ Implemented proper learning states, relearning system, and scientific scheduling
- [x] **Add Time-Based Answer Grading** - ✅ Suggest Easy/Good/Hard based on response time (10/20/40/120 second thresholds)
- [x] **Learning Steps System** - ✅ Configurable short-term steps before cards become mature
- [x] **Enhanced Answer Processing** - ✅ Specific ease factor adjustments per answer type (-20pp, -15pp, +15pp)
- [x] **Database Schema Updates** - Verified fields: `state`, `currentStep`, `lapses`, `lastReviewDate`

*See ANKI_ALGORITHM_PROPOSAL.md for detailed specifications*

## Other Features (4+ hours)
- [ ] Create review mode for missed questions
- [ ] Add search/filter functionality in Browse mode
- [ ] Create practice test mode with full 100-question exams
- [ ] **Dark mode** - System-aware dark theme with OLED optimization
- [x] **Gesture enhancements (partial)** - ✅ Right swipe for next question navigation implemented
  - [ ] **Additional gestures** - Add left swipe for previous question, long-press for grade adjustment
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

5. **Advanced Spaced Repetition System** (Latest - January 2025)
   - **Full Anki Algorithm** - Complete implementation with learning states, relearning, scientific scheduling
   - **Time-based Auto-grading** - Suggests quality based on response time (10/20/40/120s thresholds)
   - **5-state Learning System** - New → Learning → Young → Mature → Relearning progression
   - **Configurable Learning Steps** - Short-term repetition before graduation (1min, 10min)
   - **Advanced Ease Adjustments** - Precise ease factor modifications (-20pp, -15pp, +15pp)
   - **Card State Management** - Proper tracking of learning progress and lapses

### 🚧 In Progress
- None currently

### 📝 Notes
- **Full Anki Algorithm implemented** - Not just SM-2, but complete Anki-style spaced repetition with learning states
- **5-state progression** - New → Learning → Young → Mature → Relearning based on performance and time
- **Time-based grading** - Auto-suggests quality based on response speed (10/20/40/120s thresholds)
- **Mobile-first design** - Research-backed UX principles (49% one-handed usage, Material Design touch targets)
- **Modern architecture** - Shared hooks, responsive detection, supports PWA/offline features
- **Individual card tracking** - Each question has its own learning state and review schedule

## Phased Implementation Plan

### Phase 1 – Immediate hygiene (DONE)
- [x] Standardize Prisma usage via `lib/prisma` in all API routes
- [x] Set HttpOnly `session-token` cookie in auth login route
- [x] Update PRD and TODO dates/status to September 2025
- [x] Create `docs/DEPLOYMENT.md` (note: original deployment guide will be consolidated under docs)

### Phase 2 – Docs consolidation
- [ ] Move product docs to `/docs/` and link from README
- [ ] Create `rules/README.md` and archive detailed doctrine files
- [ ] Move UI/UX and cleanup proposals into `/docs`

### Phase 3 – Algorithm module consolidation and performance
- [ ] Create `lib/anki/index.ts` and update imports
- [ ] Deprecate or re-export from `lib/spaced-repetition.ts`
- [ ] Optimize `app/api/stats/route.ts` with batched aggregations

### Phase 4 – Technical cleanup
- [ ] Remove unused deps after confirming usage (`pdfjs-dist`, `bcryptjs`, `@vercel/postgres`, `date-fns`, `puppeteer`)
- [ ] Remove `canvas`/`encoding` webpack aliases if unneeded
- [ ] Add/update `.env.example` and deployment docs

### Phase 5 – Enhancements
- [ ] Add basic rate limiting to auth/answer routes
- [ ] Add "due selection" endpoint using scheduler