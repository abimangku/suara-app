import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import App from '@/App'
import { seedDatabase } from '@/lib/seed'
import { db } from '@/lib/db'
import { useAppStore } from '@/store/appStore'
import { initCloudBackup } from '@/lib/cloud-backup'

// === AGGRESSIVE PWA UPDATE SYSTEM ===
// For a personal AAC app, updates should be immediate and automatic.
// The user should never be stuck on an old version.
//
// Strategy:
//  1. Check for SW updates every time the app comes to foreground
//  2. Check every 60 seconds while the app is active
//  3. When a new SW activates, auto-reload (no user action needed)
//  4. If auto-reload fails, show a persistent (non-dismissable) banner
if ('serviceWorker' in navigator) {
  // Auto-reload when a new service worker takes control
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })

  navigator.serviceWorker.ready.then((registration) => {
    // Check for updates every 60 seconds while app is active
    setInterval(() => {
      registration.update().catch(() => {})
    }, 60 * 1000)

    // Check for updates when app comes to foreground (user switches back to tablet)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update().catch(() => {})
      }
    })

    // If there's a waiting worker (update downloaded but not activated),
    // tell it to skip waiting immediately
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }

    // When a new worker is found, tell it to skip waiting as soon as it's installed
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available — skip waiting to activate immediately
            newWorker.postMessage({ type: 'SKIP_WAITING' })
          }
        })
      }
    })
  })
}

// Request fullscreen + lock to landscape on first user interaction.
// Browsers require a user gesture for both APIs. Screen Orientation Lock API
// only works when the document is in fullscreen mode — so we chain them.
function setupFullscreenAndOrientationOnFirstTouch() {
  const requestImmersive = async () => {
    try {
      const el = document.documentElement
      if (el.requestFullscreen && !document.fullscreenElement) {
        await el.requestFullscreen({ navigationUI: 'hide' } as FullscreenOptions)
      }
    } catch {
      // Silently ignore — fullscreen fails in iframes, dev preview, etc.
    }

    // Only attempt orientation lock if we actually entered fullscreen
    if (document.fullscreenElement) {
      try {
        if (screen.orientation?.lock) {
          await screen.orientation.lock('landscape')
        }
      } catch {
        // Orientation lock unsupported (iOS, older Chrome) — silently fall back to CSS portrait warning
      }
    }

    // Fire silent warmup utterance to prime TTS phoneme engine.
    // Must run inside a user gesture handler — Chrome Android autoplay policy
    // drops pre-gesture warmups silently.
    warmupTtsEngine()

    window.removeEventListener('touchend', requestImmersive)
    window.removeEventListener('click', requestImmersive)
  }
  window.addEventListener('touchend', requestImmersive, { once: true, passive: true })
  window.addEventListener('click', requestImmersive, { once: true })
}

// Load browser voice list — does NOT require a user gesture.
// Indonesian voice metadata needs to be resolved before the first tap.
function loadVoices() {
  try {
    speechSynthesis.getVoices()
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        speechSynthesis.getVoices()
      })
    }
  } catch {
    // TTS not supported — fallback handled elsewhere
  }
}

// Fire a silent utterance to warm up the phoneme engine.
// MUST run inside a user gesture handler on Chrome Android (autoplay policy).
function warmupTtsEngine() {
  try {
    const warmup = new SpeechSynthesisUtterance(' ')
    warmup.lang = 'id-ID'
    warmup.volume = 0
    warmup.rate = 2 // Some browsers clamp rate > ~4; 2 is safe and still fast.
    speechSynthesis.speak(warmup)
  } catch {
    // TTS not supported — fallback handled elsewhere
  }
}

async function init() {
  // Request persistent storage so Chrome doesn't evict IndexedDB under
  // storage pressure. Without this, Android Chrome can silently wipe all
  // user data (renamed people, photos, emergency contacts, PIN) when disk
  // is low — and seedDatabase() recreates defaults, making it look like
  // "changes came back to normal." Installed PWAs usually get persistence
  // granted automatically on Chrome Android.
  try {
    if (navigator.storage?.persist) {
      const granted = await navigator.storage.persist()
      if (!granted && import.meta.env.DEV) {
        console.warn('[Suara] Persistent storage NOT granted — data may be evicted under storage pressure')
      }
    }
  } catch {
    // Storage API not available — continue without persistence
  }

  await seedDatabase()

  // Restore persisted settings into Zustand store.
  // These settings live in IndexedDB (survive reloads) but the store
  // defaults to safe values — we read DB and override if present.
  try {
    const [hapticSetting, hiddenSetting] = await Promise.all([
      db.settings.get('hapticLevel'),
      db.settings.get('hiddenWords'),
    ])
    if (hapticSetting?.value) {
      useAppStore.getState().setHapticLevel(hapticSetting.value as 'off' | 'light' | 'medium' | 'strong')
    }
    if (hiddenSetting?.value && Array.isArray(hiddenSetting.value)) {
      useAppStore.setState({ hiddenWords: hiddenSetting.value as string[] })
    }
  } catch {
    // DB read failure — keep defaults
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  setupFullscreenAndOrientationOnFirstTouch()
  loadVoices()
  initCloudBackup() // Start cloud backup listeners (Supabase Storage)

  // Re-acquire orientation lock when user re-enters fullscreen
  // (Android back button / swipe gesture releases it).
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement && screen.orientation?.lock) {
      screen.orientation.lock('landscape').catch(() => {
        // Lock not supported — silently continue
      })
    }
  })
}

init()
