import { useAppStore } from '@/store/appStore'
import CoreRow from '@/components/SymbolGrid/CoreRow'
import PeopleRow from '@/components/SymbolGrid/PeopleRow'
import FolderRow from '@/components/SymbolGrid/FolderRow'
import FolderContents from '@/components/SymbolGrid/FolderContents'

export default function SymbolGrid() {
  const activeFolderKey = useAppStore((s) => s.activeFolderKey)

  // Two modes:
  //  - Home: 4 core rows + people row + folder row = 6 rows, small/busy buttons
  //  - Inside a folder: NO core rows — just fringe words + Kembali. This gives
  //    fringe words the full vertical budget (~5 rows) instead of being
  //    squeezed into 1 row beneath the core. Auto-return-to-home (triggered
  //    when she taps a fringe word) means she never needs core while in the
  //    folder. Commercial AAC embeds core on fringe pages because they DON'T
  //    auto-return; our model is different and better for this.
  return (
    <div className="flex-1 grid grid-cols-6 gap-[6px] p-1.5 min-h-0 overflow-hidden"
      style={{ gridAutoRows: 'minmax(0, 1fr)' }}
      role="grid"
      aria-label="Papan komunikasi"
    >
      {activeFolderKey === null ? (
        <>
          <CoreRow />
          <PeopleRow />
          <FolderRow />
        </>
      ) : (
        <FolderContents folderKey={activeFolderKey} />
      )}
    </div>
  )
}
