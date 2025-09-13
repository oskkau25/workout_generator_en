/**
 * Application Constants Module
 * Contains all shared constants and configuration values
 */

// App Configuration
export const APP_CONFIG = {
    name: 'FitFlow',
    version: '2.1',
    description: 'Smart Workout Generator',
    author: 'FitFlow Team'
};

// Workout Configuration
export const WORKOUT_CONFIG = {
    durations: [15, 30, 45, 60],
    defaultDuration: 30,
    fitnessLevels: ['Beginner', 'Intermediate', 'Advanced'],
    defaultLevel: 'Intermediate',
    trainingPatterns: ['Standard', 'Circuit', 'Tabata', 'Pyramid'],
    defaultPattern: 'Standard'
};

// Timer Configuration
export const TIMER_CONFIG = {
    defaultWorkTime: 45,
    defaultRestTime: 15,
    minWorkTime: 10,
    maxWorkTime: 300,
    minRestTime: 5,
    maxRestTime: 180,
    warningTime: 10, // seconds before end
    beepDuration: 180,
    beepFrequency: 880,
    beepVolume: 0.1
};

// Exercise Types
export const EXERCISE_TYPES = {
    WARMUP: 'warmup',
    MAIN: 'main',
    COOLDOWN: 'cooldown'
};

// Equipment Types
export const EQUIPMENT_TYPES = {
    BODYWEIGHT: 'Bodyweight',
    DUMBBELLS: 'Dumbbells',
    RESISTANCE_BANDS: 'Resistance Bands',
    KETTLEBELL: 'Kettlebell',
    JUMP_ROPE: 'Jump Rope',
    ROWER: 'Rower',
    BIKE: 'Bike',
    TREADMILL: 'Treadmill'
};

// UI Configuration
export const UI_CONFIG = {
    animationDuration: 300,
    modalZIndex: 50,
    toastDuration: 3000,
    debounceDelay: 300
};

// Storage Keys
export const STORAGE_KEYS = {
    CURRENT_USER: 'fitflow_current_user',
    USERS: 'fitflow_users',
    WORKOUT_HISTORY: 'fitflow_workout_history',
    ANALYTICS: 'fitflow_analytics',
    SETTINGS: 'fitflow_settings',
    CACHE: 'fitflow_cache'
};

// Achievement Types
export const ACHIEVEMENTS = {
    FIRST_WORKOUT: 'first_workout',
    TEN_WORKOUTS: 'ten_workouts',
    WEEK_STREAK: 'week_streak',
    MONTH_STREAK: 'month_streak',
    HUNDRED_WORKOUTS: 'hundred_workouts'
};

// Smart Substitution Configuration
export const SUBSTITUTION_CONFIG = {
    maxAlternatives: 5,
    scoreWeights: {
        equipment: 30,
        muscleGroups: 25,
        difficulty: 20,
        preferences: 15,
        injurySafety: 10
    }
};

// Analytics Events
export const ANALYTICS_EVENTS = {
    WORKOUT_STARTED: 'workout_started',
    WORKOUT_COMPLETED: 'workout_completed',
    EXERCISE_SWAPPED: 'exercise_swapped',
    USER_REGISTERED: 'user_registered',
    USER_LOGGED_IN: 'user_logged_in',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked'
};

// Error Messages
export const ERROR_MESSAGES = {
    INVALID_USERNAME: 'Please enter a valid username',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    USERNAME_EXISTS: 'Username already taken',
    INVALID_CREDENTIALS: 'Invalid username or password',
    NETWORK_ERROR: 'Network error. Please try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    REGISTRATION_SUCCESS: 'Account created successfully!',
    LOGIN_SUCCESS: 'Welcome back!',
    WORKOUT_SAVED: 'Workout saved successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!'
};

// Color Scheme (for consistency)
export const COLORS = {
    primary: '#0ea5e9',
    secondary: '#64748b',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f97316',
    danger: '#ef4444',
    dark: '#0f172a',
    light: '#f8fafc'
};

// Export all constants as a single object for convenience
export const CONSTANTS = {
    APP_CONFIG,
    WORKOUT_CONFIG,
    TIMER_CONFIG,
    EXERCISE_TYPES,
    EQUIPMENT_TYPES,
    UI_CONFIG,
    STORAGE_KEYS,
    ACHIEVEMENTS,
    SUBSTITUTION_CONFIG,
    ANALYTICS_EVENTS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    COLORS
};

// Note: CONSTANTS is made available globally in main.js for backward compatibility
