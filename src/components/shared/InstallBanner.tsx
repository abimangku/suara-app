import { useEffect, useState } from 'react'

// TypeScript doesn't ship types for the Chrome/Edge-specific install prompt.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

/**
 * A small install affordance that appears when the browser reports the PWA
 * is installable (via the `beforeinstallprompt` event). Tapping the button
 * fires Chrome's native install dialog — this works even when the three-dot
 * menu doesn't surface an "Install app" option (Samsung Chrome sometimes
 * buries or omits it).
 *
 * Once installed (or dismissed), the banner hides for the session. If the
 * user later uninstalls and revisits, the event fires again.
 */
export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Don't show if already running as an installed PWA.
    const isStandalone =
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    if (isStandalone) {
      setHidden(true)
      return
    }

    function onBeforeInstallPrompt(e: Event) {
      // Chrome wants to show its own dialog immediately — we defer so the
      // user can trigger it at a moment of their choosing.
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    function onAppInstalled() {
      setDeferredPrompt(null)
      setHidden(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      // Whether accepted or dismissed, clear the event — Chrome only allows
      // prompt() once per event instance.
      setDeferredPrompt(null)
      if (outcome === 'accepted') {
        setHidden(true)
      }
    } catch {
      // Some browsers throw if prompt was already consumed; fail quietly.
      setDeferredPrompt(null)
    }
  }

  if (hidden || !deferredPrompt) return null

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-3 bg-suara-blue-bar text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold">
      <span>📲 Install Suara di tablet</span>
      <button
        onClick={handleInstall}
        className="px-3 py-1.5 rounded-lg bg-white text-suara-blue font-extrabold text-xs active:scale-[0.96] transition-transform"
        type="button"
      >
        Install
      </button>
      <button
        onClick={() => setHidden(true)}
        className="text-white/80 text-lg leading-none px-1"
        type="button"
        aria-label="Tutup"
      >
        ✕
      </button>
    </div>
  )
}
