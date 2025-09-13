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
    console.log('🚀 generateWorkout called with formData:', formData);
    const {
        level = 'Intermediate',
        duration = 30,
        equipment = 'Bodyweight',
        workTime = 45,
        restTime = 15,
        trainingPattern = 'Standard',
        patternSettings = {}
    } = formData;
    console.log('🚀 Extracted values - trainingPattern:', trainingPattern, 'patternSettings:', patternSettings);

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
        },
        _circuitData: enhancedWorkout._circuitData // Include circuit data in result
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
    console.log('🔄 generateCircuitWorkout called with settings:', settings);
    const rounds = settings.rounds || Math.max(2, Math.min(6, Math.floor(duration / 10)));
    const exercisesPerRound = settings.exercisesPerRound || 6;
    console.log('🔄 Using rounds:', rounds, 'exercisesPerRound:', exercisesPerRound);
    
    const mainExercises = availableExercises; // already filtered for equipment
    const workout = [];
    
    // Add warmup (from full catalog) - 8 exercises for ~5 minutes
    const warmupExercises = exercises.filter(ex => ex.type === 'warmup');
    const selectedWarmup = selectRandomExercises(warmupExercises, 8).map(ex => ({...ex, _section: 'Warm-up', _noRest: true}));
    workout.push(...selectedWarmup);
    
    // Add circuit header with exercise count and rounds info
    workout.push({
        type: 'circuit_header',
        name: `Circuit Training`,
        description: `Complete all ${exercisesPerRound} exercises, then repeat for ${rounds} total rounds`,
        rounds: rounds,
        exercisesPerRound: exercisesPerRound,
        _section: 'Main'
    });
    
    // Select exercises for the circuit ONCE
    const circuitExercises = selectRandomExercises(mainExercises, exercisesPerRound);
    
    // Add circuit exercises with metadata for preview (shows only once)
    const circuitExercisesWithMeta = circuitExercises.map((ex, index) => ({
        ...ex, 
        _section: 'Main',
        _circuitPosition: index + 1,
        _totalInCircuit: exercisesPerRound,
        _circuitRounds: rounds,
        _isCircuitExercise: true,
        _isPreviewOnly: true // Mark as preview only
    }));
    workout.push(...circuitExercisesWithMeta);
    
    // Store the circuit exercises for the actual workout (all rounds)
    // This will be used by the workout player to generate the full sequence
    workout._circuitData = {
        exercises: circuitExercises,
        rounds: rounds,
        exercisesPerRound: exercisesPerRound
    };
    
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
        !['circuit_round', 'tabata_set', 'pyramid_set', 'circuit_header'].includes(ex.type)
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
    
    if (data.trainingPattern === 'circuit') {
        data.patternSettings.rounds = parseInt(document.getElementById('circuit-rounds')?.value) || 3;
        data.patternSettings.exercisesPerRound = parseInt(document.getElementById('circuit-exercises')?.value) || 6;
        data.patternSettings.circuitRest = parseInt(document.getElementById('circuit-rest')?.value) || 60;
    } else if (data.trainingPattern === 'tabata') {
        data.patternSettings.rounds = parseInt(document.getElementById('tabata-rounds')?.value) || 8;
    } else if (data.trainingPattern === 'pyramid') {
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
        metadata: metadata,
        _circuitData: workoutResult._circuitData // Preserve circuit data from result
    };
    
    console.log('💾 Stored window.currentWorkoutData:', window.currentWorkoutData);

    // Hide form and show workout
    const form = document.getElementById('workout-form');
    const workoutSection = document.getElementById('workout-section');
    
    if (form) form.style.display = 'none';
    if (workoutSection) {
        workoutSection.style.display = 'block';
        workoutSection.innerHTML = generateWorkoutHTML(workout, metadata, workTime, restTime);
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
function generateWorkoutHTML(workout, metadata, workTime, restTime) {
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
        if (['circuit_round', 'tabata_set', 'pyramid_set', 'circuit_header'].includes(exercise.type)) {
            if (exercise.type === 'circuit_header') {
                return `
                    ${header}
                    <div class="section-header ${exercise.type} bg-gradient-to-r from-fit-primary/10 to-fit-accent/10 p-4 rounded-lg border-2 border-fit-primary/20">
                        <h3 class="text-xl font-bold text-fit-primary mb-2">${exercise.name}</h3>
                        <p class="text-fit-secondary text-sm mb-3">${exercise.description}</p>
                        <div class="flex gap-4 text-sm">
                            <span class="px-3 py-1 bg-fit-primary text-white rounded-full">${exercise.rounds} Rounds</span>
                            <span class="px-3 py-1 bg-fit-accent text-white rounded-full">${exercise.exercisesPerRound} Exercises</span>
                        </div>
                    </div>
                `;
            } else {
                return `
                    ${header}
                    <div class="section-header ${exercise.type}">
                        <h3 class="text-lg font-bold text-fit-primary">${exercise.name}</h3>
                        <p class="text-fit-secondary text-sm">${exercise.description}</p>
                    </div>
                `;
            }
        }
        
        const hasSubstitution = exercise._hasSubstitution && exercise._substitution;
        const substitutionButton = hasSubstitution ? 
            `<button onclick="showSubstitutionChooser(${index})" class="px-3 py-1 bg-fit-accent text-white text-xs rounded-full hover:bg-fit-accent/80 transition-colors">
                🧠 Smart Alternative
            </button>` : '';
        
        // Add circuit exercise numbering if it's a circuit exercise
        const circuitNumber = exercise._isCircuitExercise ? 
            `<span class="inline-block px-2 py-1 bg-fit-accent text-white text-xs rounded-full mr-2">#${exercise._circuitPosition}</span>` : '';
        
        // Get equipment icon
        const getEquipmentIcon = (equipment) => {
            const icons = {
                'Bodyweight': '🏃',
                'Dumbbells': '🏋️',
                'Kettlebell': '⚡',
                'TRX Bands': '🎯',
                'Resistance Band': '🔄',
                'Pull-up Bar': '🆙',
                'Jump Rope': '🦘',
                'Rower': '🚣'
            };
            return icons[equipment] || '💪';
        };

        // Get muscle group color
        const getMuscleColor = (muscle) => {
            const colors = {
                'Chest': 'bg-red-100 text-red-700',
                'Back': 'bg-blue-100 text-blue-700',
                'Legs': 'bg-green-100 text-green-700',
                'Arms': 'bg-purple-100 text-purple-700',
                'Shoulders': 'bg-orange-100 text-orange-700',
                'Core': 'bg-yellow-100 text-yellow-700',
                'Full Body': 'bg-indigo-100 text-indigo-700'
            };
            return colors[muscle] || 'bg-gray-100 text-gray-700';
        };

        // Get level color
        const getLevelColor = (level) => {
            const colors = {
                'Beginner': 'bg-green-100 text-green-700',
                'Intermediate': 'bg-yellow-100 text-yellow-700',
                'Advanced': 'bg-red-100 text-red-700'
            };
            return colors[level] || 'bg-gray-100 text-gray-700';
        };

        return `
            ${header}
            <div id="exercise-item-${index}" class="exercise-item group p-6 bg-white rounded-xl border border-gray-200 hover:border-fit-primary hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" data-index="${index}">
                <div class="flex items-start space-x-4">
                    <!-- Equipment Icon -->
                    <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-fit-primary/10 to-fit-accent/10 rounded-full flex items-center justify-center text-2xl">
                        ${getEquipmentIcon(exercise.equipment)}
                    </div>
                    
                    <!-- Exercise Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex items-center space-x-2">
                                ${circuitNumber}
                                <h4 class="font-bold text-lg text-fit-dark group-hover:text-fit-primary transition-colors" data-field="name">
                                    ${exercise.name}
                                </h4>
                            </div>
                            <div class="flex space-x-2">
                                ${substitutionButton}
                                <span class="px-3 py-1 ${getLevelColor(exercise.level)} text-xs font-semibold rounded-full" data-field="level">
                                    ${exercise.level}
                                </span>
                            </div>
                        </div>
                        
                        <p class="text-fit-secondary text-sm mb-4 leading-relaxed" data-field="description">
                            ${brief(exercise.description)}
                        </p>
                        
                        <div class="flex flex-wrap items-center gap-3">
                            <div class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-fit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                </svg>
                                <span class="text-xs text-fit-secondary" data-field="equipment">${exercise.equipment}</span>
                            </div>
                            
                            <div class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-fit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                                <span class="px-2 py-1 ${getMuscleColor(exercise.muscle)} text-xs font-medium rounded-full" data-field="muscle">
                                    ${exercise.muscle}
                                </span>
                            </div>
                            
                            <!-- Timing Info -->
                            <div class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-fit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="text-xs text-fit-secondary">
                                    ${exercise._noRest ? 'No rest' : `${workTime}s work, ${restTime}s rest`}
                                </span>
                            </div>
                        </div>
                    </div>
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
};

// Note: window.startWorkout is defined in workout-player.js

// Make functions available globally for backward compatibility
window.generateWorkout = generateWorkout;
window.validateForm = validateForm;
window.getFormData = getFormData;
window.handleFormSubmission = handleFormSubmission;
