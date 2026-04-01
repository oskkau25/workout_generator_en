import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { StepProgress } from '@/components/ui/StepProgress'
import { createDefaultBuilderDraft } from '@/domain/builder/builder-defaults'
import { normalizeBuilderDraft } from '@/domain/builder/builder-normalizer'
import type {
  BuilderDraft,
  EquipmentId,
  FitnessLevel,
  WorkoutFormat,
  WorkoutGoal,
} from '@/domain/builder/builder-types'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'
import { generateWorkout } from '@/domain/workouts/workout-generator'
import { analyticsGateway } from '@/services/analytics/analytics'
import { GeneratedWorkoutStore } from '@/services/storage/generated-workout-store'
import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'
import type { SavedWorkoutSession } from '@/services/storage/storage-types'
import { workoutSessionStore } from '@/services/storage/workout-session-store'

const builderDraftStore = new LocalStorageStore<BuilderDraft>(STORAGE_KEYS.builderDraft)

const goalOptions: Array<{ value: WorkoutGoal; label: string; detail: string; icon: string }> = [
  { value: 'full_body', label: 'Full body', detail: 'Balanced from head to toe.', icon: 'FB' },
  { value: 'upper_body', label: 'Upper body', detail: 'Push, pull, shoulders, and arms.', icon: 'UB' },
  { value: 'lower_body', label: 'Lower body', detail: 'Legs, glutes, and lower-body strength.', icon: 'LB' },
  { value: 'core', label: 'Core', detail: 'Bracing, control, and trunk stability.', icon: 'CO' },
  { value: 'conditioning', label: 'Conditioning', detail: 'Sweaty, athletic, and fast-moving.', icon: 'CD' },
  { value: 'mobility', label: 'Mobility', detail: 'Loosen up and move better.', icon: 'MB' },
]

const levelOptions: Array<{ value: FitnessLevel; label: string; detail: string }> = [
  { value: 'beginner', label: 'Beginner', detail: 'More approachable pace and exercise mix.' },
  { value: 'intermediate', label: 'Intermediate', detail: 'Solid challenge with balanced volume.' },
  { value: 'advanced', label: 'Advanced', detail: 'Higher output and tougher structure.' },
]

const durationOptions = [15, 20, 30, 45, 60] as const

const formatOptions: Array<{ value: WorkoutFormat; label: string; detail: string; icon: string }> = [
  { value: 'standard', label: 'Standard', detail: 'Steady blocks from warm-up to finish.', icon: 'ST' },
  { value: 'circuit', label: 'Circuit', detail: 'Move through a round, then repeat.', icon: 'CI' },
  { value: 'tabata', label: 'Tabata', detail: 'Fixed 20/10 intervals with punch.', icon: 'TB' },
  { value: 'pyramid', label: 'Pyramid', detail: 'Progressive levels that climb.', icon: 'PY' },
]

const equipmentOptions: Array<{ value: EquipmentId; label: string; icon: ReactNode }> = [
  { value: 'bodyweight', label: 'Bodyweight', icon: renderEquipmentIcon('bodyweight') },
  { value: 'dumbbells', label: 'Dumbbells', icon: renderEquipmentIcon('dumbbells') },
  { value: 'kettlebell', label: 'Kettlebell', icon: renderEquipmentIcon('kettlebell') },
  { value: 'trx_bands', label: 'TRX bands', icon: renderEquipmentIcon('trx_bands') },
  { value: 'resistance_band', label: 'Resistance band', icon: renderEquipmentIcon('resistance_band') },
  { value: 'pull_up_bar', label: 'Pull-up bar', icon: renderEquipmentIcon('pull_up_bar') },
  { value: 'jump_rope', label: 'Jump rope', icon: renderEquipmentIcon('jump_rope') },
  { value: 'rower', label: 'Rower', icon: renderEquipmentIcon('rower') },
]

function renderEquipmentIcon(type: EquipmentId) {
  switch (type) {
    case 'bodyweight':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <circle cx="24" cy="12" r="5" />
          <path d="M24 19v10m-9 14 5-9 4-5 4 5 5 9m-13-16-6 4m10-4 6 4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'dumbbells':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M12 19v10m4-14v18m16-18v18m4-14v10M16 24h16" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'kettlebell':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M17 18a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M14 22h20v4c0 10-5 16-10 16s-10-6-10-16z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
        </svg>
      )
    case 'trx_bands':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M16 10v10l8 9 8-9V10M16 20l-5 13m26-13 5 13" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="35" r="2.5" />
          <circle cx="37" cy="35" r="2.5" />
        </svg>
      )
    case 'resistance_band':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M13 30c3-11 19-11 22 0" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="12" cy="31" r="3.5" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="36" cy="31" r="3.5" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    case 'pull_up_bar':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M8 18h32M12 18v-6m24 6v-6M16 18v9m16-9v9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'jump_rope':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M14 16c-4 4-6 10-6 15m26-15c4 4 6 10 6 15M19 14l-5 4m15-4 5 4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'rower':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <circle cx="12" cy="34" r="3.5" />
          <path d="M15 34h17l6-12M23 22l4-6m-12 6 8-2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}

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
  const selectedGoal = goalOptions.find((option) => option.value === draft.goal) ?? goalOptions[0]
  const selectedFormat = formatOptions.find((option) => option.value === draft.format) ?? formatOptions[0]

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
        </div>

        <div className="builder-compact-choice-row" role="group" aria-label="Workout goal">
          {goalOptions.map((option) => (
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

      <section className="builder-section-card" aria-labelledby="duration-heading">
        <div className="builder-section-intro">
          <p className="builder-step-label">2. Duration</p>
          <h3 id="duration-heading">How long should it be?</h3>
        </div>

        <label className="builder-duration-slider-card">
          <div className="builder-duration-slider-topline">
            <span className="builder-mini-label">Target length</span>
            <strong>{draft.duration.targetMinutes} min</strong>
          </div>
          <input
            type="range"
            min="0"
            max={String(durationOptions.length - 1)}
            step="1"
            value={durationOptions.indexOf(draft.duration.targetMinutes as (typeof durationOptions)[number])}
            onChange={(event) =>
              updateDraft((current) => ({
                ...current,
                duration: { targetMinutes: durationOptions[Number(event.target.value)] },
              }))
            }
            aria-label="Workout duration"
          />
          <div className="builder-duration-scale" aria-hidden="true">
            {durationOptions.map((minutes) => (
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

      <section className="builder-section-card" aria-labelledby="format-heading">
        <div className="builder-section-intro">
          <p className="builder-step-label">3. Format</p>
          <h3 id="format-heading">How should the workout flow?</h3>
        </div>

        <div className="builder-compact-choice-row builder-compact-choice-row-tight" role="group" aria-label="Workout format">
          {formatOptions.map((option) => (
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
      </section>

      <section className="builder-section-card builder-equipment-section" aria-labelledby="equipment-heading">
        <div className="builder-section-intro">
          <div className="builder-section-topline">
            <div>
              <p className="builder-step-label">4. Equipment</p>
              <h3 id="equipment-heading">What do you have available?</h3>
            </div>
            <span className="mini-pill" aria-live="polite">
              {draft.selectedEquipment.length > 0 ? `${draft.selectedEquipment.length} selected` : 'Bodyweight'}
            </span>
          </div>
        </div>

        <div className="builder-equipment-grid" role="group" aria-label="Equipment options">
          {equipmentOptions.map((option) => {
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
            <span className="builder-step-label">5. More options</span>
            <strong id="advanced-heading">Fine-tune timing and difficulty</strong>
          </span>
          <span>{advancedOpen ? 'Hide' : 'Show'}</span>
        </button>

        {advancedOpen ? (
          <div id={advancedPanelId} className="builder-options-panel">
            <div className="builder-option-group">
              <p className="builder-mini-label">Level</p>
              <div className="chip-row" role="group" aria-label="Fitness level">
                {levelOptions.map((option) => (
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
            </div>

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
          <p className="builder-step-label">6. Generate</p>
          <h3 id="generate-heading">Generate your workout</h3>
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
