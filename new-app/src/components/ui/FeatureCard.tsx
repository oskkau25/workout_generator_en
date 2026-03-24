import type { ReactNode } from 'react'

interface FeatureCardProps {
  title: string
  body: string
  eyebrow?: string
  children?: ReactNode
}

export function FeatureCard({ title, body, eyebrow, children }: FeatureCardProps) {
  return (
    <section className="card">
      {eyebrow ? <p className="card-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      <p>{body}</p>
      {children ? <div className="card-stack">{children}</div> : null}
    </section>
  )
}
