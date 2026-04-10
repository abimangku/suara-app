interface KioskGuideProps {
  onDone: () => void
}

const KIOSK_STEPS = [
  {
    title: '1. Pasang Suara di layar utama',
    content: 'Buka Suara di Chrome → ketuk menu (⋮) → "Tambahkan ke layar utama" → "Tambah". Ikon Suara akan muncul di layar utama seperti aplikasi biasa.',
  },
  {
    title: '2. Aktifkan Screen Pinning',
    content: 'Buka Pengaturan → Keamanan → Penyematan layar (Screen pinning) → Aktifkan. Ini akan mengunci tablet pada satu aplikasi saja.',
  },
  {
    title: '3. Pin Suara',
    content: 'Buka Suara dari layar utama → buka daftar aplikasi terbaru (tombol persegi) → ketuk ikon Suara → pilih "Sematkan" (Pin). Sekarang tablet terkunci pada Suara.',
  },
  {
    title: '4. Untuk membuka kunci',
    content: 'Tekan dan tahan tombol Kembali dan Ikhtisar (Overview) secara bersamaan selama beberapa detik. Ini akan membuka kunci tablet dari mode pin.',
  },
  {
    title: '5. Kunci orientasi landscape',
    content: 'Buka Pengaturan → Tampilan → Rotasi otomatis → Nonaktifkan. Putar tablet ke landscape. Suara dirancang khusus untuk landscape.',
  },
  {
    title: '6. Matikan notifikasi',
    content: 'Buka Pengaturan → Notifikasi → Nonaktifkan notifikasi untuk semua aplikasi kecuali Suara. Ini mencegah gangguan saat dia berkomunikasi.',
  },
  {
    title: '7. Atur volume',
    content: 'Atur volume media ke tingkat yang nyaman. Pastikan mode senyap tidak aktif. Suara perlu speaker untuk berbicara.',
  },
]

export default function KioskGuide({ onDone }: KioskGuideProps) {
  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-bold text-suara-gray mb-2">Mode Kiosk (Tablet Khusus)</h3>
      <p className="text-sm text-suara-gray/60 mb-4">
        Ikuti langkah-langkah ini untuk mengubah tablet menjadi perangkat komunikasi khusus.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {KIOSK_STEPS.map((step) => (
          <div key={step.title} className="p-4 rounded-xl bg-suara-gray-light">
            <h4 className="font-bold text-suara-gray text-sm mb-1">{step.title}</h4>
            <p className="text-suara-gray/70 text-sm leading-relaxed">{step.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
