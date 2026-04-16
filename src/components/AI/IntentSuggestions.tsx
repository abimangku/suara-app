import { useAppStore } from '@/store/appStore'
import { useSentenceBar } from '@/hooks/useSentenceBar'

export default function IntentSuggestions() {
  const suggestions = useAppStore((s) => s.intentSuggestions)
  const sentenceWords = useAppStore((s) => s.sentenceWords)
  const isModelingMode = useAppStore((s) => s.isModelingMode)
  const { addWord } = useSentenceBar()

  // Don't show if less than 2 words, modeling mode, or no suggestions.
  // On Tab A11's 600 px landscape viewport there isn't room for a reserved
  // placeholder AND the full 6-row grid — a 53 px reservation pushed the folder
  // row off screen. We accept a small (~8 %) button reflow when suggestions
  // appear after 2+ taps; positions stay fixed so motor memory is preserved.
  if (sentenceWords.length < 2 || isModelingMode || suggestions.length === 0) {
    return null
  }

  return (
    <div
      className="w-full flex items-center gap-2 px-3 py-1 bg-suara-bg border-b border-suara-gray-border shrink-0"
      style={{ minHeight: 40 }}
    >
      <span className="text-xs text-suara-gray/50 font-bold shrink-0">💡</span>
      {suggestions.map((word) => (
        <button
          key={word.id}
          onClick={() => addWord(word)}
          className="flex-1 px-3 py-1.5 rounded-xl bg-white border-2 border-suara-blue-border text-suara-blue font-bold text-sm text-center active:scale-[0.96] transition-transform duration-[80ms] truncate"
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
