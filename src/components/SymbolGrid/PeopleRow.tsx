import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import AvatarCircle from '@/components/shared/AvatarCircle'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useSentenceBar } from '@/hooks/useSentenceBar'

export default function PeopleRow() {
  const { people } = useVocabulary()
  const { addWord } = useSentenceBar()

  const peopleList = people ?? []
  const usedSlots = peopleList.length + 1 // +1 for Tambah button
  const padCount = Math.max(0, 6 - usedSlots)

  return (
    <>
      {peopleList.map((person) => (
        <SymbolButton
          key={person.id}
          label={person.name}
          variant="people"
          photoBlob={person.photoBlob}
          onTap={() => addWord({ id: String(person.id), label: person.name, category: 'people' })}
        >
          {!person.photoBlob ? <AvatarCircle initial={person.initial} /> : undefined}
        </SymbolButton>
      ))}
      <SymbolButton
        label="Tambah"
        variant="people"
        onTap={() => {}}
        disabled
      >
        <AvatarCircle initial="+" size={46} />
      </SymbolButton>
      {Array.from({ length: padCount }).map((_, i) => (
        <div key={`spacer-${i}`} aria-hidden="true" />
      ))}
    </>
  )
}
