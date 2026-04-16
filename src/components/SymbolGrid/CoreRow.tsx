import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import { CORE_WORDS } from '@/data/vocabulary'
import { useSentenceBar } from '@/hooks/useSentenceBar'
import { useAppStore } from '@/store/appStore'

export default function CoreRow() {
  const { addWord } = useSentenceBar()
  const openEmergency = useAppStore((s) => s.openEmergency)

  return (
    <>
      {CORE_WORDS.map((cw) => (
        <SymbolButton
          key={cw.id}
          emoji={cw.emoji}
          label={cw.label}
          variant="core"
          symbolPath={cw.symbolPath}
          fkColor={cw.fkColor}
          onTap={() => addWord({ id: cw.id, label: cw.label, category: 'core', emoji: cw.emoji, symbolPath: cw.symbolPath, audioPath: cw.audioPath })}
          onLongPress={cw.id === 'bantu' ? openEmergency : undefined}
        />
      ))}
    </>
  )
}
