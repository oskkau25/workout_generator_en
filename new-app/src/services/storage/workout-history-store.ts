import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'
import type { WorkoutHistoryEntry, WorkoutHistoryStore } from '@/services/storage/storage-types'

const store = new LocalStorageStore<WorkoutHistoryEntry[]>(STORAGE_KEYS.history)

export const workoutHistoryStore: WorkoutHistoryStore = {
  async list(limit) {
    const entries = (await store.load()) ?? []
    return typeof limit === 'number' ? entries.slice(0, limit) : entries
  },
  async append(entry) {
    const current = (await store.load()) ?? []
    await store.save([entry, ...current.filter((item) => item.id !== entry.id)])
  },
  clear: () => store.clear(),
}
