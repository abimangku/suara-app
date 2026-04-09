import { useAppStore } from '@/store/appStore'
import CoreRow from '@/components/SymbolGrid/CoreRow'
import PeopleRow from '@/components/SymbolGrid/PeopleRow'
import FolderRow from '@/components/SymbolGrid/FolderRow'
import FolderContents from '@/components/SymbolGrid/FolderContents'

export default function SymbolGrid() {
  const activeFolderKey = useAppStore((s) => s.activeFolderKey)

  return (
    <div className="flex-1 grid grid-cols-5 gap-[10px] p-3 min-h-0"
      style={{ gridAutoRows: '1fr' }}
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
