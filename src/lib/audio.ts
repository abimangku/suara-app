class AudioEngine {
  private pool: Map<string, HTMLAudioElement> = new Map()
  private blobUrls: Map<string, string> = new Map()

  /**
   * Preload audio files from static asset paths.
   * Called on app init for core words and on folder open for fringe words.
   */
  preloadFromPaths(items: Array<{ id: string; audioPath: string }>): void {
    for (const item of items) {
      if (this.pool.has(item.id)) continue
      const audio = new Audio(`/assets/audio/${item.audioPath}`)
      audio.preload = 'auto'
      audio.load()
      this.pool.set(item.id, audio)
    }
  }

  /**
   * Preload audio from a Blob (for MeloTTS-generated audio stored in IndexedDB).
   */
  preloadFromBlob(id: string, blob: Blob): void {
    if (this.pool.has(id)) return
    const url = URL.createObjectURL(blob)
    this.blobUrls.set(id, url)
    const audio = new Audio(url)
    audio.preload = 'auto'
    audio.load()
    this.pool.set(id, audio)
  }

  /**
   * Play a word's audio. Falls back to browser TTS if not in pool.
   * Uses cloneNode() for rapid re-taps of the same word.
   */
  async play(id: string, label: string): Promise<void> {
    const source = this.pool.get(id)
    if (source) {
      try {
        const clone = source.cloneNode(true) as HTMLAudioElement
        await clone.play()
        return
      } catch {
        // Audio file failed to play — fall through to TTS
      }
    }
    this.fallbackTTS(label)
  }

  /**
   * Play a sequence of words for sentence playback.
   * 200ms gap between words.
   */
  async playSequence(words: Array<{ id: string; label: string }>): Promise<void> {
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      await this.play(word.id, word.label)
      if (i < words.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
    }
  }

  /**
   * Browser TTS fallback — Indonesian language, 0.9x speed.
   */
  fallbackTTS(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'id-ID'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  /**
   * Speak a full sentence as one utterance via browser TTS.
   */
  speakSentence(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'id-ID'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  /**
   * Cleanup — revoke all blob URLs and clear pool.
   */
  dispose(): void {
    for (const url of this.blobUrls.values()) {
      URL.revokeObjectURL(url)
    }
    this.blobUrls.clear()
    this.pool.clear()
  }
}

export const audioEngine = new AudioEngine()
