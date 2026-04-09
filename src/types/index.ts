// ============================================
// Database types (stored in IndexedDB via Dexie)
// ============================================

// Fringe word stored in IndexedDB
export interface DbWord {
  id?: number
  folderId: number
  label: string
  labelDisplay?: string
  symbolPath?: string
  photoBlob?: Blob
  audioPath?: string
  audioBlob?: Blob
  sortOrder: number
  isActive: boolean
  createdAt: number
  updatedAt: number
  source: 'bundled' | 'family'
}

// Folder category
export interface DbFolder {
  id?: number
  key: string
  label: string
  emoji: string
  sortOrder: number
  isActive: boolean
  createdAt: number
  updatedAt: number
}

// Person in people row
export interface DbPerson {
  id?: number
  name: string
  initial: string
  photoBlob?: Blob
  audioBlob?: Blob
  sortOrder: number
  isActive: boolean
  createdAt: number
  updatedAt: number
}

// Usage event log entry
export interface UsageEvent {
  id?: number
  wordId: string
  wordLabel: string
  wordCategory: 'core' | 'fringe' | 'people' | 'quickphrase'
  folderId?: number
  sentenceContext?: string[]
  navigationPath: string[]
  wasAccepted: boolean
  sessionId: string
  timestamp: number
  hourOfDay: number
  dayOfWeek: number
}

// Quick phrase preset
export interface DbQuickPhrase {
  id?: number
  phrase: string
  words: string[]
  audioBlob?: Blob
  sortOrder: number
  isActive: boolean
  createdAt: number
  updatedAt: number
}

// Key-value settings
export interface AppSettings {
  key: string
  value: unknown
  updatedAt: number
}

// Vocabulary pack for progressive masking
export interface VocabularyPack {
  id?: number
  name: string
  folderKey: string
  wordIds: string[]
  isActive: boolean
  sortOrder: number
  createdAt: number
  updatedAt: number
}

// ============================================
// Runtime types (used by components and hooks)
// ============================================

// Core word — hardcoded, never in database
export interface CoreWord {
  id: string
  label: string
  emoji: string
  symbolPath: string
  audioPath: string
  row: 1 | 2
  position: 0 | 1 | 2 | 3 | 4
}

// Unified word type for sentence bar and suggestions
export interface Word {
  id: string
  label: string
  category: 'core' | 'fringe' | 'people' | 'quickphrase'
  symbolPath?: string
  photoBlob?: Blob
  audioPath?: string
  audioBlob?: Blob
  emoji?: string
}

// Folder key — dynamic from DB (no longer fixed union)
export type FolderKey = string | null

// Intent prediction from frequency model
export interface IntentPrediction {
  word: Word
  score: number
  reason: 'frequency' | 'time_of_day' | 'sequence'
}

// ============================================
// Phase 1 compatibility types (removed in Task 10)
// ============================================

// Used by FolderContents.tsx until Task 7 migration
export interface FringeWord {
  id: string
  label: string
  emoji: string
  folderId: string
  sortOrder: number
}

// Used by FolderRow/FolderContents until Task 7 migration
export interface Folder {
  id: string
  key: string
  label: string
  emoji: string
  sortOrder: number
  words: FringeWord[]
}

// Used by PeopleRow until Task 7 migration
export interface Person {
  id: string
  name: string
  initial: string
  sortOrder: number
}

// Used by QuickPhrases until Task 7 migration
export interface QuickPhrase {
  id: string
  phrase: string
  words: string[]
  sortOrder: number
}
