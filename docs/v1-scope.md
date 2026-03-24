# V1 Scope vs Later Scope

Date: 2026-03-24  
Ticket: 1.2 — Define v1 scope vs later scope

Source inputs:
- `PRODUCT_SPEC.md`
- `MIGRATION_PLAN.md`
- `docs/lessons-learned.md`
- `docs/screen-map.md`
- `docs/user-flow.md`

---

# Purpose

This document defines what belongs in the first redesigned React release, what is intentionally deferred, and what should not be rebuilt from the legacy app.

Its job is to reduce scope creep and provide implementation boundaries.

---

# V1 Release Goal

Ship a coherent, mobile-first React version of the app that delivers the core product promise:

> A regular home exerciser can generate a smart, equipment-aware, customizable workout and complete it through a guided coach-style player.

V1 should prioritize:
- builder quality
- generation quality
- player quality
- mobile usability
- maintainable architecture

V1 should **not** try to fully rebuild every historical feature of the static app.

---

# What V1 Must Include

## 1. Core Builder Experience
The React app must include a redesigned builder that supports:
- workout goal/focus selection
- duration selection
- level/intensity selection
- equipment selection
- workout format selection
- advanced settings via progressive disclosure
- a clear primary generate action
- a live summary or clear reflection of selected configuration

## 2. Core Workout Generation Engine
The app must generate workouts that are:
- equipment-aware
- structured
- balanced
- format-aware
- consistent with product expectations

### Protected generation invariants
V1 must preserve these conceptually:
- warm-up / main / cool-down structure
- multiple workout formats
- meaningful format-specific behavior
- clear generated summary metadata before player start

## 3. Workout Summary / Review Step
V1 must include a review screen/state before the player starts.

The user must be able to:
- inspect the workout
- understand the structure
- start the workout
- go back to edit
- regenerate if needed

## 4. Guided Player / Coach Flow
V1 must include a player that supports:
- start workout
- work/rest transitions
- pause/resume
- next/previous where appropriate
- progress visibility
- completion state

The player must feel like a guided workout flow, not just a timer utility.

## 5. Completion Experience
V1 must include a meaningful workout completion state with clear next actions.

## 6. Lightweight Local Persistence
V1 may persist useful local state for continuity, such as:
- resumable workout/session state
- lightweight local history
- user preferences if useful

Persistence should improve UX without forcing backend assumptions.

## 7. Lightweight Progress Surface
V1 should include a scoped dashboard/progress surface that can show:
- recent workouts
- lightweight local stats
- encouraging empty states

This is a real surface, but should remain intentionally limited.

## 8. Future-Ready Architecture
V1 must be structured to support later addition of:
- authentication
- backend persistence
- analytics
- richer user history/progress

---

# What V1 Should Include If Reasonably Cheap

These are good additions if they fit naturally without inflating scope:
- resume workout prompt
- lightweight preferences/profile placeholders
- substitution/exercise detail affordances
- basic onboarding/product framing copy
- simple motivational completion messaging
- empty-state UX for dashboard/profile

These are useful, but should not delay core builder/generator/player quality.

---

# What Is Explicitly Deferred

## 1. Full Authentication
Deferred:
- registration flows
- login flows
- logout flows
- password reset
- local account recreation
- auth provider integration

Reason:
Not central to the v1 product goal and likely to change when a backend exists.

## 2. Full Analytics Platform
Deferred:
- event ingestion strategy
- analytics dashboards with deep metrics
- backend analytics integration
- behavior-tracking implementation beyond lightweight local needs

Reason:
Important later, but not core to the first redesign milestone.

## 3. Deep Dashboard Intelligence
Deferred:
- advanced charts
- rankings/insights complexity
- rich behavior analytics
- fully developed progress intelligence

Reason:
Would distract from the core workout flow.

## 4. Cross-Device / Cloud Sync
Deferred:
- server persistence
- account-bound workout history
- multi-device continuity

## 5. Heavy Personalization Based on Identity
Deferred:
- profile-driven adaptive training history
- account-specific recommendations
- cloud-saved personalization

---

# What Should Not Be Rebuilt As-Is

These legacy elements should not be recreated unless a new rationale appears.

## 1. Old preset-first interaction model
Presets may be replaced by better defaults, templates later, or cleaner builder patterns.

## 2. Legacy auth/header complexity
The old login/register emphasis should not dominate the new landing experience.

## 3. Dashboard-heavy first impression
The product should not present itself as analytics-first.

## 4. Duplicated logic paths
Do not recreate parallel implementations or global-state-heavy architecture.

## 5. Storage contracts preserved only for nostalgia
Old localStorage contracts are useful as migration references, not permanent design constraints, unless explicitly chosen.

---

# Acceptable V1 Placeholders

These are acceptable as scoped placeholders in v1:
- Profile screen with settings/future account messaging
- Dashboard with lightweight local summaries and strong empty states
- Analytics service interface with no full backend implementation
- Auth interface/contracts without active auth UI
- persistence abstractions prepared for backend replacement later

---

# V1 Non-Negotiables

The redesign should not be considered complete for v1 unless these are true:
- mobile-first builder is usable and polished
- equipment-aware generation works reliably
- multiple formats are supported in a meaningful way
- summary/review step exists
- guided player is complete enough for full workout flow
- completion state exists
- architecture is cleaner than the static app

---

# Scope Guardrails

## Guardrail 1
If a feature does not improve the builder, generator, player, completion, or future-ready architecture, question whether it belongs in v1.

## Guardrail 2
If a feature exists mainly because the static app had it, that is not enough reason to include it.

## Guardrail 3
If dashboard or profile work starts to rival builder/player effort, scale it back.

## Guardrail 4
If auth or analytics begins demanding real implementation, defer it unless explicitly re-prioritized.

## Guardrail 5
If implementation becomes blocked by future backend concerns, use interfaces/placeholders instead of solving the whole future now.

---

# Suggested Milestone View

## Milestone A — Product foundation
- product docs
- screen map
- user flow
- v1 scope
- domain model

## Milestone B — Technical foundation
- React scaffold
- typed domain logic
- player state machine
- testing foundations

## Milestone C — Core experience
- builder
- summary
- player
- completion

## Milestone D — Supporting surfaces
- local persistence
- progress/dashboard shell
- profile/preferences placeholder

## Milestone E — Quality and future seams
- accessibility and polish
- integration seams
- release cleanup

---

# Exit Criteria for This Ticket

This scope definition is successful if:
- v1 priorities are explicit,
- deferred work is explicit,
- legacy features not to rebuild are explicit,
- implementation can continue without repeated scope arguments.
