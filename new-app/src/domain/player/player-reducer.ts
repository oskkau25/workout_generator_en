import type { GeneratedWorkout, WorkoutExerciseStep } from '@/domain/workouts/workout-types'
import type {
  ActiveWorkoutSession,
  PlayerAction,
  PlayerActivePhase,
  PlayerPreferences,
  PlayerProgressState,
  PlayerState,
  PlayerTimerState,
} from '@/domain/player/player-types'

const DEFAULT_PREFERENCES: PlayerPreferences = {
  soundEnabled: true,
  vibrationEnabled: true,
  voiceCountdownEnabled: false,
}

const IDLE_TIMER: PlayerTimerState = {
  phase: 'idle',
  previousPhase: null,
  remainingSeconds: 0,
  phaseTotalSeconds: 0,
  elapsedSeconds: 0,
}

const IDLE_PROGRESS: PlayerProgressState = {
  currentStepIndex: 0,
  totalSteps: 0,
  completedStepIds: [],
}

export function createInitialPlayerState(
  preferences: Partial<PlayerPreferences> = {},
): PlayerState {
  return {
    workout: null,
    session: null,
    timer: { ...IDLE_TIMER },
    progress: { ...IDLE_PROGRESS },
    preferences: { ...DEFAULT_PREFERENCES, ...preferences },
  }
}

function getStep(workout: GeneratedWorkout | null, stepIndex: number): WorkoutExerciseStep | null {
  if (!workout) {
    return null
  }

  return workout.playback.steps[stepIndex] ?? null
}

function getWorkPhaseTimer(step: WorkoutExerciseStep): PlayerTimerState {
  return {
    phase: 'work',
    previousPhase: 'work',
    remainingSeconds: step.workSeconds,
    phaseTotalSeconds: step.workSeconds,
    elapsedSeconds: 0,
  }
}

function getReadyTimer(step: WorkoutExerciseStep | null): PlayerTimerState {
  return {
    phase: 'ready',
    previousPhase: 'ready',
    remainingSeconds: step?.workSeconds ?? 0,
    phaseTotalSeconds: step?.workSeconds ?? 0,
    elapsedSeconds: 0,
  }
}

function getRestTimer(step: WorkoutExerciseStep): PlayerTimerState {
  return {
    phase: 'rest',
    previousPhase: 'rest',
    remainingSeconds: step.restSeconds,
    phaseTotalSeconds: step.restSeconds,
    elapsedSeconds: 0,
  }
}

function touchSession(session: ActiveWorkoutSession | null, status: ActiveWorkoutSession['status'], now?: string) {
  if (!session) {
    return null
  }

  return {
    ...session,
    status,
    lastUpdatedAt: now ?? session.lastUpdatedAt,
  }
}

function completedStepIds(workout: GeneratedWorkout | null, currentStepIndex: number): string[] {
  if (!workout) {
    return []
  }

  return workout.playback.steps.slice(0, currentStepIndex).map((step) => step.id)
}

function moveToStep(state: PlayerState, stepIndex: number, phase: PlayerActivePhase = 'ready'): PlayerState {
  const step = getStep(state.workout, stepIndex)

  if (!step) {
    return completePlayerState(state)
  }

  const timer =
    phase === 'work'
      ? getWorkPhaseTimer(step)
      : phase === 'rest'
        ? getRestTimer(step)
        : getReadyTimer(step)

  return {
    ...state,
    timer,
    progress: {
      currentStepIndex: stepIndex,
      totalSteps: state.workout?.playback.steps.length ?? 0,
      completedStepIds: completedStepIds(state.workout, stepIndex),
    },
    session: touchSession(state.session, 'active'),
  }
}

function completePlayerState(state: PlayerState, now?: string): PlayerState {
  const totalSteps = state.workout?.playback.steps.length ?? 0
  return {
    ...state,
    timer: {
      phase: 'completed',
      previousPhase: null,
      remainingSeconds: 0,
      phaseTotalSeconds: 0,
      elapsedSeconds: state.timer.elapsedSeconds,
    },
    progress: {
      currentStepIndex: totalSteps,
      totalSteps,
      completedStepIds: state.workout?.playback.steps.map((step) => step.id) ?? [],
    },
    session: touchSession(state.session, 'completed', now),
  }
}

function advanceAfterWork(state: PlayerState): PlayerState {
  const currentStep = getStep(state.workout, state.progress.currentStepIndex)
  if (!currentStep) {
    return completePlayerState(state)
  }

  if (currentStep.restSeconds > 0 && !currentStep.noRestAfter) {
    return {
      ...state,
      timer: getRestTimer(currentStep),
      session: touchSession(state.session, 'active'),
    }
  }

  return moveToStep(state, state.progress.currentStepIndex + 1, 'work')
}

function advanceAfterRest(state: PlayerState): PlayerState {
  return moveToStep(state, state.progress.currentStepIndex + 1, 'work')
}

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'HYDRATE_STATE':
      return {
        ...action.playerState,
        preferences: {
          ...DEFAULT_PREFERENCES,
          ...action.playerState.preferences,
        },
      }

    case 'LOAD_WORKOUT': {
      const stepIndex = Math.max(0, Math.min(action.resumeFromStepIndex ?? 0, action.workout.playback.steps.length))
      const step = action.workout.playback.steps[stepIndex] ?? null
      const now = action.now ?? action.workout.createdAt

      return {
        ...createInitialPlayerState(state.preferences),
        workout: action.workout,
        session: {
          sessionId: action.sessionId ?? `session-${action.workout.id}`,
          workoutId: action.workout.id,
          startedAt: now,
          lastUpdatedAt: now,
          status: 'active',
          playbackStepIds: action.workout.playback.steps.map((playbackStep) => playbackStep.id),
        },
        timer: step ? getReadyTimer(step) : { ...IDLE_TIMER, phase: 'completed' },
        progress: {
          currentStepIndex: step ? stepIndex : action.workout.playback.steps.length,
          totalSteps: action.workout.playback.steps.length,
          completedStepIds: completedStepIds(action.workout, stepIndex),
        },
      }
    }

    case 'START':
      return state.timer.phase === 'ready' ? moveToStep(state, state.progress.currentStepIndex, 'work') : state

    case 'TICK': {
      if (state.timer.phase !== 'work' && state.timer.phase !== 'rest') {
        return state
      }

      const delta = Math.max(1, action.seconds ?? 1)
      const remainingSeconds = state.timer.remainingSeconds - delta
      const elapsedSeconds = state.timer.elapsedSeconds + delta

      if (remainingSeconds > 0) {
        return {
          ...state,
          timer: {
            ...state.timer,
            remainingSeconds,
            elapsedSeconds,
          },
          session: touchSession(state.session, 'active'),
        }
      }

      const overshoot = Math.abs(remainingSeconds)
      const nextState = {
        ...state,
        timer: {
          ...state.timer,
          remainingSeconds: 0,
          elapsedSeconds,
        },
      }

      const advanced = state.timer.phase === 'work' ? advanceAfterWork(nextState) : advanceAfterRest(nextState)
      return overshoot > 0 ? playerReducer(advanced, { type: 'TICK', seconds: overshoot }) : advanced
    }

    case 'PAUSE':
      return state.timer.phase === 'work' || state.timer.phase === 'rest'
        ? {
            ...state,
            timer: {
              ...state.timer,
              phase: 'paused',
              previousPhase: state.timer.phase,
            },
            session: touchSession(state.session, 'paused'),
          }
        : state

    case 'RESUME':
      return state.timer.phase === 'paused' && state.timer.previousPhase
        ? {
            ...state,
            timer: {
              ...state.timer,
              phase: state.timer.previousPhase,
            },
            session: touchSession(state.session, 'active'),
          }
        : state

    case 'NEXT_STEP':
      return moveToStep(state, state.progress.currentStepIndex + 1, 'ready')

    case 'PREVIOUS_STEP':
      return moveToStep(state, Math.max(0, state.progress.currentStepIndex - 1), 'ready')

    case 'SKIP_REST':
      return state.timer.phase === 'rest' ? advanceAfterRest(state) : state

    case 'EXIT':
      return {
        ...state,
        timer: { ...state.timer, phase: 'idle', previousPhase: null, remainingSeconds: 0, phaseTotalSeconds: 0 },
        session: touchSession(state.session, state.timer.phase === 'completed' ? 'completed' : 'abandoned', action.now),
      }

    case 'COMPLETE':
      return completePlayerState(state, action.now)

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.preferences,
        },
      }

    default:
      return state
  }
}
