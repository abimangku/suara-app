import { useState, useRef } from 'react'
import WordChip from '@/components/SentenceBar/WordChip'
import QuickPhrases from '@/components/SentenceBar/QuickPhrases'
import BottomSheet from '@/components/shared/BottomSheet'
import { useSentenceBar } from '@/hooks/useSentenceBar'
import { useAppStore } from '@/store/appStore'

export default function SentenceBar() {
  const { sentenceWords, removeLastWord, clearSentence, speak, handleQuickPhrase, undoWord, restoreUndo } = useSentenceBar()
  const [isQuickPhrasesOpen, setIsQuickPhrasesOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const confirmClearRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openAdmin = useAppStore((s) => s.openAdmin)
  const isModelingMode = useAppStore((s) => s.isModelingMode)
  const toggleModelingMode = useAppStore((s) => s.toggleModelingMode)
  const sentenceHistory = useAppStore((s) => s.sentenceHistory)
  const isCaregiverPaneOpen = useAppStore((s) => s.isCaregiverPaneOpen)
  const toggleCaregiverPane = useAppStore((s) => s.toggleCaregiverPane)
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
          Mode Modeling — suara main, kalimat tidak bertambah
        </div>
      )}
      {undoWord && (
        <div className="absolute top-14 right-3 z-[60] flex items-center gap-2 bg-suara-gray text-white px-3 py-2 rounded-xl shadow-lg animate-fade-in text-sm font-bold">
          <span>Dihapus: "{undoWord.label}"</span>
          <button
            onClick={restoreUndo}
            className="px-3 py-1 rounded-lg bg-white text-suara-gray font-extrabold text-xs active:scale-[0.96] transition-transform"
            type="button"
            aria-label="Kembalikan kata"
          >
            ↶ Kembalikan
          </button>
        </div>
      )}
      <div
        className="w-full bg-suara-blue-bar flex items-center px-3 gap-2 shrink-0"
        style={{ minHeight: 56 }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
      >
        <button
          className="w-11 h-11 rounded-[10px] bg-white/20 text-white flex items-center justify-center shrink-0 active:scale-[0.96] transition-transform duration-[80ms] text-[22px] leading-none"
          onClick={() => setIsQuickPhrasesOpen(true)}
          type="button"
          aria-label="Frasa cepat"
        >
          ⚡
        </button>
        <button
          className="w-11 h-11 rounded-[10px] bg-white/20 text-white flex items-center justify-center shrink-0 active:scale-[0.96] transition-transform duration-[80ms] text-[22px] leading-none"
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          type="button"
          aria-label="Riwayat"
        >
          🕐
        </button>
        <button
          className={`w-11 h-11 rounded-[10px] text-white flex items-center justify-center shrink-0 active:scale-[0.96] transition-transform duration-[80ms] text-[22px] leading-none ${
            isCaregiverPaneOpen ? 'bg-white/40' : 'bg-white/20'
          }`}
          onClick={toggleCaregiverPane}
          type="button"
          aria-label={isCaregiverPaneOpen ? 'Tutup interpretasi' : 'Buka interpretasi'}
        >
          💬
        </button>
        {/* Visible admin affordance. The PIN gate is the real access control —
            this button just makes admin discoverable to a caregiver who doesn't
            know the 3-second long-press gesture. Primary user can tap but will
            only see the PIN pad. */}
        <button
          className="w-11 h-11 rounded-[10px] bg-white/15 text-white flex items-center justify-center shrink-0 active:scale-[0.96] transition-transform duration-[80ms] text-[20px] leading-none"
          onClick={openAdmin}
          type="button"
          aria-label="Pengaturan keluarga"
          title="Pengaturan keluarga"
        >
          ⚙️
        </button>

        <div
          className="flex-1 flex items-center gap-1.5 overflow-x-auto min-h-[40px] scrollbar-hide"
          role="region"
          aria-label="Kalimat yang sedang disusun"
          aria-live="polite"
          aria-atomic="true"
        >
          {sentenceWords.map((w, i) => (
            <WordChip key={`${w.id}-${i}`} label={w.label} isFlashing={isFlashing} />
          ))}
        </div>

        <button
          className="px-3.5 h-11 rounded-lg bg-white/15 text-white text-[18px] font-bold shrink-0 active:scale-[0.96] transition-transform duration-[80ms] leading-none flex items-center justify-center"
          onClick={removeLastWord}
          type="button"
          aria-label="Hapus kata terakhir"
        >
          ⌫
        </button>
        <button
          className={`px-3.5 h-11 rounded-lg text-[14px] font-bold shrink-0 active:scale-[0.96] transition-transform duration-[80ms] flex items-center justify-center ${
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
          className="px-5 h-11 rounded-xl bg-white text-suara-blue font-extrabold text-[16px] shrink-0 active:scale-[0.96] transition-transform duration-[80ms] flex items-center justify-center"
          onClick={() => {
            if (isModelingMode) {
              toggleModelingMode()
              return
            }
            handleBicara()
          }}
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

      <BottomSheet isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)}>
        <h2 className="text-suara-gray font-bold text-lg mb-3">Riwayat</h2>
        {sentenceHistory.length === 0 ? (
          <p className="text-sm text-suara-gray/50 py-4 text-center">Belum ada riwayat</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sentenceHistory.map((words, i) => (
              <button
                key={i}
                className="w-full text-left px-5 py-4 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-[16px] active:scale-[0.98] transition-transform duration-[80ms] select-none"
                onClick={() => {
                  handleQuickPhrase(words)
                  setIsHistoryOpen(false)
                }}
                type="button"
              >
                {words.join(' ')}
              </button>
            ))}
          </div>
        )}
      </BottomSheet>
    </>
  )
}
