export type PlayerPhase = 'idle' | 'ready' | 'work' | 'rest' | 'paused' | 'completed'

export interface PlayerPreferences {
  soundEnabled: boolean
  vibrationEnabled: boolean
  voiceCountdownEnabled: boolean
}

export interface PlayerState {
  phase: PlayerPhase
  currentStepIndex: number
  totalSteps: number
  remainingSeconds: number
  preferences: PlayerPreferences
}
