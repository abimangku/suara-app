import { useState } from 'react'
import WordChip from '@/components/SentenceBar/WordChip'
import QuickPhrases from '@/components/SentenceBar/QuickPhrases'
import type { Word } from '@/types'

interface SentenceBarProps {
  words: Word[]
  onRemoveLast: () => void
  onClear: () => void
  onSpeak: () => void
  onQuickPhrase: (words: string[]) => void
}

export default function SentenceBar({
  words,
  onRemoveLast,
  onClear,
  onSpeak,
  onQuickPhrase,
}: SentenceBarProps) {
  const [isQuickPhrasesOpen, setIsQuickPhrasesOpen] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)

  function handleBicara() {
    if (words.length === 0) return
    setIsFlashing(true)
    onSpeak()
    setTimeout(() => setIsFlashing(false), 150)
  }

  return (
    <>
      <div className="w-full bg-suara-blue-bar flex items-center px-3.5 gap-2 shrink-0" style={{ minHeight: 60 }}>
        {/* Quick phrases button */}
        <button
          className="w-10 h-10 rounded-[10px] bg-white/20 text-white flex items-center justify-center text-lg shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={() => setIsQuickPhrasesOpen(true)}
          type="button"
          aria-label="Frasa cepat"
        >
          ⚡
        </button>

        {/* Word chips area */}
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto min-h-[40px] scrollbar-hide">
          {words.map((w, i) => (
            <WordChip key={`${w.id}-${i}`} label={w.label} isFlashing={isFlashing} />
          ))}
        </div>

        {/* Controls — always visible */}
        <button
          className="px-3 py-2 rounded-lg bg-white/15 text-white text-[13px] font-bold shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={onRemoveLast}
          type="button"
          aria-label="Hapus kata terakhir"
        >
          ⌫
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-white/15 text-red-300 text-[13px] font-bold shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={onClear}
          type="button"
          aria-label="Hapus semua"
        >
          ✕ Hapus
        </button>
        <button
          className="px-5 py-2.5 rounded-xl bg-white text-suara-blue font-extrabold text-[15px] shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={handleBicara}
          type="button"
          aria-label="Bicara"
        >
          ▶ Bicara
        </button>
      </div>

      <QuickPhrases
        isOpen={isQuickPhrasesOpen}
        onClose={() => setIsQuickPhrasesOpen(false)}
        onPhraseTap={onQuickPhrase}
      />
    </>
  )
}
