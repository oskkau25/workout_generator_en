import type {
  EquipmentId,
  FitnessLevel,
  WorkoutGenerationRequest,
  WorkoutGoal,
} from '@/domain/builder/builder-types'

export type WorkoutBlockType = 'warmup' | 'main' | 'cooldown'
export type WorkoutFormat = WorkoutGenerationRequest['format']

export type WorkoutStepKind = 'exercise' | 'format_marker' | 'transition'

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

export interface WorkoutExerciseStep {
  kind: 'exercise'
  id: string
  exerciseId: string
  block: WorkoutBlockType
  order: number
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

export interface WorkoutFormatMarkerStep {
  kind: 'format_marker'
  id: string
  block: WorkoutBlockType
  order: number
  markerType: 'circuit_start' | 'tabata_set' | 'pyramid_level'
  label: string
  description?: string
  roundIndex?: number
  totalRounds?: number
  setIndex?: number
  totalSets?: number
  levelIndex?: number
  totalLevels?: number
}

export interface WorkoutTransitionStep {
  kind: 'transition'
  id: string
  block: WorkoutBlockType
  order: number
  transitionType: 'prepare' | 'finish'
  label: string
}

export type WorkoutStep = WorkoutExerciseStep | WorkoutFormatMarkerStep | WorkoutTransitionStep

export interface WorkoutBlock {
  id: string
  type: WorkoutBlockType
  title: string
  summary: string
  steps: WorkoutStep[]
}

export interface WorkoutPlaybackPlan {
  steps: WorkoutExerciseStep[]
  totalWorkSeconds: number
  totalRestSeconds: number
  totalDurationSeconds: number
}

export interface GeneratedWorkout {
  id: string
  createdAt: string
  sourceRequest: WorkoutGenerationRequest
  metadata: WorkoutPlanMetadata
  blocks: WorkoutBlock[]
  playback: WorkoutPlaybackPlan
  diagnostics?: {
    generatorVersion: string
    warnings: string[]
    notes: string[]
  }
}
