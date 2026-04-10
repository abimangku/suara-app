import { useCaregiverTranslation } from '@/hooks/useCaregiverTranslation'
import { useAppStore } from '@/store/appStore'

export default function CaregiverPane() {
  const isCaregiverPaneOpen = useAppStore((s) => s.isCaregiverPaneOpen)
  const sentenceWords = useAppStore((s) => s.sentenceWords)
  const { translation, isLoading } = useCaregiverTranslation()

  if (!isCaregiverPaneOpen || sentenceWords.length < 2) return null

  return (
    <div className="w-full px-4 py-2 bg-suara-amber-light border-t border-suara-amber/20 shrink-0">
      <div className="flex items-start gap-2 max-w-2xl mx-auto">
        <span className="text-sm shrink-0 mt-0.5">💬</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-suara-amber/60 mb-0.5">Interpretasi untuk pendamping:</p>
          {isLoading ? (
            <p className="text-sm text-suara-amber/80 italic">Menerjemahkan...</p>
          ) : (
            <p className="text-sm font-bold text-suara-amber">{translation}</p>
          )}
        </div>
      </div>
    </div>
  )
}
