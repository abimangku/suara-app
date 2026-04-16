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
    try {
      // Lock to landscape — requires fullscreen on Android Chrome
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (orientation: OrientationLockType) => Promise<void>
      }
      if (orientation && typeof orientation.lock === 'function') {
        await orientation.lock('landscape')
      }
    } catch {
      // Falls back to CSS portrait warning if lock is unsupported
    }
    window.removeEventListener('touchend', requestImmersive)
    window.removeEventListener('click', requestImmersive)
  }
  window.addEventListener('touchend', requestImmersive, { once: true, passive: true })
  window.addEventListener('click', requestImmersive, { once: true })
}

// Pre-warm the browser TTS engine on app init.
// This loads the Indonesian voice and pronunciation data BEFORE the user taps,
// eliminating the 200-500ms cold-start latency on the first word.
function prewarmSpeechSynthesis() {
  try {
    // Trigger voice list loading (async on most browsers)
    speechSynthesis.getVoices()
    // Some browsers populate voices lazily — listen for the event
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices()
      }
    }
    // Fire a silent utterance to warm up the phoneme engine.
    // Using a very short string at zero volume — imperceptible but forces init.
    const warmup = new SpeechSynthesisUtterance(' ')
    warmup.lang = 'id-ID'
    warmup.volume = 0
    warmup.rate = 10
    speechSynthesis.speak(warmup)
  } catch {
    // TTS not supported — fallback handled elsewhere
  }
}

async function init() {
  await seedDatabase()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  setupFullscreenAndOrientationOnFirstTouch()
  prewarmSpeechSynthesis()
}

init()
