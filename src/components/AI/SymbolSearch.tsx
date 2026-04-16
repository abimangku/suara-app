import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/appStore'
import { useSentenceBar } from '@/hooks/useSentenceBar'
import { searchSymbols, initializeSearch } from '@/lib/search'
import type { Word } from '@/types'

export default function SymbolSearch() {
  const isSearchOpen = useAppStore((s) => s.isSearchOpen)
  const toggleSearch = useAppStore((s) => s.toggleSearch)
  const { addWord } = useSentenceBar()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Word[]>([])
  const [initialized, setInitialized] = useState(false)

  // Initialize search index on first open
  useEffect(() => {
    if (isSearchOpen && !initialized) {
      initializeSearch().then(() => setInitialized(true))
    }
  }, [isSearchOpen, initialized])

  // Search as user types
  useEffect(() => {
    if (!initialized || !query.trim()) {
      setResults([])
      return
    }
    const matches = searchSymbols(query.trim(), 10)
    setResults(matches)
  }, [query, initialized])

  const handleSelect = useCallback(
    (word: Word) => {
      addWord(word)
      setQuery('')
      setResults([])
      toggleSearch()
    },
    [addWord, toggleSearch]
  )

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 z-[90] bg-suara-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-suara-blue-bar">
        <button
          onClick={() => { toggleSearch(); setQuery(''); setResults([]) }}
          className="h-12 px-4 rounded-lg bg-white/20 text-white flex items-center gap-2 shrink-0 active:scale-[0.96] transition-transform duration-[80ms] font-bold"
          type="button"
          aria-label="Kembali"
        >
          ← <span className="text-sm">Kembali</span>
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kata..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white text-suara-gray font-bold text-base focus:outline-none"
          autoFocus
        />
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto p-3">
        {query.trim() && results.length === 0 && initialized && (
          <div className="text-center py-12">
            <p className="text-suara-gray/50 font-bold">Tidak ditemukan</p>
            <p className="text-suara-gray/30 text-sm mt-1">Coba kata lain</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-6 gap-[10px]">
            {results.map((word) => (
              <button
                key={`${word.category}-${word.id}`}
                onClick={() => handleSelect(word)}
                className="rounded-button border-2 border-suara-gray-border bg-white flex flex-col items-center justify-center gap-1 p-3 cursor-pointer select-none active:scale-[0.96] transition-transform duration-[80ms]"
                type="button"
                style={{ minHeight: 90 }}
              >
                {word.symbolPath ? (
                  <img
                    src={`/assets/symbols/${word.symbolPath}`}
                    alt={word.label}
                    className="w-[52px] h-[52px] object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : word.emoji ? (
                  <span className="text-[34px]">{word.emoji}</span>
                ) : (
                  <span className="text-[34px]">&#x2753;</span>
                )}
                <span className="text-[18px] font-bold text-suara-gray text-center leading-tight" style={{ letterSpacing: '0.4px' }}>
                  {word.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {!query.trim() && (
          <div className="text-center py-12">
            <p className="text-suara-gray/40 font-bold">🔍</p>
            <p className="text-suara-gray/40 text-sm mt-2">Ketik untuk mencari kata</p>
          </div>
        )}
      </div>
    </div>
  )
}
