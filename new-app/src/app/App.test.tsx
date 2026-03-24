import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '@/app/App'
import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import { normalizeBuilderDraft } from '@/domain/builder/builder-normalizer'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { generateWorkout } from '@/domain/workouts/workout-generator'
import { renderWithRouter } from '@/test/render-with-router'

describe('App shell routing', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the workout builder on the default route', () => {
    renderWithRouter(<App />)

    expect(screen.getByRole('heading', { name: /react redesign foundation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /build your workout/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate workout/i })).toBeInTheDocument()
  })

  it('updates the live summary when format changes', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)

    await user.click(screen.getByRole('button', { name: /tabata/i }))

    expect(screen.getByRole('heading', { name: /30 min full body tabata/i })).toBeInTheDocument()
    expect(screen.getByText(/8 tabata rounds at 20s work \/ 10s rest/i)).toBeInTheDocument()
  })

  it('renders the progress shell on /progress', () => {
    renderWithRouter(<App />, { route: '/progress' })

    expect(screen.getByRole('heading', { name: /progress shell/i })).toBeInTheDocument()
  })

  it('renders the workout summary review screen from stored generated workout data', async () => {
    const workout = generateWorkout(normalizeBuilderDraft(createDefaultBuilderDraft()), legacyExerciseCatalog, {
      random: () => 0,
      now: () => new Date('2026-03-24T10:00:00.000Z'),
    })

    window.localStorage.setItem(
      'workout-generator-react.v1.generated-workout',
      JSON.stringify({ id: workout.id, workout }),
    )

    renderWithRouter(<App />, { route: `/workout/${workout.id}/summary` })

    expect(await screen.findByRole('heading', { name: new RegExp(workout.metadata.title, 'i') })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /this is what you asked for/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /start workout/i })).toHaveAttribute(
      'href',
      `/workout/${workout.id}/play`,
    )
    expect(screen.getByText(/legacy generation rules were preserved as invariants/i)).toBeInTheDocument()
  })
})
