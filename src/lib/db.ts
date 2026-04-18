import Dexie, { type Table } from 'dexie'
import type { DbWord, DbFolder, DbPerson, UsageEvent, DbQuickPhrase, AppSettings, VocabularyPack, CommunicationMilestone } from '@/types'
import { scheduleAutoBackup } from '@/lib/auto-backup'

class SuaraDatabase extends Dexie {
  words!: Table<DbWord>
  folders!: Table<DbFolder>
  people!: Table<DbPerson>
  usageEvents!: Table<UsageEvent>
  quickPhrases!: Table<DbQuickPhrase>
  settings!: Table<AppSettings>
  vocabularyPacks!: Table<VocabularyPack>
  communicationMilestones!: Table<CommunicationMilestone>

  constructor() {
    super('SuaraDB')

    this.version(1).stores({
      words: '++id, folderId, label, createdAt',
      folders: '++id, key, sortOrder',
      people: '++id, name, sortOrder',
      usageEvents: '++id, wordId, timestamp, [wordId+timestamp]',
      quickPhrases: '++id, sortOrder',
      settings: 'key',
    })

    this.version(2).stores({
      words: '++id, folderId, label, createdAt',
      folders: '++id, key, sortOrder',
      people: '++id, name, sortOrder',
      usageEvents: '++id, wordId, timestamp, [wordId+timestamp]',
      quickPhrases: '++id, sortOrder',
      settings: 'key',
      vocabularyPacks: '++id, folderKey, isActive',
    })

    this.version(3).stores({
      words: '++id, folderId, label, createdAt',
      folders: '++id, key, sortOrder',
      people: '++id, name, sortOrder',
      usageEvents: '++id, wordId, timestamp, [wordId+timestamp]',
      quickPhrases: '++id, sortOrder',
      settings: 'key',
      vocabularyPacks: '++id, folderKey, isActive',
      communicationMilestones: '++id, type, detectedAt',
    })
  }
}

export const db = new SuaraDatabase()

// Auto-backup: schedule a localStorage snapshot whenever user-configurable
// data changes. Debounced (2s) so rapid admin edits produce one backup.
// Covers: people, folders, words, quickPhrases, settings.
// Excludes: usageEvents, communicationMilestones, vocabularyPacks (high-volume
// analytics data that doesn't need localStorage backup).
const configTables = [db.people, db.folders, db.words, db.quickPhrases, db.settings] as Table[]
for (const table of configTables) {
  table.hook('creating', () => { scheduleAutoBackup() })
  table.hook('updating', () => { scheduleAutoBackup() })
  table.hook('deleting', () => { scheduleAutoBackup() })
}
