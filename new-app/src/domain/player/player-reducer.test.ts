import { playerReducer, createInitialPlayerState } from '@/domain/player/player-reducer'
import {
  canGoNext,
  canGoPrevious,
  getCurrentStep,
  getNextStep,
  getProgressPercent,
  isRestPhase,
} from '@/domain/player/player-selectors'
import type { GeneratedWorkout } from '@/domain/workouts/workout-types'

function createWorkout(): GeneratedWorkout {
  return {
    id: 'workout-1',
    createdAt: '2026-03-24T10:00:00.000Z',
    sourceRequest: {
      goal: 'full_body',
      level: 'intermediate',
      targetMinutes: 20,
      format: 'standard',
      selectedEquipment: ['bodyweight'],
      timing: { workSeconds: 30, restSeconds: 10 },
      formatConfig: { format: 'standard' },
      advanced: {
        includeWarmup: true,
        includeCooldown: true,
        allowExerciseRepeats: false,
        preferBalancedMuscleSplit: true,
      },
    },
    metadata: {
      title: 'Fixture workout',
      format: 'standard',
      estimatedMinutes: 3,
      level: 'intermediate',
      selectedEquipment: ['bodyweight'],
      goal: 'full_body',
      totalSteps: 3,
      totalExerciseSteps: 3,
    },
    blocks: [],
    playback: {
      totalWorkSeconds: 120,
      totalRestSeconds: 15,
      totalDurationSeconds: 135,
      steps: [
        {
          kind: 'exercise',
          id: 'step-1',
          exerciseId: 'jumping-jacks',
          block: 'warmup',
          order: 1,
          workSeconds: 30,
          restSeconds: 10,
          noRestAfter: false,
        },
        {
          kind: 'exercise',
          id: 'step-2',
          exerciseId: 'push-ups',
          block: 'main',
          order: 2,
          workSeconds: 45,
          restSeconds: 5,
          noRestAfter: false,
        },
        {
          kind: 'exercise',
          id: 'step-3',
          exerciseId: 'stretch',
          block: 'cooldown',
          order: 3,
          workSeconds: 45,
          restSeconds: 0,
          noRestAfter: true,
        },
      ],
    },
    diagnostics: {
      generatorVersion: 'test',
      warnings: [],
      notes: [],
    },
  }
}

describe('playerReducer', () => {
  it('loads a workout into a ready state with session and progress metadata', () => {
    const workout = createWorkout()
    const state = playerReducer(createInitialPlayerState(), {
      type: 'LOAD_WORKOUT',
      workout,
      now: '2026-03-24T10:05:00.000Z',
      sessionId: 'session-123',
    })

    expect(state.timer.phase).toBe('ready')
    expect(state.timer.remainingSeconds).toBe(30)
    expect(state.progress).toEqual({
      currentStepIndex: 0,
      totalSteps: 3,
      completedStepIds: [],
    })
    expect(state.session).toMatchObject({
      sessionId: 'session-123',
      workoutId: 'workout-1',
      status: 'active',
    })
  })

  it('walks ready -> work -> rest -> next work and tracks progress deterministically', () => {
    const workout = createWorkout()
    let state = playerReducer(createInitialPlayerState(), { type: 'LOAD_WORKOUT', workout })

    state = playerReducer(state, { type: 'START' })
    expect(state.timer.phase).toBe('work')
    expect(getCurrentStep(state)?.id).toBe('step-1')

    state = playerReducer(state, { type: 'TICK', seconds: 30 })
    expect(state.timer.phase).toBe('rest')
    expect(isRestPhase(state)).toBe(true)
    expect(state.progress.completedStepIds).toEqual([])

    state = playerReducer(state, { type: 'TICK', seconds: 10 })
    expect(state.timer.phase).toBe('work')
    expect(state.progress.currentStepIndex).toBe(1)
    expect(state.progress.completedStepIds).toEqual(['step-1'])
    expect(getProgressPercent(state)).toBe(33)
    expect(getCurrentStep(state)?.id).toBe('step-2')
    expect(getNextStep(state)?.id).toBe('step-3')
  })

  it('pauses and resumes without losing remaining time or active sub-phase', () => {
    const workout = createWorkout()
    let state = playerReducer(createInitialPlayerState(), { type: 'LOAD_WORKOUT', workout })
    state = playerReducer(state, { type: 'START' })
    state = playerReducer(state, { type: 'TICK', seconds: 12 })

    const remainingBeforePause = state.timer.remainingSeconds
    state = playerReducer(state, { type: 'PAUSE' })

    expect(state.timer.phase).toBe('paused')
    expect(state.timer.previousPhase).toBe('work')
    expect(state.timer.remainingSeconds).toBe(remainingBeforePause)
    expect(state.session?.status).toBe('paused')

    state = playerReducer(state, { type: 'RESUME' })
    expect(state.timer.phase).toBe('work')
    expect(state.timer.remainingSeconds).toBe(remainingBeforePause)
    expect(state.session?.status).toBe('active')
  })

  it('supports next, previous, and skip-rest without touching UI concerns', () => {
    const workout = createWorkout()
    let state = playerReducer(createInitialPlayerState(), { type: 'LOAD_WORKOUT', workout })

    expect(canGoPrevious(state)).toBe(false)
    expect(canGoNext(state)).toBe(true)

    state = playerReducer(state, { type: 'NEXT_STEP' })
    expect(state.progress.currentStepIndex).toBe(1)
    expect(state.timer.phase).toBe('ready')
    expect(canGoPrevious(state)).toBe(true)

    state = playerReducer(state, { type: 'PREVIOUS_STEP' })
    expect(state.progress.currentStepIndex).toBe(0)

    state = playerReducer(state, { type: 'START' })
    state = playerReducer(state, { type: 'TICK', seconds: 30 })
    expect(state.timer.phase).toBe('rest')

    state = playerReducer(state, { type: 'SKIP_REST' })
    expect(state.progress.currentStepIndex).toBe(1)
    expect(state.timer.phase).toBe('work')
  })

  it('completes cleanly when the last step has no rest and handles overshoot ticks', () => {
    const workout = createWorkout()
    let state = playerReducer(createInitialPlayerState(), { type: 'LOAD_WORKOUT', workout, resumeFromStepIndex: 2 })

    state = playerReducer(state, { type: 'START' })
    state = playerReducer(state, { type: 'TICK', seconds: 50 })

    expect(state.timer.phase).toBe('completed')
    expect(state.progress.currentStepIndex).toBe(3)
    expect(state.progress.completedStepIds).toEqual(['step-1', 'step-2', 'step-3'])
    expect(state.session?.status).toBe('completed')
    expect(getCurrentStep(state)).toBeNull()
    expect(getProgressPercent(state)).toBe(100)
  })

  it('clamps invalid resume indexes and can mark an active session abandoned on exit', () => {
    const workout = createWorkout()
    let state = playerReducer(createInitialPlayerState(), {
      type: 'LOAD_WORKOUT',
      workout,
      resumeFromStepIndex: 99,
    })

    expect(state.timer.phase).toBe('completed')
    expect(state.progress.currentStepIndex).toBe(3)

    state = playerReducer(playerReducer(createInitialPlayerState(), { type: 'LOAD_WORKOUT', workout }), {
      type: 'EXIT',
      now: '2026-03-24T10:09:00.000Z',
    })

    expect(state.timer.phase).toBe('idle')
    expect(state.session?.status).toBe('abandoned')
    expect(state.session?.lastUpdatedAt).toBe('2026-03-24T10:09:00.000Z')
  })
})
