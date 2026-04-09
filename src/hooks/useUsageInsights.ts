import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { detectDeadEnds } from '@/lib/vocabulary-gaps'

interface WordCount {
  label: string
  count: number
}

export function useUsageInsights(days: 7 | 30) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  const topWords = useLiveQuery(async () => {
    const events = await db.usageEvents
      .where('timestamp')
      .above(cutoff)
      .toArray()

    const counts = new Map<string, number>()
    for (const e of events) {
      counts.set(e.wordLabel, (counts.get(e.wordLabel) ?? 0) + 1)
    }

    const sorted: WordCount[] = Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return sorted
  }, [days])

  const totalEvents = useLiveQuery(async () => {
    return db.usageEvents.where('timestamp').above(cutoff).count()
  }, [days])

  const totalVocab = useLiveQuery(async () => {
    return db.words.filter((w) => w.isActive).count()
  }, [])

  const deadEnds = useLiveQuery(async () => {
    return detectDeadEnds(days)
  }, [days])

  return { topWords, totalEvents, totalVocab, deadEnds }
}
