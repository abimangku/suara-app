// Core word — hardcoded, never in database
export interface CoreWord {
  id: string
  label: string
  emoji: string
  row: 1 | 2
  position: 0 | 1 | 2 | 3 | 4
}

// Person shown in people row
export interface Person {
  id: string
  name: string
  initial: string
  sortOrder: number
}

// Fringe word inside a folder
export interface FringeWord {
  id: string
  label: string
  emoji: string
  folderId: string
  sortOrder: number
}

// Folder category button
export interface Folder {
  id: string
  key: string
  label: string
  emoji: string
  sortOrder: number
  words: FringeWord[]
}

// Unified word type for sentence bar
export interface Word {
  id: string
  label: string
  category: 'core' | 'fringe' | 'people' | 'quickphrase'
}

// Quick phrase preset
export interface QuickPhrase {
  id: string
  phrase: string
  words: string[]
  sortOrder: number
}

// Folder key union type
export type FolderKey = 'makanan' | 'perasaan' | 'aktivitas' | 'tempat' | 'tubuh' | null
