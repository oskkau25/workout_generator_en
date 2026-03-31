import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BottomSheet } from '@/components/ui/BottomSheet'
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

const PREFERENCE_OPTIONS = [
  {
    key: 'soundEnabled',
    label: 'Sound cues',
    detail: 'Keep audible transition prompts on.',
  },
  {
    key: 'vibrationEnabled',
    label: 'Vibration',
    detail: 'Enable haptic-ready cues for later device support.',
  },
  {
    key: 'voiceCountdownEnabled',
    label: 'Voice countdown',
    detail: 'Stored locally so your player picks up where you left it.',
  },
] as const

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
    return 'Final step - completion is next'
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

function isInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName.toLowerCase()
  return target.isContentEditable || ['input', 'textarea', 'select', 'button', 'a'].includes(tagName)
}

function buildExerciseGlyph(name: string | undefined) {
  if (!name) {
    return 'WF'
  }

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function WorkoutPlayerScreen() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const [playerState, dispatch] = useReducer(playerReducer, undefined, () => createInitialPlayerState())
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isExerciseDetailOpen, setIsExerciseDetailOpen] = useState(false)
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

    const sessionStarted = playerState.session.startedAt != null
    if (!sessionStarted || playerState.timer.phase === 'idle' || playerState.timer.phase === 'completed') {
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

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (!playerState.workout || isInteractiveElement(event.target)) {
        return
      }

      if (event.key === ' ' || event.key === 'Spacebar') {
        if (playerState.timer.phase === 'ready') {
          event.preventDefault()
          dispatch({ type: 'START', now: new Date().toISOString() })
        } else if (playerState.timer.phase === 'work' || playerState.timer.phase === 'rest') {
          event.preventDefault()
          dispatch({ type: 'PAUSE' })
        } else if (playerState.timer.phase === 'paused') {
          event.preventDefault()
          dispatch({ type: 'RESUME' })
        }
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (playerState.timer.phase === 'rest') {
          dispatch({ type: 'SKIP_REST' })
        } else if (canGoNext(playerState)) {
          dispatch({ type: 'NEXT_STEP' })
        }
        return
      }

      if (event.key === 'ArrowLeft' && canGoPrevious(playerState)) {
        event.preventDefault()
        dispatch({ type: 'PREVIOUS_STEP' })
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [playerState])

  useEffect(() => {
    if (!isSettingsOpen) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSettingsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isSettingsOpen])

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
  const fullInstruction =
    currentExercise?.coaching.fullInstruction &&
    currentExercise.coaching.fullInstruction !== currentExercise.coaching.shortInstruction
      ? currentExercise.coaching.fullInstruction
      : null

  async function handleExit() {
    const phase = playerState.timer.phase
    const active = phase === 'work' || phase === 'rest' || phase === 'paused'
    if (active && !window.confirm('Exit this workout? Your current session will be marked as abandoned.')) {
      return
    }

    if (playerState.workout && playerState.session?.startedAt && !historySavedRef.current) {
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

  function renderPrimaryControl() {
    if (playerState.timer.phase === 'ready') {
      return (
        <button type="button" className="primary-action player-main-action" onClick={() => dispatch({ type: 'START', now: new Date().toISOString() })}>
          Start workout
        </button>
      )
    }

    if (playerState.timer.phase === 'work' || playerState.timer.phase === 'rest') {
      return (
        <button type="button" className="primary-action player-main-action" onClick={() => dispatch({ type: 'PAUSE' })}>
          Pause
        </button>
      )
    }

    if (playerState.timer.phase === 'paused') {
      return (
        <button type="button" className="primary-action player-main-action" onClick={() => dispatch({ type: 'RESUME' })}>
          Resume
        </button>
      )
    }

    return null
  }

  if (isLoading) {
    return (
      <div className="screen-grid">
        <section className="card" role="status" aria-live="polite">
          <p className="card-eyebrow">Coach flow</p>
          <h2>Loading your workout...</h2>
          <p>Booting the guided player from the generated workout handoff.</p>
        </section>
      </div>
    )
  }

  if (loadError || !playerState.workout) {
    return (
      <div className="screen-grid">
        <section className="card empty-state-card" role="alert">
          <p className="card-eyebrow">Coach flow</p>
          <h2>Player unavailable</h2>
          <p>{loadError ?? 'There is no workout loaded in the player yet.'}</p>
          <div className="summary-action-stack">
            <Link className="primary-action summary-primary-action" to="/build">
              Build a workout
            </Link>
          </div>
        </section>
      </div>
    )
  }

  if (playerState.timer.phase === 'completed') {
    return (
      <div className="player-layout player-layout-compact">
        <section className="card player-complete-card" role="status" aria-live="polite">
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
    <div className="player-layout player-layout-compact">
      <section className={`card player-focus-card player-phase-${phaseKey}`} aria-labelledby="player-timer-title">
        <div className="player-focus-topline">
          <div className="player-focus-session">
            <p className="player-session-name">{playerState.workout.metadata.title}</p>
            <div className="player-session-meta">
              <span className="mini-pill">{titleCase(playerState.workout.metadata.format)}</span>
              <span className="mini-pill">
                Step {currentStepNumber} / {playerState.progress.totalSteps}
              </span>
              {playerState.timer.phase === 'paused' ? <span className="mini-pill">Resume available</span> : null}
            </div>
          </div>
          <div className="player-header-actions">
            <button
              type="button"
              className="ghost-action player-utility-button"
              onClick={() => setIsSettingsOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isSettingsOpen}
            >
              Settings
            </button>
            <button
              type="button"
              className="ghost-action player-utility-button"
              onClick={() => void handleExit()}
              aria-label="Exit workout and return to summary"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="player-timer-block" role="status" aria-live="polite">
          <p id="player-timer-title" className="card-eyebrow">
            {phaseCopy.label}
          </p>
          {playerState.timer.phase === 'paused' ? (
            <span className="mini-pill player-phase-pill">Paused during {pausedDuringRest ? 'rest' : 'work'}</span>
          ) : null}
          <div className="player-timer-display" aria-live="polite" aria-atomic="true">
            {formatSeconds(playerState.timer.remainingSeconds)}
          </div>
          <p className="player-focus-caption">
            {playerState.timer.phase === 'ready'
              ? `Upcoming work ${formatDurationLabel(playerState.timer.phaseTotalSeconds)}`
              : `Phase total ${formatDurationLabel(playerState.timer.phaseTotalSeconds)}`}
          </p>
        </div>

        <div className="player-transport-row">
          <button
            type="button"
            className="secondary-action player-transport-button"
            onClick={() => dispatch({ type: 'PREVIOUS_STEP' })}
            disabled={!canGoPrevious(playerState)}
            aria-label="Go to previous step"
          >
            Prev
          </button>
          <div className="player-main-control-slot">{renderPrimaryControl()}</div>
          <button
            type="button"
            className="secondary-action player-transport-button"
            onClick={() => dispatch({ type: 'NEXT_STEP' })}
            disabled={!canGoNext(playerState)}
            aria-label="Go to next step"
          >
            Next
          </button>
        </div>

        {playerState.timer.phase === 'rest' ? (
          <button
            type="button"
            className="ghost-action player-skip-rest-button"
            onClick={() => dispatch({ type: 'SKIP_REST' })}
            disabled={playerState.timer.phase !== 'rest'}
            aria-label="Skip rest"
          >
            Skip rest
          </button>
        ) : null}
      </section>

      <section className="card player-current-card" aria-labelledby="current-exercise-title">
        <button
          type="button"
          className="player-current-toggle"
          aria-expanded={isExerciseDetailOpen}
          aria-controls="player-exercise-detail"
          onClick={() => setIsExerciseDetailOpen((current) => !current)}
        >
          <div className="player-card-heading">
            <div>
              <p className="card-eyebrow">Exercise</p>
              <h3 id="current-exercise-title">{currentExercise?.name ?? 'Workout ready'}</h3>
            </div>
            {currentStep ? <span className="summary-step-badge">{BLOCK_LABELS[currentStep.block]}</span> : null}
          </div>

          <div className="player-exercise-hero">
            <div className="player-exercise-visual" aria-hidden="true">
              <span>{buildExerciseGlyph(currentExercise?.name)}</span>
            </div>
            <div className="player-exercise-copy">
              <p className="player-exercise-instruction">
                {currentExercise?.coaching.shortInstruction ?? 'Load a generated workout to begin coaching.'}
              </p>
              <span className="player-inline-toggle-copy">
                {isExerciseDetailOpen ? 'Hide exercise details' : 'Tap for exercise details'}
              </span>
            </div>
          </div>
        </button>

        {isExerciseDetailOpen ? (
          <div id="player-exercise-detail" className="player-exercise-detail-panel">
            {fullInstruction ? <p>{fullInstruction}</p> : null}
            <div className="player-context-row">
              {getStepContext(currentStep).map((label) => (
                <span key={label} className="compact-chip">
                  {label}
                </span>
              ))}
            </div>
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
          </div>
        ) : null}
      </section>

      <section className="card player-next-preview-card" aria-labelledby="next-up-title">
        <p className="card-eyebrow">Next exercise</p>
        <h4 id="next-up-title">{nextExercise?.name ?? 'Completion transition next'}</h4>
        <span className="summary-step-meta">{getNextUpLabel(nextStep)}</span>
      </section>

      <section className="card player-progress-card" aria-labelledby="player-progress-title">
        <div className="player-progress-topline">
          <p id="player-progress-title" className="card-eyebrow">
            Workout progress
          </p>
          <span className="mini-pill">{titleCase(playerState.workout.metadata.format)}</span>
          <span className="mini-pill">Elapsed {formatDurationLabel(playerState.timer.elapsedSeconds)}</span>
        </div>
        <div className="player-progress-summary">
          <div className="player-progress-topline">
            <span>{playerState.progress.completedStepIds.length} of {playerState.progress.totalSteps} steps done</span>
            <span className="summary-step-badge">{progressPercent}%</span>
          </div>
          <div
            className="player-progress-bar"
            role="progressbar"
            aria-label="Workout progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-valuetext={`${progressPercent}% complete`}
          >
            <div className="player-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </section>

      <BottomSheet
        isOpen={isSettingsOpen}
        title="Quick preferences"
        subtitle="These preferences are saved locally and can be adjusted without leaving the workout."
        onDismiss={() => setIsSettingsOpen(false)}
      >
        <div className="player-settings-grid">
          {PREFERENCE_OPTIONS.map((option) => (
            <label key={option.key} className="toggle-card player-settings-toggle">
              <input
                type="checkbox"
                checked={playerState.preferences[option.key]}
                onChange={(event) =>
                  dispatch({
                    type: 'UPDATE_PREFERENCES',
                    preferences: { [option.key]: event.target.checked },
                  })
                }
              />
              <span>
                <strong>{option.label}</strong>
                <br />
                <span>{option.detail}</span>
              </span>
            </label>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
