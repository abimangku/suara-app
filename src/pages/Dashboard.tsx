import { useState, useEffect } from 'react'
import { computeDashboardData, type DashboardData } from '@/lib/dashboard-data'
import { useAdmin } from '@/hooks/useAdmin'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const { verifyPin } = useAdmin()

  useEffect(() => {
    if (isAuthenticated) {
      computeDashboardData().then(setData)
    }
  }, [isAuthenticated])

  async function handlePinSubmit() {
    if (pin.length < 4) { setError('Minimal 4 digit'); return }
    const valid = await verifyPin(pin)
    if (valid) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('PIN salah')
      setPin('')
    }
  }

  // PIN gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-suara-bg flex flex-col items-center justify-center p-4 font-sans">
        <h1 className="text-2xl font-bold text-suara-blue mb-2">Suara Dashboard</h1>
        <p className="text-sm text-suara-gray/60 mb-6">Masukkan PIN admin untuk melihat data</p>
        {error && <p className="text-sm text-suara-danger font-bold mb-3">{error}</p>}
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="PIN"
          className="w-48 px-4 py-3 rounded-xl border-2 border-suara-gray-border bg-white text-center text-xl font-bold text-suara-gray focus:outline-none focus:border-suara-blue mb-4"
          autoFocus
        />
        <button
          onClick={handlePinSubmit}
          className="px-8 py-3 rounded-xl bg-suara-blue-bar text-white font-bold active:scale-95 transition-transform"
          type="button"
        >
          Masuk
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-suara-bg flex items-center justify-center font-sans">
        <p className="text-suara-gray font-bold">Memuat data...</p>
      </div>
    )
  }

  const maxTapDay = Math.max(...data.tapsPerDay.map((d) => d.count), 1)
  const maxWordCount = data.topWords[0]?.count ?? 1

  return (
    <div className="min-h-screen bg-suara-bg p-4 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-suara-blue">Suara Dashboard</h1>
          <a href="/" className="px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm">
            Kembali ke Suara
          </a>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-suara-blue-light text-center">
            <p className="text-3xl font-bold text-suara-blue">{data.totalTaps}</p>
            <p className="text-xs text-suara-blue/60 font-bold">Total ketukan (30 hari)</p>
          </div>
          <div className="p-4 rounded-xl bg-suara-green-light text-center">
            <p className="text-3xl font-bold text-suara-green">{data.totalWords}</p>
            <p className="text-xs text-suara-green/60 font-bold">Kosakata aktif</p>
          </div>
          <div className="p-4 rounded-xl bg-fk-pronoun-light text-center">
            <p className="text-3xl font-bold text-fk-pronoun">{data.milestones.length}</p>
            <p className="text-xs text-fk-pronoun/60 font-bold">Pencapaian</p>
          </div>
        </div>

        {/* Taps per day chart */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-suara-gray-border">
          <h2 className="text-sm font-bold text-suara-gray mb-3">Ketukan per Hari (30 hari terakhir)</h2>
          {data.tapsPerDay.length === 0 ? (
            <p className="text-sm text-suara-gray/50 py-4 text-center">Belum ada data</p>
          ) : (
            <div className="flex items-end gap-1 h-32">
              {data.tapsPerDay.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-suara-blue-bar rounded-t"
                    style={{ height: `${(day.count / maxTapDay) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-[8px] text-suara-gray/40 rotate-[-45deg] origin-top-left">
                    {day.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top words */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-suara-gray-border">
          <h2 className="text-sm font-bold text-suara-gray mb-3">Kata Paling Sering</h2>
          {data.topWords.length === 0 ? (
            <p className="text-sm text-suara-gray/50 py-4 text-center">Belum ada data</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {data.topWords.map((word, i) => (
                <div key={word.label} className="flex items-center gap-2">
                  <span className="w-5 text-right text-xs font-bold text-suara-gray/40">{i + 1}</span>
                  <span className="w-24 text-sm font-bold text-suara-gray truncate">{word.label}</span>
                  <div className="flex-1 h-4 bg-suara-gray-light rounded-full overflow-hidden">
                    <div className="h-full bg-suara-blue-bar rounded-full" style={{ width: `${(word.count / maxWordCount) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs text-suara-gray/60">{word.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Milestones timeline */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-suara-gray-border">
          <h2 className="text-sm font-bold text-suara-gray mb-3">Pencapaian Komunikasi</h2>
          {data.milestones.length === 0 ? (
            <p className="text-sm text-suara-gray/50 py-4 text-center">Belum ada pencapaian</p>
          ) : (
            <div className="flex flex-col gap-2">
              {data.milestones.map((m) => (
                <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg bg-suara-green-light">
                  <span className="text-lg">&#127942;</span>
                  <div>
                    <p className="text-sm font-bold text-suara-green">{m.description}</p>
                    <p className="text-xs text-suara-green/60">
                      {new Date(m.detectedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Folder usage */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-suara-gray-border">
          <h2 className="text-sm font-bold text-suara-gray mb-3">Penggunaan Folder</h2>
          {data.folderUsage.length === 0 ? (
            <p className="text-sm text-suara-gray/50 py-4 text-center">Belum ada data</p>
          ) : (
            <div className="flex flex-col gap-2">
              {data.folderUsage.map((f) => (
                <div key={f.folder} className="flex items-center justify-between p-2">
                  <span className="text-sm font-bold text-suara-gray capitalize">{f.folder}</span>
                  <span className="text-sm text-suara-gray/60">{f.count} ketukan</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sync info */}
        {data.lastSyncAt && (
          <p className="text-xs text-suara-gray/40 text-center mb-4">
            Terakhir sinkronisasi: {new Date(data.lastSyncAt).toLocaleString('id-ID')}
          </p>
        )}
      </div>
    </div>
  )
}
