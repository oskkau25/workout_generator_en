import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SavedWorkoutSession } from '@/services/storage/storage-types'
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
import { LocalStorageStore } from '@/services/storage/local-storage-store'
import { STORAGE_KEYS } from '@/services/storage/storage-keys'
import { GeneratedWorkoutStore } from '@/services/storage/generated-workout-store'
import { workoutSessionStore } from '@/services/storage/workout-session-store'

const builderDraftStore = new LocalStorageStore<BuilderDraft>(STORAGE_KEYS.builderDraft)

const goalOptions: Array<{ value: WorkoutGoal; label: string; detail: string }> = [
  { value: 'full_body', label: 'Full body', detail: 'Balanced session across your whole body.' },
  { value: 'upper_body', label: 'Upper body', detail: 'Push, pull, shoulders, and arms emphasis.' },
  { value: 'lower_body', label: 'Lower body', detail: 'Legs, glutes, and lower-body strength.' },
  { value: 'core', label: 'Core', detail: 'Trunk stability and focused abdominal work.' },
  { value: 'conditioning', label: 'Conditioning', detail: 'Sweaty, athletic, heart-rate-driven training.' },
  { value: 'mobility', label: 'Mobility', detail: 'Loosen up, move better, and recover.' },
]

const levelOptions: Array<{ value: FitnessLevel; label: string; detail: string }> = [
  { value: 'beginner', label: 'Beginner', detail: 'More approachable pace and exercise mix.' },
  { value: 'intermediate', label: 'Intermediate', detail: 'Solid challenge with balanced volume.' },
  { value: 'advanced', label: 'Advanced', detail: 'Higher output and tougher structure.' },
]

const durationOptions = [15, 20, 30, 45, 60] as const

const formatOptions: Array<{ value: WorkoutFormat; label: string; detail: string }> = [
  { value: 'standard', label: 'Standard', detail: 'Straightforward block-based workout.' },
  { value: 'circuit', label: 'Circuit', detail: 'One round preview here, repeated in the player.' },
  { value: 'tabata', label: 'Tabata', detail: 'Fixed 20s work / 10s rest intervals.' },
  { value: 'pyramid', label: 'Pyramid', detail: 'Progressive levels that ramp the session up.' },
]

const equipmentOptions: Array<{ value: EquipmentId; label: string }> = [
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'trx_bands', label: 'TRX bands' },
  { value: 'resistance_band', label: 'Resistance band' },
  { value: 'pull_up_bar', label: 'Pull-up bar' },
  { value: 'jump_rope', label: 'Jump rope' },
  { value: 'rower', label: 'Rower' },
]

function labelize(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function summarizeStructure(draft: BuilderDraft) {
  if (draft.format === 'circuit') {
    const config = draft.formatConfig.circuit ?? {}
    return `${config.rounds ?? 3} rounds × ${config.exercisesPerRound ?? 5} exercises, preview one round now and repeat in the player.`
  }

  if (draft.format === 'tabata') {
    const rounds = draft.formatConfig.tabata?.rounds ?? 8
    return `${rounds} tabata rounds at 20s work / 10s rest.`
  }

  if (draft.format === 'pyramid') {
    const levels = draft.formatConfig.pyramid?.levels ?? 5
    return `${levels} pyramid levels with a progressive main block.`
  }

  return 'Warm-up + main block + cool-down.'
}

function buildImpactNotes(draft: BuilderDraft) {
  const notes: string[] = []

  notes.push(draft.advanced.includeWarmup ? 'Warm-up included' : 'Warm-up skipped')
  notes.push(draft.advanced.includeCooldown ? 'Cool-down included' : 'Cool-down skipped')

  if (draft.advanced.preferBalancedMuscleSplit) {
    notes.push('Balanced muscle split preferred')
  }

  if (draft.advanced.allowExerciseRepeats) {
    notes.push('Repeats allowed')
  }

  if (draft.format === 'tabata') {
    notes.push('Playback timing locks to 20s / 10s')
  }

  return notes
}

export function BuilderScreen() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<BuilderDraft>(() => createDefaultBuilderDraft())
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeSession, setActiveSession] = useState<SavedWorkoutSession | null>(null)

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
  const summaryTitle = `${normalizedRequest.targetMinutes} min ${labelize(normalizedRequest.goal)} ${labelize(normalizedRequest.format)}`
  const summaryEquipment =
    draft.selectedEquipment.length > 0 ? draft.selectedEquipment.map(labelize).join(', ') : 'None selected — bodyweight will be used on generate.'
  const impactNotes = buildImpactNotes(draft)

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
    try {
      const workout = generateWorkout(normalizedRequest, legacyExerciseCatalog)
      await GeneratedWorkoutStore.save({ id: workout.id, workout })
      setActiveSession(null)
      navigate(`/workout/${workout.id}/summary`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="builder-screen">
      <section className="builder-hero card builder-hero-card">
        <p className="card-eyebrow">Primary flow</p>
        <h2>Build your workout</h2>
        <p>
          Quick to start, deep when you want it. Dial in your goal, gear, and structure, then
          generate a session built from the normalized domain request.
        </p>
        {activeSession ? (
          <div className="summary-block builder-resume-block">
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

      <section className="card builder-section">
        <div className="section-heading">
          <div>
            <p className="card-eyebrow">1. Goal and level</p>
            <h3>What do you want to train?</h3>
          </div>
          <span className="mini-pill">Intensity {draft.advanced.targetIntensity}/5</span>
        </div>

        <div className="option-grid option-grid-large">
          {goalOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={draft.goal === option.value ? 'choice-card is-selected' : 'choice-card'}
              onClick={() => updateDraft((current) => ({ ...current, goal: option.value }))}
            >
              <strong>{option.label}</strong>
              <span>{option.detail}</span>
            </button>
          ))}
        </div>

        <div className="chip-row">
          {levelOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={draft.level === option.value ? 'choice-chip is-selected' : 'choice-chip'}
              onClick={() => updateDraft((current) => ({ ...current, level: option.value }))}
            >
              <strong>{option.label}</strong>
              <span>{option.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card builder-section">
        <div className="section-heading">
          <div>
            <p className="card-eyebrow">2. Duration and format</p>
            <h3>Shape the session</h3>
          </div>
        </div>

        <div className="chip-inline-group" aria-label="Duration options">
          {durationOptions.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className={draft.duration.targetMinutes === minutes ? 'compact-chip is-selected' : 'compact-chip'}
              onClick={() =>
                updateDraft((current) => ({
                  ...current,
                  duration: { targetMinutes: minutes },
                }))
              }
            >
              {minutes} min
            </button>
          ))}
        </div>

        <div className="option-grid">
          {formatOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={draft.format === option.value ? 'choice-card is-selected' : 'choice-card'}
              onClick={() => updateDraft((current) => ({ ...current, format: option.value }))}
            >
              <strong>{option.label}</strong>
              <span>{option.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card builder-section builder-equipment-section">
        <div className="section-heading">
          <div>
            <p className="card-eyebrow">3. Equipment</p>
            <h3>Your available gear</h3>
          </div>
          <span className="mini-pill">{draft.selectedEquipment.length} selected</span>
        </div>

        <div className="equipment-grid">
          {equipmentOptions.map((option) => {
            const selected = draft.selectedEquipment.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                className={selected ? 'equipment-card is-selected' : 'equipment-card'}
                onClick={() => toggleEquipment(option.value)}
              >
                <span>{option.label}</span>
                <strong>{selected ? 'Selected' : 'Tap to add'}</strong>
              </button>
            )
          })}
        </div>

        <p className="builder-help-text">
          You can leave this empty while editing. The domain normalizer will fall back to
          bodyweight on generate.
        </p>
      </section>

      <section className="card builder-section">
        <button
          type="button"
          className="section-toggle"
          onClick={() => setAdvancedOpen((current) => !current)}
          aria-expanded={advancedOpen}
        >
          <span>
            <span className="card-eyebrow">4. Advanced workout settings</span>
            <strong>Tune timing and structure</strong>
          </span>
          <span>{advancedOpen ? 'Hide' : 'Show'}</span>
        </button>

        {advancedOpen ? (
          <div className="advanced-panel">
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

            <div className="field-grid">
              <label className="field-card">
                <span>Target intensity</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={draft.advanced.targetIntensity ?? 3}
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
                  min="10"
                  max="300"
                  value={draft.timing.workSeconds ?? 40}
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
                  min="5"
                  max="180"
                  value={draft.timing.restSeconds ?? 20}
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
                <p className="builder-help-text tabata-note">
                  Timing inputs stay visible for consistency, but effective playback always uses
                  fixed 20s work / 10s rest.
                </p>
              </div>
            ) : null}

            {draft.format === 'pyramid' ? (
              <div className="field-grid">
                <label className="field-card">
                  <span>Pyramid levels</span>
                  <input
                    type="number"
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

      <section className="card builder-section summary-card">
        <div className="section-heading">
          <div>
            <p className="card-eyebrow">5. Live summary</p>
            <h3>{summaryTitle}</h3>
          </div>
          <span className="mini-pill">Ready to generate</span>
        </div>

        <p className="summary-confidence-copy">
          This is a live intent summary from your current builder draft — not fake generated
          content.
        </p>

        <div className="summary-stat-grid">
          <div className="summary-stat">
            <span>Duration</span>
            <strong>{normalizedRequest.targetMinutes} min</strong>
          </div>
          <div className="summary-stat">
            <span>Format</span>
            <strong>{labelize(normalizedRequest.format)}</strong>
          </div>
          <div className="summary-stat">
            <span>Level</span>
            <strong>{labelize(normalizedRequest.level)}</strong>
          </div>
          <div className="summary-stat">
            <span>Equipment</span>
            <strong>{summaryEquipment}</strong>
          </div>
          <div className="summary-stat">
            <span>Intensity</span>
            <strong>{normalizedRequest.advanced.targetIntensity}/5</strong>
          </div>
        </div>

        <div className="summary-block">
          <span>Structure preview</span>
          <strong>{summarizeStructure(draft)}</strong>
        </div>

        <div className="summary-block">
          <span>Advanced impact</span>
          <ul className="summary-note-list">
            {impactNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="builder-action-bar card">
        <div>
          <p className="card-eyebrow">Primary action</p>
          <h3>Generate from normalized state</h3>
          <p>
            {draft.selectedEquipment.length === 0
              ? 'No equipment selected right now — generate will safely fall back to bodyweight.'
              : 'Your selections are ready to hand off into the domain layer.'}
          </p>
        </div>
        <button type="button" className="primary-action" onClick={() => void handleGenerate()} disabled={isGenerating}>
          {isGenerating ? 'Generating workout…' : 'Generate workout'}
        </button>
      </section>
    </div>
  )
}
