import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StepProgress } from '@/components/ui/StepProgress'
import { BodyMapFigure } from '@/components/body-map/BodyMapFigure'
import type { BuilderDraft } from '@/domain/builder/builder-types'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { formatBodyRegionList, getMovementCategoryFromPattern, getMovementPatternLabel, titleCase, type MovementIconCategory } from '@/domain/exercises/exercise-taxonomy'
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
    {
      sectionId: string
      sectionTitle: string
      sectionEyebrow: string
      sectionSummary: string
      step: WorkoutSummaryStepViewModel
    }
  >()

  for (const section of summary.sections) {
    for (const step of section.steps) {
      lookup.set(step.id, {
        sectionId: section.id,
        sectionTitle: getSectionLabel(section.id, section.title, section.eyebrow),
        sectionEyebrow: section.eyebrow,
        sectionSummary: section.summary,
        step,
      })
    }
  }

  return lookup
}


function renderMovementIcon(category: MovementIconCategory) {
  switch (category) {
    case 'squat':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="11" r="4" /><path d="M24 16v8l-6 5m6-5 6 5m-10 1v8m8-8v8m-14 0h20" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'hinge':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="28" cy="10" r="4" /><path d="M28 15v9l-8 5m8-5 7 3M20 29l-4 9m11-8 5 8M10 32h10" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'push':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 28h24M18 22l6-4 6 4M18 34l6-4 6 4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'pull':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 16h28m0 0-5-5m5 5-5 5M38 32H20m0 0 5-5m-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'plank':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="14" cy="18" r="3" /><path d="M17 20h13l8 8M30 20l-8 12M14 31h6m14 0h4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'lunge':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="10" r="4" /><path d="M24 15v8l-6 6m6-6 7 4m-13 2h9m-9 0-3 9m12-9 7 9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'rotation':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10a14 14 0 0 1 12 7m0 0v-5m0 5h-5M24 38a14 14 0 0 1-12-7m0 0v5m0-5h5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M24 16v16" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg>
    case 'jump':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 11v18m0 0-7-7m7 7 7-7M14 37h20" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'carry':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 18h7v6h-7zm17 0h7v6h-7zM19 21h10M24 12v9m0 3v12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'mobility_stretch':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 30c2-7 7-12 11-12 6 0 11 6 11 12M24 18V8m-8 25 8 7 8-7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'floor_core':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 30h14l8-8 6 6M16 30l6 8m12-10 4 10" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    default:
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="3.2" /><path d="M24 18v6l4 4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
}

function getSectionIcon(sectionLabel: string) {
  if (sectionLabel === 'Warm-up') return 'warmup'
  if (sectionLabel === 'Cool-down') return 'cooldown'
  return 'main'
}

function renderSectionIcon(type: 'warmup' | 'main' | 'cooldown') {
  switch (type) {
    case 'warmup':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 31c2-7 7-12 9-12s7 5 9 12M24 18V9m-5 23 5 6 5-6" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'cooldown':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 24c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9Zm9-15v4m0 22v4m15-15h-4M13 24H9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    default:
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10 14 27h8l-2 11 14-19h-8l2-9Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
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
  const [recentlySwappedExerciseIds, setRecentlySwappedExerciseIds] = useState<string[]>([])
  const [lastSwapMessage, setLastSwapMessage] = useState<string | null>(null)
  const [exerciseSelections, setExerciseSelections] = useState<Record<string, string>>(() =>
    createInitialExerciseSelections(summary),
  )

  useEffect(() => {
    if (recentlySwappedExerciseIds.length === 0) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setRecentlySwappedExerciseIds([])
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [recentlySwappedExerciseIds])

  useEffect(() => {
    if (!lastSwapMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setLastSwapMessage(null)
    }, 2400)

    return () => window.clearTimeout(timeoutId)
  }, [lastSwapMessage])

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

    setLastSwapMessage(`Swapped ${currentExerciseName} for ${replacement.name} in ${stepContext.sectionTitle}.`)

    setRecentlySwappedExerciseIds((current) =>
      current.includes(stepId) ? current : [...current, stepId],
    )

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
          <div className="summary-journey-heading">
            <p className="card-eyebrow">Workout journey</p>
            <h3 id="journey-heading">Review the flow</h3>
            <p className="builder-help-text">
              Sections stay collapsed until you open them, so you can scan the full session first and only dive into details where needed.
            </p>
          </div>
          <span className="mini-pill">{summary.header.generatedAtLabel}</span>
        </div>

        {lastSwapMessage ? (
          <div className="summary-swap-feedback" role="status" aria-live="polite">
            <strong>Exercise updated</strong>
            <span>{lastSwapMessage}</span>
          </div>
        ) : null}

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
                      <div className="summary-timeline-heading-row">
                        <span className="summary-section-icon" aria-hidden="true">{renderSectionIcon(getSectionIcon(sectionLabel))}</span>
                        <h3 id={`section-${section.id}`}>{sectionLabel}</h3>
                        <span className="summary-section-count">{section.steps.length} items</span>
                      </div>
                      <p>{section.summary}</p>
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
                          const wasRecentlySwapped = recentlySwappedExerciseIds.includes(step.id)
                          const title = selectedExercise?.name ?? step.title
                          const detail = selectedExercise?.coaching.shortInstruction ?? step.detail
                          const movementCategory = selectedExercise?.movementPattern
                            ? getMovementCategoryFromPattern(selectedExercise.movementPattern)
                            : 'general'
                          const fullInstruction =
                            selectedExercise?.coaching.fullInstruction &&
                            selectedExercise.coaching.fullInstruction !== detail
                              ? selectedExercise.coaching.fullInstruction
                              : null

                          return (
                            <article
                              key={step.id}
                              className={
                                wasRecentlySwapped
                                  ? 'summary-step-card summary-step-card-journey summary-exercise-card is-just-swapped'
                                  : 'summary-step-card summary-step-card-journey summary-exercise-card'
                              }
                              data-swapped={isSwapped || undefined}
                              data-just-swapped={wasRecentlySwapped || undefined}
                            >
                              <button
                                type="button"
                                className="summary-exercise-toggle"
                                aria-expanded={expandedExercise}
                                aria-controls={`exercise-panel-${step.id}`}
                                onClick={() => toggleExercise(step.id)}
                              >
                                <span className="summary-exercise-silhouette" aria-hidden="true">
                                  {renderMovementIcon(movementCategory)}
                                </span>
                                <span className="summary-exercise-toggle-copy">
                                  <strong>{title}</strong>
                                  <span>{detail}</span>
                                  <span className="summary-chip-row">
                                    {selectedExercise?.movementPattern ? <span className="compact-chip">{getMovementPatternLabel(selectedExercise.movementPattern)}</span> : null}
                                    {selectedExercise?.primaryMuscle ? <span className="compact-chip">{titleCase(selectedExercise.primaryMuscle)}</span> : null}
                                    {step.badge ? <span className="compact-chip">{step.badge}</span> : null}
                                  </span>
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
                                  <div className="summary-chip-row">
                                    {selectedExercise?.movementPattern ? (
                                      <span className="summary-step-meta">{getMovementPatternLabel(selectedExercise.movementPattern)}</span>
                                    ) : null}
                                    {selectedExercise?.primaryMuscle ? (
                                      <span className="summary-step-meta">{titleCase(selectedExercise.primaryMuscle)}</span>
                                    ) : null}
                                    {selectedExercise?.bodyMap ? (
                                      <span className="summary-step-meta">{formatBodyRegionList(selectedExercise.bodyMap.primary)}</span>
                                    ) : null}
                                  </div>
                                  {selectedExercise?.bodyMap ? (
                                    <div className="summary-body-map-block">
                                      <BodyMapFigure
                                        compact
                                        primary={selectedExercise.bodyMap.primary}
                                        secondary={selectedExercise.bodyMap.secondary}
                                      />
                                      <div className="summary-body-map-copy">
                                        <span className="card-eyebrow">Targeted areas</span>
                                        <strong>Body map</strong>
                                        <span className="summary-body-map-copy-line">Primary: {formatBodyRegionList(selectedExercise.bodyMap.primary)}</span>
                                        {selectedExercise.bodyMap.secondary.length > 0 ? (
                                          <span className="summary-body-map-copy-line">Secondary: {formatBodyRegionList(selectedExercise.bodyMap.secondary)}</span>
                                        ) : null}
                                      </div>
                                    </div>
                                  ) : null}
                                  <div className="summary-exercise-actions">
                                    <button
                                      type="button"
                                      className="ghost-action"
                                      onClick={() => handleSwapExercise(step.id)}
                                    >
                                      Switch exercise
                                    </button>
                                    {isSwapped ? (
                                      <span className="summary-swap-inline-copy">
                                        Updated from {step.title}
                                      </span>
                                    ) : (
                                      <span className="summary-swap-inline-copy">Want a better fit? Swap this move.</span>
                                    )}
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
