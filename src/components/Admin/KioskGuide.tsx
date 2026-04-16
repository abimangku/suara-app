interface KioskGuideProps {
  onDone: () => void
}

const KIOSK_STEPS = [
  {
    title: '1. Install Suara sebagai PWA (BUKAN pintasan Chrome)',
    content: 'PENTING — ada dua opsi di Chrome yang terlihat mirip tapi berbeda: "Install aplikasi" (yang kita inginkan, tampil layar penuh tanpa Chrome) dan "Tambahkan ke layar utama" (pintasan Chrome biasa dengan URL bar yang masih terlihat). Buka https://suara-tau.vercel.app di Chrome, tunggu 5 detik agar halaman termuat penuh, lalu ketuk menu (⋮) → cari "Install aplikasi" atau "Install Suara" (bukan "Tambahkan ke layar utama"). Jika hanya muncul "Tambahkan ke layar utama" tanpa opsi Install, muat ulang halaman, tunggu 10 detik, coba lagi.',
  },
  {
    title: '2. Verifikasi install berhasil',
    content: 'Buka Suara dari laci aplikasi (bukan dari Chrome). Jika benar terinstall sebagai PWA: tidak ada URL bar Chrome di atas, layar penuh, muncul sebagai "Suara" di Pengaturan Android → Apps, dan di daftar aplikasi terbaru muncul dengan ikon sendiri (bukan ikon Chrome). Jika masih terlihat URL Chrome, hapus pintasan lama dari layar utama (tekan lama → Hapus) dan ulangi langkah 1.',
  },
  {
    title: '3. Aktifkan Screen Pinning (Sematkan Jendela)',
    content: 'Buka Pengaturan → Biometrik dan keamanan → Pengaturan keamanan lain → Sematkan jendela (Pin windows) → Aktifkan. Juga aktifkan "Minta pola pembuka sebelum melepas sematan" agar anak tidak bisa keluar tanpa izin.',
  },
  {
    title: '4. Pin Suara',
    content: 'Buka Suara dari laci aplikasi. Ketuk tombol Ikhtisar (kotak di kanan bawah, atau geser atas dan tahan). Di atas pratinjau Suara, ketuk ikon Suara → pilih "Sematkan aplikasi ini". Tablet sekarang terkunci pada Suara.',
  },
  {
    title: '5. Untuk membuka kunci pin',
    content: 'Tekan dan tahan tombol Kembali dan Ikhtisar secara bersamaan selama 2 detik, masukkan pola pembuka. Ini akan membuka kunci tablet dari mode pin.',
  },
  {
    title: '6. Biarkan layar tetap menyala',
    content: 'Pengaturan → Tampilan → Batas waktu layar → 10 menit (atau pilih "Tidak pernah" jika tablet ini khusus untuk Suara). Ini mencegah tablet tidur saat dia sedang berpikir.',
  },
  {
    title: '7. Kunci orientasi landscape',
    content: 'Pengaturan → Tampilan → Rotasi otomatis → Nonaktifkan. Putar tablet ke landscape. Suara dirancang khusus untuk landscape.',
  },
  {
    title: '8. Cegah gangguan',
    content: 'Pengaturan → Notifikasi → Nonaktifkan untuk semua aplikasi kecuali Suara. Atau aktifkan mode Jangan Ganggu (Do Not Disturb) saat dia menggunakan Suara.',
  },
  {
    title: '9. Jangan biarkan Suara tidur di background',
    content: 'Pengaturan → Aplikasi → Suara → Baterai → "Tidak dibatasi" (atau "Tanpa pembatasan"). Ini memastikan Suara siap digunakan saat dia membukanya.',
  },
  {
    title: '10. Atur volume media',
    content: 'Gunakan tombol volume fisik tablet untuk mengatur volume media (saat Suara terbuka). Pastikan tidak dalam mode senyap. Suara butuh speaker untuk bicara.',
  },
]

export default function KioskGuide({ onDone: _onDone }: KioskGuideProps) {
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
