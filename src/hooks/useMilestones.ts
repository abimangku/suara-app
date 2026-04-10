import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import type { CommunicationMilestone } from '@/types'

export function useMilestones() {
  const milestones = useLiveQuery(
    () => db.communicationMilestones.orderBy('detectedAt').reverse().toArray(),
    []
  )

  return { milestones: (milestones ?? []) as CommunicationMilestone[] }
}
