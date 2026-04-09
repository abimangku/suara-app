import CoreRow from '@/components/SymbolGrid/CoreRow'
import PeopleRow from '@/components/SymbolGrid/PeopleRow'
import FolderRow from '@/components/SymbolGrid/FolderRow'
import FolderContents from '@/components/SymbolGrid/FolderContents'
import type { FolderKey, Word } from '@/types'

interface SymbolGridProps {
  activeFolderKey: FolderKey
  onFolderTap: (key: FolderKey) => void
  onFolderClose: () => void
  onWordTap: (word: Word) => void
}

export default function SymbolGrid({
  activeFolderKey,
  onFolderTap,
  onFolderClose,
  onWordTap,
}: SymbolGridProps) {
  return (
    <div className="flex-1 grid grid-cols-5 gap-[10px] p-3 min-h-0"
      style={{ gridAutoRows: '1fr' }}
    >
      {/* Rows 1-2: Core words — always visible, never replaced */}
      <CoreRow onWordTap={onWordTap} />

      {/* Rows 3-4: People + Folders (home) or FolderContents (folder open) */}
      {activeFolderKey === null ? (
        <>
          <PeopleRow onWordTap={onWordTap} />
          <FolderRow onFolderTap={onFolderTap} />
        </>
      ) : (
        <FolderContents
          folderKey={activeFolderKey}
          onWordTap={onWordTap}
          onClose={onFolderClose}
        />
      )}
    </div>
  )
}
