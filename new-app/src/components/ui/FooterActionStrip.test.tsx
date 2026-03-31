import { screen } from '@testing-library/react'
import { FooterActionStrip } from '@/components/ui/FooterActionStrip'
import { renderWithRouter } from '@/test/render-with-router'

describe('FooterActionStrip', () => {
  it('renders the footer heading, description, and actions', () => {
    renderWithRouter(
      <FooterActionStrip
        title="Ready to start"
        description="Start this workout when you are ready."
        primaryAction={<button type="button">Primary action</button>}
        secondaryActions={<button type="button">Secondary action</button>}
      >
        <button type="button">Extra action</button>
      </FooterActionStrip>,
    )

    expect(screen.getByRole('heading', { name: /ready to start/i })).toBeInTheDocument()
    expect(screen.getByText(/start this workout when you are ready/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /primary action/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /secondary action/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /extra action/i })).toBeInTheDocument()
  })
})
