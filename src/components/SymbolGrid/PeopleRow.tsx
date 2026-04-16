import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import AvatarCircle from '@/components/shared/AvatarCircle'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useSentenceBar } from '@/hooks/useSentenceBar'
import { useAppStore } from '@/store/appStore'

export default function PeopleRow() {
  const { people } = useVocabulary()
  const { addWord } = useSentenceBar()
  const openAdmin = useAppStore((s) => s.openAdmin)

  const peopleList = people ?? []
  // 6-col grid cap: show up to 6 people. Hide the "Tambah" placeholder once the
  // row is full so the row never overflows (overflow would wrap Tambah onto the
  // folder row). Caregiver can still add more people via Admin → Kelola Orang.
  const visiblePeople = peopleList.slice(0, 6)
  const showTambah = visiblePeople.length < 6
  const usedSlots = visiblePeople.length + (showTambah ? 1 : 0)
  const padCount = Math.max(0, 6 - usedSlots)

  return (
    <>
      {visiblePeople.map((person) => (
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
      {showTambah && (
        // Tambah opens the admin PIN gate. Caregivers can add people here;
        // the PIN keeps the primary user from accidentally entering admin.
        // Previously this was disabled — looked tappable, did nothing, and
        // habituated the appearance of a broken button.
        <SymbolButton
          label="Tambah"
          variant="people"
          onTap={openAdmin}
        >
          <AvatarCircle initial="+" size={46} />
        </SymbolButton>
      )}
      {Array.from({ length: padCount }).map((_, i) => (
        <div key={`spacer-${i}`} aria-hidden="true" />
      ))}
    </>
  )
}
