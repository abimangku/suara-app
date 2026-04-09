import { audioEngine } from '@/lib/audio'
import type { Word } from '@/types'

export function useAudio() {
  function playWord(word: Word): void {
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
    const text = words.map((w) => w.label).join(' ')
    audioEngine.speakSentence(text)
  }

  return { playWord, playSentence }
}
