/**
 * Workout Player Module
 * Handles the workout execution, timers, and player interface
 */

/**
 * Generate search links for exercise resources
 */
function generateExerciseResources(exercise) {
    if (!exercise.resources) return '';
    
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

// Workout player state
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
    
    // Clear any existing timer
    clearRunningTimer();
    
    // Render the player
    renderWorkoutPlayer();
    
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
    clearRunningTimer();
    workoutState.isPaused = false;
    updatePauseButton();
    
    workoutState.timerId = setInterval(() => {
        if (workoutState.isPaused) return;
        workoutState.remainingSeconds -= 1;
        
        // 3-2-1 chime at end of rest
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
                    // Speak transition
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
    speak('Workout complete! Great job!');
    
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
}

/**
 * Set timer displays
 */
function setTimerDisplays() {
    const workTimer = document.getElementById('work-timer');
    const restTimer = document.getElementById('rest-timer');
    const restOverlay = document.getElementById('rest-overlay');
    const restOverlayTimer = document.getElementById('rest-overlay-timer');
    const nextName = document.getElementById('next-exercise-name');
    
    // Check if current exercise should skip rest (warm-up or cool-down)
    const currentExercise = workoutState.sequence[workoutState.currentIndex];
    const isNoRestExercise = currentExercise && currentExercise._noRest;
    
    if (workoutState.phase === 'work') {
        if (workTimer) workTimer.textContent = formatSeconds(workoutState.remainingSeconds);
        
        // Hide rest timer for warm-up and cool-down exercises
        if (restTimer) {
            if (isNoRestExercise) {
                restTimer.style.display = 'none';
            } else {
                restTimer.style.display = 'block';
                restTimer.textContent = formatSeconds(workoutState.restTime);
            }
        }
        
        if (restOverlay) restOverlay.classList.add('hidden');
    } else {
        if (workTimer) workTimer.textContent = formatSeconds(workoutState.workTime);
        if (restTimer) restTimer.textContent = formatSeconds(workoutState.remainingSeconds);
        if (restOverlay) {
            restOverlay.classList.remove('hidden');
            if (restOverlayTimer) restOverlayTimer.textContent = workoutState.remainingSeconds.toString().padStart(2, '0');
            
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
export function setupWorkoutPlayerListeners() {
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
        exitBtn.addEventListener('click', exitWorkout);
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
    
    // Create new workout button (from workout player)
    const newWorkoutFromPlayerBtn = document.getElementById('new-workout-from-player-btn');
    if (newWorkoutFromPlayerBtn) {
        newWorkoutFromPlayerBtn.addEventListener('click', () => {
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
        soundToggle.addEventListener('change', (e) => {
            workoutState.enableSound = e.target.checked;
        });
    }
    
    // Vibration toggle
    const vibrationToggle = document.getElementById('vibration-toggle');
    if (vibrationToggle) {
        vibrationToggle.addEventListener('change', (e) => {
            workoutState.enableVibration = e.target.checked;
        });
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
