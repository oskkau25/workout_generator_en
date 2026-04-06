import type { ExerciseDefinition } from '@/domain/exercises/exercise-types'
import catalogJson from '@/data/exercises.json'

export const legacyExerciseCatalog = catalogJson as ExerciseDefinition[]
