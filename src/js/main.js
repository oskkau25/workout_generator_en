/**
 * Main Module Loader
 * Imports and initializes all application modules
 * 
 * This file serves as the entry point for the modular application
 * and ensures all modules are loaded in the correct order
 */

// Import core modules
import { exercises, exerciseDatabase } from './core/exercise-database.js';
import { 
    generateWorkout, 
    validateForm, 
    getFormData, 
    handleFormSubmission 
} from './core/workout-generator.js';
import { CONSTANTS } from './utils/constants.js';

// Import feature modules
import { 
    findExerciseAlternatives, 
    suggestExerciseSubstitution, 
    enhanceWorkoutWithSubstitutions,
    showSubstitutionDetails 
} from './features/smart-substitution.js';

import { UserAccount, userAccount } from './features/user-accounts.js';

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
            this.updateUserInterface();
        } else {
            console.log('👤 No user logged in');
        }
    }
    
    /**
     * Update user interface based on login status
     */
    updateUserInterface() {
        const userSection = document.getElementById('user-account-section');
        const guestSection = document.getElementById('guest-section');
        
        if (userAccount.isLoggedIn) {
            if (userSection) userSection.classList.remove('hidden');
            if (guestSection) guestSection.classList.add('hidden');
            
            // Update user info
            const userName = document.getElementById('user-name');
            const userStreak = document.getElementById('user-streak');
            
            if (userName) userName.textContent = userAccount.currentUser.profile.name;
            if (userStreak) {
                const streak = userAccount.getStats().currentStreak;
                userStreak.textContent = `${streak} day streak`;
            }
        } else {
            if (userSection) userSection.classList.add('hidden');
            if (guestSection) guestSection.classList.remove('hidden');
        }
    }
    
    /**
     * Setup event listeners for modular functionality
     */
    setupEventListeners() {
        // Form submission event listener
        document.addEventListener('DOMContentLoaded', () => {
            this.setupFormListeners();
            this.setupUserAccountListeners();
        });
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
    }
    
    /**
     * Setup user account event listeners
     */
    setupUserAccountListeners() {
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
    }
    
    /**
     * Show login modal
     */
    showLoginModal() {
        // This will be implemented when we extract the UI modules
        console.log('🔐 Show login modal');
    }
    
    /**
     * Show register modal
     */
    showRegisterModal() {
        // This will be implemented when we extract the UI modules
        console.log('📝 Show register modal');
    }
    
    /**
     * Show profile modal
     */
    showProfileModal() {
        // This will be implemented when we extract the UI modules
        console.log('👤 Show profile modal');
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
document.addEventListener('DOMContentLoaded', () => {
    window.fitFlowApp = new FitFlowApp();
});

// Export for module usage
export default FitFlowApp;
