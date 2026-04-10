import { db } from '@/lib/db'
import type { CommunicationMilestone } from '@/types'

const REQUEST_WORDS = ['mau', 'minta', 'bantu']
const COMMENT_WORDS = ['ada', 'ini', 'itu', 'suka', 'bisa']
const REFUSAL_WORDS = ['tidak', 'berhenti']
const PEOPLE_CATEGORY = 'people'

/**
 * Check for new communication milestones based on the sentence just spoken.
 * Only detects each milestone type once — subsequent instances are ignored.
 */
export async function checkForNewMilestones(
  spokenWords: string[],
  wordCategories: string[]
): Promise<CommunicationMilestone[]> {
  const newMilestones: CommunicationMilestone[] = []
  const now = Date.now()

  // Get existing milestone types
  const existing = await db.communicationMilestones.toArray()
  const existingTypes = new Set(existing.map((m) => m.type))

  const wordCount = spokenWords.length

  // First word spoken
  if (wordCount >= 1 && !existingTypes.has('first_word')) {
    newMilestones.push({
      type: 'first_word',
      description: `Kata pertama diucapkan: "${spokenWords[0]}"`,
      wordSequence: spokenWords,
      detectedAt: now,
    })
  }

  // First 2-word combination
  if (wordCount >= 2 && !existingTypes.has('first_2word')) {
    newMilestones.push({
      type: 'first_2word',
      description: `Kombinasi 2 kata pertama: "${spokenWords.join(' ')}"`,
      wordSequence: spokenWords,
      detectedAt: now,
    })
  }

  // First 3-word combination
  if (wordCount >= 3 && !existingTypes.has('first_3word')) {
    newMilestones.push({
      type: 'first_3word',
      description: `Kombinasi 3 kata pertama: "${spokenWords.join(' ')}"`,
      wordSequence: spokenWords,
      detectedAt: now,
    })
  }

  // First request (mau/minta + something)
  if (
    wordCount >= 2 &&
    !existingTypes.has('first_request') &&
    spokenWords.some((w) => REQUEST_WORDS.includes(w))
  ) {
    newMilestones.push({
      type: 'first_request',
      description: `Permintaan pertama: "${spokenWords.join(' ')}"`,
      wordSequence: spokenWords,
      detectedAt: now,
    })
  }

  // First refusal (tidak/berhenti)
  if (
    !existingTypes.has('first_refusal') &&
    spokenWords.some((w) => REFUSAL_WORDS.includes(w))
  ) {
    newMilestones.push({
      type: 'first_refusal',
      description: `Penolakan pertama: "${spokenWords.join(' ')}"`,
      wordSequence: spokenWords,
      detectedAt: now,
    })
  }

  // First comment (not a request — uses ada/ini/itu/suka/bisa without mau/minta)
  if (
    !existingTypes.has('first_comment') &&
    spokenWords.some((w) => COMMENT_WORDS.includes(w)) &&
    !spokenWords.some((w) => REQUEST_WORDS.includes(w))
  ) {
    newMilestones.push({
      type: 'first_comment',
      description: `Komentar pertama: "${spokenWords.join(' ')}"`,
      wordSequence: spokenWords,
      detectedAt: now,
    })
  }

  // First greeting (person name without request verb)
  if (
    !existingTypes.has('first_greeting') &&
    wordCategories.some((c) => c === PEOPLE_CATEGORY) &&
    !spokenWords.some((w) => REQUEST_WORDS.includes(w))
  ) {
    newMilestones.push({
      type: 'first_greeting',
      description: `Sapaan pertama: "${spokenWords.join(' ')}"`,
      wordSequence: spokenWords,
      detectedAt: now,
    })
  }

  // Vocabulary growth — every 10 unique words used
  if (!existingTypes.has('vocabulary_growth')) {
    const allEvents = await db.usageEvents.toArray()
    const uniqueWords = new Set(allEvents.map((e) => e.wordLabel))
    if (uniqueWords.size >= 10) {
      newMilestones.push({
        type: 'vocabulary_growth',
        description: `Sudah menggunakan ${uniqueWords.size} kata berbeda!`,
        wordSequence: Array.from(uniqueWords).slice(0, 10),
        detectedAt: now,
      })
    }
  }

  // Save new milestones to DB
  for (const milestone of newMilestones) {
    await db.communicationMilestones.add(milestone)
  }

  return newMilestones
}

/**
 * Get all milestones sorted by detection date.
 */
export async function getAllMilestones(): Promise<CommunicationMilestone[]> {
  return db.communicationMilestones.orderBy('detectedAt').toArray()
}
