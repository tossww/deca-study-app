# DECA Study App - Product Requirements Document

## 1. Product Overview

### 1.1 Vision
A scientifically-backed study application that helps students master DECA exam questions using spaced repetition algorithms, providing efficient and effective exam preparation.

### 1.2 Mission
To eliminate cramming and improve long-term retention of DECA exam material through adaptive learning and spaced repetition methodology.

### 1.3 Core Value Proposition
- **Scientifically Proven**: Uses spaced repetition algorithm for optimal retention
- **Adaptive Learning**: Questions appear based on individual performance
- **Comprehensive Coverage**: 500+ questions across 5 DECA topics
- **Progress Tracking**: Visual progress indicators and detailed analytics

## 2. User Personas

### 2.1 Primary User: DECA Student
- **Demographics**: High school students preparing for DECA exams
- **Goals**: Pass DECA exams with high scores, efficient study time management
- **Pain Points**: Traditional cramming is ineffective, difficult to track progress
- **Tech Comfort**: Mobile-first, expects modern UI/UX

### 2.2 Secondary User: Guest User
- **Demographics**: Casual users exploring the app
- **Goals**: Quick access to study materials without commitment
- **Needs**: No registration required, basic functionality access

## 3. Functional Requirements

### 3.1 Authentication System

#### 3.1.1 Login Component
**Status**: ✅ Implemented

**Functionality**:
- **Email Login**: Password-less authentication using email address
- **Guest Login**: Instant access without registration
- **Session Management**: 30-day persistent sessions
- **Auto-redirect**: Automatic navigation to dashboard upon successful login

**Technical Details**:
- Uses Prisma with SQLite for user storage
- JWT-style tokens for session management
- Zustand for client-side state persistence

**User Flow**:
1. User enters email OR clicks "Continue as Guest"
2. System creates/retrieves user record
3. Session token generated and stored
4. User redirected to Dashboard

### 3.2 Dashboard Component

#### 3.2.1 Overview Section
**Status**: ✅ Implemented

**Functionality**:
- **Welcome Message**: Personalized greeting with user email
- **Quick Start Button**: Direct access to study session
- **Progress Summary**: Overall completion percentage
- **Due Cards Alert**: Highlights questions ready for review

#### 3.2.2 Statistics Cards
**Status**: ✅ Implemented

**Metrics Displayed**:
- **Study Streak**: Consecutive days of study activity
- **Mastery Level**: Percentage of questions in mature status
- **Accuracy**: Overall correct answer percentage
- **Today's Study Time**: Minutes spent studying today

#### 3.2.3 Weekly Learning Progress Chart
**Status**: ✅ Implemented

**Features**:
- **Stacked Bar Chart**: Shows questions learned vs. mastered daily
- **7-Day View**: Rolling weekly progress display
- **Color Coding**: Blue for newly learned, green for mastered
- **Progress Summary**: Total questions learned this week

#### 3.2.4 Mastery Breakdown (Pie Chart)
**Status**: ✅ Implemented

**Categories**:
- **New**: Never studied (gray)
- **Learning**: Active memorization phase (orange)
- **Young**: Recently mastered, <21 day intervals (blue)
- **Mature**: Well-established knowledge, ≥21 day intervals (green)
- **Relearning**: Failed recent reviews (red)

#### 3.2.5 Topic-wise Progress
**Status**: ✅ Implemented

**Display**:
- **Grid Layout**: Cards for each of 5 DECA topics
- **Mastery Percentage**: Per-topic completion status
- **Status Breakdown**: New, learning, mature counts per topic

#### 3.2.6 Study Tips Section
**Status**: ✅ Implemented

**Content**:
- **Best Practices**: Evidence-based study recommendations
- **Feature Guidance**: How to use app effectively
- **Motivation**: Encouragement and tips for consistency

### 3.3 Study Session Component

#### 3.3.1 Topic Selection
**Status**: ✅ Implemented

**Features**:
- **Multi-select Interface**: Checkbox-based topic selection
- **Persistent Selection**: Remembers previous choices via localStorage
- **Visual Feedback**: Clear indication of selected topics
- **Quick Controls**: "All" and "None" selection buttons
- **Smart Messaging**: Contextual help text based on selection state

**Topic Coverage**:
- Business Management & Administration
- Marketing
- Finance
- Entrepreneurship
- Hospitality & Tourism

#### 3.3.2 Study Modes
**Status**: ✅ Implemented

**Modes**:
1. **Test All Mode**:
   - Loads ALL questions from selected topics (100+ questions)
   - No spaced repetition filtering
   - Complete topic coverage testing
   - Progress tracking but no review scheduling

2. **Study Mode (Configurable Size)**:
   - Default: 25 questions per session
   - Uses spaced repetition algorithm
   - Priority order: overdue > due today > new questions
   - Configurable session size (5-100 questions)
   - Saves preference to localStorage

**UI Requirements**:
- Replace single "Start Study" button with two options
- "Test All" button - loads all questions
- "Study (25)" button - limited session with count displayed
- Button label updates dynamically based on saved preference
- Pass study mode ('test' or 'study') to session component

**Settings Integration**:
- Add "Session Settings" to InfoHelp component
- Number input for study session size (min: 5, max: 100, default: 25)
- Explanation of difference between Test and Study modes
- Settings persist via localStorage

#### 3.3.3 Question Delivery
**Status**: ✅ Implemented

**Question Format**:
- **Multiple Choice**: 4 options (A, B, C, D) per question
- **Real Exam Questions**: Sourced from official DECA sample exams
- **Explanations**: Detailed rationales for correct answers
- **Progress Tracking**: Current position in session

**Interface Features**:
- **Keyboard Shortcuts**: 1-4 or A-D for answers, Enter/Space for next
- **Visual Feedback**: Color-coded answer states (correct/incorrect)
- **Session Stats**: Real-time accuracy and timing display
- **Quit Functionality**: Exit study session with summary and topic reset

#### 3.3.3 Spaced Repetition Algorithm
**Status**: ✅ Implemented

**Algorithm Details**:
- **SuperMemo2 Based**: Industry-standard spaced repetition
- **Adaptive Intervals**: Review timing based on performance
- **Quality Ratings**: Good/Again feedback system
- **Ease Factor**: Personalized difficulty adjustment

**Learning Progression**:
1. **New → Learning**: First exposure, short intervals
2. **Learning → Young**: Consistent success, medium intervals
3. **Young → Mature**: Long-term retention, extended intervals
4. **Any → Relearning**: Failed review, reset intervals

### 3.4 Browse Component

#### 3.4.1 Question Database Browser
**Status**: ✅ Implemented

**Features**:
- **Tabular Display**: Organized question listing
- **Learning Status Filter**: Filter by new/learning/mature
- **Topic Filter**: Browse by subject area
- **Search Functionality**: Text-based question search
- **Answer Toggle**: Show/hide correct answers
- **Progress Indicators**: Individual question learning status

**Columns Displayed**:
- Question ID (sequential)
- Reference ID (from original source)
- Question Text (truncated)
- Topic
- Learning Status (with color coding)

#### 3.4.2 Question Details
**Status**: ✅ Implemented

**Information Shown**:
- **Full Question Text**: Complete question content
- **Correct Answer**: Letter and full answer text
- **Explanation**: Detailed rationale
- **Source Information**: Reference to original exam material

### 3.5 Information/Help Section

#### 3.5.1 App Documentation
**Status**: ✅ Implemented

**Content Available**:
- **Spaced Repetition Explanation**: How the algorithm works
- **Learning Status Guide**: What each status means
- **Best Practices**: Study tips and recommendations
- **Feature Documentation**: How to use each app feature
- **Progress Interpretation**: Understanding statistics and charts

### 3.6 Navigation System

#### 3.6.1 Main Navigation
**Status**: ✅ Implemented

**Navigation Items (current)**:
- **Dashboard**: Overview and quick start
- **Study**: Topic selection and study sessions
- **Browse**: Question database exploration
- **Info**: Help and documentation
- **Logout**: Session termination

**Features**:
- **Active State**: Visual indication of current page
- **Persistent Header**: Always accessible navigation
- **Responsive Design**: Mobile and desktop optimized

## 4. Technical Architecture

### 4.1 Technology Stack
- **Frontend**: Next.js 14 with React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with localStorage persistence
- **Database (local/dev)**: SQLite previously, now Postgres parity via Prisma ORM
- **Database (prod)**: PostgreSQL (Vercel Postgres / managed Postgres)
- **Charts**: Recharts for data visualization
- **UI Components**: Custom components with shadcn/ui inspiration

### 4.2 Database Schema

#### 4.2.1 Core Tables
- **Users**: Authentication and profile data
- **Topics**: Subject area definitions
- **Questions**: Question content and metadata
- **QuestionStats**: Individual user progress tracking
- **Sessions**: Authentication token management
- **StudySessions**: Study session history
- **SessionItems**: Individual question attempts

#### 4.2.2 Data Flow
1. **Question Selection**: Algorithm chooses questions based on due dates and learning status
2. **Progress Tracking**: User responses update individual question statistics
3. **Spaced Repetition**: Next review dates calculated using SuperMemo2
4. **Analytics**: Aggregate statistics computed for dashboard display

### 4.3 Key APIs

#### 4.3.1 Authentication
- `POST /api/auth/login`: User login/registration, sets HttpOnly `session-token` cookie
- Session token validation via database-backed sessions

#### 4.3.2 Questions
- `GET /api/questions`: Retrieve questions for study session
- `POST /api/questions/answer`: Submit answer and update progress
- `GET /api/questions/all`: Browse all questions with progress

#### 4.3.3 Analytics
- `GET /api/stats`: User progress statistics and analytics

## 5. Learning Status System

### 5.1 Status Categories

#### 5.1.1 New Questions
- **Definition**: Never attempted
- **Appearance**: High frequency until first success
- **Color**: Blue indicator
- **Transition**: → Learning after first attempt

#### 5.1.2 Learning Questions
- **Definition**: Being actively memorized
- **Criteria**: Repetitions < 3 OR interval < 21 days
- **Color**: Yellow/orange indicator
- **Transition**: → Mature when interval ≥ 21 days

#### 5.1.3 Mature Questions
- **Definition**: Well-established knowledge
- **Criteria**: Repetitions ≥ 3 AND interval ≥ 21 days
- **Color**: Green indicator
- **Review Frequency**: Weeks to months apart

### 5.2 Progress Metrics

#### 5.2.1 Weekly Learning Progress
- **New Questions Learned**: Questions moving from new → learning
- **Questions Mastered**: Questions reaching mature status
- **Visual Representation**: Stacked bar chart with dual metrics

#### 5.2.2 Mastery Calculation
- **Overall Mastery**: (Mature + Young) / Total Questions
- **Topic Mastery**: Per-topic mature question percentage
- **Accuracy**: Correct answers / Total attempts

## 6. User Experience Design

### 6.1 Design Principles
- **Clarity First**: Clear visual hierarchy and information architecture
- **Minimal Cognitive Load**: Reduce decision fatigue during study
- **Progress Visibility**: Always show learning progress and achievements
- **Accessibility**: Keyboard navigation and screen reader support

### 6.2 Interaction Patterns
- **Keyboard-First**: Shortcuts for efficient studying
- **Visual Feedback**: Immediate response to user actions
- **Progressive Disclosure**: Show information when needed
- **Consistent States**: Predictable UI behavior across components

### 6.3 Responsive Design
- **Mobile Optimized**: Touch-friendly interfaces
- **Desktop Enhanced**: Keyboard shortcuts and larger displays
- **Adaptive Layouts**: Flexible grid systems

## 11. Conclusion

The DECA Study App represents a modern, scientifically-backed approach to exam preparation. By combining proven spaced repetition algorithms with intuitive user experience design, the application provides students with an effective tool for long-term knowledge retention and exam success.

The current implementation provides a solid foundation with core study functionality, progress tracking, and user management. Future development will focus on enhanced practice modes, improved user guidance, and advanced analytics to further improve learning outcomes.

---

*Last Updated: September 15, 2025*
*Version: 1.0*
*Status: MVP Completed*