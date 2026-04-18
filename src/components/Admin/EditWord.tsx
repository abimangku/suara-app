import { useState, useMemo, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { usePhotoCapture } from '@/hooks/usePhotoCapture'
import type { DbWord } from '@/types'

function WordImage({ photoBlob, symbolPath, label }: { photoBlob?: Blob; symbolPath?: string; label: string }) {
  const blobUrl = useMemo(() => photoBlob ? URL.createObjectURL(photoBlob) : null, [photoBlob])
  useEffect(() => { return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) } }, [blobUrl])

  if (blobUrl) return <img src={blobUrl} alt={label} className="w-10 h-10 rounded-lg object-cover" />
  if (symbolPath) return <img src={`/assets/symbols/${symbolPath}`} alt={label} className="w-10 h-10 object-contain" />
  return <div className="w-10 h-10 rounded-lg bg-suara-content-bg flex items-center justify-center text-lg">&#x2753;</div>
}

interface EditWordProps {
  onDone: () => void
  onAddWord: () => void
}

export default function EditWord({ onDone: _onDone, onAddWord }: EditWordProps) {
  const folders = useLiveQuery(() => db.folders.filter((f) => f.isActive).sortBy('sortOrder'))
  const [selectedFolderKey, setSelectedFolderKey] = useState<string | null>(null)
  const selectedFolder = folders?.find((f) => f.key === selectedFolderKey)
  const words = useLiveQuery(
    () => selectedFolder?.id ? db.words.where('folderId').equals(selectedFolder.id).filter((w) => w.isActive).sortBy('sortOrder') : [],
    [selectedFolder?.id]
  )
  const { pickAndCrop } = usePhotoCapture()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  async function handleUpdateLabel(id: number) {
    if (!editLabel.trim()) return
    try {
      await db.words.update(id, { label: editLabel.trim(), updatedAt: Date.now() })
      setEditingId(null)
      setEditLabel('')
    } catch {
      alert('Gagal menyimpan. Coba lagi.')
    }
  }

  async function handleUpdatePhoto(word: DbWord) {
    const blob = await pickAndCrop(200)
    if (blob && word.id) {
      try {
        await db.words.update(word.id, { photoBlob: blob, updatedAt: Date.now() })
      } catch {
        alert('Gagal menyimpan foto. Coba lagi.')
      }
    }
  }

  async function handleDelete(id: number) {
    try {
      await db.words.update(id, { isActive: false, updatedAt: Date.now() })
      setConfirmDeleteId(null)
    } catch {
      alert('Gagal menghapus. Coba lagi.')
    }
  }

  // Folder picker view
  if (!selectedFolderKey) {
    return (
      <div className="max-w-lg mx-auto">
        <h3 className="text-lg font-bold text-suara-gray mb-4">Kelola Kata</h3>
        <p className="text-sm text-suara-gray/60 mb-3">Pilih kategori:</p>
        <div className="flex flex-col gap-2 mb-4">
          {(folders ?? []).map((folder) => (
            <button
              key={folder.key}
              onClick={() => setSelectedFolderKey(folder.key)}
              className="w-full text-left px-5 py-4 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-base active:scale-[0.98] transition-transform duration-[80ms]"
              type="button"
            >
              {folder.emoji} {folder.label}
            </button>
          ))}
        </div>
        <button
          onClick={onAddWord}
          className="w-full py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms]"
          type="button"
        >
          + Tambah Kata Baru
        </button>
      </div>
    )
  }

  // Word list view
  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setSelectedFolderKey(null)}
          className="px-3 py-1.5 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm"
          type="button"
        >
          ←
        </button>
        <h3 className="text-lg font-bold text-suara-gray">{selectedFolder?.emoji} {selectedFolder?.label}</h3>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {(words ?? []).map((word) => (
          <div key={word.id} className="flex items-center gap-3 p-3 rounded-xl bg-suara-gray-light">
            <button onClick={() => handleUpdatePhoto(word)} className="shrink-0" type="button" title="Ganti foto">
              <WordImage photoBlob={word.photoBlob} symbolPath={word.symbolPath} label={word.label} />
            </button>

            {editingId === word.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-suara-blue-border bg-white text-suara-gray font-bold text-sm focus:outline-none"
                  autoFocus
                />
                <button onClick={() => handleUpdateLabel(word.id!)} className="px-3 py-2 rounded-lg bg-suara-blue-bar text-white text-xs font-bold" type="button">✓</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-2 rounded-lg bg-suara-gray-light text-suara-gray text-xs font-bold border border-suara-gray-border" type="button">✕</button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-suara-gray font-bold text-sm">{word.label}</span>
                <span className="text-xs text-suara-gray/40">{word.source}</span>
                <button onClick={() => { setEditingId(word.id!); setEditLabel(word.label) }} className="p-2 text-xs" type="button">✏️</button>
                {confirmDeleteId === word.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => handleDelete(word.id!)} className="px-2 py-1 rounded bg-suara-danger text-white text-xs font-bold" type="button">Hapus</button>
                    <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-1 rounded bg-suara-gray-light text-suara-gray text-xs font-bold" type="button">Batal</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(word.id!)} className="p-2 text-xs text-suara-danger" type="button">🗑️</button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onAddWord}
        className="w-full py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms]"
        type="button"
      >
        + Tambah Kata Baru
      </button>
    </div>
  )
}
