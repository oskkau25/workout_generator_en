# Migration Baseline

Date: 2026-03-24  
Ticket: 0.1 - Audit current static app behavior  
Scope: Static app under `src/` as current parity source of truth for React migration.

## Audit method

- Read `MIGRATION_PLAN.md`, `README.md`, `TEST_AUDIT.md`, `src/index.html`, `src/script.js`, `src/js/main.js`, `src/js/core/workout-generator.js`, `src/js/features/workout-player.js`, `src/js/features/user-accounts.js`, and `src/dashboard.html`.
- Ran the static app locally with:
  - `python -m http.server 4173` from `src/`
- Verified key landing flow via browser snapshot against `http://127.0.0.1:4173/index.html`.
- Triggered one workout generation with default settings and captured the resulting overview state.
- Collected browser console output for the generated page.
- Ran lightweight test command:
  - `python -m unittest discover -s ci-cd/tests -p "test_*.py" -v`

## Executive summary

The app is a static HTML/Tailwind UI with ES module JavaScript layered on top of an older monolithic `script.js` implementation. The active runtime path is the modular app loaded from `src/js/main.js`; `src/script.js` appears to be legacy/parallel logic and is still valuable as behavioral reference because some ideas exist in both places.

Core user value today:

1. Configure a workout from a single-page generator form.
2. Generate a structured workout overview with warm-up, main, and cool-down sections.
3. Start a guided workout player with timers, audio/vibration cues, and rest overlays.
4. Optionally register/login locally for workout history and streaks.
5. View analytics/dashboard data that is mostly derived from localStorage event history.

The current app is feature-rich but behavior is inconsistent in a few areas due to partial rewrites and overlapping implementations.

---

## Source structure baseline

## Top-level structure

- `src/index.html` - main app shell and UI markup
- `src/dashboard.html` - analytics dashboard
- `src/js/main.js` - modular app entrypoint currently used by the HTML
- `src/js/core/exercise-database.js` - exercise source data
- `src/js/core/workout-generator.js` - generation logic + overview rendering
- `src/js/features/workout-player.js` - player/timer flow
- `src/js/features/user-accounts.js` - local account system
- `src/js/features/analytics-tracker.js` - event tracking/local analytics storage
- `src/js/features/enhanced-form.js` - improved form interactions/presets/collapsibles
- `src/js/features/enhanced-timer.js` - timer enhancements
- `src/js/features/smart-substitution.js` - alternative exercise suggestions
- `src/js/features/visual-enhancements.js` - optional visual guidance/media behavior
- `src/script.js` - large legacy all-in-one implementation; not the main entrypoint, but contains historical behavior and overlapping concepts
- `src/dashboard.js` - dashboard data processing and chart rendering
- `ci-cd/` - Python-based tests, regression scripts, quality gate, and Selenium/manual suites

## Runtime architecture notes

- `index.html` loads `js/main.js?v=63&t=1760000000` as the modular entrypoint.
- `main.js` exposes many modules to `window` for backward compatibility.
- Workout generation is handled by `handleFormSubmission()` in `core/workout-generator.js`.
- Workout execution is handled by `initializeWorkoutPlayer()` in `features/workout-player.js`.
- Several features still depend on global `window.*` functions/objects.
- `script.js` duplicates major areas: generation, player, substitution, analytics, account UI. Treat it as historical drift and a risk surface, not the primary runtime.

---

## User-facing flow inventory

## 1) Landing / generator flow

Observed from local run:

- Header with FitFlow branding and buttons for Analytics, Login, Register.
- "What's New" banner shown near top with dismiss behavior.
- Main form section: "Create Your Perfect Workout".
- Mobile-first collapsible form groups:
  - Basic
  - Equipment
  - Advanced
- Quick preset buttons are visible in the Basic group.
- Generate button is always prominent.

Behavior:

- Default state renders the form first, not a previously saved workout.
- If local saved workout data exists, resume UI can appear without replacing the landing form.
- Workout form submission hides the form and shows a review-first overview screen.

## 2) Workout generation / overview flow

Observed:

- Generating with defaults produced a workout overview with summary cards and collapsible sections.
- Overview sections are grouped into:
  - Warm-up
  - Main
  - Cool-down
- The default generated workout in the observed run showed:
  - 26 total exercises
  - 30 min duration
  - Intermediate level
  - Bodyweight equipment

Behavior from source:

- Warm-up and cool-down are injected automatically.
- Main workout structure depends on training pattern.
- Overview is the review screen before the player starts.
- Each non-structured exercise card may show a "Smart Alternative" button if substitution metadata exists.
- Main overview buttons include start and generate-new-workout actions.

## 3) Workout player / timer flow

Behavior from source:

- Starting a workout calls `window.startWorkout()` which delegates into workout-player logic.
- Workout player receives `sequence`, `workTime`, `restTime`, and optional circuit metadata.
- Circuit plans are expanded into a full multi-round sequence at player start.
- State tracks:
  - `currentIndex`
  - `phase` (`work` or `rest`)
  - `remainingSeconds`
  - `isPaused`
  - sound/vibration settings
- Work and rest phases have distinct cues.
- Last 5 seconds of work can use spoken countdown.
- Rest overlays show next exercise.
- Player supports keyboard shortcuts and touch gestures.
- Exiting the player returns to overview rather than fully resetting by default.

## 4) Resume / new workout flow

Behavior from source:

- Workout state is stored in localStorage.
- Resume section can be shown on load if valid saved state exists.
- New workout buttons clear saved state, reset workout arrays, and return to the form.

## 5) Account flow

Behavior from source:

- Guest state shows Login and Register buttons in header.
- Logged-in state swaps to profile summary, streak, profile button, and logout button.
- Registration uses username/password and security question/answer in modular implementation.
- Auth and profile data are persisted entirely in localStorage.
- No backend is present.

## 6) Dashboard / analytics flow

Behavior from source:

- `dashboard.html` is a separate page.
- Reads local analytics data from localStorage.
- If no real data exists, dashboard generates sample/fallback data.
- Includes metrics, charts, behavior insights, hotfix backlog, personal workout history, and recent activity.
- Dashboard is useful for migration parity because it is a first-class route/page, not just an internal widget.

---

## Form inputs and state transitions

## Core form inputs

From source and runtime snapshot:

### Basic group
- Quick presets (buttons; apply bundled settings)
- Workout duration radio group:
  - 15
  - 30 (default observed)
  - 45
  - 60
- Fitness level select:
  - Beginner
  - Intermediate (default observed)
  - Advanced

### Equipment group
Checkbox multi-select:
- Bodyweight (default checked)
- Dumbbells
- Kettlebell
- TRX Bands
- Resistance Band
- Pull-up Bar
- Jump Rope
- Rower

### Advanced group
From source:
- Work time slider/input (`#work-time`)
- Rest time slider/input (`#rest-time`)
- Training pattern radio group:
  - Standard
  - Circuit
  - Tabata
  - Pyramid
- Pattern-specific numeric settings:
  - Circuit: rounds, exercises per round, circuit rest
  - Tabata: rounds
  - Pyramid: levels

## Form state transitions

1. Landing state: form visible, workout sections hidden.
2. User edits form / presets / collapsibles.
3. Submit validates presence of level + duration and minimum timing values.
4. On success:
   - current workout data is generated
   - form hidden
   - workout overview rendered
   - summary metadata stored on `window.currentWorkoutData`
5. On start:
   - overview hidden
   - player shown
   - timer starts immediately in `work` phase
6. On exit from player:
   - return to overview with current progress preserved
7. On new workout:
   - clear workout state
   - return to visible form

## Notable state containers

### Modular path
- `window.currentWorkout`
- `window.currentWorkoutData`
- `window.workoutState`
- localStorage keys for analytics, user, and personal workouts

### Legacy path reference
- `appState` in `script.js`

---

## Workout generation logic baseline

## Domain behavior

Implemented in `src/js/core/workout-generator.js`.

### Inputs
- level
- duration
- equipment array
- workTime
- restTime
- trainingPattern
- patternSettings

### Normalization
- Equipment is always normalized to an array.
- Empty equipment selection falls back to `['Bodyweight']`.
- Tabata overrides effective timing to 20s work / 10s rest regardless of requested timing.

### Filtering rules
Exercises are filtered by:
- phase (`warmup`, `main`, `cooldown`)
- selected equipment match
- selected level, where exercise level may be a string or an array

### Standard mode output
- Warm-up: 8 random exercises, `_section='Warm-up'`, `_noRest=true`
- Main: `max(6, floor(duration / 3))` random exercises, `_section='Main'`
- Cool-down: 8 random exercises, `_section='Cool-down'`, `_noRest=true`

### Circuit mode output
- Warm-up section added first
- Adds one `circuit_header`
- Adds preview-only circuit exercises once in overview
- Stores `_circuitData` with selected exercises, rounds, and exercises-per-round
- Cool-down appended
- Player later expands circuit preview into full multi-round sequence

### Tabata mode output
- Warm-up added first
- Adds repeated `tabata_set` header items
- Each set uses a selected exercise from a small rotating pool
- Cool-down appended
- Effective timing forced to 20/10

### Pyramid mode output
- Warm-up added first
- Adds repeated `pyramid_set` headers by level
- Each level injects 2 exercises from a rotating pool
- Cool-down appended

### Randomness
- Uses shuffle-based random selection.
- No seed control currently exists.
- Identical inputs can produce different plans, which matters for parity test design.

### Output shape
Generated result contains:
- `workout` array
- `duration`
- `workTime`
- `restTime`
- `trainingPattern`
- `metadata`:
  - `totalExercises`
  - `estimatedTime`
  - `level`
  - `equipment`
- optional `_circuitData`

---

## Overview output structure baseline

Overview rendering groups by `_section` and renders:

- Summary card block with total exercises, duration, level, equipment
- Collapsible Warm-up/Main/Cool-down section containers
- Exercise cards with:
  - name
  - short description excerpt
  - equipment
  - muscle group badge
  - level badge
  - timing label (`No rest` for warm-up/cool-down; otherwise work/rest)
  - optional smart alternative button

Structured items such as `circuit_header`, `tabata_set`, and `pyramid_set` render as section/header cards rather than standard exercise cards.

---

## Player / timer behavior baseline

## Timer states
- `phase = work` starts first.
- `phase = rest` begins after work hits zero.
- Rest phase advances to the next exercise when timer hits zero.

## Timing behavior
- Uses per-workout defaults, but some exercises may carry per-item timing metadata.
- Tabata-specific timing can override general timing.
- Warm-up/cool-down are still part of the player sequence, but may be flagged `_noRest` in overview data.

## Interaction controls from source
- Pause / resume
- Prev / next exercise
- Exit workout
- Sound toggle
- Vibration toggle
- Keyboard shortcuts:
  - space = pause/resume
  - left/right arrows = prev/next
  - escape = exit
- Mobile swipe navigation

## Cues and guidance
- Audio beeps for phase changes
- Vibration where supported
- Spoken countdown during last 5 seconds of work
- Rest overlay shows the next exercise name
- Motivation and visual enhancement hooks exist in the player module

## Circuit-specific player rule
- Overview is intentionally compressed.
- At player start, the circuit preview is expanded to the full repeated sequence.
- React migration must preserve this review-vs-execution distinction if parity is the goal.

---

## Dashboard/account relevance to migration

## Account system relevance
Keep in migration scope; it is not incidental.

Current behavior:
- Entirely localStorage-backed
- No server API contract
- User model includes:
  - identity/profile
  - avatar
  - goals/experience
  - security question/answer
  - stats
  - optional workout history
- Passwords are hashed with PBKDF2 in modular implementation
- Password reset uses security question flow

Migration implication:
- React app must either preserve these localStorage contracts or include a deliberate migration layer.
- Auth UX parity matters because the header and profile state visibly change.

## Dashboard relevance
Also in migration scope.

Current behavior:
- Separate page
- Reads `fitflow_analytics`, `fitflow_analytics_events`, and personal workout data from localStorage
- Can fall back to synthetic sample data when local data is missing

Migration implication:
- Dashboard can migrate later, but its data contract should be frozen now.
- Any storage key changes will break the existing dashboard unless bridged.

---

## Existing test and documentation signals

## Positive signals
- Clear migration plan exists.
- README includes local run instructions.
- `TEST_AUDIT.md` defines canonical release contract.
- There are Python unit tests for quality gate and e2e runner helpers.
- CI workflows exist.

## Gaps / caveats
- No JS unit tests for workout generation domain in current static implementation.
- Runtime depends on CDN Tailwind, which emits a production warning.
- Browser-driven auth regression test currently depends on Playwright being installed.
- Large amount of duplicated/legacy logic in `src/script.js` raises risk of accidental behavior drift during migration.

## Lightweight test result from audit
Command:
- `python -m unittest discover -s ci-cd/tests -p "test_*.py" -v`

Observed result:
- Most helper/unit tests passed.
- `test_auth_regression` failed to import because `playwright` is not installed in the current environment.

Interpretation:
- Test suite is partially runnable locally.
- Current repo baseline is not "clean green" out of the box in this environment.

---

## Console / runtime signals captured

Observed browser console messages after loading the app and generating a workout:

### Warning
- `cdn.tailwindcss.com should not be used in production`

### Informational logs
- Visual enhancements module initialization logs

No fatal runtime errors were observed in the limited landing + generate path check.

---

## Known bugs, oddities, and migration risks

1. **Dual implementation risk**
   - `src/script.js` and modular `src/js/*` overlap heavily.
   - Risk: migration work may accidentally preserve behavior from the wrong source.
   - Recommendation: treat modular runtime as primary source of truth, but check legacy file when behavior seems unexplained.

2. **Randomized generation without deterministic seed**
   - Makes exact parity assertions harder.
   - React parity should compare structure and invariants, not exact exercise identity, unless fixtures are later introduced.

3. **Storage-contract coupling**
   - Dashboard, auth, and analytics are tightly coupled to localStorage keys.
   - Any React rewrite that changes storage shape needs migration adapters.

4. **Circuit preview vs player expansion**
   - Overview and player intentionally differ for circuit workouts.
   - Easy place for parity regressions.

5. **Timing rule inconsistency between legacy and modular code**
   - Legacy validation mentions different timing minimums than modular validation in places.
   - React migration should lock to the modular runtime path unless a bugfix is explicitly accepted.

6. **Dashboard sample-data fallback may mask missing analytics**
   - Useful UX, but can hide real instrumentation regressions.

7. **Tailwind CDN dependency**
   - Produces warning and is unsuitable for production-grade React parity without build integration.
   - This is a migration tech task, not a parity blocker by itself.

8. **Accounts are local-only and security-question based**
   - Acceptable for static app parity, but not robust product auth.
   - If changed later, classify as intentional improvement rather than silent parity drift.

---

## Recommended parity source of truth order

When migrating to React, use this precedence:

1. Actual runtime behavior observed in `index.html` + modular JS
2. Modular source under `src/js/`
3. `src/script.js` only as secondary reference for legacy behavior/details
4. README/docs only as supporting context

---

## Suggested next step (Ticket 0.2 prep)

Before scaffolding React:

- Freeze storage key inventory and workout result shape in tests/fixtures.
- Add deterministic baseline scenarios for Standard, Circuit, Tabata, and Pyramid modes.
- Decide whether React migration will preserve dashboard/account localStorage schema or introduce explicit migration adapters.
