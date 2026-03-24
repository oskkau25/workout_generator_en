export type WorkoutGoal =
  | 'full_body'
  | 'upper_body'
  | 'lower_body'
  | 'core'
  | 'conditioning'
  | 'mobility'

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export type WorkoutFormat = 'standard' | 'circuit' | 'tabata' | 'pyramid'

export type EquipmentId =
  | 'bodyweight'
  | 'dumbbells'
  | 'kettlebell'
  | 'trx_bands'
  | 'resistance_band'
  | 'pull_up_bar'
  | 'jump_rope'
  | 'rower'

export interface DurationConfig {
  targetMinutes: 15 | 20 | 30 | 45 | 60
}

export interface TimingConfigDraft {
  workSeconds?: number
  restSeconds?: number
}

export interface CircuitFormatConfig {
  rounds?: number
  exercisesPerRound?: number
  roundRestSeconds?: number
}

export interface TabataFormatConfig {
  rounds?: number
}

export interface PyramidFormatConfig {
  levels?: number
}

export interface WorkoutFormatConfigDraft {
  circuit?: CircuitFormatConfig
  tabata?: TabataFormatConfig
  pyramid?: PyramidFormatConfig
}

export interface BuilderAdvancedOptionsDraft {
  includeWarmup: boolean
  includeCooldown: boolean
  allowExerciseRepeats: boolean
  preferBalancedMuscleSplit: boolean
  targetIntensity?: 1 | 2 | 3 | 4 | 5
}

export interface BuilderDraft {
  goal: WorkoutGoal
  level: FitnessLevel
  duration: DurationConfig
  format: WorkoutFormat
  selectedEquipment: EquipmentId[]
  timing: TimingConfigDraft
  formatConfig: WorkoutFormatConfigDraft
  advanced: BuilderAdvancedOptionsDraft
}

export type NormalizedFormatConfig =
  | { format: 'standard' }
  | {
      format: 'circuit'
      rounds: number
      exercisesPerRound: number
      roundRestSeconds: number
    }
  | {
      format: 'tabata'
      rounds: number
      intervalSeconds: 20
      recoverySeconds: 10
    }
  | {
      format: 'pyramid'
      levels: number
    }

export interface WorkoutGenerationRequest {
  goal: WorkoutGoal
  level: FitnessLevel
  targetMinutes: number
  format: WorkoutFormat
  selectedEquipment: EquipmentId[]
  timing: {
    workSeconds: number
    restSeconds: number
  }
  formatConfig: NormalizedFormatConfig
  advanced: BuilderAdvancedOptionsDraft
}
