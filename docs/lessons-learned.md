# Lessons Learned from the Static App

Date: 2026-03-24  
Ticket: 0.2 — Convert audit into lessons learned  
Inputs:
- `PRODUCT_SPEC.md`
- `docs/migration-baseline.md`
- `docs/parity-baseline.md`

---

# Executive Summary

The static app proves there is already a valuable product inside `workout_generator_en`, but it is buried under legacy structure, overlapping implementations, and UX choices that reflect technical history more than deliberate product design.

The React rebuild should **not** copy the current app screen-for-screen.

Instead, it should:
- preserve the core product value,
- preserve key workout-generation and player invariants,
- keep dashboard direction alive,
- aggressively redesign the builder and player experience from the user perspective,
- defer login/auth and deep analytics until the architecture is ready to support them properly.

---

# What the Old App Gets Right

These are strengths worth carrying forward into the redesign.

## 1. There is a real product concept already
The app is more than a random workout generator. It already combines:
- workout configuration,
- workout generation,
- a review/summary step,
- a guided player,
- persistence/history concepts,
- dashboard direction.

**Lesson:** The new app should keep this as a product ecosystem, not collapse into a single bare form.

## 2. Equipment-aware generation is meaningful
The old app already centers workout creation around available equipment.

**Lesson:** Equipment-awareness is not a minor filter. It is a core differentiator and should remain central in the redesigned product.

## 3. Review-first flow is good
The app generates a workout and shows an overview before starting the timer.

**Lesson:** This is the right interaction model. Users should understand what they are about to do before being thrown into a session.

## 4. Warm-up / main / cool-down structure adds quality
The generated workout is not just a flat list. It has structure.

**Lesson:** Structural coherence is part of perceived workout quality and should remain a protected invariant.

## 5. Multiple workout formats are valuable
Standard, Circuit, Tabata, and Pyramid formats create meaningful variety.

**Lesson:** Format diversity should stay. It supports the user’s desire for advanced, flexible, customizable generation.

## 6. The player is a core feature, not a side feature
The timer/player includes transitions, rest overlays, progression, and coaching behavior.

**Lesson:** The player should be treated as equal in importance to the generator UI.

## 7. Dashboard should remain in product direction
Even if the current dashboard is partially local/fallback-driven, it reflects a valuable product direction: progress, history, and insight.

**Lesson:** Dashboard should survive conceptually, but in a more scoped and intentional form.

---

# What the Old App Gets Wrong

These are the areas the redesign should improve or replace.

## 1. Legacy structure is leaking into the product
There is overlap between `src/script.js` and the modular `src/js/*` runtime path.

**Lesson:** The codebase has history baked into it. The React rebuild must establish a single source of truth for behavior and state.

## 2. The UX feels additive rather than designed
The old app appears to have accumulated features over time:
- presets,
- collapsibles,
- multiple advanced controls,
- account widgets,
- dashboard links,
- banners,
without a clearly unified user journey.

**Lesson:** The redesign should simplify the main journey and make the product feel intentionally designed.

## 3. Presets are not aligned with the new vision
Presets may be convenient, but they bias the product toward shortcut interaction instead of meaningful workout composition.

**Lesson:** Presets should not be a primary UX pillar in the new version.

## 4. Account/auth complexity is premature for the redesign goal
The current local-only login/register/reset flow creates visible complexity without being central to the stated new product goal.

**Lesson:** Auth is a future capability, not a v1 redesign priority.

## 5. Dashboard depth risks becoming a distraction
The current dashboard includes many metrics and fallback states. That is useful historically, but it can easily pull effort away from the core workout flow.

**Lesson:** Dashboard should be scoped tightly in v1.

## 6. Random generation weakens parity and trust
The existing generation has randomness without deterministic fixture control.

**Lesson:** The new app needs a clearer generation model, testable invariants, and better-defined output quality expectations.

## 7. Hidden player complexity raises implementation risk
The player contains more state and interaction complexity than the landing form suggests.

**Lesson:** The player must be designed and tested as a state machine, not improvised in the UI layer.

---

# Keep / Improve / Remove / Defer Matrix

## Keep
These should survive conceptually into the redesign.

### Product capabilities to keep
- workout generation as the main value proposition
- equipment-aware workout logic
- multiple workout formats
- review-before-start summary flow
- guided player / timer as a core feature
- dashboard as part of product direction
- local persistence where it improves continuity

### Behavioral invariants to keep
- workout generation should remain structured and balanced
- warm-up / main / cool-down should remain conceptually present
- format-specific logic should remain meaningful:
  - Circuit behaves differently from Standard
  - Tabata has distinct timing behavior
  - Pyramid has staged structure
- generated summary metadata should remain visible before workout start

---

## Improve
These should remain, but in a significantly better form.

### Builder UX
Improve:
- information hierarchy
- grouping of controls
- advanced settings disclosure
- live summary of user choices
- mobile ergonomics
- clarity of the primary CTA

### Workout generation model
Improve:
- testability
- predictability at the invariant level
- structure and reasoning clarity
- smart balancing rules
- flexibility without chaos

### Player experience
Improve:
- coaching feel
- mobile usability during active workouts
- clarity of work/rest transitions
- progress visibility
- completion experience

### Dashboard
Improve:
- scope discipline
- information architecture
- future-readiness
- relationship to the core app flow

### Technical foundations
Improve:
- separation of domain logic and UI
- typed data contracts
- state isolation
- future backend seams
- test coverage around invariants and player transitions

---

## Remove
These should be actively avoided in the redesign unless a strong reason appears.

### Legacy-driven UX patterns to remove
- rebuilding the old screen layout just because it already exists
- preserving awkward control grouping from the static app
- carrying over duplicate logic paths
- exposing implementation history through the UI

### Product patterns to remove
- old presets as a primary interaction model
- parity-driven retention of non-core clutter
- forcing account complexity into the first redesign milestone

### Technical patterns to remove
- global `window.*` state as a foundation
- mixed legacy/modular behavior sources
- UI-bound business logic
- storage-coupled domain logic

---

## Defer
These are valid future concerns, but should not drive v1.

### Product features to defer
- full login/authentication
- backend user accounts
- full analytics/event system
- production-grade progress sync
- deep dashboard intelligence
- complex personalization tied to backend identity

### Technical work to defer
- server persistence
- auth providers
- cloud analytics pipeline
- cross-device sync

---

# Redesign Opportunities

These are the highest-leverage opportunities revealed by the audit.

## 1. Reframe the app around a mobile-first builder
The builder should become the main product surface, not just a form dumped onto a landing page.

### Opportunity
Create a mobile-first configuration flow that feels premium, motivating, and easy to use despite supporting lots of control.

## 2. Upgrade the player from timer to coach
The current player already hints at coaching behavior.

### Opportunity
Design the player as a guided workout experience with clearer hierarchy, transitions, and motivation.

## 3. Replace parity-presets with intentional customization
Presets were useful in the old app, but they should not dominate the new product.

### Opportunity
Use a better builder model:
- strong defaults
- progressive disclosure
- meaningful advanced controls
- optional templates later, if needed

## 4. Build a clean domain model
The old code reflects implementation drift.

### Opportunity
Define clean models for:
- builder input
- generated workout
- player state
- persistence boundary
- future backend seam

## 5. Turn dashboard into a scoped future-ready surface
The dashboard concept is worth preserving, but it should stop hijacking v1 scope.

### Opportunity
Build a lighter dashboard shell now and let it expand later.

---

# Protected Invariants

These should be treated as redesign guardrails.

## Functional invariants
- users must still be able to generate workouts based on available equipment
- users must still be able to choose among multiple workout formats
- users must still review a workout before starting it
- users must still complete a guided session through a player flow
- the app must still support a dashboard direction

## Quality invariants
- workouts should feel balanced, not arbitrary
- the flow should remain understandable from config to completion
- the app should preserve the concept of workout structure, not collapse into a raw exercise list

## Architecture invariants
- future auth/backend/analytics should be possible without major rewrites

---

# Recommended Product Decisions from This Audit

## Decision 1
**Do not do a strict parity migration.**

The audit supports a redesign-first approach.

## Decision 2
**Builder + generator + player are the v1 center of gravity.**

Everything else should be scoped around them.

## Decision 3
**Dashboard stays, but in a lighter role.**

It remains part of the product direction without absorbing too much early effort.

## Decision 4
**Auth and analytics move out of v1.**

The new architecture should support them later, but they should not dominate the rebuild.

## Decision 5
**Generation and player logic should be modeled before major UI work.**

This reduces rework and avoids React UI code becoming the new legacy mess.

---

# Recommended Next Step

Proceed to:

## Ticket 1.1 — Create screen map and user flow definition

Why this is next:
- the product direction is now clear,
- the baseline is understood,
- the lessons learned are explicit,
- and the next highest-value move is to define the intended experience before implementing React screens.

Recommended outputs:
- `docs/screen-map.md`
- `docs/user-flow.md`

Those documents should translate product direction into concrete app structure.
