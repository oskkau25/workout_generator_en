import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'
import type { SavedWorkoutSession, WorkoutSessionStore } from '@/services/storage/storage-types'

const store = new LocalStorageStore<SavedWorkoutSession>(STORAGE_KEYS.activeSession)

export const workoutSessionStore: WorkoutSessionStore = {
  loadActiveSession: () => store.load(),
  saveActiveSession: (session) => store.save(session),
  clearActiveSession: () => store.clear(),
}
