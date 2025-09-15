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
    id: 'daily-practice',
    icon: '📈',
    title: 'Study Daily',
    content: '15-30 minutes daily is more effective than long weekend cramming sessions.',
    category: 'strategy'
  },

  // Keyboard Shortcuts
  {
    id: 'keyboard-shortcuts',
    icon: '⌨️',
    title: 'Keyboard Shortcuts',
    content: 'Press 1-4 to answer. Use Enter or Space to advance to the next question.',
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