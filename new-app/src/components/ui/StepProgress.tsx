export type StepProgressKey = 'build' | 'check' | 'workout'

export interface StepProgressItem {
  id: StepProgressKey
  label: string
}

interface StepProgressProps {
  currentStep: StepProgressKey
  steps?: StepProgressItem[]
  ariaLabel?: string
}

const defaultSteps: StepProgressItem[] = [
  { id: 'build', label: 'Build' },
  { id: 'check', label: 'Check' },
  { id: 'workout', label: 'Workout' },
]

function getStepOrder(steps: StepProgressItem[]) {
  return steps.map((step) => step.id)
}

function getStepState(stepId: StepProgressKey, currentStep: StepProgressKey, order: StepProgressKey[]) {
  const stepIndex = order.indexOf(stepId)
  const currentIndex = order.indexOf(currentStep)

  if (stepIndex < currentIndex) {
    return 'complete'
  }

  if (stepIndex === currentIndex) {
    return 'active'
  }

  return 'upcoming'
}

export function StepProgress({ currentStep, steps = defaultSteps, ariaLabel = 'Workout flow steps' }: StepProgressProps) {
  const order = getStepOrder(steps)

  return (
    <nav className="step-progress" aria-label={ariaLabel}>
      {steps.map((step, index) => (
        <div key={step.id} className={`step-progress-item is-${getStepState(step.id, currentStep, order)}`}>
          <span className="step-progress-index" aria-hidden="true">
            {index + 1}
          </span>
          <span className="step-progress-label">{step.label}</span>
        </div>
      ))}
    </nav>
  )
}
