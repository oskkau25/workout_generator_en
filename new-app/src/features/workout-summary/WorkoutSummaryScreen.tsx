import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { GeneratedWorkout } from '@/domain/workouts/workout-types'
import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_NAMESPACE } from '@/services/storage/storage-keys'

const generatedWorkoutStore = new LocalStorageStore<{ id: string; workout: GeneratedWorkout }>(
  `${STORAGE_NAMESPACE}.generated-workout`,
)

function labelize(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function WorkoutSummaryScreen() {
  const { workoutId } = useParams()
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null)

  useEffect(() => {
    let cancelled = false

    generatedWorkoutStore.load().then((stored) => {
      if (!cancelled && stored && stored.id === workoutId) {
        setWorkout(stored.workout)
      }
    })

    return () => {
      cancelled = true
    }
  }, [workoutId])

  if (!workout) {
    return (
      <div className="screen-grid">
        <section className="card">
          <p className="card-eyebrow">Review before start</p>
          <h2>No generated workout found</h2>
          <p>Generate a workout from the builder first so this summary has real data to review.</p>
          <Link className="inline-link" to="/build">
            Back to builder
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="screen-grid summary-screen-grid">
      <section className="card summary-hero-card">
        <p className="card-eyebrow">Review before start</p>
        <h2>{workout.metadata.title}</h2>
        <p>
          {workout.metadata.estimatedMinutes} min · {labelize(workout.metadata.goal)} ·{' '}
          {labelize(workout.metadata.level)}
        </p>
        <div className="summary-stat-grid">
          <div className="summary-stat">
            <span>Format</span>
            <strong>{labelize(workout.metadata.format)}</strong>
          </div>
          <div className="summary-stat">
            <span>Exercises</span>
            <strong>{workout.metadata.totalExerciseSteps}</strong>
          </div>
          <div className="summary-stat">
            <span>Equipment</span>
            <strong>{workout.metadata.selectedEquipment.map(labelize).join(', ')}</strong>
          </div>
        </div>
      </section>

      {workout.blocks.map((block) => (
        <section key={block.id} className="card summary-block-card">
          <p className="card-eyebrow">{labelize(block.type)}</p>
          <h3>{block.title}</h3>
          <p>{block.summary}</p>
          <ul className="summary-step-list">
            {block.steps.map((step) => (
              <li key={step.id}>
                {step.kind === 'exercise'
                  ? `${step.exerciseId} · ${step.workSeconds}s${step.restSeconds > 0 ? ` / ${step.restSeconds}s rest` : ''}`
                  : `${step.label}${step.kind === 'format_marker' && step.description ? ` · ${step.description}` : ''}`}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="card">
        <p className="card-eyebrow">Next</p>
        <h3>Ticket 3.2 can build on this handoff</h3>
        <p>
          The builder now generates normalized workout data and routes cleanly into summary. The
          player start CTA can hook into this stored workout state next.
        </p>
        <Link className="inline-link" to="/build">
          Edit builder
        </Link>
      </section>
    </div>
  )
}
