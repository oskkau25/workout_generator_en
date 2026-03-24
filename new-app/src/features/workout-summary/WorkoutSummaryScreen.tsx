import { FeatureCard } from '@/components/ui/FeatureCard'

export function WorkoutSummaryScreen() {
  return (
    <div className="screen-grid">
      <FeatureCard
        eyebrow="Review before start"
        title="Workout summary shell"
        body="Reserved for generated workout metadata, warm-up/main/cool-down structure, edit/regenerate actions, and the start workout CTA."
      />
    </div>
  )
}
