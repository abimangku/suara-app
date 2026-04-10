import { useEffect } from 'react'
import SentenceBar from '@/components/SentenceBar/SentenceBar'
import SymbolGrid from '@/components/SymbolGrid/SymbolGrid'
import IntentSuggestions from '@/components/AI/IntentSuggestions'
import AdminOverlay from '@/components/Admin/AdminOverlay'
import SymbolSearch from '@/components/AI/SymbolSearch'
import CaregiverPane from '@/components/AI/CaregiverPane'
import { useAppStore } from '@/store/appStore'
import { useIntentSuggestions } from '@/hooks/useIntentSuggestions'
import { startBackgroundSync } from '@/lib/sync'

export default function App() {
  const isAdminOpen = useAppStore((s) => s.isAdminOpen)

  // Start background sync (only active when Supabase env vars are configured)
  useEffect(() => {
    startBackgroundSync()
  }, [])

  // Activate intent suggestions computation
  useIntentSuggestions()

  return (
    <div className="w-full h-full flex flex-col bg-suara-bg">
      <SentenceBar />
      <IntentSuggestions />
      <SymbolGrid />
      <CaregiverPane />
      {isAdminOpen && <AdminOverlay />}
      <SymbolSearch />
    </div>
  )
}
