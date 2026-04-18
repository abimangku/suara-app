import { useAppStore } from '@/store/appStore'
import HomeGrid from '@/components/SymbolGrid/HomeGrid'
import FolderContents from '@/components/SymbolGrid/FolderContents'
import PeopleContents from '@/components/SymbolGrid/PeopleContents'

export default function SymbolGrid() {
  const activeFolderKey = useAppStore((s) => s.activeFolderKey)

  return (
    <div className="flex-1 grid grid-cols-6 gap-[6px] p-1.5 min-h-0 overflow-hidden"
      style={{ gridAutoRows: 'minmax(0, 1fr)' }}
      role="grid"
      aria-label="Papan komunikasi"
    >
      {activeFolderKey === null ? (
        <HomeGrid />
      ) : activeFolderKey === 'orang' ? (
        <PeopleContents />
      ) : (
        <FolderContents folderKey={activeFolderKey} />
      )}
    </div>
  )
}
