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
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <main id="main-content" className="page-shell" tabIndex={-1}>
        {children}
      </main>

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
