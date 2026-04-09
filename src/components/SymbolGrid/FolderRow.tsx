import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import { FOLDERS } from '@/data/vocabulary'
import type { FolderKey } from '@/types'

interface FolderRowProps {
  onFolderTap: (folderKey: FolderKey) => void
}

export default function FolderRow({ onFolderTap }: FolderRowProps) {
  return (
    <>
      {FOLDERS.map((folder) => (
        <SymbolButton
          key={folder.key}
          emoji={folder.emoji}
          label={folder.label}
          variant="folder"
          onTap={() => onFolderTap(folder.key as FolderKey)}
        />
      ))}
    </>
  )
}
