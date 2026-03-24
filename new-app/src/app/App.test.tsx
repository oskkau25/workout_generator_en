import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '@/app/App'
import { renderWithRouter } from '@/test/render-with-router'

describe('App shell routing', () => {
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
})
