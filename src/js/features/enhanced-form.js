/**
 * Enhanced Form Features for FitFlow Workout Generator
 * ===================================================
 * Provides smart form validation, preset configurations, and enhanced UX
 */

// Preset workout configurations
const WORKOUT_PRESETS = {
    'quick-cardio': {
        duration: '15',
        fitnessLevel: 'Beginner',
        equipment: ['Bodyweight'],
        workTime: 30,
        restTime: 15,
        trainingPattern: 'standard',
        description: 'Quick cardio session perfect for busy schedules'
    },
    'strength-training': {
        duration: '30',
        fitnessLevel: 'Intermediate',
        equipment: ['Dumbbells'],
        workTime: 45,
        restTime: 20,
        trainingPattern: 'standard',
        description: 'Focused strength training with dumbbells'
    },
    'hiit-workout': {
        duration: '20',
        fitnessLevel: 'Advanced',
        equipment: ['Bodyweight'],
        workTime: 20,
        restTime: 10,
        trainingPattern: 'tabata',
        description: 'High-intensity interval training for maximum results'
    },
    'full-body': {
        duration: '45',
        fitnessLevel: 'Intermediate',
        equipment: ['Bodyweight', 'Dumbbells', 'Kettlebell'],
        workTime: 45,
        restTime: 15,
        trainingPattern: 'circuit',
        description: 'Comprehensive full-body workout with mixed equipment'
    }
};

/**
 * Initialize enhanced form features
 */
export function initializeEnhancedForm() {
    console.log('🎨 Initializing Enhanced Form Features...');
    
    setupPresetButtons();
    setupSmartValidation();
    setupFormFeedback();
    setupEquipmentSelection();
    
    console.log('✅ Enhanced Form Features initialized');
}

/**
 * Setup preset workout buttons
 */
function setupPresetButtons() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    presetButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const preset = button.dataset.preset;
            applyPreset(preset);
            showPresetFeedback(preset);
        });
    });
}

/**
 * Apply a preset configuration to the form
 */
function applyPreset(presetKey) {
    const preset = WORKOUT_PRESETS[presetKey];
    if (!preset) return;
    
    console.log(`🎯 Applying preset: ${presetKey}`, preset);
    
    // Apply duration
    const durationRadio = document.querySelector(`input[name="duration"][value="${preset.duration}"]`);
    if (durationRadio) {
        durationRadio.checked = true;
        durationRadio.dispatchEvent(new Event('change'));
    }
    
    // Apply fitness level
    const fitnessSelect = document.getElementById('fitness-level');
    if (fitnessSelect) {
        fitnessSelect.value = preset.fitnessLevel;
        fitnessSelect.dispatchEvent(new Event('change'));
    }
    
    // Apply equipment selection
    const equipmentCheckboxes = document.querySelectorAll('input[name="equipment"]');
    equipmentCheckboxes.forEach(checkbox => {
        checkbox.checked = preset.equipment.includes(checkbox.value);
        checkbox.dispatchEvent(new Event('change'));
    });
    
    // Apply work/rest timing
    const workTimeInput = document.getElementById('work-time');
    const restTimeInput = document.getElementById('rest-time');
    if (workTimeInput) {
        workTimeInput.value = preset.workTime;
        workTimeInput.dispatchEvent(new Event('input'));
    }
    if (restTimeInput) {
        restTimeInput.value = preset.restTime;
        restTimeInput.dispatchEvent(new Event('input'));
    }
    
    // Apply training pattern
    const patternRadio = document.querySelector(`input[name="training-pattern"][value="${preset.trainingPattern}"]`);
    if (patternRadio) {
        patternRadio.checked = true;
        patternRadio.dispatchEvent(new Event('change'));
    }
    
    // Trigger form validation
    validateForm();
}

/**
 * Show feedback when a preset is applied
 */
function showPresetFeedback(presetKey) {
    const preset = WORKOUT_PRESETS[presetKey];
    if (!preset) return;
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'smart-feedback feedback-success';
    feedback.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-medium">Preset Applied!</span>
        </div>
        <p class="text-sm mt-1">${preset.description}</p>
    `;
    
    // Insert after the preset buttons
    const presetSection = document.querySelector('.preset-btn').closest('.card');
    presetSection.appendChild(feedback);
    
    // Remove feedback after 3 seconds
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

/**
 * Setup smart form validation
 */
function setupSmartValidation() {
    const form = document.getElementById('workout-form');
    if (!form) return;
    
    // Real-time validation for all form inputs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', validateForm);
        input.addEventListener('input', validateForm);
    });
    
    // Initial validation
    validateForm();
}

/**
 * Validate the entire form and provide feedback
 */
function validateForm() {
    const form = document.getElementById('workout-form');
    if (!form) return;
    
    const errors = [];
    const warnings = [];
    
    // Check duration selection
    const durationSelected = form.querySelector('input[name="duration"]:checked');
    if (!durationSelected) {
        errors.push('Please select a workout duration');
    }
    
    // Check equipment selection
    const equipmentSelected = form.querySelectorAll('input[name="equipment"]:checked');
    if (equipmentSelected.length === 0) {
        errors.push('Please select at least one piece of equipment');
    }
    
    // Check work/rest timing
    const workTime = parseInt(document.getElementById('work-time')?.value || 0);
    const restTime = parseInt(document.getElementById('rest-time')?.value || 0);
    
    if (workTime < 20 || workTime > 120) {
        errors.push('Work time must be between 20-120 seconds');
    }
    
    if (restTime < 10 || restTime > 60) {
        errors.push('Rest time must be between 10-60 seconds');
    }
    
    if (workTime <= restTime) {
        warnings.push('Work time should be longer than rest time for effective training');
    }
    
    // Check training pattern
    const patternSelected = form.querySelector('input[name="training-pattern"]:checked');
    if (!patternSelected) {
        errors.push('Please select a training pattern');
    }
    
    // Display validation results
    displayValidationResults(errors, warnings);
    
    return errors.length === 0;
}

/**
 * Display validation results to the user
 */
function displayValidationResults(errors, warnings) {
    // Remove existing validation messages
    const existingMessages = document.querySelectorAll('.validation-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create validation container
    let validationContainer = document.getElementById('validation-messages');
    if (!validationContainer) {
        validationContainer = document.createElement('div');
        validationContainer.id = 'validation-messages';
        validationContainer.className = 'mt-4';
        
        const form = document.getElementById('workout-form');
        form.appendChild(validationContainer);
    }
    
    // Clear container
    validationContainer.innerHTML = '';
    
    // Display errors
    if (errors.length > 0) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-message validation-error';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">Please fix the following issues:</span>
            </div>
            <ul class="list-disc list-inside mt-1 text-sm">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        validationContainer.appendChild(errorDiv);
    }
    
    // Display warnings
    if (warnings.length > 0) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'validation-message validation-warning';
        warningDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span class="font-medium">Recommendations:</span>
            </div>
            <ul class="list-disc list-inside mt-1 text-sm">
                ${warnings.map(warning => `<li>${warning}</li>`).join('')}
            </ul>
        `;
        validationContainer.appendChild(warningDiv);
    }
    
    // Show success message if no errors
    if (errors.length === 0 && warnings.length === 0) {
        const successDiv = document.createElement('div');
        successDiv.className = 'validation-message validation-success';
        successDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="font-medium">Form looks great! Ready to generate your workout.</span>
            </div>
        `;
        validationContainer.appendChild(successDiv);
    }
}

/**
 * Setup form feedback system
 */
function setupFormFeedback() {
    // Add visual feedback for form interactions
    const form = document.getElementById('workout-form');
    if (!form) return;
    
    // Add focus indicators
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.closest('.duration-option, .equipment-card')?.classList.add('ring-2', 'ring-fit-primary/50');
        });
        
        input.addEventListener('blur', (e) => {
            e.target.closest('.duration-option, .equipment-card')?.classList.remove('ring-2', 'ring-fit-primary/50');
        });
    });
}

/**
 * Setup enhanced equipment selection
 */
function setupEquipmentSelection() {
    const equipmentCards = document.querySelectorAll('.equipment-card');
    
    equipmentCards.forEach(card => {
        const checkbox = card.querySelector('.equipment-checkbox');
        const label = card.querySelector('.equipment-label');
        
        // Add click animation
        label.addEventListener('click', () => {
            card.classList.add('animate-pulse');
            setTimeout(() => {
                card.classList.remove('animate-pulse');
            }, 200);
        });
        
        // Add selection feedback
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                card.classList.add('scale-105');
                setTimeout(() => {
                    card.classList.remove('scale-105');
                }, 200);
            }
        });
    });
}

/**
 * Get current form data with validation
 */
export function getValidatedFormData() {
    if (!validateForm()) {
        return null;
    }
    
    const form = document.getElementById('workout-form');
    const formData = new FormData(form);
    
    return {
        duration: formData.get('duration'),
        fitnessLevel: formData.get('fitness-level'),
        equipment: formData.getAll('equipment'),
        workTime: parseInt(formData.get('work-time')),
        restTime: parseInt(formData.get('rest-time')),
        trainingPattern: formData.get('training-pattern')
    };
}
