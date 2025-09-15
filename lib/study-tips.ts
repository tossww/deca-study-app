export interface StudyTip {
  id: string
  icon: string
  title: string
  content: string
  category: 'strategy' | 'keyboard' | 'progress' | 'motivation' | 'feature'
}

export const STUDY_TIPS: StudyTip[] = [
  // Strategy Tips
  {
    id: 'focus-due',
    icon: '🎯',
    title: 'Focus on Due Cards',
    content: 'Review overdue cards first to prevent forgetting. The algorithm knows when you need to see each card.',
    category: 'strategy'
  },
  {
    id: 'daily-practice',
    icon: '📈',
    title: 'Study Daily',
    content: '15-30 minutes daily is more effective than long weekend cramming sessions.',
    category: 'strategy'
  },
  {
    id: 'dont-skip',
    icon: '💪',
    title: "Don't Skip Hard Questions",
    content: 'Difficult questions need more repetitions. Mark them as "Hard" instead of skipping.',
    category: 'strategy'
  },
  {
    id: 'trust-algorithm',
    icon: '🧠',
    title: 'Trust the Algorithm',
    content: 'The spaced repetition algorithm optimizes your review schedule automatically.',
    category: 'strategy'
  },

  // Keyboard Shortcuts
  {
    id: 'quick-answer',
    icon: '⚡',
    title: 'Quick Answering',
    content: 'Press 1-4 or A-D to answer questions instantly without clicking.',
    category: 'keyboard'
  },
  {
    id: 'navigation',
    icon: '⌨️',
    title: 'Fast Navigation',
    content: 'Press Enter or Space to move to the next question quickly.',
    category: 'keyboard'
  },

  // Progress Tips
  {
    id: 'master-cards',
    icon: '♛',
    title: 'Achieving Mastery',
    content: 'Questions become "Master" after 21 days of successful reviews, indicating long-term retention.',
    category: 'progress'
  },
  {
    id: 'response-time',
    icon: '⏱️',
    title: 'Response Time Matters',
    content: 'Answer in <15s for Easy, 15-40s for Good, 40-120s for Hard. The app auto-suggests based on your speed.',
    category: 'progress'
  },
  {
    id: 'streak-power',
    icon: '🔥',
    title: 'Build Your Streak',
    content: 'Study every day to build a streak. Consistency is the key to mastery.',
    category: 'progress'
  },

  // Motivation Tips
  {
    id: 'progress-visible',
    icon: '📊',
    title: 'Track Your Progress',
    content: 'Watch your mastery percentage grow as questions progress through Apprentice → Guru → Master.',
    category: 'motivation'
  },
  {
    id: 'small-wins',
    icon: '🏆',
    title: 'Celebrate Small Wins',
    content: 'Every correct answer strengthens your memory. Focus on progress, not perfection.',
    category: 'motivation'
  },
  {
    id: 'exam-ready',
    icon: '🎓',
    title: 'Exam Preparation',
    content: 'Questions reviewed multiple times over weeks are retained 10x better than cramming.',
    category: 'motivation'
  },

  // Feature Tips
  {
    id: 'browse-questions',
    icon: '🔍',
    title: 'Browse All Questions',
    content: 'Use the Browse tab to search and review any question, even if not due.',
    category: 'feature'
  },
  {
    id: 'topic-selection',
    icon: '📚',
    title: 'Study by Topic',
    content: 'Select specific topics to focus your study session on areas you need most.',
    category: 'feature'
  },
  {
    id: 'explanation-learn',
    icon: '💡',
    title: 'Read Explanations',
    content: 'Always read the explanation after answering to understand the concept better.',
    category: 'feature'
  },
  {
    id: 'deca-focus',
    icon: '🎯',
    title: 'DECA Exam Prep',
    content: 'Focus on business concepts and case studies that frequently appear in DECA competitions.',
    category: 'feature'
  }
]

export function getRandomTip(category?: StudyTip['category']): StudyTip {
  const tips = category
    ? STUDY_TIPS.filter(tip => tip.category === category)
    : STUDY_TIPS

  return tips[Math.floor(Math.random() * tips.length)]
}

export function getRandomTips(count: number, category?: StudyTip['category']): StudyTip[] {
  const tips = category
    ? STUDY_TIPS.filter(tip => tip.category === category)
    : STUDY_TIPS

  const shuffled = [...tips].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}