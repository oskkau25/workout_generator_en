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

function createPhaseTimer(
  phase: PlayerActivePhase,
  totalSeconds: number,
  elapsedSeconds: number,
): PlayerTimerState {
  return {
    phase,
    previousPhase: phase,
    remainingSeconds: totalSeconds,
    phaseTotalSeconds: totalSeconds,
    elapsedSeconds,
  }
}

function getWorkPhaseTimer(step: WorkoutExerciseStep, elapsedSeconds: number): PlayerTimerState {
  return createPhaseTimer('work', step.workSeconds, elapsedSeconds)
}

function getReadyTimer(step: WorkoutExerciseStep | null, elapsedSeconds: number): PlayerTimerState {
  return createPhaseTimer('ready', step?.workSeconds ?? 0, elapsedSeconds)
}

function getRestTimer(step: WorkoutExerciseStep, elapsedSeconds: number): PlayerTimerState {
  return createPhaseTimer('rest', step.restSeconds, elapsedSeconds)
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

function activateSession(session: ActiveWorkoutSession | null, now?: string) {
  if (!session) {
    return null
  }

  return {
    ...session,
    startedAt: session.startedAt ?? now ?? session.lastUpdatedAt,
    status: 'active' as const,
    lastUpdatedAt: now ?? session.lastUpdatedAt,
  }
}

function completedStepIds(workout: GeneratedWorkout | null, currentStepIndex: number): string[] {
  if (!workout) {
    return []
  }

  return workout.playback.steps.slice(0, currentStepIndex).map((step) => step.id)
}

function moveToStep(state: PlayerState, stepIndex: number, phase: PlayerActivePhase = 'ready', now?: string): PlayerState {
  const step = getStep(state.workout, stepIndex)

  if (!step) {
    return completePlayerState(state, now)
  }

  const elapsedSeconds = state.timer.elapsedSeconds
  const timer =
    phase === 'work'
      ? getWorkPhaseTimer(step, elapsedSeconds)
      : phase === 'rest'
        ? getRestTimer(step, elapsedSeconds)
        : getReadyTimer(step, elapsedSeconds)

  return {
    ...state,
    timer,
    progress: {
      currentStepIndex: stepIndex,
      totalSteps: state.workout?.playback.steps.length ?? 0,
      completedStepIds: completedStepIds(state.workout, stepIndex),
    },
    session: phase === 'ready' ? state.session : activateSession(state.session, now),
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
    session: touchSession(activateSession(state.session, now), 'completed', now),
  }
}

function advanceAfterWork(state: PlayerState, now?: string): PlayerState {
  const currentStep = getStep(state.workout, state.progress.currentStepIndex)
  if (!currentStep) {
    return completePlayerState(state, now)
  }

  if (currentStep.restSeconds > 0 && !currentStep.noRestAfter) {
    return {
      ...state,
      timer: getRestTimer(currentStep, state.timer.elapsedSeconds),
      session: activateSession(state.session, now),
    }
  }

  return moveToStep(state, state.progress.currentStepIndex + 1, 'work', now)
}

function advanceAfterRest(state: PlayerState, now?: string): PlayerState {
  return moveToStep(state, state.progress.currentStepIndex + 1, 'work', now)
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
          startedAt: null,
          lastUpdatedAt: now,
          status: 'paused',
          playbackStepIds: action.workout.playback.steps.map((playbackStep) => playbackStep.id),
        },
        timer: step ? getReadyTimer(step, 0) : { ...IDLE_TIMER, phase: 'completed' },
        progress: {
          currentStepIndex: step ? stepIndex : action.workout.playback.steps.length,
          totalSteps: action.workout.playback.steps.length,
          completedStepIds: completedStepIds(action.workout, stepIndex),
        },
      }
    }

    case 'START':
      return state.timer.phase === 'ready' ? moveToStep(state, state.progress.currentStepIndex, 'work', action.now) : state

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
          session: activateSession(state.session),
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
            session: touchSession(activateSession(state.session), 'paused'),
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
            session: activateSession(state.session),
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
        session:
          state.session?.startedAt != null
            ? touchSession(state.session, state.timer.phase === 'completed' ? 'completed' : 'abandoned', action.now)
            : state.session,
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
