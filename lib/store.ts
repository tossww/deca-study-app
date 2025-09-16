import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
}

interface AppState {
  user: User | null
  isLoading: boolean
  sessionToken: string | null
  selectedTopics: string[]
  studySessionSize: number
  lastStudyMode: 'test' | 'study'
  testMode: boolean
  cheatingMode: boolean
  debugMode: boolean
  setUser: (user: User | null) => void
  setSessionToken: (token: string | null) => void
  setSelectedTopics: (topics: string[]) => void
  setStudySessionSize: (size: number) => void
  setLastStudyMode: (mode: 'test' | 'study') => void
  setTestMode: (enabled: boolean) => void
  setCheatingMode: (enabled: boolean) => void
  setDebugMode: (enabled: boolean) => void
  logout: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      sessionToken: null,
      selectedTopics: [],
      studySessionSize: 25,
      lastStudyMode: 'study' as const,
      testMode: false,
      cheatingMode: false,
      debugMode: false,
      setUser: (user) => set({ user, isLoading: false }),
      setSessionToken: (token) => set({ sessionToken: token }),
      setSelectedTopics: (topics) => set({ selectedTopics: topics }),
      setStudySessionSize: (size) => set({ studySessionSize: size }),
      setLastStudyMode: (mode) => set({ lastStudyMode: mode }),
      setTestMode: (enabled) => set({ testMode: enabled }),
      setCheatingMode: (enabled) => set({ cheatingMode: enabled }),
      setDebugMode: (enabled) => set({ debugMode: enabled }),
      logout: () => set({ user: null, sessionToken: null }),
    }),
    {
      name: 'deca-study-app',
      partialize: (state) => ({
        user: state.user,
        sessionToken: state.sessionToken,
        selectedTopics: state.selectedTopics,
        studySessionSize: state.studySessionSize,
        lastStudyMode: state.lastStudyMode,
        testMode: state.testMode,
        cheatingMode: state.cheatingMode,
        debugMode: state.debugMode
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // If we have a user and token after rehydration, stop loading
          if (state.user && state.sessionToken) {
            state.isLoading = false
          } else {
            state.isLoading = false
          }
        }
      },
    }
  )
)