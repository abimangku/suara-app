interface SymbolButtonProps {
  emoji: string
  label: string
  variant: 'core' | 'people' | 'folder' | 'fringe' | 'kembali'
  onTap: () => void
  isActive?: boolean
  disabled?: boolean
  children?: React.ReactNode
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
}: SymbolButtonProps) {
  const baseClasses =
    'rounded-button border-2 flex flex-col items-center justify-center gap-1 cursor-pointer select-none active:scale-95 transition-transform duration-[80ms]'

  const activeClass = isActive ? 'brightness-[0.85]' : ''
  const disabledClass = disabled ? 'opacity-50 cursor-default' : ''

  return (
    <button
      className={`${baseClasses} ${variantStyles[variant]} ${activeClass} ${disabledClass}`}
      onClick={disabled ? undefined : onTap}
      type="button"
    >
      {children ?? <span className="text-[34px] leading-tight">{emoji}</span>}
      <span className="text-[15px] font-bold leading-tight text-center px-1">
        {label}
      </span>
    </button>
  )
}
