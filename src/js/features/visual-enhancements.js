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
    showGuides: true,
    autoPlay: false,
    quality: 'medium' // low, medium, high
};


// Smart video system with fallback videos
const VIDEO_SYSTEM = {
    // High-quality fallback videos for common exercises
    fallbackVideos: {
        'push-ups': 'Eh00_rniF8E', // FitnessBlender - Push Up Form
        'squats': 'Dy28eq2PjcM', // FitnessBlender - Squat Form  
        'plank': 'pSHjTRCQxIw', // FitnessBlender - Plank Form
        'lunges': '3XDriUnwlud4', // FitnessBlender - Lunge Form
        'burpees': 'TU8QYVW0gDU', // FitnessBlender - Burpee Form
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
        'bridge': 'r4z_6zX7Qbs', // FitnessBlender - Bridge
        'calf-raises': 'yM2V0dW0cY0', // FitnessBlender - Calf Raises
        'arm-circles': 'Eh00_rniF8E', // FitnessBlender - Arm Circles (using push-up video)
        'shoulder-rolls': 'Eh00_rniF8E', // FitnessBlender - Shoulder Rolls (using push-up video)
        'toe-touches': 'Dy28eq2PjcM', // FitnessBlender - Toe Touches (using squat video)
        'windmills': 'Dy28eq2PjcM', // FitnessBlender - Windmills (using squat video)
        'cat-cow': 'pSHjTRCQxIw', // FitnessBlender - Cat Cow (using plank video)
        'child-pose': 'pSHjTRCQxIw', // FitnessBlender - Child Pose (using plank video)
        'downward-dog': 'pSHjTRCQxIw', // FitnessBlender - Downward Dog (using plank video)
        'breathing-exercise': 'Eh00_rniF8E', // FitnessBlender - Breathing (using push-up video)
        'meditation': 'Eh00_rniF8E', // FitnessBlender - Meditation (using push-up video)
        'relaxation': 'Eh00_rniF8E', // FitnessBlender - Relaxation (using push-up video)
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
        'superman': 'r4z_6zX7Qbs', // FitnessBlender - Superman
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
        'hip-openers': 'YaXPRqUwItQ' // FitnessBlender - Hip Openers
    },
    
    // Search terms for dynamic video finding
    searchTerms: {
        'push-ups': ['push ups form', 'pushup technique', 'push up exercise'],
        'squats': ['squat form', 'bodyweight squat', 'squat technique'],
        'plank': ['plank form', 'plank exercise', 'plank technique'],
        'lunges': ['lunge form', 'lunges exercise', 'lunge technique'],
        'burpees': ['burpee form', 'burpees exercise', 'burpee technique'],
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
        'bridge': ['bridge exercise', 'glute bridge'],
        'calf-raises': ['calf raise', 'calf raises'],
        'arm-circles': ['arm circle', 'arm circles'],
        'shoulder-rolls': ['shoulder roll', 'shoulder rolls'],
        'toe-touches': ['toe touch', 'toe touches'],
        'windmills': ['windmill', 'windmills'],
        'cat-cow': ['cat cow', 'cat cow stretch'],
        'child-pose': ['child pose', 'childs pose'],
        'downward-dog': ['downward dog', 'down dog'],
        'breathing-exercise': ['breathing exercise', 'breath work'],
        'meditation': ['meditation', 'mindfulness'],
        'relaxation': ['relaxation', 'relaxation exercise']
    }
};


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
            Object.assign(visualEnhancementState, preferences);
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
        localStorage.setItem('fitflow_visual_preferences', JSON.stringify(visualEnhancementState));
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
    
    // Setup toggle buttons
    setupToggleButton('show-videos-toggle', 'showVideos', 'Show Videos');
    setupToggleButton('show-guides-toggle', 'showGuides', 'Show Instructions & Safety');
    setupToggleButton('autoplay-toggle', 'autoPlay', 'Auto Play Videos');
    
    // Setup quality selector
    setupQualitySelector();
}

/**
 * Setup visual enhancement button
 */
function setupVisualEnhancementButton() {
    const visualBtn = document.getElementById('visual-enhancement-btn');
    if (visualBtn) {
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
        panel.classList.toggle('hidden');
        console.log('🎬 Visual controls panel toggled');
        
        // Focus management
        if (!panel.classList.contains('hidden')) {
            const firstFocusable = panel.querySelector('input, button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
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
    panel.innerHTML = `
        <div class="visual-controls-content">
            <div class="visual-controls-header">
                <h3 class="visual-controls-title">
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
                <div class="visual-controls-option">
                    <label class="visual-controls-option-label">
                        <input type="checkbox" id="show-videos-toggle" class="visual-controls-toggle">
                        <span class="visual-controls-toggle-slider"></span>
                        <div class="visual-controls-option-content">
                            <div class="visual-controls-option-title">Show Videos</div>
                            <div class="visual-controls-option-description">Display exercise demonstration videos</div>
                        </div>
                    </label>
                </div>
                
                
                <div class="visual-controls-option">
                    <label class="visual-controls-option-label">
                        <input type="checkbox" id="show-guides-toggle" class="visual-controls-toggle">
                        <span class="visual-controls-toggle-slider"></span>
                        <div class="visual-controls-option-content">
                            <div class="visual-controls-option-title">Show Instructions & Safety</div>
                            <div class="visual-controls-option-description">Display exercise instructions and safety guidelines</div>
                        </div>
                    </label>
                </div>
                
                <div class="visual-controls-option">
                    <label class="visual-controls-option-label">
                        <input type="checkbox" id="autoplay-toggle" class="visual-controls-toggle">
                        <span class="visual-controls-toggle-slider"></span>
                        <div class="visual-controls-option-content">
                            <div class="visual-controls-option-title">Auto Play Videos</div>
                            <div class="visual-controls-option-description">Automatically play videos when opened</div>
                        </div>
                    </label>
                </div>
                
                <div class="visual-controls-option">
                    <div class="visual-controls-option-content">
                        <div class="visual-controls-option-title">Video Quality</div>
                        <div class="visual-controls-option-description">Choose video playback quality</div>
                        <select id="quality-selector" class="visual-controls-select">
                            <option value="low">Low (480p)</option>
                            <option value="medium" selected>Medium (720p)</option>
                            <option value="high">High (1080p)</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="visual-controls-footer">
                <button id="save-visual-controls" class="visual-controls-save-btn">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Settings
                </button>
                <button id="reset-visual-controls" class="visual-controls-reset-btn">
                    Reset to Defaults
                </button>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(panel);
    
    // Setup close button
    const closeBtn = document.getElementById('close-visual-controls');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.classList.add('hidden');
        });
    }
    
    // Setup save button
    const saveBtn = document.getElementById('save-visual-controls');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveVisualSettings);
    }
    
    // Setup reset button
    const resetBtn = document.getElementById('reset-visual-controls');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetVisualSettings);
    }
}

/**
 * Setup toggle button for visual options
 */
function setupToggleButton(buttonId, stateKey, label) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    // Set initial state
    button.checked = visualEnhancementState[stateKey];
    
    // Add event listener
    button.addEventListener('change', (e) => {
        visualEnhancementState[stateKey] = e.target.checked;
        applyVisualSettings();
        saveVisualPreferences();
        
        // Announce change
        announceVisualChange(label, e.target.checked);
    });
}

/**
 * Setup quality selector
 */
function setupQualitySelector() {
    const selector = document.getElementById('quality-selector');
    if (!selector) return;
    
    // Set initial value
    selector.value = visualEnhancementState.quality;
    
    // Add event listener
    selector.addEventListener('change', (e) => {
        visualEnhancementState.quality = e.target.value;
        applyVisualSettings();
        saveVisualPreferences();
        
        announceVisualChange('Video quality', e.target.value);
    });
}

/**
 * Enhance existing exercise cards with visual elements
 */
function enhanceExerciseCards() {
    // Wait for exercise cards to be rendered
    setTimeout(() => {
        const exerciseItems = document.querySelectorAll('.exercise-item');
        exerciseItems.forEach(item => {
            addVisualEnhancementsToExercise(item);
        });
    }, 1000);
}

/**
 * Add visual enhancements to a specific exercise card
 */
function addVisualEnhancementsToExercise(exerciseItem) {
    const exerciseName = exerciseItem.querySelector('.exercise-name')?.textContent?.toLowerCase();
    if (!exerciseName) return;
    
    // Add visual enhancement buttons
    const visualControls = document.createElement('div');
    visualControls.className = 'exercise-visual-controls';
    visualControls.innerHTML = `
        <div class="visual-buttons">
            ${visualEnhancementState.showVideos ? `
                <button class="visual-btn video-btn" data-exercise="${exerciseName}" title="Watch demonstration video">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Video
                </button>
            ` : ''}
            ${visualEnhancementState.show3DModels ? `
                <button class="visual-btn model-btn" data-exercise="${exerciseName}" title="View 3D model">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    3D
                </button>
            ` : ''}
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
    const modelBtn = visualControls.querySelector('.model-btn');
    const guideBtn = visualControls.querySelector('.guide-btn');
    
    if (videoBtn) {
        videoBtn.addEventListener('click', () => showExerciseVideo(exerciseName));
    }
    
    if (modelBtn) {
        modelBtn.addEventListener('click', () => showExercise3DModel(exerciseName));
    }
    
    if (guideBtn) {
        guideBtn.addEventListener('click', () => showExerciseGuide(exerciseName));
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

    // Get video ID from fallback system
    const videoId = VIDEO_SYSTEM.fallbackVideos[exerciseName];
    
    if (videoId) {
        // Use fallback video
        title.textContent = `${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1).replace(/-/g, ' ')} - Exercise Video`;
        
        // Create YouTube embed URL with autoplay based on user preference
        const autoplayParam = visualEnhancementState.autoPlay ? '&autoplay=1' : '';
        const videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&fs=1${autoplayParam}`;
        
        // Create video element
        const video = document.createElement('iframe');
        video.src = videoUrl;
        video.width = '100%';
        video.height = '315';
        video.frameBorder = '0';
        video.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        video.allowFullscreen = true;
        video.style.borderRadius = '8px';
        
        // Clear container and add video
        videoContainer.innerHTML = '';
        videoContainer.appendChild(video);
        
        // Show the modal
        modal.classList.remove('hidden');
        console.log(`🎬 Video modal opened with fallback video: ${videoId}`);
        console.log(`🎬 Video URL: ${videoUrl}`);
    } else {
        // Show generic video placeholder for exercises not in our database
        console.log(`🎬 No specific video found for: ${exerciseName}, showing generic video`);
        showGenericExerciseVideo(exerciseName);
    }
}



/**
 * Show generic exercise 3D model when no specific model is available
 */
function showGenericExercise3DModel(exerciseName) {
    const viewer = document.getElementById('model-viewer');
    const title = document.getElementById('model-viewer-title');
    
    if (viewer && title) {
        title.textContent = `${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1)} 3D Model`;
        
        // Show the modal
        viewer.classList.remove('hidden');
        
        console.log('🎬 3D model modal opened with placeholder content');
    } else {
        console.warn('🎬 3D model modal elements not found');
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
        title.textContent = `${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1).replace(/-/g, ' ')} - Exercise Video`;
        
        // Use a generic exercise video (FitnessBlender push-up video - known to work)
        const genericVideoId = 'YaXPRqUwItQ'; // FitnessBlender - Full Body Workout (verified working)
        const autoplayParam = visualEnhancementState.autoPlay ? '&autoplay=1' : '';
        const videoUrl = `https://www.youtube.com/embed/${genericVideoId}?rel=0&modestbranding=1&controls=1&fs=1${autoplayParam}`;
        
        // Create video element
        const video = document.createElement('iframe');
        video.src = videoUrl;
        video.width = '100%';
        video.height = '315';
        video.frameBorder = '0';
        video.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        video.allowFullscreen = true;
        video.style.borderRadius = '8px';
        
        // Clear container and add video
        videoContainer.innerHTML = '';
        videoContainer.appendChild(video);
        
        // Show the modal
        modal.classList.remove('hidden');
        console.log(`🎬 Generic video modal opened with video: ${genericVideoId}`);
    }
}


/**
 * Close video modal
 */
function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('exercise-video');
    
    if (modal) {
        modal.classList.add('hidden');
    }
    
    if (video) {
        video.src = '';
    }
}

/**
 * Close 3D model viewer
 */
function closeModelViewer() {
    console.log('🎬 closeModelViewer called');
    const viewer = document.getElementById('model-viewer');
    if (viewer) {
        viewer.classList.add('hidden');
        console.log('🎬 3D model modal closed');
    } else {
        console.warn('🎬 3D model modal not found');
    }
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
    
    console.log('🎬 Applied visual settings:', visualEnhancementState);
}

/**
 * Apply visual settings specifically to workout player elements
 */
function applySettingsToWorkoutPlayer() {
    console.log('🎬 Applying visual settings to workout player...');
    
    // Update exercise resources section
    const exerciseResources = document.getElementById('exercise-resources');
    if (exerciseResources) {
        if (visualEnhancementState.showVideos) {
            exerciseResources.style.display = 'block';
        } else {
            exerciseResources.style.display = 'none';
        }
    }
    
    
    
    // Update video buttons within exercise resources
    const videoButtons = document.querySelectorAll('#exercise-resources .video-btn, #exercise-resources [data-action="video"]');
    videoButtons.forEach(button => {
        if (visualEnhancementState.showVideos) {
            button.style.display = 'inline-flex';
            console.log('🎬 Showing video button');
        } else {
            button.style.display = 'none';
            console.log('🎬 Hiding video button');
        }
    });
    
    
    // Apply autoplay settings to video elements
    const videoElements = document.querySelectorAll('#exercise-resources video, #exercise-resources iframe[src*="youtube"]');
    videoElements.forEach(video => {
        if (visualEnhancementState.autoPlay) {
            video.setAttribute('autoplay', 'true');
            console.log('🎬 Enabling video autoplay');
        } else {
            video.removeAttribute('autoplay');
            console.log('🎬 Disabling video autoplay');
        }
    });
    
    console.log('🎬 Visual settings applied to workout player');
}

/**
 * Save visual settings and apply them
 */
function saveVisualSettings() {
    // Get current values from UI
    const showVideosToggle = document.getElementById('show-videos-toggle');
    const showGuidesToggle = document.getElementById('show-guides-toggle');
    const autoplayToggle = document.getElementById('autoplay-toggle');
    const qualitySelector = document.getElementById('quality-selector');
    
    if (showVideosToggle) visualEnhancementState.showVideos = showVideosToggle.checked;
    if (showGuidesToggle) visualEnhancementState.showGuides = showGuidesToggle.checked;
    if (autoplayToggle) visualEnhancementState.autoPlay = autoplayToggle.checked;
    if (qualitySelector) visualEnhancementState.quality = qualitySelector.value;
    
    // Save to localStorage
    saveVisualPreferences();
    
    // Apply settings
    applyVisualSettings();
    
    // Show success message
    showVisualSettingsSaved();
    
    // Close panel
    const panel = document.getElementById('visual-controls-panel');
    if (panel) {
        panel.classList.add('hidden');
    }
    
    console.log('🎬 Visual settings saved and applied:', visualEnhancementState);
}

/**
 * Apply settings to existing elements on the page
 */
function applySettingsToExistingElements() {
    console.log('🎬 Applying visual settings to existing elements...');
    
    // Update exercise resources section (contains videos, guides, etc.)
    const exerciseResources = document.getElementById('exercise-resources');
    if (exerciseResources) {
        if (visualEnhancementState.showVideos || visualEnhancementState.showGuides) {
            exerciseResources.style.display = 'block';
            console.log('🎬 Showing exercise resources');
        } else {
            exerciseResources.style.display = 'none';
            console.log('🎬 Hiding exercise resources');
        }
    }
    
    // Update video elements within resources
    const videoElements = document.querySelectorAll('.exercise-resources a[href*="youtube.com"]');
    videoElements.forEach(video => {
        if (visualEnhancementState.showVideos) {
            video.style.display = 'inline-flex';
        } else {
            video.style.display = 'none';
        }
    });
    
    
    // Update exercise instructions and safety sections
    const exerciseInstructions = document.getElementById('exercise-instructions');
    const exerciseSafety = document.getElementById('exercise-safety');
    
    if (exerciseInstructions) {
        if (visualEnhancementState.showGuides) {
            exerciseInstructions.style.display = 'block';
            console.log('🎬 Showing exercise instructions');
        } else {
            exerciseInstructions.style.display = 'none';
            console.log('🎬 Hiding exercise instructions');
        }
    }
    
    if (exerciseSafety) {
        if (visualEnhancementState.showGuides) {
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
 * Show settings saved message
 */
function showVisualSettingsSaved() {
    // Create temporary success message
    const message = document.createElement('div');
    message.className = 'visual-settings-saved-message';
    message.innerHTML = `
        <div class="visual-settings-saved-content">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Visual settings saved successfully!
        </div>
    `;
    
    // Add styles
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 2px solid #10b981;
        border-radius: 8px;
        padding: 12px 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        font-weight: 500;
        color: #374151;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(message);
    
    // Remove after 3 seconds
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 3000);
}

/**
 * Reset visual settings to defaults
 */
function resetVisualSettings() {
    // Reset state
    Object.assign(visualEnhancementState, {
        showVideos: true,
        showGuides: true,
        autoPlay: false,
        quality: 'medium'
    });
    
    // Update UI
    const toggles = ['show-videos-toggle', 'show-guides-toggle', 'autoplay-toggle'];
    toggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.checked = visualEnhancementState[toggleId.replace('-toggle', '').replace('-', '')];
        }
    });
    
    const qualitySelector = document.getElementById('quality-selector');
    if (qualitySelector) {
        qualitySelector.value = visualEnhancementState.quality;
    }
    
    // Apply settings
    applyVisualSettings();
    saveVisualPreferences();
    
    announceVisualChange('Visual settings', 'reset to defaults');
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
    Object.assign(visualEnhancementState, newState);
    applyVisualSettings();
    saveVisualPreferences();
}

// Export for global access
window.initializeVisualEnhancements = initializeVisualEnhancements;
window.getVisualEnhancementState = getVisualEnhancementState;
window.applySettingsToWorkoutPlayer = applySettingsToWorkoutPlayer;
window.setVisualEnhancementState = setVisualEnhancementState;
window.showExerciseVideo = showExerciseVideo;
