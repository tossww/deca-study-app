# DECA Study App - TODO List

## 🎯 **Current Status Summary (January 2025)**
✅ **COMPLETED MAJOR FEATURES:**
- **Full Anki Algorithm** - Complete spaced repetition system with learning states
- **Mobile-First Experience** - Separate touch-optimized mobile components
- **Time-Based Grading** - Auto-suggestion based on response time
- **Advanced UI/UX** - No-scroll study page, mobile header hiding, gesture support
- **Answer Randomization** - Prevents position memorization
- **Version Display** - Shows version and build time for easy identification

*See `TODO.archive.md` for detailed completed features*

## 🚧 In Progress
- None currently

## 📋 Priority Features - NEW

### 1. ⭐ Starred Questions System
**Overview**: Allow users to star/bookmark questions for focused review sessions

#### User Stories
- As a student, I want to star questions I find challenging
- As a student, I want to test myself only on starred questions
- As a student, I want to easily add/remove stars during any study session

#### Implementation Plan

**Phase 1 - Database & Backend**
- [ ] Add `starred_questions` table or add to existing user stats
  - `userId`, `questionId`, `starredAt`, `starredCount` (track how many times starred)
- [ ] Create API endpoints:
  - `POST /api/questions/star` - Add/remove star
  - `GET /api/questions/starred` - Get all starred questions for user
  - `GET /api/questions?mode=starred` - Fetch starred questions for study

**Phase 2 - UI Components**
- [ ] Add star icon button to StudySession and StudySessionMobile
  - Position: Top-right corner of question card
  - States: Empty star (☆) / Filled star (★)
  - Animation: Pulse effect on toggle
- [ ] Add "Starred Questions" option to TopicSelector
  - Show count of starred questions
  - Enable only if user has starred questions
- [ ] Add starred indicator in Browse component table

**Phase 3 - Study Mode Integration**
- [ ] Create "Starred" study mode alongside Test/Study
- [ ] Handle edge cases:
  - What if no starred questions exist?
  - Mix with spaced repetition or override?
  - Show starred status during review

**Success Metrics**
- Users can star/unstar with single click
- Starred state persists across sessions
- Can start focused study on starred items only
- Clear visual feedback for starred questions

---

### 2. 📊 Wrong Answers List
**Overview**: Display questions sorted by most recent incorrect answers for targeted review

#### User Stories
- As a student, I want to see which questions I get wrong most often
- As a student, I want to review questions I recently failed
- As a student, I want to focus on my weak areas

#### Implementation Plan

**Phase 1 - Data Tracking**
- [ ] Enhance QuestionStat model to track:
  - `lastIncorrectAt` - Timestamp of last wrong answer
  - `incorrectStreak` - Consecutive wrong answers
  - `recentIncorrectCount` - Wrong answers in last 30 days
- [ ] Update stats API to record wrong answer timestamps

**Phase 2 - Wrong Answers View**
- [ ] Create new page/component: `/wrong-answers` or modal in Browse
- [ ] Display table with columns:
  - Question (truncated)
  - Topic
  - Times Wrong (total)
  - Recent Misses (last 30 days)
  - Last Failed (relative time)
  - Current Mastery Level
- [ ] Sorting options:
  - Most recent failure first (default)
  - Most total failures
  - Longest incorrect streak
- [ ] Filter options:
  - By topic
  - By date range
  - By mastery level

**Phase 3 - Actions & Integration**
- [ ] Add "Review These" button to start session with selected questions
- [ ] Show "Recently Failed" indicator in study sessions
- [ ] Add quick link from Dashboard when wrong answers exist
- [ ] Optional: Email/notification for questions failed multiple times

**Success Metrics**
- Clear visibility into problem areas
- Can quickly start review of failed questions
- Improved performance on previously failed questions
- Reduced incorrect streaks over time

---

### 3. 📝 Personal Notes System
**Overview**: Allow users to add custom notes to questions for better understanding

#### User Stories
- As a student, I want to add my own explanations to questions
- As a student, I want to add mnemonics or memory aids
- As a student, I want to see my notes during review

#### Implementation Plan

**Phase 1 - Database & Storage**
- [ ] Create `notes` table:
  ```
  - id
  - userId
  - questionId
  - noteText (text, max 1000 chars)
  - createdAt
  - updatedAt
  ```
- [ ] API endpoints:
  - `POST /api/questions/{id}/note` - Save/update note
  - `GET /api/questions/{id}/note` - Get note for question
  - `DELETE /api/questions/{id}/note` - Remove note

**Phase 2 - Note Input UI**
- [ ] Add collapsible note section below explanation in StudySession
- [ ] Components needed:
  - Textarea with character counter (max 500-1000 chars)
  - Save/Cancel buttons
  - Edit/Delete options for existing notes
  - Auto-save draft functionality
- [ ] Visual design:
  - Light yellow background (like sticky note)
  - Smaller font than main content
  - "Your Notes" header with pencil icon

**Phase 3 - Display & Management**
- [ ] Show note indicator (📝) on questions with notes
- [ ] Display notes in:
  - Study sessions (below explanation)
  - Browse table (tooltip or expandable row)
  - Question detail views
- [ ] Add "My Notes" section in Dashboard
  - Count of questions with notes
  - Recent notes added
  - Quick access to edit

**Phase 4 - Advanced Features (Optional)**
- [ ] Rich text formatting (bold, italic, lists)
- [ ] Support for images/diagrams (base64 or URLs)
- [ ] Note templates for common patterns
- [ ] Share notes with study groups (future)

**Success Metrics**
- 30%+ of active users add at least one note
- Notes improve retention (track mastery of noted vs non-noted)
- Quick note access during study sessions
- Users report notes helpful in surveys

---

## 📋 Existing Plan: Mastery System Improvements

### Overview
Improve the mastery system to better communicate when users have truly mastered questions and provide clearer feedback on learning progress.

**Reference Document**: [`docs/MASTERY_SYSTEM_IMPROVEMENTS.md`](./docs/MASTERY_SYSTEM_IMPROVEMENTS.md)

### Key Issues to Address
- **"Review" state** doesn't clearly indicate mastery level
- **Users can't tell** when they've truly mastered a question
- **No clear progression** from learning to mastery
- **Technical complexity** with redundant variables

### Planned Improvements
- [ ] **Enhanced State Display**: Show mastery level instead of just "review"
- [ ] **Clear Mastery Criteria**: 3+ reviews, high ease factor, long intervals
- [ ] **Visual Indicators**: Progress bars, colors, icons for mastery levels
- [ ] **User Feedback**: Celebration messages for mastery achievements
- [ ] **Variable Simplification**: Reduce from 11 to 8 variables

---

## 🔧 Technical Debt & Maintenance
- [ ] Add comprehensive test suite for spaced repetition algorithm
- [ ] Optimize database queries with proper indexing
- [ ] Add error boundaries and better error handling
- [ ] Implement proper logging system
- [ ] Add data export functionality (CSV, Anki format)
- [ ] Performance monitoring and analytics

## 📅 Implementation Priority
1. **Starred Questions** - Most requested, relatively simple
2. **Personal Notes** - High value for learning
3. **Wrong Answers List** - Helps identify weak areas
4. **Mastery System Improvements** - Better UX but more complex

## 📝 Notes
- Focus on user value and learning outcomes
- Maintain mobile-first approach for all new features
- Keep UI simple and distraction-free
- Consider offline functionality for future PWA support