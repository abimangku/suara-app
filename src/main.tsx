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

// Request fullscreen on first user interaction (required by browser security)
// This hides the Android navigation bar for a truly immersive AAC experience
function setupFullscreenOnFirstTouch() {
  const requestFs = async () => {
    try {
      const el = document.documentElement
      if (el.requestFullscreen && !document.fullscreenElement) {
        await el.requestFullscreen({ navigationUI: 'hide' } as FullscreenOptions)
      }
    } catch {
      // Silently ignore — fullscreen fails in iframes, dev preview, etc.
    }
    window.removeEventListener('touchend', requestFs)
    window.removeEventListener('click', requestFs)
  }
  window.addEventListener('touchend', requestFs, { once: true, passive: true })
  window.addEventListener('click', requestFs, { once: true })
}

async function init() {
  await seedDatabase()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  setupFullscreenOnFirstTouch()
}

init()
