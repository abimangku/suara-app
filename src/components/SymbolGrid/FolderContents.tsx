import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import { useVocabulary, useFolderWords } from '@/hooks/useVocabulary'
import { useSentenceBar } from '@/hooks/useSentenceBar'
import { useAppStore } from '@/store/appStore'
import type { FKColor } from '@/types'

// Map each seeded folder to a Fitzgerald Key color so fringe words inherit
// grammatical coloring (nouns orange, verbs green, questions purple, etc.).
// Per research §1 (Thistle & Wilkinson, Wilkinson et al. 2022), color coding
// is useful as a REDUNDANT cue on top of spatial clustering — we apply it
// across the full grid, not just core. Custom family-added folders default
// to 'noun' since most user-added words are things/people/places.
const FOLDER_FK_COLOR: Record<string, FKColor> = {
  makanan: 'noun',
  perasaan: 'descriptor',
  aktivitas: 'verb',
  tempat: 'noun',
  tubuh: 'noun',
  pertanyaan: 'preposition', // traditional Fitzgerald question = purple (our preposition slot)
}

interface FolderContentsProps {
  folderKey: string
}

export default function FolderContents({ folderKey }: FolderContentsProps) {
  const { folders } = useVocabulary()
  const { addWord } = useSentenceBar()
  const setActiveFolder = useAppStore((s) => s.setActiveFolder)

  const folder = (folders ?? []).find((f) => f.key === folderKey)
  const allWords = useFolderWords(folder?.id)

  if (!folder) return null

  // With core hidden during folder view (v1.2.1), fringe gets 5 full rows
  // of the 6-row grid (30 cells) + Kembali on the last row. The 1-row
  // squeeze is gone; buttons render at the same size as core on the home
  // screen. First page shows 30 words; "lihat semua" is gone — we don't
  // need it since folder word lists are ≤15 words in practice.
  const visibleWords = allWords.slice(0, 30)

  return (
    <>
      {visibleWords.map((fw) => (
        <SymbolButton
          key={fw.id}
          emoji=""
          label={fw.labelDisplay ?? fw.label}
          variant="fringe"
          fkColor={FOLDER_FK_COLOR[folderKey] ?? 'noun'}
          symbolPath={fw.symbolPath}
          photoBlob={fw.photoBlob}
          onTap={() => {
            addWord({
              id: String(fw.id),
              label: fw.label,
              category: 'fringe',
              symbolPath: fw.symbolPath,
              photoBlob: fw.photoBlob,
              audioPath: fw.audioPath,
              audioBlob: fw.audioBlob,
            })
            // Auto-return to home after selecting a fringe word.
            // Reduces navigation overhead: she picks a word, the sentence
            // updates, and she's straight back to core vocabulary for the
            // next word. Avoids the manual Kembali tap which is cognitively
            // separate from speaking.
            setActiveFolder(null)
          }}
        />
      ))}

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
