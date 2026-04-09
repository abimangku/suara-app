import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import type { FKColor } from '@/types'

interface SymbolButtonProps {
  emoji?: string
  label: string
  variant: 'core' | 'people' | 'folder' | 'fringe' | 'kembali'
  onTap: () => void
  isActive?: boolean
  disabled?: boolean
  children?: React.ReactNode
  symbolPath?: string
  photoBlob?: Blob
  fkColor?: FKColor
}

const variantStyles = {
  core: 'bg-suara-blue-light border-suara-blue-border text-suara-blue',
  people: 'bg-suara-green-light border-suara-green-border text-suara-green',
  folder: 'bg-suara-gray-light border-suara-gray-border text-suara-gray',
  fringe: 'bg-suara-content-bg border-suara-gray-border text-suara-content',
  kembali: 'bg-suara-gray-light border-suara-gray-border text-suara-gray',
}

export default function SymbolButton({
  emoji,
  label,
  variant,
  onTap,
  isActive = false,
  disabled = false,
  children,
  symbolPath,
  photoBlob,
  fkColor: _fkColor,
}: SymbolButtonProps) {
  const isModelingMode = useAppStore((s) => s.isModelingMode)
  const [isHighlighted, setIsHighlighted] = useState(false)

  const blobUrl = useMemo(() => {
    if (!photoBlob) return null
    return URL.createObjectURL(photoBlob)
  }, [photoBlob])

  useEffect(() => {
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [blobUrl])

  const baseClasses =
    'rounded-button border-2 flex flex-col items-center justify-center gap-1 cursor-pointer select-none active:scale-95 transition-transform duration-[80ms]'

  const activeClass = isActive ? 'brightness-[0.85]' : ''
  const disabledClass = disabled ? 'opacity-50 cursor-default' : ''
  const highlightClass = isHighlighted ? 'ring-4 ring-suara-amber brightness-110' : ''

  const [imgFailed, setImgFailed] = useState(false)

  // Determine what to render in the image area
  // Priority: children > photoBlob > symbolPath (if file exists) > emoji > fallback
  function renderImage() {
    if (children) return children
    if (blobUrl) {
      return <img src={blobUrl} alt={label} className="w-[50px] h-[50px] object-cover rounded-lg" />
    }
    if (symbolPath && !imgFailed) {
      return (
        <img
          src={`/assets/symbols/${symbolPath}`}
          alt={label}
          className="w-[50px] h-[50px] object-contain"
          onError={() => setImgFailed(true)}
        />
      )
    }
    if (emoji) {
      return <span className="text-[34px] leading-tight">{emoji}</span>
    }
    return <span className="text-[34px] leading-tight">❓</span>
  }

  return (
    <button
      className={`${baseClasses} ${variantStyles[variant]} ${activeClass} ${disabledClass} ${highlightClass}`}
      onClick={() => {
        if (disabled) return
        if (isModelingMode) {
          // Visual highlight only — no audio, no sentence
          setIsHighlighted(true)
          setTimeout(() => setIsHighlighted(false), 500)
        }
        onTap()
      }}
      type="button"
    >
      {renderImage()}
      <span className="text-[15px] font-bold leading-tight text-center px-1">
        {label}
      </span>
    </button>
  )
}
