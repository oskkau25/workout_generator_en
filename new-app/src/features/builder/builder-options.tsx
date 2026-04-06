import type { ReactNode } from 'react'
import type { EquipmentId, FitnessLevel, WorkoutFormat, WorkoutGoal } from '@/domain/builder/builder-types'

// --- Goal icons ---

function GoalIcon({ type }: { type: WorkoutGoal }) {
  switch (type) {
    case 'full_body':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <circle cx="24" cy="10.5" r="4" />
          <path d="M24 15v10m-7 16 4-8 3-4 3 4 4 8m-10-15-6 4m12-4 6 4" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'upper_body':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M14 31c2-7 7-11 10-11s8 4 10 11M18 19l6-5 6 5m-11 15v7m10-7v7" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'lower_body':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M19 11v10l-3 8m13-18v10l3 8M16 41l4-12h8l4 12" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'core':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <rect x="16" y="11" width="16" height="26" rx="8" fill="none" stroke="currentColor" strokeWidth="3.25" />
          <path d="M24 15v18M18 21h12M18 27h12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case 'conditioning':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M24 10 14 27h8l-2 11 14-19h-8l2-9Z" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'mobility':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M13 30c2-7 7-12 11-12 6 0 11 6 11 12M24 18V8m-8 25 8 7 8-7" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}

// --- Format icons ---

function FormatIcon({ type }: { type: WorkoutFormat }) {
  switch (type) {
    case 'standard':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M10 14h28M10 24h20M10 34h12" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" />
        </svg>
      )
    case 'circuit':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M14 17h15m0 0-4-4m4 4-4 4M34 31H19m0 0 4-4m-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'tabata':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="3.25" />
          <path d="M24 17v8l6 3" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'pyramid':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M13 34h22M17 26h14M21 18h6" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}

// --- Equipment icons ---

function EquipmentIcon({ type }: { type: EquipmentId }) {
  switch (type) {
    case 'bodyweight':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <circle cx="24" cy="12" r="5" />
          <path d="M24 19v10m-9 14 5-9 4-5 4 5 5 9m-13-16-6 4m10-4 6 4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'dumbbells':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M12 19v10m4-14v18m16-18v18m4-14v10M16 24h16" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'kettlebell':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M17 18a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M14 22h20v4c0 10-5 16-10 16s-10-6-10-16z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
        </svg>
      )
    case 'trx_bands':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M16 10v10l8 9 8-9V10M16 20l-5 13m26-13 5 13" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="35" r="2.5" />
          <circle cx="37" cy="35" r="2.5" />
        </svg>
      )
    case 'resistance_band':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M13 30c3-11 19-11 22 0" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="12" cy="31" r="3.5" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="36" cy="31" r="3.5" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    case 'pull_up_bar':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M8 18h32M12 18v-6m24 6v-6M16 18v9m16-9v9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'jump_rope':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <path d="M14 16c-4 4-6 10-6 15m26-15c4 4 6 10 6 15M19 14l-5 4m15-4 5 4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'rower':
      return (
        <svg viewBox="0 0 48 48" className="builder-equipment-choice-icon-svg" aria-hidden="true">
          <circle cx="12" cy="34" r="3.5" />
          <path d="M15 34h17l6-12M23 22l4-6m-12 6 8-2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}

// --- Option arrays ---

export const GOAL_OPTIONS: Array<{ value: WorkoutGoal; label: string; detail: string; icon: ReactNode }> = [
  { value: 'full_body', label: 'Full body', detail: 'Balanced from head to toe.', icon: <GoalIcon type="full_body" /> },
  { value: 'upper_body', label: 'Upper body', detail: 'Push, pull, shoulders, and arms.', icon: <GoalIcon type="upper_body" /> },
  { value: 'lower_body', label: 'Lower body', detail: 'Legs, glutes, and lower-body strength.', icon: <GoalIcon type="lower_body" /> },
  { value: 'core', label: 'Core', detail: 'Bracing, control, and trunk stability.', icon: <GoalIcon type="core" /> },
  { value: 'conditioning', label: 'Conditioning', detail: 'Sweaty, athletic, and fast-moving.', icon: <GoalIcon type="conditioning" /> },
  { value: 'mobility', label: 'Mobility', detail: 'Loosen up and move better.', icon: <GoalIcon type="mobility" /> },
]

export const FORMAT_OPTIONS: Array<{ value: WorkoutFormat; label: string; detail: string; icon: ReactNode }> = [
  { value: 'standard', label: 'Standard', detail: 'Steady blocks from warm-up to finish.', icon: <FormatIcon type="standard" /> },
  { value: 'circuit', label: 'Circuit', detail: 'Move through a round, then repeat.', icon: <FormatIcon type="circuit" /> },
  { value: 'tabata', label: 'Tabata', detail: 'Fixed 20/10 intervals with punch.', icon: <FormatIcon type="tabata" /> },
  { value: 'pyramid', label: 'Pyramid', detail: 'Progressive levels that climb.', icon: <FormatIcon type="pyramid" /> },
]

export const EQUIPMENT_OPTIONS: Array<{ value: EquipmentId; label: string; icon: ReactNode }> = [
  { value: 'bodyweight', label: 'Bodyweight', icon: <EquipmentIcon type="bodyweight" /> },
  { value: 'dumbbells', label: 'Dumbbells', icon: <EquipmentIcon type="dumbbells" /> },
  { value: 'kettlebell', label: 'Kettlebell', icon: <EquipmentIcon type="kettlebell" /> },
  { value: 'trx_bands', label: 'TRX bands', icon: <EquipmentIcon type="trx_bands" /> },
  { value: 'resistance_band', label: 'Resistance band', icon: <EquipmentIcon type="resistance_band" /> },
  { value: 'pull_up_bar', label: 'Pull-up bar', icon: <EquipmentIcon type="pull_up_bar" /> },
  { value: 'jump_rope', label: 'Jump rope', icon: <EquipmentIcon type="jump_rope" /> },
  { value: 'rower', label: 'Rower', icon: <EquipmentIcon type="rower" /> },
]

export const LEVEL_OPTIONS: Array<{ value: FitnessLevel; label: string; detail: string }> = [
  { value: 'beginner', label: 'Beginner', detail: 'More approachable pace and exercise mix.' },
  { value: 'intermediate', label: 'Intermediate', detail: 'Solid challenge with balanced volume.' },
  { value: 'advanced', label: 'Advanced', detail: 'Higher output and tougher structure.' },
]

export const DURATION_OPTIONS = [15, 20, 30, 45, 60] as const
