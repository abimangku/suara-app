import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { audioEngine } from '@/lib/audio'

interface QuickPhraseAdminProps {
  onDone: () => void
}

export default function QuickPhraseAdmin({ onDone: _onDone }: QuickPhraseAdminProps) {
  const phrases = useLiveQuery(() => db.quickPhrases.filter((qp) => qp.isActive).sortBy('sortOrder'))
  const [isAdding, setIsAdding] = useState(false)
  const [newPhrase, setNewPhrase] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  async function handleAdd() {
    if (!newPhrase.trim()) return
    try {
      const count = await db.quickPhrases.filter((qp) => qp.isActive).count()
      await db.quickPhrases.add({
        phrase: newPhrase.trim(),
        words: newPhrase.trim().split(/\s+/),
        sortOrder: count,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      setNewPhrase('')
      setIsAdding(false)
    } catch {
      alert('Gagal menyimpan frasa. Coba lagi.')
    }
  }

  async function handleEdit(id: number) {
    if (!editText.trim()) return
    try {
      await db.quickPhrases.update(id, {
        phrase: editText.trim(),
        words: editText.trim().split(/\s+/),
        updatedAt: Date.now(),
      })
      setEditingId(null)
      setEditText('')
    } catch {
      alert('Gagal menyimpan. Coba lagi.')
    }
  }

  async function handleDelete(id: number) {
    try {
      await db.quickPhrases.update(id, { isActive: false, updatedAt: Date.now() })
    } catch {
      alert('Gagal menghapus. Coba lagi.')
    }
  }

  async function handleMoveUp(index: number) {
    if (!phrases || index <= 0) return
    try {
      const current = phrases[index]
      const above = phrases[index - 1]
      await db.transaction('rw', db.quickPhrases, async () => {
        await db.quickPhrases.update(current.id!, { sortOrder: above.sortOrder, updatedAt: Date.now() })
        await db.quickPhrases.update(above.id!, { sortOrder: current.sortOrder, updatedAt: Date.now() })
      })
    } catch {
      alert('Gagal mengubah urutan. Coba lagi.')
    }
  }

  async function handleMoveDown(index: number) {
    if (!phrases || index >= phrases.length - 1) return
    try {
      const current = phrases[index]
      const below = phrases[index + 1]
      await db.transaction('rw', db.quickPhrases, async () => {
        await db.quickPhrases.update(current.id!, { sortOrder: below.sortOrder, updatedAt: Date.now() })
        await db.quickPhrases.update(below.id!, { sortOrder: current.sortOrder, updatedAt: Date.now() })
      })
    } catch {
      alert('Gagal mengubah urutan. Coba lagi.')
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-4">Frasa Cepat</h3>

      <div className="flex flex-col gap-2 mb-4">
        {(phrases ?? []).map((qp, index) => (
          <div key={qp.id} className="flex items-center gap-2 p-3 rounded-xl bg-suara-gray-light">
            {editingId === qp.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-suara-blue-border bg-white text-suara-gray font-bold text-sm focus:outline-none"
                  autoFocus
                />
                <button onClick={() => handleEdit(qp.id!)} className="px-3 py-2 rounded-lg bg-suara-blue-bar text-white text-xs font-bold" type="button">✓</button>
                <button onClick={() => setEditingId(null)} className="px-3 py-2 rounded-lg bg-suara-gray-light text-suara-gray text-xs font-bold border border-suara-gray-border" type="button">✕</button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-suara-gray font-bold text-sm">{qp.phrase}</span>
                <button onClick={() => audioEngine.speakSentence(qp.phrase)} className="p-2 text-xs" title="Dengar" type="button">🔊</button>
                <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="p-2 text-xs disabled:opacity-30" title="Naik" type="button">↑</button>
                <button onClick={() => handleMoveDown(index)} disabled={index === (phrases?.length ?? 0) - 1} className="p-2 text-xs disabled:opacity-30" title="Turun" type="button">↓</button>
                <button onClick={() => { setEditingId(qp.id!); setEditText(qp.phrase) }} className="p-2 text-xs" title="Edit" type="button">✏️</button>
                <button onClick={() => handleDelete(qp.id!)} className="p-2 text-xs text-suara-danger" title="Hapus" type="button">🗑️</button>
              </>
            )}
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="flex gap-2">
          <input
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            placeholder="Ketik frasa baru..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-suara-blue-border bg-white text-suara-gray font-bold text-sm focus:outline-none"
            autoFocus
          />
          <button onClick={handleAdd} disabled={!newPhrase.trim()} className="px-4 py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm disabled:opacity-50" type="button">Simpan</button>
          <button onClick={() => { setIsAdding(false); setNewPhrase('') }} className="px-4 py-3 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-sm" type="button">Batal</button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms]"
          type="button"
        >
          + Tambah Frasa Baru
        </button>
      )}
    </div>
  )
}
