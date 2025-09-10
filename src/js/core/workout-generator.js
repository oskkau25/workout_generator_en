/**
 * Core Workout Generator Module
 * Contains all the main workout generation logic and form handling
 */

import { exercises } from './exercise-database.js';
import { initializeWorkoutPlayer } from '../features/workout-player.js';
import { enhanceWorkoutWithSubstitutions } from '../features/smart-substitution.js';

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

    // Normalize equipment to an array (supports multiple selections)
    const selectedEquipments = Array.isArray(equipment) ? equipment : [equipment];

    // Filter MAIN exercises based on user preferences (equipment + level)
    const availableMainExercises = exercises.filter(ex => {
        if (ex.type !== 'main') return false;
        const equipmentMatch = selectedEquipments.includes(ex.equipment);
        const levelMatch = ex.level === level || (Array.isArray(ex.level) && ex.level.includes(level));
        return equipmentMatch && levelMatch;
    });

    // Generate workout based on training pattern
    let workout = [];
    
    switch (trainingPattern.toLowerCase()) {
        case 'circuit':
            workout = generateCircuitWorkout(availableMainExercises, duration, patternSettings);
            break;
        case 'tabata':
            workout = generateTabataWorkout(availableMainExercises, duration, patternSettings);
            break;
        case 'pyramid':
            workout = generatePyramidWorkout(availableMainExercises, duration, patternSettings);
            break;
        default:
            workout = generateStandardWorkout(availableMainExercises, duration);
    }

    // Enhance workout with smart substitutions
    const userPreferences = {
        equipment: selectedEquipments,
        fitnessLevel: level,
        targetMuscleGroups: [] // Could be enhanced to track user preferences
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
            estimatedTime: duration, // Use user's selected duration
            level,
            equipment: Array.isArray(equipment) ? equipment.join(', ') : equipment
        }
    };
}

/**
 * Generate standard workout
 */
function generateStandardWorkout(availableExercises, duration) {
    // Warm-up and Cool-down always from full catalog (typically Bodyweight)
    const warmupExercises = exercises.filter(ex => ex.type === 'warmup');
    const mainExercises = availableExercises; // already filtered for equipment
    const cooldownExercises = exercises.filter(ex => ex.type === 'cooldown');

    const workout = [];
    
    // Add warmup (8-10 exercises for ~5 minutes)
    const selectedWarmup = selectRandomExercises(warmupExercises, 8).map(ex => ({...ex, _section: 'Warm-up', _noRest: true}));
    workout.push(...selectedWarmup);
    
    // Add main exercises based on duration
    const mainCount = Math.max(6, Math.floor(duration / 3));
    const selectedMain = selectRandomExercises(mainExercises, mainCount).map(ex => ({...ex, _section: 'Main'}));
    workout.push(...selectedMain);
    
    // Add cooldown (8-10 exercises for ~5 minutes)
    const selectedCooldown = selectRandomExercises(cooldownExercises, 8).map(ex => ({...ex, _section: 'Cool-down', _noRest: true}));
    workout.push(...selectedCooldown);
    
    return workout;
}

/**
 * Generate circuit training workout
 */
function generateCircuitWorkout(availableExercises, duration, settings) {
    const rounds = settings.rounds || Math.max(2, Math.min(6, Math.floor(duration / 10)));
    const exercisesPerRound = settings.exercisesPerRound || 6;
    
    const mainExercises = availableExercises; // already filtered for equipment
    const workout = [];
    
    // Add warmup (from full catalog) - 8 exercises for ~5 minutes
    const warmupExercises = exercises.filter(ex => ex.type === 'warmup');
    const selectedWarmup = selectRandomExercises(warmupExercises, 8).map(ex => ({...ex, _section: 'Warm-up', _noRest: true}));
    workout.push(...selectedWarmup);
    
    // Select exercises for the circuit ONCE
    const circuitExercises = selectRandomExercises(mainExercises, exercisesPerRound);
    
    // Add circuit rounds - each round uses the SAME exercises
    for (let round = 1; round <= rounds; round++) {
        workout.push({
            type: 'circuit_round',
            name: `Circuit Round ${round}`,
            description: `Complete all ${exercisesPerRound} exercises in this circuit, then repeat for next round`,
            round: round,
            totalRounds: rounds
        });
        
        // Add the SAME exercises for each round
        const roundExercises = circuitExercises.map((ex, index) => ({
            ...ex, 
            _section: 'Main',
            _circuitPosition: index + 1,
            _totalInCircuit: exercisesPerRound
        }));
        workout.push(...roundExercises);
    }
    
    // Add cooldown (from full catalog) - 8 exercises for ~5 minutes
    const cooldownExercises = exercises.filter(ex => ex.type === 'cooldown');
    const selectedCooldown = selectRandomExercises(cooldownExercises, 8).map(ex => ({...ex, _section: 'Cool-down', _noRest: true}));
    workout.push(...selectedCooldown);
    
    return workout;
}

/**
 * Generate Tabata workout
 */
function generateTabataWorkout(availableExercises, duration, settings) {
    const rounds = settings.rounds || Math.max(4, Math.min(12, Math.floor(duration / 5)));
    
    const mainExercises = availableExercises; // already filtered for equipment
    const workout = [];
    
    // Add warmup (from full catalog) - 8 exercises for ~5 minutes
    const warmupExercises = exercises.filter(ex => ex.type === 'warmup');
    const selectedWarmup = selectRandomExercises(warmupExercises, 8).map(ex => ({...ex, _section: 'Warm-up', _noRest: true}));
    workout.push(...selectedWarmup);
    
    // Select one exercise for all Tabata sets
    const tabataExercise = selectRandomExercises(mainExercises, 1)[0];
    
    // Add Tabata sets
    for (let set = 1; set <= rounds; set++) {
        workout.push({
            type: 'tabata_set',
            name: `Tabata Set ${set}`,
            description: `20 seconds work, 10 seconds rest, repeat 8 times`,
            set: set,
            totalSets: rounds
        });
        
        if (tabataExercise) workout.push({...tabataExercise, _section: 'Main'});
    }
    
    // Add cooldown (from full catalog) - 8 exercises for ~5 minutes
    const cooldownExercises = exercises.filter(ex => ex.type === 'cooldown');
    const selectedCooldown = selectRandomExercises(cooldownExercises, 8).map(ex => ({...ex, _section: 'Cool-down', _noRest: true}));
    workout.push(...selectedCooldown);
    
    return workout;
}

/**
 * Generate pyramid workout
 */
function generatePyramidWorkout(availableExercises, duration, settings) {
    const levels = settings.levels || Math.max(3, Math.min(7, Math.floor(duration / 8)));
    
    const mainExercises = availableExercises; // already filtered for equipment
    const workout = [];
    
    // Add warmup (from full catalog) - 8 exercises for ~5 minutes
    const warmupExercises = exercises.filter(ex => ex.type === 'warmup');
    const selectedWarmup = selectRandomExercises(warmupExercises, 8).map(ex => ({...ex, _section: 'Warm-up', _noRest: true}));
    workout.push(...selectedWarmup);
    
    // Select exercises for the pyramid (same exercises for all levels)
    const pyramidExercises = selectRandomExercises(mainExercises, 2);
    
    // Add pyramid levels
    for (let level = 1; level <= levels; level++) {
        workout.push({
            type: 'pyramid_set',
            name: `Pyramid Level ${level}`,
            description: `Intensity level ${level} of ${levels}`,
            level: level,
            totalLevels: levels
        });
        
        // Use the same exercises for each level
        const levelExercises = pyramidExercises.map(ex => ({...ex, _section: 'Main'}));
        workout.push(...levelExercises);
    }
    
    // Add cooldown (from full catalog) - 8 exercises for ~5 minutes
    const cooldownExercises = exercises.filter(ex => ex.type === 'cooldown');
    const selectedCooldown = selectRandomExercises(cooldownExercises, 8).map(ex => ({...ex, _section: 'Cool-down', _noRest: true}));
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
    // Get selected equipment (checkboxes) - use FormData to get all selected equipment
    const selectedEquipment = formData.getAll('equipment');
    data.equipment = selectedEquipment.length > 0 ? selectedEquipment : ['Bodyweight'];
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
        console.log('🔍 About to validate form...');
        validateForm();
        console.log('✅ Form validation passed');
        
        // Get form data
        console.log('🔍 About to get form data...');
        const formData = getFormData();
        console.log('📋 Form data:', formData);
        
        // Generate workout
        console.log('🔍 About to generate workout...');
        const workoutResult = generateWorkout(formData);
        console.log('✅ Workout generated:', workoutResult);
        console.log('🚨 ABOUT TO CALL displayWorkout with workTime:', workoutResult.workTime, 'restTime:', workoutResult.restTime);
        
        // Display workout
        console.log('🚨 CALLING displayWorkout NOW...');
        try {
            displayWorkout(workoutResult);
            console.log('🚨 AFTER displayWorkout call - window.currentWorkoutData:', window.currentWorkoutData);
        } catch (error) {
            console.error('❌ Error in displayWorkout:', error);
        }
        console.log('🚨 CONTINUING AFTER displayWorkout...');
        
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
    console.log('🚨🚨🚨 displayWorkout FUNCTION CALLED! 🚨🚨🚨');
    const { workout, duration, workTime, restTime, trainingPattern, metadata } = workoutResult;
    
    console.log('📋 displayWorkout called with:', { workTime, restTime, duration });
    
    // Persist current workout in memory for interactive operations (e.g., swapping)
    window.currentWorkout = workout;
    window.currentWorkoutMeta = metadata;
    window.currentWorkoutData = {
        sequence: workout,
        workTime: workTime,
        restTime: restTime,
        duration: duration,
        trainingPattern: trainingPattern,
        metadata: metadata
    };
    
    console.log('💾 Stored window.currentWorkoutData:', window.currentWorkoutData);

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
    let currentSection = '';
    const exerciseHTML = workout.map((exercise, index) => {
        // Insert section headers when section changes
        let header = '';
        if (exercise._section && exercise._section !== currentSection) {
            currentSection = exercise._section;
            const badgeColor = currentSection === 'Warm-up' ? 'bg-amber-100 text-amber-700' : currentSection === 'Cool-down' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
            header = `
                <div class="mt-6 mb-2">
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}">${currentSection}</span>
                </div>
            `;
        }
        if (['circuit_round', 'tabata_set', 'pyramid_set'].includes(exercise.type)) {
            return `
                ${header}
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
            ${header}
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

// Note: window.startWorkout is defined in workout-player.js

// Make functions available globally for backward compatibility
window.generateWorkout = generateWorkout;
window.validateForm = validateForm;
window.getFormData = getFormData;
window.handleFormSubmission = handleFormSubmission;
