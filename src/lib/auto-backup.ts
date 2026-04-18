/**
 * Auto-backup: silently snapshots all user-configurable data to localStorage
 * after every admin edit. Serves as a safety net independent of IndexedDB —
 * if Chrome evicts the DB (storage pressure) or the DB corrupts, the most
 * recent auto-backup can restore everything.
 *
 * Why localStorage instead of IndexedDB?
 *  - If IndexedDB is evicted, a backup IN IndexedDB goes with it.
 *  - localStorage is a separate storage mechanism with its own eviction rules.
 *  - On Chrome Android installed PWAs, localStorage is typically retained even
 *    when IndexedDB is evicted under storage pressure.
 *  - localStorage has a ~5MB limit, which is plenty for text data (names,
 *    phrases, settings). Photos (blobs) are NOT backed up here — they'd
 *    exceed the limit. The manual JSON backup (Admin → Cadangan Data) includes
 *    photos; this auto-backup covers configuration.
 *
 * Format: JSON string under key 'suara-auto-backup' with timestamp.
 * Restore: on app init, if IndexedDB is empty but auto-backup exists, offer restore.
 */

import { db } from '@/lib/db'

const BACKUP_KEY = 'suara-auto-backup'
const DEBOUNCE_MS = 2000 // Wait 2s after last change before saving (batch rapid edits)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

export interface AutoBackupData {
  timestamp: number
  version: string
  people: Array<{ name: string; initial: string; sortOrder: number; isActive: boolean }>
  folders: Array<{ key: string; label: string; emoji: string; sortOrder: number; isActive: boolean }>
  quickPhrases: Array<{ phrase: string; words: string[]; sortOrder: number; isActive: boolean }>
  settings: Array<{ key: string; value: unknown }>
  // Note: words (fringe vocabulary) are included but photos (blobs) are NOT —
  // localStorage can't hold binary data efficiently. Manual backup has photos.
  words: Array<{ label: string; folderId: number; symbolPath?: string; sortOrder: number; isActive: boolean; source: 'bundled' | 'family' }>
}

/**
 * Schedule an auto-backup. Debounced — multiple rapid admin edits produce
 * one backup 2 seconds after the last edit.
 */
export function scheduleAutoBackup(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    performAutoBackup().catch(() => {
      // Silent fail — auto-backup is a safety net, not a critical path
    })
  }, DEBOUNCE_MS)
}

/**
 * Actually perform the backup. Reads all tables and writes to localStorage.
 */
async function performAutoBackup(): Promise<void> {
  try {
    const [people, folders, quickPhrases, settings, words] = await Promise.all([
      db.people.toArray(),
      db.folders.toArray(),
      db.quickPhrases.toArray(),
      db.settings.toArray(),
      db.words.toArray(),
    ])

    const backup: AutoBackupData = {
      timestamp: Date.now(),
      version: '1.2.2',
      people: people.map((p) => ({
        name: p.name,
        initial: p.initial,
        sortOrder: p.sortOrder,
        isActive: p.isActive,
      })),
      folders: folders.map((f) => ({
        key: f.key,
        label: f.label,
        emoji: f.emoji,
        sortOrder: f.sortOrder,
        isActive: f.isActive,
      })),
      quickPhrases: quickPhrases.map((qp) => ({
        phrase: qp.phrase,
        words: qp.words,
        sortOrder: qp.sortOrder,
        isActive: qp.isActive,
      })),
      settings: settings
        .filter((s) => s.key !== 'appVersion') // Don't backup the seed flag
        .map((s) => ({ key: s.key, value: s.value })),
      words: words.map((w) => ({
        label: w.label,
        folderId: w.folderId,
        symbolPath: w.symbolPath,
        sortOrder: w.sortOrder,
        isActive: w.isActive,
        source: w.source,
      })),
    }

    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup))
  } catch {
    // localStorage might be full or unavailable — fail silently
  }
}

/**
 * Check if an auto-backup exists and is recent.
 */
export function getAutoBackup(): AutoBackupData | null {
  try {
    const raw = localStorage.getItem(BACKUP_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AutoBackupData
  } catch {
    return null
  }
}

/**
 * Restore from auto-backup into IndexedDB.
 * Only restores records that don't already exist (non-destructive).
 * Photos are NOT restored (not in the backup) — user needs manual backup for those.
 */
export async function restoreFromAutoBackup(backup: AutoBackupData): Promise<void> {
  const now = Date.now()

  // Restore folders
  for (const folder of backup.folders) {
    const existing = await db.folders.where('key').equals(folder.key).first()
    if (!existing) {
      await db.folders.add({ ...folder, createdAt: now, updatedAt: now })
    }
  }

  // Restore people (match by name since IDs are auto-generated)
  for (const person of backup.people) {
    const existing = await db.people.filter((p) => p.name === person.name).first()
    if (!existing) {
      await db.people.add({ ...person, createdAt: now, updatedAt: now })
    } else if (!existing.isActive && person.isActive) {
      // Re-activate soft-deleted person
      await db.people.update(existing.id!, { isActive: true, updatedAt: now })
    }
  }

  // Restore quick phrases (match by phrase text)
  for (const phrase of backup.quickPhrases) {
    const existing = await db.quickPhrases.filter((qp) => qp.phrase === phrase.phrase).first()
    if (!existing) {
      await db.quickPhrases.add({ ...phrase, createdAt: now, updatedAt: now })
    }
  }

  // Restore settings (put = upsert)
  for (const setting of backup.settings) {
    await db.settings.put({ ...setting, updatedAt: now })
  }

  // Restore words (match by label + folderId)
  for (const word of backup.words) {
    const existing = await db.words
      .where('folderId')
      .equals(word.folderId)
      .filter((w) => w.label === word.label)
      .first()
    if (!existing) {
      await db.words.add({ ...word, createdAt: now, updatedAt: now })
    }
  }
}

/**
 * Clear the auto-backup (e.g., after successful manual restore).
 */
export function clearAutoBackup(): void {
  try {
    localStorage.removeItem(BACKUP_KEY)
  } catch {
    // Silent
  }
}
