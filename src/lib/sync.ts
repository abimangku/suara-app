import { db } from '@/lib/db'
import { getSupabase, isSupabaseAvailable } from '@/lib/supabase'

// Generate a persistent device ID (stored in settings)
async function getDeviceId(): Promise<string> {
  const existing = await db.settings.get('deviceId')
  if (existing?.value) return existing.value as string

  const deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  await db.settings.put({ key: 'deviceId', value: deviceId, updatedAt: Date.now() })
  return deviceId
}

export interface SyncResult {
  success: boolean
  eventsUploaded: number
  milestonesUploaded: number
  error?: string
}

/**
 * Sync usage events and milestones to Supabase.
 * Only syncs events older than 1 hour.
 * Non-blocking — sync failure never affects communication.
 */
export async function syncToSupabase(): Promise<SyncResult> {
  if (!isSupabaseAvailable()) {
    return { success: false, eventsUploaded: 0, milestonesUploaded: 0, error: 'Supabase not available' }
  }

  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, eventsUploaded: 0, milestonesUploaded: 0, error: 'Supabase not configured' }
  }

  try {
    const deviceId = await getDeviceId()
    const oneHourAgo = Date.now() - 60 * 60 * 1000

    // Get last sync timestamp
    const lastSyncSetting = await db.settings.get('lastSyncTimestamp')
    const lastSync = (lastSyncSetting?.value as number) ?? 0

    // 1. Sync usage events (older than 1 hour, after last sync)
    const events = await db.usageEvents
      .where('timestamp')
      .between(lastSync, oneHourAgo)
      .toArray()

    let eventsUploaded = 0
    if (events.length > 0) {
      const rows = events.map((e) => ({
        device_id: deviceId,
        word_id: e.wordId,
        word_label: e.wordLabel,
        word_category: e.wordCategory,
        sentence_context: e.sentenceContext ?? [],
        navigation_path: e.navigationPath,
        was_accepted: e.wasAccepted,
        session_id: e.sessionId,
        timestamp: e.timestamp,
        hour_of_day: e.hourOfDay,
        day_of_week: e.dayOfWeek,
      }))

      // Batch upload in chunks of 100
      for (let i = 0; i < rows.length; i += 100) {
        const chunk = rows.slice(i, i + 100)
        const { error } = await supabase.from('usage_events').insert(chunk)
        if (error) {
          console.warn('[Suara Sync] Events upload error:', error.message)
        } else {
          eventsUploaded += chunk.length
        }
      }
    }

    // 2. Sync milestones
    const milestones = await db.communicationMilestones.toArray()
    let milestonesUploaded = 0
    if (milestones.length > 0) {
      const milestoneRows = milestones.map((m) => ({
        device_id: deviceId,
        type: m.type,
        description: m.description,
        word_sequence: m.wordSequence,
        detected_at: m.detectedAt,
        narrative: m.narrative,
      }))

      const { error } = await supabase.from('communication_milestones').upsert(
        milestoneRows,
        { onConflict: 'device_id,type' }
      )
      if (error) {
        console.warn('[Suara Sync] Milestones upload error:', error.message)
      } else {
        milestonesUploaded = milestoneRows.length
      }
    }

    // 3. Sync vocabulary snapshot
    const allWords = await db.words.filter((w) => w.isActive).toArray()
    const snapshot = allWords.map((w) => ({ id: w.id, label: w.label, folderId: w.folderId, source: w.source }))
    await supabase.from('vocabulary_snapshots').upsert({
      device_id: deviceId,
      snapshot,
      word_count: snapshot.length,
    }, { onConflict: 'device_id' })

    // Update last sync timestamp
    await db.settings.put({ key: 'lastSyncTimestamp', value: Date.now(), updatedAt: Date.now() })

    console.log(`[Suara Sync] Done: ${eventsUploaded} events, ${milestonesUploaded} milestones`)
    return { success: true, eventsUploaded, milestonesUploaded }
  } catch (error) {
    console.warn('[Suara Sync] Failed:', error)
    return { success: false, eventsUploaded: 0, milestonesUploaded: 0, error: String(error) }
  }
}

/**
 * Start background sync interval.
 * Syncs every 5 minutes when online and Supabase is configured.
 */
let syncInterval: ReturnType<typeof setInterval> | null = null

export function startBackgroundSync(): void {
  if (syncInterval) return
  syncInterval = setInterval(() => {
    if (isSupabaseAvailable()) {
      syncToSupabase().catch(() => {})
    }
  }, 5 * 60 * 1000) // Every 5 minutes
}

export function stopBackgroundSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval)
    syncInterval = null
  }
}
