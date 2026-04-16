import { audioEngine } from '@/lib/audio'
import { useAppStore } from '@/store/appStore'
import type { Word } from '@/types'

export function useAudio() {
  function playWord(word: Word): void {
    // Sync haptic level from store (kept in sync for other code paths that may vibrate)
    const { isMuted, hapticLevel } = useAppStore.getState()
    audioEngine.setHapticLevel(hapticLevel)
    // Haptic fires from SymbolButton.onPointerDown before this runs (for faster perceived response)

    if (isMuted) return

    // Kick off audio — fire-and-forget, no await
    if (word.audioBlob) {
      audioEngine.preloadFromBlob(word.id, word.audioBlob)
      audioEngine.play(word.id, word.label)
    } else if (word.audioPath) {
      audioEngine.preloadFromPaths([{ id: word.id, audioPath: word.audioPath }])
      audioEngine.play(word.id, word.label)
    } else {
      // No audio file — go straight to TTS (no double-vibrate, play() already skipped)
      audioEngine.fallbackTTS(word.label)
    }
  }

  function playSentence(words: Word[]): void {
    const isMuted = useAppStore.getState().isMuted
    if (isMuted) return

    const text = words.map((w) => w.label).join(' ')
    audioEngine.speakSentence(text)
  }

  return { playWord, playSentence }
}
