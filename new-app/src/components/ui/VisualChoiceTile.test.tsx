import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VisualChoiceTile } from '@/components/ui/VisualChoiceTile'
import { renderWithRouter } from '@/test/render-with-router'

describe('VisualChoiceTile', () => {
  it('shows the icon, label, and selected state', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderWithRouter(
      <VisualChoiceTile icon="FB" title="Full body" detail="Balanced" selected={false} onClick={onClick} />,
    )

    await user.click(screen.getByRole('button', { name: /full body/i }))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByText('FB')).toBeInTheDocument()
    expect(screen.getByText('Full body')).toBeInTheDocument()
    expect(screen.getByText('Balanced')).toBeInTheDocument()
  })
})
