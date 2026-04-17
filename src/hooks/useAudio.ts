import { audioEngine } from '@/lib/audio'
import { useAppStore } from '@/store/appStore'
import type { Word } from '@/types'

export function useAudio() {
  function playWord(word: Word): void {
    // Sync haptic level from store (kept in sync for other code paths that may vibrate)
    const { hapticLevel } = useAppStore.getState()
    audioEngine.setHapticLevel(hapticLevel)
    // Haptic fires from SymbolButton.onPointerDown before this runs (for faster perceived response)

    // Note: isMuted guard was removed in v1.2.2 when the 🔊 mute button was
    // removed from SentenceBar. Device hardware volume now handles muting.
    // Leaving the old isMuted check in place would risk permanently silencing
    // the app if the state got stuck at true with no UI to toggle it back.

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
    const text = words.map((w) => w.label).join(' ')
    audioEngine.speakSentence(text)
  }

  return { playWord, playSentence }
}
