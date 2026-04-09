import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'

export function useVocabulary() {
  const folders = useLiveQuery(
    () => db.folders.filter((f) => f.isActive).sortBy('sortOrder'),
    []
  )

  const people = useLiveQuery(
    () => db.people.filter((p) => p.isActive).sortBy('sortOrder'),
    []
  )

  const quickPhrases = useLiveQuery(
    () => db.quickPhrases.filter((qp) => qp.isActive).sortBy('sortOrder'),
    []
  )

  return { folders, people, quickPhrases }
}

export function useFolderWords(folderId: number | undefined) {
  return useLiveQuery(
    () => {
      if (!folderId) return []
      return db.words
        .where('folderId')
        .equals(folderId)
        .filter((w) => w.isActive)
        .sortBy('sortOrder')
    },
    [folderId],
    []
  )
}
