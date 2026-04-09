import { create } from 'zustand'
import type { Word } from '@/types'

interface AppStore {
  // Sentence bar
  sentenceWords: Word[]
  addWord: (word: Word) => void
  removeLastWord: () => void
  clearSentence: () => void
  isSpeaking: boolean
  setIsSpeaking: (v: boolean) => void

  // Grid navigation
  activeFolderKey: string | null
  setActiveFolder: (key: string | null) => void

  // Modes
  isAdminOpen: boolean
  openAdmin: () => void
  closeAdmin: () => void

  // Overlays
  isQuickPhrasesOpen: boolean
  toggleQuickPhrases: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Sentence bar
  sentenceWords: [],
  addWord: (word) => set((state) => ({ sentenceWords: [...state.sentenceWords, word] })),
  removeLastWord: () => set((state) => ({ sentenceWords: state.sentenceWords.slice(0, -1) })),
  clearSentence: () => set({ sentenceWords: [] }),
  isSpeaking: false,
  setIsSpeaking: (v) => set({ isSpeaking: v }),

  // Grid navigation
  activeFolderKey: null,
  setActiveFolder: (key) => set({ activeFolderKey: key }),

  // Modes
  isAdminOpen: false,
  openAdmin: () => set({ isAdminOpen: true }),
  closeAdmin: () => set({ isAdminOpen: false }),

  // Overlays
  isQuickPhrasesOpen: false,
  toggleQuickPhrases: () => set((state) => ({ isQuickPhrasesOpen: !state.isQuickPhrasesOpen })),
}))
