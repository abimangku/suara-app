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

  // AI — Intent suggestions
  intentSuggestions: Word[]
  setIntentSuggestions: (suggestions: Word[]) => void

  // Modeling mode
  isModelingMode: boolean
  toggleModelingMode: () => void

  // Search
  isSearchOpen: boolean
  toggleSearch: () => void

  // Sentence history
  sentenceHistory: string[][]
  addToHistory: (words: string[]) => void

  // Mute
  isMuted: boolean
  toggleMute: () => void

  // Haptic feedback (configurable for sensory sensitivity)
  hapticLevel: 'off' | 'light' | 'medium' | 'strong'
  setHapticLevel: (level: 'off' | 'light' | 'medium' | 'strong') => void

  // Caregiver pane
  isCaregiverPaneOpen: boolean
  toggleCaregiverPane: () => void

  // Emergency surface
  isEmergencyOpen: boolean
  openEmergency: () => void
  closeEmergency: () => void
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

  // AI
  intentSuggestions: [],
  setIntentSuggestions: (suggestions) => set({ intentSuggestions: suggestions }),

  // Modeling mode
  isModelingMode: false,
  toggleModelingMode: () => set((state) => ({ isModelingMode: !state.isModelingMode })),

  // Search
  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  // Sentence history
  sentenceHistory: [],
  addToHistory: (words) => set((state) => ({
    sentenceHistory: [words, ...state.sentenceHistory].slice(0, 10)
  })),

  // Mute
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  // Haptic feedback
  hapticLevel: 'light' as const,
  setHapticLevel: (level) => set({ hapticLevel: level }),

  // Caregiver pane
  isCaregiverPaneOpen: false,
  toggleCaregiverPane: () => set((state) => ({ isCaregiverPaneOpen: !state.isCaregiverPaneOpen })),

  // Emergency surface
  isEmergencyOpen: false,
  openEmergency: () => set({ isEmergencyOpen: true }),
  closeEmergency: () => set({ isEmergencyOpen: false }),
}))
