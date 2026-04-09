import BottomSheet from '@/components/shared/BottomSheet'
import { QUICK_PHRASES } from '@/data/vocabulary'

interface QuickPhrasesProps {
  isOpen: boolean
  onClose: () => void
  onPhraseTap: (words: string[]) => void
}

export default function QuickPhrases({
  isOpen,
  onClose,
  onPhraseTap,
}: QuickPhrasesProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <h2 className="text-suara-gray font-bold text-lg mb-3">Frasa Cepat</h2>
      <div className="flex flex-col gap-2">
        {QUICK_PHRASES.map((qp) => (
          <button
            key={qp.id}
            className="w-full text-left px-5 py-4 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-[16px] active:scale-[0.98] transition-transform duration-[80ms] select-none"
            onClick={() => {
              onPhraseTap(qp.words)
              onClose()
            }}
            type="button"
          >
            {qp.phrase}
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
