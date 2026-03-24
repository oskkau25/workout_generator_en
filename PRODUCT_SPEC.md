# PRODUCT_SPEC.md

## Project
**Repo:** `workout_generator_en`  
**Date:** 2026-03-24  
**Direction:** redesign-first React rebuild informed by lessons from the static app

---

# 1. Product Vision

Build a **mobile-first personal workout generator** for regular home exercisers that creates smart, balanced workouts based on:
- available equipment
- user-selected criteria
- workout format preferences
- desired training style and intensity

The new app should feel:
- **premium**
- **sporty**
- **playful**
- **motivating**
- **customer-centric**

It should not feel like a port of an old static app. It should feel like a deliberately designed product.

---

# 2. Product Goal

Help a user quickly create a personalized workout and then guide them through it like a coach.

## Core promise
A user should be able to:
1. define what they want to train,
2. choose what equipment they have,
3. customize the workout at a meaningful level,
4. generate a balanced workout quickly,
5. start a guided session immediately.

---

# 3. Target User

## Primary audience
**Regular home exercisers**

These users:
- work out consistently or semi-consistently
- may have varied equipment at home
- want flexibility and control
- still want the app to reduce planning effort
- care about a polished mobile experience

## User mindset
They do **not** want a random exercise spinner.
They want a workout that feels:
- relevant
- balanced
- adaptable
- intelligently assembled

---

# 4. Product Principles

1. **User-first, not legacy-first**
   - The old app is a source of lessons, not a blueprint to clone.

2. **Mobile-first by default**
   - The primary UX should be designed for phones first, then expanded gracefully.

3. **Fast to useful**
   - Users should reach a good workout quickly, even with advanced options available.

4. **Control without chaos**
   - The app should support lots of customization without becoming overwhelming.

5. **Guided execution matters as much as generation**
   - The player/coach experience is a core product feature.

6. **Future-ready architecture**
   - Authentication, analytics, and backend integration are not v1 priorities, but the architecture should allow them later.

7. **Clean foundations over feature sprawl**
   - Prefer fewer, better-designed flows over preserving every historical feature.

---

# 5. Scope

## In scope for redesign v1
- workout builder / generator
- workout generation engine
- multiple workout formats
- guided workout player
- local persistence where useful
- lightweight dashboard concept or shell if it supports the future product direction
- technical architecture ready for future backend/auth/analytics integration

## Deferred / later
- login / authentication
- backend integration
- analytics platform / event tracking system
- production-grade user accounts
- full dashboard analytics depth if it slows core flow delivery

## Intentionally removed or deprioritized
- old presets as a primary interaction model
- legacy UI structures preserved only for parity
- accidental complexity caused by static JS constraints

---

# 6. Core Experience

## Primary flow
1. User opens app.
2. User defines workout intent.
3. User selects available equipment.
4. User customizes workout parameters.
5. User generates a workout.
6. User reviews a clear workout summary.
7. User starts a guided workout.
8. User progresses through the session with coaching support.
9. User finishes and sees a completion summary.

## UX goal
This flow should feel:
- fast
- motivating
- clear
- empowering
- polished on mobile

---

# 7. Core Features

## 7.1 Workout Builder

The builder is the heart of the app and should be redesigned from a user perspective.

### Builder goals
- expose meaningful control
- keep decision flow understandable
- reduce clutter
- make advanced customization feel intentional rather than chaotic

### Builder capabilities
The user should be able to control at least:
- workout goal / focus
- duration
- level / intensity
- available equipment
- workout format / pattern
- work/rest structure where relevant
- advanced shaping controls where useful

### Builder design guidance
- prioritize mobile usability
- group options clearly
- show progressive disclosure for advanced controls
- provide live summary / preview of selected configuration
- ensure the main CTA remains obvious

---

## 7.2 Smart Workout Generation

### Generation philosophy
The generator should be:
- smart
- flexible
- advanced
- balanced
- equipment-aware

### Requirements
- generate workouts based on available equipment
- support multiple workout formats
- produce balanced structure rather than arbitrary lists
- keep workouts coherent and usable
- maintain sensible training logic across duration and intensity choices

### Important note
The old app’s generation behavior should be used as a lesson source and reference for invariants, not blindly copied.

### Desired output quality
Generated workouts should feel:
- purposeful
- balanced
- personalized
- practical for home training

---

## 7.3 Guided Player / Coach Experience

The player is not just a timer. It should feel like a guided coach.

### Player goals
- make the session easy to follow
- reduce cognitive load during exercise
- keep the user motivated
- handle transitions clearly

### Core player capabilities
- start workout from summary/review screen
- step-by-step exercise guidance
- clear work/rest transitions
- pause/resume
- next/previous where appropriate
- progress visibility
- end-of-workout completion state

### Desired player feel
- focused
- motivating
- calm under pressure
- mobile-friendly
- easy to interact with mid-workout

### Player direction
Compared to the old app, the React version should feel more intentionally designed as a coaching flow, not just a timer screen.

---

## 7.4 Dashboard Direction

Dashboard remains relevant, but not as a full analytics investment in v1.

### Short-term role
- provide a place for future progress/history concepts
- optionally show lightweight local summaries if useful
- establish navigation and information architecture for future expansion

### Long-term role
- progress tracking
- analytics
- history
- trends
- user insights once backend support exists

### Constraint
Do not let dashboard scope derail the builder/generator/player redesign.

---

# 8. Information Architecture

## Recommended top-level structure
- **Builder / Generate** — primary landing flow
- **Workout Summary** — review before start
- **Player / Coach** — guided session experience
- **Dashboard** — lightweight now, expandable later
- **Profile / Account** — deferred or placeholder, not full auth in v1

## Navigation guidance
- mobile-first bottom nav or similarly clear mobile navigation is acceptable
- primary workflow should stay obvious from landing
- avoid desktop-dashboard-heavy IA dominating the experience

---

# 9. UX / Visual Direction

## Design attributes
- mobile-first
- premium
- sporty
- playful
- motivating
- customer-centric

## UX qualities to optimize for
- clarity
- momentum
- low-friction setup
- rich control without overload
- confidence during workout execution

## Anti-goals
Avoid:
- cluttered static-form feel
- enterprise dashboard vibe on the main workout flow
- old-school multi-section chaos
- preserving awkward UX solely for parity

---

# 10. Technical Product Requirements

## Frontend direction
Build the redesign in React.

### Recommended stack
- React
- TypeScript
- Vite
- modern component structure
- testable domain modules

## Architecture goals
- separate domain logic from UI
- separate builder state from player state
- define stable workout data models
- define clean storage interfaces
- define future backend integration seams

## Future integration readiness
Design so later work can add:
- authentication
- backend persistence
- analytics tracking
- user history sync
without major rewrites.

---

# 11. Data / Persistence Strategy

## v1 expectation
Use local/browser persistence where it improves UX.

## Future expectation
A proper backend may be added later.

## Requirement
Do not entangle core generation/player logic with a backend dependency now.

---

# 12. What Must Be Preserved Conceptually

These are the important carry-forwards from the current app:
- workout generation remains central
- multiple workout formats remain supported
- guided timer/player remains central
- dashboard remains part of product direction
- equipment-based workout customization remains core

These do **not** require pixel/UI parity with the old app.

---

# 13. What Can Change Aggressively

The redesign is allowed to significantly change:
- page structure
- interaction flow
- form layout
- control grouping
- player layout
- dashboard layout
- wording and presentation
- internal architecture
- old preset behavior
- legacy storage/UI assumptions that do not serve the new experience

---

# 14. Success Criteria

The redesign is successful if it delivers:
- cleaner UI and UX
- easier maintenance
- better mobile use
- easier future feature work

## Practical success indicators
- users can generate workouts faster and with less confusion
- customization feels powerful rather than messy
- player flow feels like guided coaching, not timer juggling
- codebase is simpler to understand and extend than the static version

---

# 15. Build Priorities

## Highest priority
1. clear product structure
2. mobile-first builder UX
3. smart workout generation engine
4. guided player / coach flow
5. maintainable React architecture

## Medium priority
6. lightweight dashboard shell / local summaries
7. storage contracts and future backend seams
8. migration utilities if needed

## Lower priority for v1
9. auth
10. analytics platform
11. advanced account features

---

# 16. Recommended Execution Order

1. turn this spec into a redesign-first implementation plan
2. define screen map and user flow
3. define domain model and generation model
4. scaffold React architecture
5. build builder flow
6. build generation summary flow
7. build guided player
8. add local persistence and dashboard shell
9. validate against product goals and core invariants

---

# 17. Final Product Framing

This app should become:

> A polished, mobile-first workout builder and guided coach for regular home exercisers who want smart, customizable training based on the equipment they actually have.

That is the target.
