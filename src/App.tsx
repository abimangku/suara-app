import { useEffect } from 'react'
import Dashboard from '@/pages/Dashboard'
import SentenceBar from '@/components/SentenceBar/SentenceBar'
import SymbolGrid from '@/components/SymbolGrid/SymbolGrid'
import IntentSuggestions from '@/components/AI/IntentSuggestions'
import AdminOverlay from '@/components/Admin/AdminOverlay'
import SymbolSearch from '@/components/AI/SymbolSearch'
import CaregiverPane from '@/components/AI/CaregiverPane'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import { useAppStore } from '@/store/appStore'
import { useIntentSuggestions } from '@/hooks/useIntentSuggestions'
import { startBackgroundSync, stopBackgroundSync } from '@/lib/sync'

export default function App() {
  // Check for dashboard mode via URL parameter
  const isDashboard = new URLSearchParams(window.location.search).has('dashboard')

  const isAdminOpen = useAppStore((s) => s.isAdminOpen)

  // Start background sync (only active when Supabase env vars are configured)
  useEffect(() => {
    startBackgroundSync()
    return () => stopBackgroundSync()
  }, [])

  // Activate intent suggestions computation
  useIntentSuggestions()

  if (isDashboard) {
    return <Dashboard />
  }

  return (
    <div className="w-full h-full flex flex-col bg-suara-bg">
      <ErrorBoundary>
        <SentenceBar />
      </ErrorBoundary>
      <ErrorBoundary>
        <IntentSuggestions />
      </ErrorBoundary>
      <ErrorBoundary>
        <SymbolGrid />
      </ErrorBoundary>
      <ErrorBoundary>
        <CaregiverPane />
      </ErrorBoundary>
      {isAdminOpen && (
        <ErrorBoundary>
          <AdminOverlay />
        </ErrorBoundary>
      )}
      <ErrorBoundary>
        <SymbolSearch />
      </ErrorBoundary>
    </div>
  )
}
