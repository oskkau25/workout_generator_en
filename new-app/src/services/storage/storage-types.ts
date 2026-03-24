import type { BuilderDraft } from '@/domain/builder/builder-types'
import type { PlayerPreferences, PlayerState } from '@/domain/player/player-types'
import type { GeneratedWorkout } from '@/domain/workouts/workout-types'

export interface WorkoutHistoryEntry {
  id: string
  workoutId: string
  status: 'completed' | 'abandoned'
  startedAt: string
  completedAt?: string
}

export interface SavedWorkoutSession {
  workout: GeneratedWorkout
  playerState: PlayerState
  savedAt: string
}

export interface BuilderDraftStore {
  load(): Promise<BuilderDraft | null>
  save(draft: BuilderDraft): Promise<void>
  clear(): Promise<void>
}

export interface WorkoutSessionStore {
  loadActiveSession(): Promise<SavedWorkoutSession | null>
  saveActiveSession(session: SavedWorkoutSession): Promise<void>
  clearActiveSession(): Promise<void>
}

export interface WorkoutHistoryStore {
  list(limit?: number): Promise<WorkoutHistoryEntry[]>
  append(entry: WorkoutHistoryEntry): Promise<void>
  clear(): Promise<void>
}

export interface PreferencesStore {
  load(): Promise<PlayerPreferences | null>
  save(preferences: PlayerPreferences): Promise<void>
}
