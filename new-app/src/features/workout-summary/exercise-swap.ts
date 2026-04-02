import type { WorkoutGenerationRequest } from '@/domain/builder/builder-types'
import type { ExerciseDefinition } from '@/domain/exercises/exercise-types'
import { getGoalBiasScore } from '@/domain/exercises/exercise-taxonomy'
import type { WorkoutBlockType } from '@/domain/workouts/workout-types'

function normalizeKey(value: string) {
  return value.trim().toLowerCase()
}

function getSectionBlockType(sectionId: string, sectionTitle: string, sectionEyebrow: string): WorkoutBlockType {
  const merged = `${sectionId} ${sectionTitle} ${sectionEyebrow}`.toLowerCase()

  if (merged.includes('warm')) {
    return 'warmup'
  }

  if (merged.includes('cool')) {
    return 'cooldown'
  }

  return 'main'
}

function createLookup(catalog: ExerciseDefinition[]) {
  return new Map(catalog.map((exercise) => [normalizeKey(exercise.name), exercise]))
}

function getEquipmentScore(candidate: ExerciseDefinition, request: WorkoutGenerationRequest) {
  if (request.selectedEquipment.length === 0) {
    return candidate.supportedEquipment.includes('bodyweight') ? 2 : 0
  }

  return candidate.supportedEquipment.some((equipment) => request.selectedEquipment.includes(equipment)) ? 4 : 0
}

function scoreCandidate(
  candidate: ExerciseDefinition,
  current: ExerciseDefinition | null,
  request: WorkoutGenerationRequest,
  blockType: WorkoutBlockType,
) {
  let score = 0

  if (candidate.phaseTags.includes(blockType)) {
    score += 6
  }

  score += getEquipmentScore(candidate, request)
  score += getGoalBiasScore(candidate, request.goal)

  if (candidate.supportedLevels.includes(request.level)) {
    score += 4
  }

  if (current && candidate.primaryMuscle === current.primaryMuscle) {
    score += 3
  }

  if (current && candidate.movementPattern === current.movementPattern) {
    score += 4
  }

  if (current && candidate.bodyMap.primary.some((region) => current.bodyMap.primary.includes(region))) {
    score += 3
  }

  if (current && candidate.substitutionTags.some((tag) => current.substitutionTags.includes(tag))) {
    score += 2
  }

  return score
}

export function pickReplacementExercise(
  currentExerciseName: string,
  sectionId: string,
  sectionTitle: string,
  sectionEyebrow: string,
  request: WorkoutGenerationRequest,
  catalog: ExerciseDefinition[],
) {
  const lookup = createLookup(catalog)
  const current = lookup.get(normalizeKey(currentExerciseName)) ?? null
  const blockType = getSectionBlockType(sectionId, sectionTitle, sectionEyebrow)

  const pool = catalog.filter((exercise) => exercise.id !== current?.id && exercise.phaseTags.includes(blockType))
  const fallbackPool = pool.length > 0 ? pool : catalog.filter((exercise) => exercise.id !== current?.id)

  const ranked = fallbackPool
    .map((exercise) => ({
      exercise,
      score: scoreCandidate(exercise, current, request, blockType),
    }))
    .sort((left, right) => right.score - left.score || left.exercise.name.localeCompare(right.exercise.name))

  return ranked[0]?.exercise ?? null
}
