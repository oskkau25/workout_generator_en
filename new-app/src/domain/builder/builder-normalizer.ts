import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import type {
  BuilderAdvancedOptionsDraft,
  BuilderDraft,
  CircuitFormatConfig,
  EquipmentId,
  PyramidFormatConfig,
  TabataFormatConfig,
  WorkoutGenerationRequest,
} from '@/domain/builder/builder-types'

const DEFAULTS = createDefaultBuilderDraft()

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function normalizeAdvancedOptions(
  advanced?: Partial<BuilderAdvancedOptionsDraft>,
): BuilderAdvancedOptionsDraft {
  return {
    includeWarmup: advanced?.includeWarmup ?? DEFAULTS.advanced.includeWarmup,
    includeCooldown: advanced?.includeCooldown ?? DEFAULTS.advanced.includeCooldown,
    allowExerciseRepeats: advanced?.allowExerciseRepeats ?? DEFAULTS.advanced.allowExerciseRepeats,
    preferBalancedMuscleSplit:
      advanced?.preferBalancedMuscleSplit ?? DEFAULTS.advanced.preferBalancedMuscleSplit,
    targetIntensity: advanced?.targetIntensity
      ? clamp(advanced.targetIntensity, 1, 5) as 1 | 2 | 3 | 4 | 5
      : DEFAULTS.advanced.targetIntensity,
  }
}

function normalizeCircuitConfig(config?: CircuitFormatConfig) {
  return {
    format: 'circuit' as const,
    rounds: clamp(config?.rounds ?? DEFAULTS.formatConfig.circuit?.rounds ?? 3, 2, 8),
    exercisesPerRound: clamp(
      config?.exercisesPerRound ?? DEFAULTS.formatConfig.circuit?.exercisesPerRound ?? 5,
      3,
      10,
    ),
    roundRestSeconds: clamp(
      config?.roundRestSeconds ?? DEFAULTS.formatConfig.circuit?.roundRestSeconds ?? 60,
      5,
      180,
    ),
  }
}

function normalizeTabataConfig(config?: TabataFormatConfig) {
  return {
    format: 'tabata' as const,
    rounds: clamp(config?.rounds ?? DEFAULTS.formatConfig.tabata?.rounds ?? 8, 4, 12),
    intervalSeconds: 20 as const,
    recoverySeconds: 10 as const,
  }
}

function normalizePyramidConfig(config?: PyramidFormatConfig) {
  return {
    format: 'pyramid' as const,
    levels: clamp(config?.levels ?? DEFAULTS.formatConfig.pyramid?.levels ?? 5, 3, 7),
  }
}

export function normalizeBuilderDraft(draft: BuilderDraft): WorkoutGenerationRequest {
  const selectedEquipment = Array.from(new Set(draft.selectedEquipment.filter(Boolean))) as EquipmentId[]
  const normalizedEquipment: EquipmentId[] =
    selectedEquipment.length > 0 ? selectedEquipment : ['bodyweight']
  const advanced = normalizeAdvancedOptions(draft.advanced)

  const targetMinutes = draft.duration.targetMinutes
  const workSeconds = clamp(draft.timing.workSeconds ?? DEFAULTS.timing.workSeconds ?? 40, 10, 300)
  const restSeconds = clamp(draft.timing.restSeconds ?? DEFAULTS.timing.restSeconds ?? 20, 5, 180)

  switch (draft.format) {
    case 'circuit':
      return {
        goal: draft.goal,
        level: draft.level,
        targetMinutes,
        format: draft.format,
        selectedEquipment: normalizedEquipment,
        timing: { workSeconds, restSeconds },
        formatConfig: normalizeCircuitConfig(draft.formatConfig.circuit),
        advanced,
      }
    case 'tabata':
      return {
        goal: draft.goal,
        level: draft.level,
        targetMinutes,
        format: draft.format,
        selectedEquipment: normalizedEquipment,
        timing: { workSeconds: 20, restSeconds: 10 },
        formatConfig: normalizeTabataConfig(draft.formatConfig.tabata),
        advanced,
      }
    case 'pyramid':
      return {
        goal: draft.goal,
        level: draft.level,
        targetMinutes,
        format: draft.format,
        selectedEquipment: normalizedEquipment,
        timing: { workSeconds, restSeconds },
        formatConfig: normalizePyramidConfig(draft.formatConfig.pyramid),
        advanced,
      }
    default:
      return {
        goal: draft.goal,
        level: draft.level,
        targetMinutes,
        format: 'standard',
        selectedEquipment: normalizedEquipment,
        timing: { workSeconds, restSeconds },
        formatConfig: { format: 'standard' },
        advanced,
      }
  }
}
