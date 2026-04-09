import { db } from '@/lib/db'
import { SEED_FOLDERS, SEED_PEOPLE, SEED_QUICK_PHRASES, SEED_WORDS } from '@/data/vocabulary'

export async function seedDatabase(): Promise<void> {
  // Skip if already seeded
  const existing = await db.settings.get('appVersion')
  if (existing) return

  const now = Date.now()

  // Seed folders and collect their auto-increment IDs
  const folderIdMap = new Map<string, number>()
  for (const folder of SEED_FOLDERS) {
    const id = await db.folders.add({
      ...folder,
      createdAt: now,
      updatedAt: now,
    })
    folderIdMap.set(folder.key, id as number)
  }

  // Seed fringe words linked to correct folder IDs
  for (const [folderKey, words] of Object.entries(SEED_WORDS)) {
    const folderId = folderIdMap.get(folderKey)
    if (!folderId) continue

    for (const word of words) {
      await db.words.add({
        folderId,
        label: word.label,
        symbolPath: `fringe/${word.id}.png`,
        sortOrder: word.sortOrder,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        source: 'bundled',
      })
    }
  }

  // Seed people
  for (const person of SEED_PEOPLE) {
    await db.people.add({
      ...person,
      createdAt: now,
      updatedAt: now,
    })
  }

  // Seed quick phrases
  for (const phrase of SEED_QUICK_PHRASES) {
    await db.quickPhrases.add({
      ...phrase,
      createdAt: now,
      updatedAt: now,
    })
  }

  // Seed vocabulary packs — two per folder (Dasar = first 5, Lengkap = rest)
  for (const [folderKey, words] of Object.entries(SEED_WORDS)) {
    const dasarIds = words.slice(0, 5).map((w) => w.id)
    const lengkapIds = words.slice(5).map((w) => w.id)

    await db.vocabularyPacks.add({
      name: `${folderKey.charAt(0).toUpperCase() + folderKey.slice(1)} Dasar`,
      folderKey,
      wordIds: dasarIds,
      isActive: true,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    })

    if (lengkapIds.length > 0) {
      await db.vocabularyPacks.add({
        name: `${folderKey.charAt(0).toUpperCase() + folderKey.slice(1)} Lengkap`,
        folderKey,
        wordIds: lengkapIds,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  // Seed default settings
  const defaultSettings: Array<{ key: string; value: unknown }> = [
    { key: 'appVersion', value: '1.0.0' },
    { key: 'adminPinHash', value: null },
    { key: 'isKioskMode', value: false },
    { key: 'ttsVoice', value: 'system' },
    { key: 'modelingModeEnabled', value: true },
    { key: 'caregiverPaneEnabled', value: false },
    { key: 'intentSuggestionsEnabled', value: true },
    { key: 'searchEnabled', value: true },
    { key: 'lastSyncTimestamp', value: 0 },
    { key: 'onboardingCompleted', value: false },
  ]

  for (const setting of defaultSettings) {
    await db.settings.add({
      key: setting.key,
      value: setting.value,
      updatedAt: now,
    })
  }

  console.log('[Suara] Database seeded successfully')
}
