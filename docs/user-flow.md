# User Flow

Date: 2026-03-24  
Ticket: 1.1 — Create screen map and user flow definition

Source inputs:
- `PRODUCT_SPEC.md`
- `docs/lessons-learned.md`
- `docs/migration-baseline.md`
- `docs/parity-baseline.md`

---

# Purpose

This document defines the intended primary user journey for the redesigned app.

It describes:
- the main happy path,
- key supporting branches,
- user decisions,
- major system states,
- and what the app should optimize for at each stage.

This is a **product flow**, not an implementation flowchart.

---

# Core User Journey

## Primary story
A regular home exerciser opens the app, defines what kind of workout they want with the equipment they have, generates a balanced plan quickly, reviews it, and starts a guided session that feels like a coach.

---

# Main Happy Path

## Step 1 — Enter the app
### User goal
Get to a usable workout quickly.

### App responsibility
- make the builder immediately available
- avoid distracting the user with secondary features
- communicate that the app can build a workout based on available equipment and preferences

### Desired feeling
- clear
- inviting
- motivating
- not overwhelming

### Primary CTA
- continue building / generate workout

---

## Step 2 — Define workout intent
### User goal
Describe what kind of workout they want.

### App responsibility
Help the user choose core parameters such as:
- goal/focus
- duration
- intensity/level
- workout format

### UX requirement
The user should feel in control without needing to fight a giant form.

### Desired feeling
- guided
- capable
- in control

---

## Step 3 — Select available equipment
### User goal
Tell the app what equipment is actually available.

### App responsibility
- make equipment selection obvious and easy
- support multiple equipment selections
- reinforce that equipment choice materially affects the workout

### Desired feeling
- practical
- personalized
- relevant

### Important product note
Equipment selection is one of the app’s core differentiators and should feel central, not hidden.

---

## Step 4 — Customize advanced parameters
### User goal
Fine-tune the workout shape if desired.

### App responsibility
Expose advanced controls such as:
- work/rest timing
- format-specific settings
- advanced structure options

### UX requirement
These controls should be available, but should not dominate the initial experience.

### Desired feeling
- flexible
- powerful
- not chaotic

### Design principle
Use progressive disclosure.

---

## Step 5 — Review live workout intent summary
### User goal
Understand what they are about to generate.

### App responsibility
Reflect the current selections in a simple, motivating summary.

### Summary should help the user answer:
- what kind of workout am I generating?
- how long will it be?
- how intense is it?
- what equipment is included?
- what format am I choosing?

### Desired feeling
- confidence
- clarity
- momentum

---

## Step 6 — Generate workout
### User goal
Get a personalized workout.

### App responsibility
- generate quickly
- produce a balanced result
- respect the chosen parameters
- maintain format-specific logic
- avoid broken or confusing output

### Desired feeling
- smart
- responsive
- trustworthy

---

## Step 7 — Review generated workout
### User goal
Inspect the result before starting.

### App responsibility
Show:
- high-level summary
- structured workout sections
- format-specific structure cues
- enough detail to build trust in the generated plan

### User decisions
- start workout
- go back to edit
- regenerate

### Desired feeling
- informed
- prepared
- motivated

### Product rule
The app should preserve a review-before-start step.

---

## Step 8 — Start guided workout
### User goal
Begin the session immediately and confidently.

### App responsibility
Transition into a focused execution mode.

### Requirements
- clear state change from planning to doing
- immediate clarity on first exercise / timing
- obvious controls
- mobile readability

### Desired feeling
- ready
- focused
- supported

---

## Step 9 — Progress through the workout
### User goal
Follow the workout with minimal thinking overhead.

### App responsibility
Provide a guided coach-like experience:
- clear work/rest transitions
- current exercise focus
- next-up context
- visible progress
- pause/resume
- next/previous where appropriate

### Desired feeling
- coached
- calm
- motivated
- never lost

### Product rule
The player should feel like a guided workout experience, not just a timer.

---

## Step 10 — Complete the workout
### User goal
Finish with closure and momentum.

### App responsibility
- acknowledge completion
- summarize the session
- offer sensible next actions

### Next actions
- build another workout
- view progress/dashboard
- return to builder

### Desired feeling
- accomplishment
- encouragement
- momentum to return

---

# Supporting Branches

## Branch A — Edit before starting
If the user reviews a generated workout and is not satisfied:
- they can return to builder settings
- or regenerate using current settings

### Requirement
This should feel quick and safe, not like losing progress.

---

## Branch B — Resume saved session
If a previous workout is stored locally:
- the app may offer resume vs discard

### Requirement
Resume must not block the builder.
The user should still be able to start fresh easily.

---

## Branch C — Exit active workout
If the user exits mid-session:
- they should be warned if meaningful progress may be lost
- they should be able to return to summary or resume later if supported

### Requirement
Avoid accidental loss without making exit frustrating.

---

## Branch D — Empty progress/dashboard state
If the user has no history yet:
- dashboard should feel encouraging, not empty or broken
- it should point back toward the builder

---

## Branch E — Profile/preferences access
If the user opens profile/preferences:
- they should find lightweight settings or placeholders
- they should not be forced into auth complexity in v1

---

# State-Based View of the Flow

## Builder states
- default / fresh
- editing
- advanced controls expanded
- generating

## Workout result states
- generated and valid
- user revising
- regenerating

## Player states
- ready
- active work
- active rest
- paused
- completed
- exited

## Persistence states
- no resumable session
- resumable session available
- local history available
- no history yet

---

# Product Priorities by Flow Stage

## Highest-priority stages
1. define workout intent
2. select equipment
3. generate workout
4. review summary
5. complete guided player flow

These stages determine whether the product actually delivers on its promise.

## Medium-priority stages
6. completion state
7. dashboard/progress empty and early-use states
8. resume flow

## Lower-priority for v1
9. profile depth
10. account/auth flows
11. advanced analytics behaviors

---

# UX Risks to Avoid

## 1. Overloading the builder
The app wants lots of control, but too much visible complexity at once will damage usability.

## 2. Hiding equipment too deeply
Equipment is central to the product promise and must remain prominent.

## 3. Skipping summary review
The user should trust the workout before being pushed into execution.

## 4. Building a timer instead of a coach
A technically correct timer UI can still fail the product goal.

## 5. Letting dashboard distract from the main flow
The core product is builder + generation + guided workout, not analytics first.

---

# Flow Success Criteria

The user flow is successful if:
- the user can generate a workout quickly,
- customization feels powerful but understandable,
- equipment-aware personalization is obvious,
- the generated workout feels structured and intentional,
- the player feels guided and motivating,
- the app is clearly more usable on mobile than the legacy version.

---

# Recommended Next Documents

This user flow should feed directly into:
- `docs/v1-scope.md`
- `docs/domain-model.md`
- React information architecture and routing decisions
- builder wireframes / UI structure

---

# Approval Check

This flow should be considered ready when:
- the main happy path is explicit,
- side branches are scoped and controlled,
- the app’s priorities are obvious,
- the redesign intent is clear enough to guide implementation.
