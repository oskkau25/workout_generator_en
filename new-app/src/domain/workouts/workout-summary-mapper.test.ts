import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import { normalizeBuilderDraft } from '@/domain/builder/builder-normalizer'
import type { ExerciseDefinition } from '@/domain/exercises/exercise-types'
import { generateWorkout } from '@/domain/workouts/workout-generator'
import { mapGeneratedWorkoutToSummaryViewModel } from '@/domain/workouts/workout-summary-mapper'

function createExercise(
  id: string,
  name: string,
  phase: 'warmup' | 'main' | 'cooldown',
  equipment: ExerciseDefinition['supportedEquipment'][number],
  primaryMuscle: ExerciseDefinition['primaryMuscle'],
): ExerciseDefinition {
  return {
    id,
    slug: id,
    name,
    phaseTags: [phase],
    primaryMuscle,
    secondaryMuscles: [],
    supportedEquipment: [equipment],
    supportedLevels: ['beginner', 'intermediate', 'advanced'],
    movementPattern: phase === 'cooldown' ? 'mobility' : phase === 'warmup' ? 'locomotion' : 'squat',
    bodyMap:
      primaryMuscle === 'mobility'
        ? { primary: ['core', 'glutes'], secondary: ['hamstrings', 'shoulders'] }
        : primaryMuscle === 'legs'
          ? { primary: ['quadriceps', 'glutes'], secondary: ['hamstrings', 'calves'] }
          : { primary: ['core', 'quadriceps'], secondary: ['glutes', 'shoulders'] },
    focusTags: [phase, primaryMuscle],
    coaching: {
      shortInstruction: `${name} short`,
      fullInstruction: `${name} full`,
    },
    substitutionTags: [],
  }
}

const fixtureCatalog: ExerciseDefinition[] = [
  ...Array.from({ length: 8 }, (_, index) =>
    createExercise(`wu-bw-${index}`, `Warmup BW ${index}`, 'warmup', 'bodyweight', 'full_body'),
  ),
  ...Array.from({ length: 8 }, (_, index) =>
    createExercise(`cd-bw-${index}`, `Cooldown BW ${index}`, 'cooldown', 'bodyweight', 'mobility'),
  ),
  ...Array.from({ length: 12 }, (_, index) =>
    createExercise(`main-bw-${index}`, `Main BW ${index}`, 'main', 'bodyweight', 'legs'),
  ),
]

const options = {
  random: () => 0,
  now: () => new Date('2026-03-24T10:00:00.000Z'),
}

describe('mapGeneratedWorkoutToSummaryViewModel', () => {
  it('renders friendly exercise names instead of raw ids', () => {
    const request = normalizeBuilderDraft(createDefaultBuilderDraft())
    const workout = generateWorkout(request, fixtureCatalog, options)

    const summary = mapGeneratedWorkoutToSummaryViewModel(workout, fixtureCatalog)
    const firstExercise = summary.sections[0].steps[0]

    expect(firstExercise.title).toMatch(/Warmup BW/i)
    expect(firstExercise.title).not.toMatch(/^wu-bw-/i)
    expect(firstExercise.detail).toMatch(/short/i)
  })

  it('adds circuit, tabata, and pyramid structure hints', () => {
    const circuitWorkout = generateWorkout(
      normalizeBuilderDraft({
        ...createDefaultBuilderDraft(),
        format: 'circuit',
        formatConfig: { circuit: { rounds: 3, exercisesPerRound: 4, roundRestSeconds: 60 } },
      }),
      fixtureCatalog,
      options,
    )
    const tabataWorkout = generateWorkout(
      normalizeBuilderDraft({
        ...createDefaultBuilderDraft(),
        format: 'tabata',
        formatConfig: { tabata: { rounds: 6 } },
      }),
      fixtureCatalog,
      options,
    )
    const pyramidWorkout = generateWorkout(
      normalizeBuilderDraft({
        ...createDefaultBuilderDraft(),
        format: 'pyramid',
        formatConfig: { pyramid: { levels: 4 } },
      }),
      fixtureCatalog,
      options,
    )

    expect(mapGeneratedWorkoutToSummaryViewModel(circuitWorkout, fixtureCatalog).sections[1].hint).toMatch(
      /all 3 rounds/i,
    )
    expect(mapGeneratedWorkoutToSummaryViewModel(tabataWorkout, fixtureCatalog).sections[1].hint).toMatch(
      /20s work \/ 10s rest/i,
    )
    expect(mapGeneratedWorkoutToSummaryViewModel(pyramidWorkout, fixtureCatalog).sections[1].hint).toMatch(
      /4 levels/i,
    )
  })
})
