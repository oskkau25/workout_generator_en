import { FeatureCard } from '@/components/ui/FeatureCard'
import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'

const draft = createDefaultBuilderDraft()

export function BuilderScreen() {
  return (
    <div className="screen-grid">
      <FeatureCard
        eyebrow="Primary flow"
        title="Builder shell"
        body="This route is the v1 entry point for workout goal, duration, level, equipment, format, and progressive advanced controls."
      >
        <ul>
          <li>Goal: {draft.goal}</li>
          <li>Duration: {draft.duration.targetMinutes} min</li>
          <li>Format: {draft.format}</li>
          <li>Equipment default: {draft.selectedEquipment.join(', ')}</li>
        </ul>
      </FeatureCard>

      <FeatureCard
        eyebrow="Implementation note"
        title="Builder state boundary"
        body="Builder draft stays editable in the feature layer. Normalized generation requests will be produced by pure domain modules before the generator runs."
      />
    </div>
  )
}
