/**
 * Core Workout Generator Module
 * Contains all the main workout generation logic and form handling
 */

import { exercises } from './exercise-database.js';
import { enhanceWorkoutWithSubstitutions } from '../features/smart-substitution.js';
import { initializeWorkoutPlayer } from '../features/workout-player.js';

/**
 * Main workout generation function
 * This is the core function that creates workouts based on user preferences
 */
export function generateWorkout(formData) {
    const {
        level = 'Intermediate',
        duration = 30,
        equipment = 'Bodyweight',
        workTime = 45,
        restTime = 15,
        trainingPattern = 'Standard',
        patternSettings = {}
    } = formData;

    console.log('🏋️ Generating workout with:', formData);

    // Filter exercises based on user preferences
    const availableExercises = exercises.filter(ex => {
        // Check equipment compatibility
        const equipmentMatch = ex.equipment === equipment || ex.equipment === 'Bodyweight';
        
        // Check fitness level compatibility
        const levelMatch = ex.level === level || 
            (Array.isArray(ex.level) && ex.level.includes(level));
        
        return equipmentMatch && levelMatch;
    });

    console.log(`📊 Found ${availableExercises.length} compatible exercises`);

    // Generate workout based on training pattern
    let workout = [];
    
    switch (trainingPattern.toLowerCase()) {
        case 'circuit':
            workout = generateCircuitWorkout(availableExercises, duration, patternSettings);
            break;
        case 'tabata':
            workout = generateTabataWorkout(availableExercises, duration, patternSettings);
            break;
        case 'pyramid':
            workout = generatePyramidWorkout(availableExercises, duration, patternSettings);
            break;
        default:
            workout = generateStandardWorkout(availableExercises, duration);
    }

    console.log(`✅ Generated ${workout.length} exercise workout`);

    // Enhance with smart substitutions
    const userPreferences = {
        equipment: [equipment],
        fitnessLevel: level,
        avoidInjuries: [],
        targetMuscleGroups: []
    };
    
    const enhancedWorkout = enhanceWorkoutWithSubstitutions(workout, userPreferences);
    
    return {
        workout: enhancedWorkout,
        duration,
        workTime,
        restTime,
        trainingPattern,
        metadata: {
            totalExercises: enhancedWorkout.length,
            estimatedTime: calculateWorkoutTime(enhancedWorkout, workTime, restTime),
            level,
            equipment
        }
    };
}

/**
 * Generate standard workout
 */
function generateStandardWorkout(availableExercises, duration) {
    const warmupExercises = availableExercises.filter(ex => ex.type === 'warmup');
    const mainExercises = availableExercises.filter(ex => ex.type === 'main');
    const cooldownExercises = availableExercises.filter(ex => ex.type === 'cooldown');

    const workout = [];
    
    // Add warmup (3-5 exercises)
    const selectedWarmup = selectRandomExercises(warmupExercises, 4);
    workout.push(...selectedWarmup);
    
    // Add main exercises based on duration
    const mainCount = Math.max(6, Math.floor(duration / 3));
    const selectedMain = selectRandomExercises(mainExercises, mainCount);
    workout.push(...selectedMain);
    
    // Add cooldown (2-3 exercises)
    const selectedCooldown = selectRandomExercises(cooldownExercises, 3);
    workout.push(...selectedCooldown);
    
    return workout;
}

/**
 * Generate circuit training workout
 */
function generateCircuitWorkout(availableExercises, duration, settings) {
    const rounds = settings.rounds || Math.max(2, Math.min(6, Math.floor(duration / 10)));
    const exercisesPerRound = settings.exercisesPerRound || 6;
    
    const mainExercises = availableExercises.filter(ex => ex.type === 'main');
    const workout = [];
    
    // Add warmup
    const warmupExercises = availableExercises.filter(ex => ex.type === 'warmup');
    const selectedWarmup = selectRandomExercises(warmupExercises, 3);
    workout.push(...selectedWarmup);
    
    // Add circuit rounds
    for (let round = 1; round <= rounds; round++) {
        workout.push({
            type: 'circuit_round',
            name: `Circuit Round ${round}`,
            description: `Complete all exercises in this round before moving to the next`,
            round: round,
            totalRounds: rounds
        });
        
        const roundExercises = selectRandomExercises(mainExercises, exercisesPerRound);
        workout.push(...roundExercises);
    }
    
    // Add cooldown
    const cooldownExercises = availableExercises.filter(ex => ex.type === 'cooldown');
    const selectedCooldown = selectRandomExercises(cooldownExercises, 2);
    workout.push(...selectedCooldown);
    
    return workout;
}

/**
 * Generate Tabata workout
 */
function generateTabataWorkout(availableExercises, duration, settings) {
    const rounds = settings.rounds || Math.max(4, Math.min(12, Math.floor(duration / 5)));
    
    const mainExercises = availableExercises.filter(ex => ex.type === 'main');
    const workout = [];
    
    // Add warmup
    const warmupExercises = availableExercises.filter(ex => ex.type === 'warmup');
    const selectedWarmup = selectRandomExercises(warmupExercises, 3);
    workout.push(...selectedWarmup);
    
    // Add Tabata sets
    for (let set = 1; set <= rounds; set++) {
        workout.push({
            type: 'tabata_set',
            name: `Tabata Set ${set}`,
            description: `20 seconds work, 10 seconds rest, repeat 8 times`,
            set: set,
            totalSets: rounds
        });
        
        const setExercise = selectRandomExercises(mainExercises, 1)[0];
        workout.push(setExercise);
    }
    
    // Add cooldown
    const cooldownExercises = availableExercises.filter(ex => ex.type === 'cooldown');
    const selectedCooldown = selectRandomExercises(cooldownExercises, 2);
    workout.push(...selectedCooldown);
    
    return workout;
}

/**
 * Generate pyramid workout
 */
function generatePyramidWorkout(availableExercises, duration, settings) {
    const levels = settings.levels || Math.max(3, Math.min(7, Math.floor(duration / 8)));
    
    const mainExercises = availableExercises.filter(ex => ex.type === 'main');
    const workout = [];
    
    // Add warmup
    const warmupExercises = availableExercises.filter(ex => ex.type === 'warmup');
    const selectedWarmup = selectRandomExercises(warmupExercises, 3);
    workout.push(...selectedWarmup);
    
    // Add pyramid levels
    for (let level = 1; level <= levels; level++) {
        workout.push({
            type: 'pyramid_set',
            name: `Pyramid Level ${level}`,
            description: `Intensity level ${level} of ${levels}`,
            level: level,
            totalLevels: levels
        });
        
        const levelExercises = selectRandomExercises(mainExercises, 2);
        workout.push(...levelExercises);
    }
    
    // Add cooldown
    const cooldownExercises = availableExercises.filter(ex => ex.type === 'cooldown');
    const selectedCooldown = selectRandomExercises(cooldownExercises, 2);
    workout.push(...selectedCooldown);
    
    return workout;
}

/**
 * Select random exercises from a list
 */
function selectRandomExercises(exercises, count) {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, exercises.length));
}

/**
 * Calculate estimated workout time
 */
function calculateWorkoutTime(workout, workTime, restTime) {
    const exerciseCount = workout.filter(ex => 
        !['circuit_round', 'tabata_set', 'pyramid_set'].includes(ex.type)
    ).length;
    
    return Math.round((exerciseCount * workTime + (exerciseCount - 1) * restTime) / 60);
}

/**
 * Validate form data
 */
export function validateForm() {
    const level = document.getElementById('fitness-level')?.value;
    const duration = document.querySelector('input[name="duration"]:checked')?.value;
    const workTime = document.getElementById('work-time')?.value;
    const restTime = document.getElementById('rest-time')?.value;
    
    if (!level || !duration) {
        throw new Error('Please select fitness level and duration');
    }
    
    if (parseInt(workTime) < 10 || parseInt(restTime) < 5) {
        throw new Error('Work time must be at least 10s and rest time at least 5s');
    }
    
    return true;
}

/**
 * Get form data
 */
export function getFormData() {
    const form = document.getElementById('workout-form');
    if (!form) throw new Error('Workout form not found');
    
    const formData = new FormData(form);
    const data = {};
    
    // Get basic form data
    data.level = formData.get('fitness-level') || 'Intermediate';
    data.duration = parseInt(formData.get('duration')) || 30;
    data.equipment = formData.get('equipment') || 'Bodyweight';
    data.workTime = parseInt(document.getElementById('work-time')?.value) || 45;
    data.restTime = parseInt(document.getElementById('rest-time')?.value) || 15;
    data.trainingPattern = formData.get('training-pattern') || 'Standard';
    
    // Get pattern-specific settings
    data.patternSettings = {};
    
    if (data.trainingPattern === 'Circuit') {
        data.patternSettings.rounds = parseInt(document.getElementById('circuit-rounds')?.value) || 3;
        data.patternSettings.exercisesPerRound = parseInt(document.getElementById('circuit-exercises')?.value) || 6;
    } else if (data.trainingPattern === 'Tabata') {
        data.patternSettings.rounds = parseInt(document.getElementById('tabata-rounds')?.value) || 8;
    } else if (data.trainingPattern === 'Pyramid') {
        data.patternSettings.levels = parseInt(document.getElementById('pyramid-levels')?.value) || 5;
    }
    
    return data;
}

/**
 * Handle form submission
 */
export function handleFormSubmission(event) {
    event.preventDefault();
    
    try {
        console.log('🚀 Form submitted, generating workout...');
        
        // Validate form
        validateForm();
        
        // Get form data
        const formData = getFormData();
        console.log('📋 Form data:', formData);
        
        // Generate workout
        const workoutResult = generateWorkout(formData);
        console.log('✅ Workout generated:', workoutResult);
        
        // Display workout
        displayWorkout(workoutResult);
        
        // Track analytics
        if (window.analytics) {
            window.analytics.trackEvent('workout_generated', {
                pattern: formData.trainingPattern,
                duration: formData.duration,
                level: formData.level,
                equipment: formData.equipment
            });
        }
        
    } catch (error) {
        console.error('❌ Error generating workout:', error);
        showError(error.message);
    }
}

/**
 * Display generated workout
 */
function displayWorkout(workoutResult) {
    const { workout, duration, workTime, restTime, trainingPattern, metadata } = workoutResult;
    
    // Persist current workout in memory for interactive operations (e.g., swapping)
    window.currentWorkout = workout;
    window.currentWorkoutMeta = metadata;

    // Hide form and show workout
    const form = document.getElementById('workout-form');
    const workoutSection = document.getElementById('workout-section');
    
    if (form) form.style.display = 'none';
    if (workoutSection) {
        workoutSection.style.display = 'block';
        workoutSection.innerHTML = generateWorkoutHTML(workout, metadata);
    }
    
    // Scroll to workout
    workoutSection?.scrollIntoView({ behavior: 'smooth' });
}

// Create a brief description for list view (first sentence / before warnings)
function brief(text = '') {
    if (!text) return '';
    const warn = text.indexOf('⚠️');
    const base = warn > -1 ? text.slice(0, warn).trim() : text.trim();
    const m = base.match(/^[^.!?]{20,200}[.!?]/);
    if (m) return m[0].trim();
    return base.length > 180 ? base.slice(0, 177).trim() + '…' : base;
}

/**
 * Generate workout HTML
 */
function generateWorkoutHTML(workout, metadata) {
    const exerciseHTML = workout.map((exercise, index) => {
        if (['circuit_round', 'tabata_set', 'pyramid_set'].includes(exercise.type)) {
            return `
                <div class="section-header ${exercise.type}">
                    <h3 class="text-lg font-bold text-fit-primary">${exercise.name}</h3>
                    <p class="text-fit-secondary text-sm">${exercise.description}</p>
                </div>
            `;
        }
        
        const hasSubstitution = exercise._hasSubstitution && exercise._substitution;
        const substitutionButton = hasSubstitution ? 
            `<button onclick="showSubstitutionChooser(${index})" class="px-3 py-1 bg-fit-accent text-white text-xs rounded-full hover:bg-fit-accent/80 transition-colors">
                🧠 Smart Alternative
            </button>` : '';
        
        return `
            <div id="exercise-item-${index}" class="exercise-item p-4 bg-white rounded-lg border border-gray-200 hover:border-fit-primary transition-colors" data-index="${index}">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold text-fit-dark" data-field="name">${exercise.name}</h4>
                    <div class="flex space-x-2">
                        ${substitutionButton}
                        <span class="px-2 py-1 bg-fit-primary text-white text-xs rounded-full" data-field="level">${exercise.level}</span>
                    </div>
                </div>
                <p class="text-fit-secondary text-sm mb-2" data-field="description">${brief(exercise.description)}</p>
                <div class="flex justify-between items-center text-xs text-fit-secondary">
                    <span data-field="equipment">Equipment: ${exercise.equipment}</span>
                    <span data-field="muscle">Muscle: ${exercise.muscle}</span>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="workout-overview">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-fit-dark">Your Workout</h2>
                <button onclick="startWorkout()" class="btn-primary">
                    Start Workout
                </button>
            </div>
            
            <div class="workout-stats grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="stat-card p-3 bg-fit-primary/10 rounded-lg text-center">
                    <div class="text-2xl font-bold text-fit-primary">${metadata.totalExercises}</div>
                    <div class="text-xs text-fit-secondary">Exercises</div>
                </div>
                <div class="stat-card p-3 bg-fit-accent/10 rounded-lg text-center">
                    <div class="text-2xl font-bold text-fit-accent">${metadata.estimatedTime}min</div>
                    <div class="text-xs text-fit-secondary">Duration</div>
                </div>
                <div class="stat-card p-3 bg-green-100 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">${metadata.level}</div>
                    <div class="text-xs text-fit-secondary">Level</div>
                </div>
                <div class="stat-card p-3 bg-blue-100 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-600">${metadata.equipment}</div>
                    <div class="text-xs text-fit-secondary">Equipment</div>
                </div>
            </div>
            
            <div class="exercises-list space-y-3">
                ${exerciseHTML}
            </div>
            
            <div class="workout-actions mt-6 flex space-x-4">
                <button onclick="startWorkout()" class="btn-primary flex-1">
                    Start Workout
                </button>
                <button onclick="generateNewWorkout()" class="btn-secondary">
                    Generate New
                </button>
            </div>
        </div>
    `;
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Generate new workout (reload form)
 */
window.generateNewWorkout = function() {
    const form = document.getElementById('workout-form');
    const workoutSection = document.getElementById('workout-section');
    
    if (form) form.style.display = 'block';
    if (workoutSection) workoutSection.style.display = 'none';
    
    // Scroll back to form
    form?.scrollIntoView({ behavior: 'smooth' });
};

/**
 * Start workout using the workout player
 */
window.startWorkout = function() {
    console.log('🏃 Starting workout...');
    
    // Get current workout data from global state
    if (window.currentWorkout && window.currentWorkout.length > 0) {
        const workoutData = {
            sequence: window.currentWorkout,
            workTime: 45, // Default work time
            restTime: 15  // Default rest time
        };
        
        initializeWorkoutPlayer(workoutData);
    } else {
        alert('No workout available. Please generate a workout first.');
    }
};

// Make functions available globally for backward compatibility
window.generateWorkout = generateWorkout;
window.validateForm = validateForm;
window.getFormData = getFormData;
window.handleFormSubmission = handleFormSubmission;
