import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StepProgress } from '@/components/ui/StepProgress'
import type { BuilderDraft } from '@/domain/builder/builder-types'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { mapGeneratedWorkoutToSummaryViewModel } from '@/domain/workouts/workout-summary-mapper'
import type {
  GeneratedWorkout,
} from '@/domain/workouts/workout-types'
import type { WorkoutSummaryStepViewModel } from '@/domain/workouts/workout-summary-mapper'
import { GeneratedWorkoutStore, rehydrateBuilderDraftFromRequest } from '@/services/storage/generated-workout-store'
import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'
import { workoutSessionStore } from '@/services/storage/workout-session-store'
import { pickReplacementExercise } from './exercise-swap'

const builderDraftStore = new LocalStorageStore<BuilderDraft>(STORAGE_KEYS.builderDraft)

function normalizeKey(value: string) {
  return value.trim().toLowerCase()
}

function getSectionLabel(sectionId: string, sectionTitle: string, sectionEyebrow: string) {
  const merged = `${sectionId} ${sectionTitle} ${sectionEyebrow}`.toLowerCase()

  if (merged.includes('warm')) {
    return 'Warm-up'
  }

  if (merged.includes('cool')) {
    return 'Cool-down'
  }

  return 'Main block'
}

function buildRecapItems(summary: NonNullable<ReturnType<typeof mapGeneratedWorkoutToSummaryViewModel>>) {
  const recap: Array<{ label: string; value: string }> = []
  const duration = summary.stats.find((item) => item.label === 'Duration')
  const format = summary.stats.find((item) => item.label === 'Format')
  const level = summary.stats.find((item) => item.label === 'Level')
  const intensity = summary.intent.find((item) => item.label === 'Intensity')

  if (duration) recap.push(duration)
  if (format) recap.push(format)
  if (level) recap.push(level)
  if (intensity) recap.push(intensity)

  return recap
}

function createInitialExerciseSelections(summary: NonNullable<ReturnType<typeof mapGeneratedWorkoutToSummaryViewModel>>) {
  const selections: Record<string, string> = {}

  for (const section of summary.sections) {
    for (const step of section.steps) {
      if (step.kind === 'exercise') {
        selections[step.id] = step.title
      }
    }
  }

  return selections
}

function createWorkoutStepLookup(summary: NonNullable<ReturnType<typeof mapGeneratedWorkoutToSummaryViewModel>>) {
  const lookup = new Map<
    string,
    { sectionId: string; sectionTitle: string; sectionEyebrow: string; step: WorkoutSummaryStepViewModel }
  >()

  for (const section of summary.sections) {
    for (const step of section.steps) {
      lookup.set(step.id, {
        sectionId: section.id,
        sectionTitle: getSectionLabel(section.id, section.title, section.eyebrow),
        sectionEyebrow: section.eyebrow,
        step,
      })
    }
  }

  return lookup
}

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase())
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function WorkoutSummaryScreen() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null)
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

  const recapItems = useMemo(() => (summary ? buildRecapItems(summary) : []), [summary])

  async function handleEditSettings() {
    if (!workout) {
      return
    }

    await builderDraftStore.save(rehydrateBuilderDraftFromRequest(workout.sourceRequest))
    navigate('/build')
  }

  if (!workout || !summary) {
    return (
      <div className="screen-grid">
        <section className="card empty-state-card" role="alert">
          <p className="card-eyebrow">Check</p>
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
    <WorkoutJourneyReview
      key={workout.id}
      workout={workout}
      summary={summary}
      recapItems={recapItems}
      hasResumableSession={hasResumableSession}
      onEditSettings={handleEditSettings}
    />
  )
}

type WorkoutJourneyReviewProps = {
  workout: GeneratedWorkout
  summary: NonNullable<ReturnType<typeof mapGeneratedWorkoutToSummaryViewModel>>
  recapItems: Array<{ label: string; value: string }>
  hasResumableSession: boolean
  onEditSettings: () => Promise<void>
}

function WorkoutJourneyReview({
  workout,
  summary,
  recapItems,
  hasResumableSession,
  onEditSettings,
}: WorkoutJourneyReviewProps) {
  const exerciseLookup = useMemo(
    () => new Map(legacyExerciseCatalog.map((exercise) => [normalizeKey(exercise.name), exercise])),
    [],
  )
  const workoutStepLookup = useMemo(() => createWorkoutStepLookup(summary), [summary])
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([])
  const [expandedExerciseIds, setExpandedExerciseIds] = useState<string[]>([])
  const [exerciseSelections, setExerciseSelections] = useState<Record<string, string>>(() =>
    createInitialExerciseSelections(summary),
  )

  function toggleSection(sectionId: string, sectionStepIds: string[]) {
    setExpandedSectionIds((current) =>
      current.includes(sectionId) ? current.filter((item) => item !== sectionId) : [...current, sectionId],
    )

    setExpandedExerciseIds((current) =>
      current.some((id) => sectionStepIds.includes(id)) ? current.filter((id) => !sectionStepIds.includes(id)) : current,
    )
  }

  function toggleExercise(stepId: string) {
    setExpandedExerciseIds((current) =>
      current.includes(stepId) ? current.filter((item) => item !== stepId) : [...current, stepId],
    )
  }

  function getSelectedExerciseName(step: WorkoutSummaryStepViewModel) {
    return exerciseSelections[step.id] ?? step.title
  }

  function handleSwapExercise(stepId: string) {
    const stepContext = workoutStepLookup.get(stepId)
    if (!stepContext || stepContext.step.kind !== 'exercise') {
      return
    }

    const currentExerciseName = exerciseSelections[stepId] ?? stepContext.step.title
    const replacement = pickReplacementExercise(
      currentExerciseName,
      stepContext.sectionId,
      stepContext.sectionTitle,
      stepContext.sectionEyebrow,
      workout.sourceRequest,
      legacyExerciseCatalog,
    )

    if (!replacement) {
      return
    }

    setExerciseSelections((current) => ({
      ...current,
      [stepId]: replacement.name,
    }))

    setExpandedExerciseIds((current) => (current.includes(stepId) ? current : [...current, stepId]))
  }

  return (
    <div className="summary-layout summary-journey-layout">
      <StepProgress currentStep="check" />

      <section className="summary-hero-card summary-journey-hero" aria-label="Check workout summary">
        <p className="card-eyebrow">Check</p>
        <p className="builder-help-text">{summary.header.title}</p>
        <div className="summary-journey-recap" aria-label="Workout recap">
          {recapItems.map((item) => (
            <div key={item.label} className="summary-journey-recap-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="summary-journey-map" aria-labelledby="journey-heading">
        <div className="builder-section-topline">
          <div>
            <p className="card-eyebrow">Workout journey</p>
            <h3 id="journey-heading">Review the flow</h3>
          </div>
          <span className="mini-pill">{summary.header.generatedAtLabel}</span>
        </div>

        <div className="summary-timeline">
          {summary.sections.map((section, index) => {
            const sectionLabel = getSectionLabel(section.id, section.title, section.eyebrow)
            const sectionExerciseIds = section.steps
              .filter((step) => step.kind === 'exercise')
              .map((step) => step.id)
            const expanded = expandedSectionIds.includes(section.id)

            return (
              <section
                key={section.id}
                className={expanded ? 'summary-timeline-section is-expanded' : 'summary-timeline-section'}
                aria-labelledby={`section-${section.id}`}
              >
                <div className="summary-timeline-marker" aria-hidden="true">
                  <span>{index + 1}</span>
                </div>
                <div className="summary-timeline-content">
                  <button
                    type="button"
                    className="summary-timeline-toggle"
                    aria-expanded={expanded}
                    aria-controls={`section-panel-${section.id}`}
                    onClick={() => toggleSection(section.id, sectionExerciseIds)}
                  >
                    <div className="summary-timeline-toggle-copy">
                      <p className="card-eyebrow">{section.eyebrow}</p>
                      <h3 id={`section-${section.id}`}>{sectionLabel}</h3>
                      <p>{section.steps.length} items • {section.summary}</p>
                    </div>
                    <span className="mini-pill">{expanded ? 'Hide' : 'Show'}</span>
                  </button>

                  {expanded ? (
                    <div id={`section-panel-${section.id}`} className="summary-timeline-panel">
                      {section.hint ? <p className="summary-format-hint">{section.hint}</p> : null}
                      <div className="summary-step-stack">
                        {section.steps.map((step) => {
                          if (step.kind !== 'exercise') {
                            return (
                              <article
                                key={step.id}
                                className={
                                  step.kind === 'format_marker'
                                    ? 'summary-step-card summary-step-card-marker summary-step-card-journey'
                                    : 'summary-step-card summary-step-card-transition summary-step-card-journey'
                                }
                              >
                                <div className="summary-step-topline">
                                  <strong>{step.title}</strong>
                                  {step.badge ? <span className="summary-step-badge">{step.badge}</span> : null}
                                </div>
                                <p>{step.detail}</p>
                              </article>
                            )
                          }

                          const selectedExerciseName = getSelectedExerciseName(step)
                          const selectedExercise = exerciseLookup.get(normalizeKey(selectedExerciseName)) ?? null
                          const expandedExercise = expandedExerciseIds.includes(step.id)
                          const isSwapped = selectedExerciseName !== step.title
                          const title = selectedExercise?.name ?? step.title
                          const detail = selectedExercise?.coaching.shortInstruction ?? step.detail
                          const fullInstruction =
                            selectedExercise?.coaching.fullInstruction &&
                            selectedExercise.coaching.fullInstruction !== detail
                              ? selectedExercise.coaching.fullInstruction
                              : null

                          return (
                            <article key={step.id} className="summary-step-card summary-step-card-journey summary-exercise-card">
                              <button
                                type="button"
                                className="summary-exercise-toggle"
                                aria-expanded={expandedExercise}
                                aria-controls={`exercise-panel-${step.id}`}
                                onClick={() => toggleExercise(step.id)}
                              >
                                <span className="summary-exercise-silhouette" aria-hidden="true">
                                  {getInitials(title)}
                                </span>
                                <span className="summary-exercise-toggle-copy">
                                  <strong>{title}</strong>
                                  <span>{step.badge ?? 'Tap for details'}</span>
                                </span>
                                <span className="summary-exercise-toggle-meta">
                                  {isSwapped ? <span className="summary-step-badge summary-step-badge-swap">Swapped</span> : null}
                                  <span className="mini-pill">{expandedExercise ? 'Hide' : 'Details'}</span>
                                </span>
                              </button>

                              {expandedExercise ? (
                                <div id={`exercise-panel-${step.id}`} className="summary-exercise-panel">
                                  <p>{detail}</p>
                                  {fullInstruction ? <p className="summary-format-hint">{fullInstruction}</p> : null}
                                  {selectedExercise?.primaryMuscle ? (
                                    <span className="summary-step-meta">{titleCase(selectedExercise.primaryMuscle)}</span>
                                  ) : null}
                                  <div className="summary-exercise-actions">
                                    <button
                                      type="button"
                                      className="ghost-action"
                                      onClick={() => handleSwapExercise(step.id)}
                                    >
                                      Switch exercise
                                    </button>
                                    {isSwapped ? <span className="summary-step-badge summary-step-badge-swap">Swapped</span> : null}
                                  </div>
                                </div>
                              ) : null}
                            </article>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            )
          })}
        </div>

      </section>

      <section className="summary-actions-footer" aria-labelledby="summary-actions-title">
        <div className="summary-actions-footer-copy">
          <h3 id="summary-actions-title">Ready to start?</h3>
          <p className="builder-help-text">
            Start this workout now, or go back and adjust the settings first.
          </p>
        </div>
        <div className="summary-action-stack">
          <Link className="primary-action summary-primary-action" to={`/workout/${workout.id}/play`}>
            {hasResumableSession ? 'Resume workout' : 'Start workout'}
          </Link>
          <button type="button" className="secondary-action" onClick={() => void onEditSettings()}>
            Edit settings
          </button>
        </div>
      </section>
    </div>
  )
}
