import { db } from '@/lib/db'

interface DeadEnd {
  folderKey: string
  folderLabel: string
  count: number
  message: string
}

/**
 * Detect vocabulary gaps — folders that were opened but no word was tapped from them.
 * A dead-end = a usage event with wordCategory 'fringe' or where navigationPath includes
 * a folder key, but examining the event sequence shows the folder was opened without
 * a word selection following it.
 *
 * Simplified approach: count folder-open events (folder key appears in navigationPath[0])
 * vs word-tap events from that folder. Gaps = opens - taps.
 */
export async function detectDeadEnds(days: 7 | 30): Promise<DeadEnd[]> {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  const events = await db.usageEvents
    .where('timestamp')
    .above(cutoff)
    .toArray()

  // Count folder opens vs word taps per folder
  const folderTaps = new Map<string, number>()

  for (const event of events) {
    const path = event.navigationPath
    if (path.length >= 1 && event.wordCategory === 'fringe') {
      const folderKey = path[0]
      folderTaps.set(folderKey, (folderTaps.get(folderKey) ?? 0) + 1)
    }
  }

  // For now, estimate opens from navigation patterns
  // A simple heuristic: if a folder has taps, it was opened at least that many times
  // Dead-ends show up as folders with low tap-to-open ratio
  // More accurate tracking requires logging folder-open events separately (Phase 5)

  // Get all folders for labels
  const folders = await db.folders.filter((f) => f.isActive).toArray()

  const results: DeadEnd[] = []

  // Check each folder's usage — folders with zero taps in the period are potential gaps
  for (const folder of folders) {
    const taps = folderTaps.get(folder.key) ?? 0
    if (taps === 0) {
      results.push({
        folderKey: folder.key,
        folderLabel: folder.label,
        count: 0,
        message: `${folder.emoji} ${folder.label} tidak digunakan dalam ${days} hari terakhir`,
      })
    }
  }

  return results
}
