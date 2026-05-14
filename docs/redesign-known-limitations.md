# Redesign known limitations and later-scope items

Date: 2026-03-24  
Context: release-candidate cleanup prep for Phase 4.3

This is the concise reality check for the React redesign as it approaches an RC-style handoff.

## What is already in decent shape

- Builder -> summary -> player -> completion flow exists.
- Core formats exist: standard, circuit, tabata, pyramid.
- Local persistence exists for generated workouts, active sessions, progress history, and player preferences.
- Progress and profile routes exist with intentionally limited v1 scope.
- Domain and storage code are separated enough to support later backend replacement.

## Known limitations in the current redesign

### 1. No real auth yet
The `/profile` route is intentionally a placeholder shell.

Still missing:
- registration/login/logout UX
- password reset/account recovery
- authenticated profile data
- backend session/account integration

Status: deliberate v1 deferral, not a release blocker for the redesign RC.

### 2. Progress is intentionally lightweight
The `/progress` route is useful, but it is not a full analytics/dashboard replacement.

Still missing:
- charts and richer trends
- deeper goal tracking
- legacy analytics parity
- backend-synced history

Status: expected v1 limitation.

### 3. Local storage is the only persistence layer
Current redesign continuity is device/browser-local only.

Implications:
- no cross-device sync
- no cloud backup
- no account-bound workout history
- clearing browser storage wipes redesign continuity

Status: acceptable for now, but important to communicate.

### 4. Legacy parity is selective, not exhaustive
The redesign preserves the core product promise, but not every historical surface or interaction yet.

Not fully rebuilt yet:
- legacy auth-heavy header/account flows
- deep dashboard behavior
- every preset/micro-interaction from the static app
- full end-to-end migration coverage for all legacy storage contracts

Status: intentional scope control.

### 5. RC polish/test depth still has room to grow
The redesign has unit/integration coverage in `new-app`, but it still needs broader release confidence work if this branch becomes the default app.

Still worth doing later:
- targeted browser smoke coverage for builder -> summary -> player
- migration/storage compatibility checks against legacy data shapes
- broader accessibility QA pass on the finished redesign UI
- product polish pass on copy, motion, and empty states

## Not in scope for this cleanup pass

These were intentionally left alone here:
- destructive removal of legacy app files
- large architectural rewrites
- feature expansion beyond safe RC cleanup/documentation

## Recommended next steps after RC cleanup

1. Add one high-value browser smoke test for the core workout flow.
2. Decide whether legacy-to-redesign storage migration needs adapters before rollout.
3. Keep progress/profile limited unless they clearly support the builder/player core.
4. Revisit auth and deeper analytics only when backend direction is concrete.
