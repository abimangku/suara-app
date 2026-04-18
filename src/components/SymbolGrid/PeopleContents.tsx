import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import AvatarCircle from '@/components/shared/AvatarCircle'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useSentenceBar } from '@/hooks/useSentenceBar'
import { useAppStore } from '@/store/appStore'

/**
 * Full-screen people view — opens when the 👥 Orang folder is tapped.
 * Shows all active people with photo avatars, plus Tambah (opens admin).
 * Auto-returns to home after tapping a person (same as fringe words).
 */
export default function PeopleContents() {
  const { people } = useVocabulary()
  const { addWord } = useSentenceBar()
  const setActiveFolder = useAppStore((s) => s.setActiveFolder)
  const openAdmin = useAppStore((s) => s.openAdmin)

  const peopleList = people ?? []

  return (
    <>
      {peopleList.map((person) => (
        <SymbolButton
          key={person.id}
          label={person.name}
          variant="people"
          photoBlob={person.photoBlob}
          onTap={() => {
            addWord({ id: String(person.id), label: person.name, category: 'people' })
            setActiveFolder(null) // auto-return to home
          }}
        >
          {!person.photoBlob ? <AvatarCircle initial={person.initial} /> : undefined}
        </SymbolButton>
      ))}

      {/* Add button — opens admin PIN gate */}
      <SymbolButton
        label="Tambah"
        variant="people"
        onTap={openAdmin}
      >
        <AvatarCircle initial="+" size={46} />
      </SymbolButton>

      {/* Kembali — full-span bottom row */}
      <button
        className="col-span-6 rounded-button border-2 border-suara-gray-border bg-suara-gray-light text-suara-gray flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.96] transition-transform duration-[80ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-suara-blue"
        onClick={() => setActiveFolder(null)}
        type="button"
      >
        <span className="text-xl">←</span>
        <span className="text-[15px] font-bold">Kembali</span>
      </button>
    </>
  )
}
