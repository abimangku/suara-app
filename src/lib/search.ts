import Fuse, { type IFuseOptions } from 'fuse.js'
import { db } from '@/lib/db'
import { CORE_WORDS } from '@/data/vocabulary'
import type { Word } from '@/types'

let fuseInstance: Fuse<Word> | null = null
let allWords: Word[] = []

const FUSE_OPTIONS: IFuseOptions<Word> = {
  keys: ['label'],
  threshold: 0.4,
  distance: 100,
  includeScore: true,
}

/**
 * Initialize the Fuse.js search index with all vocabulary.
 * Call on app mount and after vocabulary changes.
 */
export async function initializeSearch(): Promise<void> {
  allWords = []

  // Add core words
  for (const cw of CORE_WORDS) {
    allWords.push({
      id: cw.id,
      label: cw.label,
      category: 'core',
      emoji: cw.emoji,
      symbolPath: cw.symbolPath,
      audioPath: cw.audioPath,
    })
  }

  // Add fringe words from DB
  const dbWords = await db.words.filter((w) => w.isActive).toArray()
  for (const w of dbWords) {
    allWords.push({
      id: String(w.id),
      label: w.label,
      category: 'fringe',
      symbolPath: w.symbolPath,
      photoBlob: w.photoBlob,
      audioPath: w.audioPath,
      audioBlob: w.audioBlob,
    })
  }

  // Add people from DB
  const people = await db.people.filter((p) => p.isActive).toArray()
  for (const p of people) {
    allWords.push({
      id: String(p.id),
      label: p.name,
      category: 'people',
    })
  }

  fuseInstance = new Fuse(allWords, FUSE_OPTIONS)
}

/**
 * Search for symbols matching a query string.
 * Returns fuzzy-matched words sorted by relevance.
 */
export function searchSymbols(query: string, limit: number = 10): Word[] {
  if (!fuseInstance || !query.trim()) return []

  const results = fuseInstance.search(query, { limit })
  return results.map((r) => r.item)
}

/**
 * Refresh the search index after vocabulary changes.
 * Same as initializeSearch — rebuilds the entire index.
 */
export async function refreshIndex(): Promise<void> {
  return initializeSearch()
}
