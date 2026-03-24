# MIGRATION_PLAN.md

## Project
**Repo:** https://github.com/oskkau25/workout_generator_en  
**Goal:** redesign and rebuild the app in React using lessons from the static app, not a blind feature-for-feature port.

Related source of truth:
- `PRODUCT_SPEC.md`
- `docs/migration-baseline.md`
- `docs/parity-baseline.md`

---

# 1. Strategy Shift

This project is **not** a strict parity-first migration anymore.

It is now a **redesign-first rebuild** with protected core invariants.

## What this means
- The old static app is a lesson source and behavioral reference.
- We preserve what matters conceptually.
- We redesign what was awkward, cluttered, or legacy-driven.
- We do not rebuild legacy UX just because it already exists.

## Protected invariants
These capabilities must survive the rebuild in some form:
- workout generation remains the core value
- equipment-aware generation remains central
- multiple workout formats remain supported
- guided player / timer remains central
- dashboard remains part of the product direction
- architecture should support future backend/auth/analytics integration

## Explicit non-goals for v1
- porting old login/auth exactly as-is
- porting old analytics exactly as-is
- preserving old presets as a required UX model
- preserving legacy page structure or storage contracts unless useful

---

# 2. Product Direction Summary

The new app should be:
- mobile-first
- premium
- sporty
- playful
- motivating
- customer-centric

Target audience:
- regular home exercisers

Core promise:
- generate a personalized workout quickly
- give the user meaningful control
- guide them through the session like a coach

Success measures:
- cleaner UI/UX
- easier maintenance
- better mobile use
- easier future feature work

---

# 3. Working Principles

1. **Design from the user perspective**
   - Every new screen and flow should justify itself through usability, not legacy parity.

2. **Keep the good, replace the clunky**
   - Preserve core workout value.
   - Replace confusing or legacy-driven interactions.

3. **Separate domain logic from UI early**
   - Generation and player logic must become testable, typed modules.

4. **Build mobile-first**
   - Primary layouts and interactions should be designed for phones first.

5. **Prefer progressive disclosure**
   - Support lots of control without overwhelming the user.

6. **Design for future backend integration without requiring it now**
   - Auth, analytics, and persistence should have clean seams.

7. **Validate against product goals, not just parity checkboxes**
   - Use parity baselines as reference, not as a cage.

---

# 4. Delivery Model

The work should happen in three layers:

## Layer A — Product definition
Clarify what the new app is and what it is not.

## Layer B — Technical foundation
Set up React architecture, domain models, tests, and state boundaries.

## Layer C — Experience implementation
Build the builder, summary, player, and supporting surfaces intentionally.

---

# 5. Required Loop After Every Ticket

After each ticket, run this loop:

1. **Build**
   - run build / compile checks

2. **Lint**
   - run linting / static checks

3. **Automated tests**
   - run tests relevant to the changed area

4. **Experience validation**
   - verify the changed flow against product goals
   - verify important invariants from the baseline docs

5. **Console audit**
   - check for runtime errors/warnings

6. **Regression/design log**
   - record:
     - what changed
     - why it changed
     - what was intentionally redesigned
     - what invariant was preserved
     - what still needs follow-up

7. **Commit**
   - one meaningful commit per completed ticket

Do not skip the validation loop.

---

# 6. Execution Phases

## Phase 0 — Baseline and lessons learned

### Ticket 0.1 — Audit current static app behavior
**Status:** completed

Artifacts:
- `docs/migration-baseline.md`
- `docs/parity-baseline.md`

### Ticket 0.2 — Convert audit into lessons learned
**Goal:** extract what to keep, fix, remove, and defer from the old app.

#### Tasks
- review baseline docs
- identify strengths of current app
- identify UX pain points and legacy clutter
- identify parity invariants worth preserving
- identify features or patterns that should be removed or deferred
- create `docs/lessons-learned.md`

#### Deliverables
- keep / improve / remove / defer matrix
- list of product invariants
- list of redesign opportunities

#### Exit criteria
- the team has a clear redesign lens before architecture work continues

---

## Phase 1 — Product and UX definition

### Ticket 1.1 — Create screen map and user flow definition
**Goal:** define the intended new experience before building.

#### Tasks
- define primary app flow from landing to completion
- define main screens/states:
  - builder
  - workout summary
  - player
  - dashboard shell
  - profile/account placeholder if needed
- define main navigation model
- define mobile-first layout priorities
- create `docs/screen-map.md`
- create `docs/user-flow.md`

#### Deliverables
- screen map
- flow map
- mobile-first UX structure

#### Exit criteria
- the new app’s structure is explicit and approved

---

### Ticket 1.2 — Define v1 scope vs later scope
**Goal:** stop scope creep before implementation.

#### Tasks
- define must-have v1 features
- define deferred features
- define placeholder surfaces allowed in v1
- define what will not be rebuilt from the old app
- create `docs/v1-scope.md`

#### Deliverables
- v1 scope document
- later roadmap placeholders

#### Exit criteria
- implementation can proceed without re-litigating scope every ticket

---

## Phase 2 — Domain and architecture foundation

### Ticket 2.1 — Define domain model and data contracts
**Goal:** create the new app’s clean internal model.

#### Tasks
- define builder input model
- define generated workout model
- define player state model
- define storage abstraction / interfaces
- define future backend seam for accounts/analytics/history
- create `docs/domain-model.md`

#### Deliverables
- typed domain contracts
- technical reference for implementation

#### Exit criteria
- generation and player work can be implemented cleanly in React

---

### Ticket 2.2 — Scaffold React application foundation
**Goal:** establish the new frontend stack.

#### Recommended stack
- Vite
- React
- TypeScript
- ESLint
- Vitest
- React Testing Library
- Playwright where practical

#### Tasks
- scaffold React app
- set up TypeScript
- add linting and testing
- create app shell and routing approach
- define folder structure for:
  - app
  - components
  - features
  - domain
  - hooks
  - services/storage
  - test helpers

#### Deliverables
- running React foundation
- build/lint/test scripts
- initial app shell

#### Exit criteria
- implementation can begin on stable foundations

---

### Ticket 2.3 — Extract core workout generation logic into typed modules
**Goal:** separate generation logic from legacy UI and make it testable.

#### Tasks
- identify reusable logic from static app
- port/adapt generation logic into pure TypeScript modules
- define format-specific invariants
- avoid DOM dependency
- write fixture/invariant tests

#### Deliverables
- `src/domain/` generation modules
- unit tests for generation logic

#### Exit criteria
- generator logic is reusable, testable, and React-independent

---

### Ticket 2.4 — Define player state machine / reducer
**Goal:** create a reliable guided-coach execution model.

#### Tasks
- define player states and transitions
- handle work/rest/complete logic
- handle pause/resume/next/previous
- support future audio/haptic hooks cleanly
- add tests for transition behavior

#### Deliverables
- player controller/state machine
- transition tests

#### Exit criteria
- player logic is deterministic and isolated from UI

---

### Ticket 2.5 — Create implementation blueprints for builder, summary, and player UI
**Goal:** bridge the domain foundation into concrete Phase 3 screen implementation targets.

#### Tasks
- define builder sections, fields, defaults, CTA behavior, and live-summary rules
- define summary screen content, layout, actions, and format-specific rendering rules
- define player UI composition, controls, states, progress behavior, and completion transition
- align the docs with `PRODUCT_SPEC.md`, Phase 1 docs, and the new domain/player contracts in `new-app/`
- create:
  - `docs/builder-spec.md`
  - `docs/summary-spec.md`
  - `docs/player-ui-spec.md`

#### Deliverables
- implementation-facing blueprint docs for the three core Phase 3 screens

#### Exit criteria
- Phase 3 work can start from explicit screen behavior and state expectations instead of inventing them during implementation
- `new-app/` passes reproducible clean checks from a fresh install (`npm ci`, `npm run lint`, `npm run test -- --run`, `npm run build`) before Phase 3 tickets continue

---

## Phase 3 — Experience implementation

### Ticket 3.1 — Build the mobile-first workout builder
**Goal:** create the new primary entry experience.

#### Tasks
- implement mobile-first builder UI
- organize controls with progressive disclosure
- support lots of control without clutter
- include live summary of workout intent
- remove dependency on legacy preset-first interaction

#### Deliverables
- builder flow in React
- responsive/mobile-first interaction model

#### Validation focus
- speed to generate
- clarity of control groups
- mobile usability

#### Exit criteria
- users can configure workouts clearly and confidently on mobile

---

### Ticket 3.2 — Build workout summary / review experience
**Goal:** let users understand the generated workout before starting.

#### Tasks
- render generated workout summary
- show structure clearly
- show workout metadata and intent
- present clear start / regenerate actions
- support multiple workout formats cleanly

#### Deliverables
- workout summary screen
- regenerate loop

#### Exit criteria
- generated workouts are understandable and actionable before player start

---

### Ticket 3.3 — Build the guided player / coach experience
**Goal:** create a focused step-by-step workout execution flow.

#### Tasks
- build mobile-first player UI
- render current exercise, next context, progress, and controls
- support pause/resume/next/previous
- make work/rest transitions obvious
- create motivating completion state

#### Deliverables
- player UI wired to player logic
- completion flow

#### Validation focus
- low cognitive load during session
- easy mid-workout interaction
- coaching feel rather than timer-only feel

#### Exit criteria
- player feels like a guided coach and supports full workout completion

---

### Ticket 3.4 — Add lightweight local persistence
**Goal:** improve UX without binding to backend decisions.

#### Tasks
- persist useful workout/session state locally where appropriate
- define storage adapter boundaries
- avoid hard-coding future backend assumptions

#### Deliverables
- storage layer / adapter
- local persistence for useful states

#### Exit criteria
- app supports sensible local continuity without architectural debt

---

### Ticket 3.5 — Build dashboard shell / lightweight progress surface
**Goal:** preserve product direction without overbuilding analytics now.

#### Tasks
- define dashboard shell
- show lightweight local summaries if useful
- establish navigation and information architecture for future expansion
- avoid deep analytics implementation unless clearly justified

#### Deliverables
- dashboard shell / limited v1 dashboard

#### Exit criteria
- dashboard exists in a future-ready but scoped form

---

## Phase 4 — Quality, polish, and future readiness

### Ticket 4.1 — Accessibility and interaction polish
**Goal:** ensure the redesigned app works cleanly and accessibly.

#### Tasks
- keyboard support
- labels and aria
- visible focus states
- mobile interaction polish
- error and empty state handling

#### Exit criteria
- major usability and accessibility issues are resolved or documented

---

### Ticket 4.2 — Future integration seams
**Goal:** make later backend/auth/analytics work easy.

#### Tasks
- document service boundaries
- define auth placeholder interfaces
- define analytics event model placeholder
- define history/progress persistence seam
- create `docs/integration-seams.md`

#### Exit criteria
- future backend work can be added without major refactors

---

### Ticket 4.3 — Release candidate cleanup
**Goal:** ship a coherent, maintainable v1 redesign.

#### Tasks
- clean dead code
- update README/docs
- verify build/lint/tests
- run focused UX walkthroughs
- document known limitations and later-scope items

#### Exit criteria
- v1 redesign is coherent, stable, and maintainable

---

# 7. Validation Model

## Validate against these categories

### A. Product goal alignment
- Is the flow fast?
- Is the experience mobile-first?
- Does the user feel in control?
- Does the app feel motivating and polished?

### B. Core capability preservation
- Does generation still work well?
- Are equipment-aware workouts still central?
- Are multiple workout formats still supported?
- Does the player support full guided sessions?

### C. Maintainability
- Is the logic separated from UI?
- Is state manageable?
- Are future backend seams clear?

### D. Redesign quality
- Is the new flow better than the old one?
- Did we remove clutter instead of just moving it?
- Did we avoid carrying over legacy awkwardness?

---

# 8. Practical Notes for OpenClaw / Implementer

When executing this plan:
- use `PRODUCT_SPEC.md` as the primary product source of truth
- use baseline docs as reference, not as a cage
- preserve conceptual value, not old UI for its own sake
- prefer clean architecture over compatibility hacks
- document intentional redesign choices
- if a legacy behavior conflicts with the product direction, redesign it unless it is a protected invariant

---

# 9. Recommended Next Ticket

Proceed with:

## Ticket 0.2 — Convert audit into lessons learned

That is the best next step before more implementation, because it turns the baseline into explicit product and UX decisions instead of letting legacy behavior silently drive the rebuild.
