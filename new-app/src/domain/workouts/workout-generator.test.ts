import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import { normalizeBuilderDraft } from '@/domain/builder/builder-normalizer'
import type { BuilderDraft } from '@/domain/builder/builder-types'
import type { ExerciseDefinition } from '@/domain/exercises/exercise-types'
import { generateWorkout } from '@/domain/workouts/workout-generator'

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
  ...Array.from({ length: 12 }, (_, index) =>
    createExercise(`main-db-${index}`, `Main DB ${index}`, 'main', 'dumbbells', 'arms'),
  ),
]

function createRequest(overrides: Partial<BuilderDraft> = {}) {
  return normalizeBuilderDraft({
    ...createDefaultBuilderDraft(),
    ...overrides,
  })
}

describe('normalizeBuilderDraft', () => {
  it('falls back to bodyweight and locks tabata timing', () => {
    const request = createRequest({
      format: 'tabata',
      selectedEquipment: [],
      timing: { workSeconds: 99, restSeconds: 77 },
    })

    expect(request.selectedEquipment).toEqual(['bodyweight'])
    expect(request.timing).toEqual({ workSeconds: 20, restSeconds: 10 })
    expect(request.formatConfig).toMatchObject({ format: 'tabata', intervalSeconds: 20, recoverySeconds: 10 })
  })

  it('clamps format-specific config', () => {
    const request = createRequest({
      format: 'circuit',
      formatConfig: { circuit: { rounds: 99, exercisesPerRound: 1, roundRestSeconds: 999 } },
    })

    expect(request.formatConfig).toEqual({
      format: 'circuit',
      rounds: 8,
      exercisesPerRound: 3,
      roundRestSeconds: 180,
    })
  })
})

describe('generateWorkout', () => {
  const options = {
    random: () => 0,
    now: () => new Date('2026-03-24T10:00:00.000Z'),
  }

  it('preserves standard structure and duration-driven main count', () => {
    const workout = generateWorkout(createRequest({ duration: { targetMinutes: 30 } }), fixtureCatalog, options)

    expect(workout.blocks.map((block) => block.type)).toEqual(['warmup', 'main', 'cooldown'])
    expect(workout.blocks[0].steps).toHaveLength(8)
    expect(workout.blocks[1].steps).toHaveLength(10)
    expect(workout.blocks[2].steps).toHaveLength(8)
    expect(workout.playback.steps.every((step) => step.kind === 'exercise')).toBe(true)
    expect(workout.playback.steps.slice(0, 8).every((step) => step.block === 'warmup')).toBe(true)
  })

  it('uses the selected equipment when filtering', () => {
    const workout = generateWorkout(
      createRequest({ selectedEquipment: ['dumbbells'], format: 'standard' }),
      fixtureCatalog,
      options,
    )

    const mainIds = workout.blocks[1].steps
      .filter((step) => step.kind === 'exercise')
      .map((step) => step.exerciseId)

    expect(mainIds.every((id) => id.startsWith('main-db-'))).toBe(true)
  })

  it('keeps circuit summary compact while expanding playback rounds', () => {
    const workout = generateWorkout(
      createRequest({
        format: 'circuit',
        formatConfig: { circuit: { rounds: 3, exercisesPerRound: 4, roundRestSeconds: 60 } },
      }),
      fixtureCatalog,
      options,
    )

    const summaryMain = workout.blocks[1]
    const summaryExercises = summaryMain.steps.filter((step) => step.kind === 'exercise')

    expect(summaryMain.steps[0]).toMatchObject({ kind: 'format_marker', markerType: 'circuit_start' })
    expect(summaryExercises).toHaveLength(4)
    expect(workout.playback.steps.filter((step) => step.block === 'main')).toHaveLength(12)
    expect(new Set(workout.playback.steps.filter((step) => step.block === 'main').map((step) => step.roundIndex))).toEqual(new Set([1, 2, 3]))
  })

  it('normalizes tabata to 20/10 intervals in summary and playback', () => {
    const workout = generateWorkout(
      createRequest({ format: 'tabata', formatConfig: { tabata: { rounds: 6 } } }),
      fixtureCatalog,
      options,
    )

    const mainSummary = workout.blocks[1].steps
    const playbackMain = workout.playback.steps.filter((step) => step.block === 'main')

    expect(mainSummary.filter((step) => step.kind === 'format_marker')).toHaveLength(6)
    expect(playbackMain).toHaveLength(6)
    expect(playbackMain.every((step) => step.workSeconds === 20)).toBe(true)
    expect(playbackMain.slice(0, -1).every((step) => step.restSeconds === 10)).toBe(true)
    expect(playbackMain.at(-1)?.restSeconds).toBe(0)
  })

  it('adds pyramid level markers and explicit level indexes', () => {
    const workout = generateWorkout(
      createRequest({ format: 'pyramid', formatConfig: { pyramid: { levels: 4 } } }),
      fixtureCatalog,
      options,
    )

    const markers = workout.blocks[1].steps.filter((step) => step.kind === 'format_marker')
    const playbackMain = workout.playback.steps.filter((step) => step.block === 'main')

    expect(markers).toHaveLength(4)
    expect(playbackMain).toHaveLength(8)
    expect(new Set(playbackMain.map((step) => step.levelIndex))).toEqual(new Set([1, 2, 3, 4]))
  })
})
