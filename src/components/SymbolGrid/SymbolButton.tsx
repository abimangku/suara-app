import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import type { FKColor } from '@/types'

const HAPTIC_DURATIONS = { off: 0, light: 10, medium: 30, strong: 50 } as const
const LONG_PRESS_MS = 1500

interface SymbolButtonProps {
  emoji?: string
  label: string
  variant: 'core' | 'people' | 'folder' | 'fringe' | 'kembali'
  onTap: () => void
  onLongPress?: () => void
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
  onLongPress,
  isActive = false,
  disabled = false,
  children,
  symbolPath,
  photoBlob,
  fkColor,
}: SymbolButtonProps) {
  const isModelingMode = useAppStore((s) => s.isModelingMode)
  const hapticLevel = useAppStore((s) => s.hapticLevel)
  const [isHighlighted, setIsHighlighted] = useState(false)

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didLongPressRef = useRef(false)

  const blobUrl = useMemo(() => {
    if (!photoBlob) return null
    return URL.createObjectURL(photoBlob)
  }, [photoBlob])

  useEffect(() => {
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [blobUrl])

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }
    }
  }, [])

  function clearLongPressTimer() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const baseClasses =
    'rounded-button border-2 flex flex-col items-center justify-center gap-1 cursor-pointer select-none active:scale-[0.96] transition-transform duration-[80ms] min-h-0 min-w-0 overflow-hidden p-1'

  const activeClass = isActive ? 'brightness-[0.85]' : ''
  const disabledClass = disabled ? 'opacity-50 cursor-default' : ''
  const highlightClass = isHighlighted ? 'ring-4 ring-suara-amber brightness-110' : ''

  const [imgFailed, setImgFailed] = useState(false)

  // Determine what to render in the image area
  // Priority: children > photoBlob > symbolPath (if file exists) > emoji > fallback
  function renderImage() {
    if (children) return children
    if (blobUrl) {
      return <img src={blobUrl} alt={label} className="max-w-[52px] max-h-[52px] min-h-0 flex-1 object-cover rounded-lg" style={{ height: 'min(52px, 60%)' }} />
    }
    if (symbolPath && !imgFailed) {
      return (
        <img
          src={`/assets/symbols/${symbolPath}`}
          alt={label}
          className="max-w-[52px] max-h-[52px] min-h-0 flex-1 object-contain"
          style={{ height: 'min(52px, 60%)' }}
          onError={() => setImgFailed(true)}
        />
      )
    }
    if (emoji) {
      return <span className="leading-tight" style={{ fontSize: 'min(34px, 40%)' }}>{emoji}</span>
    }
    // Neutral fallback: circle with first letter of label (not ❓ which looks like a question word)
    return (
      <div
        className="flex items-center justify-center rounded-full border-2 border-dashed border-current opacity-60"
        style={{ width: 'min(52px, 60%)', height: 'min(52px, 60%)' }}
      >
        <span className="font-bold" style={{ fontSize: 'min(24px, 30%)' }}>
          {label.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <button
      className={`${baseClasses} ${(fkColor && fkStyles[fkColor] && (variant === 'core' || variant === 'fringe')) ? fkStyles[fkColor] : variantStyles[variant]} ${activeClass} ${disabledClass} ${highlightClass}`}
      onPointerDown={() => {
        // Fire haptic on pointer-down for maximum perceived responsiveness.
        // This runs ~50-100ms earlier than onClick.
        if (disabled) return
        // Only vibrate for speech-output buttons — not navigation (folder/kembali)
        if (variant !== 'folder' && variant !== 'kembali') {
          const ms = HAPTIC_DURATIONS[hapticLevel] ?? 10
          if (ms > 0) {
            try { navigator.vibrate?.(ms) } catch {}
          }
        }
        // Start long-press timer if handler is provided
        if (onLongPress) {
          didLongPressRef.current = false
          clearLongPressTimer()
          longPressTimerRef.current = setTimeout(() => {
            didLongPressRef.current = true
            longPressTimerRef.current = null
            // Extra haptic cue on long-press trigger for motor confirmation
            try { navigator.vibrate?.(50) } catch {}
            onLongPress()
          }, LONG_PRESS_MS)
        }
      }}
      onPointerUp={() => {
        clearLongPressTimer()
      }}
      onPointerLeave={() => {
        clearLongPressTimer()
      }}
      onPointerCancel={() => {
        clearLongPressTimer()
      }}
      onClick={() => {
        if (disabled) return
        // If long-press already fired, skip normal tap and reset flag
        if (didLongPressRef.current) {
          didLongPressRef.current = false
          return
        }
        const start = performance.now()
        if (isModelingMode) {
          setIsHighlighted(true)
          // Persist the amber ring for 2 seconds so a child who looks up
          // partway through the caregiver's demo still sees which word was
          // modeled. 500 ms was often over before she glanced back.
          setTimeout(() => setIsHighlighted(false), 2000)
        }
        onTap()
        const elapsed = performance.now() - start
        if (elapsed > 100 && import.meta.env.DEV) {
          console.warn(`[Suara Perf] Tap on "${label}" took ${elapsed.toFixed(1)}ms (target: <100ms)`)
        }
      }}
      type="button"
      role="gridcell"
      aria-label={label}
    >
      {renderImage()}
      <span
        className="font-bold leading-tight text-center px-1 truncate w-full shrink-0"
        style={{
          letterSpacing: '0.4px',
          fontSize: 'clamp(11px, 2.2vw, 18px)',
        }}
      >
        {label}
      </span>
    </button>
  )
}
