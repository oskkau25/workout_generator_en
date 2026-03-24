import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SavedWorkoutSession, WorkoutHistoryEntry } from '@/services/storage/storage-types'
import { summarizeHistory } from '@/services/storage/progress-helpers'
import { workoutHistoryStore } from '@/services/storage/workout-history-store'
import { workoutSessionStore } from '@/services/storage/workout-session-store'

function formatMinutes(totalSeconds: number) {
  return `${Math.round(totalSeconds / 60)} min`
}

function formatDate(value?: string) {
  if (!value) {
    return 'Just now'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Just now'
  }

  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ProgressScreen() {
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([])
  const [activeSession, setActiveSession] = useState<SavedWorkoutSession | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([workoutHistoryStore.list(6), workoutSessionStore.loadActiveSession()]).then(([entries, session]) => {
      if (!cancelled) {
        setHistory(entries)
        setActiveSession(session)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => summarizeHistory(history), [history])
  const hasData = history.length > 0

  return (
    <div className="screen-grid progress-screen">
      <section className="card progress-hero-card" aria-labelledby="progress-title">
        <p className="card-eyebrow">Scoped v1 surface</p>
        <h2 id="progress-title">Your progress</h2>
        <p>
          Lightweight local momentum for now: recent workouts, a resumable session when it exists,
          and just enough stats to make the app feel alive without pretending there is backend
          analytics already.
        </p>
        <div className="summary-action-stack">
          <Link className="primary-action summary-primary-action" to="/build">
            Build a workout
          </Link>
          {activeSession ? (
            <Link className="secondary-action player-link-button" to={`/workout/${activeSession.workout.id}/play`}>
              Resume active workout
            </Link>
          ) : null}
        </div>
      </section>

      <section className="card" aria-labelledby="momentum-title">
        <div className="section-heading">
          <div>
            <p className="card-eyebrow">Momentum snapshot</p>
            <h3 id="momentum-title">Local stats</h3>
          </div>
          <span className="mini-pill">Stored on this device</span>
        </div>
        <div className="summary-stat-grid">
          <div className="summary-stat">
            <span>Completed workouts</span>
            <strong>{stats.completedCount}</strong>
          </div>
          <div className="summary-stat">
            <span>Total active time</span>
            <strong>{formatMinutes(stats.totalSeconds)}</strong>
          </div>
          <div className="summary-stat">
            <span>Formats used</span>
            <strong>{stats.uniqueFormats}</strong>
          </div>
          <div className="summary-stat">
            <span>Status</span>
            <strong>{activeSession ? 'Resume available' : hasData ? 'Fresh start ready' : 'No history yet'}</strong>
          </div>
        </div>
      </section>

      {activeSession ? (
        <section className="card" aria-labelledby="resume-title">
          <div className="section-heading">
            <div>
              <p className="card-eyebrow">Resume</p>
              <h3 id="resume-title">Active workout saved</h3>
            </div>
            <span className="mini-pill">{activeSession.playerState.timer.phase.toUpperCase()}</span>
          </div>
          <p>
            {activeSession.workout.metadata.title} is still saved locally at step{' '}
            {Math.min(
              activeSession.playerState.progress.currentStepIndex + 1,
              activeSession.playerState.progress.totalSteps,
            )}{' '}
            of {activeSession.playerState.progress.totalSteps}.
          </p>
          <Link className="secondary-action player-link-button" to={`/workout/${activeSession.workout.id}/play`}>
            Continue workout
          </Link>
        </section>
      ) : null}

      <section className="card" aria-labelledby="history-title">
        <div className="section-heading">
          <div>
            <p className="card-eyebrow">Recent workouts</p>
            <h3 id="history-title">{hasData ? 'Latest sessions on this device' : 'Nothing logged yet'}</h3>
          </div>
        </div>

        {hasData ? (
          <div className="summary-step-stack" aria-live="polite">
            {history.map((entry) => (
              <article key={entry.id} className="summary-step-card">
                <div className="summary-step-topline">
                  <strong>{entry.summary.workoutTitle}</strong>
                  <span className="summary-step-badge">{entry.status === 'completed' ? 'Done' : 'Ended early'}</span>
                </div>
                <p>
                  {entry.summary.format.toUpperCase()} • {entry.summary.goal.replace(/_/g, ' ')} • {formatMinutes(entry.summary.totalDurationSeconds)}
                </p>
                <span className="summary-step-meta">
                  {entry.status === 'completed' ? `Completed ${formatDate(entry.completedAt)}` : `Saved ${formatDate(entry.startedAt)}`}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="summary-block empty-state-card" role="status" aria-live="polite">
            <span>Strong empty state</span>
            <strong>Finish your first workout and this screen starts feeling useful immediately.</strong>
            <p>
              Generate a session, run it through the player, and come back here for recent workouts
              and lightweight stats.
            </p>
            <Link className="inline-link" to="/build">
              Go back to the builder
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
