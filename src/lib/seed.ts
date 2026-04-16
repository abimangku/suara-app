import { db } from '@/lib/db'
import { SEED_FOLDERS, SEED_PEOPLE, SEED_QUICK_PHRASES, SEED_WORDS } from '@/data/vocabulary'

export async function seedDatabase(): Promise<void> {
  const existing = await db.settings.get('appVersion')

  if (!existing) {
    await runInitialSeed()
  }

  // Always run top-up to ensure existing installs get new content
  // (e.g., Pertanyaan folder, social quick phrases added after v1.0.0)
  await topUpSeedData()
}

async function runInitialSeed(): Promise<void> {
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

  // Seed vocabulary packs — two per folder (Dasar = first N, Lengkap = rest)
  // Most folders: Dasar=first 5, Lengkap=rest. Pertanyaan: Dasar=first 3, Lengkap=all 5.
  for (const [folderKey, words] of Object.entries(SEED_WORDS)) {
    const dasarCount = folderKey === 'pertanyaan' ? 3 : 5
    const dasarIds = words.slice(0, dasarCount).map((w) => w.id)
    const lengkapIds =
      folderKey === 'pertanyaan' ? words.map((w) => w.id) : words.slice(dasarCount).map((w) => w.id)

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

/**
 * Add new seed content to existing installs without wiping user data.
 * Safe to call on every startup — idempotent.
 */
async function topUpSeedData(): Promise<void> {
  const now = Date.now()

  // --- Pertanyaan folder + words + packs ---
  let pertanyaanFolder = await db.folders.where('key').equals('pertanyaan').first()
  if (!pertanyaanFolder) {
    const folderSeed = SEED_FOLDERS.find((f) => f.key === 'pertanyaan')
    if (folderSeed) {
      const id = await db.folders.add({
        ...folderSeed,
        createdAt: now,
        updatedAt: now,
      })
      pertanyaanFolder = { ...folderSeed, id: id as number, createdAt: now, updatedAt: now }

      // Seed the 5 question words
      const questionWords = SEED_WORDS.pertanyaan ?? []
      for (const w of questionWords) {
        await db.words.add({
          folderId: id as number,
          label: w.label,
          symbolPath: `fringe/${w.id}.png`,
          sortOrder: w.sortOrder,
          isActive: true,
          source: 'bundled',
          createdAt: now,
          updatedAt: now,
        })
      }

      // Seed vocabulary packs for pertanyaan (Dasar = first 3, Lengkap = all 5)
      const existingDasar = await db.vocabularyPacks
        .where('folderKey')
        .equals('pertanyaan')
        .filter((p) => p.name.includes('Dasar'))
        .first()
      if (!existingDasar) {
        await db.vocabularyPacks.add({
          name: 'Pertanyaan Dasar',
          folderKey: 'pertanyaan',
          wordIds: questionWords.slice(0, 3).map((w) => w.id),
          isActive: true,
          sortOrder: 0,
          createdAt: now,
          updatedAt: now,
        })
      }
      const existingLengkap = await db.vocabularyPacks
        .where('folderKey')
        .equals('pertanyaan')
        .filter((p) => p.name.includes('Lengkap'))
        .first()
      if (!existingLengkap) {
        await db.vocabularyPacks.add({
          name: 'Pertanyaan Lengkap',
          folderKey: 'pertanyaan',
          wordIds: questionWords.map((w) => w.id),
          isActive: true,
          sortOrder: 1,
          createdAt: now,
          updatedAt: now,
        })
      }
    }
  }

  // --- Social + pragmatic quick phrases ---
  // Extended in v1.2.0 with phrases covering Light & McNaughton's 4 communicative
  // purposes (needs/wants + social closeness + information transfer + etiquette)
  // per Ganz et al. 2017 systematic review finding that AAC under-serves
  // non-requesting communicative acts.
  const allSocialPhrases = [
    'halo', 'terima kasih', 'maaf', 'selamat pagi', 'selamat malam', 'dadah',
    'aku tidak tahu', 'apa itu', 'tunggu sebentar', 'permisi',
    'aku sayang kamu', 'aku capek',
  ]
  for (const phraseText of allSocialPhrases) {
    const existing = await db.quickPhrases.filter((qp) => qp.phrase === phraseText).first()
    if (!existing) {
      const phrase = SEED_QUICK_PHRASES.find((p) => p.phrase === phraseText)
      if (phrase) {
        await db.quickPhrases.add({
          ...phrase,
          createdAt: now,
          updatedAt: now,
        })
      }
    }
  }
}
