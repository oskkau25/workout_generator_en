import type {
  EquipmentId,
  FitnessLevel,
  WorkoutGenerationRequest,
  WorkoutGoal,
} from '@/domain/builder/builder-types'

export type WorkoutBlockType = 'warmup' | 'main' | 'cooldown'
export type WorkoutFormat = WorkoutGenerationRequest['format']

export interface WorkoutPlanMetadata {
  title: string
  format: WorkoutFormat
  estimatedMinutes: number
  level: FitnessLevel
  selectedEquipment: EquipmentId[]
  goal: WorkoutGoal
  totalSteps: number
  totalExerciseSteps: number
}

export interface GeneratedWorkout {
  id: string
  createdAt: string
  sourceRequest: WorkoutGenerationRequest
  metadata: WorkoutPlanMetadata
}
