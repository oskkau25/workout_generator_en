import { useEffect, useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StepProgress } from '@/components/ui/StepProgress'
import { SectionIcon } from '@/components/icons/workout-icons'
import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import { normalizeBuilderDraft } from '@/domain/builder/builder-normalizer'
import type {
  BuilderDraft,
  EquipmentId,
} from '@/domain/builder/builder-types'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { generateWorkout } from '@/domain/workouts/workout-generator'
import { analyticsGateway } from '@/services/analytics/analytics'
import { GeneratedWorkoutStore } from '@/services/storage/generated-workout-store'
import { builderDraftStore } from '@/services/storage/builder-draft-store'
import type { SavedWorkoutSession } from '@/services/storage/storage-types'
import { workoutSessionStore } from '@/services/storage/workout-session-store'
import {
  DURATION_OPTIONS,
  EQUIPMENT_OPTIONS,
  FORMAT_OPTIONS,
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
} from './builder-options'


function labelize(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function buildFooterRecap(draft: BuilderDraft) {
  const parts = [`${draft.duration.targetMinutes} min`, labelize(draft.goal), labelize(draft.format)]

  if (draft.selectedEquipment.length > 0) {
    parts.push(`${draft.selectedEquipment.length} gear`)
  } else {
    parts.push('Bodyweight')
  }

  return parts.join(' • ')
}

export function BuilderScreen() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<BuilderDraft>(() => createDefaultBuilderDraft())
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeSession, setActiveSession] = useState<SavedWorkoutSession | null>(null)
  const advancedPanelId = useId()
  const timingHelpId = useId()

  useEffect(() => {
    let cancelled = false

    Promise.all([builderDraftStore.load(), workoutSessionStore.loadActiveSession()]).then(([savedDraft, savedSession]) => {
      if (!cancelled) {
        if (savedDraft) {
          setDraft(savedDraft)
        }
        setActiveSession(savedSession)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void builderDraftStore.save(draft)
  }, [draft])

  const normalizedRequest = useMemo(() => normalizeBuilderDraft(draft), [draft])
  const footerRecap = buildFooterRecap(draft)
  const selectedGoal = GOAL_OPTIONS.find((option) => option.value === draft.goal) ?? GOAL_OPTIONS[0]
  const selectedFormat = FORMAT_OPTIONS.find((option) => option.value === draft.format) ?? FORMAT_OPTIONS[0]

  function updateDraft(updater: (current: BuilderDraft) => BuilderDraft) {
    setDraft((current) => updater(current))
  }

  function toggleEquipment(equipment: EquipmentId) {
    updateDraft((current) => ({
      ...current,
      selectedEquipment: current.selectedEquipment.includes(equipment)
        ? current.selectedEquipment.filter((item) => item !== equipment)
        : [...current.selectedEquipment, equipment],
    }))
  }

  async function handleGenerate() {
    setIsGenerating(true)
    const timestamp = new Date().toISOString()

    try {
      void analyticsGateway.track({
        type: 'builder_generate_clicked',
        timestamp,
        request: normalizedRequest,
      })

      const workout = generateWorkout(normalizedRequest, legacyExerciseCatalog)
      await GeneratedWorkoutStore.save({ id: workout.id, workout })
      void analyticsGateway.track({
        type: 'workout_generated',
        timestamp: new Date().toISOString(),
        workoutId: workout.id,
        format: workout.metadata.format,
        goal: workout.metadata.goal,
      })
      setActiveSession(null)
      navigate(`/workout/${workout.id}/summary`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="builder-screen">
      <StepProgress currentStep="build" />

      <section className="builder-hero builder-hero-card" aria-labelledby="builder-title">
        <h2 id="builder-title">Build your workout</h2>
        <p>Pick your goal, shape the session, and generate when it feels right.</p>
        {activeSession ? (
          <div className="summary-block builder-resume-block" role="status" aria-live="polite">
            <span>Resume available</span>
            <strong>{activeSession.workout.metadata.title} is still saved locally.</strong>
            <button
              type="button"
              className="secondary-action"
              onClick={() => navigate(`/workout/${activeSession.workout.id}/play`)}
            >
              Resume active workout
            </button>
          </div>
        ) : null}
      </section>

      <section className="builder-section-card" aria-labelledby="goal-heading">
        <div className="builder-section-intro">
          <p className="builder-step-label">1. Goal</p>
          <h3 id="goal-heading">What do you want to train?</h3>
          <p className="builder-section-hint">Start with the main focus so the generator can shape the whole session around it.</p>
        </div>

        <div className="builder-compact-choice-row" role="group" aria-label="Workout goal">
          {GOAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={draft.goal === option.value}
              className={draft.goal === option.value ? 'builder-compact-choice is-selected' : 'builder-compact-choice'}
              onClick={() => updateDraft((current) => ({ ...current, goal: option.value }))}
            >
              <span className="builder-compact-choice-icon" aria-hidden="true">
                {option.icon}
              </span>
              <span className="builder-compact-choice-label">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="builder-choice-detail-card" aria-live="polite">
          <span className="builder-mini-label">Selected goal</span>
          <strong>{selectedGoal.label}</strong>
          <p>{selectedGoal.detail}</p>
        </div>
      </section>

      <section className="builder-section-card" aria-labelledby="level-heading">
        <div className="builder-section-intro">
          <p className="builder-step-label">2. Level</p>
          <h3 id="level-heading">What is your fitness level?</h3>
          <p className="builder-section-hint">This shapes the exercise selection and overall demand. Most people start at Intermediate.</p>
        </div>

        <div className="chip-row" role="group" aria-label="Fitness level">
          {LEVEL_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={draft.level === option.value}
              className={draft.level === option.value ? 'choice-chip is-selected' : 'choice-chip'}
              onClick={() => updateDraft((current) => ({ ...current, level: option.value }))}
            >
              <strong>{option.label}</strong>
              <span>{option.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="builder-section-card" aria-labelledby="duration-heading">
        <div className="builder-section-intro">
          <p className="builder-step-label">3. Duration</p>
          <h3 id="duration-heading">How long should it be?</h3>
          <p className="builder-section-hint">Quick picks keep this tight, while the slider still gives you an exact target.</p>
        </div>

        <label className="builder-duration-slider-card">
          <div className="builder-duration-slider-topline">
            <span className="builder-mini-label">Target length</span>
            <strong>{draft.duration.targetMinutes} min</strong>
          </div>
          <input
            type="range"
            min="0"
            max={String(DURATION_OPTIONS.length - 1)}
            step="1"
            value={DURATION_OPTIONS.indexOf(draft.duration.targetMinutes as (typeof DURATION_OPTIONS)[number])}
            onChange={(event) =>
              updateDraft((current) => ({
                ...current,
                duration: { targetMinutes: DURATION_OPTIONS[Number(event.target.value)] },
              }))
            }
            aria-label="Workout duration"
          />
          <div className="builder-duration-scale" aria-hidden="true">
            {DURATION_OPTIONS.map((minutes) => (
              <span
                key={minutes}
                className={
                  draft.duration.targetMinutes === minutes
                    ? 'builder-duration-scale-mark is-selected'
                    : 'builder-duration-scale-mark'
                }
              >
                {minutes}
              </span>
            ))}
          </div>
        </label>
      </section>

      <section className="builder-section-card builder-flow-card" aria-labelledby="format-heading">
        <div className="builder-section-intro">
          <p className="builder-step-label">4. Format</p>
          <h3 id="format-heading">How should the workout flow?</h3>
          <p className="builder-section-hint">Pick the pace first, then fine-tune the details below if you want more control.</p>
        </div>

        <div className="builder-compact-choice-row builder-compact-choice-row-tight" role="group" aria-label="Workout format">
          {FORMAT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={draft.format === option.value}
              className={draft.format === option.value ? 'builder-compact-choice is-selected' : 'builder-compact-choice'}
              onClick={() => updateDraft((current) => ({ ...current, format: option.value }))}
            >
              <span className="builder-compact-choice-icon" aria-hidden="true">
                {option.icon}
              </span>
              <span className="builder-compact-choice-label">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="builder-choice-detail-card" aria-live="polite">
          <span className="builder-mini-label">Selected format</span>
          <strong>{selectedFormat.label}</strong>
          <p>{selectedFormat.detail}</p>
        </div>

        <div className="builder-flow-strip" aria-label="Workout flow blocks">
          <div className="builder-flow-pill">
            <span className="builder-flow-pill-icon" aria-hidden="true"><SectionIcon type="warmup" /></span>
            <span>Warm-up</span>
          </div>
          <div className="builder-flow-pill">
            <span className="builder-flow-pill-icon" aria-hidden="true"><SectionIcon type="main" /></span>
            <span>Main block</span>
          </div>
          <div className="builder-flow-pill">
            <span className="builder-flow-pill-icon" aria-hidden="true"><SectionIcon type="cooldown" /></span>
            <span>Cool-down</span>
          </div>
        </div>
      </section>

      <section className="builder-section-card builder-equipment-section" aria-labelledby="equipment-heading">
        <div className="builder-section-intro">
          <div className="builder-section-topline">
            <div>
              <p className="builder-step-label">5. Equipment</p>
              <h3 id="equipment-heading">What do you have available?</h3>
              <p className="builder-section-hint">Leave everything off for bodyweight-only, or tap in the gear you actually want to use.</p>
            </div>
            <span className="mini-pill" aria-live="polite">
              {draft.selectedEquipment.length > 0 ? `${draft.selectedEquipment.length} selected` : 'Bodyweight'}
            </span>
          </div>
        </div>

        <div className="builder-equipment-grid" role="group" aria-label="Equipment options">
          {EQUIPMENT_OPTIONS.map((option) => {
            const selected = draft.selectedEquipment.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                aria-label={option.label}
                className={selected ? 'builder-equipment-choice is-selected' : 'builder-equipment-choice'}
                onClick={() => toggleEquipment(option.value)}
              >
                <span className="builder-equipment-choice-icon" aria-hidden="true">
                  {option.icon}
                </span>
                <span className="builder-equipment-choice-label">{option.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="builder-section-card builder-options-card" aria-labelledby="advanced-heading">
        <button
          type="button"
          className="builder-options-toggle"
          onClick={() => setAdvancedOpen((current) => !current)}
          aria-expanded={advancedOpen}
          aria-controls={advancedPanelId}
        >
          <span>
            <span className="builder-step-label">6. More options</span>
            <strong id="advanced-heading">Fine-tune timing and difficulty</strong>
            <span className="builder-options-toggle-hint">Open this only if you want to push the session harder or dial it back.</span>
          </span>
          <span>{advancedOpen ? 'Hide' : 'Show'}</span>
        </button>

        {advancedOpen ? (
          <div id={advancedPanelId} className="builder-options-panel">
            <div className="toggle-grid">
              {[
                ['includeWarmup', 'Include warm-up'],
                ['includeCooldown', 'Include cool-down'],
                ['allowExerciseRepeats', 'Allow exercise repeats'],
                ['preferBalancedMuscleSplit', 'Prefer balanced muscle split'],
              ].map(([key, label]) => (
                <label key={key} className="toggle-card">
                  <input
                    type="checkbox"
                    checked={draft.advanced[key as keyof BuilderDraft['advanced']] as boolean}
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        advanced: {
                          ...current.advanced,
                          [key]: event.target.checked,
                        },
                      }))
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <p id={timingHelpId} className="builder-help-text">
              Out-of-range values are clamped on generate. Tabata still plays back at 20s work and 10s rest.
            </p>

            <div className="field-grid">
              <label className="field-card">
                <span>Target intensity</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={draft.advanced.targetIntensity ?? 3}
                  aria-describedby={timingHelpId}
                  onChange={(event) =>
                    updateDraft((current) => ({
                      ...current,
                      advanced: {
                        ...current.advanced,
                        targetIntensity: Number(event.target.value) as 1 | 2 | 3 | 4 | 5,
                      },
                    }))
                  }
                />
                <strong>{draft.advanced.targetIntensity}/5</strong>
              </label>

              <label className="field-card">
                <span>Work seconds</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="10"
                  max="300"
                  value={draft.timing.workSeconds ?? 40}
                  aria-describedby={timingHelpId}
                  onChange={(event) =>
                    updateDraft((current) => ({
                      ...current,
                      timing: {
                        ...current.timing,
                        workSeconds: Number(event.target.value),
                      },
                    }))
                  }
                />
              </label>

              <label className="field-card">
                <span>Rest seconds</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="5"
                  max="180"
                  value={draft.timing.restSeconds ?? 20}
                  aria-describedby={timingHelpId}
                  onChange={(event) =>
                    updateDraft((current) => ({
                      ...current,
                      timing: {
                        ...current.timing,
                        restSeconds: Number(event.target.value),
                      },
                    }))
                  }
                />
              </label>
            </div>

            {draft.format === 'circuit' ? (
              <div className="field-grid">
                <label className="field-card">
                  <span>Rounds</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="2"
                    max="8"
                    value={draft.formatConfig.circuit?.rounds ?? 3}
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        formatConfig: {
                          ...current.formatConfig,
                          circuit: {
                            ...current.formatConfig.circuit,
                            rounds: Number(event.target.value),
                          },
                        },
                      }))
                    }
                  />
                </label>
                <label className="field-card">
                  <span>Exercises per round</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="3"
                    max="10"
                    value={draft.formatConfig.circuit?.exercisesPerRound ?? 5}
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        formatConfig: {
                          ...current.formatConfig,
                          circuit: {
                            ...current.formatConfig.circuit,
                            exercisesPerRound: Number(event.target.value),
                          },
                        },
                      }))
                    }
                  />
                </label>
                <label className="field-card">
                  <span>Round rest</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="5"
                    max="180"
                    value={draft.formatConfig.circuit?.roundRestSeconds ?? 60}
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        formatConfig: {
                          ...current.formatConfig,
                          circuit: {
                            ...current.formatConfig.circuit,
                            roundRestSeconds: Number(event.target.value),
                          },
                        },
                      }))
                    }
                  />
                </label>
              </div>
            ) : null}

            {draft.format === 'tabata' ? (
              <div className="field-grid">
                <label className="field-card">
                  <span>Tabata rounds</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="4"
                    max="12"
                    value={draft.formatConfig.tabata?.rounds ?? 8}
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        formatConfig: {
                          ...current.formatConfig,
                          tabata: {
                            ...current.formatConfig.tabata,
                            rounds: Number(event.target.value),
                          },
                        },
                      }))
                    }
                  />
                </label>
              </div>
            ) : null}

            {draft.format === 'pyramid' ? (
              <div className="field-grid">
                <label className="field-card">
                  <span>Pyramid levels</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="3"
                    max="7"
                    value={draft.formatConfig.pyramid?.levels ?? 5}
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        formatConfig: {
                          ...current.formatConfig,
                          pyramid: {
                            ...current.formatConfig.pyramid,
                            levels: Number(event.target.value),
                          },
                        },
                      }))
                    }
                  />
                </label>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="builder-action-bar" aria-labelledby="generate-heading" data-testid="builder-generate-area">
        <div className="builder-action-copy">
          <p className="builder-step-label">7. Generate</p>
          <h3 id="generate-heading">Generate your workout</h3>
          <p className="builder-action-summary">Quick recap before you go.</p>
          <p className="builder-help-text" role="status" aria-live="polite">
            {footerRecap}
          </p>
        </div>
        <button type="button" className="primary-action" onClick={() => void handleGenerate()} disabled={isGenerating}>
          {isGenerating ? 'Generating workout…' : 'Generate workout'}
        </button>
      </section>
    </div>
  )
}
