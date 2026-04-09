export interface VocabItem {
  id: string
  label: string
  arasaacKeyword: string
  category: 'core' | 'fringe'
  folder?: string
  sortOrder: number
  source: 'arasaac' | 'ai_gen' | 'family_photo'
}

export const VOCAB_LIST: VocabItem[] = [
  // Core words
  { id: 'mau',       label: 'mau',       arasaacKeyword: 'want',            category: 'core',   sortOrder: 0, source: 'arasaac' },
  { id: 'berhenti',  label: 'berhenti',  arasaacKeyword: 'stop',            category: 'core',   sortOrder: 1, source: 'arasaac' },
  { id: 'bantu',     label: 'bantu',     arasaacKeyword: 'help',            category: 'core',   sortOrder: 2, source: 'arasaac' },
  { id: 'ya',        label: 'ya',        arasaacKeyword: 'yes',             category: 'core',   sortOrder: 3, source: 'arasaac' },
  { id: 'tidak',     label: 'tidak',     arasaacKeyword: 'no',              category: 'core',   sortOrder: 4, source: 'arasaac' },
  { id: 'lagi',      label: 'lagi',      arasaacKeyword: 'more',            category: 'core',   sortOrder: 5, source: 'arasaac' },
  { id: 'pergi',     label: 'pergi',     arasaacKeyword: 'go',              category: 'core',   sortOrder: 6, source: 'arasaac' },
  { id: 'suka',      label: 'suka',      arasaacKeyword: 'like',            category: 'core',   sortOrder: 7, source: 'arasaac' },
  { id: 'aku',       label: 'aku',       arasaacKeyword: 'I',               category: 'core',   sortOrder: 8, source: 'arasaac' },
  { id: 'kamu',      label: 'kamu',      arasaacKeyword: 'you',             category: 'core',   sortOrder: 9, source: 'arasaac' },

  // Makanan
  { id: 'nasi_goreng',  label: 'nasi goreng',  arasaacKeyword: 'fried rice',  category: 'fringe', folder: 'makanan', sortOrder: 0, source: 'ai_gen' },
  { id: 'mie_ayam',     label: 'mie ayam',     arasaacKeyword: 'noodle soup', category: 'fringe', folder: 'makanan', sortOrder: 1, source: 'ai_gen' },
  { id: 'susu',         label: 'susu',         arasaacKeyword: 'milk',        category: 'fringe', folder: 'makanan', sortOrder: 2, source: 'arasaac' },
  { id: 'snack',        label: 'snack',        arasaacKeyword: 'snack',       category: 'fringe', folder: 'makanan', sortOrder: 3, source: 'arasaac' },
  { id: 'minum',        label: 'minum',        arasaacKeyword: 'drink',       category: 'fringe', folder: 'makanan', sortOrder: 4, source: 'arasaac' },
  { id: 'nasi_putih',   label: 'nasi putih',   arasaacKeyword: 'rice',        category: 'fringe', folder: 'makanan', sortOrder: 5, source: 'arasaac' },
  { id: 'telur',        label: 'telur',        arasaacKeyword: 'egg',         category: 'fringe', folder: 'makanan', sortOrder: 6, source: 'arasaac' },
  { id: 'roti',         label: 'roti',         arasaacKeyword: 'bread',       category: 'fringe', folder: 'makanan', sortOrder: 7, source: 'arasaac' },
  { id: 'buah',         label: 'buah',         arasaacKeyword: 'fruit',       category: 'fringe', folder: 'makanan', sortOrder: 8, source: 'arasaac' },
  { id: 'air_putih',    label: 'air putih',    arasaacKeyword: 'water',       category: 'fringe', folder: 'makanan', sortOrder: 9, source: 'arasaac' },

  // Perasaan
  { id: 'senang',     label: 'senang',  arasaacKeyword: 'happy',       category: 'fringe', folder: 'perasaan', sortOrder: 0, source: 'arasaac' },
  { id: 'sedih',      label: 'sedih',   arasaacKeyword: 'sad',         category: 'fringe', folder: 'perasaan', sortOrder: 1, source: 'arasaac' },
  { id: 'marah',      label: 'marah',   arasaacKeyword: 'angry',       category: 'fringe', folder: 'perasaan', sortOrder: 2, source: 'arasaac' },
  { id: 'takut',      label: 'takut',   arasaacKeyword: 'scared',      category: 'fringe', folder: 'perasaan', sortOrder: 3, source: 'arasaac' },
  { id: 'lelah',      label: 'lelah',   arasaacKeyword: 'tired',       category: 'fringe', folder: 'perasaan', sortOrder: 4, source: 'arasaac' },
  { id: 'bosan',      label: 'bosan',   arasaacKeyword: 'bored',       category: 'fringe', folder: 'perasaan', sortOrder: 5, source: 'arasaac' },
  { id: 'sakit_rasa', label: 'sakit',   arasaacKeyword: 'pain',        category: 'fringe', folder: 'perasaan', sortOrder: 6, source: 'arasaac' },
  { id: 'nyaman',     label: 'nyaman',  arasaacKeyword: 'comfortable', category: 'fringe', folder: 'perasaan', sortOrder: 7, source: 'arasaac' },
  { id: 'cemas',      label: 'cemas',   arasaacKeyword: 'worried',     category: 'fringe', folder: 'perasaan', sortOrder: 8, source: 'arasaac' },
  { id: 'kaget',      label: 'kaget',   arasaacKeyword: 'surprised',   category: 'fringe', folder: 'perasaan', sortOrder: 9, source: 'arasaac' },

  // Aktivitas
  { id: 'nonton',      label: 'nonton',      arasaacKeyword: 'watch television', category: 'fringe', folder: 'aktivitas', sortOrder: 0, source: 'arasaac' },
  { id: 'musik',       label: 'musik',       arasaacKeyword: 'music',            category: 'fringe', folder: 'aktivitas', sortOrder: 1, source: 'arasaac' },
  { id: 'mandi',       label: 'mandi',       arasaacKeyword: 'shower',           category: 'fringe', folder: 'aktivitas', sortOrder: 2, source: 'arasaac' },
  { id: 'tidur',       label: 'tidur',       arasaacKeyword: 'sleep',            category: 'fringe', folder: 'aktivitas', sortOrder: 3, source: 'arasaac' },
  { id: 'main',        label: 'main',        arasaacKeyword: 'play',             category: 'fringe', folder: 'aktivitas', sortOrder: 4, source: 'arasaac' },
  { id: 'jalan_jalan', label: 'jalan-jalan', arasaacKeyword: 'walk outside',     category: 'fringe', folder: 'aktivitas', sortOrder: 5, source: 'ai_gen' },
  { id: 'baca',        label: 'baca',        arasaacKeyword: 'read',             category: 'fringe', folder: 'aktivitas', sortOrder: 6, source: 'arasaac' },
  { id: 'gambar',      label: 'gambar',      arasaacKeyword: 'draw',             category: 'fringe', folder: 'aktivitas', sortOrder: 7, source: 'arasaac' },
  { id: 'masak',       label: 'masak',       arasaacKeyword: 'cook',             category: 'fringe', folder: 'aktivitas', sortOrder: 8, source: 'arasaac' },
  { id: 'belajar',     label: 'belajar',     arasaacKeyword: 'study',            category: 'fringe', folder: 'aktivitas', sortOrder: 9, source: 'arasaac' },

  // Tempat
  { id: 'rumah',       label: 'rumah',       arasaacKeyword: 'home',        category: 'fringe', folder: 'tempat', sortOrder: 0, source: 'arasaac' },
  { id: 'kamar_tidur', label: 'kamar tidur', arasaacKeyword: 'bedroom',     category: 'fringe', folder: 'tempat', sortOrder: 1, source: 'arasaac' },
  { id: 'kamar_mandi', label: 'kamar mandi', arasaacKeyword: 'bathroom',    category: 'fringe', folder: 'tempat', sortOrder: 2, source: 'ai_gen' },
  { id: 'dapur',       label: 'dapur',       arasaacKeyword: 'kitchen',     category: 'fringe', folder: 'tempat', sortOrder: 3, source: 'arasaac' },
  { id: 'ruang_tamu',  label: 'ruang tamu',  arasaacKeyword: 'living room', category: 'fringe', folder: 'tempat', sortOrder: 4, source: 'arasaac' },
  { id: 'toko',        label: 'toko',        arasaacKeyword: 'store',       category: 'fringe', folder: 'tempat', sortOrder: 5, source: 'arasaac' },
  { id: 'sekolah',     label: 'sekolah',     arasaacKeyword: 'school',      category: 'fringe', folder: 'tempat', sortOrder: 6, source: 'arasaac' },
  { id: 'masjid',      label: 'masjid',      arasaacKeyword: 'mosque',      category: 'fringe', folder: 'tempat', sortOrder: 7, source: 'ai_gen' },
  { id: 'mobil',       label: 'mobil',       arasaacKeyword: 'car',         category: 'fringe', folder: 'tempat', sortOrder: 8, source: 'arasaac' },
  { id: 'taman',       label: 'taman',       arasaacKeyword: 'park',        category: 'fringe', folder: 'tempat', sortOrder: 9, source: 'arasaac' },

  // Tubuh
  { id: 'lapar',        label: 'lapar',        arasaacKeyword: 'hungry',    category: 'fringe', folder: 'tubuh', sortOrder: 0, source: 'arasaac' },
  { id: 'haus',         label: 'haus',         arasaacKeyword: 'thirsty',   category: 'fringe', folder: 'tubuh', sortOrder: 1, source: 'arasaac' },
  { id: 'sakit_kepala', label: 'sakit kepala', arasaacKeyword: 'headache',  category: 'fringe', folder: 'tubuh', sortOrder: 2, source: 'arasaac' },
  { id: 'mual',         label: 'mual',         arasaacKeyword: 'nauseous',  category: 'fringe', folder: 'tubuh', sortOrder: 3, source: 'arasaac' },
  { id: 'pusing',       label: 'pusing',       arasaacKeyword: 'dizzy',     category: 'fringe', folder: 'tubuh', sortOrder: 4, source: 'arasaac' },
  { id: 'ngantuk',      label: 'ngantuk',      arasaacKeyword: 'sleepy',    category: 'fringe', folder: 'tubuh', sortOrder: 5, source: 'arasaac' },
  { id: 'panas',        label: 'panas',        arasaacKeyword: 'hot',       category: 'fringe', folder: 'tubuh', sortOrder: 6, source: 'arasaac' },
  { id: 'dingin',       label: 'dingin',       arasaacKeyword: 'cold',      category: 'fringe', folder: 'tubuh', sortOrder: 7, source: 'arasaac' },
  { id: 'gatal',        label: 'gatal',        arasaacKeyword: 'itchy',     category: 'fringe', folder: 'tubuh', sortOrder: 8, source: 'arasaac' },
  { id: 'capek',        label: 'capek',        arasaacKeyword: 'exhausted', category: 'fringe', folder: 'tubuh', sortOrder: 9, source: 'arasaac' },
]
