interface VoiceCloneGuideProps {
  onDone: () => void
}

const VOICE_SECTIONS = [
  {
    title: 'Apa itu kloning suara?',
    content: 'Kloning suara memungkinkan tablet berbicara dengan suara anggota keluarga — bukan suara robot. Dengan merekam 30 detik suara Ayah atau Ibu, kita bisa membuat semua kata di Suara terdengar seperti orang yang dia cintai.',
  },
  {
    title: 'Mengapa ini penting?',
    content: 'Penelitian AAC menunjukkan bahwa anak lebih responsif terhadap suara yang mereka kenal. Suara keluarga meningkatkan kenyamanan dan keinginan untuk menggunakan perangkat.',
  },
  {
    title: 'Status saat ini',
    content: 'Suara saat ini menggunakan suara bawaan peramban (Google Text-to-Speech). Fitur kloning suara menggunakan XTTS-v2 sedang dalam pengembangan dan akan tersedia dalam pembaruan mendatang.',
  },
  {
    title: 'Cara merekam (untuk masa depan)',
    content: '1. Pilih anggota keluarga (Ayah atau Ibu)\n2. Rekam 30 detik ucapan jernih dalam Bahasa Indonesia\n3. Gunakan ruangan tenang tanpa gema\n4. Bicara dengan nada normal, jangan terlalu pelan atau keras\n5. Hindari suara latar (TV, kipas angin, dll)',
  },
  {
    title: 'Tentang XTTS-v2',
    content: 'XTTS-v2 adalah teknologi kloning suara sumber terbuka yang bisa membuat suara sintetis dari rekaman pendek. Gratis digunakan untuk keperluan pribadi. Tersedia di GitHub: github.com/coqui-ai/TTS',
  },
]

export default function VoiceCloneGuide({ onDone: _onDone }: VoiceCloneGuideProps) {
  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-2">Kloning Suara Keluarga</h3>
      <p className="text-sm text-suara-gray/60 mb-4">
        Buat tablet berbicara dengan suara orang yang dia cintai.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {VOICE_SECTIONS.map((section) => (
          <div key={section.title} className="p-4 rounded-xl bg-suara-gray-light">
            <h4 className="font-bold text-suara-gray text-sm mb-1">{section.title}</h4>
            <p className="text-suara-gray/70 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-suara-amber-light">
        <p className="text-sm font-bold text-suara-amber">
          ⏳ Fitur ini sedang dalam pengembangan. Saat ini Suara menggunakan suara bawaan peramban.
        </p>
      </div>
    </div>
  )
}
