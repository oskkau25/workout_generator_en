import { describe, expect, it } from 'vitest'
import { legacyExerciseCatalog } from '@/domain/exercises/exercise-catalog'

const mainExercises = legacyExerciseCatalog.filter((exercise) => exercise.phaseTags.includes('main'))

describe('legacyExerciseCatalog', () => {
  it('adds body-map and movement metadata to every exercise', () => {
    for (const exercise of legacyExerciseCatalog) {
      expect(exercise.movementPattern).toBeTruthy()
      expect(exercise.bodyMap.primary.length).toBeGreaterThan(0)
      expect(exercise.focusTags.length).toBeGreaterThan(0)
    }
  })

  it('keeps broad enough main exercise coverage for balanced generation', () => {
    const patterns = new Set(mainExercises.map((exercise) => exercise.movementPattern))
    const muscles = new Set(mainExercises.map((exercise) => exercise.primaryMuscle))

    expect(mainExercises.length).toBeGreaterThan(40)
    expect(patterns.has('squat')).toBe(true)
    expect(patterns.has('hinge')).toBe(true)
    expect(patterns.has('horizontal_push')).toBe(true)
    expect(patterns.has('horizontal_pull')).toBe(true)
    expect(patterns.has('core_stability')).toBe(true)
    expect(muscles.has('legs')).toBe(true)
    expect(muscles.has('back')).toBe(true)
    expect(muscles.has('core')).toBe(true)
  })
})
