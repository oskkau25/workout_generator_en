import { useLayoutEffect } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'
import { appRoutes } from '@/app/router/routes'

export function AppRouter() {
  const location = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname, location.search, location.hash])

  return useRoutes(appRoutes)
}
