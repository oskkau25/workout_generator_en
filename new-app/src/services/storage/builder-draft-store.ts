import type { BuilderDraft } from '@/domain/builder/builder-types'
import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'

export const builderDraftStore = new LocalStorageStore<BuilderDraft>(STORAGE_KEYS.builderDraft)
