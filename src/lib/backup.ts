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
 * Convert a Blob to a Base64 data URL string.
 * This lets us include photos in JSON backups.
 * A 200×200 JPEG photo ≈ 20 KB → ~27 KB as Base64. Reasonable.
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Convert a Base64 data URL string back to a Blob.
 */
function base64ToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
  const binary = atob(data)
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  return new Blob([array], { type: mime })
}

/**
 * Export all vocabulary data as JSON string.
 * INCLUDES photos (Base64-encoded) so backups are truly complete.
 * Excludes usageEvents (too large, synced separately via Supabase).
 * Excludes PIN hash (security — user re-creates PIN after restore).
 */
export async function exportVocabulary(): Promise<string> {
  const words = await db.words.toArray()
  const folders = await db.folders.toArray()
  const people = await db.people.toArray()
  const quickPhrases = await db.quickPhrases.toArray()
  const vocabularyPacks = await db.vocabularyPacks.toArray()
  const milestones = await db.communicationMilestones.toArray()
  const settings = await db.settings.toArray()

  // Convert photo blobs to Base64 strings for JSON serialization.
  // Each 200×200 JPEG is ~20 KB → ~27 KB as Base64. With 30 photos
  // that's ~800 KB total — well within reasonable JSON file size.
  const wordsWithPhotos = await Promise.all(
    words.map(async ({ photoBlob, audioBlob, ...rest }) => ({
      ...rest,
      photoBase64: photoBlob ? await blobToBase64(photoBlob) : undefined,
      // audioBlob excluded — too large, TTS fallback handles it
    }))
  )

  const peopleWithPhotos = await Promise.all(
    people.map(async ({ photoBlob, audioBlob, ...rest }) => ({
      ...rest,
      photoBase64: photoBlob ? await blobToBase64(photoBlob) : undefined,
    }))
  )

  const cleanPhrases = quickPhrases.map(({ audioBlob, ...rest }) => rest)

  const backup: BackupData = {
    version: '2.0.0',
    createdAt: Date.now(),
    words: wordsWithPhotos,
    folders,
    people: peopleWithPhotos,
    quickPhrases: cleanPhrases,
    vocabularyPacks,
    communicationMilestones: milestones,
    settings: settings.filter((s) => s.key !== 'adminPinHash'),
  }

  return JSON.stringify(backup, null, 2)
}

/**
 * Import vocabulary from a JSON backup.
 * Restores photos from Base64 if present (v2.0.0+ backups).
 * WARNING: This clears all current data before importing.
 */
export async function importVocabulary(json: string): Promise<void> {
  const backup = JSON.parse(json) as BackupData

  if (!backup.version || !backup.words || !backup.folders) {
    throw new Error('Format cadangan tidak valid')
  }

  // Restore photo blobs from Base64 strings
  const restoredWords = (backup.words as any[]).map((w) => {
    const { photoBase64, ...rest } = w
    return {
      ...rest,
      photoBlob: photoBase64 ? base64ToBlob(photoBase64) : undefined,
    }
  })

  const restoredPeople = (backup.people as any[]).map((p) => {
    const { photoBase64, ...rest } = p
    return {
      ...rest,
      photoBlob: photoBase64 ? base64ToBlob(photoBase64) : undefined,
    }
  })

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
    if (restoredWords.length > 0) await db.words.bulkAdd(restoredWords as any[])
    if (restoredPeople.length > 0) await db.people.bulkAdd(restoredPeople as any[])
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
