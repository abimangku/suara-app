import { useState } from 'react'
import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import { useVocabulary, useFolderWords } from '@/hooks/useVocabulary'
import { useSentenceBar } from '@/hooks/useSentenceBar'
import { useAppStore } from '@/store/appStore'

interface FolderContentsProps {
  folderKey: string
}

export default function FolderContents({ folderKey }: FolderContentsProps) {
  const [showAll, setShowAll] = useState(false)
  const { folders } = useVocabulary()
  const { addWord } = useSentenceBar()
  const setActiveFolder = useAppStore((s) => s.setActiveFolder)

  const folder = (folders ?? []).find((f) => f.key === folderKey)
  const allWords = useFolderWords(folder?.id)

  if (!folder) return null

  const hasMore = allWords.length > 6
  const visibleWords = showAll ? allWords : allWords.slice(0, hasMore ? 5 : 6)

  return (
    <>
      {visibleWords.map((fw) => (
        <SymbolButton
          key={fw.id}
          emoji=""
          label={fw.labelDisplay ?? fw.label}
          variant="fringe"
          symbolPath={fw.symbolPath}
          photoBlob={fw.photoBlob}
          onTap={() =>
            addWord({
              id: String(fw.id),
              label: fw.label,
              category: 'fringe',
              symbolPath: fw.symbolPath,
              photoBlob: fw.photoBlob,
              audioPath: fw.audioPath,
              audioBlob: fw.audioBlob,
            })
          }
        />
      ))}

      {hasMore && !showAll && (
        <SymbolButton
          emoji="➡️"
          label="lihat semua"
          variant="fringe"
          onTap={() => setShowAll(true)}
        />
      )}

      {showAll &&
        Array.from({ length: (6 - (allWords.length % 6)) % 6 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

      <button
        className="col-span-6 rounded-button border-2 border-suara-gray-border bg-suara-gray-light text-suara-gray flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.96] transition-transform duration-[80ms]"
        onClick={() => {
          setShowAll(false)
          setActiveFolder(null)
        }}
        type="button"
      >
        <span className="text-xl">←</span>
        <span className="text-[15px] font-bold">Kembali</span>
      </button>
    </>
  )
}
