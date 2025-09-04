/**
 * Smart Exercise Substitution Module
 * AI-powered exercise alternatives based on user preferences and constraints
 * 
 * Features:
 * - Equipment-based substitution
 * - Difficulty level matching
 * - Muscle group targeting
 * - Injury safety considerations
 * - User preference optimization
 */

import { exercises } from '../core/exercise-database.js';

/**
 * Find exercise alternatives based on various criteria
 * @param {Object} targetExercise - The exercise to find alternatives for
 * @param {Object} userPreferences - User preferences and constraints
 * @returns {Array} Array of alternative exercises
 */
export function findExerciseAlternatives(targetExercise, userPreferences = {}) {
    const {
        equipment = [],
        fitnessLevel = 'Intermediate',
        avoidInjuries = [],
        targetMuscleGroups = []
    } = userPreferences;

    // Get all exercises that could be alternatives
    let alternatives = exercises.filter(ex => {
        // Don't include the same exercise
        if (ex.name === targetExercise.name) return false;
        
        // Must be same type (warmup, main, cooldown)
        if (ex.type !== targetExercise.type) return false;
        
        // Check equipment compatibility
        if (equipment.length > 0) {
            const hasCompatibleEquipment = ex.equipment_needed && 
                ex.equipment_needed.some(eq => equipment.includes(eq));
            if (!hasCompatibleEquipment && ex.equipment !== 'Bodyweight') return false;
        }
        
        // Check difficulty level compatibility
        const isLevelCompatible = ex.level === fitnessLevel || 
            (Array.isArray(ex.level) && ex.level.includes(fitnessLevel));
        if (!isLevelCompatible) return false;
        
        // Check injury safety
        if (avoidInjuries.length > 0 && ex.injury_safe) {
            const hasUnsafeInjury = avoidInjuries.some(injury => 
                !ex.injury_safe.includes(injury));
            if (hasUnsafeInjury) return false;
        }
        
        return true;
    });

    // Score and rank alternatives
    alternatives = alternatives.map(ex => ({
        ...ex,
        score: calculateSubstitutionScore(ex, targetExercise, userPreferences)
    }));

    // Sort by score (highest first) and return top alternatives
    return alternatives
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Return top 5 alternatives
}

/**
 * Calculate substitution score for an exercise
 * @param {Object} alternative - The alternative exercise
 * @param {Object} target - The target exercise
 * @param {Object} preferences - User preferences
 * @returns {number} Score (0-100)
 */
function calculateSubstitutionScore(alternative, target, preferences) {
    let score = 0;
    
    // Equipment compatibility (30 points)
    if (alternative.equipment === target.equipment) {
        score += 30;
    } else if (alternative.equipment_needed && target.equipment_needed) {
        const commonEquipment = alternative.equipment_needed.filter(eq => 
            target.equipment_needed.includes(eq));
        score += (commonEquipment.length / target.equipment_needed.length) * 30;
    }
    
    // Muscle group targeting (25 points)
    if (alternative.muscle_groups && target.muscle_groups) {
        const commonMuscles = alternative.muscle_groups.filter(muscle => 
            target.muscle_groups.includes(muscle));
        score += (commonMuscles.length / target.muscle_groups.length) * 25;
    }
    
    // Difficulty level matching (20 points)
    if (alternative.difficulty === target.difficulty) {
        score += 20;
    } else {
        const diffDiff = Math.abs(alternative.difficulty - target.difficulty);
        score += Math.max(0, 20 - (diffDiff * 5));
    }
    
    // User preferences (15 points)
    if (preferences.targetMuscleGroups && alternative.muscle_groups) {
        const matchesPreferences = preferences.targetMuscleGroups.some(muscle => 
            alternative.muscle_groups.includes(muscle));
        if (matchesPreferences) score += 15;
    }
    
    // Injury safety bonus (10 points)
    if (alternative.injury_safe && alternative.injury_safe.length > 0) {
        score += 10;
    }
    
    return Math.min(100, score);
}

/**
 * Get difficulty level as numeric value
 * @param {string|Array} level - Difficulty level
 * @returns {number} Numeric difficulty (1-5)
 */
export function getDifficultyLevel(level) {
    if (typeof level === 'string') {
        const levelMap = { 'Beginner': 1, 'Intermediate': 3, 'Advanced': 5 };
        return levelMap[level] || 3;
    }
    if (Array.isArray(level)) {
        return level.includes('Advanced') ? 5 : level.includes('Beginner') ? 1 : 3;
    }
    return 3; // Default to intermediate
}

/**
 * Suggest exercise substitution based on reason
 * @param {Object} exercise - The exercise to substitute
 * @param {string} reason - Reason for substitution
 * @param {Object} userPreferences - User preferences
 * @returns {Object} Substitution result
 */
export function suggestExerciseSubstitution(exercise, reason, userPreferences = {}) {
    const alternatives = findExerciseAlternatives(exercise, userPreferences);
    
    if (alternatives.length === 0) {
        return {
            success: false,
            reason: 'No suitable alternatives found',
            alternatives: []
        };
    }
    
    const bestAlternative = alternatives[0];
    
    return {
        success: true,
        alternative: bestAlternative,
        reason: getSubstitutionReason(reason, bestAlternative),
        alternatives: alternatives.slice(1) // Other options
    };
}

/**
 * Get human-readable substitution reason
 * @param {string} reason - Technical reason
 * @param {Object} alternative - The alternative exercise
 * @returns {string} Human-readable reason
 */
function getSubstitutionReason(reason, alternative) {
    const reasonMap = {
        'availability': `Better equipment match (${alternative.equipment})`,
        'difficulty': `More suitable difficulty level`,
        'injury': `Safer for your condition`,
        'preference': `Matches your preferences better`,
        'muscle': `Targets same muscle groups`
    };
    
    return reasonMap[reason] || 'Better alternative available';
}

/**
 * Enhance workout with smart substitutions
 * @param {Array} workout - The workout to enhance
 * @param {Object} userPreferences - User preferences
 * @returns {Array} Enhanced workout with substitutions
 */
export function enhanceWorkoutWithSubstitutions(workout, userPreferences = {}) {
    const enhancedWorkout = [];
    
    workout.forEach(exercise => {
        if (exercise.type === 'circuit_round' || exercise.type === 'tabata_set' || exercise.type === 'pyramid_set') {
            // Keep round/set headers as-is
            enhancedWorkout.push(exercise);
        } else {
            // Check if exercise needs substitution
            const substitution = suggestExerciseSubstitution(exercise, 'availability', userPreferences);
            
            if (substitution.success) {
                // Add substitution info to exercise
                enhancedWorkout.push({
                    ...exercise,
                    _hasSubstitution: true,
                    _substitution: substitution.alternative,
                    _substitutionReason: substitution.reason
                });
            } else {
                enhancedWorkout.push(exercise);
            }
        }
    });
    
    return enhancedWorkout;
}

/**
 * Show substitution details modal
 * @param {string} originalName - Original exercise name
 * @param {string} alternativeName - Alternative exercise name
 * @param {string} reason - Reason for substitution
 */
export function showSubstitutionDetails(originalName, alternativeName, reason) {
    // Create modal for substitution details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md mx-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-fit-dark">🔄 Exercise Substitution</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="space-y-4">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-medium text-fit-dark mb-2">Original Exercise</h4>
                    <p class="text-fit-secondary">${originalName}</p>
                </div>
                <div class="bg-fit-accent/10 rounded-lg p-4">
                    <h4 class="font-medium text-fit-dark mb-2">🧠 Smart Alternative</h4>
                    <p class="text-fit-secondary">${alternativeName}</p>
                </div>
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-medium text-fit-dark mb-2">Why this substitution?</h4>
                    <p class="text-fit-secondary">${reason}</p>
                </div>
            </div>
            <div class="mt-6 flex justify-end">
                <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-fit-primary text-white rounded-lg hover:bg-fit-primary/80 transition-colors">
                    Got it!
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Open chooser modal with top alternatives and allow swapping in-place
 * @param {number} exerciseIndex - Index in currentWorkout array
 */
export function showSubstitutionChooser(exerciseIndex) {
    try {
        const workout = window.currentWorkout || [];
        const target = workout[exerciseIndex];
        if (!target) return;

        // brief description helper (match list view behavior)
        const brief = (t='') => {
            const warn = t.indexOf('⚠️');
            const base = warn > -1 ? t.slice(0, warn).trim() : (t || '').trim();
            const m = base.match(/^[^.!?]{20,200}[.!?]/);
            if (m) return m[0].trim();
            return base.length > 180 ? base.slice(0, 177).trim() + '…' : base;
        };

        const prefs = {
            equipment: [target.equipment],
            fitnessLevel: Array.isArray(target.level) ? (target.level.includes('Advanced') ? 'Advanced' : target.level[0] || 'Intermediate') : (target.level || 'Intermediate')
        };
        const alternatives = findExerciseAlternatives(target, prefs).slice(0, 6);

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-xl w-full mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-fit-dark">Choose a Smart Alternative</h3>
                    <button class="text-gray-500 hover:text-gray-700" data-action="close">✕</button>
                </div>
                <div class="mb-4">
                    <div class="text-sm text-fit-secondary">Original: <span class="font-medium">${target.name}</span></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${alternatives.map((alt, i) => `
                        <button class="p-3 text-left rounded border hover:border-fit-primary transition-colors" data-action="choose" data-idx="${i}">
                            <div class="font-medium text-fit-dark">${alt.name}</div>
                            <div class="text-xs text-fit-secondary">${brief(alt.description || '')}</div>
                            <div class="mt-1 flex justify-between text-[11px] text-fit-secondary">
                                <span>Eq: ${alt.equipment}</span>
                                <span>Lvl: ${Array.isArray(alt.level) ? alt.level.join(', ') : alt.level}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
                <div class="mt-5 text-right">
                    <button class="px-4 py-2 bg-gray-100 rounded" data-action="close">Cancel</button>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            if (action === 'close') {
                modal.remove();
            }
            if (action === 'choose') {
                const altIdx = parseInt(btn.getAttribute('data-idx'), 10);
                const chosen = alternatives[altIdx];
                if (chosen) {
                    applyExerciseSwap(exerciseIndex, chosen);
                }
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    } catch (e) {
        console.error('Substitution chooser error', e);
    }
}

/**
 * Apply swap into currentWorkout and update DOM card
 */
function applyExerciseSwap(index, replacement) {
    if (!window.currentWorkout || !window.currentWorkout[index]) return;
    const old = window.currentWorkout[index];
    window.currentWorkout[index] = {
        ...replacement,
        // preserve any runtime flags that UI expects
        type: old.type || replacement.type || 'main'
    };

    const card = document.getElementById(`exercise-item-${index}`);
    if (!card) return;
    const setText = (selector, text) => {
        const el = card.querySelector(selector);
        if (el) el.textContent = text;
    };
    setText('[data-field="name"]', replacement.name);
    // brief description similar to list rendering
    const brief = (t='') => {
        const warn = t.indexOf('⚠️');
        const base = warn > -1 ? t.slice(0, warn).trim() : t.trim();
        const m = base.match(/^[^.!?]{20,200}[.!?]/);
        if (m) return m[0].trim();
        return base.length > 180 ? base.slice(0, 177).trim() + '…' : base;
    };
    setText('[data-field="description"]', brief(replacement.description || ''));
    setText('[data-field="level"]', Array.isArray(replacement.level) ? replacement.level.join(', ') : (replacement.level || ''));
    setText('[data-field="equipment"]', `Equipment: ${replacement.equipment || ''}`);
    setText('[data-field="muscle"]', `Muscle: ${replacement.muscle || ''}`);
}

// Expose chooser globally for onclick usage
window.showSubstitutionChooser = showSubstitutionChooser;

// Make functions available globally for backward compatibility
window.findExerciseAlternatives = findExerciseAlternatives;
window.suggestExerciseSubstitution = suggestExerciseSubstitution;
window.enhanceWorkoutWithSubstitutions = enhanceWorkoutWithSubstitutions;
window.showSubstitutionDetails = showSubstitutionDetails;
