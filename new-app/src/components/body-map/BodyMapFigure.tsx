import type { BodyRegionId } from '@/domain/exercises/exercise-types'
import { BODY_REGION_LABELS } from '@/domain/exercises/exercise-taxonomy'

type RegionDefinition = {
  id: BodyRegionId
  d: string
  mirrored?: boolean
}

type FigureView = {
  title: 'Front' | 'Back'
  silhouette: string
  centerLine?: string
  detailLines?: Array<{ d: string; mirrored?: boolean }>
  regions: RegionDefinition[]
}

const MIRROR_TRANSFORM = 'translate(92 0) scale(-1 1)'

const FRONT_VIEW: FigureView = {
  title: 'Front',
  silhouette:
    'M46 26c-7 0-13 3-18 8-6 6-9 15-10 26l-2 20c0 7 3 12 9 15l5 3 2 16-5 37c-1 8 4 14 12 14h4l4-46h6l4 46h4c8 0 13-6 12-14l-5-37 2-16 5-3c6-3 9-8 9-15l-2-20c-1-11-4-20-10-26-5-5-11-8-18-8Z',
  centerLine: 'M46 39v94',
  detailLines: [
    { d: 'M31 39c4 4 9 6 15 6' },
    { d: 'M35 56c3 2 7 3 11 3' },
    { d: 'M34 94c4 5 8 8 12 8' },
  ],
  regions: [
    { id: 'shoulders', d: 'M25 38c4-6 11-10 21-10s17 4 21 10l-5 9c-4-3-9-4-16-4s-12 1-16 4Z' },
    { id: 'chest', d: 'M32 45c4-3 9-5 14-5s10 2 14 5l-4 18H36Z' },
    { id: 'biceps', d: 'M18 54c5 1 9 5 10 12l1 17h-8c-4-7-5-18-3-29Z', mirrored: true },
    { id: 'forearms', d: 'M21 83h8l-1 21h-9c-2-6-1-14 2-21Z', mirrored: true },
    { id: 'core', d: 'M39 63h14l2 30H37Z' },
    { id: 'obliques', d: 'M31 61h8l-2 31h-8c-2-9-1-20 2-31Z', mirrored: true },
    { id: 'hip_flexors', d: 'M38 94h8l-1 11h-9c0-4 1-8 2-11Z', mirrored: true },
    { id: 'quadriceps', d: 'M33 106h11l-3 38H29c0-12 1-24 4-38Z', mirrored: true },
    { id: 'adductors', d: 'M43 106h6v38h-6Z' },
    { id: 'calves', d: 'M31 145h10l-3 26H29c-1-7 0-16 2-26Z', mirrored: true },
  ],
}

const BACK_VIEW: FigureView = {
  title: 'Back',
  silhouette:
    'M46 26c-7 0-13 3-18 8-6 6-9 15-10 26l-2 20c0 7 3 12 9 15l5 3 2 16-5 37c-1 8 4 14 12 14h4l4-46h6l4 46h4c8 0 13-6 12-14l-5-37 2-16 5-3c6-3 9-8 9-15l-2-20c-1-11-4-20-10-26-5-5-11-8-18-8Z',
  centerLine: 'M46 39v94',
  detailLines: [
    { d: 'M31 40c4 4 9 6 15 6' },
    { d: 'M35 51c2 6 6 10 11 10' },
    { d: 'M27 58c3 5 5 9 7 15', mirrored: true },
    { d: 'M35 94c3 4 7 7 11 7' },
  ],
  regions: [
    { id: 'shoulders', d: 'M25 38c4-6 11-10 21-10s17 4 21 10l-5 9c-4-3-9-4-16-4s-12 1-16 4Z' },
    { id: 'upper_back', d: 'M31 44c4-4 9-6 15-6s11 2 15 6l-4 17H35Z' },
    { id: 'lats', d: 'M27 48h8l-1 31h-8c-2-11-2-21 1-31Z', mirrored: true },
    { id: 'triceps', d: 'M18 52c5 2 8 7 9 13l-1 20h-6c-3-7-4-19-2-33Z', mirrored: true },
    { id: 'forearms', d: 'M21 83h8l-1 21h-9c-2-6-1-14 2-21Z', mirrored: true },
    { id: 'lower_back', d: 'M38 66h16l3 22H35Z' },
    { id: 'glutes', d: 'M35 89c4-3 8-5 11-5s7 2 11 5l-3 17H38Z' },
    { id: 'hamstrings', d: 'M33 106h11l-3 38H29c0-12 1-24 4-38Z', mirrored: true },
    { id: 'adductors', d: 'M43 106h6v38h-6Z' },
    { id: 'calves', d: 'M31 145h10l-3 26H29c-1-7 0-16 2-26Z', mirrored: true },
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
                <path d={view.silhouette} />
              </clipPath>
            </defs>
            <circle cx="46" cy="14" r="11" className="body-map-silhouette" />
            <path d={view.silhouette} className="body-map-silhouette" />
            {view.centerLine ? <path d={view.centerLine} className="body-map-detail-line body-map-detail-line-center" /> : null}
            {view.detailLines?.map((detailLine, index) => (
              <g key={`${view.title}-detail-${index}`}>
                <path d={detailLine.d} className="body-map-detail-line" />
                {detailLine.mirrored ? (
                  <path d={detailLine.d} transform={MIRROR_TRANSFORM} className="body-map-detail-line" />
                ) : null}
              </g>
            ))}
            {view.regions.map((region) => (
              <g key={region.id}>
                <path
                  d={region.d}
                  clipPath={`url(#body-map-clip-${view.title.toLowerCase()})`}
                  className={`body-map-region ${getIntensity(region.id, primary, secondary)}`.trim()}
                >
                  <title>{BODY_REGION_LABELS[region.id]}</title>
                </path>
                {region.mirrored ? (
                  <path
                    d={region.d}
                    transform={MIRROR_TRANSFORM}
                    clipPath={`url(#body-map-clip-${view.title.toLowerCase()})`}
                    className={`body-map-region ${getIntensity(region.id, primary, secondary)}`.trim()}
                  />
                ) : null}
              </g>
            ))}
          </svg>
        </div>
      ))}
    </div>
  )
}
