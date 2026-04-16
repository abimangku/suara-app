import { audioEngine } from '@/lib/audio'
import { useAppStore } from '@/store/appStore'
import type { Word } from '@/types'

export function useAudio() {
  function playWord(word: Word): void {
    // Sync haptic level from store — must happen before vibrate()
    const { isMuted, hapticLevel } = useAppStore.getState()
    audioEngine.setHapticLevel(hapticLevel)

    // Haptic fires IMMEDIATELY — always, even when muted (motor confirmation)
    // This runs synchronously so the user feels the tap before any audio work begins.
    audioEngine.vibrate()

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
