# Body-map system plan

Implemented in this pass.

## Exercise data shape

Each `ExerciseDefinition` now carries:

```ts
movementPattern:
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'horizontal_push'
  | 'vertical_push'
  | 'horizontal_pull'
  | 'vertical_pull'
  | 'core_flexion'
  | 'core_stability'
  | 'core_rotation'
  | 'locomotion'
  | 'carry'
  | 'plyometric'
  | 'mobility'

bodyMap: {
  primary: BodyRegionId[]
  secondary: BodyRegionId[]
}

focusTags: string[]
```

`BodyRegionId` currently supports:
- shoulders
- chest
- upper_back
- lats
- biceps
- triceps
- forearms
- core
- obliques
- lower_back
- glutes
- quadriceps
- hamstrings
- calves
- hip_flexors
- adductors

## Runtime rules

- Legacy exercises are adapted into the new shape automatically.
- Missing balance coverage is patched by a supplemental exercise layer.
- Workout generation now biases selection by goal and balances by movement-pattern/body-region buckets instead of only `primaryMuscle`.
- Exercise swapping also respects the new body-map + movement metadata.

## UI surfaces

- Summary screen: each exercise detail can show a front/back body map and primary/secondary regions.
- Player screen: current exercise detail can show the same body map live during coaching.

## Design references

- Early body-map visual explorations are stored in `new-app/docs/body-map-concepts/`.
- `concept-a.svg` explores a minimal athletic silhouette.
- `concept-b.svg` explores a softer premium rounded sketch.
- `concept-c.svg` explores a more technical sport-diagram direction.
- These files are reference material for product/design review only. The current app body map is rendered from inline SVG path definitions in `src/components/body-map/BodyMapFigure.tsx`.

## Next sensible extensions

- Add real illustration assets or per-exercise media stills.
- Store unilateral metadata (`left/right`, alternating) for even better coaching copy.
- Add injury/risk tags into swap filtering, not just safety notes.
- Replace inference-first mapping with a curated source-of-truth JSON file once the dataset is fully hand-audited.
