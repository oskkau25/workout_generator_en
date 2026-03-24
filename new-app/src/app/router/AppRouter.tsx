import { useRoutes } from 'react-router-dom'
import { appRoutes } from '@/app/router/routes'

export function AppRouter() {
  return useRoutes(appRoutes)
}
