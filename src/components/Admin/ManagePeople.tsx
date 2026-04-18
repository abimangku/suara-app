import { useState, useMemo, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { usePhotoCapture } from '@/hooks/usePhotoCapture'
import AvatarCircle from '@/components/shared/AvatarCircle'
import type { DbPerson } from '@/types'

function PersonPhoto({ photoBlob, initial, name }: { photoBlob?: Blob; initial: string; name: string }) {
  const blobUrl = useMemo(() => photoBlob ? URL.createObjectURL(photoBlob) : null, [photoBlob])
  useEffect(() => { return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) } }, [blobUrl])

  if (blobUrl) return <img src={blobUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
  return <AvatarCircle initial={initial} size={48} />
}

interface ManagePeopleProps {
  onDone: () => void
  onAddPerson: () => void
}

export default function ManagePeople({ onDone: _onDone, onAddPerson }: ManagePeopleProps) {
  const people = useLiveQuery(() => db.people.filter((p) => p.isActive).sortBy('sortOrder'))
  const { pickAndCrop } = usePhotoCapture()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  async function handleUpdateName(id: number) {
    if (!editName.trim()) return
    try {
      await db.people.update(id, {
        name: editName.trim(),
        initial: editName.trim().charAt(0).toUpperCase(),
        updatedAt: Date.now(),
      })
      setEditingId(null)
      setEditName('')
    } catch {
      alert('Gagal menyimpan nama. Coba lagi.')
    }
  }

  async function handleUpdatePhoto(person: DbPerson) {
    const blob = await pickAndCrop(200)
    if (blob && person.id) {
      try {
        await db.people.update(person.id, { photoBlob: blob, updatedAt: Date.now() })
      } catch {
        alert('Gagal menyimpan foto. Coba lagi.')
      }
    }
  }

  async function handleDelete(id: number) {
    try {
      await db.people.update(id, { isActive: false, updatedAt: Date.now() })
      setConfirmDeleteId(null)
    } catch {
      alert('Gagal menghapus. Coba lagi.')
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-4">Kelola Orang</h3>

      <div className="flex flex-col gap-3 mb-4">
        {(people ?? []).map((person) => (
          <div key={person.id} className="flex items-center gap-3 p-3 rounded-xl bg-suara-gray-light">
            {/* Avatar */}
            <button onClick={() => handleUpdatePhoto(person)} className="shrink-0" type="button" title="Ganti foto">
              <PersonPhoto photoBlob={person.photoBlob} initial={person.initial} name={person.name} />
            </button>

            {/* Name / Edit */}
            {editingId === person.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-suara-blue-border bg-white text-suara-gray font-bold text-sm focus:outline-none"
                  autoFocus
                />
                <button onClick={() => handleUpdateName(person.id!)} className="px-3 py-2 rounded-lg bg-suara-blue-bar text-white text-xs font-bold" type="button">✓</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-2 rounded-lg bg-suara-gray-light text-suara-gray text-xs font-bold border border-suara-gray-border" type="button">✕</button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-suara-gray font-bold">{person.name}</span>
                <button onClick={() => { setEditingId(person.id!); setEditName(person.name) }} className="p-2 text-xs" title="Edit nama" type="button">✏️</button>
                {confirmDeleteId === person.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => handleDelete(person.id!)} className="px-2 py-1 rounded bg-suara-danger text-white text-xs font-bold" type="button">Hapus</button>
                    <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-1 rounded bg-suara-gray-light text-suara-gray text-xs font-bold" type="button">Batal</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(person.id!)} className="p-2 text-xs text-suara-danger" title="Hapus" type="button">🗑️</button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onAddPerson}
        className="w-full py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms]"
        type="button"
      >
        + Tambah Orang Baru
      </button>
    </div>
  )
}
