/**
 * Cloud backup via Supabase Storage.
 *
 * Automatically uploads the full app state (people, words, photos, settings)
 * to Supabase Storage whenever:
 *  - The app detects internet connectivity after being offline
 *  - An admin change is made (debounced 10s)
 *  - The app comes to foreground (visibilitychange)
 *
 * On app init, if IndexedDB is empty (data loss), checks Supabase for the
 * latest backup and auto-restores. This is the ultimate safety net:
 *  device wiped → open app → detects empty DB → downloads cloud backup → restored.
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars.
 * If not configured, all functions silently no-op.
 */

import { isSupabaseAvailable, getSupabase } from '@/lib/supabase'
import { exportVocabulary, importVocabulary } from '@/lib/backup'
import { db } from '@/lib/db'

const BUCKET_NAME = 'suara-backups'
const BACKUP_FILENAME = 'latest-backup.json'

let uploadDebounceTimer: ReturnType<typeof setTimeout> | null = null
const UPLOAD_DEBOUNCE_MS = 10000 // 10 seconds after last change

/**
 * Schedule a cloud backup upload. Debounced — multiple rapid changes
 * produce one upload 10 seconds after the last change.
 */
export function scheduleCloudBackup(): void {
  if (!isSupabaseAvailable()) return
  if (uploadDebounceTimer) clearTimeout(uploadDebounceTimer)
  uploadDebounceTimer = setTimeout(() => {
    uploadBackup().catch(() => {
      // Silent fail — cloud backup is a safety net, not critical path
    })
  }, UPLOAD_DEBOUNCE_MS)
}

/**
 * Upload the current app state to Supabase Storage.
 */
async function uploadBackup(): Promise<void> {
  const supabase = getSupabase()
  if (!supabase || !navigator.onLine) return

  try {
    const json = await exportVocabulary()
    const blob = new Blob([json], { type: 'application/json' })

    // Get device ID to namespace backups (if multiple devices in future)
    const deviceSetting = await db.settings.get('deviceId')
    const deviceId = (deviceSetting?.value as string) ?? 'default'
    const path = `${deviceId}/${BACKUP_FILENAME}`

    // Upload (upsert — overwrite existing backup)
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, blob, { upsert: true, contentType: 'application/json' })

    if (error) {
      // Bucket might not exist yet — try to create it
      if (error.message?.includes('not found') || error.message?.includes('Bucket')) {
        // Can't create bucket with anon key — need admin setup.
        // Log for debugging, don't crash.
        if (import.meta.env.DEV) {
          console.warn('[Suara Cloud] Bucket not found. Create "suara-backups" bucket in Supabase Dashboard.')
        }
        return
      }
      throw error
    }

    // Update last cloud backup timestamp
    await db.settings.put({
      key: 'lastCloudBackup',
      value: Date.now(),
      updatedAt: Date.now(),
    })
  } catch {
    // Silent fail — next attempt in 10s or on next foreground
  }
}

/**
 * Check Supabase for a cloud backup and restore if local DB is empty.
 * Called during seedDatabase() when data loss is detected.
 */
export async function restoreFromCloud(): Promise<boolean> {
  if (!isSupabaseAvailable()) return false

  const supabase = getSupabase()
  if (!supabase) return false

  try {
    const deviceSetting = await db.settings.get('deviceId')
    const deviceId = (deviceSetting?.value as string) ?? 'default'
    const path = `${deviceId}/${BACKUP_FILENAME}`

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(path)

    if (error || !data) return false

    const json = await data.text()
    await importVocabulary(json)

    console.log('[Suara Cloud] Restored from cloud backup')
    return true
  } catch {
    return false
  }
}

/**
 * Initialize cloud backup listeners.
 * Call once at app init after seedDatabase().
 */
export function initCloudBackup(): void {
  if (!isSupabaseAvailable()) return

  // Upload on foreground (user comes back to app)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      scheduleCloudBackup()
    }
  })

  // Upload when coming back online
  window.addEventListener('online', () => {
    scheduleCloudBackup()
  })

  // Initial upload on app start (if online)
  if (navigator.onLine) {
    scheduleCloudBackup()
  }
}
