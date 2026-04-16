class AudioEngine {
  private pool: Map<string, HTMLAudioElement> = new Map()
  private blobUrls: Map<string, string> = new Map()

  private _hapticMs: number = 10

  /**
   * Set haptic feedback duration.
   * off=0, light=10ms, medium=30ms, strong=50ms
   */
  setHapticLevel(level: 'off' | 'light' | 'medium' | 'strong'): void {
    const durations = { off: 0, light: 10, medium: 30, strong: 50 }
    this._hapticMs = durations[level] ?? 10
  }

  vibrate(): void {
    try {
      if (this._hapticMs > 0) navigator.vibrate?.(this._hapticMs)
    } catch {}
  }

  /**
   * Cached reference to the Indonesian voice, resolved once.
   * Avoids calling getVoices() on every tap (can be slow on some browsers).
   */
  private _idVoice: SpeechSynthesisVoice | null = null
  private _voiceResolved = false

  private resolveIndonesianVoice(): SpeechSynthesisVoice | null {
    if (this._voiceResolved) return this._idVoice
    try {
      const voices = speechSynthesis.getVoices()
      if (voices.length === 0) return null // Not loaded yet
      this._voiceResolved = true
      this._idVoice =
        voices.find((v) => v.lang === 'id-ID') ??
        voices.find((v) => v.lang?.startsWith('id')) ??
        null
      return this._idVoice
    } catch {
      return null
    }
  }

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
   * Play a word's audio — synchronous path to minimize latency.
   * Callers should call vibrate() themselves BEFORE this to fire haptic
   * at the earliest possible moment (see useAudio hook).
   * Uses cloneNode() for rapid re-taps of the same word.
   */
  play(id: string, label: string): void {
    const source = this.pool.get(id)
    if (source) {
      try {
        const clone = source.cloneNode(true) as HTMLAudioElement
        // Fire-and-forget play() — don't await; let it play while we return
        clone.play().catch(() => {
          // Audio file playback rejected — fall back to TTS
          this.fallbackTTS(label)
        })
        return
      } catch {
        // Pool entry broken — fall through to TTS
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
      this.play(word.id, word.label)
      if (i < words.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
    }
  }

  /**
   * Browser TTS fallback — Indonesian language, 0.85x speed.
   * Cancels any pending utterances first to avoid queue buildup delays.
   */
  fallbackTTS(text: string): void {
    try {
      // Cancel anything queued — prevents "waiting in line" latency
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel()
      }
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 0.85
      const voice = this.resolveIndonesianVoice()
      if (voice) utterance.voice = voice
      speechSynthesis.speak(utterance)
    } catch {
      // TTS unavailable
    }
  }

  /**
   * Speak a full sentence as one utterance via browser TTS.
   * Cancels any pending utterances first for immediate response.
   */
  speakSentence(text: string): void {
    try {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel()
      }
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 0.75
      const voice = this.resolveIndonesianVoice()
      if (voice) utterance.voice = voice
      speechSynthesis.speak(utterance)
    } catch {
      // TTS unavailable
    }
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
