import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/': 'Build',
  '/build': 'Build',
  '/progress': 'Progress',
  '/profile': 'Profile',
}

export function useAppSectionTitle() {
  const location = useLocation()

  return useMemo(() => {
    if (location.pathname.includes('/summary')) {
      return 'Workout Summary'
    }

    if (location.pathname.includes('/play')) {
      return 'Workout Player'
    }

    return titles[location.pathname] ?? 'Workout Generator'
  }, [location.pathname])
}
