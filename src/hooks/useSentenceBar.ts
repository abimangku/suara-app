import { useCallback, useRef } from 'react'
import { useAppStore } from '@/store/appStore'
import { useAudio } from '@/hooks/useAudio'
import type { Word } from '@/types'

export function useSentenceBar() {
  const sentenceWords = useAppStore((s) => s.sentenceWords)
  const addWordToStore = useAppStore((s) => s.addWord)
  const removeLastWord = useAppStore((s) => s.removeLastWord)
  const clearSentence = useAppStore((s) => s.clearSentence)
  const { playWord, playSentence } = useAudio()
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    playSentence(words)
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
