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
          onTap={() => addWord({ id: String(person.id), label: person.name, category: 'people' })}
        >
          {person.photoBlob ? (
            <img
              src={URL.createObjectURL(person.photoBlob)}
              alt={person.name}
              className="w-[46px] h-[46px] rounded-full object-cover"
            />
          ) : (
            <AvatarCircle initial={person.initial} />
          )}
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
