import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '@/app/App'
import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import { normalizeBuilderDraft } from '@/domain/builder/builder-normalizer'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { generateWorkout } from '@/domain/workouts/workout-generator'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'
import { renderWithRouter } from '@/test/render-with-router'

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

describe('App shell routing', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the workout builder on the default route', () => {
    renderWithRouter(<App />)

    expect(screen.getByRole('link', { name: /skip to content/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /build your workout/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /workout flow steps/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate workout/i })).toBeInTheDocument()
  })

  it('updates the builder footer recap when the user changes workout shape', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)

    await user.click(screen.getByRole('button', { name: /tabata/i }))

    expect(screen.getByText(/30 min • full body • tabata/i)).toBeInTheDocument()
  })

  it('renders the progress dashboard with a strong empty state', async () => {
    renderWithRouter(<App />, { route: '/progress' })

    expect(await screen.findByRole('heading', { name: /your progress/i })).toBeInTheDocument()
    expect(screen.getByText(/finish your first workout/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /build a workout/i })).toHaveAttribute('href', '/build')
  })

  it('generates a workout from the builder, persists it, and hands off to the summary route', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, { route: '/build' })

    await user.click(screen.getByRole('button', { name: /tabata/i }))
    await user.click(screen.getByRole('button', { name: /generate workout/i }))

    const storedWorkoutRaw = window.localStorage.getItem(STORAGE_KEYS.generatedWorkout)

    expect(storedWorkoutRaw).not.toBeNull()

    const storedWorkout = JSON.parse(storedWorkoutRaw ?? 'null') as {
      id: string
      workout: {
        id: string
        metadata: { title: string }
        sourceRequest: { format: string }
      }
    }

    expect(storedWorkout.id).toBe(storedWorkout.workout.id)
    expect(storedWorkout.workout.sourceRequest.format).toBe('tabata')
    expect(await screen.findByText(new RegExp(storedWorkout.workout.metadata.title, 'i'))).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /review the flow/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start workout/i })).toBeInTheDocument()
  })

  it('renders the workout summary review screen from stored generated workout data', async () => {
    const workout = seedWorkout()

    renderWithRouter(<App />, { route: `/workout/${workout.id}/summary` })

    expect(await screen.findByText(new RegExp(workout.metadata.title, 'i'))).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /review the flow/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start workout/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /generation notes/i })).not.toBeInTheDocument()
  })

  it('shows a resume affordance on the builder when an active local session exists', async () => {
    const workout = seedWorkout()

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
            lastUpdatedAt: '2026-03-24T10:02:00.000Z',
            status: 'paused',
            playbackStepIds: workout.playback.steps.map((step) => step.id),
          },
          timer: {
            phase: 'paused',
            previousPhase: 'work',
            remainingSeconds: 12,
            phaseTotalSeconds: 40,
            elapsedSeconds: 120,
          },
          progress: {
            currentStepIndex: 1,
            totalSteps: workout.playback.steps.length,
            completedStepIds: workout.playback.steps.slice(0, 1).map((step) => step.id),
          },
          preferences: {
            soundEnabled: true,
            vibrationEnabled: true,
            voiceCountdownEnabled: false,
          },
        },
        savedAt: '2026-03-24T10:02:00.000Z',
      }),
    )

    renderWithRouter(<App />, { route: '/build' })

    expect(await screen.findByRole('button', { name: /resume active workout/i })).toBeInTheDocument()
  })
})
