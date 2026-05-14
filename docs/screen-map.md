# Screen Map

Date: 2026-03-24  
Ticket: 1.1 — Create screen map and user flow definition

Source inputs:
- `PRODUCT_SPEC.md`
- `docs/lessons-learned.md`
- `docs/migration-baseline.md`
- `docs/parity-baseline.md`

---

# Purpose

This document defines the intended screen structure for the redesigned React app.

It is a **product and UX map**, not a component tree.

Its job is to answer:
- what major screens/states exist,
- which ones are primary,
- how they relate to each other,
- what matters on mobile first,
- what belongs in v1 versus later.

---

# Design Direction Summary

The new app should feel:
- mobile-first
- premium
- sporty
- playful
- motivating
- customer-centric

The top-level product should revolve around:
1. building a workout,
2. reviewing it,
3. performing it with guided coaching,
4. optionally checking progress/dashboard context.

This is not a dashboard-first app. It is a **builder + coach** app.

---

# Top-Level Navigation Model

## Recommended top-level destinations

### 1. Builder
Primary home and landing surface.

### 2. Dashboard
Lightweight progress/history surface for v1, expandable later.

### 3. Profile
Placeholder or lightweight preferences surface in v1. Full auth deferred.

## Navigation recommendation
For mobile-first UX, prefer one of:
- bottom navigation with 2–3 primary destinations, or
- a simplified top nav + persistent primary CTA if bottom nav is not used.

## Recommended v1 nav labels
- **Build**
- **Progress**
- **Profile**

Alternative acceptable labels:
- **Workout** / **Progress** / **Profile**
- **Generate** / **Dashboard** / **Profile**

Preferred default: **Build / Progress / Profile**

---

# Screen Inventory

## A. Primary Screens

These are core to the redesigned product and should exist in v1.

### A1. Builder Screen
**Role:** main entry and primary product surface

#### Purpose
Help the user define workout intent and configuration clearly, quickly, and with meaningful control.

#### Key content areas
- hero/header with product framing
- workout goal/focus controls
- duration and intensity controls
- equipment selection
- format selection
- advanced options section
- live workout summary / preview panel
- primary Generate CTA

#### Mobile priority
Highest.

#### Why it matters
This is the most important screen in the product. The old app treated it like a large form; the redesign should treat it like a guided builder experience.

---

### A2. Workout Summary Screen
**Role:** review-before-start screen

#### Purpose
Let the user inspect and understand the generated workout before starting.

#### Key content areas
- workout title / summary
- metadata cards or equivalent summary blocks
- warm-up / main / cool-down structure
- format-specific structure cues
- regenerate / edit controls
- Start Workout CTA

#### Mobile priority
Highest.

#### Why it matters
This preserves a strong lesson from the old app: users should not be thrown directly into the player.

---

### A3. Player / Coach Screen
**Role:** active workout execution experience

#### Purpose
Guide the user through the workout in a low-friction, motivating way.

#### Key content areas
- current exercise or current state
- work/rest timer and phase indicator
- next-up preview
- progress indicator
- pause/resume
- next/previous controls where allowed
- audio/haptic toggles later if needed
- exit/end controls

#### Mobile priority
Highest.

#### Why it matters
The player is not a utility screen. It is one of the product’s defining experiences.

---

### A4. Completion Screen / End State
**Role:** session wrap-up

#### Purpose
Provide closure, motivation, and forward navigation after a workout ends.

#### Key content areas
- completion message
- session summary
- optional highlights (duration, format, equipment used)
- CTA to build another workout
- CTA to view progress/dashboard

#### Mobile priority
High.

#### Why it matters
A strong completion state improves product feel and encourages repeat use.

---

### A5. Dashboard / Progress Screen
**Role:** lightweight progress and history surface

#### Purpose
Maintain product direction toward progress/history without letting analytics dominate v1.

#### Key content areas for v1
- recent workouts
- lightweight local stats
- streak or momentum concept if useful
- empty state encouraging another workout

#### Mobile priority
Medium.

#### Why it matters
This preserves the long-term product direction while keeping v1 scoped.

---

### A6. Profile / Preferences Screen
**Role:** lightweight personal settings surface

#### Purpose
Provide a place for user preferences and future account evolution without implementing full auth now.

#### Possible v1 content
- training preferences placeholder
- player preferences placeholder
- app settings placeholder
- future account messaging

#### Mobile priority
Medium-low.

#### Why it matters
It creates a stable IA destination for future personalization/backend work.

---

## B. Secondary Screens / Overlays

These may exist as modals, drawers, sheets, or internal states rather than full pages.

### B1. Advanced Builder Options Sheet
**Purpose:** hold deeper customization without cluttering the main builder view.

### B2. Exercise Detail / Substitution Sheet
**Purpose:** show more information or alternatives without derailing the main flow.

### B3. Resume Workout Prompt
**Purpose:** if a session is saved locally, offer resume vs discard.

### B4. Exit Workout Confirmation
**Purpose:** prevent accidental loss of an active session.

### B5. Empty-State Overlays
**Purpose:** keep dashboard/profile from feeling broken in early versions.

---

# Recommended Screen Hierarchy

## Primary hierarchy
1. **Builder**
2. **Workout Summary**
3. **Player / Coach**
4. **Completion**
5. **Dashboard / Progress**
6. **Profile / Preferences**

## Product emphasis
If implementation time is constrained, prioritize polish in this order:
1. Builder
2. Player
3. Workout Summary
4. Completion
5. Dashboard
6. Profile

---

# Screen-State Model

The app should also be thought of as a state-driven flow.

## Workout creation states
- idle / default builder
- editing builder
- generating
- generated / review-ready

## Workout execution states
- ready to start
- active work phase
- active rest phase
- paused
- completed
- exited back to summary

## Persistence states
- no saved workout
- resumable workout available
- local history available
- empty dashboard

This state model matters because React implementation should follow product states, not static-page assumptions.

---

# Mobile-First Layout Priorities

## Priority 1 — Thumb-friendly generation flow
Builder, summary, and player must be optimized for one-handed or easy thumb interaction.

## Priority 2 — High-clarity hierarchy
On mobile, each screen should have one obvious primary action.

## Priority 3 — Progressive disclosure
Advanced options should not overwhelm the initial builder screen.

## Priority 4 — Active workout readability
During the player experience, the current action, timer, and next context should be readable at a glance.

## Priority 5 — Reduced screen clutter
Avoid dashboard-style density in the primary workout journey.

---

# Desktop Adaptation Guidance

Desktop should be supported, but not lead the product design.

## Desktop can expand:
- side-by-side summary panels
- richer dashboard layout
- broader builder spacing
- more visible contextual help

## Desktop should not change:
- flow order
- primary decision hierarchy
- product emphasis on builder and player

---

# v1 vs Later by Screen

## v1 required
- Builder
- Workout Summary
- Player / Coach
- Completion
- Dashboard / Progress (lightweight)
- Profile / Preferences (lightweight placeholder acceptable)

## Later expansion
- full account flows
- deeper analytics surfaces
- richer history drilldowns
- synced profile/backend states
- adaptive recommendations based on user history

---

# Protected Invariants Reflected in the Screen Map

This screen map preserves these conceptual behaviors from the old app:
- configure before generate
- review before start
- guided player remains central
- dashboard remains in product direction
- structured workout presentation remains visible

It intentionally does **not** preserve:
- the old page layout
- auth-first header actions
- presets as a top-level UX anchor
- dashboard-heavy first impression

---

# Recommended Implementation Notes

## Routing suggestion
The implementation may use routes or route-like state such as:
- `/build`
- `/workout/:id/summary`
- `/workout/:id/play`
- `/workout/:id/complete`
- `/progress`
- `/profile`

Exact routing can change, but the conceptual screen separation should remain.

## Temporary same-repo strategy
Since old and new apps live in the same repo, the new React app should implement these screens independently rather than mirroring the old static page structure.

---

# Approval Check

This screen map should be considered good enough when:
- the app’s top-level destinations are obvious,
- builder / summary / player / completion flow is explicit,
- dashboard and profile are scoped appropriately,
- the redesign emphasis is clearly mobile-first and user-centered.
