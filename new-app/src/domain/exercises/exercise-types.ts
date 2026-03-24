import type { EquipmentId, FitnessLevel } from '@/domain/builder/builder-types'

export type ExercisePhaseTag = 'warmup' | 'main' | 'cooldown'

export type MuscleGroup =
  | 'full_body'
  | 'chest'
  | 'back'
  | 'legs'
  | 'arms'
  | 'shoulders'
  | 'core'
  | 'mobility'

export interface ExerciseDefinition {
  id: string
  slug: string
  name: string
  phaseTags: ExercisePhaseTag[]
  primaryMuscle: MuscleGroup
  secondaryMuscles: MuscleGroup[]
  supportedEquipment: EquipmentId[]
  supportedLevels: FitnessLevel[]
  coaching: {
    shortInstruction: string
    fullInstruction: string
    safetyNotes?: string[]
  }
  media?: {
    imageUrl?: string
    videoId?: string
    videoSearchQuery?: string
  }
  substitutionTags: string[]
}
