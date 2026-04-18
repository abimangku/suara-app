import { useState, useCallback } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import AdminHome from '@/components/Admin/AdminHome'

type AdminView = 'pin' | 'createPin' | 'home'

export default function AdminOverlay() {
  const { hasPin, verifyPin, setPin, closeAdmin, isLoading } = useAdmin()
  const [view, setView] = useState<AdminView | null>(null)
  const [pin, setPinInput] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState<'enter' | 'confirm'>('enter')

  // Determine view AFTER useLiveQuery resolves. Previously useState
  // initialized to 'createPin' before the async DB query returned the
  // PIN hash — so even when a PIN existed, the create screen showed.
  const activeView = view ?? (isLoading ? null : (hasPin ? 'pin' : 'createPin'))

  const handlePinSubmit = useCallback(async () => {
    if (pin.length < 4) {
      setError('Minimal 4 digit')
      return
    }
    const valid = await verifyPin(pin)
    if (valid) {
      setView('home')
      setPinInput('')
      setError('')
    } else {
      setError('PIN salah')
      setPinInput('')
    }
  }, [pin, verifyPin])

  const handleCreatePin = useCallback(async () => {
    if (step === 'enter') {
      if (pin.length < 4) {
        setError('Minimal 4 digit')
        return
      }
      setStep('confirm')
      setConfirmPin('')
      setError('')
      return
    }
    // confirm step
    if (confirmPin !== pin) {
      setError('PIN tidak cocok')
      setConfirmPin('')
      return
    }
    await setPin(pin)
    setView('home')
    setPinInput('')
    setConfirmPin('')
    setError('')
  }, [step, pin, confirmPin, setPin])

  const handleDigit = (digit: string) => {
    if (activeView === 'createPin' && step === 'confirm') {
      if (confirmPin.length < 6) setConfirmPin((p) => p + digit)
    } else {
      if (pin.length < 6) setPinInput((p) => p + digit)
    }
    setError('')
  }

  const handleBackspace = () => {
    if (activeView === 'createPin' && step === 'confirm') {
      setConfirmPin((p) => p.slice(0, -1))
    } else {
      setPinInput((p) => p.slice(0, -1))
    }
  }

    // Show loading while DB query is pending
  if (activeView === null) {
    return (
      <div className="fixed inset-0 z-[100] bg-suara-bg flex items-center justify-center">
        <p className="text-suara-gray font-bold">Memuat...</p>
      </div>
    )
  }

  if (activeView === 'home') {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-auto">
        <div className="flex items-center justify-between px-4 py-3 bg-suara-blue-bar text-white">
          <h1 className="text-lg font-bold">Pengaturan Suara</h1>
          <button
            onClick={closeAdmin}
            className="px-4 py-2 rounded-lg bg-white/20 text-white font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]"
            type="button"
          >
            ✕ Tutup
          </button>
        </div>
        <AdminHome />
      </div>
    )
  }

  // PIN entry or create PIN view
  const currentValue = activeView === 'createPin' && step === 'confirm' ? confirmPin : pin
  const title = activeView === 'createPin'
    ? step === 'enter' ? 'Buat PIN Baru' : 'Konfirmasi PIN'
    : 'Masukkan PIN'

  return (
    <div className="fixed inset-0 z-[100] bg-suara-bg flex flex-col items-center justify-center">
      <button
        onClick={closeAdmin}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-suara-gray-light text-suara-gray flex items-center justify-center font-bold text-lg"
        type="button"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold text-suara-gray mb-2">{title}</h2>
      {error && <p className="text-suara-danger text-sm font-bold mb-2">{error}</p>}

      {/* PIN dots */}
      <div className="flex gap-3 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full ${
              i < currentValue.length ? 'bg-suara-blue' : 'bg-suara-gray-border'
            }`}
          />
        ))}
      </div>

      {/* Numeric keypad */}
      <div className="grid grid-cols-3 gap-3 max-w-[280px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key) => {
          if (key === '') return <div key="empty" />
          if (key === '⌫') {
            return (
              <button
                key={key}
                onClick={handleBackspace}
                className="w-20 h-14 rounded-xl bg-suara-gray-light text-suara-gray font-bold text-xl flex items-center justify-center active:scale-[0.96] transition-transform duration-[80ms]"
                type="button"
              >
                ⌫
              </button>
            )
          }
          return (
            <button
              key={key}
              onClick={() => handleDigit(key)}
              className="w-20 h-14 rounded-xl bg-suara-blue-light text-suara-blue font-bold text-xl flex items-center justify-center active:scale-[0.96] transition-transform duration-[80ms]"
              type="button"
            >
              {key}
            </button>
          )
        })}
      </div>

      {/* Submit button */}
      <button
        onClick={activeView === 'createPin' ? handleCreatePin : handlePinSubmit}
        className="mt-6 px-8 py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-base active:scale-[0.96] transition-transform duration-[80ms]"
        type="button"
      >
        {activeView === 'createPin' && step === 'enter' ? 'Lanjut' : activeView === 'createPin' ? 'Simpan PIN' : 'Masuk'}
      </button>
    </div>
  )
}
