import type { WorkoutGoal } from '@/domain/builder/builder-types'
import type { ExerciseDefinition, MovementPattern, BodyRegionId, MuscleGroup } from '@/domain/exercises/exercise-types'

export const BODY_REGION_LABELS: Record<BodyRegionId, string> = {
  shoulders: 'Shoulders',
  chest: 'Chest',
  upper_back: 'Upper back',
  lats: 'Lats',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  core: 'Abs',
  obliques: 'Obliques',
  lower_back: 'Lower back',
  glutes: 'Glutes',
  quadriceps: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
  hip_flexors: 'Hip flexors',
  adductors: 'Inner thighs',
}

export function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function formatBodyRegionList(regions: BodyRegionId[]) {
  const unique = Array.from(new Set(regions))
  return unique.map((region) => BODY_REGION_LABELS[region]).join(', ')
}

export function getMovementPatternLabel(pattern: MovementPattern) {
  return titleCase(pattern)
}

export type MovementIconCategory =
  | 'squat'
  | 'hinge'
  | 'push'
  | 'pull'
  | 'plank'
  | 'lunge'
  | 'rotation'
  | 'jump'
  | 'carry'
  | 'mobility_stretch'
  | 'floor_core'
  | 'general'

export function getMovementCategoryFromPattern(pattern: MovementPattern): MovementIconCategory {
  switch (pattern) {
    case 'squat':
      return 'squat'
    case 'hinge':
      return 'hinge'
    case 'horizontal_push':
    case 'vertical_push':
      return 'push'
    case 'horizontal_pull':
    case 'vertical_pull':
      return 'pull'
    case 'lunge':
      return 'lunge'
    case 'core_rotation':
      return 'rotation'
    case 'plyometric':
      return 'jump'
    case 'carry':
      return 'carry'
    case 'mobility':
      return 'mobility_stretch'
    case 'core_flexion':
      return 'floor_core'
    case 'core_stability':
      return 'plank'
    default:
      return 'general'
  }
}

export function getGoalBiasScore(exercise: ExerciseDefinition, goal: WorkoutGoal) {
  const muscle = exercise.primaryMuscle
  const pattern = exercise.movementPattern
  const primaryRegions = exercise.bodyMap.primary

  switch (goal) {
    case 'upper_body':
      return (
        (muscle === 'chest' || muscle === 'back' || muscle === 'shoulders' || muscle === 'arms' ? 8 : 0) +
        (pattern === 'horizontal_push' || pattern === 'vertical_push' || pattern === 'horizontal_pull' || pattern === 'vertical_pull' ? 6 : 0) +
        (primaryRegions.some((region) => ['shoulders', 'chest', 'upper_back', 'lats', 'biceps', 'triceps', 'forearms'].includes(region)) ? 4 : 0)
      )
    case 'lower_body':
      return (
        (muscle === 'legs' ? 8 : 0) +
        (pattern === 'squat' || pattern === 'hinge' || pattern === 'lunge' || pattern === 'carry' ? 6 : 0) +
        (primaryRegions.some((region) => ['glutes', 'quadriceps', 'hamstrings', 'calves', 'adductors', 'hip_flexors'].includes(region)) ? 4 : 0)
      )
    case 'core':
      return (
        (muscle === 'core' ? 8 : 0) +
        (pattern === 'core_flexion' || pattern === 'core_stability' || pattern === 'core_rotation' ? 8 : 0) +
        (primaryRegions.some((region) => ['core', 'obliques', 'lower_back'].includes(region)) ? 4 : 0)
      )
    case 'mobility':
      return (
        (muscle === 'mobility' ? 8 : 0) +
        (pattern === 'mobility' ? 10 : 0)
      )
    case 'conditioning':
      return (
        (muscle === 'full_body' ? 6 : 0) +
        (pattern === 'plyometric' || pattern === 'carry' || pattern === 'squat' || pattern === 'lunge' ? 6 : 0)
      )
    default:
      return (
        (muscle === 'full_body' ? 4 : 0) +
        (['squat', 'hinge', 'horizontal_push', 'horizontal_pull', 'core_stability', 'lunge'].includes(pattern) ? 4 : 0)
      )
  }
}

export function getBalanceBucket(exercise: ExerciseDefinition, goal: WorkoutGoal) {
  if (goal === 'upper_body') {
    if (exercise.movementPattern === 'horizontal_push' || exercise.movementPattern === 'vertical_push') return 'upper_push'
    if (exercise.movementPattern === 'horizontal_pull' || exercise.movementPattern === 'vertical_pull') return 'upper_pull'
    if (exercise.primaryMuscle === 'arms' || exercise.primaryMuscle === 'shoulders') return 'upper_accessory'
  }

  if (goal === 'lower_body') {
    if (exercise.movementPattern === 'squat') return 'lower_squat'
    if (exercise.movementPattern === 'hinge') return 'lower_hinge'
    if (exercise.movementPattern === 'lunge') return 'lower_single_leg'
  }

  if (goal === 'core') {
    if (exercise.movementPattern === 'core_stability') return 'core_stability'
    if (exercise.movementPattern === 'core_rotation') return 'core_rotation'
    if (exercise.movementPattern === 'core_flexion') return 'core_flexion'
  }

  return `${exercise.primaryMuscle}:${exercise.movementPattern}`
}

export function collectMuscleCoverage(exercises: ExerciseDefinition[]) {
  return exercises.reduce<Record<MuscleGroup, number>>((accumulator, exercise) => {
    accumulator[exercise.primaryMuscle] += 1
    return accumulator
  }, {
    full_body: 0,
    chest: 0,
    back: 0,
    legs: 0,
    arms: 0,
    shoulders: 0,
    core: 0,
    mobility: 0,
  })
}
