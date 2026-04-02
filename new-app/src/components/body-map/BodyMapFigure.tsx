import type { BodyRegionId } from '@/domain/exercises/exercise-types'
import { BODY_REGION_LABELS } from '@/domain/exercises/exercise-taxonomy'

type RegionDefinition = {
  id: BodyRegionId
  d: string
}

const FRONT_REGIONS: RegionDefinition[] = [
  { id: 'shoulders', d: 'M28 28c-10 0-14 6-14 12v8h8v-4c0-5 2-8 6-10Zm40 0c10 0 14 6 14 12v8h-8v-4c0-5-2-8-6-10Z' },
  { id: 'chest', d: 'M32 42c4-3 10-5 16-5s12 2 16 5l-3 16H35Z' },
  { id: 'biceps', d: 'M12 48c5 1 8 5 8 12v10H10c-3-10-3-20 2-22Zm68 0c-5 1-8 5-8 12v10h10c3-10 3-20-2-22Z' },
  { id: 'forearms', d: 'M10 70h10l-3 20H7c-1-6 0-14 3-20Zm60 0h10c3 6 4 14 3 20H73Z' },
  { id: 'core', d: 'M39 58h18l3 30H36Z' },
  { id: 'obliques', d: 'M31 58h8l-3 28H28c-1-10 0-19 3-28Zm30 0h8c3 9 4 18 3 28h-8Z' },
  { id: 'hip_flexors', d: 'M38 89h7v11h-9c0-4 1-8 2-11Zm17 0h7c1 3 2 7 2 11h-9Z' },
  { id: 'quadriceps', d: 'M36 100h10l-3 34H30c0-10 2-23 6-34Zm18 0h10c4 11 6 24 6 34H57Z' },
  { id: 'adductors', d: 'M46 100h8v34h-8Z' },
  { id: 'calves', d: 'M31 134h11l-3 32H27c0-9 2-22 4-32Zm17 0h11c2 10 4 23 4 32H51Z' },
] 

const BACK_REGIONS: RegionDefinition[] = [
  { id: 'shoulders', d: 'M28 28c-10 0-14 6-14 12v8h8v-4c0-5 2-8 6-10Zm40 0c10 0 14 6 14 12v8h-8v-4c0-5-2-8-6-10Z' },
  { id: 'upper_back', d: 'M32 42c5-4 10-6 16-6s11 2 16 6l-4 16H36Z' },
  { id: 'lats', d: 'M28 46h8l-2 28h-8c-2-10-1-20 2-28Zm32 0h8c3 8 4 18 2 28h-8Z' },
  { id: 'triceps', d: 'M12 48c5 1 8 5 8 12v10H10c-3-10-3-20 2-22Zm68 0c-5 1-8 5-8 12v10h10c3-10 3-20-2-22Z' },
  { id: 'forearms', d: 'M10 70h10l-3 20H7c-1-6 0-14 3-20Zm60 0h10c3 6 4 14 3 20H73Z' },
  { id: 'lower_back', d: 'M39 58h18l4 22H35Z' },
  { id: 'glutes', d: 'M36 80h28l-2 20H38Z' },
  { id: 'hamstrings', d: 'M36 100h10l-3 34H30c0-10 2-23 6-34Zm18 0h10c4 11 6 24 6 34H57Z' },
  { id: 'adductors', d: 'M46 100h8v34h-8Z' },
  { id: 'calves', d: 'M31 134h11l-3 32H27c0-9 2-22 4-32Zm17 0h11c2 10 4 23 4 32H51Z' },
]

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
      {[
        { title: 'Front', regions: FRONT_REGIONS },
        { title: 'Back', regions: BACK_REGIONS },
      ].map((view) => (
        <div key={view.title} className="body-map-card" aria-label={`${view.title} body map`}>
          <span className="body-map-label">{view.title}</span>
          <svg viewBox="0 0 92 176" className="body-map-svg" role="img" aria-hidden="true">
            <circle cx="46" cy="14" r="11" className="body-map-base" />
            <path d="M31 28h30l5 20-4 32H30l-4-32Z" className="body-map-base" />
            <path d="M20 48h12v22H18Zm52 0h-12v22h14Z" className="body-map-base" />
            <path d="M18 70h12l-4 24H14Zm50 0h12l4 24H66Z" className="body-map-base" />
            <path d="M36 80h20l8 20-4 38H32l-4-38Z" className="body-map-base" />
            <path d="M32 138h13l-4 28H28Zm15 0h13l4 28H51Z" className="body-map-base" />
            {view.regions.map((region) => (
              <path
                key={region.id}
                d={region.d}
                className={`body-map-region ${getIntensity(region.id, primary, secondary)}`.trim()}
              >
                <title>{BODY_REGION_LABELS[region.id]}</title>
              </path>
            ))}
          </svg>
        </div>
      ))}
    </div>
  )
}
