# DECA Study App - TODO List

## 🎯 **Current Status Summary (January 2025)**
✅ **COMPLETED MAJOR FEATURES:**
- **Full Anki Algorithm** - Complete spaced repetition system with learning states
- **Mobile-First Experience** - Separate touch-optimized mobile components
- **Time-Based Grading** - Auto-suggestion based on response time
- **Advanced UI/UX** - No-scroll study page, mobile header hiding, gesture support

*See `TODO.archive.md` for detailed completed features and cleanup phases*

## ✅ COMPLETED: Answer Submission Bug Fix - September 16, 2025

### Issue Resolved
Fixed bug where clicking a correct answer didn't update repetition variables because the 4-second auto-grade timer was being cleared when users clicked "Continue".

### Root Cause
- Answer submission was delayed by a 4-second timer
- Clicking "Continue" cleared the timer without submitting the answer
- Only users who waited 4+ seconds or clicked "Adjust" had their answers saved

### Solution Implemented
1. **Removed the 4-second timer** - Answers now submit immediately with the suggested grade
2. **Fixed adjust button behavior** - Adjustments now always calculate from the baseline state (before initial submission)
3. **Prevented cumulative changes** - Multiple clicks on "Adjust" no longer apply cumulative changes

### Technical Changes
- Modified `handleAnswer` to submit answer immediately instead of setting a timer
- Added `submitted` and `submittedGrade` fields to track baseline state
- Updated `submitAnswer` to always use baseline grade for score adjustments
- Removed all `autoGradeTimer` related code

## ✅ COMPLETED: Two Study Modes (Test vs Review) - September 15, 2025

### Issue Resolved
The app now offers two distinct study modes:
- **Test All**: Practice all questions from selected topics (original behavior)
- **Study Mode**: Limited sessions using spaced repetition (configurable 5-100 questions)

### Implementation Summary

#### Phase 1 – Topic Selector UI Update ✅
- ✅ Replaced single "Start Study" button with "Test All" and "Study (25)" options
- ✅ Pass study mode ('test' or 'study') to session component
- ✅ Show configurable count on Study button
- ✅ Store last selected mode in localStorage

#### Phase 2 – Settings in Info Panel ✅
- ✅ Added "Session Settings" section to InfoHelp component
- ✅ Added number input for study session size (min: 5, max: 100, default: 25)
- ✅ Save preference to localStorage via store
- ✅ Update Study button label dynamically with saved preference
- ✅ Added clear explanation of difference between Test and Study modes

#### Phase 3 – API & Session Logic ✅
- ✅ Updated `/api/questions` endpoint to accept `mode` and `limit` parameters
- ✅ Test mode: returns all questions (maintains original behavior)
- ✅ Study mode implementation:
  - ✅ Filter by nextReview <= today for reviews
  - ✅ Include new questions (never answered)
  - ✅ Priority: overdue > due today > new
  - ✅ Limit to requested session size
- ✅ Updated useStudySession hook to pass mode and limit

#### Phase 4 – Polish & Feedback ✅
- ✅ Show mode indicator in study session header (blue for Test, primary for Study)
- ✅ Different completion messages for Test vs Study
- ✅ Mode indicators on both desktop and mobile interfaces

## ✅ COMPLETED: Test Mode Feature - September 15, 2025

### Feature Overview
Added a "Test Mode" option that removes the period from the correct answer's number to make it easier to identify during practice sessions.

### Implementation Details
- ✅ Added `testMode` boolean state to the global store
- ✅ Added test mode toggle in the InfoHelp component's Session Settings section
- ✅ Updated StudySession component to conditionally hide period for correct answer when test mode is enabled
- ✅ Updated StudySessionMobile component to conditionally hide period for correct answer when test mode is enabled
- ✅ Test mode state persists across sessions via localStorage

### How It Works
- When test mode is OFF: All answer options show as "1.", "2.", "3.", "4."
- When test mode is ON: The correct answer shows without period (e.g., "1" instead of "1.")
- Toggle is available in the Info/Help panel under Session Settings
- Warning message displays when test mode is active

## 🚧 In Progress
- None currently

## 📋 Planned: Mastery System Improvements

### Overview
Improve the mastery system to better communicate when users have truly mastered questions and provide clearer feedback on learning progress. **This also addresses technical complexity by simplifying the variable system and reducing maintenance burden.**

**Reference Document**: [`docs/MASTERY_SYSTEM_IMPROVEMENTS.md`](./docs/MASTERY_SYSTEM_IMPROVEMENTS.md)

### Key Issues to Address
- **"Review" state** doesn't clearly indicate mastery level
- **Users can't tell** when they've truly mastered a question (like "1+1=2")
- **No clear progression** from learning to mastery
- **Buried mastery status** (Guru/Master) in the UI
- **Technical complexity** with 11 variables (many redundant)
- **Maintenance burden** for future developers

### Planned Improvements
- [ ] **Enhanced State Display**: Show mastery level instead of just "review"
- [ ] **Clear Mastery Criteria**: 3+ reviews, high ease factor, long intervals
- [ ] **Visual Indicators**: Progress bars, colors, icons for mastery levels
- [ ] **User Feedback**: Celebration messages for mastery achievements
- [ ] **Next Review Info**: Clear timing for when questions will appear again
- [ ] **Variable Simplification**: Reduce from 11 to 8 variables (remove redundancy)
- [ ] **Cleaner Code**: Simplified state logic and easier debugging

### Implementation Phases
- [ ] **Phase 1**: Core mastery logic and state display
- [ ] **Phase 2**: UI updates across Browse, Dashboard, StudySession
- [ ] **Phase 3**: Enhanced feedback and progress indicators
- [ ] **Phase 4**: Testing and polish

### Success Criteria
- Users understand when they've mastered content
- Clear progression from New → Learning → Guru → Master
- Motivating feedback that celebrates achievements
- Better long-term retention through clear mastery goals

## 📝 Notes
- **Full Anki Algorithm implemented** - Complete Anki-style spaced repetition with learning states
- **Mobile-first design** - Research-backed UX principles with touch optimization
- **Modern architecture** - Shared hooks, responsive detection, supports PWA/offline features
- **Individual card tracking** - Each question has its own learning state and review schedule