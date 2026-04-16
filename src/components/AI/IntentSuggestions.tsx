import { useAppStore } from '@/store/appStore'
import { useSentenceBar } from '@/hooks/useSentenceBar'

export default function IntentSuggestions() {
  const suggestions = useAppStore((s) => s.intentSuggestions)
  const sentenceWords = useAppStore((s) => s.sentenceWords)
  const isModelingMode = useAppStore((s) => s.isModelingMode)
  const { addWord } = useSentenceBar()

  // Don't show if less than 2 words, modeling mode, or no suggestions
  // Reserve space (invisible placeholder) to prevent grid reflow — button sizes
  // must stay stable for motor planning.
  if (sentenceWords.length < 2 || isModelingMode || suggestions.length === 0) {
    return <div className="w-full h-[53px] shrink-0" aria-hidden="true" />
  }

  return (
    <div className="w-full flex items-center gap-2 px-3 py-1.5 bg-suara-bg border-b border-suara-gray-border">
      <span className="text-xs text-suara-gray/50 font-bold shrink-0">💡</span>
      {suggestions.map((word) => (
        <button
          key={word.id}
          onClick={() => addWord(word)}
          className="flex-1 px-3 py-2 rounded-xl bg-white border-2 border-suara-blue-border text-suara-blue font-bold text-sm text-center active:scale-[0.96] transition-transform duration-[80ms] truncate"
          type="button"
        >
          {word.label}
        </button>
      ))}
      {/* Fill empty slots to keep consistent width */}
      {Array.from({ length: 3 - suggestions.length }).map((_, i) => (
        <div key={`empty-${i}`} className="flex-1" />
      ))}
    </div>
  )
}
