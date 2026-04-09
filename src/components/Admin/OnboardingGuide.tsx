import { db } from '@/lib/db'

interface OnboardingGuideProps {
  onDone: () => void
}

const GUIDE_SECTIONS = [
  {
    title: 'Apa itu Suara?',
    content:
      'Suara adalah aplikasi komunikasi untuk membantu anak Anda mengekspresikan keinginan dan perasaannya. Dengan mengetuk tombol simbol, dia bisa membangun kalimat yang diucapkan oleh perangkat. Ini adalah suaranya.',
  },
  {
    title: 'Cara menggunakan',
    content:
      'Ketuk tombol kata untuk menambahkannya ke bilah kalimat di atas. Ketuk folder (Makanan, Perasaan, dll) untuk melihat lebih banyak kata. Ketuk "Bicara" untuk mengucapkan kalimat. Ketuk \u26A1 untuk frasa cepat yang sering digunakan.',
  },
  {
    title: 'Cara menambah kata baru',
    content:
      'Buka pengaturan admin (tekan lama bilah kalimat selama 3 detik). Pilih "Kelola Kata" \u2192 "Tambah Kata Baru". Ambil foto, masukkan nama kata, pilih kategori, dan simpan. Kata baru langsung muncul di grid.',
  },
  {
    title: 'Cara menambah orang',
    content:
      'Di pengaturan admin, pilih "Kelola Orang". Ambil foto wajah keluarga dan masukkan nama mereka. Foto akan muncul di baris ketiga grid komunikasi.',
  },
  {
    title: 'Tips modeling yang benar',
    content:
      'Modeling adalah cara terbaik mengajarkan penggunaan Suara. Saat Anda berbicara, ketuk tombol yang sesuai di tablet. Tunjukkan, jangan minta dia meniru. Contoh: saat berkata "mau makan?", ketuk "mau" lalu buka folder Makanan. Lakukan ini secara alami, bukan sebagai latihan.',
  },
  {
    title: 'Yang tidak boleh dilakukan',
    content:
      'Jangan paksa dia menggunakan tablet. Jangan tes atau kuis dia. Jangan koreksi di depan orang lain. Jangan ambil tablet saat dia sedang menggunakannya. Biarkan dia mengeksplorasi dengan kecepatan sendiri. Setiap ketukan adalah komunikasi yang valid.',
  },
  {
    title: 'Yang bisa diharapkan di minggu 1-4',
    content:
      'Minggu 1-2: Dia akan menjelajahi tombol, mungkin mengetuk acak. Ini normal \u2014 dia sedang belajar tata letak. Minggu 3-4: Dia mulai mengetuk dengan tujuan. Mungkin satu kata dulu seperti "mau" atau nama makanan. Setiap upaya harus ditanggapi segera. Kesabaran adalah kunci.',
  },
]

export default function OnboardingGuide({ onDone }: OnboardingGuideProps) {
  async function handleComplete() {
    await db.settings.put({ key: 'onboardingCompleted', value: true, updatedAt: Date.now() })
    onDone()
  }

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-4">Panduan Keluarga</h3>

      <div className="flex flex-col gap-3 mb-6">
        {GUIDE_SECTIONS.map((section) => (
          <div key={section.title} className="p-4 rounded-xl bg-suara-gray-light">
            <h4 className="font-bold text-suara-gray text-sm mb-2">{section.title}</h4>
            <p className="text-suara-gray/70 text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleComplete}
        className="w-full py-3 rounded-xl bg-suara-blue-bar text-white font-bold text-sm active:scale-[0.98] transition-transform duration-[80ms]"
        type="button"
      >
        Saya sudah mengerti
      </button>
    </div>
  )
}
