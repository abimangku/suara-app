import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { togglePack } from '@/lib/vocabulary-packs'

interface VocabPackAdminProps {
  onDone: () => void
}

export default function VocabPackAdmin({ onDone: _onDone }: VocabPackAdminProps) {
  const packs = useLiveQuery(() => db.vocabularyPacks.toArray())
  const folders = useLiveQuery(() => db.folders.filter((f) => f.isActive).sortBy('sortOrder'))

  // Group packs by folder
  const packsByFolder = new Map<string, typeof packs>()
  if (packs && folders) {
    for (const folder of folders) {
      const folderPacks = packs.filter((p) => p.folderKey === folder.key)
      if (folderPacks.length > 0) {
        packsByFolder.set(folder.key, folderPacks)
      }
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-2">Paket Kosakata</h3>
      <p className="text-sm text-suara-gray/60 mb-4">Aktifkan atau nonaktifkan paket kata untuk mengatur kata yang ditampilkan.</p>

      {folders?.map((folder) => {
        const folderPacks = packsByFolder.get(folder.key)
        if (!folderPacks) return null
        return (
          <div key={folder.key} className="mb-4">
            <h4 className="text-sm font-bold text-suara-gray mb-2">{folder.emoji} {folder.label}</h4>
            <div className="flex flex-col gap-2">
              {folderPacks.map((pack) => (
                <div key={pack.id} className="flex items-center justify-between p-3 rounded-xl bg-suara-gray-light">
                  <div>
                    <span className="text-suara-gray font-bold text-sm">{pack.name}</span>
                    <span className="text-suara-gray/50 text-xs ml-2">({pack.wordIds.length} kata)</span>
                  </div>
                  <button
                    onClick={() => togglePack(pack.id!, !pack.isActive)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      pack.isActive
                        ? 'bg-suara-green-light text-suara-green'
                        : 'bg-suara-danger-light text-suara-danger'
                    }`}
                    type="button"
                  >
                    {pack.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
