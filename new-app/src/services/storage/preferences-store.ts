import type { PlayerPreferences } from '@/domain/player/player-types'
import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'
import type { PreferencesStore } from '@/services/storage/storage-types'

const store = new LocalStorageStore<PlayerPreferences>(STORAGE_KEYS.preferences)

export const preferencesStore: PreferencesStore = {
  load: () => store.load(),
  save: (preferences) => store.save(preferences),
  clear: () => store.clear(),
}
