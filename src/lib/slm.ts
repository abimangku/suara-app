import { chatCompletion, isApiAvailable } from '@/lib/openrouter'
import { CORE_WORDS } from '@/data/vocabulary'
import { db } from '@/lib/db'
import type { Word } from '@/types'

export interface SLMResult {
  suggestions: Word[]
  source: 'api' | 'local' | 'none'
}

/**
 * Get SLM-powered suggestions for the next word.
 * Currently uses OpenRouter API. When a local WASM model is available,
 * this function will try local first, then fall back to API.
 *
 * @param sentenceWords - Current sentence words
 * @param limit - Max number of suggestions
 * @returns SLM result with source indicator
 */
export async function getSLMSuggestions(
  sentenceWords: Word[],
  limit: number = 3
): Promise<SLMResult> {
  // Phase 5: API-only (local SLM deferred to Phase 6)
  // Future: try local WASM model first, fall back to API

  if (!isApiAvailable()) {
    return { suggestions: [], source: 'none' }
  }

  try {
    const wordLabels = sentenceWords.map((w) => w.label).join(', ')
    const sentenceLabels = new Set(sentenceWords.map((w) => w.label))

    // Build available vocabulary
    const allDbWords = await db.words.filter((w) => w.isActive).toArray()
    const coreLabels = CORE_WORDS.map((cw) => cw.label)
    const fringeLabels = allDbWords.map((w) => w.label)
    const available = [...coreLabels, ...fringeLabels]
      .filter((l) => !sentenceLabels.has(l))
      .slice(0, 50)

    const result = await chatCompletion(
      [
        {
          role: 'system',
          content:
            'Kamu adalah model bahasa untuk aplikasi AAC. Sarankan kata berikutnya berdasarkan konteks. Jawab HANYA dengan kata-kata dari daftar, dipisahkan koma. Maksimal ' +
            limit +
            ' kata.',
        },
        {
          role: 'user',
          content: `Kalimat: ${wordLabels}\nKosakata: ${available.join(', ')}`,
        },
      ],
      { maxTokens: 30, temperature: 0.2 }
    )

    if (!result) return { suggestions: [], source: 'none' }

    const suggestions: Word[] = []
    const labels = result
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)

    for (const label of labels) {
      if (suggestions.length >= limit) break

      // Resolve to Word
      const core = CORE_WORDS.find((cw) => cw.label === label)
      if (core) {
        suggestions.push({
          id: core.id,
          label: core.label,
          category: 'core',
          emoji: core.emoji,
          symbolPath: core.symbolPath,
          audioPath: core.audioPath,
        })
        continue
      }

      const dbWord = allDbWords.find((w) => w.label === label)
      if (dbWord) {
        suggestions.push({
          id: String(dbWord.id),
          label: dbWord.label,
          category: 'fringe',
          symbolPath: dbWord.symbolPath,
          photoBlob: dbWord.photoBlob,
        })
      }
    }

    return { suggestions, source: 'api' }
  } catch {
    return { suggestions: [], source: 'none' }
  }
}

/**
 * Check if a local SLM model is loaded and ready.
 * Phase 5: always returns false (no local model yet).
 * Phase 6: will check if WASM model is loaded in Web Worker.
 */
export function isLocalSLMReady(): boolean {
  return false
}

/**
 * Initialize the local SLM (load WASM model into Web Worker).
 * Phase 5: no-op.
 * Phase 6: will download and load the GGUF model.
 */
export async function initializeLocalSLM(): Promise<boolean> {
  console.log('[Suara SLM] Local SLM not yet available — using API fallback')
  return false
}
