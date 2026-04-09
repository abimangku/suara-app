import SentenceBar from '@/components/SentenceBar/SentenceBar'
import SymbolGrid from '@/components/SymbolGrid/SymbolGrid'
import AdminOverlay from '@/components/Admin/AdminOverlay'
import { useAppStore } from '@/store/appStore'

export default function App() {
  const isAdminOpen = useAppStore((s) => s.isAdminOpen)

  return (
    <div className="w-full h-full flex flex-col bg-suara-bg">
      <SentenceBar />
      <SymbolGrid />
      {isAdminOpen && <AdminOverlay />}
    </div>
  )
}
