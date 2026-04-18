import { db } from '@/lib/db'
import { SEED_FOLDERS, SEED_PEOPLE, SEED_QUICK_PHRASES, SEED_WORDS } from '@/data/vocabulary'
import { getAutoBackup, restoreFromAutoBackup, clearAutoBackup } from '@/lib/auto-backup'
import { restoreFromCloud } from '@/lib/cloud-backup'

export async function seedDatabase(): Promise<void> {
  const existing = await db.settings.get('appVersion')

  if (!existing) {
    // Guard: check if tables already have data (e.g., appVersion was lost
    // due to storage eviction or corruption, but other tables survived).
    // Without this guard, runInitialSeed would ADD duplicate rows to all
    // tables on top of existing data.
    const folderCount = await db.folders.count()
    const peopleCount = await db.people.count()

    if (folderCount === 0 && peopleCount === 0) {
      // Try to restore data from backups (3-tier fallback):
      //  1. Cloud backup (Supabase) — includes photos, most complete
      //  2. Auto-backup (localStorage) — no photos, but has config
      //  3. Fresh seed (defaults) — generic starting point
      let restored = false

      // Tier 1: Cloud backup (if online + Supabase configured)
      if (navigator.onLine) {
        try {
          restored = await restoreFromCloud()
          if (restored) {
            console.log('[Suara] Restored from cloud backup (Supabase)')
          }
        } catch {
          // Cloud restore failed — try local backup
        }
      }

      // Tier 2: Local auto-backup
      if (!restored) {
        const autoBackup = getAutoBackup()
        if (autoBackup) {
          console.log(`[Suara] Found auto-backup from ${new Date(autoBackup.timestamp).toLocaleString()} — restoring`)
          await runInitialSeed() // Seed base structure first
          await restoreFromAutoBackup(autoBackup) // Then overlay user's customizations
          clearAutoBackup()
          restored = true
        }
      }

      // Tier 3: Fresh install — seed defaults
      if (!restored) {
        await runInitialSeed()
      }
    } else {
      // Tables have data but appVersion is missing — restore the flag
      // without re-seeding. This prevents the "defaults overwrite customs" bug.
      await db.settings.put({
        key: 'appVersion',
        value: '1.2.2',
        updatedAt: Date.now(),
      })
      console.log('[Suara] appVersion restored — skipped re-seed (tables already have data)')
    }
  }

  // Always run top-up to ensure existing installs get new content
  await topUpSeedData()

  // Prune old usage events — the table grows by ~200 rows/day and never
  // shrinks. After months this causes GC pressure when milestones.ts calls
  // db.usageEvents.toArray(). Keep 90 days of data (enough for frequency
  // model + dashboard), delete the rest.
  try {
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
    await db.usageEvents.where('timestamp').below(ninetyDaysAgo).delete()
  } catch {
    // Non-critical — cleanup failure doesn't affect communication
  }
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

  // --- v2.0.0: Add Orang (People) folder ---
  const orangFolder = await db.folders.where('key').equals('orang').first()
  if (!orangFolder) {
    const orangSeed = SEED_FOLDERS.find((f) => f.key === 'orang')
    if (orangSeed) {
      await db.folders.add({ ...orangSeed, createdAt: now, updatedAt: now })
    }
  }

  // --- v2.0.0: Merge Rasa Tubuh into Perasaan ---
  // Previously "Tubuh" / "Rasa Tubuh" had physical states (lapar, haus, pusing).
  // "Perasaan" had emotional states (senang, sedih, marah). Now merged into one
  // "Perasaan" folder containing both emotional + physical feelings.
  const tubuhFolder = await db.folders.where('key').equals('tubuh').first()
  const perasaanFolder = await db.folders.where('key').equals('perasaan').first()
  if (tubuhFolder && perasaanFolder && tubuhFolder.id && perasaanFolder.id) {
    // Move all tubuh words into perasaan folder
    const tubuhWords = await db.words.where('folderId').equals(tubuhFolder.id).toArray()
    for (const w of tubuhWords) {
      // Check if perasaan already has a word with the same label
      const existing = await db.words
        .where('folderId')
        .equals(perasaanFolder.id)
        .filter((pw) => pw.label === w.label)
        .first()
      if (!existing && w.id) {
        await db.words.update(w.id, { folderId: perasaanFolder.id, updatedAt: now })
      }
    }
    // Soft-delete the tubuh folder
    await db.folders.update(tubuhFolder.id, { isActive: false, updatedAt: now })
  }

  // v1.3.0 rename (Tubuh → Rasa Tubuh) is superseded by the v2.0.0 merge above.

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
