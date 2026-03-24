# MIGRATION_PLAN.md

## Project
**Repo:** https://github.com/oskkau25/workout_generator_en  
**Goal:** migrate the app from a static web app to React using a **parity-first** approach.

---

# Migration Principles

1. **Preserve behavior first**
   - The current static app is the behavioral source of truth unless a change is explicitly approved.

2. **Do not rewrite blindly**
   - First audit the existing app.
   - Extract business logic before rebuilding UI.

3. **Work in small tickets**
   - Complete one ticket at a time.
   - After each ticket, run the required testing loop.

4. **Document drift**
   - Any mismatch between old app and React app must be logged as:
     - intended improvement
     - bug in old app
     - regression in new app

5. **Commit after each completed ticket**
   - Keep history readable and reversible.

---

# Recommended Stack

Unless the repository strongly suggests otherwise, use:

- **Vite**
- **React**
- **TypeScript**
- **ESLint**
- **Vitest**
- **React Testing Library**
- **Playwright** (recommended for P1 E2E parity)

---

# Required Testing Loop After Every Ticket

After each ticket, run this loop in order:

1. **Build**
   - Run the build.
   - Fix compile errors before moving on.

2. **Lint**
   - Run lint checks.
   - Fix migration-relevant warnings/errors.

3. **Automated tests**
   - Run unit/component/E2E tests for the changed area.

4. **Manual parity check**
   - Compare old app vs React app for the touched flow.
   - Use at least one baseline scenario.

5. **Console audit**
   - Verify there are no fatal runtime errors or uncaught exceptions.

6. **Regression log**
   - Update migration notes with:
     - what changed
     - what passed
     - what failed
     - whether mismatch is accepted or a bug

7. **Commit**
   - Create one meaningful commit for the completed ticket.

**Do not skip testing loops.**

---

# Delivery Phases

## Epic 0 — Discovery + Baseline Freeze

### Ticket 0.1 — Audit current static app behavior
**Goal:** understand the current app before migrating.

#### Tasks
- inspect current project structure
- identify all user-facing flows
- identify all form inputs and state transitions
- identify generate logic and output structure
- identify player/timer flow
- capture screenshots and/or video of core flows
- record current console errors or warnings
- create:
  - `docs/migration-baseline.md`
  - `docs/parity-baseline.md`

#### Output
- feature inventory
- state map
- flow map
- baseline scenario results
- known bugs / oddities

#### Testing loop
- run old app locally
- test baseline scenarios
- record actual behavior and output

#### Exit criteria
- existing behavior is documented well enough to judge React parity

---

### Ticket 0.2 — Scaffold React app
**Goal:** create a clean React foundation.

#### Tasks
- scaffold React app
- add TypeScript
- add linting
- add tests
- set up basic app shell
- decide whether migration happens:
  - in-place
  - in subfolder
  - in separate branch structure

#### Output
- working React app
- build/lint/test scripts
- initial project structure

#### Testing loop
- build passes
- lint passes
- tests run
- app starts without fatal console errors

#### Exit criteria
- React app is ready for incremental migration

---

## Epic 1 — Domain Logic Extraction

### Ticket 1.1 — Extract workout generation logic into pure modules
**Goal:** separate business logic from UI.

#### Tasks
- find current generation logic
- move logic into typed pure functions/modules
- define input and output types
- separate:
  - preset mapping
  - form normalization
  - workout generation
  - timing/structure
  - intensity/level adjustments
  - equipment-based exercise selection

#### Output
- typed domain modules under `src/domain` or equivalent

#### Testing loop
- unit tests for generation logic
- compare outputs with static app for baseline scenarios

#### Exit criteria
- domain logic is UI-agnostic and tested

---

### Ticket 1.2 — Add parity fixtures and regression tests
**Goal:** make logic drift visible early.

#### Tasks
- create fixture inputs for key scenarios
- assert output structure and critical values
- define exact-match vs acceptable-variance rules

#### Output
- fixture-based parity tests

#### Testing loop
- run fixture tests against baseline expectations
- log mismatches with explanation

#### Exit criteria
- logic regressions are caught automatically

---

## Epic 2 — Builder/Form Migration

### Ticket 2.1 — Build React form shell
**Goal:** recreate the builder form in React.

#### Tasks
- build form UI for:
  - goal
  - duration
  - level
  - equipment
  - presets
- initialize sane defaults
- use controlled state
- render summary placeholder

#### Output
- interactive React builder shell

#### Testing loop
- verify defaults
- verify all options selectable
- verify state updates correctly
- verify no console/runtime issues

#### Exit criteria
- core input controls behave correctly

---

### Ticket 2.2 — Presets + live summary parity
**Goal:** match old builder responsiveness.

#### Tasks
- wire preset buttons
- implement live summary updates
- sync CTA/subtitle text with selections
- ensure presets never create invalid combinations

#### Output
- full builder interaction parity

#### Testing loop
- test each preset mapping
- verify summary updates immediately
- verify mobile text stays in sync

#### Exit criteria
- presets and live summary match expected behavior

---

## Epic 3 — Generation Result View

### Ticket 3.1 — Connect builder to workout generation
**Goal:** make Generate work end-to-end.

#### Tasks
- connect form state to domain logic
- render generated workout result
- display:
  - summary/title
  - exercise list
  - timing/structure
- handle invalid/empty states safely

#### Output
- working generate flow

#### Testing loop
- baseline scenarios
- render validation
- console audit during generate flow

#### Exit criteria
- generate works reliably and required result sections render

---

### Ticket 3.2 — Regenerate/reset behavior
**Goal:** allow repeated use without stale state.

#### Tasks
- support re-generation after input changes
- clear stale player/result state when needed
- ensure repeated generate cycles remain stable

#### Output
- clean repeat generation flow

#### Testing loop
- repeated generate/change/generate cycles
- watch for duplicated handlers, stale cards, stale timers

#### Exit criteria
- app remains stable after multiple generate cycles

---

## Epic 4 — Workout Player Migration

### Ticket 4.1 — Build player state machine / reducer
**Goal:** make workout playback deterministic.

#### Tasks
- define explicit player states:
  - idle
  - active
  - rest
  - paused
  - completed
- implement transitions:
  - start
  - pause/resume
  - next/previous
  - exercise to rest
  - rest to next exercise
  - finish

#### Output
- isolated player logic

#### Testing loop
- unit tests for all transitions and edge cases

#### Exit criteria
- playback logic is deterministic and test-covered

---

### Ticket 4.2 — Build React player UI
**Goal:** deliver the visible active workout experience.

#### Tasks
- create player UI
- wire Start Workout
- wire Play/Pause
- wire Next/Previous
- render exercise/rest/completion states clearly

#### Output
- usable workout player in React

#### Testing loop
- full-flow manual testing
- verify player controls
- verify completion state
- verify no transition bugs

#### Exit criteria
- player core flow is parity-stable

---

## Epic 5 — Accessibility + UX Hardening

### Ticket 5.1 — Accessibility pass
**Goal:** make builder and player accessible enough for release.

#### Tasks
- add/verify labels
- improve keyboard navigation
- ensure visible focus states
- improve aria for critical controls
- make timer/player state understandable for assistive tech where practical

#### Output
- accessibility improvements across main flow

#### Testing loop
- keyboard-only pass
- label/role inspection
- automated a11y checks if available

#### Exit criteria
- major accessibility gaps are addressed or documented

---

### Ticket 5.2 — UX polish and validation states
**Goal:** remove rough edges before release.

#### Tasks
- improve loading/transition feedback
- ensure one clear primary CTA at each stage
- improve empty/error/validation messaging
- verify mobile responsiveness
- eliminate dead-click or ambiguous states

#### Output
- polished and understandable user flow

#### Testing loop
- mobile viewport checks
- repeated interaction loops
- stress test transitions

#### Exit criteria
- UX quality is good enough for release candidate

---

## Epic 6 — Dashboard/Account Migration (If Applicable)

### Ticket 6.1 — Migrate dashboard/account surfaces
**Goal:** port secondary app surfaces after core flow is stable.

#### Tasks
- identify whether dashboard/account exists
- migrate relevant cards, menus, actions
- verify responsive behavior
- verify navigation and actions

#### Output
- React parity for secondary surfaces

#### Testing loop
- render tests
- click-through checks
- responsive spot checks

#### Exit criteria
- secondary surfaces are functional or documented as deferred

---

## Epic 7 — Parity Harness

### Ticket 7.1 — Build repeatable parity validation
**Goal:** make parity repeatable, not manual guesswork.

#### Tasks
- create:
  - `docs/parity-checklist.md`
  - `docs/test-scenarios.md`
  - `docs/regression-log.md`
- add Playwright E2E for P1 flow if practical

#### Output
- reusable parity docs
- core E2E coverage

#### Testing loop
- run old app and React app side by side
- compare results using checklist
- log any drift with exact repro steps

#### Exit criteria
- parity validation can be repeated reliably before release

---

## Epic 8 — Release Candidate + Cleanup

### Ticket 8.1 — Final hardening and release prep
**Goal:** ship only after confidence exists.

#### Tasks
- remove dead code
- clean project structure
- confirm deployment/build path
- update README
- document known issues and accepted deviations
- prepare release notes

#### Output
- release candidate
- clean docs
- known issues list

#### Testing loop
- full build/lint/test
- final parity checklist pass
- browser/device spot checks
- final console audit

#### Exit criteria
- all release conditions satisfied

---

# Parity Checklist

## Environment Setup
Old app URL: ________________  
React app URL: ________________  

Browser/device matrix:
- Desktop Chrome: pass/fail
- Desktop Safari: pass/fail
- Mobile viewport (iPhone 12-ish): pass/fail

Test date/build: ________________

---

## P1 — Core Flow (Must Pass)

- [ ] Form loads with default selections  
  **Expected:** required fields have sane defaults, no empty/broken UI.

- [ ] Goal selection updates internal state  
  **Expected:** changing goal reflects in summary and final generated workout.

- [ ] Duration selection works for all options  
  **Expected:** each duration option is selectable and persists.

- [ ] Level selection changes output intensity  
  **Expected:** beginner/intermediate/advanced differences visible in result.

- [ ] Equipment selection affects exercise choices  
  **Expected:** bodyweight vs equipment changes generated exercise set.

- [ ] Preset buttons populate form correctly  
  **Expected:** all preset values map correctly, no invalid duration/level combo.

- [ ] Generate action succeeds  
  **Expected:** clicking generate creates a workout without console/runtime errors.

- [ ] Generated workout renders required sections  
  **Expected:** title/summary, exercise list, timing/structure visible.

- [ ] Start Workout enters player mode/state  
  **Expected:** clear transition from generated view to active workout player.

- [ ] Player Play/Pause works  
  **Expected:** timer/progression responds correctly to pause/resume.

- [ ] Player Next/Previous works  
  **Expected:** exercise navigation updates current exercise correctly.

- [ ] Exercise ? Rest ? Next Exercise transition works  
  **Expected:** transitions are deterministic and do not skip/loop incorrectly.

- [ ] Workout completion state appears  
  **Expected:** end-of-workout message/actions shown after final exercise.

- [ ] No fatal console errors during full flow  
  **Expected:** zero uncaught exceptions in core journey.

---

## P2 — UX Quality (Should Pass)

- [ ] Live summary updates on each relevant input change  
  **Expected:** duration/level/equipment/format reflect instantly.

- [ ] Mobile CTA/subtitle text stays in sync with selections  
  **Expected:** no stale text after changing options.

- [ ] Primary CTA hierarchy is clear  
  **Expected:** one obvious action at each stage, no conflicting CTAs.

- [ ] Loading/transition states feel responsive  
  **Expected:** no dead clicks or ambiguous waiting.

- [ ] Validation and empty/error states are user-friendly  
  **Expected:** clear guidance if required input missing/invalid.

- [ ] Form remains usable after multiple generate cycles  
  **Expected:** no duplicated cards/handlers/memory-like behavior.

- [ ] Session reset/new generation works cleanly  
  **Expected:** can generate a second workout without stale player state.

---

## P2 — Accessibility (Should Pass)

- [ ] Keyboard-only: full generate flow possible  
  **Expected:** tab order logical, controls operable via keyboard.

- [ ] Visible focus states on interactive elements  
  **Expected:** focus ring/highlight visible and consistent.

- [ ] Labels/aria for inputs and controls  
  **Expected:** no unlabeled critical controls.

- [ ] Timer/player announcements are understandable  
  **Expected:** screen-reader-relevant state changes exposed appropriately.

- [ ] Color contrast acceptable for text/CTAs  
  **Expected:** no critical low-contrast failures on primary screens.

---

## P3 — Dashboard/Account (Nice to Have per Milestone)

- [ ] Dashboard key cards render correctly
- [ ] Dashboard responsive behavior matches intent
- [ ] Account menu/actions reachable and functional
- [ ] Analytics events fire for key actions (if tracked)

---

# Regression Watchlist Template

For each issue found, record:

- **Severity:** P1 / P2 / P3
- **Area:** builder / player / dashboard / account
- **Repro steps:**
  1. ...
  2. ...
- **Expected:**
- **Actual:**
- **Console error (if any):**
- **Screenshot/video link:**
- **Owner:**
- **Status:**

---

# Minimum Test Scenario Matrix

## Scenario 1 — Quick Bodyweight Beginner
- Goal: fat loss
- Duration: 15
- Level: beginner
- Equipment: bodyweight

Verify:
- summary accuracy
- generation success
- player transitions
- completion state

## Scenario 2 — Standard Strength Intermediate
- Goal: strength
- Duration: 30
- Level: intermediate
- Equipment: dumbbells/resistance

Verify:
- summary accuracy
- generation success
- player transitions
- completion state

## Scenario 3 — Long Endurance Advanced
- Goal: endurance
- Duration: 45 or 60
- Level: advanced
- Equipment: mixed/full

Verify:
- summary accuracy
- generation success
- player transitions
- completion state

---

# Exit Criteria

Release candidate can ship only when:

- all P1 checks pass
- no uncaught runtime errors in core flow
- P2 failures are documented with agreed follow-up tickets
- lint/test/build are green
- product sign-off is recorded

---

# Execution Order

Run tickets in this order:

1. Ticket 0.1 — Audit current static app behavior
2. Ticket 0.2 — Scaffold React app
3. Ticket 1.1 — Extract workout generation logic
4. Ticket 1.2 — Add parity fixtures/tests
5. Ticket 2.1 — Build form shell
6. Ticket 2.2 — Presets + live summary
7. Ticket 3.1 — Connect generation/render results
8. Ticket 3.2 — Regenerate/reset behavior
9. Ticket 4.1 — Player state machine
10. Ticket 4.2 — Player UI
11. Ticket 5.1 — Accessibility pass
12. Ticket 5.2 — UX hardening
13. Ticket 6.1 — Dashboard/account if needed
14. Ticket 7.1 — E2E parity harness
15. Ticket 8.1 — Release candidate cleanup

---

# Operational Instructions for OpenClaw

When executing this migration:

- work ticket by ticket in the order above
- do not skip testing loops
- do not silently accept parity drift
- log all findings in docs
- keep commits small and meaningful
- preserve behavior first, optimize second
- if architecture choices become unclear, prefer the simplest React solution that maintains parity
