import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { db } from '@/lib/db'

interface EmergencyContact {
  name: string
  phone: string
}

interface EmergencyContacts {
  ibu?: EmergencyContact
  ayah?: EmergencyContact
  ambulans?: EmergencyContact
}

export default function EmergencyBoard() {
  const isEmergencyOpen = useAppStore((s) => s.isEmergencyOpen)
  const closeEmergency = useAppStore((s) => s.closeEmergency)
  const [contacts, setContacts] = useState<EmergencyContacts>({})

  useEffect(() => {
    if (!isEmergencyOpen) return
    db.settings.get('emergencyContacts').then((setting) => {
      if (setting?.value) {
        setContacts(setting.value as EmergencyContacts)
      }
    })
  }, [isEmergencyOpen])

  if (!isEmergencyOpen) return null

  function handleSms(contact: EmergencyContact | undefined, message: string) {
    if (!contact?.phone) {
      alert(`Kontak ${contact?.name ?? ''} belum diatur. Buka pengaturan admin untuk mengatur.`)
      return
    }
    const encoded = encodeURIComponent(message)
    window.location.href = `sms:${contact.phone}?body=${encoded}`
  }

  function handleCall(contact: EmergencyContact | undefined) {
    if (!contact?.phone) {
      alert(`Kontak ${contact?.name ?? ''} belum diatur. Buka pengaturan admin untuk mengatur.`)
      return
    }
    // Direct phone call — appropriate for medical emergency where speaking
    // (even via speaker/partner) beats SMS. For personal contacts we keep SMS
    // so the caregiver receives context text even if they can't answer live.
    window.location.href = `tel:${contact.phone}`
  }

  return (
    <div className="fixed inset-0 z-[95] bg-suara-danger/95 flex flex-col items-center justify-center p-6">
      <button
        onClick={closeEmergency}
        className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/20 text-white text-2xl font-bold active:scale-[0.96] transition-transform"
        aria-label="Tutup"
      >
        ✕
      </button>

      <h2 className="text-white text-3xl font-bold mb-8 text-center">
        🆘 Darurat
      </h2>

      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
        <button
          className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:scale-[0.96] transition-transform"
          onClick={() => handleSms(contacts.ibu, 'Saya sakit, tolong.')}
          aria-label="Aku sakit"
        >
          <span className="text-5xl">🤒</span>
          <span className="text-suara-danger font-bold text-xl">Aku sakit</span>
        </button>

        <button
          className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:scale-[0.96] transition-transform"
          onClick={() => handleSms(contacts.ibu, 'Tolong, saya butuh Ibu.')}
          aria-label="Panggil Ibu"
        >
          <span className="text-5xl">👩</span>
          <span className="text-suara-danger font-bold text-xl">Panggil Ibu</span>
        </button>

        <button
          className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:scale-[0.96] transition-transform"
          onClick={() => handleSms(contacts.ayah, 'Tolong, saya butuh Ayah.')}
          aria-label="Panggil Ayah"
        >
          <span className="text-5xl">👨</span>
          <span className="text-suara-danger font-bold text-xl">Panggil Ayah</span>
        </button>

        <button
          className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:scale-[0.96] transition-transform"
          onClick={() => handleCall(contacts.ambulans)}
          aria-label="Panggil ambulans"
        >
          <span className="text-5xl">🚑</span>
          <span className="text-suara-danger font-bold text-xl">Panggil Ambulans</span>
        </button>
      </div>

      <p className="text-white/70 text-sm mt-6 text-center">
        Aku sakit / Ibu / Ayah → SMS. Ambulans → panggilan telepon.
      </p>
    </div>
  )
}
