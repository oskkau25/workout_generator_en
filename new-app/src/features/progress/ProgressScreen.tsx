import { FeatureCard } from '@/components/ui/FeatureCard'

export function ProgressScreen() {
  return (
    <div className="screen-grid">
      <FeatureCard
        eyebrow="Scoped v1 surface"
        title="Progress shell"
        body="Reserved for lightweight local history, recent sessions, and encouraging empty states without overbuilding analytics."
      />
    </div>
  )
}
