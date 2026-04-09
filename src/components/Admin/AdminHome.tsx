import { useState } from 'react'

type AdminSection = 'home' | 'manageWords' | 'managePeople' | 'quickPhrases' | 'vocabPacks' | 'insights' | 'onboarding'

const ADMIN_CARDS = [
  { id: 'manageWords' as const, emoji: '📝', label: 'Kelola Kata', desc: 'Tambah, edit, hapus kosakata' },
  { id: 'managePeople' as const, emoji: '👥', label: 'Kelola Orang', desc: 'Tambah foto dan nama keluarga' },
  { id: 'quickPhrases' as const, emoji: '⚡', label: 'Frasa Cepat', desc: 'Atur frasa yang sering digunakan' },
  { id: 'vocabPacks' as const, emoji: '📦', label: 'Paket Kosakata', desc: 'Aktifkan atau nonaktifkan paket kata' },
  { id: 'insights' as const, emoji: '📊', label: 'Wawasan Penggunaan', desc: 'Lihat kata yang paling sering digunakan' },
  { id: 'onboarding' as const, emoji: '📖', label: 'Panduan Keluarga', desc: 'Cara menggunakan Suara' },
]

export default function AdminHome() {
  const [activeSection, setActiveSection] = useState<AdminSection>('home')

  if (activeSection !== 'home') {
    return (
      <div className="p-4">
        <button
          onClick={() => setActiveSection('home')}
          className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-95 transition-transform duration-[80ms]"
          type="button"
        >
          ← Kembali
        </button>
        <div className="text-center text-suara-gray py-12">
          <p className="text-lg font-bold mb-2">{ADMIN_CARDS.find(c => c.id === activeSection)?.label}</p>
          <p className="text-sm">Segera hadir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
        {ADMIN_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveSection(card.id)}
            className="flex flex-col items-center gap-2 p-5 rounded-xl bg-suara-gray-light border-2 border-suara-gray-border text-left active:scale-[0.98] transition-transform duration-[80ms]"
            type="button"
          >
            <span className="text-3xl">{card.emoji}</span>
            <span className="text-suara-gray font-bold text-[15px]">{card.label}</span>
            <span className="text-suara-gray/60 text-xs text-center">{card.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
