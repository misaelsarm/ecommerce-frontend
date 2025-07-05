import { CollectionInterface } from "@/interfaces"
import { create } from "zustand"

interface UIState {
  visible?: boolean,
  setVisible: (visible: boolean) => void
  collections: CollectionInterface[],
  setCollections: (collections: CollectionInterface[]) => void
}

export const useUIStore = create<UIState>((set) => ({
  visible: false,
  collections: [],
  setVisible: (visible: boolean) => {
    set({ visible })
  },
  setCollections: (collections: CollectionInterface[]) => {
    set({ collections })
  }
}))