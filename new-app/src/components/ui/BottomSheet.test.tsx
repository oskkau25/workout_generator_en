import { screen } from '@testing-library/react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { renderWithRouter } from '@/test/render-with-router'

describe('BottomSheet', () => {
  it('renders only when open', () => {
    renderWithRouter(
      <BottomSheet isOpen={false} title="Settings" subtitle="Tune the player">
        <p>Sheet content</p>
      </BottomSheet>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Sheet content')).not.toBeInTheDocument()
  })

  it('renders the dialog content when open', () => {
    renderWithRouter(
      <BottomSheet isOpen title="Settings" subtitle="Tune the player">
        <p>Sheet content</p>
      </BottomSheet>,
    )

    expect(screen.getByRole('dialog', { name: /settings/i })).toBeInTheDocument()
    expect(screen.getByText('Sheet content')).toBeInTheDocument()
  })
})
