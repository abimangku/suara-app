import { db } from '@/lib/db'
import { CORE_WORDS } from '@/data/vocabulary'
import { BIGRAMS } from '@/lib/bigrams'
import { chatCompletion, isApiAvailable } from '@/lib/openrouter'
import type { Word } from '@/types'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

/**
 * Compute intent suggestions based on usage history.
 *
 * Algorithm:
 * 1. Query last 30 days of usageEvents
 * 2. Find events where sentenceContext matches current sentence
 * 3. Score each following word by:
 *    - frequency: how many times this word followed this context
 *    - recency: exponential decay — recent usage weighted higher
 *    - time_of_day: words used at similar hour (+/- 2 hours) score higher
 * 4. Return top N scoring words not already in current sentence
 */
export async function computeSuggestions(
  sentenceWords: Word[],
  limit: number = 3
): Promise<Word[]> {
  if (sentenceWords.length < 2) return []

  const now = Date.now()
  const cutoff = now - THIRTY_DAYS_MS
  const currentHour = new Date().getHours()
  const currentWordIds = new Set(sentenceWords.map((w) => w.id))

  // Get the last 1-2 words as context keys
  const lastWord = sentenceWords[sentenceWords.length - 1]
  const secondLastWord =
    sentenceWords.length >= 2
      ? sentenceWords[sentenceWords.length - 2]
      : null

  // Query recent usage events
  const events = await db.usageEvents
    .where('timestamp')
    .above(cutoff)
    .toArray()

  // Score each word that appeared after similar context
  const scores = new Map<
    string,
    { score: number; label: string; category: string }
  >()

  for (const event of events) {
    // Check if this event's sentence context matches our current sentence ending
    const ctx = event.sentenceContext ?? []
    const matchesContext =
      ctx.length >= 1 &&
      ctx[ctx.length - 1] === lastWord.label &&
      (secondLastWord === null ||
        (ctx.length >= 2 &&
          ctx[ctx.length - 2] === secondLastWord.label))

    if (!matchesContext) continue

    // This word followed a matching context — score it
    const wordId = event.wordId

    // Skip if already in current sentence
    if (currentWordIds.has(wordId)) continue

    // Calculate frequency score component
    const existing = scores.get(wordId) ?? {
      score: 0,
      label: event.wordLabel,
      category: event.wordCategory,
    }

    // Recency weight: exponential decay over 30 days
    const ageMs = now - event.timestamp
    const ageDays = ageMs / (24 * 60 * 60 * 1000)
    const recencyWeight = Math.exp(-ageDays / 15) // Half-life of ~15 days

    // Time-of-day weight: higher if used at similar hour
    const hourDiff = Math.abs(currentHour - event.hourOfDay)
    const wrappedHourDiff = Math.min(hourDiff, 24 - hourDiff)
    const timeWeight = wrappedHourDiff <= 2 ? 1.5 : 1.0

    existing.score += recencyWeight * timeWeight
    scores.set(wordId, existing)
  }

  // Sort by score descending, take top N
  const ranked = Array.from(scores.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, limit)

  // Build full Word objects for the suggestions
  const suggestions: Word[] = []

  for (const [wordId, data] of ranked) {
    // Try to find full word data
    const word = await resolveWord(
      wordId,
      data.label,
      data.category as Word['category']
    )
    if (word) suggestions.push(word)
  }

  // Cold-start fallback: fill remaining slots from static bigrams
  if (suggestions.length < limit) {
    const lastWordLabel = sentenceWords[sentenceWords.length - 1].label
    const bigramCandidates = BIGRAMS[lastWordLabel] ?? []
    const existingIds = new Set(suggestions.map((s) => s.id))

    for (const candidateLabel of bigramCandidates) {
      if (suggestions.length >= limit) break
      // Skip if already suggested or in sentence
      if (currentWordIds.has(candidateLabel) || existingIds.has(candidateLabel)) continue

      // Try to resolve as a full Word
      const resolved = await resolveWordByLabel(candidateLabel)
      if (resolved && !existingIds.has(resolved.id)) {
        suggestions.push(resolved)
        existingIds.add(resolved.id)
      }
    }
  }

  // API enhancement: fill remaining slots with API suggestions when online
  if (suggestions.length < limit) {
    const apiSuggestions = await getApiSuggestions(sentenceWords, suggestions, limit)
    suggestions.push(...apiSuggestions)
  }

  return suggestions
}

/**
 * Get API-enhanced suggestions when online and local model has gaps.
 * Supplements (doesn't replace) frequency + bigram suggestions.
 */
async function getApiSuggestions(
  sentenceWords: Word[],
  existingSuggestions: Word[],
  limit: number
): Promise<Word[]> {
  if (!isApiAvailable()) return []

  const slotsNeeded = limit - existingSuggestions.length
  if (slotsNeeded <= 0) return []

  const wordLabels = sentenceWords.map((w) => w.label).join(', ')
  const existingLabels = new Set(existingSuggestions.map((s) => s.label))
  const sentenceLabels = new Set(sentenceWords.map((w) => w.label))

  // Get all available words to constrain suggestions
  const allDbWords = await db.words.filter((w) => w.isActive).toArray()
  const allCoreLabels = CORE_WORDS.map((cw) => cw.label)
  const allFringeLabels = allDbWords.map((w) => w.label)
  const availableVocab = [...allCoreLabels, ...allFringeLabels]
    .filter((l) => !existingLabels.has(l) && !sentenceLabels.has(l))

  try {
    const result = await chatCompletion([
      {
        role: 'system',
        content: 'Kamu membantu aplikasi AAC. Berikan saran kata berikutnya berdasarkan konteks kalimat. Jawab HANYA dengan kata-kata dari daftar kosakata yang tersedia, dipisahkan koma. Maksimal 3 kata. Tidak ada penjelasan.',
      },
      {
        role: 'user',
        content: `Kalimat sejauh ini: ${wordLabels}\nKosakata tersedia: ${availableVocab.slice(0, 50).join(', ')}\nSarankan ${slotsNeeded} kata berikutnya yang paling mungkin:`,
      },
    ], { maxTokens: 50, temperature: 0.2 })

    if (!result) return []

    // Parse comma-separated response
    const apiWords = result.split(',').map((w) => w.trim().toLowerCase()).filter(Boolean)
    const apiSuggestions: Word[] = []

    for (const label of apiWords) {
      if (apiSuggestions.length >= slotsNeeded) break
      if (existingLabels.has(label) || sentenceLabels.has(label)) continue

      const resolved = await resolveWordByLabel(label)
      if (resolved) {
        apiSuggestions.push(resolved)
        existingLabels.add(label)
      }
    }

    return apiSuggestions
  } catch {
    return []
  }
}

/**
 * Resolve a word by its label string (for bigram lookups).
 */
async function resolveWordByLabel(label: string): Promise<Word | null> {
  // Check core words
  const coreWord = CORE_WORDS.find((cw) => cw.label === label)
  if (coreWord) {
    return {
      id: coreWord.id,
      label: coreWord.label,
      category: 'core',
      emoji: coreWord.emoji,
      symbolPath: coreWord.symbolPath,
      audioPath: coreWord.audioPath,
    }
  }

  // Check DB words by label
  const dbWords = await db.words.filter((w) => w.isActive && w.label === label).toArray()
  if (dbWords.length > 0) {
    const w = dbWords[0]
    return {
      id: String(w.id),
      label: w.label,
      category: 'fringe',
      symbolPath: w.symbolPath,
      photoBlob: w.photoBlob,
      audioPath: w.audioPath,
      audioBlob: w.audioBlob,
    }
  }

  // Check people
  const people = await db.people.filter((p) => p.isActive && p.name.toLowerCase() === label.toLowerCase()).toArray()
  if (people.length > 0) {
    return {
      id: String(people[0].id),
      label: people[0].name,
      category: 'people',
    }
  }

  return null
}

/**
 * Resolve a wordId to a full Word object with symbol/audio data.
 */
async function resolveWord(
  wordId: string,
  label: string,
  category: Word['category']
): Promise<Word | null> {
  // Check core words first
  const coreWord = CORE_WORDS.find((cw) => cw.id === wordId)
  if (coreWord) {
    return {
      id: coreWord.id,
      label: coreWord.label,
      category: 'core',
      emoji: coreWord.emoji,
      symbolPath: coreWord.symbolPath,
      audioPath: coreWord.audioPath,
    }
  }

  // Check fringe words in DB
  const dbWord = await db.words.get(Number(wordId))
  if (dbWord && dbWord.isActive) {
    return {
      id: String(dbWord.id),
      label: dbWord.label,
      category: 'fringe',
      symbolPath: dbWord.symbolPath,
      photoBlob: dbWord.photoBlob,
      audioPath: dbWord.audioPath,
      audioBlob: dbWord.audioBlob,
    }
  }

  // Check people
  const person = await db.people.get(Number(wordId))
  if (person && person.isActive) {
    return {
      id: String(person.id),
      label: person.name,
      category: 'people',
    }
  }

  // Fallback — return minimal word
  return {
    id: wordId,
    label,
    category,
  }
}
