import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { BodyMapFigure } from '@/components/body-map/BodyMapFigure'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { formatBodyRegionList, getMovementCategoryFromPattern, getMovementPatternLabel, titleCase, type MovementIconCategory } from '@/domain/exercises/exercise-taxonomy'
import { playerReducer, createInitialPlayerState } from '@/domain/player/player-reducer'
import {
  canGoNext,
  canGoPrevious,
  getCurrentStep,
  getNextStep,
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


function renderMovementIcon(category: MovementIconCategory) {
  switch (category) {
    case 'squat':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="11" r="4" /><path d="M24 16v8l-6 5m6-5 6 5m-10 1v8m8-8v8m-14 0h20" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'hinge':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="28" cy="10" r="4" /><path d="M28 15v9l-8 5m8-5 7 3M20 29l-4 9m11-8 5 8M10 32h10" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'push':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 28h24M18 22l6-4 6 4M18 34l6-4 6 4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'pull':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 16h28m0 0-5-5m5 5-5 5M38 32H20m0 0 5-5m-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'plank':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="14" cy="18" r="3" /><path d="M17 20h13l8 8M30 20l-8 12M14 31h6m14 0h4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'lunge':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="10" r="4" /><path d="M24 15v8l-6 6m6-6 7 4m-13 2h9m-9 0-3 9m12-9 7 9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'rotation':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10a14 14 0 0 1 12 7m0 0v-5m0 5h-5M24 38a14 14 0 0 1-12-7m0 0v5m0-5h5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M24 16v16" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg>
    case 'jump':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 11v18m0 0-7-7m7 7 7-7M14 37h20" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'carry':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 18h7v6h-7zm17 0h7v6h-7zM19 21h10M24 12v9m0 3v12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'mobility_stretch':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 30c2-7 7-12 11-12 6 0 11 6 11 12M24 18V8m-8 25 8 7 8-7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'floor_core':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 30h14l8-8 6 6M16 30l6 8m12-10 4 10" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    default:
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="3.2" /><path d="M24 18v6l4 4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
}

function renderWorkoutStateIcon(phase: PlayerPhase | 'idle') {
  switch (phase) {
    case 'work':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10 14 27h8l-2 11 14-19h-8l2-9Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'rest':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 24c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9Zm9-15v4m0 22v4m15-15h-4M13 24H9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'paused':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 14v20M30 14v20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
    case 'completed':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 24l7 7 13-14" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="3.2" /></svg>
    default:
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 15v18l14-9Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
}

type WakeLockSentinelLike = {
  release: () => Promise<void>
}

type WakeLockNavigator = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>
  }
  vibrate?: (pattern: number | number[]) => boolean
}

function playCue(frequency: number, durationMs: number) {
  if (typeof window === 'undefined') {
    return
  }

  const AudioContextCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextCtor) {
    return
  }

  const audioContext = new AudioContextCtor()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gainNode.gain.value = 0.0001
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  const now = audioContext.currentTime
  gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000)
  oscillator.start(now)
  oscillator.stop(now + durationMs / 1000)
  oscillator.onended = () => {
    void audioContext.close()
  }
}

function speakCountdownValue(value: number) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    return
  }

  const utterance = new SpeechSynthesisUtterance(String(value))
  utterance.rate = 1
  utterance.pitch = 1
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export function WorkoutPlayerScreen() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const [playerState, dispatch] = useReducer(playerReducer, undefined, () => createInitialPlayerState())
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isExerciseDetailOpen, setIsExerciseDetailOpen] = useState(false)
  const [isExerciseDetailPinned, setIsExerciseDetailPinned] = useState(false)
  const [isAudioTestRunning, setIsAudioTestRunning] = useState(false)
  const historySavedRef = useRef(false)
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null)
  const previousPhaseRef = useRef<PlayerPhase>('idle')
  const lastCountdownRef = useRef<string | null>(null)
  const audioTestTimeoutsRef = useRef<number[]>([])

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

  useEffect(() => {
    const wakeLockNavigator = navigator as WakeLockNavigator

    async function acquireWakeLock() {
      if (!wakeLockNavigator.wakeLock?.request || wakeLockRef.current) {
        return
      }

      try {
        wakeLockRef.current = await wakeLockNavigator.wakeLock.request('screen')
      } catch {
        wakeLockRef.current = null
      }
    }

    async function releaseWakeLock() {
      if (!wakeLockRef.current) {
        return
      }

      try {
        await wakeLockRef.current.release()
      } finally {
        wakeLockRef.current = null
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void acquireWakeLock()
      } else {
        void releaseWakeLock()
      }
    }

    void acquireWakeLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      void releaseWakeLock()
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      for (const timeoutId of audioTestTimeoutsRef.current) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  const exerciseMap = useMemo(() => createExerciseMap(legacyExerciseCatalog), [])
  const currentStep = useMemo(() => getCurrentStep(playerState), [playerState])
  const nextStep = useMemo(() => getNextStep(playerState), [playerState])
  const currentExercise = useMemo(() => getExercise(currentStep, exerciseMap), [currentStep, exerciseMap])
  const nextExercise = useMemo(() => getExercise(nextStep, exerciseMap), [nextStep, exerciseMap])
  const currentStepNumber = Math.min(playerState.progress.currentStepIndex + 1, playerState.progress.totalSteps)
  const phaseKey = playerState.timer.phase === 'idle' ? 'ready' : playerState.timer.phase
  const phaseCopy = PHASE_COPY[phaseKey]
  const pausedDuringRest = isRestPhase(playerState)
  const exerciseCountLabel = currentStep ? `Exercise ${currentStepNumber} of ${playerState.progress.totalSteps}` : 'Exercise ready'
  const currentExercisePrimaryMuscle = currentExercise?.primaryMuscle ? titleCase(currentExercise.primaryMuscle) : null
  const nextExercisePrimaryMuscle = nextExercise?.primaryMuscle ? titleCase(nextExercise.primaryMuscle) : null
  const movementCategory = currentExercise?.movementPattern
    ? getMovementCategoryFromPattern(currentExercise.movementPattern)
    : 'general'

  useEffect(() => {
    if (isExerciseDetailPinned) {
      setIsExerciseDetailOpen(true)
    }
  }, [currentStep?.id, isExerciseDetailPinned])

  useEffect(() => {
    const previousPhase = previousPhaseRef.current
    const currentPhase = playerState.timer.phase
    const wakeLockNavigator = navigator as WakeLockNavigator

    if (previousPhase !== currentPhase) {
      if (playerState.preferences.soundEnabled) {
        if (currentPhase === 'work' || currentPhase === 'rest') {
          playCue(currentPhase === 'work' ? 740 : 520, 140)
        }
        if (currentPhase === 'completed') {
          playCue(880, 240)
        }
      }

      if (playerState.preferences.vibrationEnabled && wakeLockNavigator.vibrate) {
        if (currentPhase === 'work' || currentPhase === 'rest') {
          wakeLockNavigator.vibrate(70)
        }
        if (currentPhase === 'completed') {
          wakeLockNavigator.vibrate([90, 50, 90])
        }
      }

      lastCountdownRef.current = null
    }

    previousPhaseRef.current = currentPhase
  }, [playerState.preferences.soundEnabled, playerState.preferences.vibrationEnabled, playerState.timer.phase])

  useEffect(() => {
    if (playerState.timer.phase !== 'work' && playerState.timer.phase !== 'rest') {
      lastCountdownRef.current = null
      return
    }

    if (!playerState.preferences.voiceCountdownEnabled) {
      return
    }

    const remainingSeconds = playerState.timer.remainingSeconds
    if (remainingSeconds < 1 || remainingSeconds > 3) {
      return
    }

    const countdownKey = `${playerState.timer.phase}-${currentStepNumber}-${remainingSeconds}`
    if (lastCountdownRef.current === countdownKey) {
      return
    }

    lastCountdownRef.current = countdownKey
    speakCountdownValue(remainingSeconds)
  }, [
    currentStepNumber,
    playerState.preferences.voiceCountdownEnabled,
    playerState.timer.phase,
    playerState.timer.remainingSeconds,
  ])

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

  function toggleExerciseDetail() {
    if (isExerciseDetailPinned) {
      setIsExerciseDetailPinned(false)
    }

    setIsExerciseDetailOpen((current) => !current)
  }

  function handleAudioTest() {
    if (isAudioTestRunning) {
      return
    }

    for (const timeoutId of audioTestTimeoutsRef.current) {
      window.clearTimeout(timeoutId)
    }
    audioTestTimeoutsRef.current = []

    setIsAudioTestRunning(true)

    const finishTimeout = window.setTimeout(() => {
      setIsAudioTestRunning(false)
      audioTestTimeoutsRef.current = []
    }, 2300)

    audioTestTimeoutsRef.current.push(finishTimeout)

    if (playerState.preferences.soundEnabled) {
      playCue(660, 120)
    }

    const wakeLockNavigator = navigator as WakeLockNavigator
    if (playerState.preferences.vibrationEnabled && wakeLockNavigator.vibrate) {
      wakeLockNavigator.vibrate([60, 40, 60])
    }

    if (playerState.preferences.voiceCountdownEnabled) {
      const countdownValues = [3, 2, 1]
      countdownValues.forEach((value, index) => {
        const timeoutId = window.setTimeout(() => {
          speakCountdownValue(value)
          if (playerState.preferences.soundEnabled) {
            playCue(520 + index * 50, 90)
          }
        }, index * 550)
        audioTestTimeoutsRef.current.push(timeoutId)
      })
    }
  }

  function renderPrimaryControl() {
    if (playerState.timer.phase === 'ready') {
      return (
        <button
          type="button"
          className="primary-action player-main-action player-main-action-icon"
          onClick={() => dispatch({ type: 'START', now: new Date().toISOString() })}
          aria-label="Start workout"
          title="Start"
        >
          <span aria-hidden="true">▶</span>
        </button>
      )
    }

    if (playerState.timer.phase === 'work' || playerState.timer.phase === 'rest') {
      return (
        <button
          type="button"
          className="primary-action player-main-action player-main-action-icon"
          onClick={() => dispatch({ type: 'PAUSE' })}
          aria-label="Pause"
          title="Pause"
        >
          <span aria-hidden="true">❚❚</span>
        </button>
      )
    }

    if (playerState.timer.phase === 'paused') {
      return (
        <button
          type="button"
          className="primary-action player-main-action player-main-action-icon"
          onClick={() => dispatch({ type: 'RESUME' })}
          aria-label="Resume"
          title="Resume"
        >
          <span aria-hidden="true">▶</span>
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
      <section className="card player-current-card" aria-labelledby="current-exercise-title">
        <div className="player-current-topline">
          <div className="player-focus-session">
            <p className="player-session-name">{playerState.workout.metadata.title}</p>
            <div className="player-session-meta">
              <span className="mini-pill">{titleCase(playerState.workout.metadata.format)}</span>
              <span className="mini-pill player-exercise-count">{exerciseCountLabel}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="player-current-toggle"
          aria-expanded={isExerciseDetailOpen}
          aria-controls="player-exercise-detail"
          onClick={toggleExerciseDetail}
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
              {renderMovementIcon(movementCategory)}
            </div>
            <div className="player-exercise-copy">
              <div className="player-compact-status-row" role="status" aria-live="polite">
                <span className="mini-pill player-state-pill">
                  <span className="player-state-pill-icon" aria-hidden="true">{renderWorkoutStateIcon(playerState.timer.phase)}</span>
                  <span>{phaseCopy.label}</span>
                </span>
                <span className="mini-pill player-timer-pill">{formatSeconds(playerState.timer.remainingSeconds)}</span>
                {playerState.timer.phase === 'paused' ? (
                  <span className="mini-pill">{pausedDuringRest ? 'Paused during rest' : 'Paused during work'}</span>
                ) : null}
              </div>
              <p className="player-exercise-instruction">
                {currentExercise?.coaching.shortInstruction ?? 'Load a generated workout to begin coaching.'}
              </p>
              <span className="player-inline-toggle-copy">
                {isExerciseDetailPinned
                  ? 'Details pinned'
                  : isExerciseDetailOpen
                    ? 'Hide exercise details'
                    : 'Tap for exercise details'}
              </span>
            </div>
          </div>
        </button>

        {isExerciseDetailOpen ? (
          <div id="player-exercise-detail" className="player-exercise-detail-panel">
            <div className="player-exercise-detail-actions">
              <button
                type="button"
                className="ghost-action player-pin-button"
                onClick={() => {
                  setIsExerciseDetailPinned((current) => !current)
                  setIsExerciseDetailOpen(true)
                }}
                aria-pressed={isExerciseDetailPinned}
              >
                {isExerciseDetailPinned ? 'Unpin details' : 'Pin details'}
              </button>
            </div>
            <div className="player-context-row">
              {currentExercise?.movementPattern ? (
                <span className="compact-chip">{getMovementPatternLabel(currentExercise.movementPattern)}</span>
              ) : null}
              {getStepContext(currentStep).map((label) => (
                <span key={label} className="compact-chip">
                  {label}
                </span>
              ))}
              {currentExercisePrimaryMuscle ? <span className="compact-chip">{currentExercisePrimaryMuscle}</span> : null}
            </div>
            {currentExercise?.bodyMap ? (
              <div className="player-body-map-block">
                <BodyMapFigure compact primary={currentExercise.bodyMap.primary} secondary={currentExercise.bodyMap.secondary} />
                <div className="summary-body-map-copy player-body-map-copy">
                  <span className="card-eyebrow">Targeted areas</span>
                  <strong>Body map</strong>
                  <div className="summary-chip-row">
                    <span className="summary-step-meta">Primary: {formatBodyRegionList(currentExercise.bodyMap.primary)}</span>
                    {currentExercise.bodyMap.secondary.length > 0 ? (
                      <span className="summary-step-meta">Secondary: {formatBodyRegionList(currentExercise.bodyMap.secondary)}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
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

        <div className="player-next-preview-card player-next-preview-card-inline" aria-labelledby="next-up-title">
          <div className="player-next-preview-copy">
            <p className="card-eyebrow">Next exercise</p>
            <h4 id="next-up-title">{nextExercise?.name ?? 'Completion transition next'}</h4>
            <span className="summary-step-meta">{getNextUpLabel(nextStep)}</span>
          </div>
          {nextExercisePrimaryMuscle ? <span className="compact-chip player-next-chip">{nextExercisePrimaryMuscle}</span> : null}
        </div>

        <div className="player-transport-row">
          <button
            type="button"
            className="secondary-action player-transport-button player-transport-button-icon"
            onClick={() => dispatch({ type: 'PREVIOUS_STEP' })}
            disabled={!canGoPrevious(playerState)}
            aria-label="Go to previous step"
            title="Previous"
          >
            <span className="player-transport-label" aria-hidden="true">←</span>
          </button>
          <div className="player-main-control-slot">{renderPrimaryControl()}</div>
          <button
            type="button"
            className="secondary-action player-transport-button player-transport-button-icon"
            onClick={() => dispatch({ type: 'NEXT_STEP' })}
            disabled={!canGoNext(playerState)}
            aria-label="Go to next step"
            title="Next"
          >
            <span className="player-transport-label" aria-hidden="true">→</span>
          </button>
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

      <section className="player-session-footer" aria-label="Workout meta">
        <div className="player-session-meta">
          <span className="mini-pill">Elapsed {formatDurationLabel(playerState.timer.elapsedSeconds)}</span>
        </div>
      </section>

      <BottomSheet
        isOpen={isSettingsOpen}
        title="Quick preferences"
        subtitle="Sound, countdown, and haptics are saved locally."
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
          <button
            type="button"
            className="secondary-action player-audio-test-button"
            onClick={handleAudioTest}
            disabled={isAudioTestRunning}
          >
            {isAudioTestRunning ? 'Testing audio…' : 'Test audio'}
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
