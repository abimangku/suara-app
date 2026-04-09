interface WordChipProps {
  label: string
  isFlashing: boolean
}

export default function WordChip({ label, isFlashing }: WordChipProps) {
  return (
    <span
      className={`inline-flex items-center px-4 py-1 rounded-full text-[15px] font-bold whitespace-nowrap flex-shrink-0 transition-colors duration-150 ${
        isFlashing
          ? 'bg-white/90 text-suara-blue-bar'
          : 'bg-white text-suara-blue-bar'
      }`}
    >
      {label}
    </span>
  )
}
