import { useState, useRef } from 'react'
import { exportVocabulary, importVocabulary, downloadAsFile } from '@/lib/backup'

interface BackupRestoreProps {
  onDone: () => void
}

export default function BackupRestore({ onDone: _onDone }: BackupRestoreProps) {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [confirmRestore, setConfirmRestore] = useState(false)
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleExport() {
    setIsLoading(true)
    try {
      const json = await exportVocabulary()
      const date = new Date().toISOString().split('T')[0]
      downloadAsFile(json, `suara-backup-${date}.json`)
      setStatus('Cadangan berhasil diunduh')
    } catch {
      setStatus('Gagal membuat cadangan')
    } finally {
      setIsLoading(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setRestoreFile(file)
      setConfirmRestore(true)
    }
  }

  async function handleRestore() {
    if (!restoreFile) return
    setIsLoading(true)
    try {
      const json = await restoreFile.text()
      await importVocabulary(json)
      setStatus('Data berhasil dipulihkan. Silakan muat ulang aplikasi.')
      setConfirmRestore(false)
      setRestoreFile(null)
    } catch {
      setStatus('Gagal memulihkan data. Format file tidak valid.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-4">Cadangan Data</h3>

      {status && (
        <div className="p-3 rounded-xl bg-suara-green-light text-suara-green text-sm font-bold mb-4">
          {status}
        </div>
      )}

      {/* Export */}
      <div className="p-4 rounded-xl bg-suara-gray-light mb-4">
        <h4 className="font-bold text-suara-gray text-sm mb-2">Cadangkan Kosakata</h4>
        <p className="text-xs text-suara-gray/60 mb-3">Unduh semua kata, folder, orang, dan frasa sebagai file JSON.</p>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms] disabled:opacity-50"
          type="button"
        >
          {isLoading ? 'Memproses...' : '💾 Cadangkan Sekarang'}
        </button>
      </div>

      {/* Import */}
      <div className="p-4 rounded-xl bg-suara-gray-light">
        <h4 className="font-bold text-suara-gray text-sm mb-2">Pulihkan dari Cadangan</h4>
        <p className="text-xs text-suara-gray/60 mb-3">Muat file cadangan JSON untuk memulihkan data. Peringatan: ini akan mengganti semua data saat ini.</p>

        {confirmRestore ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-suara-danger font-bold">⚠️ Yakin ingin memulihkan? Semua data saat ini akan diganti.</p>
            <div className="flex gap-2">
              <button
                onClick={handleRestore}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-suara-danger text-white font-bold text-sm disabled:opacity-50"
                type="button"
              >
                {isLoading ? 'Memulihkan...' : 'Ya, Pulihkan'}
              </button>
              <button
                onClick={() => { setConfirmRestore(false); setRestoreFile(null) }}
                className="flex-1 py-3 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-sm border border-suara-gray-border"
                type="button"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-suara-amber text-white font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms] disabled:opacity-50"
              type="button"
            >
              📂 Pilih File Cadangan
            </button>
          </>
        )}
      </div>
    </div>
  )
}
