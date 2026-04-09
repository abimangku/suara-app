import { useRef } from 'react'
import { db } from '@/lib/db'
import type { Word, UsageEvent } from '@/types'

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useUsageLog() {
  const sessionIdRef = useRef(generateSessionId())

  async function logTap(
    word: Word,
    context: {
      sentenceContext: string[]
      activeFolderKey: string | null
    }
  ): Promise<void> {
    const now = new Date()
    const event: Omit<UsageEvent, 'id'> = {
      wordId: word.id,
      wordLabel: word.label,
      wordCategory: word.category,
      folderId: undefined,
      sentenceContext: context.sentenceContext,
      navigationPath: context.activeFolderKey
        ? [context.activeFolderKey, word.id]
        : [word.id],
      wasAccepted: false,
      sessionId: sessionIdRef.current,
      timestamp: now.getTime(),
      hourOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
    }

    try {
      await db.usageEvents.add(event as UsageEvent)
    } catch {
      // Silent fail — usage logging must never block communication
    }
  }

  return { logTap }
}
