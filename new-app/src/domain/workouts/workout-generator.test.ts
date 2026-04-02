import { describe, expect, it } from 'vitest'
import type { WorkoutGenerationRequest } from '@/domain/builder/builder-types'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { generateWorkout } from '@/domain/workouts/workout-generator'

const baseRequest: WorkoutGenerationRequest = {
  goal: 'full_body',
  level: 'intermediate',
  targetMinutes: 30,
  format: 'standard',
  selectedEquipment: ['bodyweight'],
  timing: { workSeconds: 40, restSeconds: 20 },
  formatConfig: { format: 'standard' },
  advanced: {
    includeWarmup: true,
    includeCooldown: true,
    allowExerciseRepeats: false,
    preferBalancedMuscleSplit: true,
    targetIntensity: 3,
  },
}

describe('generateWorkout', () => {
  it('keeps upper-body workouts centered on upper-body patterns', () => {
    const workout = generateWorkout({ ...baseRequest, goal: 'upper_body' }, legacyExerciseCatalog, {
      now: () => new Date('2026-04-02T10:00:00.000Z'),
      random: () => 0.2,
    })

    const mainExercises = workout.playback.steps
      .map((step) => legacyExerciseCatalog.find((exercise) => exercise.id === step.exerciseId))
      .filter((exercise) => exercise?.phaseTags.includes('main'))

    expect(mainExercises.length).toBeGreaterThan(0)
    expect(
      mainExercises.every(
        (exercise) =>
          exercise &&
          ['chest', 'back', 'shoulders', 'arms', 'core', 'full_body'].includes(exercise.primaryMuscle),
      ),
    ).toBe(true)
  })

  it('produces movement-pattern variety for balanced full-body sessions', () => {
    const workout = generateWorkout(baseRequest, legacyExerciseCatalog, {
      now: () => new Date('2026-04-02T10:00:00.000Z'),
      random: () => 0.1,
    })

    const mainPatterns = new Set(
      workout.playback.steps
        .map((step) => legacyExerciseCatalog.find((exercise) => exercise.id === step.exerciseId))
        .filter((exercise) => exercise?.phaseTags.includes('main'))
        .map((exercise) => exercise?.movementPattern),
    )

    expect(mainPatterns.size).toBeGreaterThanOrEqual(3)
  })
})
