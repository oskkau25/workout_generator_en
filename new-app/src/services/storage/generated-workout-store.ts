import type { BuilderDraft, WorkoutGenerationRequest } from '@/domain/builder/builder-types'
import type { GeneratedWorkout } from '@/domain/workouts/workout-types'
import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'

export interface StoredGeneratedWorkout {
  id: string
  workout: GeneratedWorkout
}

const generatedWorkoutStore = new LocalStorageStore<StoredGeneratedWorkout>(STORAGE_KEYS.generatedWorkout)

function toDuration(targetMinutes: number): BuilderDraft['duration'] {
  const safeMinutes = [15, 20, 30, 45, 60].includes(targetMinutes) ? targetMinutes : 30
  return { targetMinutes: safeMinutes as BuilderDraft['duration']['targetMinutes'] }
}

export function rehydrateBuilderDraftFromRequest(request: WorkoutGenerationRequest): BuilderDraft {
  return {
    goal: request.goal,
    level: request.level,
    duration: toDuration(request.targetMinutes),
    format: request.format,
    selectedEquipment: request.selectedEquipment,
    timing: {
      workSeconds: request.timing.workSeconds,
      restSeconds: request.timing.restSeconds,
    },
    formatConfig: {
      circuit:
        request.formatConfig.format === 'circuit'
          ? {
              rounds: request.formatConfig.rounds,
              exercisesPerRound: request.formatConfig.exercisesPerRound,
              roundRestSeconds: request.formatConfig.roundRestSeconds,
            }
          : undefined,
      tabata:
        request.formatConfig.format === 'tabata'
          ? {
              rounds: request.formatConfig.rounds,
            }
          : undefined,
      pyramid:
        request.formatConfig.format === 'pyramid'
          ? {
              levels: request.formatConfig.levels,
            }
          : undefined,
    },
    advanced: request.advanced,
  }
}

export const GeneratedWorkoutStore = {
  load: () => generatedWorkoutStore.load(),
  save: (value: StoredGeneratedWorkout) => generatedWorkoutStore.save(value),
  clear: () => generatedWorkoutStore.clear(),
}
