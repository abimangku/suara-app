import { useCallback, useRef } from 'react'
import { useAppStore } from '@/store/appStore'
import { useAudio } from '@/hooks/useAudio'
import { useUsageLog } from '@/hooks/useUsageLog'
import { checkForNewMilestones } from '@/lib/milestones'
import type { Word } from '@/types'

export function useSentenceBar() {
  const sentenceWords = useAppStore((s) => s.sentenceWords)
  const addWordToStore = useAppStore((s) => s.addWord)
  const storeRemoveLastWord = useAppStore((s) => s.removeLastWord)
  const undoRef = useRef<{ word: Word; time: number } | null>(null)
  const { playWord, playSentence } = useAudio()
  const { logTap } = useUsageLog()

  const removeLastWord = useCallback(() => {
    // If undo available (tapped within 2 seconds), restore
    if (undoRef.current && Date.now() - undoRef.current.time < 2000) {
      const restored = undoRef.current.word
      undoRef.current = null
      addWordToStore(restored)
      return
    }
    // Otherwise delete and store for undo
    const words = useAppStore.getState().sentenceWords
    const lastWord = words[words.length - 1]
    if (lastWord) {
      undoRef.current = { word: lastWord, time: Date.now() }
    }
    storeRemoveLastWord()
  }, [storeRemoveLastWord, addWordToStore])

  const clearSentence = useCallback(() => {
    undoRef.current = null
    useAppStore.getState().clearSentence()
  }, [])

  const addWord = useCallback(
    (word: Word) => {
      const modelingMode = useAppStore.getState().isModelingMode
      if (modelingMode) {
        // In modeling mode: play audio (ALgS requires spoken model)
        // but do NOT add to sentence bar — modeling is receptive, not expressive.
        // Also do NOT log — modeling taps are caregiver demonstrations, not her
        // expressive data, and would pollute the frequency model.
        playWord(word)
        return
      }
      addWordToStore(word)
      playWord(word)
      // Log every tap (core / fringe / people / quickphrase) so the frequency
      // model, milestones, insights, and dashboard have real data to read.
      // Silent-fail by design — logging must never block communication.
      const state = useAppStore.getState()
      logTap(word, {
        sentenceContext: state.sentenceWords.map((w) => w.label),
        activeFolderKey: state.activeFolderKey,
      }).catch(() => {})
    },
    [addWordToStore, playWord, logTap]
  )

  const speak = useCallback(() => {
    const words = useAppStore.getState().sentenceWords
    if (words.length === 0) return
    const addToHistory = useAppStore.getState().addToHistory
    addToHistory(words.map((w) => w.label))
    playSentence(words)

    // Check for communication milestones
    const wordLabels = words.map((w) => w.label)
    const wordCategories = words.map((w) => w.category)
    checkForNewMilestones(wordLabels, wordCategories).catch(() => {
      // Silent fail — milestone detection must never block communication
    })

    // Sentence intentionally PERSISTS after speaking:
    //  - she can re-speak the same sentence by tapping Bicara again
    //  - a communication partner can read what she said
    //  - noisy environments often require 2-3 repeats
    // She clears by tapping ✕ Hapus (which requires confirmation) when done.
  }, [playSentence])

  const handleQuickPhrase = useCallback(
    (words: string[]) => {
      const phraseWords: Word[] = words.map((w) => ({
        id: w,
        label: w,
        category: 'quickphrase' as const,
      }))
      clearSentence()
      for (let i = 0; i < phraseWords.length; i++) {
        const w = phraseWords[i]
        addWordToStore(w)
        // Log each phrase-word so frequency + bigram models learn her
        // pragmatic patterns (e.g., "mau → nonton → tv").
        logTap(w, {
          sentenceContext: phraseWords.slice(0, i).map((x) => x.label),
          activeFolderKey: null,
        }).catch(() => {})
      }
      setTimeout(() => {
        playSentence(phraseWords)
        // Sentence persists after a quick phrase plays — same reasoning as
        // the Bicara handler above. She can re-speak or partners can read it.
      }, 500)
    },
    [addWordToStore, clearSentence, playSentence, logTap]
  )

  return {
    sentenceWords,
    addWord,
    removeLastWord,
    clearSentence,
    speak,
    handleQuickPhrase,
  }
}
