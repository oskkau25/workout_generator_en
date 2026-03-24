import type { GeneratedWorkout, WorkoutExerciseStep } from '@/domain/workouts/workout-types'

export type PlayerPhase = 'idle' | 'ready' | 'work' | 'rest' | 'paused' | 'completed'

export type PlayerActivePhase = Extract<PlayerPhase, 'ready' | 'work' | 'rest'>

export interface PlayerPreferences {
  soundEnabled: boolean
  vibrationEnabled: boolean
  voiceCountdownEnabled: boolean
}

export interface PlayerTimerState {
  phase: PlayerPhase
  previousPhase: PlayerActivePhase | null
  remainingSeconds: number
  phaseTotalSeconds: number
  elapsedSeconds: number
}

export interface PlayerProgressState {
  currentStepIndex: number
  totalSteps: number
  completedStepIds: string[]
}

export interface ActiveWorkoutSession {
  sessionId: string
  workoutId: string
  startedAt: string
  lastUpdatedAt: string
  status: 'active' | 'paused' | 'completed' | 'abandoned'
  playbackStepIds: string[]
}

export interface PlayerState {
  workout: GeneratedWorkout | null
  session: ActiveWorkoutSession | null
  timer: PlayerTimerState
  progress: PlayerProgressState
  preferences: PlayerPreferences
}

export type PlayerAction =
  | { type: 'LOAD_WORKOUT'; workout: GeneratedWorkout; resumeFromStepIndex?: number; now?: string; sessionId?: string }
  | { type: 'HYDRATE_STATE'; playerState: PlayerState }
  | { type: 'START' }
  | { type: 'TICK'; seconds?: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SKIP_REST' }
  | { type: 'EXIT'; now?: string }
  | { type: 'COMPLETE'; now?: string }
  | { type: 'UPDATE_PREFERENCES'; preferences: Partial<PlayerPreferences> }

export interface PlayerSnapshot {
  phase: PlayerPhase
  step: WorkoutExerciseStep | null
  nextStep: WorkoutExerciseStep | null
  progressPercent: number
}
