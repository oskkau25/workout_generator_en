/**
 * Visual Enhancements Module
 * Provides exercise demonstration videos, 3D models, and interactive guides
 *
 * Features:
 * - Exercise demonstration videos
 * - 3D exercise models
 * - Interactive exercise guides
 * - Form technique tips
 * - Muscle group visualizations
 */

console.log('🎬 VISUAL-ENHANCEMENTS.JS LOADED - v1');

// Visual enhancement state management
const visualEnhancementState = {
  showVideos: true,
  quality: 'medium', // low, medium, high
};

const FLOATING_PANEL_Z_INDEX = '80';
const FLOATING_MODAL_Z_INDEX = '90';
const COMPACT_WORKOUT_VIEWPORT_QUERY =
  '(max-width: 768px), (hover: none) and (pointer: coarse) and (orientation: landscape) and (max-height: 430px)';

let visualControlsFocusReturnTarget = null;
let videoModalFocusReturnTarget = null;
let instructionModalFocusReturnTarget = null;

function isCompactWorkoutViewport() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(COMPACT_WORKOUT_VIEWPORT_QUERY).matches
  );
}

// Smart video system with fallback videos
const VIDEO_SYSTEM = {
  // High-quality fallback videos for common exercises
  fallbackVideos: {
    'push-ups': 'Eh00_rniF8E', // FitnessBlender - Push Up Form
    squats: 'Dy28eq2PjcM', // FitnessBlender - Squat Form
    plank: 'pSHjTRCQxIw', // FitnessBlender - Plank Form
    lunges: '3XDriUnwlud4', // FitnessBlender - Lunge Form
    burpees: 'TU8QYVW0gDU', // FitnessBlender - Burpee Form
    'mountain-climbers': 'nmwgirgXLYM', // FitnessBlender - Mountain Climber
    'jumping-jacks': 'iSSAk4XCsRA', // FitnessBlender - Jumping Jacks
    'high-knees': 'oDdkytliOqE', // FitnessBlender - High Knees
    'butt-kicks': 'qlvvE7cHEaI', // FitnessBlender - Butt Kicks
    'wall-sit': 'y-wV4Venusw', // FitnessBlender - Wall Sit
    'tricep-dips': '6kALZikXxLc', // FitnessBlender - Tricep Dips
    'russian-twists': 'wkD8rjkodUI', // FitnessBlender - Russian Twists
    'bicycle-crunches': 'Iwyvozckjak', // FitnessBlender - Bicycle Crunches
    'leg-raises': 'JB2oyawG9KI', // FitnessBlender - Leg Raises
    'flutter-kicks': 'AnYl6Nk9GOA', // FitnessBlender - Flutter Kicks
    bridge: 'r4z_6zX7Qbs', // FitnessBlender - Bridge
    'calf-raises': 'yM2V0dW0cY0', // FitnessBlender - Calf Raises
    'arm-circles': 'Eh00_rniF8E', // FitnessBlender - Arm Circles (using push-up video)
    'shoulder-rolls': 'Eh00_rniF8E', // FitnessBlender - Shoulder Rolls (using push-up video)
    'toe-touches': 'Dy28eq2PjcM', // FitnessBlender - Toe Touches (using squat video)
    windmills: 'Dy28eq2PjcM', // FitnessBlender - Windmills (using squat video)
    'cat-cow': 'pSHjTRCQxIw', // FitnessBlender - Cat Cow (using plank video)
    'child-pose': 'pSHjTRCQxIw', // FitnessBlender - Child Pose (using plank video)
    'downward-dog': 'pSHjTRCQxIw', // FitnessBlender - Downward Dog (using plank video)
    'breathing-exercise': 'Eh00_rniF8E', // FitnessBlender - Breathing (using push-up video)
    meditation: 'Eh00_rniF8E', // FitnessBlender - Meditation (using push-up video)
    relaxation: 'Eh00_rniF8E', // FitnessBlender - Relaxation (using push-up video)
    'hip-circles': 'Dy28eq2PjcM', // FitnessBlender - Hip Circles (using squat video)
    'knee-circles': 'Dy28eq2PjcM', // FitnessBlender - Knee Circles (using squat video)
    'ankle-circles': 'Dy28eq2PjcM', // FitnessBlender - Ankle Circles (using squat video)
    'wrist-circles': 'Eh00_rniF8E', // FitnessBlender - Wrist Circles (using push-up video)
    'neck-rolls': 'Eh00_rniF8E', // FitnessBlender - Neck Rolls (using push-up video)
    'trunk-twists': 'Dy28eq2PjcM', // FitnessBlender - Trunk Twists (using squat video)
    'side-bends': 'Dy28eq2PjcM', // FitnessBlender - Side Bends (using squat video)
    'forward-bends': 'Dy28eq2PjcM', // FitnessBlender - Forward Bends (using squat video)
    'back-bends': 'Dy28eq2PjcM', // FitnessBlender - Back Bends (using squat video)
    'torso-twists': 'Dy28eq2PjcM', // FitnessBlender - Torso Twists (using squat video)
    'pike-push-ups': 'Eh00_rniF8E', // FitnessBlender - Pike Push Ups
    'diamond-push-ups': 'Eh00_rniF8E', // FitnessBlender - Diamond Push Ups
    'wide-push-ups': 'Eh00_rniF8E', // FitnessBlender - Wide Push Ups
    'incline-push-ups': 'Eh00_rniF8E', // FitnessBlender - Incline Push Ups
    'decline-push-ups': 'Eh00_rniF8E', // FitnessBlender - Decline Push Ups
    'single-leg-squats': 'Dy28eq2PjcM', // FitnessBlender - Single Leg Squats
    'jump-squats': 'Dy28eq2PjcM', // FitnessBlender - Jump Squats
    'sumo-squats': 'Dy28eq2PjcM', // FitnessBlender - Sumo Squats
    'side-lunges': '3XDriUnwlud4', // FitnessBlender - Side Lunges
    'reverse-lunges': '3XDriUnwlud4', // FitnessBlender - Reverse Lunges
    'walking-lunges': '3XDriUnwlud4', // FitnessBlender - Walking Lunges
    'side-plank': 'pSHjTRCQxIw', // FitnessBlender - Side Plank
    'reverse-plank': 'pSHjTRCQxIw', // FitnessBlender - Reverse Plank
    'bear-crawl': 'nmwgirgXLYM', // FitnessBlender - Bear Crawl
    'crab-walk': 'nmwgirgXLYM', // FitnessBlender - Crab Walk
    'spider-man-plank': 'pSHjTRCQxIw', // FitnessBlender - Spider Man Plank
    'plank-jacks': 'iSSAk4XCsRA', // FitnessBlender - Plank Jacks
    'scissor-kicks': 'AnYl6Nk9GOA', // FitnessBlender - Scissor Kicks
    'dead-bug': 'JB2oyawG9KI', // FitnessBlender - Dead Bug
    'bird-dog': 'JB2oyawG9KI', // FitnessBlender - Bird Dog
    superman: 'r4z_6zX7Qbs', // FitnessBlender - Superman
    'single-leg-bridge': 'r4z_6zX7Qbs', // FitnessBlender - Single Leg Bridge
    'wall-push-ups': 'Eh00_rniF8E', // FitnessBlender - Wall Push Ups
    'chair-dips': '6kALZikXxLc', // FitnessBlender - Chair Dips
    'step-ups': 'Dy28eq2PjcM', // FitnessBlender - Step Ups
    'box-jumps': 'TU8QYVW0gDU', // FitnessBlender - Box Jumps
    'tuck-jumps': 'TU8QYVW0gDU', // FitnessBlender - Tuck Jumps
    'star-jumps': 'iSSAk4XCsRA', // FitnessBlender - Star Jumps
    'seal-jacks': 'iSSAk4XCsRA', // FitnessBlender - Seal Jacks
    'torso-twists': 'Dy28eq2PjcM', // FitnessBlender - Torso Twists (using squat video)
    'bodyweight-squats': 'Dy28eq2PjcM', // FitnessBlender - Bodyweight Squats
    'standard-push-ups': 'Eh00_rniF8E', // FitnessBlender - Standard Push Ups
    'regular-push-ups': 'Eh00_rniF8E', // FitnessBlender - Regular Push Ups
    'basic-squats': 'Dy28eq2PjcM', // FitnessBlender - Basic Squats
    'standard-plank': 'pSHjTRCQxIw', // FitnessBlender - Standard Plank
    'basic-plank': 'pSHjTRCQxIw', // FitnessBlender - Basic Plank
    'hip-openers-(lunge-+-circle)': 'YaXPRqUwItQ', // FitnessBlender - Hip Openers
    'hip-openers': 'YaXPRqUwItQ', // FitnessBlender - Hip Openers
  },

  // Search terms for dynamic video finding
  searchTerms: {
    'push-ups': ['push ups form', 'pushup technique', 'push up exercise'],
    squats: ['squat form', 'bodyweight squat', 'squat technique'],
    plank: ['plank form', 'plank exercise', 'plank technique'],
    lunges: ['lunge form', 'lunges exercise', 'lunge technique'],
    burpees: ['burpee form', 'burpees exercise', 'burpee technique'],
    'mountain-climbers': ['mountain climbers', 'mountain climber exercise'],
    'jumping-jacks': ['jumping jacks', 'jumping jack exercise'],
    'high-knees': ['high knees', 'high knee exercise'],
    'butt-kicks': ['butt kicks', 'butt kick exercise'],
    'wall-sit': ['wall sit', 'wall sit exercise'],
    'tricep-dips': ['tricep dips', 'tricep dip form'],
    'russian-twists': ['russian twist', 'russian twists'],
    'bicycle-crunches': ['bicycle crunch', 'bicycle crunches'],
    'leg-raises': ['leg raise', 'leg raises'],
    'flutter-kicks': ['flutter kick', 'flutter kicks'],
    bridge: ['bridge exercise', 'glute bridge'],
    'calf-raises': ['calf raise', 'calf raises'],
    'arm-circles': ['arm circle', 'arm circles'],
    'shoulder-rolls': ['shoulder roll', 'shoulder rolls'],
    'toe-touches': ['toe touch', 'toe touches'],
    windmills: ['windmill', 'windmills'],
    'cat-cow': ['cat cow', 'cat cow stretch'],
    'child-pose': ['child pose', 'childs pose'],
    'downward-dog': ['downward dog', 'down dog'],
    'breathing-exercise': ['breathing exercise', 'breath work'],
    meditation: ['meditation', 'mindfulness'],
    relaxation: ['relaxation', 'relaxation exercise'],
  },
};

const DEFAULT_VIDEO_ID = 'YaXPRqUwItQ';

const VIDEO_FALLBACK_ALIASES = {
  'ankle-rotations': 'ankle-circles',
  'childs-pose': 'child-pose',
  'glute-bridges': 'bridge',
  'glute-bridges-warm-up': 'bridge',
  'hip-openers-lunge-circle': 'hip-openers',
  'plank-to-downward-dog': 'downward-dog',
  'seated-forward-fold': 'forward-bends',
  'seated-spinal-twist': 'torso-twists',
  'single-leg-glute-bridge': 'single-leg-bridge',
  'standing-forward-fold': 'forward-bends',
  'supine-twist': 'torso-twists',
};

const VIDEO_KEYWORD_MATCHERS = [
  { pattern: /\bdiamond push ?ups?\b/, key: 'diamond-push-ups' },
  { pattern: /\bpike push ?ups?\b/, key: 'pike-push-ups' },
  { pattern: /\bwide push ?ups?\b/, key: 'wide-push-ups' },
  { pattern: /\bincline push ?ups?\b/, key: 'incline-push-ups' },
  { pattern: /\bdecline push ?ups?\b/, key: 'decline-push-ups' },
  { pattern: /\bwall push ?ups?\b/, key: 'wall-push-ups' },
  { pattern: /\bchair dips?\b/, key: 'chair-dips' },
  { pattern: /\btricep dips?\b/, key: 'tricep-dips' },
  { pattern: /\bpush ?ups?\b|\bchest press\b/, key: 'push-ups' },
  { pattern: /\bjump squats?\b/, key: 'jump-squats' },
  { pattern: /\bsumo squats?\b/, key: 'sumo-squats' },
  { pattern: /\bbodyweight squats?\b/, key: 'bodyweight-squats' },
  { pattern: /\bsingle leg squats?\b/, key: 'single-leg-squats' },
  { pattern: /\bsquats?\b/, key: 'squats' },
  { pattern: /\bwalking lunges?\b/, key: 'walking-lunges' },
  { pattern: /\breverse lunges?\b/, key: 'reverse-lunges' },
  { pattern: /\bside lunges?\b/, key: 'side-lunges' },
  { pattern: /\blunges?\b|\bsplit squats?\b/, key: 'lunges' },
  { pattern: /\bside plank\b/, key: 'side-plank' },
  { pattern: /\breverse plank\b/, key: 'reverse-plank' },
  { pattern: /\bspider ?man plank\b/, key: 'spider-man-plank' },
  { pattern: /\bplank jacks?\b/, key: 'plank-jacks' },
  { pattern: /\bplank to downward dog\b/, key: 'downward-dog' },
  { pattern: /\bplank\b|\bshoulder taps?\b|\bhollow body hold\b/, key: 'plank' },
  { pattern: /\bburpees?\b/, key: 'burpees' },
  { pattern: /\bmountain climbers?\b/, key: 'mountain-climbers' },
  { pattern: /\bbear crawl\b/, key: 'bear-crawl' },
  { pattern: /\bcrab walk\b/, key: 'crab-walk' },
  { pattern: /\bjumping jacks?\b/, key: 'jumping-jacks' },
  { pattern: /\bseal jacks?\b/, key: 'seal-jacks' },
  { pattern: /\bstar jumps?\b/, key: 'star-jumps' },
  { pattern: /\btuck jumps?\b/, key: 'tuck-jumps' },
  { pattern: /\bbox jumps?\b/, key: 'box-jumps' },
  { pattern: /\bhigh knees?\b/, key: 'high-knees' },
  { pattern: /\bbutt kicks?\b/, key: 'butt-kicks' },
  { pattern: /\brussian twists?\b/, key: 'russian-twists' },
  { pattern: /\bbicycle crunch(es)?\b/, key: 'bicycle-crunches' },
  { pattern: /\bleg raises?\b/, key: 'leg-raises' },
  { pattern: /\bflutter kicks?\b/, key: 'flutter-kicks' },
  { pattern: /\bscissor kicks?\b/, key: 'scissor-kicks' },
  { pattern: /\bdead bug\b/, key: 'dead-bug' },
  { pattern: /\bbird dog\b/, key: 'bird-dog' },
  { pattern: /\bsuperman\b/, key: 'superman' },
  { pattern: /\bsingle leg glute bridge\b/, key: 'single-leg-bridge' },
  { pattern: /\bglute bridge(s)?\b|\bbridge\b/, key: 'bridge' },
  { pattern: /\bwall sit\b/, key: 'wall-sit' },
  { pattern: /\bstep ups?\b/, key: 'step-ups' },
  { pattern: /\bcalf raises?\b/, key: 'calf-raises' },
  { pattern: /\barm circles?\b/, key: 'arm-circles' },
  { pattern: /\bshoulder rolls?\b/, key: 'shoulder-rolls' },
  { pattern: /\btoe touches?\b/, key: 'toe-touches' },
  { pattern: /\bwindmills?\b/, key: 'windmills' },
  { pattern: /\bcat cow\b/, key: 'cat-cow' },
  { pattern: /\bchild(?:s|ren)? pose\b/, key: 'child-pose' },
  { pattern: /\bdownward dog\b/, key: 'downward-dog' },
  { pattern: /\bhip circles?\b|\bhip openers?\b/, key: 'hip-openers' },
  { pattern: /\bankle circles?\b|\bankle rotations?\b/, key: 'ankle-circles' },
  { pattern: /\bwrist circles?\b/, key: 'wrist-circles' },
  { pattern: /\bneck rolls?\b/, key: 'neck-rolls' },
  { pattern: /\btorso twists?\b|\bspinal twists?\b|\bsupine twists?\b/, key: 'torso-twists' },
  { pattern: /\bforward bends?\b|\bforward fold\b/, key: 'forward-bends' },
  { pattern: /\bside bends?\b/, key: 'side-bends' },
  { pattern: /\bback bends?\b/, key: 'back-bends' },
];

function normalizeExerciseLookupValue(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/\(([^)]*)\)/g, ' $1 ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugifyExerciseLookupValue(value) {
  const normalized = normalizeExerciseLookupValue(value);
  return normalized ? normalized.replace(/\s+/g, '-') : '';
}

function resolveFallbackVideoKey(exerciseInput) {
  const descriptor =
    typeof exerciseInput === 'string' ? { name: exerciseInput } : exerciseInput || {};
  const primaryLookupValues = [descriptor.name]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  for (const value of primaryLookupValues) {
    const directSlug = value.toLowerCase().trim().replace(/\s+/g, '-');
    if (VIDEO_SYSTEM.fallbackVideos[directSlug]) {
      return directSlug;
    }

    const normalizedSlug = slugifyExerciseLookupValue(value);
    if (!normalizedSlug) continue;

    if (VIDEO_SYSTEM.fallbackVideos[normalizedSlug]) {
      return normalizedSlug;
    }

    const aliasKey = VIDEO_FALLBACK_ALIASES[normalizedSlug];
    if (aliasKey && VIDEO_SYSTEM.fallbackVideos[aliasKey]) {
      return aliasKey;
    }
  }

  // Only use fuzzy keyword matching on the actual exercise name.
  // Search metadata and alternatives are too broad and can produce unrelated embeds.
  for (const value of primaryLookupValues) {
    const normalized = normalizeExerciseLookupValue(value);
    if (!normalized) continue;

    for (const matcher of VIDEO_KEYWORD_MATCHERS) {
      if (matcher.pattern.test(normalized) && VIDEO_SYSTEM.fallbackVideos[matcher.key]) {
        return matcher.key;
      }
    }
  }

  return null;
}

export function getExerciseVideoId(exerciseInput) {
  const key = resolveFallbackVideoKey(exerciseInput);
  return key ? VIDEO_SYSTEM.fallbackVideos[key] || null : null;
}

export function getExerciseVideoSearchQuery(exerciseInput) {
  const descriptor =
    typeof exerciseInput === 'string' ? { name: exerciseInput } : exerciseInput || {};
  const searchQuery =
    descriptor.resources?.youtubeSearch ||
    descriptor.resources?.googleSearch ||
    (descriptor.name ? `${descriptor.name} exercise tutorial` : '');

  return String(searchQuery || '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getGenericExerciseVideoId() {
  return DEFAULT_VIDEO_ID;
}

/**
 * Initialize visual enhancements
 */
export function initializeVisualEnhancements() {
  console.log('🎬 Initializing visual enhancements...');

  // Load saved preferences
  loadVisualPreferences();

  // Setup visual enhancement controls
  setupVisualControls();

  // Enhance existing exercise cards
  enhanceExerciseCards();

  // Setup video modal
  setupVideoModal();

  // Setup instruction & safety modal
  setupInstructionSafetyModal();

  console.log('✅ Visual enhancements initialized');
}

/**
 * Load visual preferences from localStorage
 */
function loadVisualPreferences() {
  try {
    const saved = localStorage.getItem('fitflow_visual_preferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      if (typeof preferences.showVideos === 'boolean') {
        visualEnhancementState.showVideos = preferences.showVideos;
      }
      if (typeof preferences.quality === 'string') {
        visualEnhancementState.quality = preferences.quality;
      }
      console.log('🎬 Loaded visual preferences:', preferences);
    }
  } catch (error) {
    console.warn('Failed to load visual preferences:', error);
  }
}

/**
 * Save visual preferences to localStorage
 */
function saveVisualPreferences() {
  try {
    const payload = {
      showVideos: visualEnhancementState.showVideos,
      quality: visualEnhancementState.quality,
    };
    localStorage.setItem('fitflow_visual_preferences', JSON.stringify(payload));
    console.log('🎬 Saved visual preferences:', visualEnhancementState);
  } catch (error) {
    console.warn('Failed to save visual preferences:', error);
  }
}

/**
 * Setup visual enhancement controls
 */
function setupVisualControls() {
  // Create visual controls panel
  createVisualControlsPanel();

  // Setup visual enhancement button
  setupVisualEnhancementButton();

  // Setup action buttons
  setupVisualActionButtons();
}

/**
 * Setup visual enhancement button
 */
function setupVisualEnhancementButton() {
  const visualBtn = document.getElementById('visual-enhancement-btn');
  if (visualBtn) {
    visualBtn.setAttribute('aria-controls', 'visual-controls-panel');
    visualBtn.setAttribute('aria-expanded', 'false');
    visualBtn.setAttribute('aria-haspopup', 'dialog');
    visualBtn.addEventListener('click', toggleVisualControlsPanel);
    console.log('🎬 Visual enhancement button event listener added');
  } else {
    console.warn('🎬 Visual enhancement button not found');
  }
}

/**
 * Toggle visual controls panel visibility
 */
function toggleVisualControlsPanel() {
  const panel = document.getElementById('visual-controls-panel');
  if (panel) {
    if (panel.classList.contains('hidden')) {
      showVisualControlsPanel();
    } else {
      hideVisualControlsPanel();
    }
    console.log('🎬 Visual controls panel toggled');
  } else {
    console.warn('🎬 Visual controls panel not found');
  }
}

/**
 * Create visual controls panel
 */
function createVisualControlsPanel() {
  // Check if panel already exists
  if (document.getElementById('visual-controls-panel')) return;

  const panel = document.createElement('div');
  panel.id = 'visual-controls-panel';
  panel.className = 'visual-controls-panel hidden';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-labelledby', 'visual-controls-title');
  panel.setAttribute('tabindex', '-1');
  panel.innerHTML = `
        <div class="visual-controls-content">
            <div class="visual-controls-header">
                <h3 id="visual-controls-title" class="visual-controls-title">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Visual Enhancements
                </h3>
                <button id="close-visual-controls" class="visual-controls-close-btn" aria-label="Close visual controls">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="visual-controls-options">
                <button id="toggle-video-visibility" type="button" class="visual-controls-action">
                    <div class="visual-controls-action-header">
                        <span class="visual-controls-action-title">Videos</span>
                        <span id="video-toggle-state" class="visual-controls-action-pill"></span>
                    </div>
                    <p class="visual-controls-action-description">Show or hide exercise demonstration videos and previews.</p>
                </button>

                <button id="open-instruction-safety" type="button" class="visual-controls-action visual-controls-action--secondary">
                    <div class="visual-controls-action-header">
                        <span class="visual-controls-action-title">Instructions &amp; Safety</span>
                    </div>
                    <p class="visual-controls-action-description">Open a focused view of form cues and safety tips for the current exercise.</p>
                </button>
            </div>
        </div>
    `;

  // Add to body
  document.body.appendChild(panel);

  // Setup close button
  const closeBtn = document.getElementById('close-visual-controls');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideVisualControlsPanel);
  }

  panel.style.zIndex = FLOATING_PANEL_Z_INDEX;
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideVisualControlsPanel();
    }
  });
}

/**
 * Setup action buttons for visual controls
 */
function setupVisualActionButtons() {
  const videoToggleButton = document.getElementById('toggle-video-visibility');
  if (videoToggleButton && videoToggleButton.dataset.bound !== 'true') {
    videoToggleButton.addEventListener('click', () => {
      visualEnhancementState.showVideos = !visualEnhancementState.showVideos;
      saveVisualPreferences();
      applyVisualSettings();
      updateVideoToggleButtonUI();
      announceVisualChange('Videos', visualEnhancementState.showVideos ? 'enabled' : 'disabled');
    });
    videoToggleButton.dataset.bound = 'true';
  }

  const instructionButton = document.getElementById('open-instruction-safety');
  if (instructionButton && instructionButton.dataset.bound !== 'true') {
    instructionButton.addEventListener('click', showInstructionSafetyModal);
    instructionButton.dataset.bound = 'true';
  }

  updateVideoToggleButtonUI();
}

function updateVideoToggleButtonUI() {
  const videoToggleButton = document.getElementById('toggle-video-visibility');
  const statePill = document.getElementById('video-toggle-state');
  if (!videoToggleButton || !statePill) return;

  const isOn = !!visualEnhancementState.showVideos;
  videoToggleButton.setAttribute('aria-pressed', String(isOn));
  videoToggleButton.classList.toggle('is-active', isOn);
  statePill.textContent = isOn ? 'On' : 'Off';
  statePill.classList.toggle('is-on', isOn);
  statePill.classList.toggle('is-off', !isOn);
}

/**
 * Enhance existing exercise cards with visual elements
 */
function enhanceExerciseCards() {
  const applyEnhancements = (items) => {
    items.forEach((item) => {
      addVisualEnhancementsToExercise(item);
    });
  };

  const exerciseItems = document.querySelectorAll('.exercise-item');
  if (exerciseItems.length) {
    applyEnhancements(exerciseItems);
    return;
  }

  // Wait briefly for exercise cards to be rendered
  setTimeout(() => {
    applyEnhancements(document.querySelectorAll('.exercise-item'));
  }, 500);
}

/**
 * Add visual enhancements to a specific exercise card
 */
function addVisualEnhancementsToExercise(exerciseItem) {
  const exerciseName = exerciseItem.querySelector('.exercise-name')?.textContent?.toLowerCase();
  if (!exerciseName) return;

  const existingControls = exerciseItem.querySelector('.exercise-visual-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const showVideoControls = visualEnhancementState.showVideos;
  if (!showVideoControls) {
    return;
  }

  // Add visual enhancement buttons
  const visualControls = document.createElement('div');
  visualControls.className = 'exercise-visual-controls';
  visualControls.innerHTML = `
        <div class="visual-buttons">
            ${
              showVideoControls
                ? `
                <button class="visual-btn video-btn" data-exercise="${exerciseName}" title="Watch demonstration video">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Video
                </button>
            `
                : ''
            }
        </div>
    `;

  // Add to exercise item
  exerciseItem.appendChild(visualControls);

  // Add event listeners
  setupVisualButtonListeners(visualControls, exerciseName);
}

/**
 * Setup event listeners for visual buttons
 */
function setupVisualButtonListeners(visualControls, exerciseName) {
  const videoBtn = visualControls.querySelector('.video-btn');

  if (videoBtn) {
    videoBtn.addEventListener('click', () => showExerciseVideo(exerciseName));
  }
}

/**
 * Setup video modal
 */
function setupVideoModal() {
  // Check if modal already exists
  if (document.getElementById('video-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'video-modal';
  modal.className = 'video-modal hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'video-modal-title');
  modal.setAttribute('tabindex', '-1');
  modal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-modal-header">
                <h3 id="video-modal-title">Exercise Video</h3>
                <button id="close-video-modal" class="video-modal-close-btn" aria-label="Close video">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="video-modal-body">
                <div id="video-container" class="video-container">
                    <!-- Video will be dynamically inserted here -->
                </div>
                <div class="video-info">
                    <div class="video-description">
                        <p>Watch this video to learn proper form and technique for this exercise.</p>
                        <div class="video-features">
                            <div class="feature-item">
                                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Professional instruction</span>
                            </div>
                            <div class="feature-item">
                                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Form demonstration</span>
                            </div>
                            <div class="feature-item">
                                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Safety tips</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);
  modal.style.zIndex = FLOATING_MODAL_Z_INDEX;

  // Setup close button
  const closeBtn = document.getElementById('close-video-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideoModal);
  }

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeVideoModal();
    }
  });
}

/**
 * Setup instruction & safety modal
 */
function setupInstructionSafetyModal() {
  if (document.getElementById('instruction-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'instruction-modal';
  modal.className = 'instruction-modal hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'instruction-modal-title');
  modal.setAttribute('tabindex', '-1');
  modal.innerHTML = `
        <div class="instruction-modal-content">
            <div class="instruction-modal-header">
                <h3 id="instruction-modal-title">Instructions &amp; Safety</h3>
                <button id="close-instruction-modal" class="instruction-modal-close-btn" aria-label="Close instructions and safety">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div id="instruction-modal-body" class="instruction-modal-body">
                <!-- Instruction content will be injected here -->
            </div>
        </div>
    `;

  document.body.appendChild(modal);
  modal.style.zIndex = FLOATING_MODAL_Z_INDEX;

  const closeBtn = document.getElementById('close-instruction-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeInstructionSafetyModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeInstructionSafetyModal();
    }
  });

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeInstructionSafetyModal();
    }
  });
}

/**
 * Setup 3D model viewer
 */

/**
 * Show exercise video with smart fallback system
 */
function showExerciseVideo(exerciseName) {
  console.log(`🎬 Showing video for: ${exerciseName}`);

  const modal = document.getElementById('video-modal');
  const title = document.getElementById('video-modal-title');
  const videoContainer = document.getElementById('video-container');

  if (!modal || !title || !videoContainer) {
    console.warn('🎬 Video modal elements not found');
    return;
  }

  videoModalFocusReturnTarget =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  // Get video ID from fallback system
  const videoId = getExerciseVideoId(exerciseName);

  if (videoId) {
    // Use fallback video
    title.textContent = `${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1).replace(/-/g, ' ')} - Exercise Video`;

    // Create YouTube embed URL (autoplay disabled)
    const videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&fs=1`;

    // Create video element
    const video = document.createElement('iframe');
    video.src = videoUrl;
    video.width = '100%';
    video.height = '315';
    video.frameBorder = '0';
    video.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    video.allowFullscreen = true;
    video.style.borderRadius = '8px';

    // Clear container and add video
    videoContainer.innerHTML = '';
    videoContainer.appendChild(video);

    // Show the modal
    modal.classList.remove('hidden');
    const closeButton = document.getElementById('close-video-modal');
    if (closeButton instanceof HTMLElement) {
      closeButton.focus();
    } else {
      modal.focus();
    }
    console.log(`🎬 Video modal opened with fallback video: ${videoId}`);
    console.log(`🎬 Video URL: ${videoUrl}`);
  } else {
    // Fall back to exercise-specific search results when no direct embed mapping exists.
    console.log(`🎬 No specific video found for: ${exerciseName}, showing fallback search`);
    showGenericExerciseVideo(exerciseName);
  }
}

/**
 * Show generic exercise video when no specific video is available
 */
function showGenericExerciseVideo(exerciseName) {
  const modal = document.getElementById('video-modal');
  const title = document.getElementById('video-modal-title');
  const videoContainer = document.getElementById('video-container');

  if (modal && title && videoContainer) {
    videoModalFocusReturnTarget =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    title.textContent = `${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1).replace(/-/g, ' ')} - Exercise Video`;
    const searchQuery = getExerciseVideoSearchQuery(exerciseName);

    if (searchQuery) {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
      videoContainer.innerHTML = `
        <div class="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-fit-secondary">No direct embed available</p>
          <p class="mt-3 text-fit-dark">Open exercise-specific YouTube results for ${exerciseName.replace(/-/g, ' ')}.</p>
          <a
            href="${searchUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
            Open YouTube Search
          </a>
        </div>
      `;
      console.log(`🎬 Generic video modal opened with search URL: ${searchUrl}`);
    } else {
      const genericVideoId = DEFAULT_VIDEO_ID;
      const videoUrl = `https://www.youtube.com/embed/${genericVideoId}?rel=0&modestbranding=1&controls=1&fs=1`;

      const video = document.createElement('iframe');
      video.src = videoUrl;
      video.width = '100%';
      video.height = '315';
      video.frameBorder = '0';
      video.allow =
        'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      video.allowFullscreen = true;
      video.style.borderRadius = '8px';

      videoContainer.innerHTML = '';
      videoContainer.appendChild(video);
      console.log(`🎬 Generic video modal opened with video: ${genericVideoId}`);
    }

    // Show the modal
    modal.classList.remove('hidden');
    const closeButton = document.getElementById('close-video-modal');
    if (closeButton instanceof HTMLElement) {
      closeButton.focus();
    } else {
      modal.focus();
    }
  }
}

/**
 * Close video modal
 */
function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const videoContainer = document.getElementById('video-container');

  if (modal) {
    modal.classList.add('hidden');
  }

  if (videoContainer) {
    videoContainer.innerHTML = '';
  }

  if (videoModalFocusReturnTarget instanceof HTMLElement) {
    videoModalFocusReturnTarget.focus();
  }
}

function showInstructionSafetyModal() {
  const modal = document.getElementById('instruction-modal');
  const title = document.getElementById('instruction-modal-title');
  const body = document.getElementById('instruction-modal-body');

  if (!modal || !title || !body) {
    console.warn('🎬 Instruction modal elements not found');
    return;
  }

  instructionModalFocusReturnTarget =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const payload = getInstructionSafetyPayload();
  if (!payload) {
    title.textContent = 'Instructions & Safety';
    body.innerHTML = `
      <div class="text-sm text-fit-secondary">
        Start a workout to view instructions and safety guidance for the active exercise.
      </div>
    `;
  } else {
    title.textContent = `${payload.name} - Instructions & Safety`;
    body.innerHTML = buildInstructionSafetyMarkup(payload);
  }

  modal.classList.remove('hidden');
  const closeButton = document.getElementById('close-instruction-modal');
  if (closeButton instanceof HTMLElement) {
    closeButton.focus();
  } else {
    modal.focus();
  }
}

function closeInstructionSafetyModal() {
  const modal = document.getElementById('instruction-modal');
  if (modal) {
    modal.classList.add('hidden');
  }

  if (instructionModalFocusReturnTarget instanceof HTMLElement) {
    instructionModalFocusReturnTarget.focus();
  }
}

function getInstructionSafetyPayload() {
  const workoutState = window.workoutState;
  const sequence = workoutState?.sequence;
  if (!Array.isArray(sequence) || sequence.length === 0) return null;

  const index =
    typeof workoutState.currentIndex === 'number' ? workoutState.currentIndex : 0;
  const exercise = sequence[index];
  if (!exercise) return null;

  const description = String(exercise.description || '');
  const { instruction, safety } = parseInstructionAndSafety(description);
  const { doText, dontText } = parseDoDont(safety);

  return {
    name: exercise.name || 'Exercise',
    instruction,
    safety,
    doText,
    dontText,
  };
}

function parseInstructionAndSafety(description) {
  const parts = String(description || '').split('⚠️');
  const instruction = (parts[0] || '').trim();
  const safety = (parts[1] || '').trim();
  return { instruction, safety };
}

function parseDoDont(safetyGuidelines) {
  if (!safetyGuidelines) return { doText: '', dontText: '' };
  const doMatch = safetyGuidelines.match(/DO:\s*(.+?)\.\s*DON'T:/i);
  const dontMatch = safetyGuidelines.match(/DON'T:\s*(.+)/i);
  return {
    doText: doMatch ? doMatch[1].trim() : '',
    dontText: dontMatch ? dontMatch[1].trim() : '',
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildInstructionSafetyMarkup({ instruction, safety, doText, dontText }) {
  const instructionText = instruction ? escapeHtml(instruction) : 'No instruction available.';
  let safetyMarkup = '';

  if (doText || dontText) {
    safetyMarkup = `
      <div class="space-y-3">
        ${
          doText
            ? `<div class="flex items-start gap-2">
                <span class="font-bold text-emerald-600">✓</span>
                <span class="text-sm text-fit-secondary">${escapeHtml(doText)}</span>
              </div>`
            : ''
        }
        ${
          dontText
            ? `<div class="flex items-start gap-2">
                <span class="font-bold text-rose-600">✗</span>
                <span class="text-sm text-fit-secondary">${escapeHtml(dontText)}</span>
              </div>`
            : ''
        }
      </div>
    `;
  } else if (safety) {
    safetyMarkup = `<p class="text-sm text-fit-secondary leading-relaxed">${escapeHtml(
      safety
    )}</p>`;
  } else {
    safetyMarkup = '<p class="text-sm text-fit-secondary">No safety guidance provided.</p>';
  }

  return `
    <div class="space-y-6">
      <section class="space-y-2">
        <h4 class="text-base font-semibold text-fit-dark">Instructions</h4>
        <p class="text-sm text-fit-secondary leading-relaxed">${instructionText}</p>
      </section>
      <section class="space-y-2">
        <h4 class="text-base font-semibold text-fit-dark">Safety</h4>
        ${safetyMarkup}
      </section>
    </div>
  `;
}

/**
 * Apply visual settings
 */
function applyVisualSettings() {
  // Update exercise cards based on settings
  enhanceExerciseCards();

  // Apply settings to existing elements
  applySettingsToExistingElements();

  // Also apply to workout player elements if workout is active
  if (window.workoutState && window.workoutState.sequence) {
    applySettingsToWorkoutPlayer();
  }

  updateVideoToggleButtonUI();
  console.log('🎬 Applied visual settings:', visualEnhancementState);
}

/**
 * Apply visual settings specifically to workout player elements
 */
function applySettingsToWorkoutPlayer() {
  console.log('🎬 Applying visual settings to workout player...');

  // Update video buttons within exercise resources
  const videoButtons = document.querySelectorAll(
    '#exercise-resources .video-btn, #exercise-resources [data-action="video"]'
  );
  videoButtons.forEach((button) => {
    if (visualEnhancementState.showVideos) {
      button.style.display = 'inline-flex';
      console.log('🎬 Showing video button');
    } else {
      button.style.display = 'none';
      console.log('🎬 Hiding video button');
    }
  });

  if (window.updateInlineExerciseVideo) {
    window.updateInlineExerciseVideo();
  }

  console.log('🎬 Visual settings applied to workout player');
}

/**
 * Apply settings to existing elements on the page
 */
function applySettingsToExistingElements() {
  console.log('🎬 Applying visual settings to existing elements...');

  // Update video elements within resources
  const videoElements = document.querySelectorAll('.exercise-resources a[href*="youtube.com"]');
  videoElements.forEach((video) => {
    if (visualEnhancementState.showVideos) {
      video.style.display = 'inline-flex';
    } else {
      video.style.display = 'none';
    }
  });

  // Update exercise instructions and safety sections
  const exerciseInstructions = document.getElementById('exercise-instructions');
  const exerciseSafety = document.getElementById('exercise-safety');
  const isMobileViewport = isCompactWorkoutViewport();

  if (exerciseInstructions) {
    exerciseInstructions.style.display = 'block';
    console.log('🎬 Showing exercise instructions');
  }

  if (exerciseSafety) {
    if (!isMobileViewport) {
      exerciseSafety.style.display = 'block';
      console.log('🎬 Showing exercise safety');
    } else {
      exerciseSafety.style.display = 'none';
      console.log('🎬 Hiding exercise safety');
    }
  }

  console.log('🎬 Visual settings applied to existing elements');
}

/**
 * Announce visual changes
 */
function announceVisualChange(feature, status) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = `${feature} ${status}`;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function showVisualControlsPanel() {
  const panel = document.getElementById('visual-controls-panel');
  const visualBtn = document.getElementById('visual-enhancement-btn');
  if (!panel) return;

  visualControlsFocusReturnTarget =
    document.activeElement instanceof HTMLElement ? document.activeElement : visualBtn;

  panel.classList.remove('hidden');
  visualBtn?.setAttribute('aria-expanded', 'true');

  const firstFocusable = panel.querySelector(
    'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (firstFocusable instanceof HTMLElement) {
    firstFocusable.focus();
  } else {
    panel.focus();
  }
}

function hideVisualControlsPanel() {
  const panel = document.getElementById('visual-controls-panel');
  const visualBtn = document.getElementById('visual-enhancement-btn');
  if (!panel || panel.classList.contains('hidden')) return;

  panel.classList.add('hidden');
  visualBtn?.setAttribute('aria-expanded', 'false');

  if (visualControlsFocusReturnTarget instanceof HTMLElement) {
    visualControlsFocusReturnTarget.focus();
  } else {
    visualBtn?.focus();
  }
}

/**
 * Get current visual enhancement state
 */
export function getVisualEnhancementState() {
  return { ...visualEnhancementState };
}

/**
 * Set visual enhancement state
 */
export function setVisualEnhancementState(newState) {
  if (!newState || typeof newState !== 'object') return;
  if (typeof newState.showVideos === 'boolean') {
    visualEnhancementState.showVideos = newState.showVideos;
  }
  if (typeof newState.quality === 'string') {
    visualEnhancementState.quality = newState.quality;
  }
  applyVisualSettings();
  saveVisualPreferences();
}

// Export for global access
window.initializeVisualEnhancements = initializeVisualEnhancements;
window.getVisualEnhancementState = getVisualEnhancementState;
window.applySettingsToWorkoutPlayer = applySettingsToWorkoutPlayer;
window.setVisualEnhancementState = setVisualEnhancementState;
window.getExerciseVideoId = getExerciseVideoId;
window.showExerciseVideo = showExerciseVideo;
