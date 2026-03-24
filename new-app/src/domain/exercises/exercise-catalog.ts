import type { EquipmentId, FitnessLevel } from '@/domain/builder/builder-types'
import type { ExerciseDefinition, ExercisePhaseTag, MuscleGroup } from '@/domain/exercises/exercise-types'
// @ts-expect-error legacy JS dataset is intentionally consumed through a thin adapter during migration.
import { exercises as legacyExercises } from '../../../../src/js/core/exercise-database.js'

interface LegacyExercise {
  name: string
  description: string
  equipment?: string
  level?: string | string[]
  muscle?: string
  type?: string
  alternatives?: string[]
  resources?: {
    youtubeSearch?: string
  }
}

const EQUIPMENT_MAP: Record<string, EquipmentId> = {
  bodyweight: 'bodyweight',
  dumbbells: 'dumbbells',
  kettlebell: 'kettlebell',
  'trx bands': 'trx_bands',
  trx: 'trx_bands',
  'resistance band': 'resistance_band',
  'pull-up bar': 'pull_up_bar',
  'jump rope': 'jump_rope',
  rower: 'rower',
}

const MUSCLE_MAP: Record<string, MuscleGroup> = {
  'full body': 'full_body',
  chest: 'chest',
  back: 'back',
  legs: 'legs',
  arms: 'arms',
  shoulders: 'shoulders',
  core: 'core',
  mobility: 'mobility',
}

const LEVEL_MAP: Record<string, FitnessLevel> = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeEquipment(value?: string): EquipmentId[] {
  const mapped = EQUIPMENT_MAP[String(value ?? 'bodyweight').trim().toLowerCase()]
  return mapped ? [mapped] : ['bodyweight']
}

function normalizeMuscle(value?: string): MuscleGroup {
  return MUSCLE_MAP[String(value ?? 'full body').trim().toLowerCase()] ?? 'full_body'
}

function normalizeLevels(value?: string | string[]): FitnessLevel[] {
  const raw = Array.isArray(value) ? value : [value ?? 'beginner']
  const mapped = raw
    .map((entry) => LEVEL_MAP[String(entry).trim().toLowerCase()])
    .filter((entry): entry is FitnessLevel => Boolean(entry))

  return mapped.length > 0 ? mapped : ['beginner', 'intermediate', 'advanced']
}

function normalizePhase(type?: string): ExercisePhaseTag[] {
  switch (String(type ?? 'main').trim().toLowerCase()) {
    case 'warmup':
      return ['warmup']
    case 'cooldown':
      return ['cooldown']
    default:
      return ['main']
  }
}

function createShortInstruction(description: string): string {
  return description.split(/[.!?]/)[0]?.trim() || description.trim()
}

function extractSafetyNotes(description: string): string[] | undefined {
  const matches = description.match(/⚠️\s*DO:(.*?)DON'T:(.*)$/i)
  if (!matches) {
    return undefined
  }

  return matches.slice(1).map((part) => part.trim()).filter(Boolean)
}

export function adaptLegacyExerciseCatalog(input: LegacyExercise[]): ExerciseDefinition[] {
  return input.map((exercise, index) => ({
    id: `legacy-${index}-${slugify(exercise.name)}`,
    slug: slugify(exercise.name),
    name: exercise.name,
    phaseTags: normalizePhase(exercise.type),
    primaryMuscle: normalizeMuscle(exercise.muscle),
    secondaryMuscles: [],
    supportedEquipment: normalizeEquipment(exercise.equipment),
    supportedLevels: normalizeLevels(exercise.level),
    coaching: {
      shortInstruction: createShortInstruction(exercise.description),
      fullInstruction: exercise.description,
      safetyNotes: extractSafetyNotes(exercise.description),
    },
    media: {
      videoSearchQuery: exercise.resources?.youtubeSearch,
    },
    substitutionTags: exercise.alternatives ?? [],
  }))
}

export const legacyExerciseCatalog = adaptLegacyExerciseCatalog(legacyExercises as LegacyExercise[])
