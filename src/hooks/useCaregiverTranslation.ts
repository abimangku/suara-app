import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/store/appStore'
import { chatCompletion, isApiAvailable } from '@/lib/openrouter'

export function useCaregiverTranslation() {
  const sentenceWords = useAppStore((s) => s.sentenceWords)
  const [translation, setTranslation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (sentenceWords.length < 2) {
      setTranslation('')
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const words = sentenceWords.map((w) => w.label).join(' ')

      // Offline fallback: just join the words
      if (!isApiAvailable()) {
        setTranslation(words)
        return
      }

      setIsLoading(true)
      try {
        const result = await chatCompletion([
          {
            role: 'system',
            content:
              'Kamu adalah penerjemah AAC. Interpretasikan kata-kata yang diketuk oleh seorang wanita muda autis di Jakarta. Dia mengetuk simbol-simbol pada aplikasi AAC-nya. Berikan interpretasi singkat (1-2 kalimat) dalam Bahasa Indonesia tentang apa yang kemungkinan dia maksudkan. Kata-kata mungkin tidak dalam urutan gramatikal standar. Jangan gunakan tanda kutip. Mulai dengan "Dia mungkin ingin mengatakan:" jika kata-katanya ambigu.',
          },
          {
            role: 'user',
            content: `Kata-kata yang diketuk (berurutan): ${words}`,
          },
        ], { maxTokens: 100, temperature: 0.3 })

        setTranslation(result || words)
      } catch {
        setTranslation(words)
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [sentenceWords])

  return { translation, isLoading }
}
