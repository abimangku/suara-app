import { useState, useMemo, useEffect } from 'react'
import { usePhotoCapture } from '@/hooks/usePhotoCapture'
import PhotoCropPreview from '@/components/Admin/PhotoCropPreview'
import { db } from '@/lib/db'

interface AddPersonProps {
  onDone: () => void
}

export default function AddPerson({ onDone }: AddPersonProps) {
  const { pickAndCrop } = usePhotoCapture()
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
  const [name, setName] = useState('')
  const [step, setStep] = useState<'photo' | 'name'>('photo')
  const [saving, setSaving] = useState(false)

  const photoBlobUrl = useMemo(() => {
    if (!photoBlob) return null
    return URL.createObjectURL(photoBlob)
  }, [photoBlob])

  useEffect(() => {
    return () => { if (photoBlobUrl) URL.revokeObjectURL(photoBlobUrl) }
  }, [photoBlobUrl])

  async function handlePickPhoto() {
    const blob = await pickAndCrop(200)
    if (blob) {
      setPhotoBlob(blob)
    }
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      // Duplicate guard: check if person with same name already exists
      const existing = await db.people.filter((p) => p.name === name.trim() && p.isActive).first()
      if (existing) {
        alert(`"${name.trim()}" sudah ada. Gunakan nama yang berbeda.`)
        setSaving(false)
        return
      }
      const lastPerson = await db.people.orderBy('sortOrder').last()
      const nextOrder = (lastPerson?.sortOrder ?? -1) + 1
      await db.people.add({
        name: name.trim(),
        initial: name.trim().charAt(0).toUpperCase(),
        photoBlob: photoBlob ?? undefined,
        sortOrder: nextOrder,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      onDone()
    } catch {
      alert('Gagal menyimpan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  if (step === 'photo') {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <h3 className="text-lg font-bold text-suara-gray">Tambah Orang Baru</h3>
        <p className="text-sm text-suara-gray/60">Langkah 1: Pilih foto (opsional)</p>

        {photoBlob ? (
          <PhotoCropPreview
            blob={photoBlob}
            shape="circle"
            onConfirm={() => setStep('name')}
            onRetake={() => setPhotoBlob(null)}
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 rounded-full bg-suara-green-light border-4 border-suara-green-border flex items-center justify-center">
              <span className="text-4xl text-suara-green">📷</span>
            </div>
            <button
              onClick={handlePickPhoto}
              className="px-6 py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]"
              type="button"
            >
              Pilih Foto
            </button>
            <button
              onClick={() => setStep('name')}
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

  // Step 2: Name input
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <h3 className="text-lg font-bold text-suara-gray">Tambah Orang Baru</h3>
      <p className="text-sm text-suara-gray/60">Langkah 2: Masukkan nama</p>

      {photoBlob && (
        <img
          src={photoBlobUrl!}
          alt="Foto"
          className="w-20 h-20 rounded-full object-cover border-2 border-suara-green-border"
        />
      )}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama (contoh: Tante Ani)"
        className="w-full max-w-sm px-4 py-3 rounded-xl border-2 border-suara-gray-border bg-white text-suara-gray font-bold text-base focus:outline-none focus:border-suara-blue"
        autoFocus
      />

      <div className="flex gap-3">
        <button
          onClick={() => setStep('photo')}
          className="px-5 py-2.5 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]"
          type="button"
        >
          ← Kembali
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="px-5 py-2.5 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms] disabled:opacity-50"
          type="button"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  )
}
