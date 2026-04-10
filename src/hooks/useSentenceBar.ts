import { useCallback, useRef } from 'react'
import { useAppStore } from '@/store/appStore'
import { useAudio } from '@/hooks/useAudio'
import { checkForNewMilestones } from '@/lib/milestones'
import type { Word } from '@/types'

export function useSentenceBar() {
  const sentenceWords = useAppStore((s) => s.sentenceWords)
  const addWordToStore = useAppStore((s) => s.addWord)
  const storeRemoveLastWord = useAppStore((s) => s.removeLastWord)
  const undoRef = useRef<{ word: Word; time: number } | null>(null)
  const { playWord, playSentence } = useAudio()
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
        // In modeling mode: play no audio, don't add to sentence
        // Just return — the button highlight is handled by SymbolButton
        return
      }
      addWordToStore(word)
      playWord(word)
    },
    [addWordToStore, playWord]
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

    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current)
    clearTimeoutRef.current = setTimeout(() => {
      clearSentence()
    }, 1500)
  }, [playSentence, clearSentence])

  const handleQuickPhrase = useCallback(
    (words: string[]) => {
      const phraseWords: Word[] = words.map((w) => ({
        id: w,
        label: w,
        category: 'quickphrase' as const,
      }))
      clearSentence()
      for (const w of phraseWords) {
        addWordToStore(w)
      }
      setTimeout(() => {
        playSentence(phraseWords)
        if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current)
        clearTimeoutRef.current = setTimeout(() => {
          clearSentence()
        }, 1500)
      }, 500)
    },
    [addWordToStore, clearSentence, playSentence]
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
