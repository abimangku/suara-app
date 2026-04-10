import { db } from '@/lib/db'

interface BackupData {
  version: string
  createdAt: number
  words: unknown[]
  folders: unknown[]
  people: unknown[]
  quickPhrases: unknown[]
  vocabularyPacks: unknown[]
  communicationMilestones: unknown[]
  settings: unknown[]
}

/**
 * Export all vocabulary data as JSON string.
 * Excludes usageEvents (too large, synced separately via Supabase).
 * Excludes photoBlob/audioBlob (binary data doesn't serialize to JSON).
 */
export async function exportVocabulary(): Promise<string> {
  const words = await db.words.toArray()
  const folders = await db.folders.toArray()
  const people = await db.people.toArray()
  const quickPhrases = await db.quickPhrases.toArray()
  const vocabularyPacks = await db.vocabularyPacks.toArray()
  const milestones = await db.communicationMilestones.toArray()
  const settings = await db.settings.toArray()

  // Strip binary blobs from export (they can't be JSON-serialized)
  const cleanWords = words.map(({ photoBlob, audioBlob, ...rest }) => rest)
  const cleanPeople = people.map(({ photoBlob, audioBlob, ...rest }) => rest)
  const cleanPhrases = quickPhrases.map(({ audioBlob, ...rest }) => rest)

  const backup: BackupData = {
    version: '1.0.0',
    createdAt: Date.now(),
    words: cleanWords,
    folders,
    people: cleanPeople,
    quickPhrases: cleanPhrases,
    vocabularyPacks,
    communicationMilestones: milestones,
    settings: settings.filter((s) => s.key !== 'adminPinHash'), // Don't export PIN
  }

  return JSON.stringify(backup, null, 2)
}

/**
 * Import vocabulary from a JSON backup.
 * WARNING: This clears all current data before importing.
 */
export async function importVocabulary(json: string): Promise<void> {
  const backup = JSON.parse(json) as BackupData

  if (!backup.version || !backup.words || !backup.folders) {
    throw new Error('Format cadangan tidak valid')
  }

  await db.transaction('rw', [db.words, db.folders, db.people, db.quickPhrases, db.vocabularyPacks, db.communicationMilestones, db.settings], async () => {
    // Clear existing data (keep usageEvents)
    await db.words.clear()
    await db.folders.clear()
    await db.people.clear()
    await db.quickPhrases.clear()
    await db.vocabularyPacks.clear()
    await db.communicationMilestones.clear()

    // Import data
    if (backup.folders.length > 0) await db.folders.bulkAdd(backup.folders as any[])
    if (backup.words.length > 0) await db.words.bulkAdd(backup.words as any[])
    if (backup.people.length > 0) await db.people.bulkAdd(backup.people as any[])
    if (backup.quickPhrases.length > 0) await db.quickPhrases.bulkAdd(backup.quickPhrases as any[])
    if (backup.vocabularyPacks.length > 0) await db.vocabularyPacks.bulkAdd(backup.vocabularyPacks as any[])
    if (backup.communicationMilestones.length > 0) await db.communicationMilestones.bulkAdd(backup.communicationMilestones as any[])

    // Import settings (except PIN — keep current PIN)
    for (const setting of backup.settings as any[]) {
      if (setting.key !== 'adminPinHash') {
        await db.settings.put(setting)
      }
    }
  })
}

/**
 * Trigger browser download of a string as a file.
 */
export function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
