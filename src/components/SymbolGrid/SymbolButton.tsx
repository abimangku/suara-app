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

const fkStyles: Record<string, string> = {
  verb: 'bg-fk-verb-light border-fk-verb-border text-fk-verb',
  pronoun: 'bg-fk-pronoun-light border-fk-pronoun-border text-fk-pronoun',
  descriptor: 'bg-fk-descriptor-light border-fk-descriptor-border text-fk-descriptor',
  negation: 'bg-fk-negation-light border-fk-negation-border text-fk-negation',
  noun: 'bg-fk-noun-light border-fk-noun-border text-fk-noun',
  preposition: 'bg-fk-preposition-light border-fk-preposition-border text-fk-preposition',
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
  fkColor,
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
    'rounded-button border-2 flex flex-col items-center justify-center gap-1 cursor-pointer select-none active:scale-[0.96] transition-transform duration-[80ms]'

  const activeClass = isActive ? 'brightness-[0.85]' : ''
  const disabledClass = disabled ? 'opacity-50 cursor-default' : ''
  const highlightClass = isHighlighted ? 'ring-4 ring-suara-amber brightness-110' : ''

  const [imgFailed, setImgFailed] = useState(false)

  // Determine what to render in the image area
  // Priority: children > photoBlob > symbolPath (if file exists) > emoji > fallback
  function renderImage() {
    if (children) return children
    if (blobUrl) {
      return <img src={blobUrl} alt={label} className="w-[52px] h-[52px] object-cover rounded-lg" />
    }
    if (symbolPath && !imgFailed) {
      return (
        <img
          src={`/assets/symbols/${symbolPath}`}
          alt={label}
          className="w-[52px] h-[52px] object-contain"
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
      className={`${baseClasses} ${(variant === 'core' && fkColor && fkStyles[fkColor]) ? fkStyles[fkColor] : variantStyles[variant]} ${activeClass} ${disabledClass} ${highlightClass}`}
      onClick={() => {
        if (disabled) return
        const start = performance.now()
        if (isModelingMode) {
          setIsHighlighted(true)
          setTimeout(() => setIsHighlighted(false), 500)
        }
        onTap()
        const elapsed = performance.now() - start
        if (elapsed > 100) {
          console.warn(`[Suara Perf] Tap on "${label}" took ${elapsed.toFixed(1)}ms (target: <100ms)`)
        }
      }}
      type="button"
      role="gridcell"
      aria-label={label}
    >
      {renderImage()}
      <span className="text-[18px] font-bold leading-tight text-center px-1" style={{ letterSpacing: '0.4px' }}>
        {label}
      </span>
    </button>
  )
}
