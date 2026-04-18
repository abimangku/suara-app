import SymbolButton from '@/components/SymbolGrid/SymbolButton'
import { CORE_WORDS, SEED_FOLDERS } from '@/data/vocabulary'
import { useSentenceBar } from '@/hooks/useSentenceBar'
import { useVocabulary } from '@/hooks/useVocabulary'
import { useAppStore } from '@/store/appStore'

/**
 * Unified 6×6 home grid. Replaces the old CoreRow + PeopleRow + FolderRow
 * separation with a single grid where:
 *   - Cols 0-4: core words (positioned by row/position coordinates)
 *   - Col 5: folders (one per row, from SEED_FOLDERS order)
 *   - Empty cells: subtle dashed placeholders (growth slots)
 *
 * Layout follows sentence order left → right:
 *   WHO (pronouns) → DOING (verbs) → DESCRIBE → CONNECT → TOPICS (folders)
 */
export default function HomeGrid() {
  const { addWord } = useSentenceBar()
  const { folders } = useVocabulary()
  const setActiveFolder = useAppStore((s) => s.setActiveFolder)
  const openEmergency = useAppStore((s) => s.openEmergency)
  const hiddenWords = useAppStore((s) => s.hiddenWords)

  // Build a 6×6 cell map
  const cells: Array<{ type: 'core' | 'folder' | 'empty'; data?: unknown }> = []

  for (let row = 1; row <= 6; row++) {
    for (let col = 0; col <= 5; col++) {
      if (col === 5) {
        // Column 5 = folders
        const folderIndex = row - 1
        const folderSeed = SEED_FOLDERS[folderIndex]
        const dbFolder = (folders ?? []).find((f) => f.key === folderSeed?.key)
        if (folderSeed && dbFolder) {
          cells.push({ type: 'folder', data: { ...folderSeed, dbFolder } })
        } else if (folderSeed) {
          cells.push({ type: 'folder', data: { ...folderSeed, dbFolder: null } })
        } else {
          cells.push({ type: 'empty' })
        }
      } else {
        // Columns 0-4 = core words or empty growth slots
        const cw = CORE_WORDS.find((w) => w.row === row && w.position === col)
        if (cw) {
          cells.push({ type: 'core', data: cw })
        } else {
          cells.push({ type: 'empty' })
        }
      }
    }
  }

  return (
    <>
      {cells.map((cell, i) => {
        if (cell.type === 'core') {
          const cw = cell.data as (typeof CORE_WORDS)[number]
          const isHidden = hiddenWords.includes(cw.id)

          if (isHidden) {
            // Hidden by progressive disclosure — show subtle placeholder
            // Position is preserved for motor memory; word appears when caregiver reveals it
            return (
              <div
                key={cw.id}
                className="rounded-button border-2 border-dashed border-gray-200 min-h-0 min-w-0"
                aria-hidden="true"
              />
            )
          }

          return (
            <SymbolButton
              key={cw.id}
              emoji={cw.emoji}
              label={cw.label}
              variant="core"
              symbolPath={cw.symbolPath}
              fkColor={cw.fkColor}
              onTap={() => addWord({
                id: cw.id,
                label: cw.label,
                category: 'core',
                emoji: cw.emoji,
                symbolPath: cw.symbolPath,
                audioPath: cw.audioPath,
              })}
              onLongPress={cw.id === 'bantu' ? openEmergency : undefined}
            />
          )
        }

        if (cell.type === 'folder') {
          const folder = cell.data as { key: string; label: string; emoji: string; dbFolder: { id: number; key: string } | null }
          const isHidden = hiddenWords.includes(`folder:${folder.key}`)

          if (isHidden) {
            return (
              <div
                key={`folder-${folder.key}`}
                className="rounded-button border-2 border-dashed border-gray-200 min-h-0 min-w-0"
                aria-hidden="true"
              />
            )
          }

          return (
            <SymbolButton
              key={`folder-${folder.key}`}
              emoji={folder.emoji}
              label={folder.label}
              variant="folder"
              onTap={() => setActiveFolder(folder.key)}
            />
          )
        }

        // Empty growth slot
        return (
          <div
            key={`empty-${i}`}
            className="rounded-button border-2 border-dashed border-gray-200/50 min-h-0 min-w-0"
            aria-hidden="true"
          />
        )
      })}
    </>
  )
}
