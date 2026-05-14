import type { PlayerSnapshot, PlayerState } from '@/domain/player/player-types'
import type { WorkoutExerciseStep } from '@/domain/workouts/workout-types'

export function getCurrentStep(state: PlayerState): WorkoutExerciseStep | null {
  return state.workout?.playback.steps[state.progress.currentStepIndex] ?? null
}

export function getNextStep(state: PlayerState): WorkoutExerciseStep | null {
  if (!state.workout) {
    return null
  }

  return state.workout.playback.steps[state.progress.currentStepIndex + 1] ?? null
}

export function getProgressPercent(state: PlayerState): number {
  if (state.progress.totalSteps === 0) {
    return 0
  }

  return Math.round((state.progress.completedStepIds.length / state.progress.totalSteps) * 100)
}

export function isRestPhase(state: PlayerState): boolean {
  return state.timer.phase === 'rest' || (state.timer.phase === 'paused' && state.timer.previousPhase === 'rest')
}

export function canGoPrevious(state: PlayerState): boolean {
  return state.progress.currentStepIndex > 0
}

export function canGoNext(state: PlayerState): boolean {
  return state.progress.currentStepIndex < state.progress.totalSteps
}

export function getPlayerSnapshot(state: PlayerState): PlayerSnapshot {
  return {
    phase: state.timer.phase,
    step: getCurrentStep(state),
    nextStep: getNextStep(state),
    progressPercent: getProgressPercent(state),
  }
}
