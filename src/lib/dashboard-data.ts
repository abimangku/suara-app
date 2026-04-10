import { db } from '@/lib/db'
import type { CommunicationMilestone } from '@/types'

export interface DashboardData {
  totalTaps: number
  totalWords: number
  totalPeople: number
  tapsPerDay: Array<{ date: string; count: number }>
  topWords: Array<{ label: string; count: number }>
  milestones: CommunicationMilestone[]
  folderUsage: Array<{ folder: string; count: number }>
  lastSyncAt: number | null
}

/**
 * Compute dashboard data from local IndexedDB.
 */
export async function computeDashboardData(): Promise<DashboardData> {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

  // Total counts
  const totalWords = await db.words.filter((w) => w.isActive).count()
  const totalPeople = await db.people.filter((p) => p.isActive).count()

  // Events in last 30 days
  const events = await db.usageEvents.where('timestamp').above(thirtyDaysAgo).toArray()
  const totalTaps = events.length

  // Taps per day (last 30 days)
  const dayMap = new Map<string, number>()
  for (const e of events) {
    const date = new Date(e.timestamp).toISOString().split('T')[0]
    dayMap.set(date, (dayMap.get(date) ?? 0) + 1)
  }
  const tapsPerDay = Array.from(dayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Top words
  const wordCounts = new Map<string, number>()
  for (const e of events) {
    wordCounts.set(e.wordLabel, (wordCounts.get(e.wordLabel) ?? 0) + 1)
  }
  const topWords = Array.from(wordCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  // Folder usage
  const folderCounts = new Map<string, number>()
  for (const e of events) {
    if (e.wordCategory === 'fringe' && e.navigationPath.length >= 1) {
      const folder = e.navigationPath[0]
      folderCounts.set(folder, (folderCounts.get(folder) ?? 0) + 1)
    }
  }
  const folderUsage = Array.from(folderCounts.entries())
    .map(([folder, count]) => ({ folder, count }))
    .sort((a, b) => b.count - a.count)

  // Milestones
  const milestones = await db.communicationMilestones.orderBy('detectedAt').toArray()

  // Last sync
  const lastSyncSetting = await db.settings.get('lastSyncTimestamp')
  const lastSyncAt = (lastSyncSetting?.value as number) ?? null

  return { totalTaps, totalWords, totalPeople, tapsPerDay, topWords, milestones, folderUsage, lastSyncAt }
}
