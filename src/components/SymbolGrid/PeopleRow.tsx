import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import AvatarCircle from '@/components/shared/AvatarCircle'
import { PEOPLE } from '@/data/vocabulary'
import type { Word } from '@/types'

interface PeopleRowProps {
  onWordTap: (word: Word) => void
}

export default function PeopleRow({ onWordTap }: PeopleRowProps) {
  return (
    <>
      {PEOPLE.map((person) => (
        <SymbolButton
          key={person.id}
          emoji=""
          label={person.name}
          variant="people"
          onTap={() =>
            onWordTap({
              id: person.id,
              label: person.name,
              category: 'people',
            })
          }
        >
          <AvatarCircle initial={person.initial} />
        </SymbolButton>
      ))}
      {/* Tambah placeholder — non-functional in Phase 1 */}
      <SymbolButton
        emoji="+"
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
