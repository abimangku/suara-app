import SentenceBar from '@/components/SentenceBar/SentenceBar'
import SymbolGrid from '@/components/SymbolGrid/SymbolGrid'

export default function App() {
  return (
    <div className="w-full h-full flex flex-col bg-suara-bg">
      <SentenceBar />
      <SymbolGrid />
    </div>
  )
}
