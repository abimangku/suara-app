import type { CoreWord, Folder, Person, QuickPhrase } from '@/types'

export const CORE_WORDS: CoreWord[] = [
  // Row 1
  { id: 'mau',      label: 'mau',      emoji: '✋', row: 1, position: 0 },
  { id: 'berhenti', label: 'berhenti', emoji: '🛑', row: 1, position: 1 },
  { id: 'bantu',    label: 'bantu',    emoji: '🆘', row: 1, position: 2 },
  { id: 'ya',       label: 'ya',       emoji: '✅', row: 1, position: 3 },
  { id: 'tidak',    label: 'tidak',    emoji: '🚫', row: 1, position: 4 },
  // Row 2
  { id: 'lagi',     label: 'lagi',     emoji: '➕', row: 2, position: 0 },
  { id: 'pergi',    label: 'pergi',    emoji: '🚶', row: 2, position: 1 },
  { id: 'suka',     label: 'suka',     emoji: '❤️', row: 2, position: 2 },
  { id: 'aku',      label: 'aku',      emoji: '👈', row: 2, position: 3 },
  { id: 'kamu',     label: 'kamu',     emoji: '👉', row: 2, position: 4 },
]

export const FOLDERS: Folder[] = [
  {
    id: 'folder_makanan', key: 'makanan', label: 'Makanan', emoji: '🍽️', sortOrder: 0,
    words: [
      { id: 'nasi_goreng',  label: 'nasi goreng',  emoji: '🍚', folderId: 'makanan', sortOrder: 0 },
      { id: 'mie_ayam',     label: 'mie ayam',     emoji: '🍜', folderId: 'makanan', sortOrder: 1 },
      { id: 'susu',         label: 'susu',         emoji: '🥛', folderId: 'makanan', sortOrder: 2 },
      { id: 'snack',        label: 'snack',        emoji: '🍪', folderId: 'makanan', sortOrder: 3 },
      { id: 'minum',        label: 'minum',        emoji: '💧', folderId: 'makanan', sortOrder: 4 },
      { id: 'nasi_putih',   label: 'nasi putih',   emoji: '🍚', folderId: 'makanan', sortOrder: 5 },
      { id: 'telur',        label: 'telur',        emoji: '🥚', folderId: 'makanan', sortOrder: 6 },
      { id: 'roti',         label: 'roti',         emoji: '🍞', folderId: 'makanan', sortOrder: 7 },
      { id: 'buah',         label: 'buah',         emoji: '🍎', folderId: 'makanan', sortOrder: 8 },
      { id: 'air_putih',    label: 'air putih',    emoji: '💧', folderId: 'makanan', sortOrder: 9 },
    ],
  },
  {
    id: 'folder_perasaan', key: 'perasaan', label: 'Perasaan', emoji: '😊', sortOrder: 1,
    words: [
      { id: 'senang',     label: 'senang',  emoji: '😊', folderId: 'perasaan', sortOrder: 0 },
      { id: 'sedih',      label: 'sedih',   emoji: '😢', folderId: 'perasaan', sortOrder: 1 },
      { id: 'marah',      label: 'marah',   emoji: '😡', folderId: 'perasaan', sortOrder: 2 },
      { id: 'takut',      label: 'takut',   emoji: '😰', folderId: 'perasaan', sortOrder: 3 },
      { id: 'lelah',      label: 'lelah',   emoji: '😴', folderId: 'perasaan', sortOrder: 4 },
      { id: 'bosan',      label: 'bosan',   emoji: '😑', folderId: 'perasaan', sortOrder: 5 },
      { id: 'sakit_rasa', label: 'sakit',   emoji: '🤕', folderId: 'perasaan', sortOrder: 6 },
      { id: 'nyaman',     label: 'nyaman',  emoji: '😌', folderId: 'perasaan', sortOrder: 7 },
      { id: 'cemas',      label: 'cemas',   emoji: '😟', folderId: 'perasaan', sortOrder: 8 },
      { id: 'kaget',      label: 'kaget',   emoji: '😲', folderId: 'perasaan', sortOrder: 9 },
    ],
  },
  {
    id: 'folder_aktivitas', key: 'aktivitas', label: 'Aktivitas', emoji: '🎮', sortOrder: 2,
    words: [
      { id: 'nonton',      label: 'nonton',      emoji: '📺', folderId: 'aktivitas', sortOrder: 0 },
      { id: 'musik',       label: 'musik',       emoji: '🎵', folderId: 'aktivitas', sortOrder: 1 },
      { id: 'mandi',       label: 'mandi',       emoji: '🚿', folderId: 'aktivitas', sortOrder: 2 },
      { id: 'tidur',       label: 'tidur',       emoji: '😴', folderId: 'aktivitas', sortOrder: 3 },
      { id: 'main',        label: 'main',        emoji: '🎮', folderId: 'aktivitas', sortOrder: 4 },
      { id: 'jalan_jalan', label: 'jalan-jalan', emoji: '🚶', folderId: 'aktivitas', sortOrder: 5 },
      { id: 'baca',        label: 'baca',        emoji: '📖', folderId: 'aktivitas', sortOrder: 6 },
      { id: 'gambar',      label: 'gambar',      emoji: '🎨', folderId: 'aktivitas', sortOrder: 7 },
      { id: 'masak',       label: 'masak',       emoji: '👩‍🍳', folderId: 'aktivitas', sortOrder: 8 },
      { id: 'belajar',     label: 'belajar',     emoji: '📚', folderId: 'aktivitas', sortOrder: 9 },
    ],
  },
  {
    id: 'folder_tempat', key: 'tempat', label: 'Tempat', emoji: '📍', sortOrder: 3,
    words: [
      { id: 'rumah',       label: 'rumah',       emoji: '🏠', folderId: 'tempat', sortOrder: 0 },
      { id: 'kamar_tidur', label: 'kamar tidur', emoji: '🛏️', folderId: 'tempat', sortOrder: 1 },
      { id: 'kamar_mandi', label: 'kamar mandi', emoji: '🚿', folderId: 'tempat', sortOrder: 2 },
      { id: 'dapur',       label: 'dapur',       emoji: '🍳', folderId: 'tempat', sortOrder: 3 },
      { id: 'ruang_tamu',  label: 'ruang tamu',  emoji: '🛋️', folderId: 'tempat', sortOrder: 4 },
      { id: 'toko',        label: 'toko',        emoji: '🏪', folderId: 'tempat', sortOrder: 5 },
      { id: 'sekolah',     label: 'sekolah',     emoji: '🏫', folderId: 'tempat', sortOrder: 6 },
      { id: 'masjid',      label: 'masjid',      emoji: '🕌', folderId: 'tempat', sortOrder: 7 },
      { id: 'mobil',       label: 'mobil',       emoji: '🚗', folderId: 'tempat', sortOrder: 8 },
      { id: 'taman',       label: 'taman',       emoji: '🌳', folderId: 'tempat', sortOrder: 9 },
    ],
  },
  {
    id: 'folder_tubuh', key: 'tubuh', label: 'Tubuh', emoji: '💪', sortOrder: 4,
    words: [
      { id: 'lapar',        label: 'lapar',        emoji: '🍽️', folderId: 'tubuh', sortOrder: 0 },
      { id: 'haus',         label: 'haus',         emoji: '💧', folderId: 'tubuh', sortOrder: 1 },
      { id: 'sakit_kepala', label: 'sakit kepala', emoji: '🤕', folderId: 'tubuh', sortOrder: 2 },
      { id: 'mual',         label: 'mual',         emoji: '🤢', folderId: 'tubuh', sortOrder: 3 },
      { id: 'pusing',       label: 'pusing',       emoji: '😵', folderId: 'tubuh', sortOrder: 4 },
      { id: 'ngantuk',      label: 'ngantuk',      emoji: '😴', folderId: 'tubuh', sortOrder: 5 },
      { id: 'panas',        label: 'panas',        emoji: '🥵', folderId: 'tubuh', sortOrder: 6 },
      { id: 'dingin',       label: 'dingin',       emoji: '🥶', folderId: 'tubuh', sortOrder: 7 },
      { id: 'gatal',        label: 'gatal',        emoji: '🤚', folderId: 'tubuh', sortOrder: 8 },
      { id: 'capek',        label: 'capek',        emoji: '😩', folderId: 'tubuh', sortOrder: 9 },
    ],
  },
]

export const PEOPLE: Person[] = [
  { id: 'ayah',  name: 'Ayah',  initial: 'A', sortOrder: 0 },
  { id: 'ibu',   name: 'Ibu',   initial: 'K', sortOrder: 1 },
  { id: 'nenek', name: 'Nenek', initial: 'N', sortOrder: 2 },
  { id: 'mbak',  name: 'Mbak',  initial: 'M', sortOrder: 3 },
]

export const QUICK_PHRASES: QuickPhrase[] = [
  { id: 'qp_nonton_tv', phrase: 'mau nonton TV',  words: ['mau', 'nonton', 'TV'],       sortOrder: 0 },
  { id: 'qp_keluar',    phrase: 'mau keluar',      words: ['mau', 'keluar'],              sortOrder: 1 },
  { id: 'qp_tidur',     phrase: 'mau tidur',       words: ['mau', 'tidur'],               sortOrder: 2 },
  { id: 'qp_dirumah',   phrase: 'mau di rumah',    words: ['mau', 'di', 'rumah'],         sortOrder: 3 },
  { id: 'qp_tidak_mau', phrase: 'tidak mau',       words: ['tidak', 'mau'],               sortOrder: 4 },
  { id: 'qp_lapar',     phrase: 'aku lapar',       words: ['aku', 'lapar'],               sortOrder: 5 },
  { id: 'qp_mau_ibu',   phrase: 'mau Ibu',         words: ['mau', 'Ibu'],                 sortOrder: 6 },
]
