import { useState } from 'react'
import { useUsageInsights } from '@/hooks/useUsageInsights'

interface UsageInsightsProps {
  onDone: () => void
}

export default function UsageInsights({ onDone: _onDone }: UsageInsightsProps) {
  const [period, setPeriod] = useState<7 | 30>(7)
  const { topWords, totalEvents, totalVocab, deadEnds } = useUsageInsights(period)

  const maxCount = topWords?.[0]?.count ?? 1

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-4">Wawasan Penggunaan</h3>

      {/* Period tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setPeriod(7)}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            period === 7 ? 'bg-suara-blue-bar text-white' : 'bg-suara-gray-light text-suara-gray'
          }`}
          type="button"
        >
          7 Hari
        </button>
        <button
          onClick={() => setPeriod(30)}
          className={`px-4 py-2 rounded-lg font-bold text-sm ${
            period === 30 ? 'bg-suara-blue-bar text-white' : 'bg-suara-gray-light text-suara-gray'
          }`}
          type="button"
        >
          30 Hari
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-suara-blue-light text-center">
          <p className="text-2xl font-bold text-suara-blue">{totalEvents ?? 0}</p>
          <p className="text-xs text-suara-blue/60 font-bold">Total ketukan</p>
        </div>
        <div className="p-4 rounded-xl bg-suara-green-light text-center">
          <p className="text-2xl font-bold text-suara-green">{totalVocab ?? 0}</p>
          <p className="text-xs text-suara-green/60 font-bold">Kosakata aktif</p>
        </div>
      </div>

      {/* Top words */}
      <h4 className="text-sm font-bold text-suara-gray mb-2">Kata paling sering digunakan</h4>
      {!topWords || topWords.length === 0 ? (
        <p className="text-sm text-suara-gray/50 py-4 text-center">Belum ada data penggunaan</p>
      ) : (
        <div className="flex flex-col gap-2">
          {topWords.map((word, i) => (
            <div key={word.label} className="flex items-center gap-3 p-2">
              <span className="w-6 text-right text-sm font-bold text-suara-gray/50">{i + 1}</span>
              <span className="w-24 text-sm font-bold text-suara-gray truncate">{word.label}</span>
              <div className="flex-1 h-5 bg-suara-gray-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-suara-blue-bar rounded-full"
                  style={{ width: `${(word.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-bold text-suara-gray/60">{word.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Dead-end detection */}
      <h4 className="text-sm font-bold text-suara-gray mt-6 mb-2">Jalan Buntu</h4>
      {!deadEnds || deadEnds.length === 0 ? (
        <p className="text-sm text-suara-gray/50 py-2">Semua folder digunakan dengan baik</p>
      ) : (
        <div className="flex flex-col gap-2">
          {deadEnds.map((de) => (
            <div key={de.folderKey} className="p-3 rounded-xl bg-suara-amber-light">
              <p className="text-sm font-bold text-suara-amber">{de.message}</p>
              <p className="text-xs text-suara-amber/60 mt-1">Mungkin ada kata yang belum ditambahkan</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
