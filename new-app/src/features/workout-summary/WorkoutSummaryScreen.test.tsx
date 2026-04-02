import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WorkoutSummaryScreen } from '@/features/workout-summary/WorkoutSummaryScreen'
import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import { normalizeBuilderDraft } from '@/domain/builder/builder-normalizer'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { generateWorkout } from '@/domain/workouts/workout-generator'
import type { WorkoutExerciseStep } from '@/domain/workouts/workout-types'
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

describe('WorkoutSummaryScreen', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the progress strip and keeps workout journey sections collapsed by default', async () => {
    const workout = seedWorkout()

    renderWithRouter(<WorkoutSummaryScreen />, {
      route: `/workout/${workout.id}/summary`,
      path: '/workout/:workoutId/summary',
    })

    expect(await screen.findByRole('navigation', { name: /workout flow steps/i })).toBeInTheDocument()
    expect(screen.getByText(new RegExp(workout.metadata.title, 'i'))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /warm-up/i })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: /main block/i })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: /cool-down/i })).toHaveAttribute('aria-expanded', 'false')
  })

  it('reveals section steps when the user expands a journey section', async () => {
    const workout = seedWorkout()
    const user = userEvent.setup()

    renderWithRouter(<WorkoutSummaryScreen />, {
      route: `/workout/${workout.id}/summary`,
      path: '/workout/:workoutId/summary',
    })

    const mainBlockToggle = await screen.findByRole('button', { name: /main block/i })
    await user.click(mainBlockToggle)

    expect(mainBlockToggle).toHaveAttribute('aria-expanded', 'true')

    const firstMainExercise = workout.blocks
      .find((block) => block.type === 'main')
      ?.steps.find((step): step is WorkoutExerciseStep => step.kind === 'exercise')
    const firstMainExerciseTitle =
      legacyExerciseCatalog.find((exercise) => exercise.id === firstMainExercise?.exerciseId)?.name ?? 'exercise'

    const exerciseToggle = screen.getAllByRole('button', { name: new RegExp(firstMainExerciseTitle, 'i') })[0]
    await user.click(exerciseToggle)

    expect(exerciseToggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /switch exercise/i })).toBeInTheDocument()
  })

  it('swaps an expanded exercise instantly and marks it as swapped', async () => {
    const workout = seedWorkout()
    const user = userEvent.setup()

    renderWithRouter(<WorkoutSummaryScreen />, {
      route: `/workout/${workout.id}/summary`,
      path: '/workout/:workoutId/summary',
    })

    const mainBlockToggle = await screen.findByRole('button', { name: /main block/i })
    await user.click(mainBlockToggle)

    const firstMainExercise = workout.blocks
      .find((block) => block.type === 'main')
      ?.steps.find((step): step is WorkoutExerciseStep => step.kind === 'exercise')
    const firstMainExerciseTitle =
      legacyExerciseCatalog.find((exercise) => exercise.id === firstMainExercise?.exerciseId)?.name ?? 'exercise'

    const exerciseToggle = screen.getAllByRole('button', { name: new RegExp(firstMainExerciseTitle, 'i') })[0]
    await user.click(exerciseToggle)
    await user.click(screen.getByRole('button', { name: /switch exercise/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/exercise updated/i)
    expect(screen.getByRole('status')).toHaveTextContent(/swapped .* for .* in main block/i)
    expect(exerciseToggle).toHaveTextContent(/swapped/i)
    expect(exerciseToggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/updated from/i)).toBeInTheDocument()
  })

  it('explains that the workout journey stays collapsed until opened', async () => {
    const workout = seedWorkout()

    renderWithRouter(<WorkoutSummaryScreen />, {
      route: `/workout/${workout.id}/summary`,
      path: '/workout/:workoutId/summary',
    })

    expect(await screen.findByText(/sections stay collapsed until you open them/i)).toBeInTheDocument()
  })

  it('keeps the summary footer focused on start and edit actions', async () => {
    const workout = seedWorkout()

    renderWithRouter(<WorkoutSummaryScreen />, {
      route: `/workout/${workout.id}/summary`,
      path: '/workout/:workoutId/summary',
    })

    expect(await screen.findByRole('link', { name: /start workout/i })).toHaveAttribute(
      'href',
      `/workout/${workout.id}/play`,
    )
    expect(screen.getByRole('button', { name: /edit settings/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /regenerate workout/i })).not.toBeInTheDocument()
  })
})
