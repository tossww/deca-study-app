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
  setUser: (user: User | null) => void
  setSessionToken: (token: string | null) => void
  setSelectedTopics: (topics: string[]) => void
  logout: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      sessionToken: null,
      selectedTopics: [],
      setUser: (user) => set({ user }),
      setSessionToken: (token) => set({ sessionToken: token }),
      setSelectedTopics: (topics) => set({ selectedTopics: topics }),
      logout: () => set({ user: null, sessionToken: null }),
    }),
    {
      name: 'deca-study-app',
      partialize: (state) => ({
        user: state.user,
        sessionToken: state.sessionToken,
        selectedTopics: state.selectedTopics
      }),
    }
  )
)