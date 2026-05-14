import type { PlayerState } from '@/domain/player/player-types'
import type { GeneratedWorkout } from '@/domain/workouts/workout-types'
import type { WorkoutHistoryEntry } from '@/services/storage/storage-types'

export function createHistoryEntryFromPlayerState(playerState: PlayerState, workout: GeneratedWorkout, now: string): WorkoutHistoryEntry {
  const sessionId = playerState.session?.sessionId ?? `session-${workout.id}`
  const startedAt = playerState.session?.startedAt ?? now
  const status = playerState.session?.status === 'completed' || playerState.timer.phase === 'completed' ? 'completed' : 'abandoned'

  return {
    id: `${sessionId}-${status}`,
    workoutId: workout.id,
    sessionId,
    status,
    startedAt,
    completedAt: status === 'completed' ? now : undefined,
    syncState: 'local-only',
    summary: {
      sessionId,
      workoutId: workout.id,
      completedAt: now,
      format: workout.metadata.format,
      goal: workout.metadata.goal,
      level: workout.metadata.level,
      selectedEquipment: workout.metadata.selectedEquipment,
      totalStepsCompleted: playerState.progress.completedStepIds.length,
      totalDurationSeconds: playerState.timer.elapsedSeconds,
      workoutTitle: workout.metadata.title,
    },
  }
}

export function summarizeHistory(entries: WorkoutHistoryEntry[]) {
  const completed = entries.filter((entry) => entry.status === 'completed')
  const totalSeconds = completed.reduce((sum, entry) => sum + entry.summary.totalDurationSeconds, 0)
  const uniqueFormats = new Set(completed.map((entry) => entry.summary.format)).size

  return {
    completedCount: completed.length,
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 60),
    uniqueFormats,
  }
}
