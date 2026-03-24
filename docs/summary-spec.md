# Workout Summary Implementation Spec

Date: 2026-03-24  
Ticket: 2.5 — Summary implementation blueprint

Source of truth:
- `PRODUCT_SPEC.md`
- `docs/domain-model.md`
- `docs/screen-map.md`
- `docs/user-flow.md`
- `docs/v1-scope.md`
- `new-app/src/domain/workouts/workout-types.ts`

---

# Purpose

This document defines the v1 workout summary screen that sits between generation and playback.

It should make the generated result:
- understandable,
- trustworthy,
- actionable,
- and easy to start from on mobile.

This screen must preserve the review-before-start product rule.

---

# 1. Screen role

The summary screen is the review surface for a `GeneratedWorkout`.

It exists so the user can:
- understand what was generated,
- inspect the workout structure,
- confirm the selected format and training intent,
- decide whether to start, edit, or regenerate.

It is not just a dump of workout JSON and it is not yet the player.

---

# 2. Input contract

Primary input is a `GeneratedWorkout` with:
- `metadata`
- `blocks`
- `playback`
- `sourceRequest`
- optional `diagnostics`

The summary UI may use a derived feature-level view model for display formatting, but it should not invent structure separate from the generated workout.

---

# 3. Screen layout

Recommended mobile-first vertical layout:

1. **Header / title area**
2. **Workout metadata cards**
3. **Intent recap / source request chip row**
4. **Structured workout sections**
   - warm-up
   - main
   - cool-down
5. **Optional diagnostics / notes area**
6. **Primary and secondary action bar**

On wider layouts, metadata and actions can sit in a side column, but section ordering should stay intact.

---

# 4. Header area

## Required content
- workout title from `metadata.title`
- supportive subtitle describing format and goal
- optional generated-at context if useful later

## Rules
- title should feel like a workout, not a system object
- subtitle should help the user orient quickly, e.g. format + duration + level
- do not overload the header with too many small stats; push those into metadata cards

---

# 5. Metadata cards

## Minimum metadata to show
- estimated duration
- format
- level
- goal/focus
- equipment used
- total exercise count or total steps

## Preferred display
Use small cards/chips in a compact row or grid.

## Formatting guidance
- duration: `30 min`
- format: human label, e.g. `Circuit`
- level: `Intermediate`
- goal: `Full body`
- equipment: list or `3 items`
- step count: `18 exercises`

## Rule
These should provide a quick trust-building scan before the user reads the full blocks.

---

# 6. Intent recap

## Purpose
Reconnect the generated output to what the user asked for.

## Content
Show a compact recap derived from `sourceRequest`, for example:
- chosen format
- target duration
- selected equipment
- warm-up/cool-down included
- target intensity if present

## Why it matters
This helps users answer: “Did the app generate the kind of workout I meant to ask for?”

---

# 7. Structured workout sections

## Required sections
Render `GeneratedWorkout.blocks` in order.

Expected v1 order:
1. warm-up
2. main
3. cool-down

## Section card structure
Each block should include:
- block title
- short block summary
- list of steps

### Block title source
Use `block.title`

### Block summary source
Use `block.summary`

---

# 8. Step rendering rules

## Exercise step
For `kind: 'exercise'`, show:
- exercise name
- short coaching instruction if available through mapped catalog data
- work/rest timing labels
- format position labels where relevant

### Minimum fallback if full exercise enrichment is not ready
- exercise ID or resolved name
- timing
- block position

## Format marker step
For `kind: 'format_marker'`, show:
- marker label
- optional description
- visually distinct but lighter than an exercise card

## Transition step
For `kind: 'transition'`, show:
- transition label
- very light visual treatment
- do not make it compete with exercise cards

---

# 9. Format-specific display rules

## 9.1 Standard

### Summary expectation
- warm-up, main, and cool-down mostly map naturally to what the player will execute
- display full visible step list for each block

### Main block copy
A simple ordered list is fine.

---

## 9.2 Circuit

### Critical rule
The summary should preserve the compact preview behavior while the player uses the fully expanded playback plan.

### What to show
- main block should communicate round structure clearly
- preview only one round’s exercise list in the main section if that is how generation modeled the summary block
- show round stats separately, e.g. `3 rounds × 5 exercises`
- explicitly tell the user that the player will repeat the round structure

### What not to do
- do not render the fully expanded repeated sequence in the main summary by default
- do not make the summary feel longer than the actual review value it provides

### Suggested copy pattern
`Preview round below. The player will guide you through all 3 rounds.`

---

## 9.3 Tabata

### Summary expectation
- make the fixed interval structure obvious
- communicate that timing is normalized to 20s work / 10s rest
- show round/set count prominently

### What to show
- main section header note like `8 rounds of 20s work / 10s rest`
- exercise cards with set or round position labels where available

### Important rule
If the builder exposed timing controls, the summary must still display the effective tabata timing, not the draft timing the user typed.

---

## 9.4 Pyramid

### Summary expectation
- progression must be visually obvious
- level-based structure should be easy to scan

### What to show
- level labels such as `Level 1 of 5`
- a grouped or labeled list of the main progression
- concise explanation that difficulty/structure progresses by level

### Rule
Do not flatten pyramid output into an unlabeled generic list.

---

# 10. Action area

## Primary action
- `Start workout`

### Behavior
- loads or starts a player session from the generated workout
- navigates to the player route

## Secondary actions
- `Edit settings`
- `Regenerate`

### Edit settings behavior
- returns to builder with the current `sourceRequest` rehydrated into draft-compatible state or draft preserved through store/navigation

### Regenerate behavior
- reruns generation with current request settings
- may stay on the same route while replacing summary content, or navigate through a loading transition

## Optional tertiary behavior
- `Save for later` only if it lands cheaply through local persistence

## Rules
- `Start workout` must be the most visually dominant control
- `Edit settings` should feel safe and reversible
- `Regenerate` should not destroy the user’s ability to return to the current result unless that choice is explicit

---

# 11. Diagnostics and notes

## V1 stance
Diagnostics are optional and should stay quiet by default.

## If used
Only show `diagnostics.warnings` or notes when they help explain a generation edge case.

Examples:
- limited equipment narrowed options
- repeats were allowed to satisfy duration
- timing normalized for tabata

## Rule
Diagnostics should support trust, not leak implementation noise.

---

# 12. Empty and failure states

## Missing workout state
If the user lands on summary without a valid `GeneratedWorkout`:
- show a concise error/empty state
- provide a clear route back to builder

Suggested CTA:
- `Build a workout`

## Incomplete enrichment state
If exercise name/instruction mapping is not fully wired yet:
- still render the workout structure using safe fallbacks
- do not block the summary screen

---

# 13. Composition recommendation

Suggested screen decomposition:
- `WorkoutSummaryScreen`
  - `WorkoutSummaryHeader`
  - `WorkoutMetadataGrid`
  - `WorkoutIntentRecap`
  - `WorkoutBlockSection` × n
    - `WorkoutStepRow`
  - `WorkoutSummaryActions`

If a dedicated mapper is introduced, keep it in the feature/domain boundary layer, not inside the generator core.

---

# 14. Acceptance checklist for Ticket 3.2

The summary implementation should be considered aligned when:
- the workout is readable before playback starts,
- metadata is easy to scan on mobile,
- warm-up/main/cool-down structure is explicit,
- standard/circuit/tabata/pyramid each communicate their distinct shape,
- circuit summary stays compact while acknowledging full player repetition,
- actions for start, edit, and regenerate are clear,
- the screen builds trust in the generated workout rather than feeling like a debug page.

---

# Recommended next step

Implement the summary screen immediately after the builder using this spec and `docs/player-ui-spec.md`, so the review-before-start flow lands as one coherent builder → summary → player journey instead of three disconnected screens.