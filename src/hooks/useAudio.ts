import { audioEngine } from '@/lib/audio'
import { useAppStore } from '@/store/appStore'
import type { Word } from '@/types'

export function useAudio() {
  function playWord(word: Word): void {
    // Sync haptic level from store to audio engine
    const { isMuted, hapticLevel } = useAppStore.getState()
    audioEngine.setHapticLevel(hapticLevel)

    // Always vibrate (even when muted — motor confirmation)
    audioEngine.vibrate()

    if (isMuted) return

    if (word.audioBlob) {
      audioEngine.preloadFromBlob(word.id, word.audioBlob)
      audioEngine.play(word.id, word.label)
    } else if (word.audioPath) {
      audioEngine.preloadFromPaths([{ id: word.id, audioPath: word.audioPath }])
      audioEngine.play(word.id, word.label)
    } else {
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
