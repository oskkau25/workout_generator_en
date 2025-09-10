/**
 * Workout Player Module
 * Handles the workout execution, timers, and player interface
 */

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
 * Initialize workout player with workout data
 */
export function initializeWorkoutPlayer(workoutData) {
    console.log('🎮 Initializing workout player with data:', workoutData);
    workoutState.sequence = workoutData.sequence || [];
    workoutState.workTime = workoutData.workTime || 45;
    workoutState.restTime = workoutData.restTime || 15;
    console.log('⏱️ Set workTime:', workoutState.workTime, 'restTime:', workoutState.restTime);
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
    if (exerciseProgress) exerciseProgress.textContent = `Exercise ${workoutState.currentIndex + 1} of ${workoutState.sequence.length}`;
    if (sectionBadge) sectionBadge.textContent = currentExercise._section || 'Exercise';
    
    // Update exercise display
    const exerciseTitle = document.getElementById('exercise-title');
    const exerciseMeta = document.getElementById('exercise-meta');
    const exerciseInstructions = document.getElementById('exercise-instructions');
    const exerciseSafety = document.getElementById('exercise-safety');
    
    if (exerciseTitle) exerciseTitle.textContent = currentExercise.name;
    if (exerciseMeta) {
        exerciseMeta.innerHTML = `
            <span class="inline-block px-3 py-1 bg-fit-primary/10 text-fit-primary rounded-full text-sm font-medium mr-2">${currentExercise.muscle}</span>
            <span class="inline-block px-3 py-1 bg-fit-secondary/10 text-fit-secondary rounded-full text-sm font-medium">${currentExercise.equipment}</span>
        `;
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
    toggleScreens({ overview: true, player: false, plan: false });
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
