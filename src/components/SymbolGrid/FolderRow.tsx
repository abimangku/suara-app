import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useAppStore } from '@/store/appStore'

export default function FolderRow() {
  const { folders } = useVocabulary()
  const setActiveFolder = useAppStore((s) => s.setActiveFolder)

  return (
    <>
      {(folders ?? []).map((folder) => (
        <SymbolButton
          key={folder.key}
          emoji={folder.emoji}
          label={folder.label}
          variant="folder"
          onTap={() => setActiveFolder(folder.key)}
        />
      ))}
    </>
  )
}
