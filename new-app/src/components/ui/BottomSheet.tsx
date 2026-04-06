import type { PropsWithChildren, ReactNode } from 'react'

interface BottomSheetProps extends PropsWithChildren {
  title: string
  subtitle?: string
  isOpen?: boolean
  onDismiss?: () => void
  actions?: ReactNode
}

export function BottomSheet({ title, subtitle, isOpen = false, onDismiss, actions, children }: BottomSheetProps) {
  if (!isOpen) {
    return null
  }

  return (
    <section className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="bottom-sheet-title">
      <div className="bottom-sheet-backdrop" aria-hidden="true" onClick={onDismiss} />
      <div className="bottom-sheet-panel">
        <div className="bottom-sheet-handle" aria-hidden="true" />
        <div className="bottom-sheet-header">
          <div>
            <h3 id="bottom-sheet-title">{title}</h3>
            {subtitle ? <p className="bottom-sheet-subtitle">{subtitle}</p> : null}
          </div>
          {onDismiss ? (
            <button type="button" className="ghost-action bottom-sheet-close" onClick={onDismiss}>
              Close
            </button>
          ) : null}
        </div>
        <div className="bottom-sheet-body">{children}</div>
        {actions ? <div className="bottom-sheet-actions">{actions}</div> : null}
      </div>
    </section>
  )
}
