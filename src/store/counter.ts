import { create } from 'zustand'

type CounterState = {
  count: number
  isLoading: boolean
}

type CounterActions = {
  increment: () => void
  decrement: () => void
  toggleLoading: () => void
}

export const useCounterStore = create<CounterState & CounterActions>((set) => ({
  //state
  count: 0,
  isLoading: false,

  //actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  toggleLoading: () => set((state) => ({ isLoading: !state.isLoading })),
  reset: () => set({ count: 0 }),
}))