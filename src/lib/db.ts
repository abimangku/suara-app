import Dexie, { type Table } from 'dexie'
import type { DbWord, DbFolder, DbPerson, UsageEvent, DbQuickPhrase, AppSettings, VocabularyPack } from '@/types'

class SuaraDatabase extends Dexie {
  words!: Table<DbWord>
  folders!: Table<DbFolder>
  people!: Table<DbPerson>
  usageEvents!: Table<UsageEvent>
  quickPhrases!: Table<DbQuickPhrase>
  settings!: Table<AppSettings>
  vocabularyPacks!: Table<VocabularyPack>

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
  }
}

export const db = new SuaraDatabase()
