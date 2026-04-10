const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Simple in-memory cache
const responseCache = new Map<string, { response: string; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour
let lastCallTimestamp = 0
const RATE_LIMIT_MS = 5000 // 1 call per 5 seconds

/**
 * Check if OpenRouter API is available (key configured + online).
 */
export function isApiAvailable(): boolean {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY
  return Boolean(key) && navigator.onLine
}

/**
 * Send a chat completion request to OpenRouter.
 * Returns empty string on any failure — callers handle gracefully.
 * Includes caching (1 hour) and rate limiting (1 call per 5s).
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string
    maxTokens?: number
    temperature?: number
  }
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey || !navigator.onLine) return ''

  // Cache check
  const cacheKey = JSON.stringify(messages)
  const cached = responseCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response
  }

  // Rate limit check
  const now = Date.now()
  if (now - lastCallTimestamp < RATE_LIMIT_MS) {
    return ''
  }
  lastCallTimestamp = now

  try {
    const model = options?.model ?? import.meta.env.VITE_OPENROUTER_MODEL ?? 'anthropic/claude-sonnet-4-20250514'

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Suara AAC',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: options?.maxTokens ?? 200,
        temperature: options?.temperature ?? 0.3,
      }),
    })

    if (!response.ok) {
      console.warn(`[Suara] OpenRouter API error: ${response.status}`)
      return ''
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content ?? ''

    // Cache the response
    responseCache.set(cacheKey, { response: content, timestamp: Date.now() })

    return content.trim()
  } catch (error) {
    console.warn('[Suara] OpenRouter API call failed:', error)
    return ''
  }
}

/**
 * Clear the response cache (useful for testing or forcing fresh results).
 */
export function clearCache(): void {
  responseCache.clear()
}
