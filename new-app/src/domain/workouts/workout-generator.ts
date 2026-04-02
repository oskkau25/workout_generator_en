import type { WorkoutGenerationRequest } from '@/domain/builder/builder-types'
import type { ExerciseDefinition, ExercisePhaseTag, MuscleGroup } from '@/domain/exercises/exercise-types'
import { getBalanceBucket, getGoalBiasScore } from '@/domain/exercises/exercise-taxonomy'
import type {
  GeneratedWorkout,
  WorkoutBlock,
  WorkoutBlockType,
  WorkoutExerciseStep,
  WorkoutFormatMarkerStep,
  WorkoutPlaybackPlan,
  WorkoutStep,
} from '@/domain/workouts/workout-types'

const GENERATOR_VERSION = '2.4.0'
const DEFAULT_WARMUP_COUNT = 8
const DEFAULT_COOLDOWN_COUNT = 8
const PYRAMID_EXERCISES_PER_LEVEL = 2

export interface WorkoutGeneratorOptions {
  now?: () => Date
  random?: () => number
}

interface BuildContext {
  request: WorkoutGenerationRequest
  catalog: ExerciseDefinition[]
  random: () => number
  warnings: string[]
}

interface ExerciseSeed {
  exerciseId: string
  name: string
  primaryMuscle: MuscleGroup
  workSeconds: number
  restSeconds: number
  noRestAfter: boolean
  roundIndex?: number
  totalRounds?: number
  setIndex?: number
  totalSets?: number
  levelIndex?: number
  totalLevels?: number
}

function shuffleInPlace<T>(items: T[], random: () => number): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[items[index], items[swapIndex]] = [items[swapIndex], items[index]]
  }

  return items
}

function selectExercises(
  pool: ExerciseDefinition[],
  count: number,
  random: () => number,
  allowRepeats = false,
): ExerciseDefinition[] {
  if (count <= 0 || pool.length === 0) {
    return []
  }

  if (allowRepeats) {
    const shuffled = shuffleInPlace([...pool], random)
    return Array.from({ length: count }, (_, index) => shuffled[index % shuffled.length])
  }

  return shuffleInPlace([...pool], random).slice(0, Math.min(count, pool.length))
}

function estimateMainExerciseCount(request: WorkoutGenerationRequest): number {
  switch (request.format) {
    case 'circuit':
      return (request.formatConfig as Extract<WorkoutGenerationRequest['formatConfig'], { format: 'circuit' }>).exercisesPerRound
    case 'tabata':
      return (request.formatConfig as Extract<WorkoutGenerationRequest['formatConfig'], { format: 'tabata' }>).rounds
    case 'pyramid':
      return (request.formatConfig as Extract<WorkoutGenerationRequest['formatConfig'], { format: 'pyramid' }>).levels * PYRAMID_EXERCISES_PER_LEVEL
    default:
      return Math.max(6, Math.floor(request.targetMinutes / 3))
  }
}

function filterExercises(
  catalog: ExerciseDefinition[],
  phase: ExercisePhaseTag,
  request: WorkoutGenerationRequest,
): ExerciseDefinition[] {
  return catalog.filter((exercise) => {
    if (!exercise.phaseTags.includes(phase)) {
      return false
    }

    const equipmentMatch = exercise.supportedEquipment.some((equipment) =>
      request.selectedEquipment.includes(equipment),
    )

    if (!equipmentMatch) {
      return false
    }

    return exercise.supportedLevels.includes(request.level)
  })
}

function sortPoolForGoal(exercises: ExerciseDefinition[], request: WorkoutGenerationRequest, random: () => number) {
  return shuffleInPlace([...exercises], random).sort(
    (left, right) => getGoalBiasScore(right, request.goal) - getGoalBiasScore(left, request.goal),
  )
}

function applyBalance(
  exercises: ExerciseDefinition[],
  preferredCount: number,
  request: WorkoutGenerationRequest,
  random: () => number,
): ExerciseDefinition[] {
  if (exercises.length <= 1) {
    return exercises.slice(0, preferredCount)
  }

  const buckets = new Map<string, ExerciseDefinition[]>()
  for (const exercise of sortPoolForGoal(exercises, request, random)) {
    const key = getBalanceBucket(exercise, request.goal)
    const current = buckets.get(key) ?? []
    current.push(exercise)
    buckets.set(key, current)
  }

  const result: ExerciseDefinition[] = []
  while (result.length < preferredCount && buckets.size > 0) {
    for (const [bucketKey, bucket] of buckets) {
      const candidate = bucket.shift()
      if (candidate) {
        result.push(candidate)
      }
      if (bucket.length === 0) {
        buckets.delete(bucketKey)
      }
      if (result.length >= preferredCount) {
        break
      }
    }
  }

  return result
}

function fallbackIfEmpty(
  pool: ExerciseDefinition[],
  fallback: ExerciseDefinition[],
  warnings: string[],
  label: string,
): ExerciseDefinition[] {
  if (pool.length > 0) {
    return pool
  }

  warnings.push(`No ${label} exercises matched the exact equipment/level filters; using broader fallback pool.`)
  return fallback
}

function createExerciseStep(seed: ExerciseSeed, block: WorkoutBlockType, order: number): WorkoutExerciseStep {
  return {
    kind: 'exercise',
    id: `${block}-${order}-${seed.exerciseId}`,
    exerciseId: seed.exerciseId,
    block,
    order,
    workSeconds: seed.workSeconds,
    restSeconds: seed.restSeconds,
    noRestAfter: seed.noRestAfter,
    roundIndex: seed.roundIndex,
    totalRounds: seed.totalRounds,
    setIndex: seed.setIndex,
    totalSets: seed.totalSets,
    levelIndex: seed.levelIndex,
    totalLevels: seed.totalLevels,
  }
}

function createMarkerStep(
  block: WorkoutBlockType,
  order: number,
  marker: WorkoutFormatMarkerStep['markerType'],
  label: string,
  detail: Partial<WorkoutFormatMarkerStep> = {},
): WorkoutFormatMarkerStep {
  return {
    kind: 'format_marker',
    id: `${block}-${order}-${marker}`,
    block,
    order,
    markerType: marker,
    label,
    description: detail.description,
    roundIndex: detail.roundIndex,
    totalRounds: detail.totalRounds,
    setIndex: detail.setIndex,
    totalSets: detail.totalSets,
    levelIndex: detail.levelIndex,
    totalLevels: detail.totalLevels,
  }
}

function buildWarmupSeeds(context: BuildContext): ExerciseSeed[] {
  if (!context.request.advanced.includeWarmup) {
    return []
  }

  const exactPool = filterExercises(context.catalog, 'warmup', context.request)
  const fallbackPool = context.catalog.filter((exercise) => exercise.phaseTags.includes('warmup'))
  const pool = fallbackIfEmpty(exactPool, fallbackPool, context.warnings, 'warmup')

  return selectExercises(pool, DEFAULT_WARMUP_COUNT, context.random).map((exercise) => ({
    exerciseId: exercise.id,
    name: exercise.name,
    primaryMuscle: exercise.primaryMuscle,
    workSeconds: 30,
    restSeconds: 0,
    noRestAfter: true,
  }))
}

function buildCooldownSeeds(context: BuildContext): ExerciseSeed[] {
  if (!context.request.advanced.includeCooldown) {
    return []
  }

  const exactPool = filterExercises(context.catalog, 'cooldown', context.request)
  const fallbackPool = context.catalog.filter((exercise) => exercise.phaseTags.includes('cooldown'))
  const pool = fallbackIfEmpty(exactPool, fallbackPool, context.warnings, 'cooldown')

  return selectExercises(pool, DEFAULT_COOLDOWN_COUNT, context.random).map((exercise) => ({
    exerciseId: exercise.id,
    name: exercise.name,
    primaryMuscle: exercise.primaryMuscle,
    workSeconds: 30,
    restSeconds: 0,
    noRestAfter: true,
  }))
}

function buildMainPool(context: BuildContext): ExerciseDefinition[] {
  const exactPool = filterExercises(context.catalog, 'main', context.request)
  const fallbackPool = context.catalog.filter((exercise) => exercise.phaseTags.includes('main'))
  return sortPoolForGoal(fallbackIfEmpty(exactPool, fallbackPool, context.warnings, 'main'), context.request, context.random)
}

function buildStandardMainSeeds(context: BuildContext): ExerciseSeed[] {
  const mainPool = buildMainPool(context)
  const mainCount = estimateMainExerciseCount(context.request)
  const baseSelection = context.request.advanced.preferBalancedMuscleSplit
    ? applyBalance(mainPool, mainCount, context.request, context.random)
    : selectExercises(mainPool, mainCount, context.random, context.request.advanced.allowExerciseRepeats)

  const selection =
    baseSelection.length >= mainCount || !context.request.advanced.allowExerciseRepeats
      ? baseSelection
      : [...baseSelection, ...selectExercises(mainPool, mainCount - baseSelection.length, context.random, true)]

  return selection.map((exercise, index) => ({
    exerciseId: exercise.id,
    name: exercise.name,
    primaryMuscle: exercise.primaryMuscle,
    workSeconds: context.request.timing.workSeconds,
    restSeconds: index === selection.length - 1 ? 0 : context.request.timing.restSeconds,
    noRestAfter: index === selection.length - 1,
  }))
}

function buildCircuitMain(context: BuildContext): { summary: WorkoutStep[]; playback: ExerciseSeed[] } {
  const config = context.request.formatConfig as Extract<WorkoutGenerationRequest['formatConfig'], { format: 'circuit' }>
  const mainPool = buildMainPool(context)
  const baseExercises = context.request.advanced.preferBalancedMuscleSplit
    ? applyBalance(mainPool, config.exercisesPerRound, context.request, context.random)
    : selectExercises(mainPool, config.exercisesPerRound, context.random, context.request.advanced.allowExerciseRepeats)

  const summary: WorkoutStep[] = [
    createMarkerStep('main', 1, 'circuit_start', 'Circuit Training', {
      description: `${config.exercisesPerRound} exercises x ${config.rounds} rounds`,
      roundIndex: 1,
      totalRounds: config.rounds,
    }),
  ]

  summary.push(
    ...baseExercises.map((exercise, index) =>
      createExerciseStep(
        {
          exerciseId: exercise.id,
          name: exercise.name,
          primaryMuscle: exercise.primaryMuscle,
          workSeconds: context.request.timing.workSeconds,
          restSeconds: context.request.timing.restSeconds,
          noRestAfter: index === baseExercises.length - 1,
          roundIndex: 1,
          totalRounds: config.rounds,
        },
        'main',
        index + 2,
      ),
    ),
  )

  const playback: ExerciseSeed[] = []
  for (let roundIndex = 1; roundIndex <= config.rounds; roundIndex += 1) {
    baseExercises.forEach((exercise, exerciseIndex) => {
      const isLastExerciseInRound = exerciseIndex === baseExercises.length - 1
      const isLastRound = roundIndex === config.rounds
      playback.push({
        exerciseId: exercise.id,
        name: exercise.name,
        primaryMuscle: exercise.primaryMuscle,
        workSeconds: context.request.timing.workSeconds,
        restSeconds: isLastExerciseInRound
          ? isLastRound
            ? 0
            : config.roundRestSeconds
          : context.request.timing.restSeconds,
        noRestAfter: isLastExerciseInRound && isLastRound,
        roundIndex,
        totalRounds: config.rounds,
      })
    })
  }

  return { summary, playback }
}

function buildTabataMain(context: BuildContext): { summary: WorkoutStep[]; playback: ExerciseSeed[] } {
  const config = context.request.formatConfig as Extract<WorkoutGenerationRequest['formatConfig'], { format: 'tabata' }>
  const mainPool = buildMainPool(context)
  const tabataBase = context.request.advanced.preferBalancedMuscleSplit
    ? applyBalance(mainPool, Math.min(4, mainPool.length), context.request, context.random)
    : selectExercises(mainPool, Math.min(4, mainPool.length), context.random, context.request.advanced.allowExerciseRepeats)

  const summary: WorkoutStep[] = []
  const playback: ExerciseSeed[] = []

  for (let setIndex = 1; setIndex <= config.rounds; setIndex += 1) {
    const exercise = tabataBase[(setIndex - 1) % tabataBase.length]
    if (!exercise) {
      continue
    }

    summary.push(
      createMarkerStep('main', summary.length + 1, 'tabata_set', `Tabata Set ${setIndex}`, {
        description: '20s work / 10s recovery',
        setIndex,
        totalSets: config.rounds,
      }),
    )
    summary.push(
      createExerciseStep(
        {
          exerciseId: exercise.id,
          name: exercise.name,
          primaryMuscle: exercise.primaryMuscle,
          workSeconds: 20,
          restSeconds: 10,
          noRestAfter: setIndex === config.rounds,
          setIndex,
          totalSets: config.rounds,
        },
        'main',
        summary.length + 1,
      ),
    )

    playback.push({
      exerciseId: exercise.id,
      name: exercise.name,
      primaryMuscle: exercise.primaryMuscle,
      workSeconds: 20,
      restSeconds: setIndex === config.rounds ? 0 : 10,
      noRestAfter: setIndex === config.rounds,
      setIndex,
      totalSets: config.rounds,
    })
  }

  return { summary, playback }
}

function buildPyramidMain(context: BuildContext): { summary: WorkoutStep[]; playback: ExerciseSeed[] } {
  const config = context.request.formatConfig as Extract<WorkoutGenerationRequest['formatConfig'], { format: 'pyramid' }>
  const mainPool = buildMainPool(context)
  const needed = config.levels * PYRAMID_EXERCISES_PER_LEVEL
  const baseExercises = context.request.advanced.preferBalancedMuscleSplit
    ? applyBalance(mainPool, needed, context.request, context.random)
    : selectExercises(mainPool, needed, context.random, context.request.advanced.allowExerciseRepeats)

  const summary: WorkoutStep[] = []
  const playback: ExerciseSeed[] = []

  for (let levelIndex = 1; levelIndex <= config.levels; levelIndex += 1) {
    summary.push(
      createMarkerStep('main', summary.length + 1, 'pyramid_level', `Pyramid Level ${levelIndex}`, {
        description: `Intensity level ${levelIndex} of ${config.levels}`,
        levelIndex,
        totalLevels: config.levels,
      }),
    )

    for (let exerciseOffset = 0; exerciseOffset < PYRAMID_EXERCISES_PER_LEVEL; exerciseOffset += 1) {
      const poolIndex = (levelIndex - 1) * PYRAMID_EXERCISES_PER_LEVEL + exerciseOffset
      const exercise = baseExercises[poolIndex % baseExercises.length]
      if (!exercise) {
        continue
      }

      const noRestAfter =
        levelIndex === config.levels &&
        exerciseOffset === PYRAMID_EXERCISES_PER_LEVEL - 1

      const seed: ExerciseSeed = {
        exerciseId: exercise.id,
        name: exercise.name,
        primaryMuscle: exercise.primaryMuscle,
        workSeconds: context.request.timing.workSeconds + levelIndex * 5,
        restSeconds: noRestAfter ? 0 : context.request.timing.restSeconds,
        noRestAfter,
        levelIndex,
        totalLevels: config.levels,
      }

      summary.push(createExerciseStep(seed, 'main', summary.length + 1))
      playback.push(seed)
    }
  }

  return { summary, playback }
}

function createBlock(
  type: WorkoutBlockType,
  title: string,
  summary: string,
  steps: WorkoutStep[],
): WorkoutBlock {
  return {
    id: `${type}-block`,
    type,
    title,
    summary,
    steps,
  }
}

function buildPlaybackPlan(blocks: WorkoutBlock[]): WorkoutPlaybackPlan {
  const steps = blocks.flatMap((block) => block.steps).filter((step): step is WorkoutExerciseStep => step.kind === 'exercise')

  const totalWorkSeconds = steps.reduce((sum, step) => sum + step.workSeconds, 0)
  const totalRestSeconds = steps.reduce((sum, step) => sum + step.restSeconds, 0)

  return {
    steps,
    totalWorkSeconds,
    totalRestSeconds,
    totalDurationSeconds: totalWorkSeconds + totalRestSeconds,
  }
}

function createMetadata(request: WorkoutGenerationRequest, playback: WorkoutPlaybackPlan) {
  const prettyFormat = request.format.charAt(0).toUpperCase() + request.format.slice(1)
  return {
    title: `${prettyFormat} ${request.goal.replace(/_/g, ' ')} workout`,
    format: request.format,
    estimatedMinutes: Math.max(1, Math.round(playback.totalDurationSeconds / 60)),
    level: request.level,
    selectedEquipment: request.selectedEquipment,
    goal: request.goal,
    totalSteps: playback.steps.length,
    totalExerciseSteps: playback.steps.length,
  }
}

export function generateWorkout(
  request: WorkoutGenerationRequest,
  catalog: ExerciseDefinition[],
  options: WorkoutGeneratorOptions = {},
): GeneratedWorkout {
  const now = options.now ?? (() => new Date())
  const random = options.random ?? Math.random
  const warnings: string[] = []
  const context: BuildContext = { request, catalog, random, warnings }

  const warmupSeeds = buildWarmupSeeds(context)
  const cooldownSeeds = buildCooldownSeeds(context)

  const warmupBlock = createBlock(
    'warmup',
    'Warm-up',
    `${warmupSeeds.length} prep exercises`,
    warmupSeeds.map((seed, index) => createExerciseStep(seed, 'warmup', index + 1)),
  )

  let mainBlock: WorkoutBlock
  let playbackMainSeeds: ExerciseSeed[]

  switch (request.format) {
    case 'circuit': {
      const circuit = buildCircuitMain(context)
      playbackMainSeeds = circuit.playback
      mainBlock = createBlock('main', 'Main', 'Preview one round, then repeat in the player.', circuit.summary)
      break
    }
    case 'tabata': {
      const tabata = buildTabataMain(context)
      playbackMainSeeds = tabata.playback
      mainBlock = createBlock('main', 'Main', 'Tabata intervals are locked to 20s work / 10s rest.', tabata.summary)
      break
    }
    case 'pyramid': {
      const pyramid = buildPyramidMain(context)
      playbackMainSeeds = pyramid.playback
      mainBlock = createBlock('main', 'Main', 'Intensity ramps up level by level.', pyramid.summary)
      break
    }
    default:
      playbackMainSeeds = buildStandardMainSeeds(context)
      mainBlock = createBlock(
        'main',
        'Main',
        `${playbackMainSeeds.length} main exercises tuned for ${request.goal.replace(/_/g, ' ')} balance.`,
        playbackMainSeeds.map((seed, index) => createExerciseStep(seed, 'main', index + 1)),
      )
      break
  }

  const cooldownBlock = createBlock(
    'cooldown',
    'Cool-down',
    `${cooldownSeeds.length} reset exercises`,
    cooldownSeeds.map((seed, index) => createExerciseStep(seed, 'cooldown', index + 1)),
  )

  const playbackBlocks = [
    createBlock('warmup', 'Warm-up', warmupBlock.summary, warmupSeeds.map((seed, index) => createExerciseStep(seed, 'warmup', index + 1))),
    createBlock('main', 'Main', mainBlock.summary, playbackMainSeeds.map((seed, index) => createExerciseStep(seed, 'main', index + 1))),
    createBlock('cooldown', 'Cool-down', cooldownBlock.summary, cooldownSeeds.map((seed, index) => createExerciseStep(seed, 'cooldown', index + 1))),
  ]

  const playback = buildPlaybackPlan(playbackBlocks)
  const createdAt = now().toISOString()

  return {
    id: `workout-${createdAt}`,
    createdAt,
    sourceRequest: request,
    metadata: createMetadata(request, playback),
    blocks: [warmupBlock, mainBlock, cooldownBlock],
    playback,
    diagnostics: {
      generatorVersion: GENERATOR_VERSION,
      warnings,
      notes: [
        'Goal-aware balancing now uses movement pattern + body region coverage instead of only primary muscle.',
        'Body-map metadata is inferred for every exercise and supplemented where the legacy dataset was thin.',
      ],
    },
  }
}
