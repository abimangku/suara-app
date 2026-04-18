import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import App from '@/App'
import { seedDatabase } from '@/lib/seed'

// Register PWA update handler
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            // Show update toast (non-blocking)
            const toast = document.createElement('div')
            toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm shadow-lg cursor-pointer'
            toast.textContent = 'Versi baru tersedia — ketuk untuk memperbarui'
            toast.style.fontFamily = "'Nunito', sans-serif"
            toast.onclick = () => {
              window.location.reload()
            }
            document.body.appendChild(toast)
            // Auto-dismiss after 10 seconds
            setTimeout(() => toast.remove(), 10000)
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
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  setupFullscreenAndOrientationOnFirstTouch()
  loadVoices()

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
