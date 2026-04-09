import { useMemo, useEffect } from 'react'

interface PhotoCropPreviewProps {
  blob: Blob
  shape: 'circle' | 'square'
  onConfirm: () => void
  onRetake: () => void
}

export default function PhotoCropPreview({
  blob,
  shape,
  onConfirm,
  onRetake,
}: PhotoCropPreviewProps) {
  const blobUrl = useMemo(() => URL.createObjectURL(blob), [blob])

  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl)
  }, [blobUrl])

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={blobUrl}
        alt="Foto yang dipilih"
        className={`w-40 h-40 object-cover ${
          shape === 'circle' ? 'rounded-full' : 'rounded-xl'
        } border-4 border-suara-blue-border`}
      />
      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="px-5 py-2.5 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-95 transition-transform duration-[80ms]"
          type="button"
        >
          Foto ulang
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-95 transition-transform duration-[80ms]"
          type="button"
        >
          Gunakan
        </button>
      </div>
    </div>
  )
}
