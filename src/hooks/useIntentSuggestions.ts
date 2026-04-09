import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/appStore'
import { computeSuggestions } from '@/lib/frequency'

export function useIntentSuggestions() {
  const sentenceWords = useAppStore((s) => s.sentenceWords)
  const setIntentSuggestions = useAppStore((s) => s.setIntentSuggestions)
  const isModelingMode = useAppStore((s) => s.isModelingMode)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear suggestions if less than 2 words or in modeling mode
    if (sentenceWords.length < 2 || isModelingMode) {
      setIntentSuggestions([])
      return
    }

    // Debounce to avoid rapid recalculation
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const suggestions = await computeSuggestions(sentenceWords, 3)
      setIntentSuggestions(suggestions)
    }, 100)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [sentenceWords, isModelingMode, setIntentSuggestions])
}
