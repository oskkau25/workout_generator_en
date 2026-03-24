import { FeatureCard } from '@/components/ui/FeatureCard'

export function WorkoutPlayerScreen() {
  return (
    <div className="screen-grid">
      <FeatureCard
        eyebrow="Coach flow"
        title="Player shell"
        body="Reserved for the guided work/rest experience, progress, next-up context, pause/resume, and deterministic player state transitions."
      />
    </div>
  )
}
