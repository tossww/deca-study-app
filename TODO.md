# DECA Study App - TODO List

## 🎯 **Current Status Summary (January 2025)**
✅ **COMPLETED MAJOR FEATURES:**
- **Full Anki Algorithm** - Complete spaced repetition system with learning states
- **Mobile-First Experience** - Separate touch-optimized mobile components
- **Time-Based Grading** - Auto-suggestion based on response time
- **Advanced UI/UX** - No-scroll study page, mobile header hiding, gesture support

*See `TODO.archive.md` for detailed completed features and cleanup phases*

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

## 📝 Notes
- **Full Anki Algorithm implemented** - Complete Anki-style spaced repetition with learning states
- **Mobile-first design** - Research-backed UX principles with touch optimization
- **Modern architecture** - Shared hooks, responsive detection, supports PWA/offline features
- **Individual card tracking** - Each question has its own learning state and review schedule