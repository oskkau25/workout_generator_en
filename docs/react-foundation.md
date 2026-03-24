# React Foundation

Date: 2026-03-24  
Ticket: 2.2 — Scaffold React application foundation

## Boundary decision

The new React application now lives in `new-app/` at the repo root.

This keeps a clean boundary between:
- the legacy static implementation in `src/`
- the redesign-first React implementation in `new-app/`

That separation is intentional so Ticket 2.x and 3.x work can proceed without destabilizing the legacy reference app.

## Stack

The scaffold uses:
- Vite
- React
- TypeScript
- ESLint
- Vitest
- React Testing Library

Playwright is still deferred until there is a meaningful interactive flow worth exercising end to end.

## App structure

```txt
new-app/
  src/
    app/
      App.tsx
      router/
    components/
      layout/
      ui/
    features/
      builder/
      workout-summary/
      player/
      progress/
      profile/
    domain/
      builder/
      workouts/
      player/
    hooks/
    services/
      storage/
    test/
```

## Current routing approach

The initial route map follows `docs/screen-map.md`:
- `/build`
- `/workout/:workoutId/summary`
- `/workout/:workoutId/play`
- `/progress`
- `/profile`

For now these are shell screens, not full feature implementations.

## Architectural intent

### `app/`
Application entrypoints, app shell, and routing composition.

### `components/`
Reusable presentation-level UI pieces that should stay mostly feature-agnostic.

### `features/`
Screen and feature modules for builder, summary, player, progress, and profile.

### `domain/`
Typed domain contracts and pure logic seams. This is where the builder normalization, generator logic, and player state machine will grow in upcoming tickets.

### `hooks/`
Shared React hooks that are not tied to a single feature screen.

### `services/storage/`
Persistence interfaces and browser-backed adapters. Storage is intentionally abstracted so future backend work can replace adapters without rewriting domain modules.

### `test/`
Shared test helpers and environment setup.

## Validation covered in this ticket

- build
- lint
- unit/integration test foundation

## Intentional redesign choices

- Chose a separate `new-app/` workspace instead of mixing React scaffolding into the legacy `src/` tree.
- Chose a mobile-first shell with bottom navigation because the product direction is builder + coach first, not dashboard first.
- Added typed domain and storage seams immediately so Ticket 2.3 and 2.4 can land cleanly.

## Follow-up recommended for Ticket 2.3

Use the new `src/domain/` structure to extract and type the workout generation engine into pure modules with fixture-driven tests.
