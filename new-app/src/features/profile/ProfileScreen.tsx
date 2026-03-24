import { FeatureCard } from '@/components/ui/FeatureCard'

export function ProfileScreen() {
  return (
    <div className="screen-grid">
      <FeatureCard
        eyebrow="Future-ready seam"
        title="Profile shell"
        body="Reserved for settings, preferences, and future account integration without making auth a v1 dependency."
      />
    </div>
  )
}
