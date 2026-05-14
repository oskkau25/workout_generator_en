# Three-Step UX Redesign Spec

Date: 2026-03-31

Status:
- Direction locked with product feedback
- Ready to guide implementation

Scope:
- `new-app/src/features/builder/BuilderScreen.tsx`
- `new-app/src/features/workout-summary/WorkoutSummaryScreen.tsx`
- `new-app/src/features/player/WorkoutPlayerScreen.tsx`
- `new-app/src/app/styles.css`

Purpose:
Define the exact redesign direction for the React app around three product steps:
1. Build
2. Check
3. Workout

This is the working UX spec for the next implementation pass. It replaces the earlier, more exploratory redesign notes with a tighter direction based on locked product choices.

---

# 1. Product framing

## Core principle
The app should no longer feel like a long workout settings form.

It should feel like:
- Build = choose
- Check = confirm
- Workout = execute

## Problems the redesign is solving
- Too much scrolling before action
- Too much explanatory text
- Too many same-weight cards
- Selection states are too text-driven
- Actions appear too early or too loudly
- The workout flow feels like reading a dashboard rather than moving through a guided fitness experience

## Global UX rules
- Prefer visuals over paragraphs
- Prefer tiles, chips, and symbols over text lists
- Keep one clear primary action per step
- Put detailed or optional content behind progressive disclosure
- Use silhouettes first, not photo assets
- Keep practical screens practical, especially Check and Workout

---

# 2. Shared visual system direction

## Overall visual tone
- sporty
- playful in Build
- practical in Check
- minimal and performance-focused in Workout

## Illustration strategy
Use silhouettes and simple illustrations first.

Phase 1 asset approach:
- goal icons / silhouettes
- format symbols or mini-diagrams
- equipment silhouettes
- exercise silhouettes in Check and Workout

Do not block layout work on a final illustration system.

## Information hierarchy
- primary decisions and actions should dominate
- helper text should be short and sparse
- metadata should be compressed
- avoid giving every section the same visual weight

## Interaction rules
- selected states must be obvious from shape, color, and emphasis
- collapsed states should keep pages short
- expanded states should reveal just enough more detail to support confident action

## Testing expectation
Every redesign phase should update automated tests alongside the UI changes.

Minimum expectation:
- feature-level interaction coverage for changed screens
- route/app-flow coverage still passing
- `new-app` lint, test, and build all green

---

# 3. Step 1: Build

## Product goal
Help the user create a workout quickly through visual choices on a single continuous page.

## Locked direction
- one-page flow
- clean continuous page, not a wizard
- sporty/playful look
- top copy should be very short: 1 sentence only
- advanced settings remain on-page, collapsed by default
- CTA appears only at the end
- no sticky summary
- Build uses goal/format/equipment illustrations or silhouettes

## Required selection order
1. Goal
2. Duration
3. Format
4. Equipment
5. More options
6. Generate

## Build page structure

### A. Top progress strip
Show the full three-step product flow at the top:
- Build
- Check
- Workout

Rules:
- Build is active
- Check and Workout are visible but muted
- keep compact
- not decorative only; it should help the user feel progress through the product

### B. Short hero
Keep a short title and only one sentence of support copy.

Rules:
- no long framing text
- no marketing block
- no large intro card

### C. Goal selection
Use illustrated choice tiles for workout goal.

Required values:
- Full body
- Upper body
- Lower body
- Core
- Conditioning
- Mobility

Rules:
- tile-first UI
- short labels
- optional one-line support text only if necessary
- selected state must be visually strong

### D. Duration selection
Use compact segmented controls or strong chips for:
- 15
- 20
- 30
- 45
- 60

Rules:
- duration should be very fast to change
- no explanatory text block needed

### E. Format selection
Use visual format tiles with mini-diagrams or symbolic cues.

Required values:
- Standard
- Circuit
- Tabata
- Pyramid

Rules:
- each format must be recognizable visually
- format should not depend on reading a paragraph
- only one short support line per option at most

### F. Equipment selection
Use illustrated multi-select equipment tiles.

Required values:
- Bodyweight
- Dumbbells
- Kettlebell
- TRX bands
- Resistance band
- Pull-up bar
- Jump rope
- Rower

Rules:
- clearly multi-select
- selection state highly visible
- bodyweight fallback behavior still exists in normalization
- UI should not over-explain fallback

### G. More options
Keep advanced settings on the page, but collapsed by default.

Rules:
- collapsed label should feel lightweight, e.g. `More options`
- when expanded, show only useful advanced controls
- keep density tighter than current implementation
- this section must not dominate the page

### H. End-of-page generate area
The generate action should only appear at the end.

Rules:
- no sticky CTA
- no large summary card
- CTA area should be compact
- allow a very small one-line recap if needed, but not a full summary block

## Build implementation implications
- simplify or remove the current live summary card
- reduce helper copy across builder sections
- replace text-heavy options with illustrated tiles
- keep the screen as a continuous flow with tighter spacing

## Build testing implications
Add dedicated feature tests for:
- progress strip
- visual selection state changes
- collapsed advanced settings
- end-of-page generate CTA behavior

---

# 4. Step 2: Check

## Product goal
Help the user understand the workout structure quickly and inspect or swap individual exercises only when needed.

## Locked direction
- practical tone
- vertical journey layout
- all sections visible, collapsed by default
- user expands exercises for more detail
- expanded exercises reveal detail and swap action
- exercise swap happens instantly with one tap
- each tap chooses an automatically selected alternative
- swapped exercises show a small `Swapped` badge
- no full regenerate action
- focus on structure and exercises only
- action area appears at the end

## Check page structure

### A. Step framing
Keep the 3-step context visible in some compact form:
- Build
- Check
- Workout

Rules:
- Check is active
- Build is complete or available
- Workout is upcoming

### B. Top recap
Show a concise recap:
- title
- duration
- format
- intensity

Rules:
- practical, not salesy
- avoid a dense metadata dashboard
- recap exists to orient the user before the journey begins

### C. Journey layout
The core of the screen should be a vertical timeline.

Main timeline stops:
- Warm-up
- Main block
- Cool-down

Rules:
- this should communicate sequence clearly
- sections should feel like parts of one workout journey, not separate disconnected cards

### D. Section behavior
All sections should appear, but collapsed by default.

Collapsed section should show:
- section name
- item count
- high-level timing or summary if available

Expanded section should show:
- exercise cards in order

### E. Exercise card behavior
Exercise cards should be practical and scannable.

Collapsed exercise state:
- exercise name
- timing or role hint
- silhouette or small symbol if available

Expanded exercise state:
- exercise silhouette / illustration
- short explanation of what the movement is about
- possibly target area / equipment / timing
- `Switch exercise` action

Rules:
- switch action exists only when the exercise is expanded
- exercise detail exists to create clarity first
- switching is secondary, but immediate once chosen

### F. Swapping behavior
When the user taps `Switch exercise`:
- replace that exercise immediately
- choose one automatically selected valid alternative
- mark the result with a `Swapped` badge

Rules:
- do not ask the user to regenerate the whole workout
- do not open a complex modal flow for swapping in v1

### G. End-of-page action area
Footer actions should appear only after the user has reviewed the structure.

Primary action:
- Start workout

Secondary action:
- Edit settings

Rules:
- no regenerate CTA
- actions should feel like the end of the review flow

## Check implementation implications
- de-emphasize or remove heavy metadata/sidebar patterns
- restructure sections around a journey/timeline model
- add local UI state for exercise expansion
- introduce per-exercise swap behavior
- introduce `Swapped` badge UI treatment

## Check testing implications
Add dedicated feature tests for:
- collapsed-by-default sections
- exercise expansion
- instant exercise switching
- `Swapped` badge rendering
- footer action availability

---

# 5. Step 3: Workout

## Product goal
Guide the workout with minimum distraction and maximum clarity.

## Locked direction
- minimal and performance-focused
- timer is visually dominant
- current exercise visual + short instruction are second in hierarchy
- exercise visuals should be silhouettes first
- Start / Pause / Resume is the strongest control
- Next and Previous are always visible but secondary
- settings move behind one settings button
- settings open in a compact bottom sheet
- keep instruction short in the main view

## Workout page structure

### A. Top session strip
Keep a compact header with:
- workout title
- format
- step count or progress hint
- exit action
- settings button

Rules:
- compact
- not a large content block
- no large preference controls in the main layout

### B. Timer hero
The timer is the dominant UI element.

Required content:
- current phase
- remaining time
- optional phase-total context

Rules:
- largest typography on the screen
- strong visual state differences between Ready / Work / Rest / Paused
- immediate legibility is critical

### C. Current exercise block
This is the second-most important area.

Required content:
- exercise silhouette
- exercise name
- short main instruction
- useful context such as block label or timing where needed

Rules:
- instruction should be short in the main state
- do not overload this area with too much text

### D. Next-up area
Keep next-up visible, but smaller and quieter.

Rules:
- should not compete with current exercise
- should help reduce surprise
- can collapse further near the end of the workout

### E. Persistent controls
Controls should stay obvious.

Required controls:
- Previous
- Start / Pause / Resume
- Next

Rules:
- center control is strongest
- Previous and Next always remain visible
- controls must be thumb-friendly

### F. Settings
Preferences move out of the main player view.

Settings entry:
- one settings button in the header or near controls

Settings surface:
- compact bottom sheet

Settings content:
- sound cues
- vibration
- voice countdown

Rules:
- preferences should not permanently occupy workout screen space

## Workout implementation implications
- reduce visible module count significantly
- remove full preferences card from primary layout
- compress progress and metadata into smaller surfaces
- make timer hero the main focal point
- keep next-up and progress present but visually secondary

## Workout testing implications
Expand player tests to cover:
- stronger center control behavior
- persistent Previous / Next controls
- settings button and bottom-sheet behavior
- removal of permanent preference controls from the main layout

---

# 6. Recommended implementation order

## Phase 1
Implement Build redesign
- compact header + progress strip
- visual goal/format/equipment selectors
- reduced copy
- collapsed more-options area
- compact end CTA

## Phase 2
Implement Check redesign
- vertical journey structure
- collapsed sections by default
- expandable exercise cards
- instant per-exercise swap
- swapped badge
- footer actions

## Phase 3
Implement Workout redesign
- timer-led layout
- exercise silhouette block
- secondary next-up module
- persistent controls
- bottom-sheet settings

---

# 7. Success criteria

The redesign is successful if:
- the builder feels quick instead of long
- the user can scan most choices visually
- the review page feels like a workout journey, not a settings report
- users can swap individual exercises without friction
- the player feels focused and coach-like
- text volume is reduced significantly
- scrolling is reduced or feels purposeful
