import { useState } from 'react'
import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import { FOLDERS } from '@/data/vocabulary'
import type { FolderKey, Word } from '@/types'

interface FolderContentsProps {
  folderKey: FolderKey
  onWordTap: (word: Word) => void
  onClose: () => void
}

export default function FolderContents({
  folderKey,
  onWordTap,
  onClose,
}: FolderContentsProps) {
  const [showAll, setShowAll] = useState(false)

  const folder = FOLDERS.find((f) => f.key === folderKey)
  if (!folder) return null

  const allWords = folder.words
  const hasMore = allWords.length > 5
  const visibleWords = showAll ? allWords : allWords.slice(0, hasMore ? 4 : 5)

  return (
    <>
      {/* Row 3: folder content words */}
      {visibleWords.map((fw) => (
        <SymbolButton
          key={fw.id}
          emoji={fw.emoji}
          label={fw.label}
          variant="fringe"
          onTap={() =>
            onWordTap({ id: fw.id, label: fw.label, category: 'fringe' })
          }
        />
      ))}

      {/* "lihat semua" button if folder has > 5 words and not showing all */}
      {hasMore && !showAll && (
        <SymbolButton
          emoji="➡️"
          label="lihat semua"
          variant="fringe"
          onTap={() => setShowAll(true)}
        />
      )}

      {/* Fill remaining slots if showing all and not a multiple of 5 */}
      {showAll &&
        Array.from({ length: (5 - (allWords.length % 5)) % 5 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

      {/* Row 4 (or final row): Kembali button — spans full width */}
      <button
        className="col-span-5 rounded-button border-2 border-suara-gray-border bg-suara-gray-light text-suara-gray flex items-center justify-center gap-2 cursor-pointer select-none active:scale-95 transition-transform duration-[80ms]"
        onClick={() => {
          setShowAll(false)
          onClose()
        }}
        type="button"
      >
        <span className="text-xl">←</span>
        <span className="text-[15px] font-bold">Kembali</span>
      </button>
    </>
  )
}
