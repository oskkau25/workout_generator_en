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
    'M46 29c-6 0-11 2-15 7-5 5-8 13-9 24l-2 18c0 6 2 11 7 14l4 3 2 16-4 40c-1 8 3 14 10 14h3l4-48',
  centerLine: 'M46 40v94',
  mirroredDetailLines: [
    'M46 39c-5 2-9 4-13 8',
    'M46 46c-4 5-8 10-10 17',
    'M46 62c-3 1-6 2-9 2',
    'M46 90c-3 4-7 7-11 10',
    'M46 114c-2 4-5 8-7 14',
    'M46 145c-2 4-4 9-5 18',
  ],
  centerDetailLines: [
    'M39 62c2 3 4 4 7 4s5-1 7-4',
    'M39 94c2 4 4 6 7 6s5-2 7-6',
  ],
  sideRegions: [
    { id: 'shoulders', d: 'M24 40c4-6 11-10 22-10v13c-6 0-12 2-17 6Z' },
    { id: 'chest', d: 'M32 46c4-2 8-4 14-4v20H35Z' },
    { id: 'biceps', d: 'M20 56c4 1 8 5 9 11l1 16h-8c-3-7-4-16-2-27Z' },
    { id: 'forearms', d: 'M22 84h8l-2 22h-8c-1-6 0-14 2-22Z' },
    { id: 'obliques', d: 'M33 63h8l-2 31h-8c-2-8-1-20 2-31Z' },
    { id: 'hip_flexors', d: 'M38 95h8v12h-9c0-4 0-8 1-12Z' },
    { id: 'quadriceps', d: 'M33 108h13l-3 39H31c0-11 1-25 2-39Z' },
    { id: 'calves', d: 'M31 147h11l-3 24h-9c0-7 0-15 1-24Z' },
  ],
  centerRegions: [
    { id: 'core', d: 'M40 64h12l2 29H38Z' },
    { id: 'adductors', d: 'M43 108h6v39h-6Z' },
  ],
}

const BACK_VIEW: FigureView = {
  title: 'Back',
  halfSilhouette:
    'M46 29c-6 0-11 2-15 7-5 5-8 13-9 24l-2 18c0 6 2 11 7 14l4 3 2 16-4 40c-1 8 3 14 10 14h3l4-48',
  centerLine: 'M46 40v94',
  mirroredDetailLines: [
    'M46 39c-5 2-9 4-13 8',
    'M46 48c-4 4-7 9-9 15',
    'M46 59c-4 3-7 8-10 15',
    'M46 88c-3 4-6 7-10 10',
    'M46 114c-2 4-5 8-7 14',
    'M46 145c-2 4-4 9-5 18',
  ],
  centerDetailLines: [
    'M38 50c2 6 5 10 8 12s6 2 8 0',
    'M39 93c2 4 4 6 7 6s5-2 7-6',
  ],
  sideRegions: [
    { id: 'shoulders', d: 'M24 40c4-6 11-10 22-10v13c-6 0-12 2-17 6Z' },
    { id: 'upper_back', d: 'M32 45c4-3 8-4 14-4v20H35Z' },
    { id: 'lats', d: 'M28 49h8l-2 31h-8c-1-10 0-21 2-31Z' },
    { id: 'triceps', d: 'M20 53c4 2 7 6 8 12l-1 19h-7c-2-7-2-18 0-31Z' },
    { id: 'forearms', d: 'M22 84h8l-2 22h-8c-1-6 0-14 2-22Z' },
    { id: 'hamstrings', d: 'M33 108h13l-3 39H31c0-11 1-25 2-39Z' },
    { id: 'calves', d: 'M31 147h11l-3 24h-9c0-7 0-15 1-24Z' },
  ],
  centerRegions: [
    { id: 'lower_back', d: 'M39 67h14l3 20H36Z' },
    { id: 'glutes', d: 'M36 88c3-3 7-5 10-5s7 2 10 5l-3 18H39Z' },
    { id: 'adductors', d: 'M43 108h6v39h-6Z' },
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
                <path d="M43 117h6v48h-6Z" />
              </clipPath>
            </defs>

            <circle cx="46" cy="14" r="11" className="body-map-silhouette" />
            <path d={view.halfSilhouette} className="body-map-silhouette" />
            <path d={view.halfSilhouette} transform={MIRROR_TRANSFORM} className="body-map-silhouette" />
            <path d="M43 117h6v48h-6Z" className="body-map-silhouette" />

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
