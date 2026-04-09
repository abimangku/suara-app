import { useState } from 'react'
import WordChip from '@/components/SentenceBar/WordChip'
import QuickPhrases from '@/components/SentenceBar/QuickPhrases'
import { useSentenceBar } from '@/hooks/useSentenceBar'

export default function SentenceBar() {
  const { sentenceWords, removeLastWord, clearSentence, speak, handleQuickPhrase } = useSentenceBar()
  const [isQuickPhrasesOpen, setIsQuickPhrasesOpen] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)

  function handleBicara() {
    if (sentenceWords.length === 0) return
    setIsFlashing(true)
    speak()
    setTimeout(() => setIsFlashing(false), 150)
  }

  return (
    <>
      <div className="w-full bg-suara-blue-bar flex items-center px-3.5 gap-2 shrink-0" style={{ minHeight: 60 }}>
        <button
          className="w-10 h-10 rounded-[10px] bg-white/20 text-white flex items-center justify-center text-lg shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={() => setIsQuickPhrasesOpen(true)}
          type="button"
          aria-label="Frasa cepat"
        >
          ⚡
        </button>

        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto min-h-[40px] scrollbar-hide">
          {sentenceWords.map((w, i) => (
            <WordChip key={`${w.id}-${i}`} label={w.label} isFlashing={isFlashing} />
          ))}
        </div>

        <button
          className="px-3 py-2 rounded-lg bg-white/15 text-white text-[13px] font-bold shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={removeLastWord}
          type="button"
          aria-label="Hapus kata terakhir"
        >
          ⌫
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-white/15 text-red-300 text-[13px] font-bold shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={clearSentence}
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
        onPhraseTap={handleQuickPhrase}
      />
    </>
  )
}
