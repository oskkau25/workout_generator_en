import type { BuilderDraft } from '@/domain/builder/builder-types'

export function createDefaultBuilderDraft(): BuilderDraft {
  return {
    goal: 'full_body',
    level: 'intermediate',
    duration: {
      targetMinutes: 30,
    },
    format: 'standard',
    selectedEquipment: ['bodyweight'],
    timing: {
      workSeconds: 40,
      restSeconds: 20,
    },
    formatConfig: {
      circuit: {
        rounds: 3,
        exercisesPerRound: 5,
        roundRestSeconds: 60,
      },
      tabata: {
        rounds: 8,
      },
      pyramid: {
        levels: 5,
      },
    },
    advanced: {
      includeWarmup: true,
      includeCooldown: true,
      allowExerciseRepeats: false,
      preferBalancedMuscleSplit: true,
      targetIntensity: 3,
    },
  }
}
