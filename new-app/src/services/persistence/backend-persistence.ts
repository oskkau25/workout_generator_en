import type { BuilderDraft } from '@/domain/builder/builder-types'
import type { GeneratedWorkout } from '@/domain/workouts/workout-types'
import type { SavedWorkoutSession, WorkoutHistoryEntry } from '@/services/storage/storage-types'

export type BackendPersistenceResource = 'builder-draft' | 'generated-workout' | 'active-session' | 'history-entry' | 'preferences'

export interface PersistenceEnvelope<TPayload> {
  resource: BackendPersistenceResource
  userId?: string
  deviceId?: string
  payload: TPayload
  updatedAt: string
}

export interface BackendPersistenceGateway {
  saveBuilderDraft?(envelope: PersistenceEnvelope<BuilderDraft>): Promise<void>
  saveGeneratedWorkout?(envelope: PersistenceEnvelope<GeneratedWorkout>): Promise<void>
  saveActiveSession?(envelope: PersistenceEnvelope<SavedWorkoutSession>): Promise<void>
  appendHistoryEntry?(envelope: PersistenceEnvelope<WorkoutHistoryEntry>): Promise<void>
}

export const noopBackendPersistenceGateway: BackendPersistenceGateway = {}
