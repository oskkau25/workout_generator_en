import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StepProgress } from '@/components/ui/StepProgress'
import { BodyMapFigure } from '@/components/body-map/BodyMapFigure'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import type { ExerciseDefinition } from '@/domain/exercises/exercise-types'
import { formatBodyRegionList, getExpandedInstruction, getMovementCategoryFromPattern, getMovementPatternLabel, titleCase } from '@/domain/exercises/exercise-taxonomy'
import { MovementIcon, SectionIcon, type WorkoutSectionType } from '@/components/icons/workout-icons'
import { mapGeneratedWorkoutToSummaryViewModel } from '@/domain/workouts/workout-summary-mapper'
import type {
  GeneratedWorkout,
} from '@/domain/workouts/workout-types'
import type { WorkoutSummaryStepViewModel } from '@/domain/workouts/workout-summary-mapper'
import { GeneratedWorkoutStore, rehydrateBuilderDraftFromRequest } from '@/services/storage/generated-workout-store'
import { builderDraftStore } from '@/services/storage/builder-draft-store'
import { workoutSessionStore } from '@/services/storage/workout-session-store'
import { pickReplacementExercise } from './exercise-swap'

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

function applySwapsToWorkout(
  source: GeneratedWorkout,
  swaps: Record<string, ExerciseDefinition>,
): GeneratedWorkout {
  if (Object.keys(swaps).length === 0) {
    return source
  }

  return {
    ...source,
    playback: {
      ...source.playback,
      steps: source.playback.steps.map((step) => {
        const swap = swaps[step.id]
        return swap ? { ...step, exerciseId: swap.id } : step
      }),
    },
    blocks: source.blocks.map((block) => ({
      ...block,
      steps: block.steps.map((step) => {
        if (step.kind !== 'exercise') {
          return step
        }
        const swap = swaps[step.id]
        return swap ? { ...step, exerciseId: swap.id } : step
      }),
    })),
  }
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

function getSectionIcon(sectionLabel: string): WorkoutSectionType {
  if (sectionLabel === 'Warm-up') return 'warmup'
  if (sectionLabel === 'Cool-down') return 'cooldown'
  return 'main'
}

export function WorkoutSummaryScreen() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null)
  const [hasResumableSession, setHasResumableSession] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.all([GeneratedWorkoutStore.load(), workoutSessionStore.loadActiveSession()]).then(
      ([stored, savedSession]) => {
        if (!cancelled) {
          if (stored && stored.id === workoutId) {
            setWorkout(stored.workout)
          }
          setHasResumableSession(Boolean(savedSession && savedSession.workout.id === workoutId))
          setIsLoading(false)
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

  if (isLoading) {
    return (
      <div className="screen-grid">
        <section className="card" role="status" aria-live="polite">
          <p className="card-eyebrow">Check</p>
          <h2>Loading your workout...</h2>
        </section>
      </div>
    )
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
  const navigate = useNavigate()
  const exerciseLookup = useMemo(
    () => new Map(legacyExerciseCatalog.map((exercise) => [normalizeKey(exercise.name), exercise])),
    [],
  )
  const workoutStepLookup = useMemo(() => createWorkoutStepLookup(summary), [summary])
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([])
  const [expandedExerciseIds, setExpandedExerciseIds] = useState<string[]>([])
  const [recentlySwappedExerciseIds, setRecentlySwappedExerciseIds] = useState<string[]>([])
  const [lastSwapMessage, setLastSwapMessage] = useState<string | null>(null)
  const [exerciseSwaps, setExerciseSwaps] = useState<Record<string, ExerciseDefinition>>({})

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

  function handleSwapExercise(stepId: string) {
    const stepContext = workoutStepLookup.get(stepId)
    if (!stepContext || stepContext.step.kind !== 'exercise') {
      return
    }

    const currentExerciseName = exerciseSwaps[stepId]?.name ?? stepContext.step.title
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

    setExerciseSwaps((current) => ({ ...current, [stepId]: replacement }))
    setLastSwapMessage(`Swapped ${currentExerciseName} for ${replacement.name} in ${stepContext.sectionTitle}.`)
    setRecentlySwappedExerciseIds((current) =>
      current.includes(stepId) ? current : [...current, stepId],
    )
    setExpandedExerciseIds((current) => (current.includes(stepId) ? current : [...current, stepId]))
  }

  async function handleStartWorkout() {
    const hasSwaps = Object.keys(exerciseSwaps).length > 0

    if (hasSwaps) {
      const patched = applySwapsToWorkout(workout, exerciseSwaps)
      await GeneratedWorkoutStore.save({ id: patched.id, workout: patched })
      await workoutSessionStore.clearActiveSession()
    }

    navigate(`/workout/${workout.id}/play`)
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
                        <span className="summary-section-icon" aria-hidden="true"><SectionIcon type={getSectionIcon(sectionLabel)} /></span>
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

                          const swappedExercise = exerciseSwaps[step.id] ?? null
                          const selectedExercise = swappedExercise ?? (exerciseLookup.get(normalizeKey(step.title)) ?? null)
                          const expandedExercise = expandedExerciseIds.includes(step.id)
                          const isSwapped = swappedExercise !== null
                          const wasRecentlySwapped = recentlySwappedExerciseIds.includes(step.id)
                          const title = selectedExercise?.name ?? step.title
                          const detail = selectedExercise?.coaching.shortInstruction ?? step.detail
                          const expandedInstruction = getExpandedInstruction(
                            selectedExercise?.coaching.fullInstruction,
                            selectedExercise?.coaching.shortInstruction,
                          )
                          const movementCategory = selectedExercise?.movementPattern
                            ? getMovementCategoryFromPattern(selectedExercise.movementPattern)
                            : 'general'
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
                                  <MovementIcon category={movementCategory} />
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
                                  {expandedInstruction ? <p className="summary-format-hint">{expandedInstruction}</p> : null}
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
          <button
            type="button"
            className="primary-action summary-primary-action"
            onClick={() => void handleStartWorkout()}
          >
            {hasResumableSession && Object.keys(exerciseSwaps).length === 0 ? 'Resume workout' : 'Start workout'}
          </button>
          <button type="button" className="secondary-action" onClick={() => void onEditSettings()}>
            Edit settings
          </button>
        </div>
      </section>
    </div>
  )
}
