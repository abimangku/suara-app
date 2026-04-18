import { CORE_WORDS, SEED_FOLDERS } from '@/data/vocabulary'
import { useAppStore } from '@/store/appStore'

const FK_LABELS: Record<string, string> = {
  verb: 'Kata kerja',
  pronoun: 'Kata ganti',
  descriptor: 'Kata sifat',
  negation: 'Negasi',
  preposition: 'Kata hubung',
}

const COL_LABELS = ['Siapa (WHO)', 'Lakukan (VERB)', 'Lakukan (VERB)', 'Sifat (DESCRIBE)', 'Hubung (CONNECT)']

interface WordVisibilityProps {
  onDone: () => void
}

/**
 * Progressive disclosure admin — caregivers toggle visibility of core words
 * and folders. Hidden words show as dashed placeholders on the grid (position
 * preserved for motor memory). Start simple → reveal more as she grows.
 */
export default function WordVisibility({ onDone: _onDone }: WordVisibilityProps) {
  const hiddenWords = useAppStore((s) => s.hiddenWords)
  const toggleWordVisibility = useAppStore((s) => s.toggleWordVisibility)

  // Group core words by column for display
  const columns: Array<{ label: string; words: typeof CORE_WORDS }> = []
  for (let col = 0; col < 5; col++) {
    columns.push({
      label: COL_LABELS[col],
      words: CORE_WORDS.filter((w) => w.position === col).sort((a, b) => a.row - b.row),
    })
  }

  const visibleCount = CORE_WORDS.length - CORE_WORDS.filter((w) => hiddenWords.includes(w.id)).length
  const totalCount = CORE_WORDS.length

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-1">Atur Tampilan Kata</h3>
      <p className="text-sm text-suara-gray/70 mb-1">
        Sembunyikan kata yang belum dibutuhkan. Posisi tetap terjaga — kata yang disembunyikan muncul sebagai kotak kosong.
        Tampilkan lagi kapan saja ketika dia siap.
      </p>
      <p className="text-xs text-suara-gray/50 mb-4">
        Terlihat: {visibleCount} / {totalCount} kata inti
      </p>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 min-w-[140px]">
            <div className="text-xs font-bold text-suara-gray/60 mb-2 text-center">{col.label}</div>
            <div className="flex flex-col gap-1">
              {col.words.map((w) => {
                const isHidden = hiddenWords.includes(w.id)
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWordVisibility(w.id)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-bold text-left flex items-center gap-2 active:scale-[0.97] transition-all ${
                      isHidden
                        ? 'bg-gray-100 text-gray-400 border border-dashed border-gray-300'
                        : 'bg-white text-suara-gray border-2 border-suara-gray-border'
                    }`}
                    type="button"
                  >
                    <span className="text-base">{isHidden ? '○' : '●'}</span>
                    <span>{w.emoji} {w.label}</span>
                    <span className="ml-auto text-[10px] text-suara-gray/40">{FK_LABELS[w.fkColor] ?? w.fkColor}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-suara-gray-border pt-3">
        <div className="text-xs font-bold text-suara-gray/60 mb-2">Folder</div>
        <div className="flex flex-wrap gap-2">
          {SEED_FOLDERS.map((f) => {
            const folderId = `folder:${f.key}`
            const isHidden = hiddenWords.includes(folderId)
            return (
              <button
                key={f.key}
                onClick={() => toggleWordVisibility(folderId)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 active:scale-[0.97] transition-all ${
                  isHidden
                    ? 'bg-gray-100 text-gray-400 border border-dashed border-gray-300'
                    : 'bg-white text-suara-gray border-2 border-suara-gray-border'
                }`}
                type="button"
              >
                <span className="text-base">{isHidden ? '○' : '●'}</span>
                <span>{f.emoji} {f.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
