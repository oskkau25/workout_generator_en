import type { MovementIconCategory } from '@/domain/exercises/exercise-taxonomy'
import type { PlayerPhase } from '@/domain/player/player-types'

export function MovementIcon({ category }: { category: MovementIconCategory }) {
  switch (category) {
    case 'squat':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="11" r="4" /><path d="M24 16v8l-6 5m6-5 6 5m-10 1v8m8-8v8m-14 0h20" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'hinge':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="28" cy="10" r="4" /><path d="M28 15v9l-8 5m8-5 7 3M20 29l-4 9m11-8 5 8M10 32h10" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'push':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 28h24M18 22l6-4 6 4M18 34l6-4 6 4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'pull':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 16h28m0 0-5-5m5 5-5 5M38 32H20m0 0 5-5m-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'plank':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="14" cy="18" r="3" /><path d="M17 20h13l8 8M30 20l-8 12M14 31h6m14 0h4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'lunge':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="10" r="4" /><path d="M24 15v8l-6 6m6-6 7 4m-13 2h9m-9 0-3 9m12-9 7 9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'rotation':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10a14 14 0 0 1 12 7m0 0v-5m0 5h-5M24 38a14 14 0 0 1-12-7m0 0v5m0-5h5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M24 16v16" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg>
    case 'jump':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 11v18m0 0-7-7m7 7 7-7M14 37h20" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'carry':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 18h7v6h-7zm17 0h7v6h-7zM19 21h10M24 12v9m0 3v12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'mobility_stretch':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 30c2-7 7-12 11-12 6 0 11 6 11 12M24 18V8m-8 25 8 7 8-7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'floor_core':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 30h14l8-8 6 6M16 30l6 8m12-10 4 10" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    default:
      return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="3.2" /><path d="M24 18v6l4 4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
}

export type WorkoutSectionType = 'warmup' | 'main' | 'cooldown'

export function SectionIcon({ type }: { type: WorkoutSectionType }) {
  switch (type) {
    case 'warmup':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 31c2-7 7-12 9-12s7 5 9 12M24 18V9m-5 23 5 6 5-6" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'cooldown':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 24c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9Zm9-15v4m0 22v4m15-15h-4M13 24H9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    default:
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10 14 27h8l-2 11 14-19h-8l2-9Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
}

export function PlayerStateIcon({ phase }: { phase: PlayerPhase | 'idle' }) {
  switch (phase) {
    case 'work':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10 14 27h8l-2 11 14-19h-8l2-9Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'rest':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 24c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9Zm9-15v4m0 22v4m15-15h-4M13 24H9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'paused':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 14v20M30 14v20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
    case 'completed':
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 24l7 7 13-14" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="3.2" /></svg>
    default:
      return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 15v18l14-9Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
}
