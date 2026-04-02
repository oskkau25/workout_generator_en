import type { BodyRegionId } from '@/domain/exercises/exercise-types'
import { BODY_REGION_LABELS } from '@/domain/exercises/exercise-taxonomy'

type SideRegionDefinition = {
  id: BodyRegionId
  d: string
}

type CenterRegionDefinition = {
  id: BodyRegionId
  d: string
}

type FigureView = {
  title: 'Front' | 'Back'
  halfSilhouette: string
  centerLine?: string
  mirroredDetailLines?: string[]
  centerDetailLines?: string[]
  sideRegions: SideRegionDefinition[]
  centerRegions: CenterRegionDefinition[]
}

const FIGURE_WIDTH = 92
const MIRROR_TRANSFORM = `translate(${FIGURE_WIDTH} 0) scale(-1 1)`

const FRONT_VIEW: FigureView = {
  title: 'Front',
  halfSilhouette:
    'M46 31c-6 0-11 2-15 6-5 5-8 13-9 23l-2 18c0 7 2 12 7 15l4 3 2 15-4 40c-1 9 3 14 10 14h3l4-48',
  centerLine: 'M46 40v94',
  mirroredDetailLines: [
    'M46 39c-5 2-9 4-13 8',
    'M46 48c-4 5-8 10-10 16',
    'M46 114c-2 4-5 8-7 14',
  ],
  centerDetailLines: [
    'M39 94c2 4 4 6 7 6s5-2 7-6',
  ],
  sideRegions: [
    { id: 'shoulders', d: 'M24 40c4-6 11-9 22-9v12c-7 0-12 2-17 6Z' },
    { id: 'chest', d: 'M31 47c4-3 9-4 15-4v18H35Z' },
    { id: 'biceps', d: 'M21 57c4 2 7 6 8 11l1 15h-8c-2-7-3-15-1-26Z' },
    { id: 'forearms', d: 'M22 84h8l-2 20h-8c-1-6 0-13 2-20Z' },
    { id: 'obliques', d: 'M33 64h8l-2 29h-8c-1-8 0-18 2-29Z' },
    { id: 'hip_flexors', d: 'M39 95h7v11h-8c0-3 0-7 1-11Z' },
    { id: 'quadriceps', d: 'M33 109h13l-3 36H31c0-11 1-23 2-36Z' },
    { id: 'calves', d: 'M31 145h11l-3 23h-9c0-6 0-14 1-23Z' },
  ],
  centerRegions: [
    { id: 'core', d: 'M40 65h12l2 28H38Z' },
    { id: 'adductors', d: 'M43 109h6v36h-6Z' },
  ],
}

const BACK_VIEW: FigureView = {
  title: 'Back',
  halfSilhouette:
    'M46 31c-6 0-11 2-15 6-5 5-8 13-9 23l-2 18c0 7 2 12 7 15l4 3 2 15-4 40c-1 9 3 14 10 14h3l4-48',
  centerLine: 'M46 40v94',
  mirroredDetailLines: [
    'M46 39c-5 2-9 4-13 8',
    'M46 49c-4 4-7 9-9 14',
    'M46 59c-4 3-7 8-9 14',
    'M46 114c-2 4-5 8-7 14',
  ],
  centerDetailLines: [
    'M38 52c2 5 5 9 8 10s6 2 8 0',
    'M39 92c2 4 4 6 7 6s5-2 7-6',
  ],
  sideRegions: [
    { id: 'shoulders', d: 'M24 40c4-6 11-9 22-9v12c-7 0-12 2-17 6Z' },
    { id: 'upper_back', d: 'M31 46c4-3 9-4 15-4v18H35Z' },
    { id: 'lats', d: 'M28 50h8l-2 29h-8c-1-9 0-19 2-29Z' },
    { id: 'triceps', d: 'M21 54c3 2 6 6 7 11l-1 18h-7c-1-6-1-17 1-29Z' },
    { id: 'forearms', d: 'M22 84h8l-2 20h-8c-1-6 0-13 2-20Z' },
    { id: 'hamstrings', d: 'M33 109h13l-3 36H31c0-11 1-23 2-36Z' },
    { id: 'calves', d: 'M31 145h11l-3 23h-9c0-6 0-14 1-23Z' },
  ],
  centerRegions: [
    { id: 'lower_back', d: 'M39 67h14l3 19H36Z' },
    { id: 'glutes', d: 'M36 88c3-3 7-4 10-4s7 1 10 4l-3 17H39Z' },
    { id: 'adductors', d: 'M43 109h6v36h-6Z' },
  ],
}

const BODY_MAP_VIEWS: FigureView[] = [FRONT_VIEW, BACK_VIEW]

function getIntensity(regionId: BodyRegionId, primary: BodyRegionId[], secondary: BodyRegionId[]) {
  if (primary.includes(regionId)) return 'is-primary'
  if (secondary.includes(regionId)) return 'is-secondary'
  return ''
}

export type BodyMapFigureProps = {
  primary: BodyRegionId[]
  secondary?: BodyRegionId[]
  compact?: boolean
}

export function BodyMapFigure({ primary, secondary = [], compact = false }: BodyMapFigureProps) {
  return (
    <div className={compact ? 'body-map body-map-compact' : 'body-map'}>
      {BODY_MAP_VIEWS.map((view) => (
        <div key={view.title} className="body-map-card" aria-label={`${view.title} body map`}>
          <span className="body-map-label">{view.title}</span>
          <svg viewBox="0 0 92 176" className="body-map-svg" role="img" aria-hidden="true">
            <defs>
              <clipPath id={`body-map-clip-${view.title.toLowerCase()}`}>
                <circle cx="46" cy="14" r="11" />
                <path d={view.halfSilhouette} />
                <path d={view.halfSilhouette} transform={MIRROR_TRANSFORM} />
                <path d="M43 118h6v47h-6Z" />
              </clipPath>
            </defs>

            <circle cx="46" cy="14" r="11" className="body-map-silhouette" />
            <path d={view.halfSilhouette} className="body-map-silhouette" />
            <path d={view.halfSilhouette} transform={MIRROR_TRANSFORM} className="body-map-silhouette" />
            <path d="M43 118h6v47h-6Z" className="body-map-silhouette" />

            {view.centerLine ? <path d={view.centerLine} className="body-map-detail-line body-map-detail-line-center" /> : null}

            {view.centerDetailLines?.map((detailLine) => (
              <path key={detailLine} d={detailLine} className="body-map-detail-line" />
            ))}

            {view.mirroredDetailLines?.map((detailLine) => (
              <g key={detailLine}>
                <path d={detailLine} className="body-map-detail-line" />
                <path d={detailLine} transform={MIRROR_TRANSFORM} className="body-map-detail-line" />
              </g>
            ))}

            {view.centerRegions.map((region) => (
              <path
                key={region.id}
                d={region.d}
                clipPath={`url(#body-map-clip-${view.title.toLowerCase()})`}
                className={`body-map-region ${getIntensity(region.id, primary, secondary)}`.trim()}
              >
                <title>{BODY_REGION_LABELS[region.id]}</title>
              </path>
            ))}

            {view.sideRegions.map((region) => (
              <g key={region.id}>
                <path
                  d={region.d}
                  clipPath={`url(#body-map-clip-${view.title.toLowerCase()})`}
                  className={`body-map-region ${getIntensity(region.id, primary, secondary)}`.trim()}
                >
                  <title>{BODY_REGION_LABELS[region.id]}</title>
                </path>
                <path
                  d={region.d}
                  transform={MIRROR_TRANSFORM}
                  clipPath={`url(#body-map-clip-${view.title.toLowerCase()})`}
                  className={`body-map-region ${getIntensity(region.id, primary, secondary)}`.trim()}
                />
              </g>
            ))}
          </svg>
        </div>
      ))}
    </div>
  )
}
