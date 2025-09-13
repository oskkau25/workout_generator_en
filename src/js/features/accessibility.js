/**
 * Accessibility Features Module
 * Provides high contrast mode, large text options, and keyboard navigation
 * 
 * Features:
 * - High contrast mode toggle
 * - Large text size options
 * - Keyboard navigation support
 * - Focus management
 * - Screen reader support
 */

console.log('♿ ACCESSIBILITY.JS LOADED - v1');

// Accessibility state management
const accessibilityState = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    keyboardNavigation: false
};

// CSS classes for accessibility features
const ACCESSIBILITY_CLASSES = {
    highContrast: 'accessibility-high-contrast',
    largeText: 'accessibility-large-text',
    reducedMotion: 'accessibility-reduced-motion',
    keyboardNav: 'accessibility-keyboard-nav'
};

/**
 * Initialize accessibility features
 */
export function initializeAccessibility() {
    console.log('♿ Initializing accessibility features...');
    
    // Load saved accessibility preferences
    loadAccessibilityPreferences();
    
    // Setup accessibility controls
    setupAccessibilityControls();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Apply initial accessibility settings
    applyAccessibilitySettings();
    
    console.log('✅ Accessibility features initialized');
}

/**
 * Load accessibility preferences from localStorage
 */
function loadAccessibilityPreferences() {
    try {
        const saved = localStorage.getItem('fitflow_accessibility');
        if (saved) {
            const preferences = JSON.parse(saved);
            Object.assign(accessibilityState, preferences);
            console.log('♿ Loaded accessibility preferences:', preferences);
        }
    } catch (error) {
        console.warn('Failed to load accessibility preferences:', error);
    }
}

/**
 * Save accessibility preferences to localStorage
 */
function saveAccessibilityPreferences() {
    try {
        localStorage.setItem('fitflow_accessibility', JSON.stringify(accessibilityState));
        console.log('♿ Saved accessibility preferences:', accessibilityState);
    } catch (error) {
        console.warn('Failed to save accessibility preferences:', error);
    }
}

/**
 * Setup accessibility control buttons
 */
function setupAccessibilityControls() {
    // Create accessibility panel if it doesn't exist
    createAccessibilityPanel();
    
    // Setup toggle buttons
    setupToggleButton('high-contrast-toggle', 'highContrast', 'High Contrast Mode');
    setupToggleButton('large-text-toggle', 'largeText', 'Large Text');
    setupToggleButton('reduced-motion-toggle', 'reducedMotion', 'Reduced Motion');
    setupToggleButton('keyboard-nav-toggle', 'keyboardNavigation', 'Keyboard Navigation');
    
    // Setup accessibility menu toggle
    const accessibilityBtn = document.getElementById('accessibility-btn');
    if (accessibilityBtn) {
        accessibilityBtn.addEventListener('click', toggleAccessibilityPanel);
    }
}

/**
 * Create accessibility control panel
 */
function createAccessibilityPanel() {
    // Check if panel already exists
    if (document.getElementById('accessibility-panel')) return;
    
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = 'accessibility-panel hidden';
    panel.innerHTML = `
        <div class="accessibility-panel-content">
            <div class="accessibility-header">
                <h3 class="accessibility-title">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    Accessibility Options
                </h3>
                <button id="close-accessibility-panel" class="accessibility-close-btn" aria-label="Close accessibility panel">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="accessibility-options">
                <div class="accessibility-option">
                    <label class="accessibility-option-label">
                        <input type="checkbox" id="high-contrast-toggle" class="accessibility-toggle">
                        <span class="accessibility-toggle-slider"></span>
                        <div class="accessibility-option-content">
                            <div class="accessibility-option-title">High Contrast Mode</div>
                            <div class="accessibility-option-description">Increases contrast for better visibility</div>
                        </div>
                    </label>
                </div>
                
                <div class="accessibility-option">
                    <label class="accessibility-option-label">
                        <input type="checkbox" id="large-text-toggle" class="accessibility-toggle">
                        <span class="accessibility-toggle-slider"></span>
                        <div class="accessibility-option-content">
                            <div class="accessibility-option-title">Large Text</div>
                            <div class="accessibility-option-description">Increases text size for better readability</div>
                        </div>
                    </label>
                </div>
                
                <div class="accessibility-option">
                    <label class="accessibility-option-label">
                        <input type="checkbox" id="reduced-motion-toggle" class="accessibility-toggle">
                        <span class="accessibility-toggle-slider"></span>
                        <div class="accessibility-option-content">
                            <div class="accessibility-option-title">Reduced Motion</div>
                            <div class="accessibility-option-description">Reduces animations and transitions</div>
                        </div>
                    </label>
                </div>
                
                <div class="accessibility-option">
                    <label class="accessibility-option-label">
                        <input type="checkbox" id="keyboard-nav-toggle" class="accessibility-toggle">
                        <span class="accessibility-toggle-slider"></span>
                        <div class="accessibility-option-content">
                            <div class="accessibility-option-title">Keyboard Navigation</div>
                            <div class="accessibility-option-description">Enhanced keyboard navigation support</div>
                        </div>
                    </label>
                </div>
            </div>
            
            <div class="accessibility-footer">
                <button id="reset-accessibility" class="accessibility-reset-btn">
                    Reset to Defaults
                </button>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(panel);
    
    // Setup close button
    const closeBtn = document.getElementById('close-accessibility-panel');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.classList.add('hidden');
        });
    }
    
    // Setup reset button
    const resetBtn = document.getElementById('reset-accessibility');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAccessibilitySettings);
    }
}

/**
 * Setup toggle button for accessibility options
 */
function setupToggleButton(buttonId, stateKey, label) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    // Set initial state
    button.checked = accessibilityState[stateKey];
    
    // Add event listener
    button.addEventListener('change', (e) => {
        accessibilityState[stateKey] = e.target.checked;
        applyAccessibilitySettings();
        saveAccessibilityPreferences();
        
        // Announce change to screen readers
        announceAccessibilityChange(label, e.target.checked);
    });
}

/**
 * Toggle accessibility panel visibility
 */
function toggleAccessibilityPanel() {
    const panel = document.getElementById('accessibility-panel');
    if (panel) {
        panel.classList.toggle('hidden');
        
        // Focus management
        if (!panel.classList.contains('hidden')) {
            const firstFocusable = panel.querySelector('input, button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }
}

/**
 * Apply accessibility settings to the page
 */
function applyAccessibilitySettings() {
    const body = document.body;
    
    // Remove all accessibility classes first
    Object.values(ACCESSIBILITY_CLASSES).forEach(className => {
        body.classList.remove(className);
    });
    
    // Apply active accessibility features
    if (accessibilityState.highContrast) {
        body.classList.add(ACCESSIBILITY_CLASSES.highContrast);
    }
    
    if (accessibilityState.largeText) {
        body.classList.add(ACCESSIBILITY_CLASSES.largeText);
    }
    
    if (accessibilityState.reducedMotion) {
        body.classList.add(ACCESSIBILITY_CLASSES.reducedMotion);
    }
    
    if (accessibilityState.keyboardNavigation) {
        body.classList.add(ACCESSIBILITY_CLASSES.keyboardNav);
        setupKeyboardNavigation();
    }
    
    console.log('♿ Applied accessibility settings:', accessibilityState);
}

/**
 * Reset accessibility settings to defaults
 */
function resetAccessibilitySettings() {
    // Reset state
    Object.keys(accessibilityState).forEach(key => {
        accessibilityState[key] = false;
    });
    
    // Update UI
    Object.keys(accessibilityState).forEach(key => {
        const button = document.getElementById(`${key.replace(/([A-Z])/g, '-$1').toLowerCase()}-toggle`);
        if (button) {
            button.checked = false;
        }
    });
    
    // Apply settings
    applyAccessibilitySettings();
    saveAccessibilityPreferences();
    
    // Announce reset
    announceAccessibilityChange('Accessibility settings', 'reset to defaults');
}

/**
 * Setup keyboard navigation support
 */
function setupKeyboardNavigation() {
    if (!accessibilityState.keyboardNavigation) return;
    
    // Add keyboard navigation styles
    const style = document.createElement('style');
    style.id = 'keyboard-navigation-styles';
    style.textContent = `
        .accessibility-keyboard-nav *:focus {
            outline: 3px solid #0ea5e9 !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.3) !important;
        }
        
        .accessibility-keyboard-nav .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #0ea5e9;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
        }
        
        .accessibility-keyboard-nav .skip-link:focus {
            top: 6px;
        }
    `;
    
    // Remove existing styles if any
    const existing = document.getElementById('keyboard-navigation-styles');
    if (existing) {
        existing.remove();
    }
    
    document.head.appendChild(style);
    
    // Add skip links
    addSkipLinks();
    
    // Setup focus management
    setupFocusManagement();
}

/**
 * Add skip links for keyboard navigation
 */
function addSkipLinks() {
    // Check if skip links already exist
    if (document.querySelector('.skip-link')) return;
    
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <a href="#workout-form" class="skip-link">Skip to workout form</a>
        <a href="#accessibility-panel" class="skip-link">Skip to accessibility options</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
}

/**
 * Setup focus management
 */
function setupFocusManagement() {
    // Trap focus in modals
    const modals = document.querySelectorAll('[role="dialog"], .modal');
    modals.forEach(modal => {
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                trapFocus(e, modal);
            }
        });
    });
    
    // Manage focus for dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Focus new interactive elements
                    const focusable = node.querySelector('input, button, select, textarea, [tabindex]');
                    if (focusable && accessibilityState.keyboardNavigation) {
                        focusable.focus();
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Trap focus within a modal
 */
function trapFocus(e, modal) {
    const focusableElements = modal.querySelectorAll(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

/**
 * Announce accessibility changes to screen readers
 */
function announceAccessibilityChange(feature, status) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${feature} ${status}`;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Get current accessibility state
 */
export function getAccessibilityState() {
    return { ...accessibilityState };
}

/**
 * Set accessibility state
 */
export function setAccessibilityState(newState) {
    Object.assign(accessibilityState, newState);
    applyAccessibilitySettings();
    saveAccessibilityPreferences();
}

// Export for global access
window.initializeAccessibility = initializeAccessibility;
window.getAccessibilityState = getAccessibilityState;
window.setAccessibilityState = setAccessibilityState;
