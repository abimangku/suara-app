import type { CoreWord, DbFolder, DbPerson, DbQuickPhrase, Folder, Person, QuickPhrase } from '@/types'

// Core words — rows 1-2, positions fixed forever
export const CORE_WORDS: CoreWord[] = [
  { id: 'mau',      label: 'mau',      emoji: '✋', symbolPath: 'core/mau.png',      audioPath: 'core/mau.mp3',      row: 1, position: 0 },
  { id: 'berhenti', label: 'berhenti', emoji: '🛑', symbolPath: 'core/berhenti.png', audioPath: 'core/berhenti.mp3', row: 1, position: 1 },
  { id: 'bantu',    label: 'bantu',    emoji: '🆘', symbolPath: 'core/bantu.png',    audioPath: 'core/bantu.mp3',    row: 1, position: 2 },
  { id: 'ya',       label: 'ya',       emoji: '✅', symbolPath: 'core/ya.png',       audioPath: 'core/ya.mp3',       row: 1, position: 3 },
  { id: 'tidak',    label: 'tidak',    emoji: '🚫', symbolPath: 'core/tidak.png',    audioPath: 'core/tidak.mp3',    row: 1, position: 4 },
  { id: 'lagi',     label: 'lagi',     emoji: '➕', symbolPath: 'core/lagi.png',     audioPath: 'core/lagi.mp3',     row: 2, position: 0 },
  { id: 'pergi',    label: 'pergi',    emoji: '🚶', symbolPath: 'core/pergi.png',    audioPath: 'core/pergi.mp3',    row: 2, position: 1 },
  { id: 'suka',     label: 'suka',     emoji: '❤️', symbolPath: 'core/suka.png',     audioPath: 'core/suka.mp3',     row: 2, position: 2 },
  { id: 'aku',      label: 'aku',      emoji: '👈', symbolPath: 'core/aku.png',      audioPath: 'core/aku.mp3',      row: 2, position: 3 },
  { id: 'kamu',     label: 'kamu',     emoji: '👉', symbolPath: 'core/kamu.png',     audioPath: 'core/kamu.mp3',     row: 2, position: 4 },
]

// Seed data for folders — used by src/lib/seed.ts
export const SEED_FOLDERS: Omit<DbFolder, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { key: 'makanan',   label: 'Makanan',   emoji: '🍽️', sortOrder: 0, isActive: true },
  { key: 'perasaan',  label: 'Perasaan',  emoji: '😊', sortOrder: 1, isActive: true },
  { key: 'aktivitas', label: 'Aktivitas', emoji: '🎮', sortOrder: 2, isActive: true },
  { key: 'tempat',    label: 'Tempat',    emoji: '📍', sortOrder: 3, isActive: true },
  { key: 'tubuh',     label: 'Tubuh',     emoji: '💪', sortOrder: 4, isActive: true },
]

// Seed data for people
export const SEED_PEOPLE: Omit<DbPerson, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Ayah',  initial: 'A', sortOrder: 0, isActive: true },
  { name: 'Ibu',   initial: 'K', sortOrder: 1, isActive: true },
  { name: 'Nenek', initial: 'N', sortOrder: 2, isActive: true },
  { name: 'Mbak',  initial: 'M', sortOrder: 3, isActive: true },
]

// Seed data for quick phrases — based on her real daily patterns
export const SEED_QUICK_PHRASES: Omit<DbQuickPhrase, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { phrase: 'mau nonton TV',  words: ['mau', 'nonton', 'TV'],   sortOrder: 0, isActive: true },
  { phrase: 'mau keluar',     words: ['mau', 'keluar'],          sortOrder: 1, isActive: true },
  { phrase: 'mau tidur',      words: ['mau', 'tidur'],           sortOrder: 2, isActive: true },
  { phrase: 'mau di rumah',   words: ['mau', 'di', 'rumah'],     sortOrder: 3, isActive: true },
  { phrase: 'tidak mau',      words: ['tidak', 'mau'],           sortOrder: 4, isActive: true },
  { phrase: 'aku lapar',      words: ['aku', 'lapar'],           sortOrder: 5, isActive: true },
  { phrase: 'mau Ibu',        words: ['mau', 'Ibu'],             sortOrder: 6, isActive: true },
]

// Seed data for fringe words — keyed by folder key
export const SEED_WORDS: Record<string, Array<{ id: string; label: string; emoji: string; sortOrder: number }>> = {
  makanan: [
    { id: 'nasi_goreng',  label: 'nasi goreng',  emoji: '🍚', sortOrder: 0 },
    { id: 'mie_ayam',     label: 'mie ayam',     emoji: '🍜', sortOrder: 1 },
    { id: 'susu',         label: 'susu',         emoji: '🥛', sortOrder: 2 },
    { id: 'snack',        label: 'snack',        emoji: '🍪', sortOrder: 3 },
    { id: 'minum',        label: 'minum',        emoji: '💧', sortOrder: 4 },
    { id: 'nasi_putih',   label: 'nasi putih',   emoji: '🍚', sortOrder: 5 },
    { id: 'telur',        label: 'telur',        emoji: '🥚', sortOrder: 6 },
    { id: 'roti',         label: 'roti',         emoji: '🍞', sortOrder: 7 },
    { id: 'buah',         label: 'buah',         emoji: '🍎', sortOrder: 8 },
    { id: 'air_putih',    label: 'air putih',    emoji: '💧', sortOrder: 9 },
  ],
  perasaan: [
    { id: 'senang',     label: 'senang',  emoji: '😊', sortOrder: 0 },
    { id: 'sedih',      label: 'sedih',   emoji: '😢', sortOrder: 1 },
    { id: 'marah',      label: 'marah',   emoji: '😡', sortOrder: 2 },
    { id: 'takut',      label: 'takut',   emoji: '😰', sortOrder: 3 },
    { id: 'lelah',      label: 'lelah',   emoji: '😴', sortOrder: 4 },
    { id: 'bosan',      label: 'bosan',   emoji: '😑', sortOrder: 5 },
    { id: 'sakit_rasa', label: 'sakit',   emoji: '🤕', sortOrder: 6 },
    { id: 'nyaman',     label: 'nyaman',  emoji: '😌', sortOrder: 7 },
    { id: 'cemas',      label: 'cemas',   emoji: '😟', sortOrder: 8 },
    { id: 'kaget',      label: 'kaget',   emoji: '😲', sortOrder: 9 },
  ],
  aktivitas: [
    { id: 'nonton',      label: 'nonton',      emoji: '📺', sortOrder: 0 },
    { id: 'musik',       label: 'musik',       emoji: '🎵', sortOrder: 1 },
    { id: 'mandi',       label: 'mandi',       emoji: '🚿', sortOrder: 2 },
    { id: 'tidur',       label: 'tidur',       emoji: '😴', sortOrder: 3 },
    { id: 'main',        label: 'main',        emoji: '🎮', sortOrder: 4 },
    { id: 'jalan_jalan', label: 'jalan-jalan', emoji: '🚶', sortOrder: 5 },
    { id: 'baca',        label: 'baca',        emoji: '📖', sortOrder: 6 },
    { id: 'gambar',      label: 'gambar',      emoji: '🎨', sortOrder: 7 },
    { id: 'masak',       label: 'masak',       emoji: '👩‍🍳', sortOrder: 8 },
    { id: 'belajar',     label: 'belajar',     emoji: '📚', sortOrder: 9 },
  ],
  tempat: [
    { id: 'rumah',       label: 'rumah',       emoji: '🏠', sortOrder: 0 },
    { id: 'kamar_tidur', label: 'kamar tidur', emoji: '🛏️', sortOrder: 1 },
    { id: 'kamar_mandi', label: 'kamar mandi', emoji: '🚿', sortOrder: 2 },
    { id: 'dapur',       label: 'dapur',       emoji: '🍳', sortOrder: 3 },
    { id: 'ruang_tamu',  label: 'ruang tamu',  emoji: '🛋️', sortOrder: 4 },
    { id: 'toko',        label: 'toko',        emoji: '🏪', sortOrder: 5 },
    { id: 'sekolah',     label: 'sekolah',     emoji: '🏫', sortOrder: 6 },
    { id: 'masjid',      label: 'masjid',      emoji: '🕌', sortOrder: 7 },
    { id: 'mobil',       label: 'mobil',       emoji: '🚗', sortOrder: 8 },
    { id: 'taman',       label: 'taman',       emoji: '🌳', sortOrder: 9 },
  ],
  tubuh: [
    { id: 'lapar',        label: 'lapar',        emoji: '🍽️', sortOrder: 0 },
    { id: 'haus',         label: 'haus',         emoji: '💧', sortOrder: 1 },
    { id: 'sakit_kepala', label: 'sakit kepala', emoji: '🤕', sortOrder: 2 },
    { id: 'mual',         label: 'mual',         emoji: '🤢', sortOrder: 3 },
    { id: 'pusing',       label: 'pusing',       emoji: '😵', sortOrder: 4 },
    { id: 'ngantuk',      label: 'ngantuk',      emoji: '😴', sortOrder: 5 },
    { id: 'panas',        label: 'panas',        emoji: '🥵', sortOrder: 6 },
    { id: 'dingin',       label: 'dingin',       emoji: '🥶', sortOrder: 7 },
    { id: 'gatal',        label: 'gatal',        emoji: '🤚', sortOrder: 8 },
    { id: 'capek',        label: 'capek',        emoji: '😩', sortOrder: 9 },
  ],
}

// ============================================
// Phase 1 backward-compatible exports (removed in Task 10)
// ============================================

export const FOLDERS: Folder[] = SEED_FOLDERS.map((f) => ({
  id: `folder_${f.key}`,
  key: f.key,
  label: f.label,
  emoji: f.emoji,
  sortOrder: f.sortOrder,
  words: (SEED_WORDS[f.key] ?? []).map((w) => ({
    id: w.id,
    label: w.label,
    emoji: w.emoji,
    folderId: f.key,
    sortOrder: w.sortOrder,
  })),
}))

export const PEOPLE: Person[] = SEED_PEOPLE.map((p, i) => ({
  id: p.name.toLowerCase(),
  name: p.name,
  initial: p.initial,
  sortOrder: p.sortOrder ?? i,
}))

export const QUICK_PHRASES: QuickPhrase[] = SEED_QUICK_PHRASES.map((qp, i) => ({
  id: `qp_${i}`,
  phrase: qp.phrase,
  words: qp.words,
  sortOrder: qp.sortOrder ?? i,
}))
