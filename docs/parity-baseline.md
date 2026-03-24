# Parity Baseline

Date: 2026-03-24  
Ticket: 0.1 - Baseline scenarios and parity notes for static app

This file is the migration comparison sheet for React parity checks.

## Parity rules for this project

## Source of truth
- Current static app runtime under `src/index.html` + modular `src/js/*`
- If runtime and source appear to conflict, trust observed runtime first.

## Exact-match vs invariant-match guidance

### Exact match required
- Available form options and labels should remain materially equivalent.
- Major flow order should remain equivalent:
  - configure -> generate overview -> start player -> complete/exit -> regenerate/resume
- Storage-backed guest vs logged-in header state should remain equivalent.
- Dashboard route/page presence should remain equivalent.
- Training-pattern-specific structural behavior should remain equivalent.

### Invariant match acceptable
Because generation is randomized, these should be compared by invariants unless later fixture control is added:
- exact exercise identities
- exact ordering of randomly selected exercises
- exact substitution suggestions

### Invariants to preserve
- Standard workouts include warm-up, main, cool-down
- Warm-up and cool-down are equipment-filtered
- Default empty equipment falls back to Bodyweight
- Standard main count is tied to duration logic
- Circuit overview shows preview structure, while player expands to full rounds
- Tabata forces 20s work / 10s rest effective timing
- Pyramid inserts level/set structure before exercises
- Overview summary cards reflect generated metadata

---

## Baseline environment

## Repo state
- Static app served locally from `src/`
- Command used: `python -m http.server 4173`
- Verified URL: `http://127.0.0.1:4173/index.html`

## Runtime verification performed
- Landing page loaded successfully
- Default generator form rendered successfully
- Generated one default workout successfully
- Browser console inspected after generation
- Dashboard page route was opened successfully

## Runtime verification not fully completed in this ticket
- Full end-to-end manual walkthrough of login/register/reset
- Full player workout completion path in browser
- Full dashboard chart validation against seeded localStorage data
- Screenshot/video artifact capture beyond tool snapshot inspection

Where full manual verification was not completed, scenario rows below are marked as `audit-only` and should be executed during later tickets.

---

## Scenario matrix

| ID | Flow | Input/setup | Expected baseline behavior | Status | Notes |
|---|---|---|---|---|---|
| PB-01 | Landing render | Fresh load | Header, What's New banner, generator form, guest auth buttons visible | verified | Observed in local browser snapshot |
| PB-02 | Default generation | Defaults: 30m, Intermediate, Bodyweight, Standard | Form hides, overview shows summary + Warm-up/Main/Cool-down sections | verified | Observed 26 total exercises in sampled run |
| PB-03 | Standard structure | Standard pattern | Warm-up 8, main duration-driven count, cool-down 8 | audit-only | Source confirms behavior; exact random exercise selection varies |
| PB-04 | Circuit generation | Circuit selected with rounds/exercises settings | Overview shows circuit header + preview-only circuit list; player expands all rounds | audit-only | Critical parity hotspot |
| PB-05 | Tabata generation | Tabata selected | Effective timing becomes 20/10 regardless of custom work/rest input | audit-only | Source-verified invariant |
| PB-06 | Pyramid generation | Pyramid selected | Level/set headers shown with exercises per level | audit-only | Source-verified invariant |
| PB-07 | Equipment multi-select | Multiple equipment boxes checked | Generator accepts multiple equipment values and filters by selected list | audit-only | Requires manual sanity pass later |
| PB-08 | Empty-equipment fallback | Submit with no boxes checked if UI allows | Generator falls back to Bodyweight | audit-only | Source-verified invariant |
| PB-09 | Quick presets | Click preset chip/button | Relevant duration/level/equipment/pattern values update together | audit-only | Need explicit runtime capture later |
| PB-10 | Advanced settings reveal | Switch training pattern | Pattern-specific controls show/hide appropriately | audit-only | Source-verified in `main.js` |
| PB-11 | Start workout | From generated overview | Player screen opens and starts work phase immediately | audit-only | Source-verified; runtime snapshot not captured yet |
| PB-12 | Pause/resume | Player active | Timer pause/resume works; space key toggles | audit-only | Source-verified |
| PB-13 | Prev/next navigation | Player active | Arrow keys/buttons navigate exercises | audit-only | Source-verified |
| PB-14 | Exit workout | Player active | Exit returns to overview rather than hard reset | audit-only | Source-verified |
| PB-15 | Resume saved workout | Existing saved workout in localStorage | Resume affordance appears and can restore state | audit-only | Mentioned in legacy/runtime code; needs explicit test |
| PB-16 | Register account | New local user | User persisted in localStorage and header switches to logged-in state | audit-only | Important because React may be tempted to drop auth |
| PB-17 | Login account | Existing local user | Successful login restores profile summary and streak UI | audit-only | Needs runtime test with seeded user |
| PB-18 | Reset password | Existing local user + correct security answer | Password reset succeeds and modal transitions back toward login | audit-only | Source-verified flow |
| PB-19 | Dashboard empty state | No analytics events | Dashboard shows fallback/sample data rather than blank failure | audit-only | Source suggests this is intentional |
| PB-20 | Dashboard with personal history | Seed `fitflow_personal_workouts` | Personal metrics/table populate from localStorage | audit-only | Important storage parity check |
| PB-21 | Console health | Landing + generate | No fatal exceptions; Tailwind CDN warning may appear | verified | Warning captured, no fatal errors seen in limited pass |
| PB-22 | Unit test baseline | Run Python unittest discover | Most helper/unit tests pass; auth regression import fails without Playwright | verified | Environment/test dependency issue, not app runtime issue |

---

## Baseline findings to preserve

## Landing / funnel
- Guest-first landing experience is prominent.
- "What's New" banner exists and is dismissible.
- Mobile-first collapsible sections are part of the UX, not just presentation noise.
- Generate CTA copy may adapt by viewport.

## Generated overview
- Review-first flow is deliberate; generation does not jump straight into the timer.
- Overview grouping into Warm-up/Main/Cool-down is important.
- Metadata summary cards are core orientation UI.
- Smart substitution affordances appear inline on exercise cards.

## Player
- Guided-timer player is a core flow, not a secondary enhancement.
- Circuit behavior differs between overview and playback.
- Audio/vibration/countdown are part of behavior, even if a first React pass stubs internals.
- Keyboard and touch affordances exist and should be logged if omitted initially.

## Account/dashboard
- Local-only account state affects visible header UX.
- Dashboard is a real route/page and should not disappear in migration.
- localStorage schema is part of current product behavior.

---

## Storage contract placeholders

These keys are confirmed or strongly indicated by source and should be frozen before deeper migration work:

- `fitflow_current_user`
- `fitflow_users`
- `fitflow_personal_workouts`
- `fitflow_analytics`
- `fitflow_analytics_events`
- `fitflow_whats_new_seen_v2_2_0`
- `fitflow_whats_new_dismissed_v2_2_0`
- debug/local feature flags used by modules

Follow-up task: inventory all keys precisely in a dedicated storage contract note or fixture helper.

---

## Known accepted gaps in this baseline

These are not yet fully evidence-backed by manual runtime testing, so treat them as provisional until later tickets add fixture/E2E coverage:

- exact quick preset mapping values
- full player completion path and completion screen copy
- exact resume-workout UX on reload
- all modal copy and validation text for auth flows
- all dashboard chart labels and ranking output under real event data

---

## Known risks for React parity

1. **Random generation drift**  
   Without deterministic fixtures, React may look "different but valid." This needs explicit invariant tests.

2. **Legacy vs modular ambiguity**  
   Some behavior exists in both `script.js` and modular files. Parity checks must compare against actual runtime, not whichever file is easiest to port.

3. **Storage migration breakage**  
   Even a clean React app can silently regress dashboard/account behavior if localStorage shapes change.

4. **Hidden player complexity**  
   The timer/player has more state and interaction depth than the landing form suggests.

5. **Dashboard sample fallback masking regressions**  
   A dashboard that still renders may actually be disconnected from real event data.

---

## Recommended next parity work

Before or during Ticket 0.2 / 1.1:

1. Add deterministic fixture scenarios for Standard/Circuit/Tabata/Pyramid.
2. Capture exact preset-to-form mappings.
3. Seed localStorage and record account/dashboard scenarios.
4. Add one browser automation script for generate -> overview -> start player smoke.
5. Convert the scenario matrix above into executable regression tests where practical.
