import { screen } from '@testing-library/react'
import { StepProgress } from '@/components/ui/StepProgress'
import { renderWithRouter } from '@/test/render-with-router'

describe('StepProgress', () => {
  it('renders the default workout flow steps and active state', () => {
    renderWithRouter(<StepProgress currentStep="check" />)

    expect(screen.getByRole('navigation', { name: /workout flow steps/i })).toBeInTheDocument()
    expect(screen.getByText('Build')).toBeInTheDocument()
    expect(screen.getByText('Check')).toBeInTheDocument()
    expect(screen.getByText('Workout')).toBeInTheDocument()
    expect(screen.getByText('Check').closest('.step-progress-item')).toHaveClass('is-active')
  })
})
