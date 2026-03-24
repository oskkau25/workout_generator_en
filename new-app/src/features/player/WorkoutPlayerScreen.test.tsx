import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '@/app/App'
import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import { normalizeBuilderDraft } from '@/domain/builder/builder-normalizer'
import type { BuilderDraft } from '@/domain/builder/builder-types'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { generateWorkout } from '@/domain/workouts/workout-generator'
import { renderWithRouter } from '@/test/render-with-router'

describe('WorkoutPlayerScreen', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function seedWorkout(overrides: Partial<BuilderDraft> = {}) {
    const workout = generateWorkout(
      normalizeBuilderDraft({
        ...createDefaultBuilderDraft(),
        ...overrides,
      }),
      legacyExerciseCatalog,
      {
        random: () => 0,
        now: () => new Date('2026-03-24T10:00:00.000Z'),
      },
    )

    window.localStorage.setItem(
      'workout-generator-react.v1.generated-workout',
      JSON.stringify({ id: workout.id, workout }),
    )

    return workout
  }

  function seedActiveSession(workout: ReturnType<typeof seedWorkout>, currentStepIndex: number) {
    window.localStorage.setItem(
      'workout-generator-react.v1.active-session',
      JSON.stringify({
        workout,
        playerState: {
          workout,
          session: {
            sessionId: `session-${workout.id}`,
            workoutId: workout.id,
            startedAt: '2026-03-24T10:00:00.000Z',
            lastUpdatedAt: '2026-03-24T10:05:00.000Z',
            status: 'paused',
            playbackStepIds: workout.playback.steps.map((step) => step.id),
          },
          timer: {
            phase: 'paused',
            previousPhase: 'work',
            remainingSeconds: workout.playback.steps[currentStepIndex]?.workSeconds ?? 0,
            phaseTotalSeconds: workout.playback.steps[currentStepIndex]?.workSeconds ?? 0,
            elapsedSeconds: 0,
          },
          progress: {
            currentStepIndex,
            totalSteps: workout.playback.steps.length,
            completedStepIds: workout.playback.steps.slice(0, currentStepIndex).map((step) => step.id),
          },
          preferences: {
            soundEnabled: true,
            vibrationEnabled: true,
            voiceCountdownEnabled: false,
          },
        },
        savedAt: '2026-03-24T10:05:00.000Z',
      }),
    )
  }

  it('boots from stored generated workout data and runs the coach flow through completion', async () => {
    const workout = seedWorkout()

    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })

    expect(await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start workout/i })).toBeInTheDocument()
    expect(screen.getByText(/get ready to start/i)).toBeInTheDocument()

    vi.useFakeTimers()

    act(() => {
      screen.getByRole('button', { name: /start workout/i }).click()
    })

    act(() => {
      vi.advanceTimersByTime(workout.playback.totalDurationSeconds * 1000)
    })

    expect(screen.getByRole('heading', { name: new RegExp(`you finished ${workout.metadata.title}`, 'i') })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /build another workout/i })).toHaveAttribute('href', '/build')
    expect(screen.getByRole('link', { name: /view progress/i })).toHaveAttribute('href', '/progress')
  })

  it('supports pause, resume, next, previous, and skip rest from reducer-backed controls', async () => {
    const workout = seedWorkout()

    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })
    await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })

    act(() => {
      screen.getByRole('button', { name: /go to next step/i }).click()
    })
    expect(screen.getByText(new RegExp(`step 2 / ${workout.playback.steps.length}`, 'i'))).toBeInTheDocument()

    act(() => {
      screen.getByRole('button', { name: /go to previous step/i }).click()
    })
    expect(screen.getByText(new RegExp(`step 1 / ${workout.playback.steps.length}`, 'i'))).toBeInTheDocument()

    const restStepIndex = workout.playback.steps.findIndex((step) => step.restSeconds > 0 && !step.noRestAfter)
    expect(restStepIndex).toBeGreaterThan(-1)

    for (let index = 0; index < restStepIndex; index += 1) {
      act(() => {
        screen.getByRole('button', { name: /go to next step/i }).click()
      })
    }
    expect(screen.getByText(new RegExp(`step ${restStepIndex + 1} / ${workout.playback.steps.length}`, 'i'))).toBeInTheDocument()

    vi.useFakeTimers()

    act(() => {
      screen.getByRole('button', { name: /start workout/i }).click()
    })
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()

    act(() => {
      screen.getByRole('button', { name: /pause/i }).click()
    })
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
    expect(screen.getByText(/paused during work/i)).toBeInTheDocument()

    act(() => {
      screen.getByRole('button', { name: /resume/i }).click()
    })

    act(() => {
      vi.advanceTimersByTime(workout.playback.steps[restStepIndex].workSeconds * 1000)
    })

    expect(screen.getByText(/recover, breathe, and set up the next move/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /skip rest/i })).toBeEnabled()

    act(() => {
      screen.getByRole('button', { name: /skip rest/i }).click()
    })
    expect(screen.getByText(new RegExp(`step ${restStepIndex + 2} / ${workout.playback.steps.length}`, 'i'))).toBeInTheDocument()
  })

  it('supports player keyboard shortcuts for start pause resume and step navigation', async () => {
    const workout = seedWorkout()
    const user = userEvent.setup()

    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })
    await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText(new RegExp(`step 2 / ${workout.playback.steps.length}`, 'i'))).toBeInTheDocument()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText(new RegExp(`step 1 / ${workout.playback.steps.length}`, 'i'))).toBeInTheDocument()

    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()

    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()

    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('shows first circuit round using generator indexing', async () => {
    const workout = seedWorkout({
      format: 'circuit',
      formatConfig: { circuit: { rounds: 3, exercisesPerRound: 4, roundRestSeconds: 60 } },
    })
    seedActiveSession(workout, workout.playback.steps.findIndex((step) => step.roundIndex === 1))

    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })

    expect(await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })).toBeInTheDocument()
    expect(screen.getByText('Round 1 of 3')).toBeInTheDocument()
  })

  it('shows first tabata interval using generator indexing', async () => {
    const workout = seedWorkout({
      format: 'tabata',
      formatConfig: { tabata: { rounds: 6 } },
    })
    seedActiveSession(workout, workout.playback.steps.findIndex((step) => step.setIndex === 1))

    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })

    expect(await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })).toBeInTheDocument()
    expect(screen.getByText('Interval 1 of 6')).toBeInTheDocument()
  })

  it('shows first pyramid level using generator indexing', async () => {
    const workout = seedWorkout({
      format: 'pyramid',
      formatConfig: { pyramid: { levels: 4 } },
    })
    seedActiveSession(workout, workout.playback.steps.findIndex((step) => step.levelIndex === 1))

    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })

    expect(await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })).toBeInTheDocument()
    expect(screen.getByText('Level 1 of 4')).toBeInTheDocument()
  })

  it('does not create an active resumable saved session before the user presses Start', async () => {
    const workout = seedWorkout()

    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })

    expect(await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start workout/i })).toBeInTheDocument()
    expect(window.localStorage.getItem('workout-generator-react.v1.active-session')).toBeNull()
  })

  it('exiting from the ready screen does not append fake history, while started sessions are saved on exit', async () => {
    const workout = seedWorkout()
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })

    expect(await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /exit workout and return to summary/i }))

    expect(window.localStorage.getItem('workout-generator-react.v1.history')).toBeNull()
    expect(window.localStorage.getItem('workout-generator-react.v1.active-session')).toBeNull()

    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })
    expect(await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /start workout/i }))
    await user.click(screen.getByRole('button', { name: /exit workout and return to summary/i }))

    await waitFor(() => {
      expect(window.localStorage.getItem('workout-generator-react.v1.history')).not.toBeNull()
    })

    const history = JSON.parse(window.localStorage.getItem('workout-generator-react.v1.history') ?? '[]')
    expect(history).toHaveLength(1)
    expect(history[0]).toMatchObject({
      workoutId: workout.id,
      status: 'abandoned',
    })
    expect(history[0].startedAt).toBeTruthy()
    expect(window.localStorage.getItem('workout-generator-react.v1.active-session')).toBeNull()
  })

  it('rehydrates a saved session with stored preferences and exact timer state', async () => {
    const workout = seedWorkout()

    window.localStorage.setItem(
      'workout-generator-react.v1.preferences',
      JSON.stringify({
        soundEnabled: false,
        vibrationEnabled: false,
        voiceCountdownEnabled: true,
      }),
    )

    window.localStorage.setItem(
      'workout-generator-react.v1.active-session',
      JSON.stringify({
        workout,
        playerState: {
          workout,
          session: {
            sessionId: `session-${workout.id}`,
            workoutId: workout.id,
            startedAt: '2026-03-24T10:00:00.000Z',
            lastUpdatedAt: '2026-03-24T10:05:00.000Z',
            status: 'paused',
            playbackStepIds: workout.playback.steps.map((step) => step.id),
          },
          timer: {
            phase: 'paused',
            previousPhase: 'rest',
            remainingSeconds: 9,
            phaseTotalSeconds: 20,
            elapsedSeconds: 180,
          },
          progress: {
            currentStepIndex: 2,
            totalSteps: workout.playback.steps.length,
            completedStepIds: workout.playback.steps.slice(0, 2).map((step) => step.id),
          },
          preferences: {
            soundEnabled: false,
            vibrationEnabled: false,
            voiceCountdownEnabled: true,
          },
        },
        savedAt: '2026-03-24T10:05:00.000Z',
      }),
    )

    const user = userEvent.setup()
    renderWithRouter(<App />, { route: `/workout/${workout.id}/play` })

    expect(await screen.findByText(/paused during rest/i)).toBeInTheDocument()
    expect(screen.getByText('00:09')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`step 3 / ${workout.playback.steps.length}`, 'i'))).toBeInTheDocument()

    const soundCheckbox = screen.getByRole('checkbox', { name: /sound cues/i })
    expect(soundCheckbox).not.toBeChecked()

    await user.click(screen.getByRole('button', { name: /resume/i }))
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })
})
