import { act, screen } from '@testing-library/react'
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
})
