# Integration Seams

Date: 2026-03-24  
Ticket: Phase 4.2 — Future integration seams

Source inputs:
- `PRODUCT_SPEC.md`
- `docs/domain-model.md`
- `docs/v1-scope.md`
- current `new-app/src/domain/*`
- current `new-app/src/services/storage/*`
- current feature screens in `new-app/src/features/*`

---

# Purpose

This document defines the lightweight integration seams that let the current local-first React app grow into a backend-aware product later without rewriting the builder, generator, player, or dashboard foundations.

The intent is to make future work obvious and low-risk, not to pre-implement a backend now.

---

# What exists today

The React app already has strong local-first foundations:

- pure builder normalization in `src/domain/builder/`
- pure workout generation in `src/domain/workouts/`
- player state/reducer/selectors in `src/domain/player/`
- browser persistence adapters in `src/services/storage/`
- progress and profile surfaces that are intentionally scoped for v1

That means the right Phase 4.2 move is **not** to add server code. The right move is to put explicit contracts at the edges where future auth, analytics, sync, and backend persistence will connect.

---

# Design rules for all seams

## 1. Domain stays backend-agnostic
- `builder-normalizer`, `workout-generator`, and `player-reducer` remain pure.
- No auth state, network calls, or analytics transport logic enters the domain layer.

## 2. UI talks to seams, not future APIs directly
- Screens and hooks should depend on gateways/repositories.
- Later backend swaps should happen behind adapter boundaries.

## 3. Local-first remains the default v1 runtime
- Current UX keeps working without a user account.
- Auth, sync, and analytics failures must never block generating or finishing a workout.

## 4. Storage contracts remain the canonical local fallback
- Local storage is still the source of truth in v1.
- Future sync should layer on top of it, not replace core behavior prematurely.

---

# 1. Auth seam

## Why it exists
`PRODUCT_SPEC.md` and `docs/v1-scope.md` explicitly defer auth for v1, but both require the architecture to allow later account work.

## Current code seam
- `new-app/src/services/accounts/account-types.ts`
- `new-app/src/services/accounts/noop-account-gateway.ts`

## Contract
`AccountGateway` provides:
- `getCurrentProfile()`
- `getCurrentSession()`
- optional `signIn()` / `signOut()`

## v1 behavior
- `noopAccountGateway` always returns `null`
- Profile UI can acknowledge future account support without forcing auth into the core flow

## Later backend path
Swap `noopAccountGateway` for a real adapter that talks to:
- email/password auth
- OAuth/social auth
- magic links
- token refresh/session restore

No builder/player domain code should need to change.

---

# 2. Analytics seam

## Why it exists
Analytics is deferred in scope, but key product events should already have clear names and payload boundaries so event tracking does not get scattered through components later.

## Current code seam
- `new-app/src/services/analytics/analytics-types.ts`
- `new-app/src/services/analytics/noop-analytics-gateway.ts`
- `new-app/src/services/analytics/console-analytics-gateway.ts`
- `new-app/src/services/analytics/analytics.ts`

## Event set added now
The seam currently defines practical events for the highest-value product moments:
- `builder_generate_clicked`
- `workout_generated`
- `workout_started`
- `workout_completed`
- `workout_abandoned`

## Design rule
Analytics calls are best-effort side effects only.
If tracking fails, nothing in generation, playback, or history saving should break.

## Later backend path
Replace the exported gateway in `analytics.ts` with:
- Segment / PostHog / RudderStack / GA4 adapter
- a first-party ingestion client
- queued offline delivery if needed

The event names and payload shapes can remain stable.

---

# 3. History and progress sync seam

## Why it exists
The dashboard/progress surface already uses local history. Future account-aware progress should reuse that same domain/storage model instead of inventing a separate one.

## Current code seam
- local model: `new-app/src/services/storage/storage-types.ts`
- local adapter: `new-app/src/services/storage/workout-history-store.ts`
- repository seam: `new-app/src/services/history/history-repository.ts`

## Design choice
The new repository seam wraps the existing local store instead of replacing it.
That keeps Phase 4.2 lightweight and aligned with the current architecture.

## Repository contract
`WorkoutHistoryRepository` exposes:
- `listRecent(context?, limit?)`
- `save(entry, context?)`
- optional `sync(context?)`

`context.userId` is optional on purpose so v1 remains usable without auth.

## Later backend path
A backend-aware repository can:
- load local entries first for instant UI
- upload unsynced entries
- merge remote history with local history
- filter by authenticated user when available

The progress screen should still consume a repository, not backend-specific code.

---

# 4. Backend persistence seam

## Why it exists
There are several persistence candidates that may later need sync:
- builder draft
- generated workout handoff
- active session resume state
- workout history
- preferences

These should not each invent their own backend contract later.

## Current code seam
- `new-app/src/services/persistence/backend-persistence.ts`

## Design choice
The seam uses a generic `PersistenceEnvelope<T>` so future sync code can pass:
- `userId`
- `deviceId`
- payload
- `updatedAt`
- resource type

without forcing the domain model to know about transport details.

## Why envelopes help
They make it easier later to support:
- conflict resolution
- last-write-wins fallback
- device-aware sync debugging
- partial rollout resource by resource

## Later backend path
A real `BackendPersistenceGateway` can be implemented behind the existing optional methods:
- `saveBuilderDraft`
- `saveGeneratedWorkout`
- `saveActiveSession`
- `appendHistoryEntry`

Because these methods are optional now, Phase 4.2 does not commit the app to a server design too early.

---

# 5. Practical app-level usage introduced now

## Profile
Profile now reads through an account gateway seam instead of being only static copy.

## History and progress
The history entry model now carries optional sync metadata (`userId`, `syncState`) so future account-aware progress sync can attach identity and sync state without reshaping the local history model.

## Local-first repositories and gateways
The app now has concrete noop/local adapters for account, analytics, history, and backend persistence seams. Future implementations can swap those adapters without rewriting the domain layer.

---

# 6. Recommended future implementation order

## Step 1 — Swap noop account gateway
Add real session bootstrap and profile fetch while keeping profile/account optional outside the core flow.

## Step 2 — Swap noop analytics gateway
Start with product events only. Avoid broad, noisy event capture.

## Step 3 — Introduce sync orchestration around local stores
Keep local writes first, then sync in background. Do not block the user path on network success.

## Step 4 — Move progress/history to repository-first reads
Let local + remote merge happen behind `WorkoutHistoryRepository`.

## Step 5 — Add conflict strategy only when needed
Do not overdesign sync conflict logic before real backend/product pressure exists.

---

# 7. Non-goals of this phase

This phase intentionally does **not**:
- implement login UI
- add backend API calls
- add a real analytics SDK
- change the domain model for server payloads
- force all screens to fully adopt repositories immediately

The goal is visible, typed seams — not backend implementation theater.

---

# 8. Files added or updated in this phase

## Added
- `new-app/src/services/accounts/account-types.ts`
- `new-app/src/services/accounts/noop-account-gateway.ts`
- `new-app/src/services/analytics/analytics-types.ts`
- `new-app/src/services/analytics/noop-analytics-gateway.ts`
- `new-app/src/services/analytics/console-analytics-gateway.ts`
- `new-app/src/services/analytics/analytics.ts`
- `new-app/src/services/history/history-repository.ts`
- `new-app/src/services/persistence/backend-persistence.ts`
- `docs/integration-seams.md`

## Updated
- `new-app/src/services/storage/storage-types.ts`
- `new-app/src/services/storage/progress-helpers.ts`
- `new-app/src/features/profile/ProfileScreen.tsx`

---

# Summary

Phase 4.2 is successful if the app still behaves like a clean local-first v1 product, while the places where auth, analytics, synced history, and backend persistence will connect are now explicit, typed, and easy to replace later.
