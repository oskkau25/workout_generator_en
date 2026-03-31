import type { PropsWithChildren, ReactNode } from 'react'

interface FooterActionStripProps extends PropsWithChildren {
  title: string
  description?: string
  primaryAction?: ReactNode
  secondaryActions?: ReactNode
}

export function FooterActionStrip({
  title,
  description,
  primaryAction,
  secondaryActions,
  children,
}: FooterActionStripProps) {
  return (
    <section className="footer-action-strip" aria-labelledby="footer-action-strip-title">
      <div className="footer-action-strip-copy">
        <h3 id="footer-action-strip-title">{title}</h3>
        {description ? <p className="builder-help-text">{description}</p> : null}
      </div>
      <div className="footer-action-strip-actions">
        {primaryAction}
        {secondaryActions}
        {children}
      </div>
    </section>
  )
}
