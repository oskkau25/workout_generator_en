interface VisualChoiceTileProps {
  icon: string
  title: string
  detail?: string
  selected: boolean
  onClick: () => void
  ariaLabel?: string
}

export function VisualChoiceTile({ icon, title, detail, selected, onClick, ariaLabel }: VisualChoiceTileProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={selected ? 'visual-choice-tile is-selected' : 'visual-choice-tile'}
      onClick={onClick}
    >
      <span className="silhouette-slot" aria-hidden="true">
        {icon}
      </span>
      <span className="visual-choice-copy">
        <strong>{title}</strong>
        {detail ? <span>{detail}</span> : null}
      </span>
      <span className="visual-choice-state">{selected ? 'Selected' : 'Tap to choose'}</span>
    </button>
  )
}
