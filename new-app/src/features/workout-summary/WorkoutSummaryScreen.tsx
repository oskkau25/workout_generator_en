import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { BuilderDraft } from '@/domain/builder/builder-types'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { generateWorkout } from '@/domain/workouts/workout-generator'
import { mapGeneratedWorkoutToSummaryViewModel } from '@/domain/workouts/workout-summary-mapper'
import type { GeneratedWorkout } from '@/domain/workouts/workout-types'
import { GeneratedWorkoutStore, rehydrateBuilderDraftFromRequest } from '@/services/storage/generated-workout-store'
import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'
import { workoutSessionStore } from '@/services/storage/workout-session-store'

const builderDraftStore = new LocalStorageStore<BuilderDraft>(STORAGE_KEYS.builderDraft)

function cardClassName(kind: 'exercise' | 'format_marker' | 'transition') {
  if (kind === 'format_marker') {
    return 'summary-step-card summary-step-card-marker'
  }

  if (kind === 'transition') {
    return 'summary-step-card summary-step-card-transition'
  }

  return 'summary-step-card'
}

export function WorkoutSummaryScreen() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [hasResumableSession, setHasResumableSession] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([GeneratedWorkoutStore.load(), workoutSessionStore.loadActiveSession()]).then(
      ([stored, savedSession]) => {
        if (!cancelled) {
          if (stored && stored.id === workoutId) {
            setWorkout(stored.workout)
          }
          setHasResumableSession(Boolean(savedSession && savedSession.workout.id === workoutId))
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [workoutId])

  const summary = useMemo(
    () => (workout ? mapGeneratedWorkoutToSummaryViewModel(workout, legacyExerciseCatalog) : null),
    [workout],
  )

  async function handleEditSettings() {
    if (!workout) {
      return
    }

    await builderDraftStore.save(rehydrateBuilderDraftFromRequest(workout.sourceRequest))
    navigate('/build')
  }

  async function handleRegenerate() {
    if (!workout) {
      return
    }

    setIsRegenerating(true)
    try {
      const nextWorkout = generateWorkout(workout.sourceRequest, legacyExerciseCatalog)
      await GeneratedWorkoutStore.save({ id: nextWorkout.id, workout: nextWorkout })
      setWorkout(nextWorkout)
      navigate(`/workout/${nextWorkout.id}/summary`, { replace: true })
    } finally {
      setIsRegenerating(false)
    }
  }

  if (!workout || !summary) {
    return (
      <div className="screen-grid">
        <section className="card empty-state-card" role="alert">
          <p className="card-eyebrow">Review before start</p>
          <h2>No generated workout found</h2>
          <p>Generate a workout from the builder first so this summary has real data to review.</p>
          <div className="summary-action-stack">
            <Link className="primary-action summary-primary-action" to="/build">
              Build a workout
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="summary-layout">
      <section className="card summary-hero-card" aria-labelledby="summary-title">
        <p className="card-eyebrow">Review before start</p>
        <h2 id="summary-title">{summary.header.title}</h2>
        <p className="summary-hero-subtitle">{summary.header.subtitle}</p>
        <p className="summary-generated-at">{summary.header.generatedAtLabel}</p>
      </section>

      <aside className="summary-sidebar">
        <section className="card summary-sidebar-card" aria-labelledby="metadata-title">
          <div className="section-heading">
            <div>
              <p className="card-eyebrow">Workout metadata</p>
              <h3 id="metadata-title">Quick scan</h3>
            </div>
            <span className="mini-pill">Ready to start</span>
          </div>
          <div className="summary-stat-grid">
            {summary.stats.map((stat) => (
              <div key={stat.label} className="summary-stat">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="card summary-sidebar-card" aria-labelledby="intent-title">
          <p className="card-eyebrow">Intent recap</p>
          <h3 id="intent-title">This is what you asked for</h3>
          <div className="summary-intent-grid">
            {summary.intent.map((item) => (
              <div key={item.label} className="summary-intent-item">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="card summary-actions-card" aria-labelledby="summary-actions-title">
          <p className="card-eyebrow">Actions</p>
          <h3 id="summary-actions-title">Start now or tweak it</h3>
          <div className="summary-action-stack">
            <Link className="primary-action summary-primary-action" to={`/workout/${workout.id}/play`}>
              {hasResumableSession ? 'Resume workout' : 'Start workout'}
            </Link>
            <button type="button" className="secondary-action" onClick={() => void handleEditSettings()}>
              Edit settings
            </button>
            <button
              type="button"
              className="ghost-action"
              onClick={() => void handleRegenerate()}
              disabled={isRegenerating}
              aria-describedby="regenerate-note"
            >
              {isRegenerating ? 'Regenerating…' : 'Regenerate workout'}
            </button>
            <p id="regenerate-note" className="builder-help-text">
              Regenerate keeps your current request settings and replaces only this generated result.
            </p>
          </div>
        </section>
      </aside>

      <div className="summary-content-stack" aria-live="polite">
        {summary.sections.map((section) => (
          <section key={section.id} className="card summary-block-card" aria-labelledby={`section-${section.id}`}>
            <div className="summary-section-heading">
              <div>
                <p className="card-eyebrow">{section.eyebrow}</p>
                <h3 id={`section-${section.id}`}>{section.title}</h3>
              </div>
              <span className="mini-pill">{section.steps.length} items</span>
            </div>
            <p>{section.summary}</p>
            {section.hint ? <p className="summary-format-hint">{section.hint}</p> : null}
            <div className="summary-step-stack">
              {section.steps.map((step) => (
                <article key={step.id} className={cardClassName(step.kind)}>
                  <div className="summary-step-topline">
                    <strong>{step.title}</strong>
                    {step.badge ? <span className="summary-step-badge">{step.badge}</span> : null}
                  </div>
                  <p>{step.detail}</p>
                  {step.meta ? <span className="summary-step-meta">{step.meta}</span> : null}
                </article>
              ))}
            </div>
          </section>
        ))}

        {summary.diagnostics.length > 0 ? (
          <section className="card summary-diagnostics-card" aria-labelledby="diagnostics-title">
            <p className="card-eyebrow">Notes</p>
            <h3 id="diagnostics-title">Generation notes</h3>
            <ul className="summary-note-list">
              {summary.diagnostics.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
