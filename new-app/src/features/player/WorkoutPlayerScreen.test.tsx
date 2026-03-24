import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '@/app/App'
import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import { normalizeBuilderDraft } from '@/domain/builder/builder-normalizer'
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

  function seedWorkout() {
    const workout = generateWorkout(normalizeBuilderDraft(createDefaultBuilderDraft()), legacyExerciseCatalog, {
      random: () => 0,
      now: () => new Date('2026-03-24T10:00:00.000Z'),
    })

    window.localStorage.setItem(
      'workout-generator-react.v1.generated-workout',
      JSON.stringify({ id: workout.id, workout }),
    )

    return workout
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
      screen.getByRole('button', { name: /next/i }).click()
    })
    expect(screen.getByText(new RegExp(`step 2 / ${workout.playback.steps.length}`, 'i'))).toBeInTheDocument()

    act(() => {
      screen.getByRole('button', { name: /previous/i }).click()
    })
    expect(screen.getByText(new RegExp(`step 1 / ${workout.playback.steps.length}`, 'i'))).toBeInTheDocument()

    const restStepIndex = workout.playback.steps.findIndex((step) => step.restSeconds > 0 && !step.noRestAfter)
    expect(restStepIndex).toBeGreaterThan(-1)

    for (let index = 0; index < restStepIndex; index += 1) {
      act(() => {
        screen.getByRole('button', { name: /next/i }).click()
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
