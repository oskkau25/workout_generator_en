import { screen } from '@testing-library/react'
import { App } from '@/app/App'
import { renderWithRouter } from '@/test/render-with-router'

describe('App shell routing', () => {
  it('renders the builder shell on the default route', () => {
    renderWithRouter(<App />)

    expect(screen.getByRole('heading', { name: /react redesign foundation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /builder shell/i })).toBeInTheDocument()
  })

  it('renders the progress shell on /progress', () => {
    renderWithRouter(<App />, { route: '/progress' })

    expect(screen.getByRole('heading', { name: /progress shell/i })).toBeInTheDocument()
  })
})
