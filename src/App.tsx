import { useState, useCallback, useRef } from 'react'
import SentenceBar from '@/components/SentenceBar/SentenceBar'
import SymbolGrid from '@/components/SymbolGrid/SymbolGrid'
import type { FolderKey, Word } from '@/types'

export default function App() {
  const [sentenceWords, setSentenceWords] = useState<Word[]>([])
  const [activeFolderKey, setActiveFolderKey] = useState<FolderKey>(null)
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Speak a single word via browser TTS
  const speakWord = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'id-ID'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }, [])

  // Speak the full sentence via browser TTS
  const speakSentence = useCallback((words: Word[]) => {
    const text = words.map((w) => w.label).join(' ')
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'id-ID'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }, [])

  // Handle word tap — add to sentence bar + speak
  const handleWordTap = useCallback(
    (word: Word) => {
      setSentenceWords((prev) => [...prev, word])
      speakWord(word.label)
    },
    [speakWord],
  )

  // Handle Bicara — speak full sentence, then clear after 1500ms
  const handleSpeak = useCallback(() => {
    if (sentenceWords.length === 0) return
    speakSentence(sentenceWords)
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current)
    clearTimeoutRef.current = setTimeout(() => {
      setSentenceWords([])
    }, 1500)
  }, [sentenceWords, speakSentence])

  // Handle quick phrase — populate + auto-speak after 500ms
  const handleQuickPhrase = useCallback(
    (words: string[]) => {
      const phraseWords: Word[] = words.map((w) => ({
        id: w,
        label: w,
        category: 'quickphrase' as const,
      }))
      setSentenceWords(phraseWords)
      setTimeout(() => {
        speakSentence(phraseWords)
        if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current)
        clearTimeoutRef.current = setTimeout(() => {
          setSentenceWords([])
        }, 1500)
      }, 500)
    },
    [speakSentence],
  )

  return (
    <div className="w-full h-full flex flex-col bg-suara-bg">
      <SentenceBar
        words={sentenceWords}
        onRemoveLast={() => setSentenceWords((prev) => prev.slice(0, -1))}
        onClear={() => setSentenceWords([])}
        onSpeak={handleSpeak}
        onQuickPhrase={handleQuickPhrase}
      />
      <SymbolGrid
        activeFolderKey={activeFolderKey}
        onFolderTap={(key) => setActiveFolderKey(key)}
        onFolderClose={() => setActiveFolderKey(null)}
        onWordTap={handleWordTap}
      />
    </div>
  )
}
