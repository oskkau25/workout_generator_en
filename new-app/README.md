# Workout Generator redesign (`new-app`)

React + TypeScript + Vite foundation for the redesign track.

## What this app currently covers

The redesign already includes the main v1 flow:
- builder with goal, level, duration, format, equipment, and advanced controls
- generated workout summary/review step
- guided player with work/rest flow, pause/resume, next/previous, exit, and completion
- lightweight local progress/history surface
- profile/settings placeholder for later auth-backed work

The app is intentionally local-first for now. It stores generated workouts, active sessions, progress history, and player preferences in browser storage.

## Quick start

```bash
cd new-app
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Useful scripts

```bash
npm run dev        # local development
npm run build      # production build
npm run lint       # eslint
npm run test       # vitest with coverage
npm run preview    # preview production build
```

## Project shape

```text
new-app/
├─ public/                  # static assets
├─ src/app/                 # app shell, router, global styles
├─ src/domain/              # builder, workout, exercise, and player domain logic
├─ src/features/            # route-level screens
├─ src/services/storage/    # local persistence and future backend seams
├─ src/components/          # reusable UI/layout pieces
└─ src/test/                # shared test helpers
```

## Current boundaries

This redesign track is focused on release-candidate v1 scope, not full parity with every legacy surface.

Still intentionally deferred:
- full auth flows and account backend integration
- deep analytics/dashboard intelligence
- cloud sync and multi-device continuity
- exhaustive migration of every legacy preset, modal, and edge-case UI path

See `../docs/v1-scope.md` for the scope guardrails and `../docs/redesign-known-limitations.md` for the current RC limitations/later-scope list.
