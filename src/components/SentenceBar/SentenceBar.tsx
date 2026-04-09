import { useState, useRef } from 'react'
import WordChip from '@/components/SentenceBar/WordChip'
import QuickPhrases from '@/components/SentenceBar/QuickPhrases'
import { useSentenceBar } from '@/hooks/useSentenceBar'
import { useAppStore } from '@/store/appStore'

export default function SentenceBar() {
  const { sentenceWords, removeLastWord, clearSentence, speak, handleQuickPhrase } = useSentenceBar()
  const [isQuickPhrasesOpen, setIsQuickPhrasesOpen] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const confirmClearRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openAdmin = useAppStore((s) => s.openAdmin)
  const toggleSearch = useAppStore((s) => s.toggleSearch)
  const isModelingMode = useAppStore((s) => s.isModelingMode)
  const toggleModelingMode = useAppStore((s) => s.toggleModelingMode)
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const modelingPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleBicaraPressStart = () => {
    modelingPressRef.current = setTimeout(() => {
      toggleModelingMode()
    }, 2000)
  }

  const handleBicaraPressEnd = () => {
    if (modelingPressRef.current) {
      clearTimeout(modelingPressRef.current)
      modelingPressRef.current = null
    }
  }

  const handlePressStart = () => {
    longPressRef.current = setTimeout(() => {
      openAdmin()
    }, 3000)
  }

  const handlePressEnd = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
  }

  function handleClear() {
    if (confirmClear) {
      clearSentence()
      setConfirmClear(false)
      if (confirmClearRef.current) clearTimeout(confirmClearRef.current)
      return
    }
    setConfirmClear(true)
    confirmClearRef.current = setTimeout(() => {
      setConfirmClear(false)
    }, 1500)
  }

  function handleBicara() {
    if (sentenceWords.length === 0) return
    setIsFlashing(true)
    speak()
    setTimeout(() => setIsFlashing(false), 150)
  }

  return (
    <>
      {isModelingMode && (
        <div className="w-full px-3 py-1 bg-suara-amber-light text-suara-amber text-xs font-bold text-center">
          Mode Modeling — ketuk tombol untuk menunjukkan, tanpa suara
        </div>
      )}
      <div
        className="w-full bg-suara-blue-bar flex items-center px-3.5 gap-2 shrink-0"
        style={{ minHeight: 60 }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
      >
        <button
          className="w-10 h-10 rounded-[10px] bg-white/20 text-white flex items-center justify-center text-lg shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={() => setIsQuickPhrasesOpen(true)}
          type="button"
          aria-label="Frasa cepat"
        >
          ⚡
        </button>
        <button
          className="w-10 h-10 rounded-[10px] bg-white/20 text-white flex items-center justify-center text-lg shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={toggleSearch}
          type="button"
          aria-label="Cari kata"
        >
          🔍
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
          className={`px-3 py-2 rounded-lg text-[13px] font-bold shrink-0 active:scale-95 transition-transform duration-[80ms] ${
            confirmClear
              ? 'bg-suara-danger text-white'
              : 'bg-white/15 text-red-300'
          }`}
          onClick={handleClear}
          type="button"
          aria-label="Hapus semua"
        >
          {confirmClear ? 'Yakin?' : '✕ Hapus'}
        </button>
        <button
          className="px-5 py-2.5 rounded-xl bg-white text-suara-blue font-extrabold text-[15px] shrink-0 active:scale-95 transition-transform duration-[80ms]"
          onClick={handleBicara}
          onMouseDown={handleBicaraPressStart}
          onMouseUp={handleBicaraPressEnd}
          onMouseLeave={handleBicaraPressEnd}
          onTouchStart={handleBicaraPressStart}
          onTouchEnd={handleBicaraPressEnd}
          onTouchCancel={handleBicaraPressEnd}
          type="button"
          aria-label="Bicara"
        >
          {isModelingMode ? '■ Hentikan' : '▶ Bicara'}
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
