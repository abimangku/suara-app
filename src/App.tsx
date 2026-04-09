import SentenceBar from '@/components/SentenceBar/SentenceBar'
import SymbolGrid from '@/components/SymbolGrid/SymbolGrid'
import IntentSuggestions from '@/components/AI/IntentSuggestions'
import AdminOverlay from '@/components/Admin/AdminOverlay'
import { useAppStore } from '@/store/appStore'
import { useIntentSuggestions } from '@/hooks/useIntentSuggestions'

export default function App() {
  const isAdminOpen = useAppStore((s) => s.isAdminOpen)

  // Activate intent suggestions computation
  useIntentSuggestions()

  return (
    <div className="w-full h-full flex flex-col bg-suara-bg">
      <SentenceBar />
      <IntentSuggestions />
      <SymbolGrid />
      {isAdminOpen && <AdminOverlay />}
    </div>
  )
}
