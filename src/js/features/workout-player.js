/**
 * Workout Player Module
 * Handles the workout execution, timers, and player interface
 */

// Import enhanced timer features
import { 
    initializeEnhancedTimer, 
    playAudioCue, 
    triggerVibration, 
    enhancedCountdown, 
    enhancedPhaseStart, 
    enhancedWorkoutComplete,
    updateRestOverlayWithSuggestions,
    getCurrentTimerMode,
    getCustomTimerSettings,
    TIMER_MODES,
    AUDIO_CUES
} from './enhanced-timer.js';

/**
 * Generate search links for exercise resources
 */
function generateExerciseResources(exercise) {
    if (!exercise.resources) {
        return '';
    }
    
    const { googleSearch, youtubeSearch, modifications, timing, progression } = exercise.resources;
    
    return `
        <div class="exercise-resources mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 class="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Exercise Resources
            </h4>
            
            <div class="grid md:grid-cols-2 gap-4">
                <!-- Visual Enhancement Buttons -->
                <div class="space-y-2">
                    <h5 class="font-medium text-blue-700">Visual Aids:</h5>
                    <div class="flex flex-wrap gap-2">
                        <button class="video-btn inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition-colors" 
                                data-action="video" 
                                onclick="if(window.showExerciseVideo) window.showExerciseVideo('${exercise.name.toLowerCase().replace(/\s+/g, '-')}')">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            Video
                        </button>
                    </div>
                </div>
                
                <!-- Search Links -->
                <div class="space-y-2">
                    <h5 class="font-medium text-blue-700">Learn More:</h5>
                    <div class="flex flex-wrap gap-2">
                        <a href="https://www.google.com/search?q=${encodeURIComponent(googleSearch)}" 
                           target="_blank" 
                           class="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            Google Search
                        </a>
                        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeSearch)}" 
                           target="_blank" 
                           class="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition-colors">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            YouTube
                        </a>
                    </div>
                </div>
                
                <!-- Modifications -->
                <div class="space-y-2">
                    <h5 class="font-medium text-blue-700">Modifications:</h5>
                    <div class="text-sm text-blue-600 space-y-1">
                        ${modifications ? Object.entries(modifications).map(([level, desc]) => 
                            `<div><span class="font-medium capitalize">${level}:</span> ${desc}</div>`
                        ).join('') : 'No specific modifications available'}
                    </div>
                </div>
            </div>
            
            <!-- Timing & Progression -->
            <div class="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                    <h5 class="font-medium text-blue-700 mb-2">Timing Guidelines:</h5>
                    <div class="text-sm text-blue-600 space-y-1">
                        ${timing ? Object.entries(timing).map(([phase, time]) => 
                            `<div><span class="font-medium capitalize">${phase}:</span> ${time}</div>`
                        ).join('') : 'Follow standard workout timing'}
                    </div>
                </div>
                
                <div>
                    <h5 class="font-medium text-blue-700 mb-2">Progression Path:</h5>
                    <div class="text-sm text-blue-600">
                        ${progression ? progression.join(' → ') : 'Standard progression recommended'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Workout player state - ensure proper initialization
let workoutState = {
    sequence: [],
    currentIndex: 0,
    phase: 'work', // 'work' | 'rest'
    remainingSeconds: 0,
    workTime: 45,
    restTime: 15,
    timerId: null,
    isPaused: false,
    enableSound: true,
    enableVibration: true,
    audioContext: null
};

// Sync with main app state if available
if (window.appState) {
    Object.assign(workoutState, window.appState);
}

/**
 * Expand circuit workout to include all rounds
 */
function expandCircuitWorkout(workoutData) {
    const circuitData = workoutData._circuitData;
    if (!circuitData) {
        console.log('❌ No circuit data found, returning original sequence');
        return workoutData.sequence;
    }
    
    console.log('🔄 Circuit data found:', circuitData);
    const workout = workoutData.sequence;
    const expandedWorkout = [];
    
    for (let i = 0; i < workout.length; i++) {
        const exercise = workout[i];
        
        if (exercise._isCircuitExercise && exercise._isPreviewOnly) {
            // Skip preview-only circuit exercises, we'll add all rounds below
            continue;
        } else if (exercise.type === 'circuit_header') {
            // Skip the circuit header - we'll go directly to the first circuit exercise
            continue;
        } else {
            // Keep non-circuit exercises (warm-up, cool-down, etc.)
            expandedWorkout.push(exercise);
        }
    }
    
    // Find the position where circuit exercises should be inserted
    // Since we skip the circuit header, insert after the last warm-up exercise
    const lastWarmupIndex = expandedWorkout.findLastIndex(ex => ex._section === 'Warm-up');
    const insertIndex = lastWarmupIndex + 1;
    
    // Create all circuit rounds first
    const allCircuitExercises = [];
    for (let round = 1; round <= circuitData.rounds; round++) {
        const roundExercises = circuitData.exercises.map((ex, index) => ({
            ...ex, 
            _section: 'Main',
            _circuitPosition: index + 1,
            _totalInCircuit: circuitData.exercisesPerRound,
            _circuitRounds: circuitData.rounds,
            _currentRound: round,
            _isCircuitExercise: true
        }));
        allCircuitExercises.push(...roundExercises);
    }
    
    // Insert all circuit exercises at once
    expandedWorkout.splice(insertIndex, 0, ...allCircuitExercises);
    
    console.log('✅ Circuit expansion complete:');
    console.log('  - Original sequence length:', workout.length);
    console.log('  - Expanded sequence length:', expandedWorkout.length);
    console.log('  - Circuit exercises added:', allCircuitExercises.length);
    console.log('  - Rounds:', circuitData.rounds, 'Exercises per round:', circuitData.exercisesPerRound);
    
    return expandedWorkout;
}

/**
 * Initialize workout player with workout data
 */
export function initializeWorkoutPlayer(workoutData) {
    console.log('🎮 Initializing workout player with data:', workoutData);
    
    // Use main app state if available, otherwise create new state
    if (window.appState) {
        workoutState = window.appState;
        console.log('🔄 Using main app state for workout player');
    }
    
    // Initialize enhanced timer features
    initializeEnhancedTimer();
    
    // Hide the "What's New" banner during workout
    const banner = document.getElementById('whats-new-banner');
    if (banner) {
        banner.style.display = 'none';
        console.log('🎯 Hidden "What\'s New" banner during workout');
    }
    
    // Check if this is a circuit workout and expand the sequence
    let sequence = workoutData.sequence || [];
    if (workoutData._circuitData) {
        console.log('🔄 Expanding circuit workout for all rounds');
        sequence = expandCircuitWorkout(workoutData);
    }
    
    workoutState.sequence = sequence;
    workoutState.workTime = workoutData.workTime || 45;
    workoutState.restTime = workoutData.restTime || 15;
    console.log('⏱️ Set workTime:', workoutState.workTime, 'restTime:', workoutState.restTime);
    console.log('📋 Final workout sequence length:', sequence.length);
    workoutState.currentIndex = 0;
    workoutState.phase = 'work';
    workoutState.remainingSeconds = workoutState.workTime;
    workoutState.isPaused = false;
    
    // Make workout state globally accessible for enhanced timer
    window.workoutState = workoutState;
    
    // Clear any existing timer
    clearRunningTimer();
    
    // Render the player
    renderWorkoutPlayer();
    
    // Setup event listeners after rendering
    setupWorkoutPlayerListeners();
    
    // Show player screen
    toggleScreens({ overview: false, player: true, plan: false });
    
    // Start the workout
    startPhase('work');
}

/**
 * Start a workout phase (work or rest)
 */
export function startPhase(phase) {
    workoutState.phase = phase;
    
    // Get timing based on current exercise
    const currentExercise = workoutState.sequence[workoutState.currentIndex];
    let workTime = workoutState.workTime;
    let restTime = workoutState.restTime;
    
    // Check for custom timing in exercise
    if (currentExercise && currentExercise._workTime) workTime = currentExercise._workTime;
    if (currentExercise && currentExercise._restTime) restTime = currentExercise._restTime;
    
    workoutState.remainingSeconds = phase === 'work' ? workTime : restTime;
    setTimerDisplays();
    cuePhase(phase);
    
    // Enhanced phase start with audio cues
    enhancedPhaseStart(phase);
    
    clearRunningTimer();
    workoutState.isPaused = false;
    updatePauseButton();
    
    workoutState.timerId = setInterval(() => {
        if (workoutState.isPaused) return;
        workoutState.remainingSeconds -= 1;
        
        // Enhanced countdown with audio cues and vibration
        enhancedCountdown(workoutState.remainingSeconds, workoutState.phase);
        
        // Legacy countdown for compatibility
        if (workoutState.phase === 'rest' && workoutState.remainingSeconds > 0 && workoutState.remainingSeconds <= 3) {
            beep(120, 750);
        }
        
        // Spoken countdown last 5s of exercise work phase
        if (workoutState.phase === 'work' && workoutState.remainingSeconds > 0 && workoutState.remainingSeconds <= 5) {
            speak(`${workoutState.remainingSeconds}`);
        }
        
        if (workoutState.remainingSeconds <= 0) {
            clearRunningTimer();
            if (workoutState.phase === 'work') {
                // Check if current exercise should skip rest (warm-up or cool-down)
                const currentExercise = workoutState.sequence[workoutState.currentIndex];
                if (currentExercise && currentExercise._noRest) {
                    // Skip rest phase for warm-up and cool-down exercises
                    advanceExercise();
                } else {
                    // Enhanced phase transition
                    enhancedPhaseStart('rest');
                    speak('Rest');
                    startPhase('rest');
                }
            } else {
                advanceExercise();
            }
        } else {
            setTimerDisplays();
        }
    }, 1000);
}

/**
 * Advance to next exercise
 */
function advanceExercise() {
    workoutState.currentIndex++;
    
    if (workoutState.currentIndex >= workoutState.sequence.length) {
        // Workout complete
        completeWorkout();
        return;
    }
    
    // Update display and start work phase
    renderWorkoutPlayer();
    startPhase('work');
}

/**
 * Complete the workout
 */
function completeWorkout() {
    clearRunningTimer();
    
    // Enhanced workout complete with audio and vibration
    enhancedWorkoutComplete();
    
    speak('Workout complete! Great job!');
    
    // Record personal workout
    recordPersonalWorkout();
    
    // Show completion message
    const playerDiv = document.getElementById('workout-player');
    if (playerDiv) {
        playerDiv.innerHTML = `
            <div class="max-w-4xl mx-auto text-center">
                <div class="card">
                    <div class="text-6xl mb-6">🎉</div>
                    <h2 class="text-3xl font-bold text-fit-dark mb-4">Workout Complete!</h2>
                    <p class="text-fit-secondary mb-6">Great job! You've completed your workout.</p>
                    <div class="space-y-4">
                        <button onclick="generateNewWorkout()" class="btn-primary">
                            Create New Workout
                        </button>
                        <button onclick="showWorkoutOverview()" class="btn-secondary">
                            View Summary
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Get the starting index of circuit exercises
 */
function getCircuitStartIndex() {
    for (let i = 0; i < workoutState.sequence.length; i++) {
        if (workoutState.sequence[i]._isCircuitExercise) {
            return i;
        }
    }
    return 0;
}

/**
 * Render the workout player interface
 */
function renderWorkoutPlayer() {
    const currentExercise = workoutState.sequence[workoutState.currentIndex];
    if (!currentExercise) return;
    
    // Update progress
    const progress = ((workoutState.currentIndex + 1) / workoutState.sequence.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    const exerciseProgress = document.getElementById('exercise-progress');
    const sectionBadge = document.getElementById('section-badge');
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    
    // Enhanced progress display for circuit exercises
    if (exerciseProgress) {
        if (currentExercise._isCircuitExercise) {
            exerciseProgress.textContent = `Exercise ${currentExercise._circuitPosition} of ${currentExercise._totalInCircuit}`;
        } else {
            exerciseProgress.textContent = `Exercise ${workoutState.currentIndex + 1} of ${workoutState.sequence.length}`;
        }
    }
    
    if (sectionBadge) sectionBadge.textContent = currentExercise._section || 'Exercise';
    
    // Show/hide circuit round counter
    const circuitRoundCounter = document.getElementById('circuit-round-counter');
    const circuitRoundDisplay = document.getElementById('circuit-round-display');
    
    if (currentExercise._isCircuitExercise) {
        if (circuitRoundCounter) circuitRoundCounter.classList.remove('hidden');
        if (circuitRoundDisplay) {
            const currentRound = currentExercise._currentRound || Math.ceil((workoutState.currentIndex - getCircuitStartIndex()) / currentExercise._totalInCircuit) + 1;
            circuitRoundDisplay.textContent = `Round ${currentRound} of ${currentExercise._circuitRounds}`;
        }
    } else {
        if (circuitRoundCounter) circuitRoundCounter.classList.add('hidden');
    }
    
    // Update exercise display
    const exerciseTitle = document.getElementById('exercise-title');
    const exerciseMeta = document.getElementById('exercise-meta');
    const exerciseInstructions = document.getElementById('exercise-instructions');
    const exerciseSafety = document.getElementById('exercise-safety');
    
    // Exercise title
    if (exerciseTitle) {
        exerciseTitle.textContent = currentExercise.name;
    }
    
    if (exerciseMeta) {
        let metaHTML = `
            <span class="inline-block px-3 py-1 bg-fit-primary/10 text-fit-primary rounded-full text-sm font-medium mr-2">${currentExercise.muscle}</span>
            <span class="inline-block px-3 py-1 bg-fit-secondary/10 text-fit-secondary rounded-full text-sm font-medium">${currentExercise.equipment}</span>
        `;
        
        exerciseMeta.innerHTML = metaHTML;
    }
    
    // Parse instructions and safety
    const { instruction, safety } = parseInstructionAndSafety(currentExercise.description);
    if (exerciseInstructions) exerciseInstructions.textContent = instruction;
    
    if (safety && exerciseSafety) {
        const { doText, dontText } = parseDoDont(safety);
        exerciseSafety.innerHTML = `
            <h3 class="text-lg font-semibold text-fit-dark mb-3">Safety Guidelines</h3>
            <div class="space-y-3">
                ${doText ? `<div class="flex items-start space-x-2">
                    <span class="text-green-600 font-bold">✓</span>
                    <span class="text-fit-secondary">${doText}</span>
                </div>` : ''}
                ${dontText ? `<div class="flex items-start space-x-2">
                    <span class="text-red-600 font-bold">✗</span>
                    <span class="text-fit-secondary">${dontText}</span>
                </div>` : ''}
            </div>
        `;
        exerciseSafety.classList.remove('hidden');
    }
    
        // Add exercise resources if available
        const exerciseResources = document.getElementById('exercise-resources');
        if (exerciseResources) {
            const resourcesHTML = generateExerciseResources(currentExercise);
            if (resourcesHTML) {
                exerciseResources.innerHTML = resourcesHTML;
                exerciseResources.classList.remove('hidden');
            } else {
                exerciseResources.classList.add('hidden');
            }
        }
    
    // Hide rest timer for warm-up and cool-down exercises
    const restTimer = document.getElementById('rest-timer');
    if (restTimer) {
        if (currentExercise._noRest) {
            restTimer.style.display = 'none';
        } else {
            restTimer.style.display = 'block';
        }
    }
    
    // Apply visual enhancement settings to the current exercise display
    if (window.applySettingsToWorkoutPlayer) {
        window.applySettingsToWorkoutPlayer();
    }
}

/**
 * Set timer displays
 */
function setTimerDisplays() {
    const workTimer = document.getElementById('work-timer');
    const restTimer = document.getElementById('rest-timer');
    const workProgressRing = document.getElementById('work-progress-ring');
    const restProgressRing = document.getElementById('rest-progress-ring');
    const restOverlay = document.getElementById('rest-overlay');
    const restOverlayTimer = document.getElementById('rest-overlay-timer');
    const nextName = document.getElementById('next-exercise-name');
    
    // Check if current exercise should skip rest (warm-up or cool-down)
    const currentExercise = workoutState.sequence[workoutState.currentIndex];
    const isNoRestExercise = currentExercise && currentExercise._noRest;
    
    if (workoutState.phase === 'work') {
        if (workTimer) workTimer.textContent = formatSeconds(workoutState.remainingSeconds);
        
        // Update work progress ring
        if (workProgressRing) {
            const workProgress = ((workoutState.workTime - workoutState.remainingSeconds) / workoutState.workTime) * 100;
            const workDashArray = `${workProgress}, 100`;
            workProgressRing.style.strokeDasharray = workDashArray;
            
            // Add pulsing animation when work time is low
            if (workoutState.remainingSeconds <= 5) {
                workProgressRing.classList.add('animate-pulse');
            } else {
                workProgressRing.classList.remove('animate-pulse');
            }
        }
        
        // Hide rest timer for warm-up and cool-down exercises
        if (restTimer) {
            if (isNoRestExercise) {
                restTimer.style.display = 'none';
            } else {
                restTimer.style.display = 'block';
                restTimer.textContent = formatSeconds(workoutState.restTime);
            }
        }
        
        // Reset rest progress ring
        if (restProgressRing) {
            restProgressRing.style.strokeDasharray = '0, 100';
        }
        
        if (restOverlay) restOverlay.classList.add('hidden');
    } else {
        if (workTimer) workTimer.textContent = formatSeconds(workoutState.workTime);
        if (restTimer) restTimer.textContent = formatSeconds(workoutState.remainingSeconds);
        
        // Update rest progress ring
        if (restProgressRing) {
            const restProgress = ((workoutState.restTime - workoutState.remainingSeconds) / workoutState.restTime) * 100;
            const restDashArray = `${restProgress}, 100`;
            restProgressRing.style.strokeDasharray = restDashArray;
            
            // Add pulsing animation when rest time is low
            if (workoutState.remainingSeconds <= 5) {
                restProgressRing.classList.add('animate-pulse');
            } else {
                restProgressRing.classList.remove('animate-pulse');
            }
        }
        
        // Reset work progress ring
        if (workProgressRing) {
            workProgressRing.style.strokeDasharray = '100, 100';
        }
        
        if (restOverlay) {
            restOverlay.classList.remove('hidden');
            if (restOverlayTimer) restOverlayTimer.textContent = workoutState.remainingSeconds.toString().padStart(2, '0');
            
            // Update rest overlay progress ring
            const restOverlayProgressRing = document.getElementById('rest-overlay-progress-ring');
            if (restOverlayProgressRing) {
                const restProgress = ((workoutState.restTime - workoutState.remainingSeconds) / workoutState.restTime) * 100;
                const restDashArray = `${restProgress}, 100`;
                restOverlayProgressRing.style.strokeDasharray = restDashArray;
            }
            
            // Update rest overlay with smart suggestions
            updateRestOverlayWithSuggestions();
            
            // Update motivational message
            const motivationalMessage = document.getElementById('motivational-message');
            if (motivationalMessage) {
                const messages = [
                    "💪 Great job! You're crushing this workout!",
                    "🔥 You're on fire! Keep it up!",
                    "⭐ Amazing progress! You've got this!",
                    "🚀 You're unstoppable! Keep pushing!",
                    "💎 You're doing fantastic! Stay strong!",
                    "🌟 Incredible work! You're a champion!",
                    "⚡ You're absolutely killing it!",
                    "🏆 Outstanding effort! Keep going!"
                ];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                motivationalMessage.textContent = randomMessage;
            }
            
            // Update exercise progress
            const currentExerciseNumber = document.getElementById('current-exercise-number');
            const totalExercises = document.getElementById('total-exercises');
            if (currentExerciseNumber) currentExerciseNumber.textContent = workoutState.currentIndex + 1;
            if (totalExercises) totalExercises.textContent = workoutState.sequence.length;
            
            if (nextName) {
                const nextIdx = Math.min(workoutState.currentIndex + 1, workoutState.sequence.length - 1);
                const nextExercise = workoutState.sequence[nextIdx];
                if (nextExercise) {
                    nextName.textContent = nextExercise.name || '';
                    // Update detailed preview
                    updateNextExercisePreview(nextExercise);
                }
            }
        }
    }
}

/**
 * Update the next exercise preview with detailed information
 */
function updateNextExercisePreview(exercise) {
    const nextExerciseName = document.getElementById('next-exercise-name');
    const nextExerciseDescription = document.getElementById('next-exercise-description');
    const nextExerciseEquipment = document.getElementById('next-exercise-equipment');
    const nextExerciseMuscle = document.getElementById('next-exercise-muscle');
    const nextExerciseLevel = document.getElementById('next-exercise-level');
    
    if (nextExerciseName) {
        nextExerciseName.textContent = exercise.name || '';
    }
    
    if (nextExerciseDescription) {
        // Show brief description during rest, full description will be available in the main player
        const description = exercise.description || '';
        const briefDescription = description.length > 150 ? description.substring(0, 150) + '...' : description;
        nextExerciseDescription.textContent = briefDescription;
    }
    
    if (nextExerciseEquipment) {
        nextExerciseEquipment.textContent = exercise.equipment || 'Bodyweight';
    }
    
    if (nextExerciseMuscle) {
        nextExerciseMuscle.textContent = exercise.muscle || 'Full Body';
    }
    
    if (nextExerciseLevel) {
        const level = Array.isArray(exercise.level) ? exercise.level[0] : exercise.level;
        nextExerciseLevel.textContent = level || 'Beginner';
    }
}

/**
 * Toggle pause/resume
 */
export function togglePause() {
    workoutState.isPaused = !workoutState.isPaused;
    updatePauseButton();
    
    if (workoutState.isPaused) {
        speak('Paused');
    } else {
        speak('Resumed');
    }
}

/**
 * Update pause button display
 */
function updatePauseButton() {
    const pauseBtn = document.getElementById('pause-resume-btn');
    if (pauseBtn) {
        const icon = pauseBtn.querySelector('svg');
        const text = pauseBtn.querySelector('span:last-child');
        
        if (workoutState.isPaused) {
            if (icon) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
            }
            if (text) text.textContent = 'Resume';
        } else {
            if (icon) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
            }
            if (text) text.textContent = 'Pause';
        }
    }
}

/**
 * Go to previous exercise
 */
export function previousExercise() {
    if (workoutState.currentIndex > 0) {
        workoutState.currentIndex--;
        clearRunningTimer();
        renderWorkoutPlayer();
        startPhase('work');
    }
}

/**
 * Go to next exercise
 */
export function nextExercise() {
    if (workoutState.currentIndex < workoutState.sequence.length - 1) {
        workoutState.currentIndex++;
        clearRunningTimer();
        renderWorkoutPlayer();
        startPhase('work');
    }
}

/**
 * Exit workout
 */
export function exitWorkout() {
    clearRunningTimer();
    
    // Show the "What's New" banner again when exiting workout
    const banner = document.getElementById('whats-new-banner');
    if (banner) {
        banner.style.display = 'block';
        console.log('🎯 Shown "What\'s New" banner after exiting workout');
    }
    
    // Show the workout overview (which has the "Create New Workout" button)
    const workoutOverview = document.getElementById('workout-overview');
    const workoutPlayer = document.getElementById('workout-player');
    
    // Show workout overview and hide player
    if (workoutOverview) workoutOverview.classList.remove('hidden');
    if (workoutPlayer) workoutPlayer.classList.add('hidden');
    
    // Scroll to workout overview
    workoutOverview?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Toggle screens visibility
 */
function toggleScreens({ overview = false, player = false, plan = false }) {
    const overviewScreen = document.getElementById('workout-overview');
    const playerScreen = document.getElementById('workout-player');
    const planScreen = document.getElementById('workout-plan');
    
    if (overviewScreen) overviewScreen.classList.toggle('hidden', !overview);
    if (playerScreen) playerScreen.classList.toggle('hidden', !player);
    if (planScreen) planScreen.classList.toggle('hidden', !plan);
}

/**
 * Clear running timer
 */
function clearRunningTimer() {
    if (workoutState.timerId) {
        clearInterval(workoutState.timerId);
        workoutState.timerId = null;
    }
}

/**
 * Format seconds as MM:SS
 */
function formatSeconds(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate total workout duration
 */
function calculateWorkoutDuration() {
    if (!workoutState.sequence || workoutState.sequence.length === 0) return 0;
    
    const totalExercises = workoutState.sequence.length;
    const workTime = workoutState.workTime || 45;
    const restTime = workoutState.restTime || 15;
    
    // Calculate total time (work + rest for each exercise, minus last rest)
    return (totalExercises * (workTime + restTime)) - restTime;
}

/**
 * Get equipment used in current workout
 */
function getUsedEquipment() {
    // This would need to be enhanced to track actual equipment used
    // For now, return a default set
    return ['Bodyweight']; // Could be enhanced to track from form data
}

/**
 * Record personal workout completion
 */
function recordPersonalWorkout() {
    try {
        const workoutData = {
            id: Date.now(),
            date: new Date().toISOString(),
            duration: calculateWorkoutDuration(),
            type: 'Standard', // Could be enhanced to track actual pattern
            equipment: getUsedEquipment(),
            exerciseCount: workoutState.sequence?.length || 0,
            workTime: workoutState.workTime || 45,
            restTime: workoutState.restTime || 15
        };
        
        // Load existing personal workouts
        let personalWorkouts = [];
        const stored = localStorage.getItem('fitflow_personal_workouts');
        if (stored) {
            personalWorkouts = JSON.parse(stored);
        }
        
        // Add new workout
        personalWorkouts.unshift(workoutData);
        
        // Keep only last 50 workouts to prevent localStorage bloat
        if (personalWorkouts.length > 50) {
            personalWorkouts = personalWorkouts.slice(0, 50);
        }
        
        // Save back to localStorage
        localStorage.setItem('fitflow_personal_workouts', JSON.stringify(personalWorkouts));
        
        console.log('📊 Personal workout recorded:', workoutData);
    } catch (error) {
        console.warn('Failed to record personal workout:', error);
    }
}

/**
 * Parse instruction and safety from description
 */
function parseInstructionAndSafety(description) {
    const parts = description.split('⚠️');
    const instruction = (parts[0] || '').trim();
    const safety = (parts[1] || '').trim();
    return { instruction, safety };
}

/**
 * Parse DO/DON'T from safety guidelines
 */
function parseDoDont(safetyGuidelines) {
    if (!safetyGuidelines) return { doText: '', dontText: '' };
    const doMatch = safetyGuidelines.match(/DO:\s*(.+?)\.\s*DON'T:/i);
    const dontMatch = safetyGuidelines.match(/DON'T:\s*(.+)/i);
    return {
        doText: doMatch ? doMatch[1].trim() : '',
        dontText: dontMatch ? dontMatch[1].trim() : ''
    };
}

/**
 * Vibrate device
 */
function vibrate(pattern = 200) {
    if (!workoutState.enableVibration) return;
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

/**
 * Play beep sound
 */
function beep(durationMs = 180, frequency = 880, volume = 0.1) {
    if (!workoutState.enableSound) return;
    try {
        if (!workoutState.audioContext) {
            workoutState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = workoutState.audioContext;
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.value = volume;
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, durationMs);
    } catch {}
}

/**
 * Cue phase with sound and vibration
 */
function cuePhase(phase) {
    if (phase === 'work') {
        beep(150, 900); 
        vibrate([120, 60, 120]);
    } else {
        beep(150, 500); 
        vibrate(160);
    }
}

/**
 * Speak text (if speech synthesis is available)
 */
function speak(text) {
    if (!workoutState.enableSound) return;
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

/**
 * Setup workout player event listeners
 */

/**
 * Ensure elements are ready before setting up event listeners
 */
function ensureElementsReady() {
    return new Promise((resolve) => {
        const checkElements = () => {
            const soundToggle = document.getElementById('sound-toggle');
            const vibrationToggle = document.getElementById('vibration-toggle');
            const exitBtn = document.getElementById('exit-workout-btn');
            
            if (soundToggle && vibrationToggle && exitBtn) {
                resolve(true);
            } else {
                setTimeout(checkElements, 100);
            }
        };
        checkElements();
    });
}


/**
 * Debug checkbox state and clickability
 */

/**
 * Debug exit button state and clickability
 */
function debugExitButton() {
    const exitBtn = document.getElementById('exit-workout-btn');
    
    if (exitBtn) {
        console.log('🔍 Exit button debug:', {
            element: exitBtn,
            disabled: exitBtn.disabled,
            style: exitBtn.style.cssText,
            computedStyle: window.getComputedStyle(exitBtn),
            pointerEvents: window.getComputedStyle(exitBtn).pointerEvents,
            zIndex: window.getComputedStyle(exitBtn).zIndex,
            position: window.getComputedStyle(exitBtn).position,
            cursor: window.getComputedStyle(exitBtn).cursor,
            opacity: window.getComputedStyle(exitBtn).opacity,
            visibility: window.getComputedStyle(exitBtn).visibility,
            display: window.getComputedStyle(exitBtn).display
        });
        
        // Force clickable
        exitBtn.style.pointerEvents = 'auto';
        exitBtn.style.cursor = 'pointer';
        exitBtn.style.zIndex = '1000';
        exitBtn.style.position = 'relative';
        exitBtn.style.opacity = '1';
        exitBtn.style.visibility = 'visible';
        exitBtn.style.display = 'inline-block';
        exitBtn.disabled = false;
        
        // Add click event for debugging
        exitBtn.addEventListener('click', (e) => {
            console.log('🚪 Exit button clicked!', e);
            e.preventDefault();
            e.stopPropagation();
        });
        
        // Also add mousedown and mouseup events
        exitBtn.addEventListener('mousedown', (e) => {
            console.log('🚪 Exit button mousedown!', e);
        });
        
        exitBtn.addEventListener('mouseup', (e) => {
            console.log('🚪 Exit button mouseup!', e);
        });
        
        console.log('✅ Exit button debugging setup complete');
    } else {
        console.error('❌ Exit button not found');
    }
}

function debugCheckboxes() {
    const soundToggle = document.getElementById('sound-toggle');
    const vibrationToggle = document.getElementById('vibration-toggle');
    
    if (soundToggle) {
        console.log('🔍 Sound toggle debug:', {
            element: soundToggle,
            checked: soundToggle.checked,
            disabled: soundToggle.disabled,
            style: soundToggle.style.cssText,
            computedStyle: window.getComputedStyle(soundToggle),
            pointerEvents: window.getComputedStyle(soundToggle).pointerEvents,
            zIndex: window.getComputedStyle(soundToggle).zIndex,
            position: window.getComputedStyle(soundToggle).position
        });
        
        // Force clickable
        soundToggle.style.pointerEvents = 'auto';
        soundToggle.style.cursor = 'pointer';
        soundToggle.style.zIndex = '1000';
        soundToggle.style.position = 'relative';
        soundToggle.disabled = false;
        
        // Add click event for debugging
        soundToggle.addEventListener('click', (e) => {
            console.log('🔊 Sound toggle clicked!', e.target.checked);
        });
    }
    
    if (vibrationToggle) {
        console.log('🔍 Vibration toggle debug:', {
            element: vibrationToggle,
            checked: vibrationToggle.checked,
            disabled: vibrationToggle.disabled,
            style: vibrationToggle.style.cssText,
            computedStyle: window.getComputedStyle(vibrationToggle),
            pointerEvents: window.getComputedStyle(vibrationToggle).pointerEvents,
            zIndex: window.getComputedStyle(vibrationToggle).zIndex,
            position: window.getComputedStyle(vibrationToggle).position
        });
        
        // Force clickable
        vibrationToggle.style.pointerEvents = 'auto';
        vibrationToggle.style.cursor = 'pointer';
        vibrationToggle.style.zIndex = '1000';
        vibrationToggle.style.position = 'relative';
        vibrationToggle.disabled = false;
        
        // Add click event for debugging
        vibrationToggle.addEventListener('click', (e) => {
            console.log('📳 Vibration toggle clicked!', e.target.checked);
        });
    }
}

export async function setupWorkoutPlayerListeners() {
    console.log('🎮 setupWorkoutPlayerListeners called');
    console.log('🔍 window.appState:', window.appState);
    console.log('🔍 workoutState:', workoutState);
    // Wait for elements to be ready
    await ensureElementsReady();
    console.log('🎮 Setting up workout player event listeners...');
    // Debug checkboxes
    debugCheckboxes();
    // Debug exit button
    debugExitButton();
    // Pause/Resume button
    const pauseBtn = document.getElementById('pause-resume-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePause);
    }
    
    // Previous exercise button
    const prevBtn = document.getElementById('prev-exercise-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', previousExercise);
    }
    
    // Next exercise button
    const nextBtn = document.getElementById('next-exercise-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', nextExercise);
    }
    
    // Exit workout button
    const exitBtn = document.getElementById('exit-workout-btn');
    if (exitBtn) {
        exitBtn.disabled = false; // Ensure it's not disabled
        exitBtn.style.pointerEvents = 'auto'; // Ensure it's clickable
        exitBtn.addEventListener('click', (e) => {
            console.log('🚪 Exit workout button clicked');
            exitWorkout();
        });
        console.log('✅ Exit workout button initialized');
    } else {
        console.error('❌ Exit workout button not found');
    }
    
    // Create new workout button (from workout overview)
    const newWorkoutBtn = document.getElementById('new-workout-btn');
    if (newWorkoutBtn) {
        newWorkoutBtn.addEventListener('click', () => {
            // Reset workout state
            window.currentWorkout = null;
            window.currentWorkoutData = null;
            
            // Show the form and hide workout sections
            const form = document.getElementById('workout-form');
            const workoutPlan = document.getElementById('workout-plan');
            const workoutSection = document.getElementById('workout-section');
            const workoutOverview = document.getElementById('workout-overview');
            const workoutPlayer = document.getElementById('workout-player');
            const noResults = document.getElementById('no-results');
            
            // Show form container and form (ensure they're visible)
            if (workoutPlan) {
                workoutPlan.classList.remove('hidden');
                workoutPlan.style.display = 'block';
            }
            if (form) {
                form.classList.remove('hidden');
                form.style.display = 'block';
            }
            
            // Hide all workout-related sections
            if (workoutSection) workoutSection.classList.add('hidden');
            if (workoutOverview) workoutOverview.classList.add('hidden');
            if (workoutPlayer) workoutPlayer.classList.add('hidden');
            if (noResults) noResults.classList.add('hidden');
            
            // Scroll back to form
            form?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    
    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        // Ensure we have a valid state
        const currentState = window.appState || workoutState;
        
        // Initialize checkbox state
        soundToggle.checked = currentState.enableSound !== false; // Default to true if undefined
        soundToggle.disabled = false; // Ensure it's not disabled
        soundToggle.style.pointerEvents = 'auto'; // Ensure it's clickable
        
        soundToggle.addEventListener('change', (e) => {
            const newValue = e.target.checked;
            workoutState.enableSound = newValue;
            // Also update main app state if it exists
            if (window.appState) {
                window.appState.enableSound = newValue;
            }
            console.log('🔊 Sound toggle changed to:', newValue);
        });
        
        console.log('✅ Sound toggle initialized:', soundToggle.checked);
    } else {
        console.error('❌ Sound toggle element not found');
    }
    
    // Vibration toggle
    const vibrationToggle = document.getElementById('vibration-toggle');
    if (vibrationToggle) {
        // Ensure we have a valid state
        const currentState = window.appState || workoutState;
        
        // Initialize checkbox state
        vibrationToggle.checked = currentState.enableVibration !== false; // Default to true if undefined
        vibrationToggle.disabled = false; // Ensure it's not disabled
        vibrationToggle.style.pointerEvents = 'auto'; // Ensure it's clickable
        
        vibrationToggle.addEventListener('change', (e) => {
            const newValue = e.target.checked;
            workoutState.enableVibration = newValue;
            // Also update main app state if it exists
            if (window.appState) {
                window.appState.enableVibration = newValue;
            }
            console.log('📳 Vibration toggle changed to:', newValue);
        });
        
        console.log('✅ Vibration toggle initialized:', vibrationToggle.checked);
    } else {
        console.error('❌ Vibration toggle element not found');
    }
    
    // Rest overlay close button
    const overlayExitBtn = document.getElementById('overlay-exit-btn');
    if (overlayExitBtn) {
        overlayExitBtn.addEventListener('click', () => {
            const restOverlay = document.getElementById('rest-overlay');
            if (restOverlay) {
                restOverlay.classList.add('hidden');
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        const playerScreen = document.getElementById('workout-player');
        if (!playerScreen || playerScreen.classList.contains('hidden')) return;
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
        
        switch (e.key) {
            case ' ':
                e.preventDefault();
                togglePause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                previousExercise();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextExercise();
                break;
            case 'Escape':
                e.preventDefault();
                exitWorkout();
                break;
        }
    });
}

// Make functions available globally for backward compatibility
window.startWorkout = function() {
    console.log('🏃 Starting workout...');
    console.log('🔍 Debug - window.currentWorkoutData:', window.currentWorkoutData);
    console.log('🔍 Debug - window.currentWorkout:', window.currentWorkout);
    
    // Always try to get timing from the form first (most reliable)
    let workTime = 45; // Default work time
    let restTime = 15; // Default rest time
    
    try {
        const workTimeInput = document.getElementById('work-time');
        const restTimeInput = document.getElementById('rest-time');
        
        if (workTimeInput && workTimeInput.value) {
            workTime = parseInt(workTimeInput.value);
            console.log('🔍 Found work time from form:', workTime);
        }
        
        if (restTimeInput && restTimeInput.value) {
            restTime = parseInt(restTimeInput.value);
            console.log('🔍 Found rest time from form:', restTime);
        }
    } catch (error) {
        console.log('⚠️ Could not extract timing from form, using defaults:', error);
    }
    
    // Get current workout data from global state
    if (window.currentWorkoutData) {
        console.log('📊 Using currentWorkoutData with form timing override');
        // Use the complete workout data but override timing with form values
        const workoutData = {
            ...window.currentWorkoutData,
            workTime: workTime,
            restTime: restTime
        };
        console.log('📊 Final workoutData:', workoutData);
        initializeWorkoutPlayer(workoutData);
    } else if (window.currentWorkout && window.currentWorkout.length > 0) {
        console.log('⚠️ Using legacy format with form timing');
        
        const workoutData = {
            sequence: window.currentWorkout,
            workTime: workTime,
            restTime: restTime
        };
        
        console.log('⚠️ Using fallback workoutData with form timing:', workoutData);
        initializeWorkoutPlayer(workoutData);
    } else {
        alert('No workout available. Please generate a workout first.');
    }
};

window.togglePause = togglePause;
window.previousExercise = previousExercise;
window.nextExercise = nextExercise;
window.exitWorkout = exitWorkout;
window.initializeWorkoutPlayer = initializeWorkoutPlayer;
