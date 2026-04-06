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

export type MovementPattern =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'horizontal_push'
  | 'vertical_push'
  | 'horizontal_pull'
  | 'vertical_pull'
  | 'core_flexion'
  | 'core_stability'
  | 'core_rotation'
  | 'locomotion'
  | 'carry'
  | 'plyometric'
  | 'mobility'

export type BodyRegionId =
  | 'shoulders'
  | 'chest'
  | 'upper_back'
  | 'lats'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'obliques'
  | 'lower_back'
  | 'glutes'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves'
  | 'hip_flexors'
  | 'adductors'

export interface ExerciseDefinition {
  id: string
  slug: string
  name: string
  phaseTags: ExercisePhaseTag[]
  primaryMuscle: MuscleGroup
  secondaryMuscles: MuscleGroup[]
  supportedEquipment: EquipmentId[]
  supportedLevels: FitnessLevel[]
  movementPattern: MovementPattern
  bodyMap: {
    primary: BodyRegionId[]
    secondary: BodyRegionId[]
  }
  focusTags: string[]
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
