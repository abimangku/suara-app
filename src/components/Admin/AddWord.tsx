import { useState, useMemo, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { usePhotoCapture } from '@/hooks/usePhotoCapture'
import PhotoCropPreview from '@/components/Admin/PhotoCropPreview'
import { db } from '@/lib/db'
import { audioEngine } from '@/lib/audio'

interface AddWordProps {
  onDone: () => void
}

export default function AddWord({ onDone }: AddWordProps) {
  const { pickAndCrop } = usePhotoCapture()
  const folders = useLiveQuery(() => db.folders.filter((f) => f.isActive).sortBy('sortOrder'))

  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
  const [label, setLabel] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null)
  const [step, setStep] = useState<'photo' | 'label' | 'folder' | 'confirm'>('photo')
  const [saving, setSaving] = useState(false)

  async function handlePickPhoto() {
    const blob = await pickAndCrop(200)
    if (blob) setPhotoBlob(blob)
  }

  function handlePreviewTTS() {
    audioEngine.fallbackTTS(label)
  }

  async function handleSave() {
    if (!label.trim() || !selectedFolderId) return
    setSaving(true)
    try {
      // Duplicate guard: check if word with same label exists in same folder
      const existing = await db.words
        .where('folderId')
        .equals(selectedFolderId)
        .filter((w) => w.label === label.trim() && w.isActive)
        .first()
      if (existing) {
        alert(`"${label.trim()}" sudah ada di folder ini.`)
        setSaving(false)
        return
      }
      const wordCount = await db.words.where('folderId').equals(selectedFolderId).count()
      await db.words.add({
        folderId: selectedFolderId,
        label: label.trim(),
        photoBlob: photoBlob ?? undefined,
        sortOrder: wordCount,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        source: 'family',
      })
      onDone()
    } catch {
      alert('Gagal menyimpan kata. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const photoBlobUrl = useMemo(() => {
    if (!photoBlob) return null
    return URL.createObjectURL(photoBlob)
  }, [photoBlob])

  useEffect(() => {
    return () => { if (photoBlobUrl) URL.revokeObjectURL(photoBlobUrl) }
  }, [photoBlobUrl])

  const selectedFolder = folders?.find((f) => f.id === selectedFolderId)

  // Step 1: Photo
  if (step === 'photo') {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <h3 className="text-lg font-bold text-suara-gray">Tambah Kata Baru</h3>
        <p className="text-sm text-suara-gray/60">Langkah 1: Pilih foto (opsional)</p>
        {photoBlob ? (
          <PhotoCropPreview
            blob={photoBlob}
            shape="square"
            onConfirm={() => setStep('label')}
            onRetake={() => setPhotoBlob(null)}
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 rounded-xl bg-suara-content-bg border-4 border-suara-gray-border flex items-center justify-center">
              <span className="text-4xl">📷</span>
            </div>
            <button
              onClick={handlePickPhoto}
              className="px-6 py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]"
              type="button"
            >
              Pilih Foto
            </button>
            <button
              onClick={() => setStep('label')}
              className="px-6 py-2 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]"
              type="button"
            >
              Lewati foto
            </button>
          </div>
        )}
      </div>
    )
  }

  // Step 2: Label
  if (step === 'label') {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <h3 className="text-lg font-bold text-suara-gray">Tambah Kata Baru</h3>
        <p className="text-sm text-suara-gray/60">Langkah 2: Masukkan kata</p>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Kata (contoh: martabak)"
          className="w-full max-w-sm px-4 py-3 rounded-xl border-2 border-suara-gray-border bg-white text-suara-gray font-bold text-base focus:outline-none focus:border-suara-blue"
          autoFocus
        />
        <div className="flex gap-3">
          <button onClick={() => setStep('photo')} className="px-5 py-2.5 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
          <button
            onClick={() => setStep('folder')}
            disabled={!label.trim()}
            className="px-5 py-2.5 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms] disabled:opacity-50"
            type="button"
          >
            Lanjut
          </button>
        </div>
      </div>
    )
  }

  // Step 3: Folder picker
  if (step === 'folder') {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <h3 className="text-lg font-bold text-suara-gray">Tambah Kata Baru</h3>
        <p className="text-sm text-suara-gray/60">Langkah 3: Pilih kategori</p>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {(folders ?? []).map((folder) => (
            <button
              key={folder.id}
              onClick={() => { setSelectedFolderId(folder.id!); setStep('confirm') }}
              className={`w-full text-left px-5 py-4 rounded-xl font-bold text-base active:scale-[0.98] transition-transform duration-[80ms] ${
                selectedFolderId === folder.id
                  ? 'bg-suara-blue-light text-suara-blue border-2 border-suara-blue-border'
                  : 'bg-suara-gray-light text-suara-gray border-2 border-transparent'
              }`}
              type="button"
            >
              {folder.emoji} {folder.label}
            </button>
          ))}
        </div>
        <button onClick={() => setStep('label')} className="px-5 py-2.5 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
      </div>
    )
  }

  // Step 4: Confirm
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <h3 className="text-lg font-bold text-suara-gray">Konfirmasi</h3>
      {photoBlob && (
        <img src={photoBlobUrl!} alt={label} className="w-24 h-24 rounded-xl object-cover border-2 border-suara-gray-border" />
      )}
      <p className="text-xl font-bold text-suara-gray">{label}</p>
      <p className="text-sm text-suara-gray/60">Kategori: {selectedFolder?.emoji} {selectedFolder?.label}</p>
      <button
        onClick={handlePreviewTTS}
        className="px-5 py-2 rounded-xl bg-suara-green-light text-suara-green font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]"
        type="button"
      >
        🔊 Dengar
      </button>
      <div className="flex gap-3">
        <button onClick={() => setStep('folder')} className="px-5 py-2.5 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms] disabled:opacity-50"
          type="button"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  )
}
