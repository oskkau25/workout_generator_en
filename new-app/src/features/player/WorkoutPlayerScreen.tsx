import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { playerReducer, createInitialPlayerState } from '@/domain/player/player-reducer'
import {
  canGoNext,
  canGoPrevious,
  getCurrentStep,
  getNextStep,
  getProgressPercent,
  isRestPhase,
} from '@/domain/player/player-selectors'
import type { PlayerPhase } from '@/domain/player/player-types'
import type { ExerciseDefinition } from '@/domain/exercises/exercise-types'
import type { WorkoutBlockType, WorkoutExerciseStep } from '@/domain/workouts/workout-types'
import { GeneratedWorkoutStore } from '@/services/storage/generated-workout-store'
import { createHistoryEntryFromPlayerState } from '@/services/storage/progress-helpers'
import { preferencesStore } from '@/services/storage/preferences-store'
import { workoutHistoryStore } from '@/services/storage/workout-history-store'
import { workoutSessionStore } from '@/services/storage/workout-session-store'

const PHASE_COPY: Record<Exclude<PlayerPhase, 'idle'>, { label: string; message: string }> = {
  ready: { label: 'Ready', message: 'Get ready to start' },
  work: { label: 'Work', message: 'Push the current move with intent' },
  rest: { label: 'Recover', message: 'Recover, breathe, and set up the next move' },
  paused: { label: 'Paused', message: 'Frozen exactly where you left it' },
  completed: { label: 'Completed', message: 'Workout complete' },
}

const BLOCK_LABELS: Record<WorkoutBlockType, string> = {
  warmup: 'Warm-up',
  main: 'Main block',
  cooldown: 'Cool-down',
}

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatDurationLabel(totalSeconds: number) {
  if (totalSeconds < 60) {
    return `${totalSeconds}s`
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`
}

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase())
}

function createExerciseMap(catalog: ExerciseDefinition[]) {
  return new Map(catalog.map((exercise) => [exercise.id, exercise]))
}

function getExercise(step: WorkoutExerciseStep | null, exerciseMap: Map<string, ExerciseDefinition>) {
  if (!step) {
    return null
  }

  return exerciseMap.get(step.exerciseId) ?? null
}

function getStepContext(step: WorkoutExerciseStep | null) {
  if (!step) {
    return []
  }

  const labels: string[] = [BLOCK_LABELS[step.block]]

  if (typeof step.roundIndex === 'number' && typeof step.totalRounds === 'number') {
    labels.push(`Round ${step.roundIndex} of ${step.totalRounds}`)
  }

  if (typeof step.setIndex === 'number' && typeof step.totalSets === 'number') {
    labels.push(`Interval ${step.setIndex} of ${step.totalSets}`)
  }

  if (typeof step.levelIndex === 'number' && typeof step.totalLevels === 'number') {
    labels.push(`Level ${step.levelIndex} of ${step.totalLevels}`)
  }

  return labels
}

function getNextUpLabel(step: WorkoutExerciseStep | null) {
  if (!step) {
    return 'Final step — completion is next'
  }

  const labels = []
  if (step.workSeconds > 0) {
    labels.push(`Work ${formatDurationLabel(step.workSeconds)}`)
  }
  if (step.restSeconds > 0 && !step.noRestAfter) {
    labels.push(`then ${formatDurationLabel(step.restSeconds)} rest`)
  }

  return labels.join(' • ')
}

export function WorkoutPlayerScreen() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const [playerState, dispatch] = useReducer(playerReducer, undefined, () => createInitialPlayerState())
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const historySavedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function loadPlayer() {
      try {
        const [savedSession, savedPreferences, storedWorkout] = await Promise.all([
          workoutSessionStore.loadActiveSession(),
          preferencesStore.load(),
          GeneratedWorkoutStore.load(),
        ])

        if (cancelled) {
          return
        }

        if (savedPreferences) {
          dispatch({ type: 'UPDATE_PREFERENCES', preferences: savedPreferences })
        }

        if (savedSession && savedSession.workout.id === workoutId) {
          dispatch({ type: 'HYDRATE_STATE', playerState: savedSession.playerState })
          setIsLoading(false)
          return
        }

        if (!storedWorkout || storedWorkout.id !== workoutId) {
          setLoadError('No generated workout found for this player session.')
          setIsLoading(false)
          return
        }

        dispatch({ type: 'LOAD_WORKOUT', workout: storedWorkout.workout })
        setIsLoading(false)
      } catch {
        if (!cancelled) {
          setLoadError('The player could not load the stored workout.')
          setIsLoading(false)
        }
      }
    }

    void loadPlayer()

    return () => {
      cancelled = true
    }
  }, [workoutId])

  useEffect(() => {
    if (playerState.timer.phase !== 'work' && playerState.timer.phase !== 'rest') {
      return
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [playerState.timer.phase])

  useEffect(() => {
    void preferencesStore.save(playerState.preferences)
  }, [playerState.preferences])

  useEffect(() => {
    if (!playerState.workout || !playerState.session) {
      return
    }

    if (playerState.timer.phase === 'idle' || playerState.timer.phase === 'completed') {
      void workoutSessionStore.clearActiveSession()
      return
    }

    void workoutSessionStore.saveActiveSession({
      workout: playerState.workout,
      playerState,
      savedAt: new Date().toISOString(),
    })
  }, [playerState])

  useEffect(() => {
    if (!playerState.workout || playerState.timer.phase !== 'completed' || historySavedRef.current) {
      return
    }

    historySavedRef.current = true
    const completedAt = new Date().toISOString()
    void workoutHistoryStore.append(createHistoryEntryFromPlayerState(playerState, playerState.workout, completedAt))
    void workoutSessionStore.clearActiveSession()
  }, [playerState])

  const exerciseMap = useMemo(() => createExerciseMap(legacyExerciseCatalog), [])
  const currentStep = useMemo(() => getCurrentStep(playerState), [playerState])
  const nextStep = useMemo(() => getNextStep(playerState), [playerState])
  const currentExercise = useMemo(() => getExercise(currentStep, exerciseMap), [currentStep, exerciseMap])
  const nextExercise = useMemo(() => getExercise(nextStep, exerciseMap), [nextStep, exerciseMap])
  const progressPercent = useMemo(() => getProgressPercent(playerState), [playerState])
  const currentStepNumber = Math.min(playerState.progress.currentStepIndex + 1, playerState.progress.totalSteps)
  const phaseKey = playerState.timer.phase === 'idle' ? 'ready' : playerState.timer.phase
  const phaseCopy = PHASE_COPY[phaseKey]
  const pausedDuringRest = isRestPhase(playerState)

  async function handleExit() {
    const phase = playerState.timer.phase
    const active = phase === 'work' || phase === 'rest' || phase === 'paused'
    if (active && !window.confirm('Exit this workout? Your current session will be marked as abandoned.')) {
      return
    }

    if (playerState.workout && playerState.session && !historySavedRef.current) {
      historySavedRef.current = true
      const now = new Date().toISOString()
      const exitedState = playerReducer(playerState, { type: 'EXIT', now })
      await workoutHistoryStore.append(createHistoryEntryFromPlayerState(exitedState, playerState.workout, now))
      await workoutSessionStore.clearActiveSession()
      dispatch({ type: 'EXIT', now })
    } else {
      dispatch({ type: 'EXIT', now: new Date().toISOString() })
    }

    navigate(`/workout/${workoutId}/summary`)
  }

  if (isLoading) {
    return (
      <div className="screen-grid">
        <section className="card">
          <p className="card-eyebrow">Coach flow</p>
          <h2>Loading your workout…</h2>
          <p>Booting the guided player from the generated workout handoff.</p>
        </section>
      </div>
    )
  }

  if (loadError || !playerState.workout) {
    return (
      <div className="screen-grid">
        <section className="card">
          <p className="card-eyebrow">Coach flow</p>
          <h2>Player unavailable</h2>
          <p>{loadError ?? 'There is no workout loaded in the player yet.'}</p>
          <Link className="inline-link" to="/build">
            Build a workout
          </Link>
        </section>
      </div>
    )
  }

  if (playerState.timer.phase === 'completed') {
    return (
      <div className="player-layout">
        <section className="card player-complete-card">
          <p className="card-eyebrow">Completed</p>
          <h2>You finished {playerState.workout.metadata.title}</h2>
          <p>{playerState.workout.metadata.format.toUpperCase()} session done. Nice work.</p>
          <div className="player-complete-stats">
            <div className="summary-stat">
              <span>Steps completed</span>
              <strong>
                {playerState.progress.completedStepIds.length} / {playerState.progress.totalSteps}
              </strong>
            </div>
            <div className="summary-stat">
              <span>Active time</span>
              <strong>{formatDurationLabel(playerState.timer.elapsedSeconds)}</strong>
            </div>
            <div className="summary-stat">
              <span>Format</span>
              <strong>{titleCase(playerState.workout.metadata.format)}</strong>
            </div>
          </div>
          <div className="summary-action-stack">
            <Link className="primary-action summary-primary-action" to="/build">
              Build another workout
            </Link>
            <Link className="secondary-action player-link-button" to="/progress">
              View progress
            </Link>
            <Link className="ghost-action player-link-button" to={`/workout/${playerState.workout.id}/summary`}>
              Back to summary
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="player-layout">
      <section className="card player-session-card">
        <div className="player-session-topline">
          <div>
            <p className="card-eyebrow">Coach flow</p>
            <h2>{playerState.workout.metadata.title}</h2>
          </div>
          <button type="button" className="ghost-action player-exit-button" onClick={() => void handleExit()}>
            Exit
          </button>
        </div>
        <div className="player-session-meta">
          <span className="mini-pill">{titleCase(playerState.workout.metadata.format)}</span>
          <span className="mini-pill">
            Step {currentStepNumber} / {playerState.progress.totalSteps}
          </span>
          <span className="mini-pill">Elapsed {formatDurationLabel(playerState.timer.elapsedSeconds)}</span>
          {playerState.timer.phase === 'paused' ? <span className="mini-pill">Resume available</span> : null}
        </div>
      </section>

      <section className={`card player-phase-card player-phase-${phaseKey}`}>
        <p className="card-eyebrow">Current phase</p>
        <div className="player-phase-heading">
          <h3>{phaseCopy.label}</h3>
          {playerState.timer.phase === 'paused' ? (
            <span className="mini-pill">Paused during {pausedDuringRest ? 'rest' : 'work'}</span>
          ) : null}
        </div>
        <p>{phaseCopy.message}</p>
      </section>

      <section className="card player-timer-card">
        <p className="card-eyebrow">Timer</p>
        <div className="player-timer-display" aria-live="polite">
          {formatSeconds(playerState.timer.remainingSeconds)}
        </div>
        <div className="player-timer-context">
          <span>{phaseCopy.label}</span>
          <span>
            {playerState.timer.phase === 'ready'
              ? `Upcoming work ${formatDurationLabel(playerState.timer.phaseTotalSeconds)}`
              : `Phase total ${formatDurationLabel(playerState.timer.phaseTotalSeconds)}`}
          </span>
        </div>
      </section>

      <section className="card player-current-card">
        <div className="player-card-heading">
          <div>
            <p className="card-eyebrow">Current exercise</p>
            <h3>{currentExercise?.name ?? 'Workout ready'}</h3>
          </div>
          {currentStep ? <span className="summary-step-badge">{BLOCK_LABELS[currentStep.block]}</span> : null}
        </div>
        <div className="player-context-row">
          {getStepContext(currentStep).map((label) => (
            <span key={label} className="compact-chip">
              {label}
            </span>
          ))}
        </div>
        <p>{currentExercise?.coaching.shortInstruction ?? 'Load a generated workout to begin coaching.'}</p>
        {currentStep ? (
          <div className="player-current-metrics">
            <div className="summary-stat">
              <span>Work</span>
              <strong>{formatDurationLabel(currentStep.workSeconds)}</strong>
            </div>
            <div className="summary-stat">
              <span>Rest</span>
              <strong>{currentStep.noRestAfter ? 'No rest after' : formatDurationLabel(currentStep.restSeconds)}</strong>
            </div>
          </div>
        ) : null}
      </section>

      <section className="card player-next-card">
        <div className="player-card-heading">
          <div>
            <p className="card-eyebrow">Next up</p>
            <h3>{nextExercise?.name ?? 'Completion transition next'}</h3>
          </div>
          <span className="mini-pill">Stay ready</span>
        </div>
        <p>{nextExercise?.coaching.shortInstruction ?? 'Final step — completion is next.'}</p>
        <span className="summary-step-meta">{getNextUpLabel(nextStep)}</span>
      </section>

      <section className="card player-progress-card">
        <div className="player-card-heading">
          <div>
            <p className="card-eyebrow">Progress</p>
            <h3>
              {playerState.progress.completedStepIds.length} of {playerState.progress.totalSteps} steps done
            </h3>
          </div>
          <span className="summary-step-badge">{progressPercent}%</span>
        </div>
        <div className="player-progress-bar" aria-label={`Workout progress ${progressPercent}%`}>
          <div className="player-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </section>

      <section className="card player-controls-card">
        <p className="card-eyebrow">Controls</p>
        <div className="player-primary-controls">
          {playerState.timer.phase === 'ready' ? (
            <button type="button" className="primary-action" onClick={() => dispatch({ type: 'START' })}>
              Start workout
            </button>
          ) : null}

          {playerState.timer.phase === 'work' || playerState.timer.phase === 'rest' ? (
            <button type="button" className="primary-action" onClick={() => dispatch({ type: 'PAUSE' })}>
              Pause
            </button>
          ) : null}

          {playerState.timer.phase === 'paused' ? (
            <button type="button" className="primary-action" onClick={() => dispatch({ type: 'RESUME' })}>
              Resume
            </button>
          ) : null}
        </div>

        <div className="player-secondary-controls">
          <button
            type="button"
            className="secondary-action"
            onClick={() => dispatch({ type: 'PREVIOUS_STEP' })}
            disabled={!canGoPrevious(playerState)}
          >
            Previous
          </button>
          <button
            type="button"
            className="secondary-action"
            onClick={() => dispatch({ type: 'NEXT_STEP' })}
            disabled={!canGoNext(playerState)}
          >
            Next
          </button>
          <button
            type="button"
            className="ghost-action"
            onClick={() => dispatch({ type: 'SKIP_REST' })}
            disabled={playerState.timer.phase !== 'rest'}
          >
            Skip rest
          </button>
        </div>
      </section>

      <section className="card player-preferences-card">
        <p className="card-eyebrow">Preferences</p>
        <div className="toggle-grid">
          <label className="toggle-card">
            <input
              type="checkbox"
              checked={playerState.preferences.soundEnabled}
              onChange={(event) => dispatch({ type: 'UPDATE_PREFERENCES', preferences: { soundEnabled: event.target.checked } })}
            />
            <span>
              <strong>Sound cues</strong>
              <br />
              <span>Keep audible transition prompts on.</span>
            </span>
          </label>
          <label className="toggle-card">
            <input
              type="checkbox"
              checked={playerState.preferences.vibrationEnabled}
              onChange={(event) =>
                dispatch({ type: 'UPDATE_PREFERENCES', preferences: { vibrationEnabled: event.target.checked } })
              }
            />
            <span>
              <strong>Vibration</strong>
              <br />
              <span>Enable haptic-ready cues for later device support.</span>
            </span>
          </label>
          <label className="toggle-card">
            <input
              type="checkbox"
              checked={playerState.preferences.voiceCountdownEnabled}
              onChange={(event) =>
                dispatch({ type: 'UPDATE_PREFERENCES', preferences: { voiceCountdownEnabled: event.target.checked } })
              }
            />
            <span>
              <strong>Voice countdown</strong>
              <br />
              <span>Stored locally so your player picks up where you left it.</span>
            </span>
          </label>
        </div>
      </section>
    </div>
  )
}
