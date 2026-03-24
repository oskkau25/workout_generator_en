# Autonomous Execution Guidelines

Date: 2026-03-24  
Status: approved working mode for the redesign implementation

---

# Purpose

This document defines when the agent should continue automatically and when it should stop and ask for input during the `workout_generator_en` redesign.

The goal is to allow autonomous progress without creating silent product drift or taking risky actions without approval.

---

# Default Rule

The agent should **continue automatically to the next ticket** if:
- the current ticket is complete,
- the next ticket follows naturally from the approved plan,
- and no stop condition is triggered.

---

# Continue Automatically When

## 1. The next ticket is the natural dependency
Examples:
- 1.2 -> 2.1
- 2.1 -> 2.2
- 2.2 -> 2.3

## 2. The work is internal to the repo
This includes:
- docs
- architecture
- scaffolding
- local implementation
- local testing
- refactors
- local commits

## 3. Product intent is already clear from repo source-of-truth docs
Use these as the primary decision basis:
- `PRODUCT_SPEC.md`
- `MIGRATION_PLAN.md`
- `docs/lessons-learned.md`
- `docs/screen-map.md`
- `docs/user-flow.md`

## 4. There is no major product fork
If there is a reasonable implementation choice that stays within the agreed direction, the agent should decide and document it.

## 5. The ticket validation loop succeeds
After each ticket, the agent should run relevant checks, document notable findings, and commit before moving on.

---

# Stop And Ask When

## 1. A major product or UX fork appears
Examples:
- two substantially different builder models are plausible
- an important feature may need to be cut or added
- the scope of v1 would materially change

## 2. The current spec appears wrong, incomplete, or contradictory
If implementation reveals a significant requirement gap, pause and ask.

## 3. A destructive or hard-to-reverse action is needed
Examples:
- deleting major legacy sections permanently
- replacing repo structure in a disruptive way
- rewriting history
- removing large amounts of reference material before the React app is stable

## 4. An external action is needed
Examples:
- pushing to GitHub
- changing production configuration
- creating external resources
- linking accounts/services
- sending external communications

## 5. A blocker prevents responsible continuation
Examples:
- required tooling cannot be installed
- repeated build/test failures have no clear path forward
- missing secrets or environment configuration matter for the next step

## 6. Scope creep starts pulling work off-plan
If the current ticket begins absorbing unrelated work, split it or ask.

---

# Soft Stop vs Hard Stop

## Soft Stop
The agent may continue, but should note the issue in docs/commit summary.
Use for:
- minor tradeoffs
- temporary stubs
- known non-blocking technical debt
- deferred polish

## Hard Stop
The agent must pause and ask for input.
Use for:
- major product ambiguity
- destructive actions
- external actions
- serious blockers

---

# Operating Rules

## 1. Follow ticket order by default
Reorder only if a dependency makes it necessary.

## 2. Commit after each completed ticket
At least one meaningful commit per ticket.

## 3. Write durable decisions into repo docs
Do not keep important execution decisions only in chat.

## 4. Keep legacy app as reference until replacement is stable
Do not prematurely delete the old app.

## 5. Prefer placeholders for deferred features
For auth, analytics, and deeper dashboard features, prefer lightweight future-ready placeholders instead of full implementation.

## 6. Preserve conceptual invariants, not legacy UI for its own sake
The redesign should keep product value while replacing clunky UX.

---

# Validation Loop Required After Each Ticket

1. build / compile checks relevant to the ticket
2. lint/static validation where available
3. automated tests relevant to the changed area
4. experience validation against product goals and protected invariants
5. console/runtime audit where relevant
6. document notable findings or intentional deviations
7. commit

---

# Current Approved Working Mode

The agent is approved to:
- proceed through the remaining tickets automatically
- avoid asking before each next ticket
- stop only when a hard-stop condition is triggered
- keep documentation and commits up to date as it progresses

---

# Immediate Next Step

Proceed with:
- Ticket 1.2 — define v1 scope vs later scope
