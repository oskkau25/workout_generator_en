# Domain Model and Data Contracts

Date: 2026-03-24  
Ticket: 2.1 — Define domain model and data contracts

Source inputs:
- `PRODUCT_SPEC.md`
- `MIGRATION_PLAN.md`
- `docs/lessons-learned.md`
- `docs/screen-map.md`
- `docs/user-flow.md`
- `docs/v1-scope.md`
- `docs/migration-baseline.md`
- `docs/parity-baseline.md`
- baseline runtime references in `src/js/core/workout-generator.js` and `src/js/features/workout-player.js`

---

# Purpose

This document defines the **clean internal model** for the redesigned React app.

It is intentionally **not** a copy of the static app’s current object shapes.
The goal is to keep the important product invariants while giving the React rebuild:
- typed domain contracts,
- clear UI/domain boundaries,
- a stable generation output model,
- a deterministic player state model,
- local persistence seams,
- future backend seams for accounts, analytics, and history.

This should be concrete enough to guide early React implementation in `src/domain/`, `src/features/`, and `src/services/`.

---

# Design Principles

## 1. Separate user intent from generated result
Builder state should describe **what the user wants**.  
Generated workout state should describe **what the app produced**.

Do not mix them into one giant mutable object.

## 2. Separate review model from playback model
The current app intentionally differs between:
- review summary shape,
- playback sequence shape.

Circuit preview vs full circuit playback is the clearest example. That distinction should become explicit.

## 3. Keep generation pure
Generation should be a pure domain operation:
- input: builder request + exercise catalog + rules
- output: generated workout

No DOM access. No localStorage. No React state inside domain logic.

## 4. Treat the player as a state machine
The player has enough complexity that it should not be modeled as a pile of booleans scattered through components.

## 5. Keep persistence behind interfaces
Builder drafts, resumable sessions, history, and preferences should be stored through adapters, not directly through `localStorage` calls inside components.

## 6. Design seams now, implement depth later
Auth, analytics, and synced history are not v1 product priorities, but their seams should be visible now so v1 architecture does not paint itself into a corner.

---

# Recommended Layering

## UI / feature layer
Responsible for:
- React screens and components
- form interaction state
- optimistic UX state
- navigation
- invoking domain use cases

## Domain layer
Responsible for:
- builder request normalization
- workout generation
- workout structure rules
- player reducer/state machine
- validation and invariant checks
- workout summary derivation

## Service / adapter layer
Responsible for:
- local persistence
- analytics transport
- auth/session provider later
- workout history repository later
- migration adapters if old storage needs importing

## Data source layer
Responsible for:
- exercise catalog loading
- future backend APIs
- fixture/test datasets

---

# Core Concepts

## Core nouns
- **Builder draft**: what the user is currently configuring
- **Generation request**: validated/normalized builder input sent into generation
- **Generated workout**: full domain output of generation
- **Workout block**: warm-up/main/cool-down structural grouping
- **Workout step**: one executable or informational unit inside a workout
- **Playback sequence**: executable step sequence for the player
- **Workout session**: a specific attempt/run of a generated workout
- **Player state**: current runtime position within an active or paused session
- **Workout history entry**: completion/attempt summary saved for progress surfaces

## Intentional distinction
The new model should distinguish between:
- **configuration time** data,
- **generated plan** data,
- **execution/runtime** data,
- **saved history/account/analytics** data.

That separation will make React state easier to reason about and test.

---

# 1. Builder Input Model

## Goals of the builder model
The builder model should:
- match the product flow from `docs/user-flow.md`
- keep equipment central
- support progressive disclosure
- support multiple workout formats cleanly
- preserve room for advanced shaping without cluttering core fields

## Builder state split
Use two closely related types:
1. **BuilderDraft** — raw editable state used by the UI
2. **WorkoutGenerationRequest** — normalized validated input used by the generator

### Why split them
The UI needs to tolerate partially complete or temporarily invalid values.  
The generator should receive a clean normalized contract.

---

## Proposed TypeScript types

```ts
export type WorkoutGoal =
  | 'full_body'
  | 'upper_body'
  | 'lower_body'
  | 'core'
  | 'conditioning'
  | 'mobility';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutFormat = 'standard' | 'circuit' | 'tabata' | 'pyramid';

export type EquipmentId =
  | 'bodyweight'
  | 'dumbbells'
  | 'kettlebell'
  | 'trx_bands'
  | 'resistance_band'
  | 'pull_up_bar'
  | 'jump_rope'
  | 'rower';

export interface DurationConfig {
  targetMinutes: 15 | 20 | 30 | 45 | 60;
}

export interface TimingConfigDraft {
  workSeconds?: number;
  restSeconds?: number;
}

export interface CircuitFormatConfig {
  rounds?: number;
  exercisesPerRound?: number;
  roundRestSeconds?: number;
}

export interface TabataFormatConfig {
  rounds?: number;
}

export interface PyramidFormatConfig {
  levels?: number;
}

export interface WorkoutFormatConfigDraft {
  circuit?: CircuitFormatConfig;
  tabata?: TabataFormatConfig;
  pyramid?: PyramidFormatConfig;
}

export interface BuilderAdvancedOptionsDraft {
  includeWarmup: boolean;
  includeCooldown: boolean;
  allowExerciseRepeats: boolean;
  preferBalancedMuscleSplit: boolean;
  targetIntensity?: 1 | 2 | 3 | 4 | 5;
}

export interface BuilderDraft {
  goal: WorkoutGoal;
  level: FitnessLevel;
  duration: DurationConfig;
  format: WorkoutFormat;
  selectedEquipment: EquipmentId[];
  timing: TimingConfigDraft;
  formatConfig: WorkoutFormatConfigDraft;
  advanced: BuilderAdvancedOptionsDraft;
}
```

---

## Normalized generation request

```ts
export interface WorkoutGenerationRequest {
  goal: WorkoutGoal;
  level: FitnessLevel;
  targetMinutes: number;
  format: WorkoutFormat;
  selectedEquipment: EquipmentId[];
  timing: {
    workSeconds: number;
    restSeconds: number;
  };
  formatConfig:
    | { format: 'standard' }
    | {
        format: 'circuit';
        rounds: number;
        exercisesPerRound: number;
        roundRestSeconds: number;
      }
    | {
        format: 'tabata';
        rounds: number;
        intervalSeconds: 20;
        recoverySeconds: 10;
      }
    | {
        format: 'pyramid';
        levels: number;
      };
  advanced: {
    includeWarmup: boolean;
    includeCooldown: boolean;
    allowExerciseRepeats: boolean;
    preferBalancedMuscleSplit: boolean;
    targetIntensity?: 1 | 2 | 3 | 4 | 5;
  };
}
```

---

## Builder normalization rules

```ts
export interface BuilderNormalizer {
  normalize(draft: BuilderDraft): WorkoutGenerationRequest;
}
```

### Required normalization rules
- Empty equipment selection falls back to `['bodyweight']`
- Tabata always normalizes to 20s work / 10s rest effective intervals
- Duration is normalized into a numeric minute target
- Missing advanced options are defaulted, not left undefined
- Invalid format-specific values are clamped to safe ranges
- UI labels are converted into stable internal IDs before generation

### Recommended ranges
- `workSeconds`: 10–300
- `restSeconds`: 5–180
- `circuit.rounds`: 2–8
- `circuit.exercisesPerRound`: 3–10
- `tabata.rounds`: 4–12
- `pyramid.levels`: 3–7

---

## Responsibility boundary

### Builder UI owns
- temporary input state
- section expansion/collapse
- helper text
- live preview copy
- dirty/unsaved markers

### Domain builder model owns
- normalized values
- defaults
- clamping
- validation messages suitable for the generator boundary

---

# 2. Exercise Catalog Model

The generator should not depend on the raw legacy exercise objects directly.  
Introduce a normalized catalog model first.

## Proposed types

```ts
export type ExercisePhaseTag = 'warmup' | 'main' | 'cooldown';
export type MuscleGroup =
  | 'full_body'
  | 'chest'
  | 'back'
  | 'legs'
  | 'arms'
  | 'shoulders'
  | 'core'
  | 'mobility';

export interface ExerciseDefinition {
  id: string;
  slug: string;
  name: string;
  phaseTags: ExercisePhaseTag[];
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  supportedEquipment: EquipmentId[];
  supportedLevels: FitnessLevel[];
  coaching: {
    shortInstruction: string;
    fullInstruction: string;
    safetyNotes?: string[];
  };
  media?: {
    imageUrl?: string;
    videoId?: string;
    videoSearchQuery?: string;
  };
  substitutionTags: string[];
}
```

## Notes
- The current static app stores phase through `type` and often only one equipment value. The new model should support richer matching cleanly.
- `phaseTags` lets an exercise be valid in more than one context later if desired.
- `coaching.shortInstruction` and `coaching.fullInstruction` should be derived once, not reparsed from description strings in the player every time.

---

# 3. Generated Workout Model

## Goals of the generated workout model
The generated model should:
- preserve structural coherence
- support summary/review rendering
- support player expansion/execution
- make format-specific behavior explicit
- avoid leaking legacy `window.currentWorkoutData` style state

## High-level structure
Use one generated workout root object with:
- request snapshot
- metadata
- structured blocks for summary/review
- executable playback plan
- optional generation diagnostics for debugging/tests

---

## Proposed types

```ts
export type WorkoutBlockType = 'warmup' | 'main' | 'cooldown';

export type WorkoutStepKind =
  | 'exercise'
  | 'format_marker'
  | 'transition';

export interface WorkoutPlanMetadata {
  title: string;
  format: WorkoutFormat;
  estimatedMinutes: number;
  level: FitnessLevel;
  selectedEquipment: EquipmentId[];
  goal: WorkoutGoal;
  totalSteps: number;
  totalExerciseSteps: number;
}

export interface WorkoutExerciseStep {
  kind: 'exercise';
  id: string;
  exerciseId: string;
  block: WorkoutBlockType;
  order: number;
  workSeconds: number;
  restSeconds: number;
  noRestAfter: boolean;
  roundIndex?: number;
  totalRounds?: number;
  setIndex?: number;
  totalSets?: number;
  levelIndex?: number;
  totalLevels?: number;
}

export interface WorkoutFormatMarkerStep {
  kind: 'format_marker';
  id: string;
  block: WorkoutBlockType;
  order: number;
  markerType: 'circuit_start' | 'tabata_set' | 'pyramid_level';
  label: string;
  description?: string;
  roundIndex?: number;
  totalRounds?: number;
  setIndex?: number;
  totalSets?: number;
  levelIndex?: number;
  totalLevels?: number;
}

export interface WorkoutTransitionStep {
  kind: 'transition';
  id: string;
  block: WorkoutBlockType;
  order: number;
  transitionType: 'prepare' | 'finish';
  label: string;
}

export type WorkoutStep =
  | WorkoutExerciseStep
  | WorkoutFormatMarkerStep
  | WorkoutTransitionStep;

export interface WorkoutBlock {
  id: string;
  type: WorkoutBlockType;
  title: string;
  summary: string;
  steps: WorkoutStep[];
}

export interface WorkoutPlaybackPlan {
  steps: WorkoutExerciseStep[];
  totalWorkSeconds: number;
  totalRestSeconds: number;
  totalDurationSeconds: number;
}

export interface GeneratedWorkout {
  id: string;
  createdAt: string;
  sourceRequest: WorkoutGenerationRequest;
  metadata: WorkoutPlanMetadata;
  blocks: WorkoutBlock[];
  playback: WorkoutPlaybackPlan;
  diagnostics?: {
    generatorVersion: string;
    warnings: string[];
    notes: string[];
  };
}
```

---

## Why this shape

### `blocks`
Best for:
- workout summary screen
- clear warm-up / main / cool-down UI
- format-specific headers and cards

### `playback.steps`
Best for:
- deterministic player execution
- pause/resume persistence
- next/previous logic
- circuit expansion without UI hacks

### `sourceRequest`
Useful for:
- regenerate/edit flows
- analytics context
- saved history reconstruction

---

## Format-specific modeling rules

### Standard
- summary blocks and playback steps mostly match 1:1
- warm-up and cool-down exercises set `noRestAfter = true` where appropriate
- main exercise count remains duration-driven

### Circuit
- summary should show a **compact preview** of the round structure
- playback should contain the **fully expanded round-by-round exercise sequence**
- do not re-expand circuit logic inside the player component; generate the playback plan up front

### Tabata
- summary may include set markers to communicate structure
- playback uses normalized 20/10 intervals
- request timing controls may remain visible in builder UX, but normalized request/output must make the effective override explicit

### Pyramid
- summary should expose level progression clearly
- playback should encode level indices and order explicitly

---

## Generator contract

```ts
export interface WorkoutGenerator {
  generate(
    request: WorkoutGenerationRequest,
    catalog: ExerciseDefinition[]
  ): GeneratedWorkout;
}
```

## Validation contract

```ts
export interface WorkoutGenerationValidator {
  validateRequest(request: WorkoutGenerationRequest): ValidationResult;
  validateResult(workout: GeneratedWorkout): ValidationResult;
}

export interface ValidationResult {
  ok: boolean;
  issues: Array<{
    code: string;
    severity: 'error' | 'warning';
    message: string;
    path?: string;
  }>;
}
```

---

# 4. Workout Summary View Model Boundary

The summary screen should not render directly from low-level generation internals if the UI needs derived display data.

Use a mapper:

```ts
export interface WorkoutSummaryViewModel {
  header: {
    title: string;
    subtitle: string;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
  sections: Array<{
    id: string;
    title: string;
    preview: string;
    items: Array<
      | {
          type: 'exercise';
          id: string;
          name: string;
          instruction: string;
          equipment: string[];
          workLabel: string;
          muscleLabel: string;
          levelLabel: string;
        }
      | {
          type: 'marker';
          id: string;
          label: string;
          description?: string;
        }
    >;
  }>;
}
```

## Rule
This view model belongs at the feature/UI boundary, not inside the generator core.

---

# 5. Player State Model

## Goals
The player model should support:
- deterministic transitions
- pause/resume
- next/previous
- work/rest distinction
- completion
- resume from saved session
- future hooks for audio/haptics without polluting transition logic

## Important modeling decision
Separate:
- **session state**
- **derived UI state**
- **effects**

The reducer should decide state transitions.  
Effects like beep, speech, vibration, analytics, and persistence should be triggered outside the reducer.

---

## Proposed types

```ts
export type PlayerPhase = 'idle' | 'ready' | 'work' | 'rest' | 'paused' | 'completed';

export interface PlayerTimerState {
  phase: PlayerPhase;
  remainingSeconds: number;
  phaseTotalSeconds: number;
  elapsedSeconds: number;
}

export interface PlayerProgressState {
  currentStepIndex: number;
  totalSteps: number;
  completedStepIds: string[];
}

export interface PlayerPreferences {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  voiceCountdownEnabled: boolean;
}

export interface ActiveWorkoutSession {
  sessionId: string;
  workoutId: string;
  startedAt: string;
  lastUpdatedAt: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  playbackStepIds: string[];
}

export interface PlayerState {
  session: ActiveWorkoutSession | null;
  timer: PlayerTimerState;
  progress: PlayerProgressState;
  preferences: PlayerPreferences;
}
```

---

## Player actions

```ts
export type PlayerAction =
  | { type: 'LOAD_WORKOUT'; workout: GeneratedWorkout; resumeFromStepIndex?: number }
  | { type: 'START' }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SKIP_REST' }
  | { type: 'EXIT' }
  | { type: 'COMPLETE' }
  | { type: 'UPDATE_PREFERENCES'; preferences: Partial<PlayerPreferences> };
```

## Player reducer contract

```ts
export interface PlayerReducer {
  reduce(state: PlayerState, action: PlayerAction): PlayerState;
}
```

---

## Player transition rules

### Load workout
- creates a session
- sets phase to `ready`
- positions step index at 0 or resume step
- primes initial timer using first playback step

### Start
- moves `ready -> work`

### Tick
- decrements `remainingSeconds`
- when work reaches 0:
  - advance to `rest` if current step has rest
  - otherwise move directly to next step or complete
- when rest reaches 0:
  - move to next step’s work phase or complete

### Pause / Resume
- pause should not destroy step position or remaining time
- `paused` should remember prior active phase in implementation, either in state or derived helper

### Previous / Next
- should operate on executable playback steps only
- markers should not become focusable runtime steps if they are non-executable

### Exit
- should mark session as `abandoned` unless already complete
- UI decides whether to confirm before dispatching

### Complete
- marks session complete
- freezes timer
- creates history save candidate

---

## Recommended derived selectors

```ts
export interface PlayerSelectors {
  getCurrentStep(state: PlayerState, workout: GeneratedWorkout): WorkoutExerciseStep | null;
  getNextStep(state: PlayerState, workout: GeneratedWorkout): WorkoutExerciseStep | null;
  getProgressPercent(state: PlayerState): number;
  isRestPhase(state: PlayerState): boolean;
  canGoPrevious(state: PlayerState): boolean;
  canGoNext(state: PlayerState): boolean;
}
```

Keep these as pure selectors, not component-local ad hoc logic.

---

# 6. Session and Completion Models

The player runtime should produce a normalized completion record.

## Proposed types

```ts
export interface WorkoutCompletionSummary {
  sessionId: string;
  workoutId: string;
  completedAt: string;
  format: WorkoutFormat;
  goal: WorkoutGoal;
  level: FitnessLevel;
  selectedEquipment: EquipmentId[];
  totalStepsCompleted: number;
  totalDurationSeconds: number;
}

export interface WorkoutHistoryEntry {
  id: string;
  workoutId: string;
  sessionId: string;
  startedAt: string;
  completedAt?: string;
  status: 'completed' | 'abandoned';
  summary: WorkoutCompletionSummary;
}
```

## Rule
The dashboard/progress surface should use `WorkoutHistoryEntry` or derived progress snapshots, not live player state.

---

# 7. Storage Abstractions

## Goals
Storage interfaces should support:
- local-first v1 persistence
- future replacement by backend repositories
- migration from legacy localStorage keys where needed
- tests using in-memory adapters

## What should be stored locally in v1
- builder draft
- player preferences
- resumable active session
- lightweight workout history
- maybe last generated workout for edit/regenerate convenience

## What should not be required for v1
- cloud sync
- server auth session
- backend analytics delivery

---

## Repository interfaces

```ts
export interface BuilderDraftStore {
  load(): Promise<BuilderDraft | null>;
  save(draft: BuilderDraft): Promise<void>;
  clear(): Promise<void>;
}

export interface WorkoutSessionStore {
  loadActiveSession(): Promise<SavedWorkoutSession | null>;
  saveActiveSession(session: SavedWorkoutSession): Promise<void>;
  clearActiveSession(): Promise<void>;
}

export interface WorkoutHistoryStore {
  list(limit?: number): Promise<WorkoutHistoryEntry[]>;
  append(entry: WorkoutHistoryEntry): Promise<void>;
  clear(): Promise<void>;
}

export interface PreferencesStore {
  load(): Promise<UserPreferences | null>;
  save(preferences: UserPreferences): Promise<void>;
}
```

## Saved session type

```ts
export interface SavedWorkoutSession {
  session: ActiveWorkoutSession;
  workout: GeneratedWorkout;
  playerState: PlayerState;
  savedAt: string;
}

export interface UserPreferences {
  player: PlayerPreferences;
  builderDefaults?: Partial<BuilderDraft>;
}
```

---

## Local adapter recommendation
Create browser implementations under `src/services/storage/` such as:
- `LocalBuilderDraftStore`
- `LocalWorkoutSessionStore`
- `LocalWorkoutHistoryStore`
- `LocalPreferencesStore`

Back them with a single versioned namespace, for example:

```ts
export const STORAGE_NAMESPACE = 'fitflow.v3';
```

Then keep keys explicit:

```ts
export const STORAGE_KEYS = {
  builderDraft: 'fitflow.v3.builder-draft',
  activeSession: 'fitflow.v3.active-session',
  history: 'fitflow.v3.history',
  preferences: 'fitflow.v3.preferences',
};
```

## Important migration note
Do **not** silently reuse the old app’s mixed localStorage keys as the new primary contracts.  
If old data needs to be imported, do that through a **legacy migration adapter**, not through domain model compromise.

---

# 8. Future Backend Seams

These seams should exist as interfaces now even if the initial implementation is local or stubbed.

---

## 8.1 Accounts seam

### Purpose
Allow future identity and sync without making v1 depend on auth.

```ts
export interface AccountProfile {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  accessToken: string;
  expiresAt: string;
}

export interface AccountGateway {
  getCurrentProfile(): Promise<AccountProfile | null>;
  getCurrentSession(): Promise<AuthSession | null>;
  signIn?(): Promise<void>;
  signOut?(): Promise<void>;
}
```

### v1 implementation
- likely a `NoopAccountGateway` or placeholder local profile implementation
- UI may show “Profile / future account” surfaces without real auth

### Boundary rule
Generator, player, and persistence logic must not require a logged-in user.

---

## 8.2 Analytics seam

### Purpose
Track important events later without entangling components.

```ts
export type AnalyticsEvent =
  | {
      type: 'builder_generate_clicked';
      request: WorkoutGenerationRequest;
      timestamp: string;
    }
  | {
      type: 'workout_generated';
      workoutId: string;
      format: WorkoutFormat;
      timestamp: string;
    }
  | {
      type: 'workout_started';
      workoutId: string;
      sessionId: string;
      timestamp: string;
    }
  | {
      type: 'workout_completed';
      workoutId: string;
      sessionId: string;
      timestamp: string;
    }
  | {
      type: 'workout_abandoned';
      workoutId: string;
      sessionId: string;
      stepIndex: number;
      timestamp: string;
    };

export interface AnalyticsGateway {
  track(event: AnalyticsEvent): Promise<void>;
}
```

### v1 implementation
- `ConsoleAnalyticsGateway` or `LocalAnalyticsGateway`
- possibly disabled in production until explicitly needed

### Boundary rule
Analytics failures must never break workout generation or playback.

---

## 8.3 History/progress seam

### Purpose
Keep local history usable now and backend-syncable later.

```ts
export interface WorkoutHistoryRepository {
  listRecent(userId?: string): Promise<WorkoutHistoryEntry[]>;
  save(entry: WorkoutHistoryEntry, userId?: string): Promise<void>;
  sync?(): Promise<void>;
}
```

### v1 implementation
- backed by local storage
- no userId required

### later implementation
- user-aware repository that syncs with backend while preserving same domain contract

---

# 9. Recommended Use Cases

Keep business operations explicit instead of burying them in components.

## Proposed use cases

```ts
export interface CreateWorkoutUseCase {
  execute(draft: BuilderDraft): Promise<GeneratedWorkout>;
}

export interface StartWorkoutSessionUseCase {
  execute(workout: GeneratedWorkout): Promise<PlayerState>;
}

export interface ResumeWorkoutSessionUseCase {
  execute(): Promise<SavedWorkoutSession | null>;
}

export interface CompleteWorkoutSessionUseCase {
  execute(input: {
    workout: GeneratedWorkout;
    playerState: PlayerState;
  }): Promise<WorkoutHistoryEntry>;
}
```

## Benefits
- easier testing
- cleaner React hooks
- clear boundaries between UI and domain/services

---

# 10. Suggested Folder Mapping

This document implies a React code structure roughly like:

```txt
src/
  domain/
    builder/
      builder-types.ts
      builder-normalizer.ts
      builder-validation.ts
    exercises/
      exercise-types.ts
      exercise-catalog.ts
    workouts/
      workout-types.ts
      workout-generator.ts
      workout-validation.ts
      workout-summary-mapper.ts
    player/
      player-types.ts
      player-reducer.ts
      player-selectors.ts
  features/
    builder/
    workout-summary/
    player/
    progress/
    profile/
  services/
    storage/
      builder-draft-store.ts
      workout-session-store.ts
      workout-history-store.ts
      preferences-store.ts
    analytics/
      analytics-gateway.ts
    accounts/
      account-gateway.ts
```

This is compatible with the migration plan’s desired separation of `features`, `domain`, and `services/storage`.

---

# 11. Domain Invariants to Preserve

These should be enforceable in tests once implementation starts.

## Builder / request invariants
- empty equipment selection normalizes to bodyweight
- format config is always consistent with selected format
- tabata request always yields effective 20/10 timing

## Generated workout invariants
- generated workouts preserve visible structure: warm-up / main / cool-down
- multiple workout formats remain meaningfully distinct
- equipment-aware filtering remains central
- summary metadata is always available before player start
- playback plan contains only executable steps

## Circuit invariants
- summary may remain compact
- playback is fully expanded before player execution
- round position is explicit in playback steps

## Player invariants
- player is deterministic for a given playback plan
- pause/resume preserves exact remaining seconds
- exit does not mutate generated workout structure
- completion creates a history-ready record

## Persistence invariants
- local persistence is optional UX support, not a generator dependency
- no domain module reads localStorage directly
- future backend replacement should happen via interfaces, not domain refactors

---

# 12. Explicit Non-Goals for This Model

This document intentionally does **not** define:
- final UI component props for every screen
- final API payloads for a future backend
- exact analytics warehouse schema
- exact auth provider behavior
- exact migration logic from legacy localStorage

Those can come later. The goal here is a stable internal model.

---

# 13. Recommended Implementation Decisions

## Decision 1 — Generate both summary structure and playback plan at generation time
This avoids player-side shape mutation and keeps circuit/tabata/pyramid behavior explicit.

## Decision 2 — Keep `BuilderDraft` separate from `WorkoutGenerationRequest`
This prevents UI looseness from leaking into domain logic.

## Decision 3 — Keep player reducer pure
Audio, speech, haptics, persistence, and analytics should be side effects around the reducer.

## Decision 4 — Use versioned storage keys for the new React app
Avoid letting legacy storage contracts dictate the new architecture.

## Decision 5 — Add thin seam interfaces now
`AccountGateway`, `AnalyticsGateway`, and history repositories should exist before backend work starts.

---

# 14. Recommended Next Step

Proceed to **Ticket 2.2 — Scaffold React application foundation** with this document as the reference for:
- `src/domain/` type files
- folder structure
- storage adapters
- player reducer scaffolding
- generation module extraction boundaries

The most important immediate follow-up is to turn these contracts into initial TypeScript source files and unit-testable pure modules before building UI-heavy screens.
