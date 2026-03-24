import type { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'

const primaryNav = [
  { to: '/build', label: 'Build' },
  { to: '/progress', label: 'Progress' },
  { to: '/profile', label: 'Profile' },
] as const

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Workout Generator</p>
          <h1>React redesign foundation</h1>
        </div>
        <p className="topbar-copy">
          Mobile-first app shell for the builder, summary, player, progress, and future profile seams.
        </p>
      </header>

      <main className="page-shell">{children}</main>

      <nav className="bottom-nav" aria-label="Primary">
        {primaryNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
