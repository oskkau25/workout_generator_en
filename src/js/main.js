/**
 * Main Module Loader
 * Imports and initializes all application modules
 * 
 * This file serves as the entry point for the modular application
 * and ensures all modules are loaded in the correct order
 */

console.log('🔧 MAIN.JS LOADED - v4 - CACHE BUSTED');

// Import core modules
import { exercises, exerciseDatabase } from './core/exercise-database.js';
import { 
    generateWorkout, 
    validateForm, 
    getFormData, 
    handleFormSubmission 
} from './core/workout-generator.js?v=24';
import { CONSTANTS } from './utils/constants.js';

// Import feature modules
import { 
    findExerciseAlternatives, 
    suggestExerciseSubstitution, 
    enhanceWorkoutWithSubstitutions,
    showSubstitutionDetails 
} from './features/smart-substitution.js';

import { UserAccount, userAccount } from './features/user-accounts.js';
import { setupWorkoutPlayerListeners } from './features/workout-player.js?v=24';

// Import UI modules (to be created)
// import { WorkoutUI } from './ui/workout-ui.js';
// import { ModalManager } from './ui/modals.js';

/**
 * Application Initialization
 * Sets up the modular application and ensures backward compatibility
 */
class FitFlowApp {
    constructor() {
        this.modules = {
            exerciseDatabase,
            workoutGenerator: {
                generateWorkout,
                validateForm,
                getFormData,
                handleFormSubmission
            },
            smartSubstitution: {
                findExerciseAlternatives,
                suggestExerciseSubstitution,
                enhanceWorkoutWithSubstitutions,
                showSubstitutionDetails
            },
            userAccount,
            constants: CONSTANTS
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 FitFlow App Initializing...');
        console.log('📦 Modules loaded:', Object.keys(this.modules));
        
        // Make modules globally available for backward compatibility
        this.setupGlobalExports();
        
        // Initialize user account system
        this.initializeUserAccount();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ FitFlow App Initialized Successfully!');
    }
    
    /**
     * Setup global exports for backward compatibility
     */
    setupGlobalExports() {
        // Exercise database
        window.exercises = exercises;
        window.exerciseDatabase = exerciseDatabase;
        
        // Workout generator
        window.generateWorkout = generateWorkout;
        window.validateForm = validateForm;
        window.getFormData = getFormData;
        window.handleFormSubmission = handleFormSubmission;
        
        // Smart substitution
        window.findExerciseAlternatives = findExerciseAlternatives;
        window.suggestExerciseSubstitution = suggestExerciseSubstitution;
        window.enhanceWorkoutWithSubstitutions = enhanceWorkoutWithSubstitutions;
        window.showSubstitutionDetails = showSubstitutionDetails;
        
        // User account
        window.UserAccount = UserAccount;
        window.userAccount = userAccount;
        
        // Constants
        window.CONSTANTS = CONSTANTS;
        
        // App instance
        window.FitFlowApp = this;
    }
    
    /**
     * Initialize user account system
     */
    initializeUserAccount() {
        if (userAccount.isLoggedIn) {
            console.log('👤 User logged in:', userAccount.currentUser.profile.name);
            // Ensure DOM is ready before updating UI
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                this.updateUserInterface();
            } else {
                document.addEventListener('DOMContentLoaded', () => this.updateUserInterface());
            }
        } else {
            console.log('👤 No user logged in');
        }
    }
    
    /**
     * Setup click-outside-to-close functionality for modals
     */
    setupModalClickOutside() {
        const modals = ['login-modal', 'register-modal', 'profile-modal', 'password-reset-modal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    // Close modal if clicking on the backdrop (not the modal content)
                    if (e.target === modal) {
                        this.hideModal(modalId);
                    }
                });
            }
        });
    }

    /**
     * Update user interface based on login status
     */
    updateUserInterface() {
        console.log('🔄 Updating user interface...');
        console.log('👤 User logged in:', userAccount.isLoggedIn);
        console.log('👤 Current user:', userAccount.currentUser);
        
        const userSection = document.getElementById('user-account-section');
        const guestSection = document.getElementById('guest-section');
        
        console.log('🎯 User section found:', !!userSection);
        console.log('🎯 Guest section found:', !!guestSection);
        
        if (userAccount.isLoggedIn) {
            console.log('✅ Showing user section, hiding guest section');
            if (userSection) userSection.classList.remove('hidden');
            if (guestSection) guestSection.classList.add('hidden');
            
            // Update user info
            const userName = document.getElementById('user-name');
            const userStreak = document.getElementById('user-streak');
            const userAvatar = document.getElementById('user-avatar');
            
            console.log('🎯 User name element found:', !!userName);
            console.log('🎯 User streak element found:', !!userStreak);
            console.log('🎯 User avatar element found:', !!userAvatar);
            
            if (userName) {
                userName.textContent = userAccount.currentUser.profile.name;
                console.log('✅ Updated user name to:', userAccount.currentUser.profile.name);
            }
            if (userStreak) {
                const streak = userAccount.getStats().currentStreak;
                userStreak.textContent = `${streak} day streak`;
                console.log('✅ Updated user streak to:', streak);
            }
            if (userAvatar) {
                userAvatar.textContent = userAccount.currentUser.profile.avatar || '🏃‍♂️';
                console.log('✅ Updated user avatar to:', userAccount.currentUser.profile.avatar);
            }
        } else {
            console.log('❌ Hiding user section, showing guest section');
            if (userSection) userSection.classList.add('hidden');
            if (guestSection) guestSection.classList.remove('hidden');
        }
    }
    
    /**
     * Setup event listeners for modular functionality
     */
    setupEventListeners() {
        const attachAll = () => {
                    this.setupFormListeners();
        this.setupUserAccountListeners();
        this.setupWorkoutPlayerListeners();
        };
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            attachAll();
        } else {
            document.addEventListener('DOMContentLoaded', attachAll);
        }
    }
    
    /**
     * Setup form event listeners
     */
    setupFormListeners() {
        const workoutForm = document.getElementById('workout-form');
        if (workoutForm) {
            workoutForm.addEventListener('submit', handleFormSubmission);
            console.log('📝 Workout form listener attached');
        } else {
            console.warn('⚠️ Workout form not found');
        }
        
        // Setup training pattern listeners
        this.setupTrainingPatternListeners();
    }
    
    /**
     * Setup training pattern event listeners
     */
    setupTrainingPatternListeners() {
        const patternInputs = document.querySelectorAll('input[name="training-pattern"]');
        
        patternInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const pattern = e.target.value;
                this.showPatternSettings(pattern);
                console.log('🔄 Training pattern changed to:', pattern);
            });
        });
        
        console.log('🔄 Training pattern listeners attached');
    }
    
    /**
     * Show pattern-specific settings
     */
    showPatternSettings(pattern) {
        const patternSettings = document.getElementById('pattern-settings');
        const circuitSettings = document.getElementById('circuit-settings');
        const tabataSettings = document.getElementById('tabata-settings');
        const pyramidSettings = document.getElementById('pyramid-settings');
        
        // Hide all settings first
        if (circuitSettings) circuitSettings.classList.add('hidden');
        if (tabataSettings) tabataSettings.classList.add('hidden');
        if (pyramidSettings) pyramidSettings.classList.add('hidden');
        
        // Show pattern settings container
        if (patternSettings) {
            patternSettings.classList.remove('hidden');
        }
        
        // Show specific settings based on pattern
        switch(pattern) {
            case 'circuit':
                if (circuitSettings) circuitSettings.classList.remove('hidden');
                break;
            case 'tabata':
                if (tabataSettings) tabataSettings.classList.remove('hidden');
                break;
            case 'pyramid':
                if (pyramidSettings) pyramidSettings.classList.remove('hidden');
                break;
            default:
                if (patternSettings) patternSettings.classList.add('hidden');
                break;
        }
    }
    
    /**
     * Setup user account event listeners
     */
    setupUserAccountListeners() {
        console.log('🔧 Setting up user account event listeners...');
        // Login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }
        
        // Register button
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.showRegisterModal());
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Profile button
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => this.showProfileModal());
        }

        // Forgot password button
        const forgotPasswordBtn = document.getElementById('forgot-password-btn');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', () => this.showPasswordResetModal());
        }

        // Login modal close button
        const closeLoginModal = document.getElementById('close-login-modal');
        if (closeLoginModal) {
            console.log('✅ Attaching close button listener to login modal');
            closeLoginModal.addEventListener('click', () => this.hideModal('login-modal'));
        } else {
            console.warn('⚠️ Login modal close button not found');
        }

        // Register modal close button
        const closeRegisterModal = document.getElementById('close-register-modal');
        if (closeRegisterModal) {
            closeRegisterModal.addEventListener('click', () => this.hideModal('register-modal'));
        }

        // Profile modal close button
        const closeProfileModal = document.getElementById('close-profile-modal');
        if (closeProfileModal) {
            closeProfileModal.addEventListener('click', () => this.hideModal('profile-modal'));
        }

        // Switch to register button (in login modal)
        const switchToRegister = document.getElementById('switch-to-register');
        if (switchToRegister) {
            console.log('✅ Attaching register button listener');
            switchToRegister.addEventListener('click', () => {
                this.hideModal('login-modal');
                this.showRegisterModal();
            });
        } else {
            console.warn('⚠️ Switch to register button not found');
        }

        // Switch to login button (in register modal)
        const switchToLogin = document.getElementById('switch-to-login');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', () => {
                this.hideModal('register-modal');
                this.showLoginModal();
            });
        }

        // Add click-outside-to-close functionality for all modals
        this.setupModalClickOutside();

        // Password reset modal close button
        const closePasswordResetModal = document.getElementById('close-password-reset-modal');
        if (closePasswordResetModal) {
            closePasswordResetModal.addEventListener('click', () => this.hideModal('password-reset-modal'));
        }

        // Back to login from reset
        const backToLoginFromReset = document.getElementById('back-to-login-from-reset');
        if (backToLoginFromReset) {
            backToLoginFromReset.addEventListener('click', () => {
                this.hideModal('password-reset-modal');
                this.showLoginModal();
            });
        }

        // Password reset form submission
        const passwordResetForm = document.getElementById('password-reset-form');
        if (passwordResetForm) {
            passwordResetForm.addEventListener('submit', (e) => this.handlePasswordReset(e));
        }

        // Registration form submission
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Avatar selection
        this.setupAvatarSelection();
    }
    
    /**
     * Show login modal
     */
    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.removeAttribute('aria-hidden');
        } else {
            console.log('🔐 Show login modal');
        }
    }
    
    /**
     * Show register modal
     */
    showRegisterModal() {
        const modal = document.getElementById('register-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.removeAttribute('aria-hidden');
        } else {
            console.log('📝 Show register modal');
        }
    }
    
    /**
     * Show profile modal
     */
    showProfileModal() {
        // This will be implemented when we extract the UI modules
        console.log('👤 Show profile modal');
    }

    /**
     * Show password reset modal
     */
    showPasswordResetModal() {
        const modal = document.getElementById('password-reset-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.removeAttribute('aria-hidden');
        } else {
            console.log('🔑 Show password reset modal');
        }
    }
    
    /**
     * Handle user logout
     */
    handleLogout() {
        userAccount.logout();
        this.updateUserInterface();
        console.log('👋 User logged out');
    }

    /**
     * Hide modal
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Handle password reset form submission
     */
    async handlePasswordReset(e) {
        e.preventDefault();
        
        const username = document.getElementById('reset-username').value;
        const securityQuestion = document.getElementById('reset-security-question').value;
        const securityAnswer = document.getElementById('reset-security-answer').value;
        const newPassword = document.getElementById('reset-new-password').value;
        
        const result = await userAccount.resetPassword(username, securityQuestion, securityAnswer, newPassword);
        
        const errorDiv = document.getElementById('password-reset-error');
        if (result.success) {
            errorDiv.className = 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded';
            errorDiv.textContent = result.message;
            errorDiv.classList.remove('hidden');
            
            // Clear form
            document.getElementById('password-reset-form').reset();
            
            // Close modal after 2 seconds
            setTimeout(() => {
                this.hideModal('password-reset-modal');
                this.showLoginModal();
            }, 2000);
        } else {
            errorDiv.className = 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded';
            errorDiv.textContent = result.error;
            errorDiv.classList.remove('hidden');
        }
    }

    /**
     * Handle registration form submission
     */
    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const experience = document.getElementById('register-experience').value;
        const goal = document.getElementById('register-goal').value;
        const avatar = document.querySelector('input[name="avatar"]:checked')?.value || '🏃‍♂️';
        const securityQuestion = document.getElementById('register-security-question').value;
        const securityAnswer = document.getElementById('register-security-answer').value;
        const errorDiv = document.getElementById('register-error');
        
        // Validate required fields
        if (!username.trim()) {
            if (errorDiv) {
                errorDiv.textContent = 'Please enter a username.';
                errorDiv.classList.remove('hidden');
            }
            return;
        }
        
        if (username.length < 3) {
            if (errorDiv) {
                errorDiv.textContent = 'Username must be at least 3 characters long.';
                errorDiv.classList.remove('hidden');
            }
            return;
        }
        
        if (!securityQuestion || !securityAnswer.trim()) {
            if (errorDiv) {
                errorDiv.textContent = 'Please select a security question and provide an answer for password reset.';
                errorDiv.classList.remove('hidden');
            }
            return;
        }
        
        try {
            const profile = {
                name: name,
                experience: experience,
                goals: [goal],
                avatar: avatar,
                securityQuestion: securityQuestion,
                securityAnswer: securityAnswer
            };
            
            const result = await userAccount.register(username, password, profile);
            
            if (result.success) {
                this.hideModal('register-modal');
                // Small delay to ensure modal is closed before updating UI
                setTimeout(() => {
                    this.updateUserInterface();
                }, 100);
                console.log('✅ Account created successfully!');
            } else {
                if (errorDiv) {
                    errorDiv.textContent = result.error;
                    errorDiv.classList.remove('hidden');
                }
            }
        } catch (error) {
            if (errorDiv) {
                errorDiv.textContent = 'An error occurred. Please try again.';
                errorDiv.classList.remove('hidden');
            }
        }
    }

    /**
     * Handle login form submission
     */
    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');
        
        try {
            const result = await userAccount.login(username, password);
            
            if (result.success) {
                this.hideModal('login-modal');
                // Small delay to ensure modal is closed before updating UI
                setTimeout(() => {
                    this.updateUserInterface();
                }, 100);
                console.log('✅ Login successful!');
            } else {
                if (errorDiv) {
                    errorDiv.textContent = result.error;
                    errorDiv.classList.remove('hidden');
                }
            }
        } catch (error) {
            if (errorDiv) {
                errorDiv.textContent = 'An error occurred. Please try again.';
                errorDiv.classList.remove('hidden');
            }
        }
    }

    /**
     * Setup avatar selection functionality
     */
    setupAvatarSelection() {
        const avatarOptions = document.querySelectorAll('input[name="avatar"]');
        avatarOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                // Update visual selection
                avatarOptions.forEach(opt => {
                    const div = opt.nextElementSibling;
                    if (opt.checked) {
                        div.classList.add('border-fit-primary', 'bg-blue-50');
                    } else {
                        div.classList.remove('border-fit-primary', 'bg-blue-50');
                    }
                });
            });
        });
    }
    
    /**
     * Setup workout player listeners
     */
    setupWorkoutPlayerListeners() {
        setupWorkoutPlayerListeners();
        console.log('🎮 Workout player listeners attached');
    }
    
    /**
     * Get module by name
     * @param {string} moduleName - Name of the module
     * @returns {Object} Module instance
     */
    getModule(moduleName) {
        return this.modules[moduleName];
    }
    
    /**
     * Get all available modules
     * @returns {Object} All modules
     */
    getAllModules() {
        return this.modules;
    }
}

// Initialize the application when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM Content Loaded - Initializing FitFlow App...');
        window.fitFlowApp = new FitFlowApp();
    });
} else {
    // DOM is already loaded
    console.log('📄 DOM Already Loaded - Initializing FitFlow App...');
    window.fitFlowApp = new FitFlowApp();
}

// Export for module usage
export default FitFlowApp;
