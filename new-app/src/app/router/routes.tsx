import type { RouteObject } from 'react-router-dom'
import { BuilderScreen } from '@/features/builder/BuilderScreen'
import { ProfileScreen } from '@/features/profile/ProfileScreen'
import { ProgressScreen } from '@/features/progress/ProgressScreen'
import { WorkoutPlayerScreen } from '@/features/player/WorkoutPlayerScreen'
import { WorkoutSummaryScreen } from '@/features/workout-summary/WorkoutSummaryScreen'

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <BuilderScreen />,
  },
  {
    path: '/build',
    element: <BuilderScreen />,
  },
  {
    path: '/workout/:workoutId/summary',
    element: <WorkoutSummaryScreen />,
  },
  {
    path: '/workout/:workoutId/play',
    element: <WorkoutPlayerScreen />,
  },
  {
    path: '/progress',
    element: <ProgressScreen />,
  },
  {
    path: '/profile',
    element: <ProfileScreen />,
  },
]
