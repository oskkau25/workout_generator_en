/**
 * User Account System Module
 * Handles user registration, login, profile management, and progress tracking
 * 
 * Features:
 * - Secure password hashing with PBKDF2
 * - User profile management
 * - Workout history tracking
 * - Achievement system
 * - Progress analytics
 * - Local storage persistence
 */

/**
 * User Account Management Class
 * Handles all user-related functionality including authentication and data management
 */
export class UserAccount {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }
    
    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('fitflow_current_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isLoggedIn = true;
                this.userId = this.currentUser.id;
            } catch (error) {
                console.error('Error loading saved user:', error);
                this.logout();
            }
        }
    }
    
    /**
     * Register a new user
     * @param {string} username - User username
     * @param {string} password - User password
     * @param {Object} profile - User profile data
     * @returns {Promise<Object>} Registration result
     */
    async register(username, password, profile = {}) {
        try {
            // Check if username already exists
            const existingUsers = JSON.parse(localStorage.getItem('fitflow_users') || '[]');
            if (existingUsers.find(u => u.username === username)) {
                throw new Error('Username already taken');
            }
            
            // Create new user
            const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const hashedPassword = await this.hashPassword(password);
            
            const newUser = {
                id: userId,
                username: username,
                password: hashedPassword,
                profile: {
                    name: profile.name || 'Fitness Enthusiast',
                    avatar: profile.avatar || '🏃‍♂️',
                    goals: profile.goals || ['Strength', 'Endurance'],
                    experience: profile.experience || 'Beginner',
                    securityQuestion: profile.securityQuestion || '',
                    securityAnswer: profile.securityAnswer || '',
                    preferences: {
                        workoutDuration: profile.workoutDuration || 30,
                        preferredEquipment: profile.preferredEquipment || ['Bodyweight'],
                        trainingPatterns: profile.trainingPatterns || ['Standard'],
                        restTime: profile.restTime || 60
                    },
                    stats: {
                        totalWorkouts: 0,
                        totalWorkoutTime: 0,
                        currentStreak: 0,
                        longestStreak: 0,
                        lastWorkoutDate: null,
                        favoriteExercises: [],
                        achievements: []
                    }
                },
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            // Save user to storage
            existingUsers.push(newUser);
            localStorage.setItem('fitflow_users', JSON.stringify(existingUsers));
            
            // Auto-login after registration
            this.currentUser = newUser;
            this.isLoggedIn = true;
            this.userId = userId;
            localStorage.setItem('fitflow_current_user', JSON.stringify(newUser));
            
            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Login user
     * @param {string} username - User username
     * @param {string} password - User password
     * @returns {Promise<Object>} Login result
     */
    async login(username, password) {
        try {
            const users = JSON.parse(localStorage.getItem('fitflow_users') || '[]');
            const user = users.find(u => u.username === username);
            
            if (!user) {
                throw new Error('User not found');
            }
            
            const isValidPassword = await this.verifyPassword(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }
            
            // Update last login
            user.lastLogin = new Date().toISOString();
            localStorage.setItem('fitflow_users', JSON.stringify(users));
            
            // Set current user
            this.currentUser = user;
            this.isLoggedIn = true;
            this.userId = user.id;
            localStorage.setItem('fitflow_current_user', JSON.stringify(user));
            
            return { success: true, user: user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Logout user
     */
    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.userId = null;
        localStorage.removeItem('fitflow_current_user');
    }
    
    /**
     * Update user profile
     * @param {Object} updates - Profile updates
     * @returns {boolean} Success status
     */
    updateProfile(updates) {
        if (!this.isLoggedIn) return false;
        
        try {
            // Update current user
            Object.assign(this.currentUser.profile, updates);
            
            // Update in storage
            const users = JSON.parse(localStorage.getItem('fitflow_users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.userId);
            if (userIndex !== -1) {
                users[userIndex] = this.currentUser;
                localStorage.setItem('fitflow_users', JSON.stringify(users));
                localStorage.setItem('fitflow_current_user', JSON.stringify(this.currentUser));
            }
            
            return true;
        } catch (error) {
            console.error('Error updating profile:', error);
            return false;
        }
    }
    
    /**
     * Record a completed workout
     * @param {Object} workoutData - Workout data
     * @returns {boolean} Success status
     */
    recordWorkout(workoutData) {
        if (!this.isLoggedIn) return false;
        
        try {
            const workout = {
                id: 'workout_' + Date.now(),
                date: new Date().toISOString(),
                duration: workoutData.duration || 0,
                exercises: workoutData.exercises || [],
                type: workoutData.type || 'Standard',
                difficulty: workoutData.difficulty || 'Intermediate',
                notes: workoutData.notes || ''
            };
            
            // Add to workout history
            if (!this.currentUser.workoutHistory) {
                this.currentUser.workoutHistory = [];
            }
            this.currentUser.workoutHistory.unshift(workout);
            
            // Update stats
            this.currentUser.profile.stats.totalWorkouts++;
            this.currentUser.profile.stats.totalWorkoutTime += workout.duration;
            this.currentUser.profile.stats.lastWorkoutDate = workout.date;
            
            // Update streak
            this.updateStreak();
            
            // Check for achievements
            this.checkAchievements();
            
            // Save updated user
            this.saveUser();
            
            return true;
        } catch (error) {
            console.error('Error recording workout:', error);
            return false;
        }
    }
    
    /**
     * Update user streak
     */
    updateStreak() {
        const today = new Date().toDateString();
        const lastWorkoutDate = this.currentUser.profile.stats.lastWorkoutDate;
        
        if (lastWorkoutDate) {
            const lastDate = new Date(lastWorkoutDate).toDateString();
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
            
            if (lastDate === today) {
                // Same day, keep current streak
                return;
            } else if (lastDate === yesterday) {
                // Consecutive day, increment streak
                this.currentUser.profile.stats.currentStreak++;
            } else {
                // Streak broken, reset
                this.currentUser.profile.stats.currentStreak = 1;
            }
        } else {
            // First workout
            this.currentUser.profile.stats.currentStreak = 1;
        }
        
        // Update longest streak
        if (this.currentUser.profile.stats.currentStreak > this.currentUser.profile.stats.longestStreak) {
            this.currentUser.profile.stats.longestStreak = this.currentUser.profile.stats.currentStreak;
        }
    }
    
    /**
     * Check and award achievements
     */
    checkAchievements() {
        const stats = this.currentUser.profile.stats;
        const achievements = this.currentUser.profile.stats.achievements;
        
        const newAchievements = [];
        
        // First Workout
        if (stats.totalWorkouts === 1 && !achievements.includes('first_workout')) {
            newAchievements.push('first_workout');
        }
        
        // 10 Workouts
        if (stats.totalWorkouts === 10 && !achievements.includes('ten_workouts')) {
            newAchievements.push('ten_workouts');
        }
        
        // 7 Day Streak
        if (stats.currentStreak === 7 && !achievements.includes('week_streak')) {
            newAchievements.push('week_streak');
        }
        
        // 30 Day Streak
        if (stats.currentStreak === 30 && !achievements.includes('month_streak')) {
            newAchievements.push('month_streak');
        }
        
        // Add new achievements
        achievements.push(...newAchievements);
    }
    
    /**
     * Get user workout history
     * @param {number} limit - Number of workouts to return
     * @returns {Array} Workout history
     */
    getWorkoutHistory(limit = 10) {
        if (!this.isLoggedIn || !this.currentUser.workoutHistory) return [];
        return this.currentUser.workoutHistory.slice(0, limit);
    }
    
    /**
     * Get user statistics
     * @returns {Object} User statistics
     */
    getStats() {
        if (!this.isLoggedIn) return null;
        return this.currentUser.profile.stats;
    }
    
    /**
     * Hash password using PBKDF2
     * @param {string} password - Plain text password
     * @returns {Promise<string>} Hashed password
     */
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const salt = crypto.getRandomValues(new Uint8Array(16));
        
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            data,
            'PBKDF2',
            false,
            ['deriveBits']
        );
        
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );
        
        const hashArray = Array.from(new Uint8Array(derivedBits));
        const saltArray = Array.from(salt);
        
        return JSON.stringify({
            hash: hashArray,
            salt: saltArray,
            iterations: 100000
        });
    }
    
    /**
     * Verify password against hash
     * @param {string} password - Plain text password
     * @param {string} hashedPassword - Hashed password
     * @returns {Promise<boolean>} Verification result
     */
    async verifyPassword(password, hashedPassword) {
        try {
            const { hash, salt, iterations } = JSON.parse(hashedPassword);
            
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                data,
                'PBKDF2',
                false,
                ['deriveBits']
            );
            
            const derivedBits = await crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt: new Uint8Array(salt),
                    iterations: iterations,
                    hash: 'SHA-256'
                },
                keyMaterial,
                256
            );
            
            const hashArray = Array.from(new Uint8Array(derivedBits));
            return JSON.stringify(hashArray) === JSON.stringify(hash);
        } catch (error) {
            console.error('Error verifying password:', error);
            return false;
        }
    }
    
    /**
     * Reset user password using security question
     * @param {string} email - User email
     * @param {string} securityQuestion - Security question type
     * @param {string} securityAnswer - Security answer
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Reset result
     */
    async resetPassword(username, securityQuestion, securityAnswer, newPassword) {
        try {
            const users = JSON.parse(localStorage.getItem('fitflow_users') || '[]');
            const user = users.find(u => u.username === username);
            
            if (!user) {
                throw new Error('User not found');
            }
            
            if (user.profile.securityQuestion !== securityQuestion) {
                throw new Error('Invalid security question');
            }
            
            // Hash the security answer for comparison
            const hashedAnswer = await this.hashPassword(securityAnswer.toLowerCase().trim());
            if (user.profile.securityAnswer !== hashedAnswer) {
                throw new Error('Invalid security answer');
            }
            
            // Update password
            const newHashedPassword = await this.hashPassword(newPassword);
            user.password = newHashedPassword;
            
            // Save updated user
            const userIndex = users.findIndex(u => u.username === username);
            users[userIndex] = user;
            localStorage.setItem('fitflow_users', JSON.stringify(users));
            
            return { success: true, message: 'Password reset successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Save user data to storage
     */
    saveUser() {
        if (!this.isLoggedIn) return;
        
        try {
            const users = JSON.parse(localStorage.getItem('fitflow_users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.userId);
            if (userIndex !== -1) {
                users[userIndex] = this.currentUser;
                localStorage.setItem('fitflow_users', JSON.stringify(users));
                localStorage.setItem('fitflow_current_user', JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    }
}

// Create global instance for backward compatibility
export const userAccount = new UserAccount();

// Make available globally
window.UserAccount = UserAccount;
window.userAccount = userAccount;
