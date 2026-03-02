/**
 * Main Module Loader
 * Imports and initializes all application modules
 *
 * This file serves as the entry point for the modular application
 * and ensures all modules are loaded in the correct order
 */

const DEBUG = (() => {
  try {
    return window.__DEBUG__ === true || window.localStorage.getItem('fitflow_de bug') === '1';
  } catch {
    return window.__DEBUG__ === true;
  }
})();

function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

debugLog('🔧 MAIN.JS LOADED - v24 - CACHE BUSTED');

// Import core modules
import { exercises, exerciseDatabase } from './core/exercise-database.js';
import {
  generateWorkout,
  validateForm,
  getFormData,
  handleFormSubmission,
} from './core/workout-generator.js?v=24';
import { CONSTANTS } from './utils/constants.js';
import { initializeEnhancedForm, getValidatedFormData } from './features/enhanced-form.js';
import { initializeEnhancedTimer } from './features/enhanced-timer.js';
import { initializeAccessibility } from './features/accessibility.js';
import { initializeVisualEnhancements } from './features/visual-enhancements.js';
import {
  initializeAnalyticsTracker,
  trackModeSelected,
  trackEvent,
} from './features/analytics-tracker.js';

// Import feature modules
import {
  findExerciseAlternatives,
  suggestExerciseSubstitution,
  enhanceWorkoutWithSubstitutions,
  showSubstitutionDetails,
} from './features/smart-substitution.js';

import { UserAccount, userAccount } from './features/user-accounts.js';
import { setupWorkoutPlayerListeners } from './features/workout-player.js?v=32';

// Import UI modules (to be created)
// import { WorkoutUI } from './ui/workout-ui.js';
// import { ModalManager } from './ui/modals.js';

/**
 * Application Initialization
 * Sets up the modular application and ensures backward compatibility
 */
class FitFlowApp {
  constructor() {
    this.storageKeys = {
      whatsNewSeen: 'fitflow_whats_new_seen_v2_2_0',
      whatsNewDismissed: 'fitflow_whats_new_dismissed_v2_2_0',
    };
    this.mobileViewportQuery = null;
    this.handleViewportChange = null;

    this.modules = {
      exerciseDatabase,
      workoutGenerator: {
        generateWorkout,
        validateForm,
        getFormData,
        handleFormSubmission,
      },
      smartSubstitution: {
        findExerciseAlternatives,
        suggestExerciseSubstitution,
        enhanceWorkoutWithSubstitutions,
        showSubstitutionDetails,
      },
      userAccount,
      constants: CONSTANTS,
    };
    this.appOpenTracked = false;
    this.workoutCompletionTracked = false;
    this.startWorkoutWrapped = false;

    this.init();
  }

  init() {
    debugLog('🚀 FitFlow App Initializing...');
    debugLog('📦 Modules loaded:', Object.keys(this.modules));

    // Make modules globally available for backward compatibility
    this.setupGlobalExports();

    // Initialize analytics session tracking
    initializeAnalyticsTracker();
    this.trackAppOpen();

    // Initialize user account system
    this.initializeUserAccount();

    // Initialize enhanced form features
    initializeEnhancedForm();

    // Initialize accessibility features
    initializeAccessibility();

    // Initialize visual enhancements
    initializeVisualEnhancements();

    // Optimize the mobile-first home funnel
    this.setupHomeScreenFunnel();

    // Setup event listeners
    this.setupEventListeners();

    // Setup dashboard functionality
    this.setupDashboard();

    debugLog('✅ FitFlow App Initialized Successfully!');
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

    // Enhanced form features
    window.getValidatedFormData = getValidatedFormData;

    // Accessibility features
    window.initializeAccessibility = initializeAccessibility;

    // Visual enhancements
    window.initializeVisualEnhancements = initializeVisualEnhancements;

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
      debugLog('👤 User logged in:', userAccount.currentUser.profile.name);
      // Ensure DOM is ready before updating UI
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        this.updateUserInterface();
      } else {
        document.addEventListener('DOMContentLoaded', () => this.updateUserInterface());
      }
    } else {
      debugLog('👤 No user logged in');
    }
  }

  /**
   * Setup click-outside-to-close functionality for modals
   */
  setupModalClickOutside() {
    const modals = ['login-modal', 'register-modal', 'profile-modal', 'password-reset-modal'];

    modals.forEach((modalId) => {
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
    debugLog('🔄 Updating user interface...');
    debugLog('👤 User logged in:', userAccount.isLoggedIn);
    debugLog('👤 Current user:', userAccount.currentUser);

    const userSection = document.getElementById('user-account-section');
    const guestSection = document.getElementById('guest-section');

    debugLog('🎯 User section found:', !!userSection);
    debugLog('🎯 Guest section found:', !!guestSection);

    if (userAccount.isLoggedIn) {
      debugLog('✅ Showing user section, hiding guest section');
      if (userSection) userSection.classList.remove('hidden');
      if (guestSection) guestSection.classList.add('hidden');

      // Update user info
      const userName = document.getElementById('user-name');
      const userStreak = document.getElementById('user-streak');
      const userAvatar = document.getElementById('user-avatar');

      debugLog('🎯 User name element found:', !!userName);
      debugLog('🎯 User streak element found:', !!userStreak);
      debugLog('🎯 User avatar element found:', !!userAvatar);

      if (userName) {
        userName.textContent = userAccount.currentUser.profile.name;
        debugLog('✅ Updated user name to:', userAccount.currentUser.profile.name);
      }
      if (userStreak) {
        const streak = userAccount.getStats().currentStreak;
        userStreak.textContent = `${streak} day streak`;
        debugLog('✅ Updated user streak to:', streak);
      }
      if (userAvatar) {
        userAvatar.textContent = userAccount.currentUser.profile.avatar || '🏃‍♂️';
        debugLog('✅ Updated user avatar to:', userAccount.currentUser.profile.avatar);
      }
    } else {
      debugLog('❌ Hiding user section, showing guest section');
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
      // setupWorkoutPlayerListeners() is called when workout player is rendered
      this.setupDashboardListeners();
      this.setupFunnelEventListeners();
      this.setupFeedbackListeners();
      this.instrumentWorkoutStart();
      this.observeWorkoutCompletion();
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
      workoutForm.addEventListener('submit', (event) => this.handleInstrumentedWorkoutSubmit(event));
      debugLog('📝 Workout form listener attached');
    } else {
      debugLog('⚠️ Workout form not found');
    }

    // Setup training pattern listeners
    this.setupTrainingPatternListeners();
  }

  trackAppOpen() {
    if (this.appOpenTracked) return;
    this.appOpenTracked = true;
    trackEvent('app_open', {
      path: window.location.pathname,
      referrer: document.referrer || null,
    });
  }

  handleInstrumentedWorkoutSubmit(event) {
    const previousWorkout = window.currentWorkoutData;
    handleFormSubmission(event);
    const nextWorkout = window.currentWorkoutData;
    if (nextWorkout && nextWorkout !== previousWorkout) {
      trackEvent('workout_generated', {
        pattern: nextWorkout.trainingPattern || 'standard',
        duration: nextWorkout.duration || nextWorkout.metadata?.estimatedTime || null,
        level: nextWorkout.metadata?.level || null,
        equipment: nextWorkout.metadata?.equipment || null,
        exerciseCount: Array.isArray(nextWorkout.sequence) ? nextWorkout.sequence.length : 0,
      });
    }
  }

  instrumentWorkoutStart(retryCount = 0) {
    if (this.startWorkoutWrapped) return;
    if (typeof window.startWorkout === 'function') {
      const original = window.startWorkout;
      if (!original.__fitflowWrapped) {
        window.startWorkout = (...args) => {
          this.workoutCompletionTracked = false;
          trackEvent('workout_started', {
            pattern: window.currentWorkoutData?.trainingPattern || 'standard',
            duration: window.currentWorkoutData?.duration || null,
            exerciseCount: Array.isArray(window.currentWorkoutData?.sequence)
              ? window.currentWorkoutData.sequence.length
              : Array.isArray(window.currentWorkout)
                ? window.currentWorkout.length
                : 0,
          });
          return original.apply(window, args);
        };
        window.startWorkout.__fitflowWrapped = true;
      }
      this.startWorkoutWrapped = true;
      return;
    }

    if (retryCount < 10) {
      setTimeout(() => this.instrumentWorkoutStart(retryCount + 1), 250);
    }
  }

  observeWorkoutCompletion() {
    const player = document.getElementById('workout-player');
    if (!player || player.__fitflowObserverAttached) return;
    const checkCompletion = () => {
      if (this.workoutCompletionTracked) return;
      const heading = player.querySelector('h2');
      if (heading && heading.textContent?.toLowerCase().includes('workout complete')) {
        this.workoutCompletionTracked = true;
        trackEvent('workout_completed', {
          pattern: window.currentWorkoutData?.trainingPattern || 'standard',
          exerciseCount: Array.isArray(window.workoutState?.sequence)
            ? window.workoutState.sequence.length
            : Array.isArray(window.currentWorkoutData?.sequence)
              ? window.currentWorkoutData.sequence.length
              : 0,
        });
      }
    };
    const observer = new MutationObserver(checkCompletion);
    observer.observe(player, { childList: true, subtree: true });
    player.__fitflowObserverAttached = true;
  }

  setupFeedbackListeners() {
    const feedbackForm = document.getElementById('feedback-form');
    if (!feedbackForm || feedbackForm.dataset.bound === 'true') return;

    const statusEl = document.getElementById('feedback-status');
    const messageEl = document.getElementById('feedback-message');
    const feedbackKey = 'fitflow_feedback_entries';

    const readEntries = () => {
      try {
        const raw = localStorage.getItem(feedbackKey);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        debugLog('Failed to read feedback entries:', error);
        return [];
      }
    };

    const writeEntries = (entries) => {
      try {
        localStorage.setItem(feedbackKey, JSON.stringify(entries));
      } catch (error) {
        debugLog('Failed to write feedback entries:', error);
      }
    };

    const setStatus = (message, tone = 'neutral') => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = 'text-sm';
      if (tone === 'success') {
        statusEl.classList.add('text-green-700');
      } else if (tone === 'error') {
        statusEl.classList.add('text-red-600');
      } else {
        statusEl.classList.add('text-fit-secondary');
      }
    };

    feedbackForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const ratingInput = feedbackForm.querySelector('input[name="feedback-rating"]:checked');
      if (!ratingInput) {
        setStatus('Please select a rating before sending feedback.', 'error');
        return;
      }

      const rating = Number(ratingInput.value);
      const message = messageEl?.value?.trim() || '';
      const entry = {
        id: `feedback_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
        rating,
        message,
        timestamp: new Date().toISOString(),
        context: {
          pattern: window.currentWorkoutData?.trainingPattern || null,
          duration: window.currentWorkoutData?.duration || null,
        },
      };

      const entries = readEntries();
      entries.push(entry);
      writeEntries(entries);

      trackEvent('feedback_submitted', {
        rating,
        hasMessage: message.length > 0,
        messageLength: message.length,
        pattern: entry.context.pattern,
        duration: entry.context.duration,
      });

      feedbackForm.reset();
      setStatus('Thanks for the feedback. It stays on this device.', 'success');
    });

    feedbackForm.dataset.bound = 'true';
  }

  setupHomeScreenFunnel() {
    const initialize = () => {
      this.applyMobileFormDefaults();
      this.initializeWhatsNewBanner();
      this.syncMobileGenerateCta();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initialize();
    } else {
      document.addEventListener('DOMContentLoaded', initialize, { once: true });
    }
  }

  setupFunnelEventListeners() {
    this.setupQuickStartJumpLink();
    this.setupBasicSettingsJumpLink();
    this.setupWhatsNewControls();
    this.setupResponsiveFunnelRefresh();
  }

  isMobileViewport() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  setCollapsibleState(panelId, isExpanded) {
    const trigger = document.querySelector(`[data-collapsible-trigger][aria-controls="${panelId}"]`);
    const panel = document.getElementById(panelId);

    if (!trigger || !panel) return;

    trigger.setAttribute('aria-expanded', String(isExpanded));
    panel.hidden = !isExpanded;

    const icon = trigger.querySelector('[data-collapsible-icon]');
    if (icon) {
      icon.classList.toggle('rotate-180', !isExpanded);
    }
  }

  applyMobileFormDefaults() {
    if (this.isMobileViewport()) {
      this.setCollapsibleState('basic-settings-panel', true);
      this.setCollapsibleState('equipment-settings-panel', false);
      this.setCollapsibleState('advanced-settings-panel', false);
      return;
    }

    this.setCollapsibleState('basic-settings-panel', true);
    this.setCollapsibleState('equipment-settings-panel', true);
    this.setCollapsibleState('advanced-settings-panel', false);
  }

  initializeWhatsNewBanner() {
    const banner = document.getElementById('whats-new-banner');
    if (!banner) return;

    if (!this.isMobileViewport()) {
      banner.classList.remove('hidden');
      this.toggleWhatsNewContent(true);
      return;
    }

    const isDismissed = this.readStorageFlag(this.storageKeys.whatsNewDismissed);
    const hasSeenBanner = this.readStorageFlag(this.storageKeys.whatsNewSeen);

    if (isDismissed) {
      banner.classList.add('hidden');
      return;
    }

    banner.classList.remove('hidden');
    this.toggleWhatsNewContent(!hasSeenBanner);
    this.writeStorageFlag(this.storageKeys.whatsNewSeen, true);
  }

  setupWhatsNewControls() {
    const dismissButton = document.getElementById('whats-new-dismiss');
    if (dismissButton && dismissButton.dataset.bound !== 'true') {
      dismissButton.addEventListener('click', () => {
        const banner = document.getElementById('whats-new-banner');
        if (banner) {
          banner.classList.add('hidden');
        }
        this.writeStorageFlag(this.storageKeys.whatsNewSeen, true);
        this.writeStorageFlag(this.storageKeys.whatsNewDismissed, true);
      });
      dismissButton.dataset.bound = 'true';
    }

    const toggleButton = document.getElementById('whats-new-toggle');
    if (toggleButton && toggleButton.dataset.bound !== 'true') {
      toggleButton.addEventListener('click', () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        this.toggleWhatsNewContent(!isExpanded);
      });
      toggleButton.dataset.bound = 'true';
    }
  }

  toggleWhatsNewContent(isExpanded) {
    const content = document.getElementById('whats-new-content');
    const footer = document.getElementById('whats-new-footer');
    const toggleButton = document.getElementById('whats-new-toggle');
    const toggleIcon = toggleButton?.querySelector('[data-whats-new-toggle-icon]');
    const toggleLabel = toggleButton?.querySelector('span');

    if (content) {
      content.classList.toggle('hidden', !isExpanded);
    }
    if (footer) {
      footer.classList.toggle('hidden', !isExpanded);
    }
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', String(isExpanded));
    }
    if (toggleLabel) {
      toggleLabel.textContent = isExpanded ? 'Hide updates' : 'Show updates';
    }
    if (toggleIcon) {
      toggleIcon.classList.toggle('rotate-180', isExpanded);
    }
  }

  setupQuickStartJumpLink() {
    const jumpLink = document.querySelector('a[href="#generate-btn"]');
    if (!jumpLink || jumpLink.dataset.bound === 'true') return;

    jumpLink.addEventListener('click', (event) => {
      event.preventDefault();
      const generateButton = document.getElementById('generate-btn');
      if (!(generateButton instanceof HTMLElement)) return;

      generateButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => generateButton.focus({ preventScroll: true }), 250);
    });

    jumpLink.dataset.bound = 'true';
  }

  setupBasicSettingsJumpLink() {
    const basicsLink = document.querySelector('a[href="#basic-settings-panel"]');
    if (!basicsLink || basicsLink.dataset.bound === 'true') return;

    basicsLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.setCollapsibleState('basic-settings-panel', true);
      const basicPanel = document.getElementById('basic-settings-panel');
      if (!(basicPanel instanceof HTMLElement)) return;

      basicPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => basicPanel.focus({ preventScroll: true }), 250);
    });

    basicsLink.dataset.bound = 'true';
  }

  syncMobileGenerateCta() {
    const mobileCtaLabel = document.querySelector('[data-mobile-generate-label]');
    if (!mobileCtaLabel) return;

    if (this.isMobileViewport()) {
      mobileCtaLabel.textContent = 'Generate With Current Settings';
    } else {
      mobileCtaLabel.textContent = 'Generate Workout';
    }
  }

  setupResponsiveFunnelRefresh() {
    if (this.mobileViewportQuery) return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const onViewportChange = () => {
      this.applyMobileFormDefaults();
      this.initializeWhatsNewBanner();
      this.syncMobileGenerateCta();
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onViewportChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(onViewportChange);
    }

    this.mobileViewportQuery = mediaQuery;
    this.handleViewportChange = onViewportChange;
  }

  readStorageFlag(key) {
    try {
      return window.localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  }

  writeStorageFlag(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }

  /**
   * Setup training pattern event listeners
   */
  setupTrainingPatternListeners() {
    const patternInputs = document.querySelectorAll('input[name="training-pattern"]');

    patternInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        const pattern = e.target.value;
        this.showPatternSettings(pattern);
        debugLog('🔄 Training pattern changed to:', pattern);
        trackModeSelected('generator', pattern, { source: 'training_pattern_change' });
      });
    });

    debugLog('🔄 Training pattern listeners attached');
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
    switch (pattern) {
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
    debugLog('🔧 Setting up user account event listeners...');
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
      debugLog('✅ Attaching close button listener to login modal');
      closeLoginModal.addEventListener('click', () => this.hideModal('login-modal'));
    } else {
      debugLog('⚠️ Login modal close button not found');
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
      debugLog('✅ Attaching register button listener');
      switchToRegister.addEventListener('click', () => {
        this.hideModal('login-modal');
        this.showRegisterModal();
      });
    } else {
      debugLog('⚠️ Switch to register button not found');
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
      closePasswordResetModal.addEventListener('click', () =>
        this.hideModal('password-reset-modal')
      );
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
      debugLog('🔐 Show login modal');
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
      debugLog('📝 Show register modal');
    }
  }

  /**
   * Show profile modal
   */
  showProfileModal() {
    // This will be implemented when we extract the UI modules
    debugLog('👤 Show profile modal');
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
      debugLog('🔑 Show password reset modal');
    }
  }

  /**
   * Handle user logout
   */
  handleLogout() {
    userAccount.logout();
    this.updateUserInterface();
    debugLog('👋 User logged out');
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

    const result = await userAccount.resetPassword(
      username,
      securityQuestion,
      securityAnswer,
      newPassword
    );

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
        errorDiv.textContent =
          'Please select a security question and provide an answer for password reset.';
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
        securityAnswer: securityAnswer,
      };

      const result = await userAccount.register(username, password, profile);

      if (result.success) {
        this.hideModal('register-modal');
        // Small delay to ensure modal is closed before updating UI
        setTimeout(() => {
          this.updateUserInterface();
        }, 100);
        debugLog('✅ Account created successfully!');
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
        debugLog('✅ Login successful!');
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
    avatarOptions.forEach((option) => {
      option.addEventListener('change', (e) => {
        // Update visual selection
        avatarOptions.forEach((opt) => {
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

  // setupWorkoutPlayerListeners() is now called directly when workout player is rendered

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

  /**
   * Setup dashboard functionality
   */
  setupDashboard() {
    // Load personal analytics data
    this.loadPersonalAnalytics();
  }

  /**
   * Setup dashboard event listeners
   */
  setupDashboardListeners() {
    // Add event listener for Analytics button
    const analyticsBtn = document.querySelector('a[href="dashboard.html"]');
    if (analyticsBtn) {
      analyticsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showDashboard();
      });
    }

    // Add event listener for close dashboard button
    const closeDashboardBtn = document.getElementById('close-dashboard');
    if (closeDashboardBtn) {
      closeDashboardBtn.addEventListener('click', () => {
        this.hideDashboard();
      });
    }
  }

  /**
   * Show dashboard section
   */
  showDashboard() {
    const dashboardSection = document.getElementById('dashboard-section');
    const workoutPlan = document.getElementById('workout-plan');

    if (dashboardSection && workoutPlan) {
      workoutPlan.classList.add('hidden');
      dashboardSection.classList.remove('hidden');
      this.loadPersonalAnalytics();
    }
  }

  /**
   * Hide dashboard section
   */
  hideDashboard() {
    const dashboardSection = document.getElementById('dashboard-section');
    const workoutPlan = document.getElementById('workout-plan');

    if (dashboardSection && workoutPlan) {
      dashboardSection.classList.add('hidden');
      workoutPlan.classList.remove('hidden');
    }
  }

  /**
   * Load personal analytics data
   */
  loadPersonalAnalytics() {
    try {
      // Load personal workout data from localStorage
      const personalWorkouts = localStorage.getItem('fitflow_personal_workouts');
      let workouts = [];

      if (personalWorkouts) {
        workouts = JSON.parse(personalWorkouts);
      }

      // Calculate metrics
      const totalWorkouts = workouts.length;
      const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
      const streak = this.calculateStreak(workouts);

      // Update display
      document.getElementById('personal-total-workouts').textContent = totalWorkouts;
      document.getElementById('personal-total-duration').textContent =
        this.formatDuration(totalDuration);
      document.getElementById('personal-avg-duration').textContent = `${avgDuration}m`;
      document.getElementById('personal-streak').textContent = streak;

      // Update workouts table
      this.updatePersonalWorkoutsTable(workouts);
    } catch (error) {
      debugLog('Failed to load personal analytics:', error);
    }
  }

  /**
   * Calculate workout streak
   */
  calculateStreak(workouts) {
    if (workouts.length === 0) return 0;

    // Sort workouts by date (most recent first)
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].date);
      workoutDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff === streak + 1) {
        // Check if there's a workout on the next day
        continue;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Format duration in hours and minutes
   */
  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  /**
   * Update personal workouts table
   */
  updatePersonalWorkoutsTable(workouts) {
    const tableBody = document.getElementById('personal-workouts-table');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Show last 10 personal workouts
    const recentWorkouts = workouts.slice(0, 10);

    recentWorkouts.forEach((workout) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    ${this.formatPersonalDate(workout.date)}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    ${workout.duration || 0}m
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    ${workout.exerciseCount || 'N/A'}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    ${Array.isArray(workout.equipment) ? workout.equipment.join(', ') : workout.equipment || 'N/A'}
                </td>
            `;
      tableBody.appendChild(row);
    });
  }

  /**
   * Format personal date for display
   */
  formatPersonalDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

// Initialize the application when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    debugLog('📄 DOM Content Loaded - Initializing FitFlow App...');
    window.fitFlowApp = new FitFlowApp();
  });
} else {
  // DOM is already loaded
  debugLog('📄 DOM Already Loaded - Initializing FitFlow App...');
  window.fitFlowApp = new FitFlowApp();
}

// Export for module usage
export default FitFlowApp;
