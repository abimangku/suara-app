import { db } from '@/lib/db'
import type { VocabularyPack } from '@/types'

/**
 * Toggle a vocabulary pack's active state.
 * When deactivated, the words in the pack become hidden in the grid.
 */
export async function togglePack(packId: number, isActive: boolean): Promise<void> {
  await db.vocabularyPacks.update(packId, {
    isActive,
    updatedAt: Date.now(),
  })
}

/**
 * Get all active packs for a folder.
 */
export async function getActivePacksForFolder(folderKey: string): Promise<VocabularyPack[]> {
  return db.vocabularyPacks
    .where('folderKey')
    .equals(folderKey)
    .filter((p) => p.isActive)
    .toArray()
}

/**
 * Get all packs (active and inactive).
 */
export async function getAllPacks(): Promise<VocabularyPack[]> {
  return db.vocabularyPacks.toArray()
}
