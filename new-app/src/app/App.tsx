import { AppShell } from '@/components/layout/AppShell'
import { AppRouter } from '@/app/router/AppRouter'

export function App() {
  return (
    <AppShell>
      <AppRouter />
    </AppShell>
  )
}
