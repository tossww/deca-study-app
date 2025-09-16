import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
}

export type SortColumn = 'id' | 'question' | 'topic' | 'status' | 'score' | 'answer'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  column: SortColumn
  direction: SortDirection
}

interface AppState {
  user: User | null
  isLoading: boolean
  sessionToken: string | null
  selectedTopics: string[]
  studySessionSize: number
  lastStudyMode: 'test' | 'study'
  cheatingMode: boolean
  debugMode: boolean
  browseSortConfig: SortConfig
  setUser: (user: User | null) => void
  setSessionToken: (token: string | null) => void
  setSelectedTopics: (topics: string[]) => void
  setStudySessionSize: (size: number) => void
  setLastStudyMode: (mode: 'test' | 'study') => void
  setCheatingMode: (enabled: boolean) => void
  setDebugMode: (enabled: boolean) => void
  setBrowseSortConfig: (config: SortConfig) => void
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
      cheatingMode: false,
      debugMode: false,
      browseSortConfig: { column: 'id', direction: 'asc' } as SortConfig,
      setUser: (user) => set({ user, isLoading: false }),
      setSessionToken: (token) => set({ sessionToken: token }),
      setSelectedTopics: (topics) => set({ selectedTopics: topics }),
      setStudySessionSize: (size) => set({ studySessionSize: size }),
      setLastStudyMode: (mode) => set({ lastStudyMode: mode }),
      setCheatingMode: (enabled) => set({ cheatingMode: enabled }),
      setDebugMode: (enabled) => set({ debugMode: enabled }),
      setBrowseSortConfig: (config) => set({ browseSortConfig: config }),
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
        cheatingMode: state.cheatingMode,
        debugMode: state.debugMode,
        browseSortConfig: state.browseSortConfig
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