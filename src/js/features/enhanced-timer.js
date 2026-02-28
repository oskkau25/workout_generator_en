/**
 * Enhanced Timer Module
 * Provides advanced timer features including interval training modes, audio cues, and smart rest suggestions
 */

// Timer modes and configurations
const TIMER_MODES = {
    STANDARD: 'standard',
    TABATA: 'tabata',
    HIIT: 'hiit',
    CUSTOM: 'custom'
};

// Audio cue types
const AUDIO_CUES = {
    COUNTDOWN: 'countdown',
    PHASE_START: 'phase_start',
    PHASE_END: 'phase_end',
    WORKOUT_COMPLETE: 'workout_complete',
    WARNING: 'warning'
};

// Smart rest suggestions
const REST_SUGGESTIONS = {
    BREATHING: [
        "Take 3 deep breaths",
        "Breathe in for 4, hold for 4, out for 4",
        "Focus on slow, controlled breathing",
        "Inhale through nose, exhale through mouth"
    ],
    STRETCHING: [
        "Gently stretch your arms overhead",
        "Roll your shoulders backward",
        "Stretch your neck side to side",
        "Shake out your arms and legs"
    ],
    MOTIVATION: [
        "You're doing great!",
        "Keep pushing forward!",
        "Almost there!",
        "You've got this!"
    ],
    HYDRATION: [
        "Take a sip of water",
        "Stay hydrated!",
        "Replenish your fluids"
    ]
};

// Enhanced timer state
let enhancedTimerState = {
    mode: TIMER_MODES.STANDARD,
    audioEnabled: true,
    vibrationEnabled: true,
    audioContext: null,
    currentSuggestion: null,
    suggestionIndex: 0,
    baseWorkTime: 45,
    baseRestTime: 15
};

/**
 * Initialize enhanced timer features
 */
export function initializeEnhancedTimer() {
    console.log('🎵 Enhanced Timer Module Loaded');
    
    const workoutState = window.workoutState;
    if (workoutState) {
        enhancedTimerState.baseWorkTime = Number.isFinite(workoutState.workTime) && workoutState.workTime > 0
            ? workoutState.workTime
            : 45;
        enhancedTimerState.baseRestTime = Number.isFinite(workoutState.restTime) && workoutState.restTime > 0
            ? workoutState.restTime
            : 15;
    } else {
        enhancedTimerState.baseWorkTime = 45;
        enhancedTimerState.baseRestTime = 15;
    }
    enhancedTimerState.mode = TIMER_MODES.STANDARD;
    
    // Initialize audio context for sound cues
    initializeAudioContext();
    
    // Add timer mode controls to the UI
    addTimerModeControls();
    
    // Add audio/vibration controls
    addAudioControls();
    
    // Initialize smart rest suggestions
    initializeRestSuggestions();
}

/**
 * Initialize Web Audio API context
 */
function initializeAudioContext() {
    try {
        enhancedTimerState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('🎵 Audio context initialized');
    } catch (error) {
        console.warn('Audio not supported:', error);
        enhancedTimerState.audioEnabled = false;
    }
}

/**
 * Add timer mode controls to the workout player
 */
function addTimerModeControls() {
    const workoutPlayer = document.getElementById('workout-player');
    if (!workoutPlayer) return;
    
    // Find the controls section or create one
    let controlsSection = document.getElementById('timer-controls');
    if (!controlsSection) {
        controlsSection = document.createElement('div');
        controlsSection.id = 'timer-controls';
        controlsSection.className = 'mb-6 p-4 bg-white rounded-lg border border-gray-200';
        
        // Insert after the timer displays
        const timerSection = document.querySelector('.grid.md\\:grid-cols-2.gap-6.mb-6');
        if (timerSection) {
            timerSection.insertAdjacentElement('afterend', controlsSection);
        }
    }
    
    controlsSection.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
                <label class="text-sm font-medium text-gray-700">Timer Mode:</label>
                <select id="timer-mode-select" class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="${TIMER_MODES.STANDARD}">Standard</option>
                    <option value="${TIMER_MODES.TABATA}">Tabata (20s/10s)</option>
                    <option value="${TIMER_MODES.HIIT}">HIIT (30s/15s)</option>
                    <option value="${TIMER_MODES.CUSTOM}">Custom</option>
                </select>
            </div>
            
            <!-- Sound and vibration controls removed - using main workout player controls instead -->
        </div>
        
        <div id="custom-timer-settings" class="mt-4 hidden">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Work Time (seconds)</label>
                    <input type="number" id="custom-work-time" class="w-full px-3 py-1 border border-gray-300 rounded-md text-sm" value="45" min="5" max="300">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rest Time (seconds)</label>
                    <input type="number" id="custom-rest-time" class="w-full px-3 py-1 border border-gray-300 rounded-md text-sm" value="15" min="5" max="120">
                </div>
            </div>
        </div>
    `;
    
    const customWorkInput = controlsSection.querySelector('#custom-work-time');
    const customRestInput = controlsSection.querySelector('#custom-rest-time');
    if (customWorkInput) customWorkInput.value = String(enhancedTimerState.baseWorkTime);
    if (customRestInput) customRestInput.value = String(enhancedTimerState.baseRestTime);
    
    // Add event listeners with a small delay to ensure DOM is ready
    setTimeout(() => {
        setupTimerModeListeners();
    }, 100);
}

/**
 * Setup timer mode event listeners
 */
function setupTimerModeListeners() {
    console.log('🔧 Setting up timer mode listeners...');
    
    const modeSelect = document.getElementById('timer-mode-select');
    // Audio and vibration controls removed - using main workout player controls instead
    const customSettings = document.getElementById('custom-timer-settings');
    
    console.log('🔍 Found elements:', {
        modeSelect: !!modeSelect,
        customSettings: !!customSettings
    });
    
    if (modeSelect) {
        // Test if element is actually clickable
        console.log('🔍 Testing modeSelect clickability...');
        console.log('🔍 modeSelect disabled:', modeSelect.disabled);
        console.log('🔍 modeSelect style pointer-events:', getComputedStyle(modeSelect).pointerEvents);
        console.log('🔍 modeSelect z-index:', getComputedStyle(modeSelect).zIndex);
        
        modeSelect.addEventListener('change', (e) => {
            console.log('🎯 Timer mode changed to:', e.target.value);
            enhancedTimerState.mode = e.target.value;
            
            if (e.target.value === TIMER_MODES.CUSTOM) {
                if (customSettings) customSettings.classList.remove('hidden');
            } else {
                if (customSettings) customSettings.classList.add('hidden');
            }
            
            // Always apply the timer mode, even for custom
            applyTimerMode(e.target.value);
        });
        
        // Also add click event for debugging
        modeSelect.addEventListener('click', (e) => {
            console.log('🖱️ modeSelect clicked!');
        });
        
        // Set initial value
        modeSelect.value = enhancedTimerState.mode;
        
        // Force enable the element
        modeSelect.disabled = false;
        modeSelect.style.pointerEvents = 'auto';
        modeSelect.style.zIndex = '1000';
    }
    
    // Audio and vibration controls removed - using main workout player controls instead
    
    // Add event listeners for custom timer settings
    const customWorkTime = document.getElementById('custom-work-time');
    const customRestTime = document.getElementById('custom-rest-time');
    
    if (customWorkTime) {
        customWorkTime.addEventListener('change', () => {
            if (enhancedTimerState.mode === TIMER_MODES.CUSTOM) {
                applyTimerMode(TIMER_MODES.CUSTOM);
            }
        });
    }
    
    if (customRestTime) {
        customRestTime.addEventListener('change', () => {
            if (enhancedTimerState.mode === TIMER_MODES.CUSTOM) {
                applyTimerMode(TIMER_MODES.CUSTOM);
            }
        });
    }
    
    console.log('✅ Timer mode listeners setup complete');
}

/**
 * Apply timer mode settings
 */
function applyTimerMode(mode) {
    const workoutState = window.workoutState;
    if (!workoutState) {
        console.log('⚠️ No workout state found');
        return;
    }
    
    console.log('🎯 Applying timer mode:', mode, 'to current workout');
    console.log('🔍 Current workout state before:', {
        workTime: workoutState.workTime,
        restTime: workoutState.restTime,
        phase: workoutState.phase
    });
    
    const nextTiming = getTimingForMode(mode);
    workoutState.workTime = nextTiming.workTime;
    workoutState.restTime = nextTiming.restTime;
    
    switch (mode) {
        case TIMER_MODES.TABATA:
            console.log('⚡ Applied Tabata timing: 20s work, 10s rest');
            break;
        case TIMER_MODES.HIIT:
            console.log('🔥 Applied HIIT timing: 30s work, 15s rest');
            break;
        case TIMER_MODES.CUSTOM:
            console.log('⚙️ Applied custom timing:', nextTiming);
            break;
        case TIMER_MODES.STANDARD:
        default:
            console.log(`📊 Applied standard timing: ${nextTiming.workTime}s work, ${nextTiming.restTime}s rest`);
            break;
    }
    
    console.log('🔍 Current workout state after:', {
        workTime: workoutState.workTime,
        restTime: workoutState.restTime,
        phase: workoutState.phase
    });
    
    // Reset the active phase so mode changes are deterministic and clean.
    if (workoutState.phase === 'rest') {
        workoutState.remainingSeconds = workoutState.restTime;
    } else {
        workoutState.remainingSeconds = workoutState.workTime;
    }
    
    if (window.currentWorkoutData) {
        window.currentWorkoutData.workTime = workoutState.workTime;
        window.currentWorkoutData.restTime = workoutState.restTime;
    }
    if (window.appState) {
        window.appState.workTime = workoutState.workTime;
        window.appState.restTime = workoutState.restTime;
        window.appState.remainingSeconds = workoutState.remainingSeconds;
    }
    
    if (typeof window.refreshWorkoutTimerDisplays === 'function') {
        window.refreshWorkoutTimerDisplays();
    }
}

function getTimingForMode(mode) {
    switch (mode) {
        case TIMER_MODES.TABATA:
            return { workTime: 20, restTime: 10 };
        case TIMER_MODES.HIIT:
            return { workTime: 30, restTime: 15 };
        case TIMER_MODES.CUSTOM:
            return getCustomTimerSettings();
        case TIMER_MODES.STANDARD:
        default:
            return {
                workTime: enhancedTimerState.baseWorkTime,
                restTime: enhancedTimerState.baseRestTime
            };
    }
}

/**
 * Add audio controls to the UI
 */
function addAudioControls() {
    // Audio controls are already added in addTimerModeControls
    console.log('🎵 Audio controls added');
}

/**
 * Initialize smart rest suggestions
 */
function initializeRestSuggestions() {
    console.log('💡 Smart rest suggestions initialized');
}

/**
 * Play audio cue
 */
export function playAudioCue(cueType, frequency = 800, duration = 200) {
    // Use main workout player's sound state
    const workoutState = window.workoutState || window.appState;
    if (!workoutState?.enableSound || !enhancedTimerState.audioContext) return;
    
    try {
        const oscillator = enhancedTimerState.audioContext.createOscillator();
        const gainNode = enhancedTimerState.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(enhancedTimerState.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, enhancedTimerState.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, enhancedTimerState.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, enhancedTimerState.audioContext.currentTime + duration / 1000);
        
        oscillator.start(enhancedTimerState.audioContext.currentTime);
        oscillator.stop(enhancedTimerState.audioContext.currentTime + duration / 1000);
        
        console.log(`🔊 Played audio cue: ${cueType}`);
    } catch (error) {
        console.warn('Audio cue failed:', error);
    }
}

/**
 * Trigger vibration cue
 */
export function triggerVibration(pattern = [100]) {
    // Use main workout player's vibration state
    const workoutState = window.workoutState || window.appState;
    if (!workoutState?.enableVibration || !navigator.vibrate) return;
    
    try {
        navigator.vibrate(pattern);
        console.log('📳 Vibration triggered');
    } catch (error) {
        console.warn('Vibration failed:', error);
    }
}

/**
 * Get smart rest suggestion
 */
export function getSmartRestSuggestion() {
    const categories = Object.keys(REST_SUGGESTIONS);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const suggestions = REST_SUGGESTIONS[randomCategory];
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    enhancedTimerState.currentSuggestion = suggestion;
    return suggestion;
}

/**
 * Enhanced countdown with audio cues
 */
export function enhancedCountdown(seconds, phase = 'work') {
    if (seconds <= 3 && seconds > 0) {
        // Play countdown beep
        playAudioCue(AUDIO_CUES.COUNTDOWN, 600 + (seconds * 100), 150);
        
        // Trigger vibration for last 3 seconds
        if (seconds <= 3) {
            triggerVibration([50]);
        }
    }
    
    if (seconds === 0) {
        // Play phase end sound
        playAudioCue(AUDIO_CUES.PHASE_END, 1000, 300);
        triggerVibration([200, 100, 200]);
    }
}

/**
 * Enhanced phase start with audio cues
 */
export function enhancedPhaseStart(phase) {
    if (phase === 'work') {
        playAudioCue(AUDIO_CUES.PHASE_START, 800, 200);
        triggerVibration([100]);
    } else if (phase === 'rest') {
        playAudioCue(AUDIO_CUES.PHASE_START, 600, 200);
        triggerVibration([50]);
    }
}

/**
 * Enhanced workout complete
 */
export function enhancedWorkoutComplete() {
    playAudioCue(AUDIO_CUES.WORKOUT_COMPLETE, 1200, 500);
    triggerVibration([300, 100, 300, 100, 300]);
}

/**
 * Update rest overlay with smart suggestions
 */
export function updateRestOverlayWithSuggestions() {
    const restOverlay = document.getElementById('rest-overlay');
    if (!restOverlay) return;
    
    // Find or create suggestions container
    let suggestionsContainer = document.getElementById('rest-suggestions');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'rest-suggestions';
        suggestionsContainer.className = 'mt-6 p-4 bg-white/90 rounded-lg border border-green-200';
        
        // Insert after the progress ring
        const progressRing = restOverlay.querySelector('#rest-overlay-progress-ring');
        if (progressRing) {
            progressRing.insertAdjacentElement('afterend', suggestionsContainer);
        }
    }
    
    // Get and display smart suggestion
    const suggestion = getSmartRestSuggestion();
    suggestionsContainer.innerHTML = `
        <div class="text-center">
            <div class="text-lg font-semibold text-green-800 mb-2">💡 Smart Rest Tip</div>
            <div class="text-green-700">${suggestion}</div>
        </div>
    `;
}

/**
 * Get current timer mode
 */
export function getCurrentTimerMode() {
    return enhancedTimerState.mode;
}

/**
 * Get custom timer settings
 */
export function getCustomTimerSettings() {
    const workTimeInput = document.getElementById('custom-work-time');
    const restTimeInput = document.getElementById('custom-rest-time');
    
    return {
        workTime: normalizeTimerValue(workTimeInput ? parseInt(workTimeInput.value, 10) : NaN, enhancedTimerState.baseWorkTime, 5, 300),
        restTime: normalizeTimerValue(restTimeInput ? parseInt(restTimeInput.value, 10) : NaN, enhancedTimerState.baseRestTime, 5, 120)
    };
}

function normalizeTimerValue(value, fallback, min, max) {
    if (!Number.isFinite(value)) return fallback;
    return Math.min(max, Math.max(min, value));
}

// Export timer modes and audio cues for use in other modules
export { TIMER_MODES, AUDIO_CUES, REST_SUGGESTIONS };
