import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BuilderScreen } from '@/features/builder/BuilderScreen'
import { renderWithRouter } from '@/test/render-with-router'

describe('BuilderScreen', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the workout flow progress strip and compact generate area', async () => {
    renderWithRouter(<BuilderScreen />)

    expect(screen.getByRole('navigation', { name: /workout flow steps/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /build your workout/i })).toBeInTheDocument()
    expect(screen.getByTestId('builder-generate-area')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate workout/i })).toBeInTheDocument()
  })

  it('updates visible selection state when the user changes goal, duration, and format', async () => {
    const user = userEvent.setup()
    renderWithRouter(<BuilderScreen />)

    await user.click(screen.getByRole('button', { name: /conditioning/i }))
    fireEvent.change(screen.getByRole('slider', { name: /workout duration/i }), { target: { value: '3' } })
    await user.click(screen.getByRole('button', { name: /tabata/i }))

    expect(screen.getByText(/45 min • conditioning • tabata/i)).toBeInTheDocument()
  })

  it('supports equipment multi-select and reflects the selected count', async () => {
    const user = userEvent.setup()
    renderWithRouter(<BuilderScreen />)

    const dumbbells = screen.getByRole('button', { name: /^dumbbells$/i })
    const kettlebell = screen.getByRole('button', { name: /^kettlebell$/i })

    await user.click(dumbbells)
    await user.click(kettlebell)

    expect(dumbbells).toHaveAttribute('aria-pressed', 'true')
    expect(kettlebell).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/\d+ gear/i)).toBeInTheDocument()
  })

  it('keeps more options collapsed by default and reveals advanced controls when expanded', async () => {
    const user = userEvent.setup()
    renderWithRouter(<BuilderScreen />)

    expect(screen.queryByRole('spinbutton', { name: /work seconds/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /fine-tune timing and difficulty/i }))

    expect(screen.getByRole('group', { name: /fitness level/i })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: /work seconds/i })).toBeInTheDocument()
  })
})
