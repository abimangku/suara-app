import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import AvatarCircle from '@/components/shared/AvatarCircle'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useSentenceBar } from '@/hooks/useSentenceBar'

export default function PeopleRow() {
  const { people } = useVocabulary()
  const { addWord } = useSentenceBar()

  return (
    <>
      {(people ?? []).map((person) => (
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
    </>
  )
}
