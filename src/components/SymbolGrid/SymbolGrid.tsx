import { useAppStore } from '@/store/appStore'
import CoreRow from '@/components/SymbolGrid/CoreRow'
import PeopleRow from '@/components/SymbolGrid/PeopleRow'
import FolderRow from '@/components/SymbolGrid/FolderRow'
import FolderContents from '@/components/SymbolGrid/FolderContents'

export default function SymbolGrid() {
  const activeFolderKey = useAppStore((s) => s.activeFolderKey)

  return (
    <div className="flex-1 grid grid-cols-6 gap-[8px] p-2 min-h-0 overflow-hidden"
      style={{ gridAutoRows: 'minmax(0, 1fr)' }}
      role="grid"
      aria-label="Papan komunikasi"
    >
      <CoreRow />
      {activeFolderKey === null ? (
        <>
          <PeopleRow />
          <FolderRow />
        </>
      ) : (
        <FolderContents folderKey={activeFolderKey} />
      )}
    </div>
  )
}
