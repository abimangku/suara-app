import { useState } from 'react'
import ManagePeople from '@/components/Admin/ManagePeople'
import EditWord from '@/components/Admin/EditWord'
import AddPerson from '@/components/Admin/AddPerson'
import AddWord from '@/components/Admin/AddWord'
import QuickPhraseAdmin from '@/components/Admin/QuickPhraseAdmin'
import UsageInsights from '@/components/Admin/UsageInsights'
import OnboardingGuide from '@/components/Admin/OnboardingGuide'
import VocabSuggestions from '@/components/Admin/VocabSuggestions'
import BackupRestore from '@/components/Admin/BackupRestore'
import KioskGuide from '@/components/Admin/KioskGuide'
import VoiceCloneGuide from '@/components/Admin/VoiceCloneGuide'
import EmergencyContacts from '@/components/Admin/EmergencyContacts'

type AdminSection = 'home' | 'manageWords' | 'managePeople' | 'addPerson' | 'addWord' | 'quickPhrases' | 'insights' | 'onboarding' | 'vocabSuggestions' | 'backup' | 'kioskGuide' | 'voiceClone' | 'emergencyContacts' | 'dashboard'

const ADMIN_CARDS = [
  { id: 'manageWords' as const, emoji: '📝', label: 'Kelola Kata', desc: 'Tambah, edit, hapus kosakata' },
  { id: 'managePeople' as const, emoji: '👥', label: 'Kelola Orang', desc: 'Tambah foto dan nama keluarga' },
  { id: 'quickPhrases' as const, emoji: '⚡', label: 'Frasa Cepat', desc: 'Atur frasa yang sering digunakan' },
  { id: 'insights' as const, emoji: '📊', label: 'Wawasan Penggunaan', desc: 'Lihat kata yang paling sering digunakan' },
  { id: 'dashboard' as const, emoji: '📈', label: 'Dashboard Orang Tua', desc: 'Analitik dan milestone komunikasi' },
  { id: 'onboarding' as const, emoji: '📖', label: 'Panduan Keluarga', desc: 'Cara menggunakan Suara' },
  { id: 'vocabSuggestions' as const, emoji: '🤖', label: 'Saran Kosakata', desc: 'Dapatkan saran kata baru dari AI' },
  { id: 'backup' as const, emoji: '💾', label: 'Cadangan Data', desc: 'Cadangkan dan pulihkan kosakata' },
  { id: 'kioskGuide' as const, emoji: '📱', label: 'Mode Kiosk', desc: 'Panduan mengunci tablet untuk AAC' },
  { id: 'voiceClone' as const, emoji: '🎙️', label: 'Kloning Suara', desc: 'Buat tablet bicara dengan suara keluarga' },
  { id: 'emergencyContacts' as const, emoji: '🆘', label: 'Kontak Darurat', desc: 'Atur kontak SMS darurat (Ibu, Ayah, Ambulans)' },
]

export default function AdminHome() {
  const [activeSection, setActiveSection] = useState<AdminSection>('home')

  if (activeSection === 'manageWords') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <EditWord onDone={() => setActiveSection('home')} onAddWord={() => setActiveSection('addWord')} />
      </div>
    )
  }

  if (activeSection === 'addWord') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('manageWords')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <AddWord onDone={() => setActiveSection('manageWords')} />
      </div>
    )
  }

  if (activeSection === 'managePeople') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <ManagePeople onDone={() => setActiveSection('home')} onAddPerson={() => setActiveSection('addPerson')} />
      </div>
    )
  }

  if (activeSection === 'addPerson') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('managePeople')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <AddPerson onDone={() => setActiveSection('managePeople')} />
      </div>
    )
  }

  if (activeSection === 'quickPhrases') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <QuickPhraseAdmin onDone={() => setActiveSection('home')} />
      </div>
    )
  }

  if (activeSection === 'dashboard') {
    // Opens parent dashboard in a new tab — it's a standalone page.
    // Doing it as a nav change would lose admin state; opening in-tab is cleaner.
    const url = `${window.location.origin}${window.location.pathname}?dashboard=true`
    window.open(url, '_blank', 'noopener')
    setActiveSection('home')
    return null
  }

  if (activeSection === 'insights') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <UsageInsights onDone={() => setActiveSection('home')} />
      </div>
    )
  }

  if (activeSection === 'onboarding') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <OnboardingGuide onDone={() => setActiveSection('home')} />
      </div>
    )
  }

  if (activeSection === 'vocabSuggestions') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <VocabSuggestions onDone={() => setActiveSection('home')} />
      </div>
    )
  }

  if (activeSection === 'backup') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <BackupRestore onDone={() => setActiveSection('home')} />
      </div>
    )
  }

  if (activeSection === 'kioskGuide') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <KioskGuide onDone={() => setActiveSection('home')} />
      </div>
    )
  }

  if (activeSection === 'voiceClone') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <VoiceCloneGuide onDone={() => setActiveSection('home')} />
      </div>
    )
  }

  if (activeSection === 'emergencyContacts') {
    return (
      <div className="p-4">
        <button onClick={() => setActiveSection('home')} className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]" type="button">← Kembali</button>
        <EmergencyContacts onDone={() => setActiveSection('home')} />
      </div>
    )
  }

  if (activeSection !== 'home') {
    return (
      <div className="p-4">
        <button
          onClick={() => setActiveSection('home')}
          className="mb-4 px-4 py-2 rounded-lg bg-suara-gray-light text-suara-gray font-bold text-sm active:scale-[0.96] transition-transform duration-[80ms]"
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
