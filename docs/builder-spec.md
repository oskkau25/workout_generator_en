# Builder Implementation Spec

Date: 2026-03-24  
Ticket: 2.5 — Builder implementation blueprint

Source of truth:
- `PRODUCT_SPEC.md`
- `docs/domain-model.md`
- `docs/screen-map.md`
- `docs/user-flow.md`
- `docs/v1-scope.md`
- `new-app/src/domain/builder/builder-types.ts`
- `new-app/src/domain/builder/builder-defaults.ts`
- `new-app/src/domain/builder/builder-normalizer.ts`

---

# Purpose

This document turns the product and domain decisions into a practical build target for the v1 builder screen in `new-app/src/features/builder/`.

It defines:
- what sections the builder should have,
- what fields appear in each section,
- what defaults and constraints apply,
- how the primary CTA behaves,
- how the live summary should behave,
- and what should stay in feature state vs domain state.

This is intentionally implementation-oriented, not a wireframe doc.

---

# 1. Builder role in the product

The builder is the primary entry screen and default landing route.

It should help the user answer, in order:
1. what they want to train,
2. how long and how hard they want it,
3. what equipment they have,
4. what workout format they want,
5. whether they want to fine-tune structure,
6. whether the current configuration looks right before generating.

The builder should feel guided, fast, and powerful without becoming a long static form.

---

# 2. Builder state model

## Feature-layer editable state
Use `BuilderDraft` as the source of editable screen state.

The screen may also keep local UI-only state such as:
- expanded/collapsed sections,
- dirty flags,
- generating/loading state,
- validation/help visibility,
- sticky CTA visibility,
- whether advanced controls are open.

## Domain handoff
On generate:
1. read current `BuilderDraft`,
2. normalize with `normalizeBuilderDraft`,
3. pass `WorkoutGenerationRequest` into the generator.

## Rule
Do not run generator logic directly against half-edited form values.

---

# 3. Section order

Recommended mobile-first section order:

1. **Hero / framing header**
2. **Goal and level**
3. **Duration and format**
4. **Equipment**
5. **Advanced workout settings**
6. **Live summary card**
7. **Primary CTA area**

Reasoning:
- goal and effort should be decided early,
- equipment must remain prominent,
- advanced controls should be available but not dominant,
- the user should always have a nearby summary and obvious generate action.

---

# 4. Section details

## 4.1 Hero / framing header

### Purpose
Set context quickly and make the screen feel like a product, not a utility form.

### Content
- screen title, e.g. `Build your workout`
- short support copy about smart equipment-aware generation
- optional microcopy reinforcing speed and control

### Rules
- keep compact on mobile
- do not place secondary navigation noise here
- do not bury the main flow under marketing copy

---

## 4.2 Goal and level section

### Fields
- `goal`
- `level`
- optional advanced intensity display based on `advanced.targetIntensity`

### Backing fields
- `draft.goal`
- `draft.level`
- `draft.advanced.targetIntensity`

### Recommended control types
- goal: segmented cards or pill buttons
- level: segmented control or compact cards
- target intensity: slider or 5-step chip selector inside advanced settings, but mirrored in summary

### Supported values
#### Goal
- `full_body`
- `upper_body`
- `lower_body`
- `core`
- `conditioning`
- `mobility`

#### Level
- `beginner`
- `intermediate`
- `advanced`

#### Target intensity
- 1–5 if exposed

### Defaults
- goal: `full_body`
- level: `intermediate`
- target intensity: `3`

### UX rules
- user must always see the currently selected goal and level clearly
- labels should be user-friendly, but state should stay on stable IDs
- avoid multi-row clutter if a horizontally scrollable chip row works better on mobile

---

## 4.3 Duration and format section

### Fields
- `duration.targetMinutes`
- `format`

### Backing fields
- `draft.duration.targetMinutes`
- `draft.format`

### Supported duration values
- `15`
- `20`
- `30`
- `45`
- `60`

### Supported format values
- `standard`
- `circuit`
- `tabata`
- `pyramid`

### Defaults
- duration: `30`
- format: `standard`

### UX rules
- duration and format should be adjacent because together they shape the workout most visibly
- format options should include a short explanation, not just the label
- changing format should immediately update live summary text and reveal relevant advanced settings

### Format helper copy guidance
- standard: straightforward block-based workout
- circuit: one round preview, repeated in the player
- tabata: fixed 20/10 intervals
- pyramid: progressive level-based structure

---

## 4.4 Equipment section

### Purpose
Keep the app’s main differentiator visible and central.

### Field
- `selectedEquipment`

### Backing field
- `draft.selectedEquipment`

### Supported values
- `bodyweight`
- `dumbbells`
- `kettlebell`
- `trx_bands`
- `resistance_band`
- `pull_up_bar`
- `jump_rope`
- `rower`

### Default
- `['bodyweight']`

### UX rules
- multi-select control
- equipment cards/chips should be tap-friendly on mobile
- selection must feel materially important, not optional decoration
- bodyweight may be visually sticky as the fallback option, but user should still be able to deselect everything temporarily in UI state
- normalization will restore `bodyweight` if the submitted selection is empty

### Display guidance
Show selected count or explicit selected items near the section title if the list grows visually.

---

## 4.5 Advanced workout settings section

### Purpose
Expose depth without overwhelming the default flow.

### Presentation
Use a collapsed accordion/sheet/card area by default.

### Fields in this section
#### General advanced flags
- `advanced.includeWarmup`
- `advanced.includeCooldown`
- `advanced.allowExerciseRepeats`
- `advanced.preferBalancedMuscleSplit`
- `advanced.targetIntensity`

#### Timing
- `timing.workSeconds`
- `timing.restSeconds`

#### Format-specific sub-sections
##### Circuit
- `formatConfig.circuit.rounds`
- `formatConfig.circuit.exercisesPerRound`
- `formatConfig.circuit.roundRestSeconds`

##### Tabata
- `formatConfig.tabata.rounds`

##### Pyramid
- `formatConfig.pyramid.levels`

### Defaults
#### Advanced flags
- include warm-up: `true`
- include cool-down: `true`
- allow repeats: `false`
- prefer balanced muscle split: `true`
- target intensity: `3`

#### Timing
- work: `40`
- rest: `20`

#### Circuit
- rounds: `3`
- exercises per round: `5`
- round rest: `60`

#### Tabata
- rounds: `8`

#### Pyramid
- levels: `5`

### Normalization and range rules
- work seconds clamp: `10–300`
- rest seconds clamp: `5–180`
- circuit rounds clamp: `2–8`
- circuit exercises per round clamp: `3–10`
- circuit round rest clamp: `5–180`
- tabata rounds clamp: `4–12`
- pyramid levels clamp: `3–7`
- tabata always normalizes effective timing to `20/10` regardless of draft timing inputs

### UX rules
- only show format-specific inputs for the selected format
- keep advanced toggles short and literal
- if format is `tabata`, timing controls may remain visible for consistency but must show that effective playback will use fixed 20/10 timing
- do not show all advanced sub-sections at once

---

# 5. Live summary behavior

## Purpose
The summary should answer: “What am I about to generate?” before the user taps generate.

## Placement
- inline on mobile below the main controls and above the sticky CTA,
- optionally sticky sidebar/card on wider layouts.

## Minimum content
### Header
- generated intent title, e.g. `30 min full body circuit`
- one-line confidence copy

### Stat row / chips
- duration
- format
- level
- equipment count or list
- intensity if surfaced

### Structure preview
Show a concise prediction of structure using builder state, not fake generated workout content.

Examples:
- `Warm-up + main block + cool-down`
- `3 rounds × 5 exercises, preview round in summary, full repeats in player`
- `8 tabata rounds at 20s work / 10s rest`
- `5 pyramid levels with progressive main block`

### Advanced impact notes
Reflect only meaningful toggles, for example:
- `Warm-up included`
- `Cool-down included`
- `Balanced muscle split preferred`
- `Repeats allowed`

## Rules
- summary updates immediately on field changes
- summary is informative, not exhaustive
- summary must not pretend to know exact exercises before generation
- summary copy should help the user catch wrong selections before generating

---

# 6. Primary CTA behavior

## Main CTA
Label recommendation:
- default: `Generate workout`
- generating state: `Generating workout…`

## CTA placement
- one clear primary CTA near the live summary
- on mobile, use a sticky bottom action bar if the page becomes long

## CTA enablement
Enabled when the draft is in a generatable state.

Given the current model, the draft is almost always generatable because defaults exist and normalization supplies fallbacks.

### Practical disable cases
Only disable when:
- generation is already in progress,
- a truly blocking app error exists,
- required dependencies like the exercise catalog failed to load.

## On click
1. normalize draft
2. optionally persist builder draft
3. create generated workout
4. store or route to summary screen
5. navigate to summary route

## Secondary actions
Allowed but visually weaker:
- `Reset to defaults`
- `Resume previous draft` if persistence is implemented

Do not let secondary actions compete with the main generate CTA.

---

# 7. Validation and messaging

## Validation strategy
Because defaults + normalization make the builder resilient, validation should be lightweight and instructional.

### Inline guidance should cover
- empty equipment selection becomes bodyweight fallback
- tabata uses fixed 20/10 intervals
- out-of-range numbers will be clamped

### Avoid
- aggressive red-error treatment for values the normalizer can safely fix
- blocking the user for non-critical preferences

---

# 8. Screen composition recommendation

Recommended feature composition:
- `BuilderScreen`
  - `BuilderHeader`
  - `GoalLevelSection`
  - `DurationFormatSection`
  - `EquipmentSection`
  - `AdvancedSettingsSection`
  - `BuilderLiveSummaryCard`
  - `BuilderActionBar`

This is a feature-level decomposition recommendation, not a hard API.

---

# 9. Feature vs domain responsibilities

## Feature layer owns
- form interaction
- section layout and disclosure
- helper copy
- loading state
- summary presentation from current draft
- CTA placement and route transitions

## Domain layer owns
- defaults
- normalization
- clamping
- stable IDs and enums
- request contract passed into generation

## Rule
Do not move UI wording or disclosure state into domain modules.

---

# 10. Acceptance checklist for Ticket 3.1

The builder implementation should be considered aligned when:
- the screen is clearly mobile-first,
- goal, duration, format, level, and equipment are all easy to set,
- equipment remains prominent,
- advanced controls are available but not noisy,
- summary updates live from draft state,
- tabata behavior is explained clearly,
- there is one obvious `Generate workout` CTA,
- generate flows into the summary screen using normalized request data.

---

# Recommended next step

Use this spec with `docs/summary-spec.md` to implement Ticket 3.1 so the builder ships with the right sections, field defaults, and summary behavior from day one instead of improvising them in JSX.