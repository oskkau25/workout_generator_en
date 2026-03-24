import type { ExerciseDefinition } from '@/domain/exercises/exercise-types'
import type { GeneratedWorkout, WorkoutBlock, WorkoutStep } from '@/domain/workouts/workout-types'

export interface WorkoutSummaryStat {
  label: string
  value: string
}

export interface WorkoutSummaryIntentItem {
  label: string
  value: string
}

export interface WorkoutSummaryStepViewModel {
  id: string
  kind: WorkoutStep['kind']
  title: string
  detail: string
  meta?: string
  badge?: string
}

export interface WorkoutSummarySectionViewModel {
  id: string
  eyebrow: string
  title: string
  summary: string
  hint?: string
  steps: WorkoutSummaryStepViewModel[]
}

export interface WorkoutSummaryViewModel {
  header: {
    title: string
    subtitle: string
    generatedAtLabel: string
  }
  stats: WorkoutSummaryStat[]
  intent: WorkoutSummaryIntentItem[]
  sections: WorkoutSummarySectionViewModel[]
  diagnostics: string[]
}

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDuration(minutes: number) {
  return `${minutes} min`
}

function formatSeconds(seconds: number) {
  return `${seconds}s`
}

function formatWorkRest(workSeconds: number, restSeconds: number) {
  return restSeconds > 0
    ? `${formatSeconds(workSeconds)} work · ${formatSeconds(restSeconds)} rest`
    : `${formatSeconds(workSeconds)} work`
}

function formatGeneratedAt(createdAt: string) {
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) {
    return 'Generated just now'
  }

  return `Generated ${date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

function createExerciseLookup(catalog: ExerciseDefinition[]) {
  return new Map(catalog.map((exercise) => [exercise.id, exercise]))
}

function buildHeaderSubtitle(workout: GeneratedWorkout) {
  return `${titleCase(workout.metadata.format)} · ${formatDuration(workout.metadata.estimatedMinutes)} · ${titleCase(workout.metadata.level)}`
}

function buildStats(workout: GeneratedWorkout): WorkoutSummaryStat[] {
  return [
    { label: 'Duration', value: formatDuration(workout.metadata.estimatedMinutes) },
    { label: 'Format', value: titleCase(workout.metadata.format) },
    { label: 'Level', value: titleCase(workout.metadata.level) },
    { label: 'Focus', value: titleCase(workout.metadata.goal) },
    {
      label: 'Equipment',
      value:
        workout.metadata.selectedEquipment.length === 0
          ? 'Bodyweight'
          : workout.metadata.selectedEquipment.map(titleCase).join(', '),
    },
    { label: 'Exercises', value: `${workout.metadata.totalExerciseSteps}` },
  ]
}

function buildIntent(workout: GeneratedWorkout): WorkoutSummaryIntentItem[] {
  const request = workout.sourceRequest
  const formatConfig = request.formatConfig
  const items: WorkoutSummaryIntentItem[] = [
    { label: 'Requested format', value: titleCase(request.format) },
    { label: 'Target duration', value: formatDuration(request.targetMinutes) },
    {
      label: 'Equipment asked for',
      value: request.selectedEquipment.length > 0 ? request.selectedEquipment.map(titleCase).join(', ') : 'Bodyweight',
    },
    { label: 'Intensity', value: `${request.advanced.targetIntensity ?? 3}/5` },
    { label: 'Warm-up', value: request.advanced.includeWarmup ? 'Included' : 'Skipped' },
    { label: 'Cool-down', value: request.advanced.includeCooldown ? 'Included' : 'Skipped' },
  ]

  if (formatConfig.format === 'circuit') {
    items.push({
      label: 'Round shape',
      value: `${formatConfig.rounds} rounds × ${formatConfig.exercisesPerRound} exercises`,
    })
  }

  if (formatConfig.format === 'tabata') {
    items.push({
      label: 'Effective timing',
      value: `${formatConfig.rounds} rounds · 20s work / 10s rest`,
    })
  }

  if (formatConfig.format === 'pyramid') {
    items.push({
      label: 'Progression',
      value: `${formatConfig.levels} levels`,
    })
  }

  return items
}

function getStepBadge(step: WorkoutStep) {
  if (step.kind === 'exercise') {
    if (step.roundIndex && step.totalRounds) {
      return `Round ${step.roundIndex}/${step.totalRounds}`
    }

    if (step.setIndex && step.totalSets) {
      return `Set ${step.setIndex}/${step.totalSets}`
    }

    if (step.levelIndex && step.totalLevels) {
      return `Level ${step.levelIndex}/${step.totalLevels}`
    }
  }

  if (step.kind === 'format_marker') {
    if (step.roundIndex && step.totalRounds) {
      return `Rounds ${step.totalRounds}`
    }

    if (step.totalSets) {
      return `${step.totalSets} total sets`
    }

    if (step.totalLevels) {
      return `${step.totalLevels} total levels`
    }
  }

  return undefined
}

function mapExerciseStep(step: Extract<WorkoutStep, { kind: 'exercise' }>, lookup: Map<string, ExerciseDefinition>): WorkoutSummaryStepViewModel {
  const exercise = lookup.get(step.exerciseId)
  const detailParts = [formatWorkRest(step.workSeconds, step.restSeconds)]
  const instruction = exercise?.coaching.shortInstruction ?? 'Follow the guided coaching cues in the player.'
  const metaParts = [exercise?.primaryMuscle ? titleCase(exercise.primaryMuscle) : null].filter(Boolean)

  return {
    id: step.id,
    kind: step.kind,
    title: exercise?.name ?? titleCase(step.exerciseId),
    detail: `${instruction} · ${detailParts.join(' · ')}`,
    meta: metaParts.join(' · ') || undefined,
    badge: getStepBadge(step),
  }
}

function mapMarkerStep(step: Extract<WorkoutStep, { kind: 'format_marker' }>): WorkoutSummaryStepViewModel {
  return {
    id: step.id,
    kind: step.kind,
    title: step.label,
    detail: step.description ?? 'Format structure marker',
    badge: getStepBadge(step),
  }
}

function mapTransitionStep(step: Extract<WorkoutStep, { kind: 'transition' }>): WorkoutSummaryStepViewModel {
  return {
    id: step.id,
    kind: step.kind,
    title: step.label,
    detail: 'Transition',
  }
}

function getSectionHint(block: WorkoutBlock, workout: GeneratedWorkout) {
  if (block.type !== 'main') {
    return undefined
  }

  if (workout.metadata.format === 'circuit' && workout.sourceRequest.formatConfig.format === 'circuit') {
    return `Preview round below. The player will guide you through all ${workout.sourceRequest.formatConfig.rounds} rounds.`
  }

  if (workout.metadata.format === 'tabata' && workout.sourceRequest.formatConfig.format === 'tabata') {
    return `${workout.sourceRequest.formatConfig.rounds} rounds of 20s work / 10s rest.`
  }

  if (workout.metadata.format === 'pyramid' && workout.sourceRequest.formatConfig.format === 'pyramid') {
    return `Progression builds across ${workout.sourceRequest.formatConfig.levels} levels.`
  }

  return undefined
}

function mapSection(block: WorkoutBlock, workout: GeneratedWorkout, lookup: Map<string, ExerciseDefinition>): WorkoutSummarySectionViewModel {
  return {
    id: block.id,
    eyebrow: titleCase(block.type),
    title: block.title,
    summary: block.summary,
    hint: getSectionHint(block, workout),
    steps: block.steps.map((step) => {
      if (step.kind === 'exercise') {
        return mapExerciseStep(step, lookup)
      }

      if (step.kind === 'format_marker') {
        return mapMarkerStep(step)
      }

      return mapTransitionStep(step)
    }),
  }
}

export function mapGeneratedWorkoutToSummaryViewModel(
  workout: GeneratedWorkout,
  catalog: ExerciseDefinition[],
): WorkoutSummaryViewModel {
  const lookup = createExerciseLookup(catalog)

  return {
    header: {
      title: workout.metadata.title,
      subtitle: buildHeaderSubtitle(workout),
      generatedAtLabel: formatGeneratedAt(workout.createdAt),
    },
    stats: buildStats(workout),
    intent: buildIntent(workout),
    sections: workout.blocks.map((block) => mapSection(block, workout, lookup)),
    diagnostics: [...(workout.diagnostics?.warnings ?? []), ...(workout.diagnostics?.notes ?? [])],
  }
}
