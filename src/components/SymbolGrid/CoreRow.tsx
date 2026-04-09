import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import { CORE_WORDS } from '@/data/vocabulary'
import type { Word } from '@/types'

interface CoreRowProps {
  onWordTap: (word: Word) => void
}

export default function CoreRow({ onWordTap }: CoreRowProps) {
  return (
    <>
      {CORE_WORDS.map((cw) => (
        <SymbolButton
          key={cw.id}
          emoji={cw.emoji}
          label={cw.label}
          variant="core"
          onTap={() =>
            onWordTap({ id: cw.id, label: cw.label, category: 'core' })
          }
        />
      ))}
    </>
  )
}
