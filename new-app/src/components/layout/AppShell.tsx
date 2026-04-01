import { useId, useState, type PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'

const primaryNav = [
  { to: '/build', label: 'Build' },
  { to: '/progress', label: 'Progress' },
  { to: '/profile', label: 'Profile' },
] as const

export function AppShell({ children }: PropsWithChildren) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuId = useId()

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="app-shell-header">
        <div className="app-shell-header-spacer" aria-hidden="true" />
        <div className="app-shell-menu">
          <button
            type="button"
            className="app-shell-menu-trigger"
            aria-label="Open primary navigation"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="app-shell-menu-trigger-icon" aria-hidden="true">
              ☰
            </span>
            <span className="app-shell-menu-trigger-label">Menu</span>
          </button>

          <div className="app-shell-menu-panel" hidden={!isMenuOpen}>
            <nav id={menuId} className="app-shell-menu-nav" aria-label="Primary">
              {primaryNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" className="page-shell" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
