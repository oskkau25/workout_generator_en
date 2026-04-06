/**
 * Generates new-app/src/data/exercises.json from the legacy exercise database.
 * Run once with: node new-app/scripts/generate-exercise-catalog.mjs
 */

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---- Import the legacy dataset ----
const { exercises: legacyExercises } = await import(
  resolve(__dirname, '../../src/js/core/exercise-database.js')
)

// ---- Adapter logic (ported from exercise-catalog.ts, types stripped) ----

const EQUIPMENT_MAP = {
  bodyweight: 'bodyweight',
  dumbbells: 'dumbbells',
  kettlebell: 'kettlebell',
  'trx bands': 'trx_bands',
  trx: 'trx_bands',
  'resistance band': 'resistance_band',
  'pull-up bar': 'pull_up_bar',
  'jump rope': 'jump_rope',
  rower: 'rower',
}

const MUSCLE_MAP = {
  'full body': 'full_body',
  chest: 'chest',
  back: 'back',
  legs: 'legs',
  arms: 'arms',
  shoulders: 'shoulders',
  core: 'core',
  mobility: 'mobility',
}

const LEVEL_MAP = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function normalizeEquipment(value) {
  const mapped = EQUIPMENT_MAP[String(value ?? 'bodyweight').trim().toLowerCase()]
  return mapped ? [mapped] : ['bodyweight']
}

function normalizeMuscle(value) {
  return MUSCLE_MAP[String(value ?? 'full body').trim().toLowerCase()] ?? 'full_body'
}

function normalizeLevels(value) {
  const raw = Array.isArray(value) ? value : [value ?? 'beginner']
  const mapped = raw
    .map((entry) => LEVEL_MAP[String(entry).trim().toLowerCase()])
    .filter(Boolean)
  return mapped.length > 0 ? mapped : ['beginner', 'intermediate', 'advanced']
}

function normalizePhase(type) {
  switch (String(type ?? 'main').trim().toLowerCase()) {
    case 'warmup': return ['warmup']
    case 'cooldown': return ['cooldown']
    default: return ['main']
  }
}

function normalizeText(value) {
  return value.trim().toLowerCase()
}

function createShortInstruction(description) {
  return description.split(/[.!?]/)[0]?.trim() || description.trim()
}

function extractSafetyNotes(description) {
  const matches = description.match(/⚠️\s*DO:(.*?)DON'T:(.*)$/i)
  if (!matches) return undefined
  return matches.slice(1).map((part) => part.trim()).filter(Boolean)
}

function inferMovementPattern(name, description, primaryMuscle, phaseTags) {
  const value = `${name} ${description}`.toLowerCase()
  if (phaseTags.includes('cooldown') || /stretch|mobility|cat-cow|child's pose|cobra|thread the needle|world's greatest/.test(value)) return 'mobility'
  if (/carry|march/.test(value)) return 'carry'
  if (/burpee|jump|hop|skater|rope|jack|mountain climber|high knees/.test(value)) return 'plyometric'
  if (/row|face pull|rear delt|pull-apart/.test(value)) return 'horizontal_pull'
  if (/pull-up|pull up|chin-up|chin up|lat pulldown|dead hang/.test(value)) return 'vertical_pull'
  if (/overhead press|shoulder press|pike push-up|pike push up|handstand/.test(value)) return 'vertical_push'
  if (/push-up|push up|bench press|chest press|dip|floor press/.test(value)) return 'horizontal_push'
  if (/deadlift|hinge|good morning|swing|romanian/.test(value)) return 'hinge'
  if (/lunge|split squat|step-up|step up|curtsy/.test(value)) return 'lunge'
  if (/squat|thruster|wall sit|sit-to-stand/.test(value)) return 'squat'
  if (/rotation|twist|woodchop|pallof/.test(value)) return 'core_rotation'
  if (/plank|dead bug|bear hold|bird dog|hollow hold|superman hold/.test(value)) return 'core_stability'
  if (/crunch|sit-up|sit up|leg raise|toe tap|v-up|v up/.test(value)) return 'core_flexion'
  if (/march|run|shuffle/.test(value)) return 'locomotion'
  if (primaryMuscle === 'mobility') return 'mobility'
  if (primaryMuscle === 'core') return 'core_stability'
  return 'locomotion'
}

function dedupe(items) {
  return Array.from(new Set(items))
}

function inferBodyMap(pattern, primaryMuscle, name) {
  const value = normalizeText(name)
  switch (pattern) {
    case 'horizontal_push': return { primary: ['chest', value.includes('pike') ? 'shoulders' : 'triceps'], secondary: ['shoulders', 'core'] }
    case 'vertical_push': return { primary: ['shoulders', 'triceps'], secondary: ['chest', 'core'] }
    case 'horizontal_pull': return { primary: ['upper_back', 'lats'], secondary: ['biceps', 'forearms', 'core'] }
    case 'vertical_pull': return { primary: ['lats', 'biceps'], secondary: ['upper_back', 'forearms', 'core'] }
    case 'hinge': return { primary: ['glutes', 'hamstrings'], secondary: ['lower_back', 'core'] }
    case 'squat': return { primary: ['quadriceps', 'glutes'], secondary: ['calves', 'core', 'adductors'] }
    case 'lunge': return { primary: ['quadriceps', 'glutes'], secondary: ['hamstrings', 'calves', 'core'] }
    case 'core_flexion': return { primary: ['core'], secondary: ['obliques', 'hip_flexors'] }
    case 'core_stability': return { primary: ['core', 'lower_back'], secondary: ['obliques', 'glutes', 'shoulders'] }
    case 'core_rotation': return { primary: ['obliques', 'core'], secondary: ['shoulders', 'glutes'] }
    case 'carry': return { primary: ['forearms', 'core'], secondary: ['shoulders', 'glutes', 'quadriceps'] }
    case 'plyometric': return { primary: ['quadriceps', 'calves'], secondary: ['glutes', 'core', 'shoulders'] }
    case 'mobility':
      if (value.includes('cat-cow') || value.includes('cobra')) return { primary: ['upper_back', 'lower_back'], secondary: ['core', 'hip_flexors'] }
      if (value.includes('hip')) return { primary: ['glutes', 'hip_flexors'], secondary: ['adductors', 'hamstrings'] }
      if (value.includes('shoulder')) return { primary: ['shoulders', 'upper_back'], secondary: ['chest', 'triceps'] }
      return { primary: ['core', 'glutes'], secondary: ['hamstrings', 'shoulders'] }
    default:
      if (primaryMuscle === 'chest') return { primary: ['chest'], secondary: ['triceps', 'shoulders'] }
      if (primaryMuscle === 'back') return { primary: ['upper_back', 'lats'], secondary: ['biceps'] }
      if (primaryMuscle === 'legs') return { primary: ['quadriceps', 'glutes'], secondary: ['hamstrings', 'calves'] }
      if (primaryMuscle === 'shoulders') return { primary: ['shoulders'], secondary: ['triceps', 'upper_back'] }
      if (primaryMuscle === 'arms') return { primary: ['biceps', 'triceps'], secondary: ['forearms', 'shoulders'] }
      if (primaryMuscle === 'core') return { primary: ['core'], secondary: ['obliques', 'lower_back'] }
      return { primary: ['core', 'quadriceps'], secondary: ['glutes', 'shoulders'] }
  }
}

function inferFocusTags(phaseTags, primaryMuscle, movementPattern, bodyMap) {
  return dedupe([...phaseTags, primaryMuscle, movementPattern, ...bodyMap.primary, ...bodyMap.secondary])
}

function normalizeSubstitutionTags(exercise, movementPattern, primaryMuscle) {
  return dedupe([
    ...(exercise.alternatives ?? []).map((item) => normalizeText(item)),
    movementPattern,
    primaryMuscle,
  ])
}

function createDefinition(exercise, index, prefix = 'legacy') {
  const phaseTags = normalizePhase(exercise.type)
  const primaryMuscle = normalizeMuscle(exercise.muscle)
  const movementPattern = inferMovementPattern(exercise.name, exercise.description, primaryMuscle, phaseTags)
  const bodyMap = inferBodyMap(movementPattern, primaryMuscle, exercise.name)

  return {
    id: `${prefix}-${index}-${slugify(exercise.name)}`,
    slug: slugify(exercise.name),
    name: exercise.name,
    phaseTags,
    primaryMuscle,
    secondaryMuscles: [],
    supportedEquipment: normalizeEquipment(exercise.equipment),
    supportedLevels: normalizeLevels(exercise.level),
    movementPattern,
    bodyMap,
    focusTags: inferFocusTags(phaseTags, primaryMuscle, movementPattern, bodyMap),
    coaching: {
      shortInstruction: createShortInstruction(exercise.description),
      fullInstruction: exercise.description,
      safetyNotes: extractSafetyNotes(exercise.description),
    },
    media: {
      videoSearchQuery: exercise.resources?.youtubeSearch,
    },
    substitutionTags: normalizeSubstitutionTags(exercise, movementPattern, primaryMuscle),
  }
}

const supplementalExercises = [
  { name: 'Glute Bridge', description: 'Lie on your back with knees bent and feet flat. Drive through your heels to lift hips until your body forms a straight line from shoulders to knees. Pause, squeeze glutes, and lower with control.', equipment: 'Bodyweight', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Legs', type: 'main', alternatives: ['Hip Bridge', 'Hip Thrust'], resources: { youtubeSearch: 'glute bridge exercise tutorial form' } },
  { name: 'Reverse Lunge', description: 'Step one foot back, lower into a split stance, then drive through the front foot to return to standing. Keep torso tall and move under control.', equipment: 'Bodyweight', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Legs', type: 'main', alternatives: ['Split Squat', 'Static Lunge'], resources: { youtubeSearch: 'reverse lunge exercise tutorial form' } },
  { name: 'Dead Bug', description: 'Lie on your back with arms up and knees bent to 90 degrees. Brace your core, extend opposite arm and leg, then return and switch sides without letting your lower back arch.', equipment: 'Bodyweight', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Core', type: 'main', alternatives: ['Bird Dog', 'Toe Taps'], resources: { youtubeSearch: 'dead bug core exercise tutorial form' } },
  { name: 'Side Plank', description: 'Stack your feet, support yourself on one forearm, and lift your hips so your body stays in a straight line. Keep ribs down and hold tension through the obliques.', equipment: 'Bodyweight', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Core', type: 'main', alternatives: ['Plank', 'Bear Hold'], resources: { youtubeSearch: 'side plank exercise tutorial form' } },
  { name: 'Pike Push-Up', description: 'Start in a pike position with hips high. Lower the head between the hands, then press back up while keeping the core tight.', equipment: 'Bodyweight', level: ['Intermediate', 'Advanced'], muscle: 'Shoulders', type: 'main', alternatives: ['Shoulder Tap Push-Up', 'Overhead Press'], resources: { youtubeSearch: 'pike push up exercise tutorial form' } },
  { name: 'Dumbbell Romanian Deadlift', description: 'Hold dumbbells by your sides, soften the knees, and hinge at the hips while keeping the spine long. Drive hips forward to stand tall and squeeze glutes.', equipment: 'Dumbbells', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Legs', type: 'main', alternatives: ['Dumbbell Deadlift', 'Kettlebell Deadlift'], resources: { youtubeSearch: 'dumbbell romanian deadlift tutorial form' } },
  { name: 'Dumbbell Overhead Press', description: 'Stand tall with dumbbells at shoulder height. Press overhead without arching the back, then lower under control.', equipment: 'Dumbbells', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Shoulders', type: 'main', alternatives: ['Arnold Press', 'Pike Push-Up'], resources: { youtubeSearch: 'dumbbell overhead press tutorial form' } },
  { name: 'Resistance Band Pallof Press', description: 'Stand sideways to the band anchor, hold the band at the chest, and press straight out without letting the torso rotate. Return slowly.', equipment: 'Resistance Band', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Core', type: 'main', alternatives: ['Woodchop', 'Torso Twists'], resources: { youtubeSearch: 'pallof press resistance band tutorial form' } },
  { name: 'Resistance Band Pull-Apart', description: 'Hold the band at shoulder height and pull it apart by driving the hands wide. Keep shoulders down and squeeze the upper back.', equipment: 'Resistance Band', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Back', type: 'main', alternatives: ['Face Pull', 'Band Row'], resources: { youtubeSearch: 'band pull apart tutorial form' } },
  { name: 'TRX Row', description: 'Lean back with straight arms, keep the body rigid, and pull the chest toward the handles. Lower with control.', equipment: 'TRX Bands', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Back', type: 'main', alternatives: ['Bodyweight Row', 'Resistance Band Row'], resources: { youtubeSearch: 'trx row tutorial form' } },
  { name: 'Kettlebell Deadlift', description: 'Set the kettlebell between your feet, hinge at the hips, grab the handle, and stand up by pushing the floor away. Lower with a controlled hinge.', equipment: 'Kettlebell', level: ['Beginner', 'Intermediate', 'Advanced'], muscle: 'Legs', type: 'main', alternatives: ['Kettlebell Swing', 'Dumbbell Romanian Deadlift'], resources: { youtubeSearch: 'kettlebell deadlift tutorial form' } },
  { name: 'Hanging Knee Raise', description: 'Hang from the bar with ribs down. Lift knees toward the chest without swinging, pause briefly, then lower slowly.', equipment: 'Pull-Up Bar', level: ['Intermediate', 'Advanced'], muscle: 'Core', type: 'main', alternatives: ['Leg Raises', 'Dead Bug'], resources: { youtubeSearch: 'hanging knee raise tutorial form' } },
]

function dedupeByName(catalog) {
  const seen = new Set()
  return catalog.filter((exercise) => {
    const key = normalizeText(exercise.name)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ---- Generate and write JSON ----

const legacyCatalog = legacyExercises.map((exercise, index) => createDefinition(exercise, index, 'legacy'))
const supplementalCatalog = supplementalExercises.map((exercise, index) => createDefinition(exercise, index, 'supplemental'))
const catalog = dedupeByName([...legacyCatalog, ...supplementalCatalog])

const outputPath = resolve(__dirname, '../src/data/exercises.json')
writeFileSync(outputPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8')

console.log(`Generated ${catalog.length} exercises → ${outputPath}`)
