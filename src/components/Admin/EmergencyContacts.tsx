import { useEffect, useState } from 'react'
import { db } from '@/lib/db'

interface EmergencyContact {
  name: string
  phone: string
}

interface EmergencyContactsState {
  ibu: EmergencyContact
  ayah: EmergencyContact
  ambulans: EmergencyContact
}

interface EmergencyContactsProps {
  onDone: () => void
}

const DEFAULT_STATE: EmergencyContactsState = {
  ibu: { name: 'Ibu', phone: '' },
  ayah: { name: 'Ayah', phone: '' },
  ambulans: { name: 'Ambulans', phone: '118' },
}

export default function EmergencyContacts({ onDone: _onDone }: EmergencyContactsProps) {
  const [contacts, setContacts] = useState<EmergencyContactsState>(DEFAULT_STATE)
  const [saved, setSaved] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    db.settings.get('emergencyContacts').then((setting) => {
      if (setting?.value) {
        const stored = setting.value as Partial<EmergencyContactsState>
        setContacts({
          ibu: { name: stored.ibu?.name || 'Ibu', phone: stored.ibu?.phone || '' },
          ayah: { name: stored.ayah?.name || 'Ayah', phone: stored.ayah?.phone || '' },
          ambulans: { name: stored.ambulans?.name || 'Ambulans', phone: stored.ambulans?.phone || '118' },
        })
      }
      setIsLoaded(true)
    })
  }, [])

  async function handleSave() {
    await db.settings.put({
      key: 'emergencyContacts',
      value: contacts,
      updatedAt: Date.now(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function updateContact(key: keyof EmergencyContactsState, field: 'name' | 'phone', value: string) {
    setContacts((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  if (!isLoaded) {
    return <div className="text-suara-gray text-sm">Memuat...</div>
  }

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-2">🆘 Kontak Darurat</h3>
      <p className="text-sm text-suara-gray/70 mb-4">
        Kontak ini akan menerima SMS saat tombol darurat ditekan. Tekan lama tombol "bantu" selama 1.5 detik untuk membuka layar darurat.
      </p>

      <div className="flex flex-col gap-4">
        {(['ibu', 'ayah', 'ambulans'] as const).map((key) => {
          const labels: Record<typeof key, { emoji: string; title: string }> = {
            ibu: { emoji: '👩', title: 'Ibu' },
            ayah: { emoji: '👨', title: 'Ayah' },
            ambulans: { emoji: '🚑', title: 'Ambulans' },
          }
          const info = labels[key]
          return (
            <div key={key} className="p-4 rounded-xl bg-suara-gray-light border-2 border-suara-gray-border">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{info.emoji}</span>
                <span className="font-bold text-suara-gray">{info.title}</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-suara-gray/70 font-bold">Nama</label>
                <input
                  type="text"
                  value={contacts[key].name}
                  onChange={(e) => updateContact(key, 'name', e.target.value)}
                  placeholder="Nama kontak"
                  className="px-3 py-2 rounded-lg border-2 border-suara-gray-border bg-white text-suara-gray font-bold text-sm focus:outline-none focus:border-suara-blue-border"
                />
                <label className="text-xs text-suara-gray/70 font-bold mt-1">Nomor Telepon</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={contacts[key].phone}
                  onChange={(e) => updateContact(key, 'phone', e.target.value)}
                  placeholder="+628xxxxxxxxxx"
                  className="px-3 py-2 rounded-lg border-2 border-suara-gray-border bg-white text-suara-gray font-bold text-sm focus:outline-none focus:border-suara-blue-border"
                />
                {/* Test button — opens the real SMS/tel composer so caregiver
                    can verify the number works BEFORE a real emergency. */}
                {contacts[key].phone.trim() && (
                  <button
                    onClick={() => {
                      const phone = contacts[key].phone.trim()
                      if (key === 'ambulans') {
                        window.location.href = `tel:${phone}`
                      } else {
                        const msg = encodeURIComponent('Uji coba dari Suara AAC — abaikan.')
                        window.location.href = `sms:${phone}?body=${msg}`
                      }
                    }}
                    type="button"
                    className="mt-2 px-3 py-1.5 rounded-lg bg-suara-green-light text-suara-green font-bold text-xs self-start active:scale-[0.96] transition-transform"
                    aria-label={`Uji kontak ${info.title}`}
                  >
                    🧪 Uji {key === 'ambulans' ? 'panggilan' : 'SMS'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms]"
          type="button"
        >
          Simpan
        </button>
        {saved && <span className="text-suara-green font-bold text-sm">✓ Tersimpan</span>}
      </div>
    </div>
  )
}
