# Player UI Implementation Spec

Date: 2026-03-24  
Ticket: 2.5 — Player UI implementation blueprint

Source of truth:
- `PRODUCT_SPEC.md`
- `docs/domain-model.md`
- `docs/screen-map.md`
- `docs/user-flow.md`
- `docs/v1-scope.md`
- `new-app/src/domain/player/player-types.ts`
- `new-app/src/domain/player/player-reducer.ts`
- `new-app/src/domain/player/player-selectors.ts`
- `new-app/src/domain/workouts/workout-types.ts`

---

# Purpose

This document defines how the guided player should be composed in v1 so Ticket 3.3 can implement a real coach flow instead of a generic timer page.

It covers:
- screen composition,
- controls,
- states,
- progress behavior,
- workout step presentation,
- and the completion transition.

The player should be built on top of the reducer/state model already defined in the new React app.

---

# 1. Player role in the product

The player is the execution surface for a `GeneratedWorkout`.

Its job is to minimize cognitive load during training by making four things obvious at all times:
1. what to do now,
2. how long it lasts,
3. what comes next,
4. how far through the workout the user is.

It should feel more like a guided coach than a stopwatch.

---

# 2. Primary input and state model

## Primary workout input
- `GeneratedWorkout.playback.steps`
- `GeneratedWorkout.metadata`

## Runtime state source
Use `PlayerState` from the reducer as the canonical runtime source.

## Use selectors for UI derivation
Prefer selectors for:
- current step,
- next step,
- progress percent,
- rest/work checks,
- control enablement.

## Rule
Do not recreate player logic ad hoc inside JSX state.

---

# 3. Core screen composition

Recommended mobile-first composition:

1. **Top bar / session header**
2. **Phase banner**
3. **Primary timer card**
4. **Current exercise card**
5. **Next-up preview**
6. **Progress module**
7. **Control bar**
8. **Secondary utilities / preferences**

This order keeps the most time-sensitive information near the thumb and eye focus area.

---

# 4. Top bar / session header

## Required content
- workout title or short title
- current format label
- exit/back affordance

## Optional secondary content
- elapsed session time
- compact step count, e.g. `4 / 18`

## Rules
- exit must be present but not visually dominant over pause/resume
- if exit is tapped during an active session, route through confirmation flow
- avoid heavy navigation chrome during playback

---

# 5. Phase banner

## Purpose
Make the current mode unmistakable.

## Supported phase labels
Derived from `PlayerState.timer.phase`:
- `Ready`
- `Work`
- `Rest`
- `Paused`
- `Completed`

## Behavior
- color and copy should change clearly between work and rest
- paused should look intentionally frozen, not broken
- ready should signal the user is about to start the first step

## Copy examples
- Ready: `Get ready to start`
- Work: `Work`
- Rest: `Recover`
- Paused: `Paused`
- Completed: handled by transition to completion state/screen

---

# 6. Primary timer card

## Required content
- large remaining time
- current phase label
- optional phase-total context

## Behavior by phase
### Ready
- show first work duration as upcoming time
- primary action nearby should be `Start`

### Work
- show current work countdown
- emphasize action and urgency

### Rest
- show rest countdown
- visually downshift but keep readability high

### Paused
- freeze timer exactly
- preserve prior work/rest context via copy or a smaller indicator

## Rule
This is the highest-importance visual element during playback.

---

# 7. Current exercise card

## Required content
- exercise name
- block context if useful (`Warm-up`, `Main`, `Cool-down`)
- short instruction or coaching cue
- work/rest values for the current step if useful

## Recommended optional content
- round, set, or level labels where available
- muscle/equipment tags if they genuinely help
- safety notes behind progressive disclosure

## Format-specific context
### Circuit
Show round context if present:
- `Round 2 of 3`
- `Exercise 4 of 5 in round`

### Tabata
Show set context if present:
- `Interval 3 of 8`

### Pyramid
Show level context if present:
- `Level 2 of 5`

## Rule
The current exercise card should prioritize actionability over encyclopedic detail.

---

# 8. Next-up preview

## Purpose
Reduce surprise and improve flow confidence.

## Required content
- next exercise name if one exists
- next phase timing hint if helpful

## Behavior
- hide or simplify when no next step exists
- near the end of the workout, replace with completion-oriented copy

## Example end-of-workout copy
- `Final step — completion is next`

---

# 9. Progress module

## Minimum content
- numeric step position: current / total
- progress bar or ring

## Data source
- `progress.currentStepIndex`
- `progress.totalSteps`
- `getProgressPercent(...)`

## Recommended interpretation
Use executable playback steps as the canonical progress denominator.

## Rule
Progress should reflect the playback plan, not the compact summary view.
This matters especially for circuit workouts.

---

# 10. Primary controls

## Required controls
- Start
- Pause / Resume
- Next
- Previous
- Skip rest
- Exit

Not all controls are visible/active at all times.

---

## 10.1 Start

### Visible when
- phase is `ready`

### Behavior
- dispatch `START`
- move into active work phase

### Priority
Primary CTA in ready state.

---

## 10.2 Pause / Resume

### Pause visible when
- phase is `work` or `rest`

### Resume visible when
- phase is `paused`

### Behavior
- dispatch `PAUSE` or `RESUME`
- preserve exact remaining seconds

### Priority
This is the main mid-workout control.

---

## 10.3 Next

### Behavior
- dispatch `NEXT_STEP`
- move focus to the next executable step in ready state

### UX note
This is a skip control, not the primary intended path.

### Enablement
- use `canGoNext(...)`

---

## 10.4 Previous

### Behavior
- dispatch `PREVIOUS_STEP`
- move focus to the previous executable step in ready state

### Enablement
- use `canGoPrevious(...)`

---

## 10.5 Skip rest

### Visible/enabled when
- phase is `rest`

### Behavior
- dispatch `SKIP_REST`
- jump directly to next step work phase

### Rule
Do not show as a primary action outside rest phase.

---

## 10.6 Exit

### Behavior
- open confirmation if the workout is active or paused
- dispatch `EXIT` on confirm

### Result
- mark session abandoned unless already completed
- route back to summary or another agreed return surface

---

# 11. Secondary utilities / preferences

## Candidate controls
- sound enabled
- vibration enabled
- voice countdown enabled

## Backing state
- `preferences.soundEnabled`
- `preferences.vibrationEnabled`
- `preferences.voiceCountdownEnabled`

## UX guidance
- keep these secondary and compact
- better as icon toggles or a small settings tray than large buttons
- do not let preferences crowd the workout controls

---

# 12. Phase/state rendering rules

## Idle
### Meaning
No active loaded workout in player context.

### UI behavior
- show fallback/empty state or redirect to summary/builder

---

## Ready
### Meaning
Workout loaded, first/current step primed, waiting to begin.

### UI requirements
- show current step preview
- show first work duration
- show clear `Start workout` action

---

## Work
### Meaning
Active exercise countdown.

### UI requirements
- work styling active
- current exercise prominent
- pause control prominent
- next-up visible

---

## Rest
### Meaning
Recovery between work steps.

### UI requirements
- rest styling active
- keep current or just-finished step context visible enough to maintain continuity
- next-up preview should become especially useful here
- `Skip rest` available

---

## Paused
### Meaning
Timer frozen in the middle of work or rest.

### UI requirements
- retain all current step context
- timer frozen exactly
- `Resume` becomes primary action
- indicate whether paused during work or rest using `previousPhase`

---

## Completed
### Meaning
Workout has finished.

### UI requirements
- trigger completion transition
- stop further timer activity
- prepare completion summary save

### Recommendation
Do not leave the user sitting on a dead timer card for long. Route to a completion screen/state quickly.

---

# 13. Completion transition

## Trigger
When reducer enters `completed` or `COMPLETE` is dispatched.

## Transition behavior
1. stop active interval/tick effects
2. persist completion/history candidate if implemented
3. show a short success transition if desired
4. navigate to dedicated completion screen/state

## Completion screen should include
- completion message
- workout title or format summary
- duration/steps summary
- next actions:
  - `Build another workout`
  - `View progress`

## Rule
Completion should feel like closure and momentum, not just the absence of more steps.

---

# 14. Mobile interaction priorities

## Highest priority
- large readable timer
- obvious primary control
- thumb-friendly pause/skip/next controls
- minimal accidental exits

## Avoid
- dense data tables
- tiny tap targets
- too many side-by-side controls in one row
- burying current exercise under progress chrome

---

# 15. Accessibility and implementation notes

## Accessibility
- controls need explicit labels
- timer changes should not be the only way phase changes are communicated
- color differences between work/rest must not be the only signal
- focus order should remain sensible if keyboard support is used later

## Implementation notes
- reducer stays pure
- tick interval, audio, haptics, and persistence stay outside reducer
- cleanup on unmount/exit must stop timers cleanly

---

# 16. Suggested feature composition

Recommended modules:
- `WorkoutPlayerScreen`
  - `PlayerSessionHeader`
  - `PlayerPhaseBanner`
  - `PlayerTimerCard`
  - `CurrentExerciseCard`
  - `NextUpCard`
  - `PlayerProgressBar`
  - `PlayerControls`
  - `PlayerPreferencesTray`

This is a composition recommendation, not a fixed architecture contract.

---

# 17. Acceptance checklist for Ticket 3.3

The player UI should be considered aligned when:
- ready/work/rest/paused/completed states are clearly distinct,
- the current exercise and remaining time are obvious at a glance,
- next-up and progress are always understandable,
- controls map cleanly to reducer actions,
- circuit/tabata/pyramid context labels appear when relevant,
- pause/resume preserves exact timer state,
- completion transitions into a proper end state instead of a dead-end timer.

---

# Recommended next step

Implement the player shell against the existing reducer/selectors first, then layer in visual polish and completion routing. The important thing is to lock the coach-flow structure before spending time on decoration.