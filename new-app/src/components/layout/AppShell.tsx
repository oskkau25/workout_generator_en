import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PropsWithChildren,
} from 'react'
import { NavLink } from 'react-router-dom'

const primaryNav = [
  { to: '/build', label: 'Build' },
  { to: '/progress', label: 'Progress' },
  { to: '/profile', label: 'Profile' },
] as const

function renderBrandMark() {
  return (
    <svg viewBox="0 0 48 48" className="app-shell-brand-mark-svg" aria-hidden="true">
      <path d="M10 28c6-10 12-14 19-14 5 0 8 2 9 6 1 4-1 8-5 10-5 3-12 3-23 3 6-2 11-4 15-8 3-3 4-6 3-8" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27 17c3 1 5 3 5 6" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" />
    </svg>
  )
}

export function AppShell({ children }: PropsWithChildren) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuId = useId()
  const menuRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsMenuOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('keydown', handleKeyDown)

    firstLinkRef.current?.focus()

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') && !isMenuOpen) {
      event.preventDefault()
      setIsMenuOpen(true)
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="app-shell-header">
        <div className="app-shell-brand" aria-label="Flex Flow">
          <span className="app-shell-brand-mark" aria-hidden="true">
            {renderBrandMark()}
          </span>
          <div className="app-shell-brand-copy">
            <span className="app-shell-brand-name">Flex Flow</span>
            <span className="app-shell-brand-tag">Move with intent</span>
          </div>
        </div>
        <div className="app-shell-header-spacer" aria-hidden="true" />
        <div ref={menuRef} className="app-shell-menu">
          <button
            ref={triggerRef}
            type="button"
            className="app-shell-menu-trigger"
            aria-label={isMenuOpen ? 'Close primary navigation' : 'Open primary navigation'}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            onClick={() => setIsMenuOpen((current) => !current)}
            onKeyDown={handleTriggerKeyDown}
          >
            <span className="app-shell-menu-trigger-icon" aria-hidden="true">
              ☰
            </span>
            <span className="app-shell-menu-trigger-label">Menu</span>
          </button>

          <div
            className="app-shell-menu-panel"
            hidden={!isMenuOpen}
            role="dialog"
            aria-modal="false"
            aria-label="Primary navigation menu"
          >
            <nav id={menuId} className="app-shell-menu-nav" aria-label="Primary">
              {primaryNav.map((item, index) => (
                <NavLink
                  key={item.to}
                  ref={index === 0 ? firstLinkRef : undefined}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
                  onClick={closeMenu}
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
