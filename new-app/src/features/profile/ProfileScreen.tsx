import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FeatureCard } from '@/components/ui/FeatureCard'
import type { AccountProfile } from '@/services/accounts/account-types'
import { noopAccountGateway } from '@/services/accounts/noop-account-gateway'

export function ProfileScreen() {
  const [profile, setProfile] = useState<AccountProfile | null>(null)

  useEffect(() => {
    let cancelled = false

    noopAccountGateway.getCurrentProfile().then((nextProfile) => {
      if (!cancelled) {
        setProfile(nextProfile)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="screen-grid">
      <FeatureCard
        eyebrow="Future-ready seam"
        title={profile ? profile.displayName : 'Profile shell'}
        body="Settings live locally for now. Account sync, identity, and deeper personalization stay intentionally deferred until backend work is real."
      >
        <div className="summary-block" role="status" aria-live="polite">
          <span>{profile ? 'Signed-in account' : 'Current account state'}</span>
          <strong>{profile ? `Connected as ${profile.displayName}.` : 'No account connected yet.'}</strong>
          <p>
            This surface already reads through an account gateway seam, so real auth can plug in
            later without dragging account logic into the builder or player flow.
          </p>
          <Link className="secondary-action player-link-button" to="/build">
            Build a workout
          </Link>
        </div>
      </FeatureCard>
    </div>
  )
}
