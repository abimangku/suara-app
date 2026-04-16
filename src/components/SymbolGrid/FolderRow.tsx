import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useAppStore } from '@/store/appStore'

export default function FolderRow() {
  const { folders } = useVocabulary()
  const setActiveFolder = useAppStore((s) => s.setActiveFolder)

  const folderList = folders ?? []
  const padCount = Math.max(0, 6 - folderList.length)

  return (
    <>
      {folderList.map((folder) => (
        <SymbolButton
          key={folder.key}
          emoji={folder.emoji}
          label={folder.label}
          variant="folder"
          onTap={() => setActiveFolder(folder.key)}
        />
      ))}
      {Array.from({ length: padCount }).map((_, i) => (
        <div key={`spacer-${i}`} aria-hidden="true" />
      ))}
    </>
  )
}
