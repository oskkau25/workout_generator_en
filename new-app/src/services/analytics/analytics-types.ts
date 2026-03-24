import type { WorkoutGenerationRequest } from '@/domain/builder/builder-types'
import type { GeneratedWorkout } from '@/domain/workouts/workout-types'

export type AnalyticsEvent =
  | {
      type: 'builder_generate_clicked'
      timestamp: string
      request: WorkoutGenerationRequest
    }
  | {
      type: 'workout_generated'
      timestamp: string
      workoutId: string
      format: GeneratedWorkout['metadata']['format']
      goal: GeneratedWorkout['metadata']['goal']
    }
  | {
      type: 'workout_started'
      timestamp: string
      workoutId: string
      sessionId: string
      format: GeneratedWorkout['metadata']['format']
    }
  | {
      type: 'workout_completed'
      timestamp: string
      workoutId: string
      sessionId: string
      totalStepsCompleted: number
      totalDurationSeconds: number
    }
  | {
      type: 'workout_abandoned'
      timestamp: string
      workoutId: string
      sessionId: string
      stepIndex: number
    }

export interface AnalyticsGateway {
  track(event: AnalyticsEvent): Promise<void>
}
