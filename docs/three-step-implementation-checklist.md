# Three-Step Implementation Checklist

Date: 2026-03-31

Purpose:
Define the best implementation sequence for the locked three-step UX redesign and capture the execution rules that should guide all screen work.

Related spec:
- `docs/three-step-ux-redesign-plan.md`

---

# 1. Implementation principles

## Content rules
- Each screen should answer one main question only.
  - Build: `What workout do you want?`
  - Check: `Does this workout look right?`
  - Workout: `What do I do now?`
- Prefer labels of 1 to 3 words.
- Keep support copy to one short line when possible.
- Remove paragraphs that do not help a decision.

## Scroll rules
- The default view of a screen should feel shorter than the fully expanded view.
- Use collapse/expand to control density.
- Avoid opening a screen with several equally loud full-width sections.

## Hierarchy rules
- One dominant element per screen.
  - Build: visual choice flow
  - Check: workout journey
  - Workout: timer
- Secondary actions should never compete visually with the main action.
- Do not let unrelated sections share the same visual emphasis.

## Interaction rules
- Every selected state must be visually obvious.
- Expanded states should feel intentional and reveal only useful detail.
- Swapping an exercise must feel immediate and visible.

## Asset rules
- Use silhouettes first.
- Keep all temporary illustration placeholders in one visual style family.
- Do not mix unrelated icon styles.

## State rules
- Keep workout generation and player domain logic stable where possible.
- Add redesign complexity mostly in feature UI state and presentational components first.

## Testing rules
Each implementation phase should be reviewed for:
- mobile-first layout quality
- primary CTA placement
- scan speed
- accessibility/focus behavior
- reasonable scroll length

Each implementation phase should also land with:
- updated automated tests for the changed behavior
- `new-app` lint passing
- `new-app` test suite passing
- `new-app` production build passing

Testing should ship with the redesign work, not after it.

---

# 1.1 Test strategy

## Current foundation
The React app already has:
- Vitest
- React Testing Library
- route/integration coverage in `new-app/src/app/App.test.tsx`
- player coverage in `new-app/src/features/player/WorkoutPlayerScreen.test.tsx`
- CI coverage through `lint`, `test`, and `build` in the existing GitHub workflow

## Required test layers for the redesign

### A. Unit tests
Use for:
- helper functions
- selector logic
- future swap/replacement helpers
- small UI-state utilities if extracted

### B. Feature integration tests
Use for:
- Build interactions
- Check expansion/collapse behavior
- exercise swap behavior
- Workout control behavior

This should be the main testing layer for the redesign.

### C. App flow tests
Use for:
- Build -> Check -> Workout happy path
- edit settings return path
- resumable session path

This should continue living in `App.test.tsx` or an equivalent app-flow test file.

## New test targets to add during implementation

### Build
Add a dedicated:
- `new-app/src/features/builder/BuilderScreen.test.tsx`

Cover at minimum:
- progress strip renders
- goal selection updates visible state
- duration selection updates visible state
- format selection updates visible state
- equipment multi-select works
- advanced section is collapsed by default
- generate CTA is available in the final action area

### Check
Add a dedicated:
- `new-app/src/features/workout-summary/WorkoutSummaryScreen.test.tsx`

Cover at minimum:
- sections render collapsed by default
- expanding sections reveals exercise cards
- expanding an exercise reveals detail
- `Switch exercise` appears only in expanded state
- switching replaces the exercise
- switched exercise shows `Swapped` badge
- footer actions remain available at the end

### Workout
Expand:
- `new-app/src/features/player/WorkoutPlayerScreen.test.tsx`

Cover at minimum:
- timer remains the main control-state anchor
- Previous and Next stay visible
- center control changes across Start / Pause / Resume
- settings button opens the settings surface
- preferences are not permanently rendered as a main-page card

### App flow
Update:
- `new-app/src/app/App.test.tsx`

Cover at minimum:
- Build -> Check -> Workout journey still works
- the Check screen reflects the new review structure
- editing settings returns correctly to Build

## CI expectations during redesign
- keep `npm run lint` in CI
- keep `npm run test -- --run` in CI
- keep `npm run build` in CI
- do not merge redesign phases without updated tests for changed screen behavior

## Recommended later improvement
After Build and Check stabilize:
- add one browser-level happy-path Playwright test for:
  - Build workout
  - Check workout
  - Start workout

After layout stabilizes further:
- consider lightweight visual regression coverage for:
  - Build default state
  - Check collapsed timeline state
  - Workout active state

---

# 2. Recommended implementation order

## Phase 0: Shared foundation

Goal:
Build reusable UI pieces and styling primitives before redesigning the screens.

Why first:
- prevents duplicated screen-specific styling
- keeps the three-step flow visually consistent
- lowers risk during later screen rewrites

Deliverables:
- progress strip component or pattern
- visual choice tile pattern
- silhouette slot / illustration placeholder pattern
- compact footer CTA strip pattern
- compact section header pattern
- bottom sheet pattern
- timeline section pattern

Likely files:
- `new-app/src/components/ui/`
- `new-app/src/app/styles.css`

Recommended outputs:
- reusable CSS tokens/classes
- small presentational components where reuse is obvious

Definition of done:
- shared building blocks exist and can support Build, Check, and Workout without major restyling
- basic tests exist for any new shared UI components with meaningful interaction

---

## Phase 1: Build redesign

Goal:
Turn the current builder into a clean continuous visual selection page.

Why first:
- highest current UX pain
- first-touch experience
- establishes visual language for the rest of the flow

Main tasks:
- add top three-step progress strip
- shorten hero to one sentence
- replace goal controls with visual tiles
- keep duration as compact segmented controls
- replace format controls with visual tiles
- replace equipment controls with illustrated multi-select tiles
- simplify advanced settings and keep them collapsed by default
- remove or shrink the current summary-heavy treatment
- keep only a compact end-of-page CTA area

Likely files:
- `new-app/src/features/builder/BuilderScreen.tsx`
- `new-app/src/app/styles.css`
- optional new shared UI components under `new-app/src/components/ui/`

Definition of done:
- Build feels shorter and more visual
- CTA only appears naturally at the end
- helper text is significantly reduced
- selection states are scannable without heavy reading
- Build screen tests cover the new interaction model

---

## Phase 2: Check layout redesign

Goal:
Reshape the summary screen into a practical vertical workout journey.

Why second:
- depends on the visual language set in Build
- introduces the review model without yet adding all exercise-swap behavior

Main tasks:
- add compact step framing for Build / Check / Workout
- keep a concise top recap
- replace current review layout with a vertical timeline structure
- show Warm-up / Main / Cool-down as collapsed sections by default
- simplify metadata emphasis
- keep footer actions only at the end
- remove full regenerate CTA from the design

Likely files:
- `new-app/src/features/workout-summary/WorkoutSummaryScreen.tsx`
- `new-app/src/app/styles.css`
- optional shared timeline/exercise preview UI components

Definition of done:
- review screen reads as a sequence, not a dashboard
- sections are collapsed by default
- user can understand workout structure quickly
- Check layout tests cover collapsed and expanded section behavior

---

## Phase 3: Check exercise expansion and swap

Goal:
Add the practical exercise-inspection and instant-swap behavior.

Why separate from Phase 2:
- keeps layout simplification and interaction logic from landing in one risky step
- makes it easier to verify swap behavior clearly

Main tasks:
- add expandable exercise cards
- add silhouette and short explanatory content for expanded state
- add instant `Switch exercise` action on expanded exercises only
- implement automatic valid replacement behavior
- add `Swapped` badge styling/state

Likely files:
- `new-app/src/features/workout-summary/WorkoutSummaryScreen.tsx`
- domain/helper modules if swap logic needs extraction
- `new-app/src/app/styles.css`

Definition of done:
- users can expand an exercise for clarity
- users can switch an exercise instantly
- swapped state is obvious
- automated tests cover instant swap and `Swapped` badge behavior

---

## Phase 4: Workout redesign

Goal:
Compress the player into a timer-led, performance-focused coach screen.

Why after Build and Check:
- visual system is already established
- player is interaction-heavy and benefits from proven patterns

Main tasks:
- reduce visible module count
- create a compact top session strip
- make timer the dominant focal point
- make current exercise visual + short instruction the second focal point
- keep next-up smaller and secondary
- keep Previous and Next always visible
- make Start / Pause / Resume the strongest center control
- move preferences behind a settings button
- implement compact bottom-sheet settings UI

Likely files:
- `new-app/src/features/player/WorkoutPlayerScreen.tsx`
- `new-app/src/app/styles.css`
- optional shared bottom-sheet/settings UI

Definition of done:
- timer dominates visually
- player feels cleaner and faster
- preferences no longer consume permanent screen space
- player tests cover the new control hierarchy and settings surface

---

## Phase 5: End-to-end polish

Goal:
Unify the feel of the full three-step experience.

Main tasks:
- tune spacing and typography rhythm
- align CTA hierarchy across screens
- remove remaining unnecessary helper copy
- polish motion for expand/collapse and state changes
- verify mobile flow from Build to Workout
- confirm accessibility behavior still holds

Likely files:
- `new-app/src/app/styles.css`
- all three feature screens as needed

Definition of done:
- the three-step flow feels coherent
- visual hierarchy is consistent
- the app feels faster and easier to scan end to end
- app-flow tests still pass across Build -> Check -> Workout

---

# 3. Best execution strategy

Recommended sequence:
1. Shared foundation
2. Build redesign
3. Check layout redesign
4. Check exercise expansion and swap
5. Workout redesign
6. End-to-end polish

Reasoning:
- start with reusable pieces
- fix the highest-friction entry screen first
- establish the review model before adding swap complexity
- redesign the player after the visual language is settled
- finish with one coherence pass instead of repeated ad hoc tweaking

---

# 4. Immediate next step

Start with Phase 0 and Phase 1:
- create or define shared visual primitives
- redesign the Build screen first

This gives the project the strongest UX improvement earliest and provides the design system direction for the following phases.
