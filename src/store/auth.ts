import { UserInterface } from '@/interfaces'
import { create } from 'zustand'

interface AuthState {
  user: UserInterface
  setUser: (user: UserInterface) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {} as UserInterface,
  loading: true,
  setUser: (user: UserInterface) => {
    set({ user })
  },
  setLoading: (loading: boolean) => {
    set({ loading })
  }
}))