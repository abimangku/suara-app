import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { chatCompletion, isApiAvailable } from '@/lib/openrouter'

interface VocabSuggestion {
  word: string
  folder: string
  rationale: string
}

interface VocabSuggestionsProps {
  onDone: () => void
}

export default function VocabSuggestions({ onDone: _onDone }: VocabSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<VocabSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set())

  const folders = useLiveQuery(() => db.folders.filter((f) => f.isActive).sortBy('sortOrder'))
  const words = useLiveQuery(() => db.words.filter((w) => w.isActive).toArray())

  async function handleGenerate() {
    if (!isApiAvailable()) {
      setError('Membutuhkan koneksi internet')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Get usage data for context
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
      const events = await db.usageEvents.where('timestamp').above(cutoff).toArray()
      const wordCounts = new Map<string, number>()
      for (const e of events) {
        wordCounts.set(e.wordLabel, (wordCounts.get(e.wordLabel) ?? 0) + 1)
      }
      const topWords = Array.from(wordCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([w, c]) => `${w} (${c}x)`)

      const currentVocab = (words ?? []).map((w) => w.label)
      const folderNames = (folders ?? []).map((f) => `${f.emoji} ${f.label}`).join(', ')

      const result = await chatCompletion([
        {
          role: 'system',
          content: 'Kamu adalah ahli AAC yang membantu keluarga menambah kosakata. Berikan saran kata baru yang mungkin dibutuhkan anak ini. Format setiap saran: kata|folder|alasan (satu per baris). Folder harus salah satu dari yang tersedia. Fokus pada komunikasi sehari-hari untuk remaja autis di Indonesia.',
        },
        {
          role: 'user',
          content: `Kosakata saat ini (${currentVocab.length} kata): ${currentVocab.join(', ')}
Folder tersedia: ${folderNames}
Kata paling sering digunakan (30 hari): ${topWords.join(', ') || 'Belum ada data'}

Sarankan 10 kata baru yang mungkin dia butuhkan:`,
        },
      ], { maxTokens: 500, temperature: 0.5 })

      if (!result) {
        setError('Gagal mendapatkan saran')
        return
      }

      // Parse response
      const parsed: VocabSuggestion[] = result
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split('|').map((p) => p.trim())
          if (parts.length >= 3) {
            return { word: parts[0], folder: parts[1], rationale: parts[2] }
          }
          return null
        })
        .filter((s): s is VocabSuggestion => s !== null)
        .slice(0, 10)

      setSuggestions(parsed)
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddWord(suggestion: VocabSuggestion) {
    // Find the folder
    const folder = (folders ?? []).find(
      (f) => f.label.toLowerCase() === suggestion.folder.toLowerCase() ||
             f.key === suggestion.folder.toLowerCase()
    )
    if (!folder || !folder.id) return

    const wordCount = await db.words.where('folderId').equals(folder.id).count()
    await db.words.add({
      folderId: folder.id,
      label: suggestion.word,
      sortOrder: wordCount,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source: 'family',
    })

    setAddedWords((prev) => new Set(prev).add(suggestion.word))
  }

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-2">Saran Kosakata</h3>
      <p className="text-sm text-suara-gray/60 mb-4">
        AI akan menganalisis kosakata dan penggunaan saat ini, lalu menyarankan kata baru yang mungkin dibutuhkan.
      </p>

      {error && (
        <p className="text-sm text-suara-danger font-bold mb-3">{error}</p>
      )}

      {suggestions.length === 0 ? (
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms] disabled:opacity-50"
          type="button"
        >
          {isLoading ? 'Menganalisis...' : '🤖 Dapatkan Saran Kosakata'}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          {suggestions.map((s) => (
            <div key={s.word} className="p-4 rounded-xl bg-suara-gray-light">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-suara-gray text-base">{s.word}</span>
                <span className="text-xs text-suara-gray/50 bg-suara-content-bg px-2 py-0.5 rounded-full">
                  {s.folder}
                </span>
              </div>
              <p className="text-xs text-suara-gray/60 mb-2">{s.rationale}</p>
              {addedWords.has(s.word) ? (
                <span className="text-xs font-bold text-suara-green">✓ Ditambahkan</span>
              ) : (
                <button
                  onClick={() => handleAddWord(s)}
                  className="px-4 py-1.5 rounded-lg bg-suara-blue-bar text-white text-xs font-bold active:scale-95 transition-transform duration-[80ms]"
                  type="button"
                >
                  + Tambah
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => { setSuggestions([]); setAddedWords(new Set()) }}
            className="w-full py-3 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms]"
            type="button"
          >
            Minta Saran Baru
          </button>
        </div>
      )}
    </div>
  )
}
