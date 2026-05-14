// FitFlow Analytics Dashboard
class AnalyticsDashboard {
  constructor() {
    this.charts = {};
    this.hotfixCandidates = [];
    this.analyticsData = {
      users: [],
      workouts: [],
      sessions: [],
      activity: [],
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadAnalyticsData();
    this.updateLastUpdated();
  }

  setupEventListeners() {
    document.getElementById('refresh-btn').addEventListener('click', () => {
      this.refreshData();
    });

    const exportBtn = document.getElementById('export-hotfix-issues-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.generateHotfixIssueTemplates();
      });
    }

    const copyBtn = document.getElementById('copy-hotfix-issues-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyHotfixIssueTemplates();
      });
    }
  }

  async loadAnalyticsData() {
    try {
      // Load real analytics data from localStorage
      this.loadRealAnalyticsData();

      // Generate sample data only if no real data exists
      if (this.analyticsData.users.length === 0) {
        this.generateSampleData();
      }

      // Update dashboard
      this.updateDashboard();
      this.createCharts();
      this.showStatusMessage('', 'info');
    } catch (error) {
      console.error('Error loading analytics data:', error);
      this.showStatusMessage(
        'Failed to load analytics data. Showing fallback sample data.',
        'warning'
      );
      this.generateSampleData();
      this.updateDashboard();
      this.createCharts();
    }
  }

  loadRealAnalyticsData() {
    // Load real analytics data from localStorage
    const storedData = this.safeParseStorage('fitflow_analytics');
    if (storedData && typeof storedData === 'object') {
      this.analyticsData = {
        users: Array.isArray(storedData.users) ? storedData.users : [],
        workouts: Array.isArray(storedData.workouts) ? storedData.workouts : [],
        sessions: Array.isArray(storedData.sessions) ? storedData.sessions : [],
        activity: Array.isArray(storedData.activity) ? storedData.activity : [],
      };
    }

    // Also load events data
    const eventsData = this.safeParseStorage('fitflow_analytics_events');
    if (Array.isArray(eventsData)) {
      const events = eventsData.map((event) => this.normalizeEventRecord(event));
      events.sort(
        (a, b) => this.parseEventTimestamp(b.timestamp) - this.parseEventTimestamp(a.timestamp)
      );
      this.analyticsData.activity = events;

      // Process events to create users, workouts, and sessions
      this.processRealAnalyticsData(events);
    }

    // Load personal workout data
    this.loadPersonalWorkoutData();
  }

  loadPersonalWorkoutData() {
    // Load personal workout history from localStorage
    const personalWorkouts = this.safeParseStorage('fitflow_personal_workouts');
    if (Array.isArray(personalWorkouts)) {
      const workouts = personalWorkouts;

      // Add personal workouts to the analytics data
      workouts.forEach((workout) => {
        this.analyticsData.workouts.push({
          id: `personal_${workout.id}`,
          userId: 'current_user',
          pattern: workout.type || 'Standard',
          duration: workout.duration || 30,
          equipment: workout.equipment || ['Bodyweight'],
          fitnessLevel: 'Personal',
          timestamp: new Date(workout.date),
          completed: true,
          personal: true,
        });
      });
    }
  }

  safeParseStorage(key) {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return null;

    try {
      return JSON.parse(rawValue);
    } catch (error) {
      console.warn(`Invalid JSON in localStorage for key: ${key}`, error);
      return null;
    }
  }

  showStatusMessage(message, type = 'info') {
    const existing = document.getElementById('dashboard-status-banner');
    if (existing) existing.remove();
    if (!message) return;

    const palette =
      type === 'warning'
        ? 'bg-amber-100 border-amber-300 text-amber-800'
        : 'bg-blue-100 border-blue-300 text-blue-800';

    const banner = document.createElement('div');
    banner.id = 'dashboard-status-banner';
    banner.className = `${palette} border rounded-lg px-4 py-3 text-sm mb-4`;
    banner.textContent = message;

    const main = document.querySelector('main');
    if (main) main.prepend(banner);
  }

  normalizeEventNameFromAction(action) {
    const map = {
      'Workout Generated': 'workout_generated',
      'Workout Started': 'workout_started',
      'Workout Completed': 'workout_completed',
      'Session Ended': 'session_completed',
      'Page Visited': 'page_visited',
      'Equipment Changed': 'equipment_changed',
      'Training Pattern Changed': 'mode_selected',
    };
    return (
      map[action] ||
      String(action || '')
        .toLowerCase()
        .replace(/\s+/g, '_')
    );
  }

  normalizeEventRecord(event) {
    if (!event || typeof event !== 'object') {
      return {
        id: `invalid_${Date.now()}`,
        event: 'unknown',
        action: 'Unknown',
        details: {},
        timestamp: new Date().toISOString(),
        userId: 'unknown',
      };
    }

    const eventName = event.event || this.normalizeEventNameFromAction(event.action);
    const details =
      event.details && typeof event.details === 'object' ? event.details : { text: event.details };

    return {
      ...event,
      event: eventName,
      action: event.action || this.titleizeEventName(eventName),
      details,
      timestamp: event.timestamp || new Date().toISOString(),
      userId: event.userId || 'anonymous',
    };
  }

  titleizeEventName(eventName) {
    return String(eventName || '')
      .split('_')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  parseEventTimestamp(timestamp) {
    const value = new Date(timestamp).getTime();
    return Number.isFinite(value) ? value : Date.now();
  }

  processRealAnalyticsData(events) {
    // Extract unique users from events
    const userIds = [...new Set(events.map((e) => e.userId))];
    this.analyticsData.users = userIds.map((userId) => {
      const userEvents = events.filter((e) => e.userId === userId);
      const workoutEvents = userEvents.filter((event) => this.isWorkoutGeneratedEvent(event));

      return {
        id: userId,
        type: this.determineUserType(workoutEvents.length),
        preferredEquipment: this.getPreferredEquipment(userEvents),
        joinDate: this.getEarliestTimestamp(userEvents),
        totalWorkouts: workoutEvents.length,
      };
    });

    // Process workout events
    this.analyticsData.workouts = events
      .filter((event) => this.isWorkoutGeneratedEvent(event))
      .map((event) => ({
        id: event.id,
        userId: event.userId,
        pattern: event.details.pattern || event.details.mode || 'Standard',
        duration: event.details.duration || event.details.sessionDurationSeconds || 30,
        equipment: event.details.equipment || ['Bodyweight'],
        fitnessLevel: event.details.fitnessLevel || event.details.level || 'Unknown',
        timestamp: event.timestamp,
        completed: events.some(
          (e) =>
            this.isWorkoutCompletedEvent(e) &&
            (e.sessionId === event.sessionId || e.details.pattern === event.details.pattern) &&
            this.parseEventTimestamp(e.timestamp) >= this.parseEventTimestamp(event.timestamp)
        ),
      }));

    // Process session events
    this.analyticsData.sessions = events
      .filter((event) => this.isSessionCompletedEvent(event))
      .map((event) => ({
        id: event.id,
        userId: event.userId,
        startTime: new Date(
          this.parseEventTimestamp(event.timestamp) -
            (event.details.sessionDurationSeconds || 0) * 1000
        ).toISOString(),
        duration: Math.round((event.details.sessionDurationSeconds || 0) / 60),
        pagesVisited: events.filter((e) => e.event === 'page_visited').length,
        workoutGenerated: events.some((e) => this.isWorkoutGeneratedEvent(e)),
      }));
  }

  isWorkoutGeneratedEvent(event) {
    if (!event) return false;
    if (event.event === 'workout_generated') return true;
    return event.event === 'step_completed' && event.details?.stepName === 'workout_generated';
  }

  isWorkoutCompletedEvent(event) {
    if (!event) return false;
    if (event.event === 'workout_completed') return true;
    return event.event === 'step_completed' && event.details?.stepName === 'workout_completed';
  }

  isSessionCompletedEvent(event) {
    return event?.event === 'session_completed';
  }

  determineUserType(workoutCount) {
    if (workoutCount === 0) return 'Beginner';
    if (workoutCount < 10) return 'Beginner';
    if (workoutCount < 30) return 'Intermediate';
    return 'Advanced';
  }

  getPreferredEquipment(userEvents) {
    const equipmentEvents = userEvents.filter(
      (e) => e.event === 'equipment_changed' || this.isWorkoutGeneratedEvent(e)
    );

    const equipmentCounts = {};
    equipmentEvents.forEach((event) => {
      const equipment = event.details.equipment || event.details.to;
      if (Array.isArray(equipment)) {
        equipment.forEach((eq) => {
          equipmentCounts[eq] = (equipmentCounts[eq] || 0) + 1;
        });
      } else if (equipment) {
        equipmentCounts[equipment] = (equipmentCounts[equipment] || 0) + 1;
      }
    });

    const mostUsed = Object.keys(equipmentCounts).reduce(
      (a, b) => (equipmentCounts[a] > equipmentCounts[b] ? a : b),
      'Bodyweight'
    );

    return mostUsed;
  }

  getEarliestTimestamp(userEvents) {
    if (userEvents.length === 0) return new Date().toISOString();

    const firstEvent = userEvents.reduce((earliest, current) =>
      new Date(current.timestamp) < new Date(earliest.timestamp) ? current : earliest
    );

    return firstEvent.timestamp;
  }

  generateSampleData() {
    // Generate realistic sample data for demonstration
    if (this.analyticsData.users.length === 0) {
      this.generateSampleUsers();
    }
    if (this.analyticsData.workouts.length === 0) {
      this.generateSampleWorkouts();
    }
    if (this.analyticsData.sessions.length === 0) {
      this.generateSampleSessions();
    }
    if (this.analyticsData.activity.length === 0) {
      this.generateSampleActivity();
    }
  }

  generateSampleUsers() {
    const userTypes = ['Beginner', 'Intermediate', 'Advanced'];
    const equipment = [
      'Dumbbells',
      'Resistance Bands',
      'Bodyweight',
      'Kettlebells',
      'Rower',
      'Jump Rope',
    ];

    for (let i = 0; i < 150; i++) {
      const user = {
        id: `user_${i + 1}`,
        type: userTypes[Math.floor(Math.random() * userTypes.length)],
        preferredEquipment: equipment[Math.floor(Math.random() * equipment.length)],
        joinDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        totalWorkouts: Math.floor(Math.random() * 50) + 1,
      };
      this.analyticsData.users.push(user);
    }
  }

  generateSampleWorkouts() {
    const patterns = ['Standard', 'Circuit', 'Tabata', 'Pyramid'];
    const durations = [15, 30, 45, 60];
    const equipment = [
      'Dumbbells',
      'Resistance Bands',
      'Bodyweight',
      'Kettlebells',
      'Rower',
      'Jump Rope',
    ];

    for (let i = 0; i < 500; i++) {
      const workout = {
        id: `workout_${i + 1}`,
        userId: `user_${Math.floor(Math.random() * 150) + 1}`,
        pattern: patterns[Math.floor(Math.random() * patterns.length)],
        duration: durations[Math.floor(Math.random() * durations.length)],
        equipment: equipment[Math.floor(Math.random() * equipment.length)],
        fitnessLevel: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        completed: Math.random() > 0.2, // 80% completion rate
      };
      this.analyticsData.workouts.push(workout);
    }
  }

  generateSampleSessions() {
    for (let i = 0; i < 200; i++) {
      const session = {
        id: `session_${i + 1}`,
        userId: `user_${Math.floor(Math.random() * 150) + 1}`,
        startTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        duration: Math.floor(Math.random() * 45) + 5, // 5-50 minutes
        pagesVisited: Math.floor(Math.random() * 8) + 2,
        workoutGenerated: Math.random() > 0.3,
      };
      this.analyticsData.sessions.push(session);
    }
  }

  generateSampleActivity() {
    const actions = [
      'Workout Generated',
      'Workout Started',
      'Workout Completed',
      'Page Visited',
      'Equipment Changed',
    ];

    for (let i = 0; i < 100; i++) {
      const activity = {
        id: `activity_${i + 1}`,
        userId: `user_${Math.floor(Math.random() * 150) + 1}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        details: this.generateActivityDetails(actions[Math.floor(Math.random() * actions.length)]),
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      };
      this.analyticsData.activity.push(activity);
    }

    // Sort by timestamp (most recent first)
    this.analyticsData.activity.sort((a, b) => b.timestamp - a.timestamp);
  }

  generateActivityDetails(action) {
    switch (action) {
      case 'Workout Generated':
        return `Generated ${['Circuit', 'Tabata', 'Pyramid', 'Standard'][Math.floor(Math.random() * 4)]} workout`;
      case 'Workout Started':
        return 'Started workout session';
      case 'Workout Completed':
        return 'Completed workout successfully';
      case 'Page Visited':
        return 'Visited workout overview';
      case 'Equipment Changed':
        return `Changed to ${['Dumbbells', 'Resistance Bands', 'Bodyweight'][Math.floor(Math.random() * 3)]}`;
      default:
        return 'User interaction';
    }
  }

  updateDashboard() {
    // Update key metrics
    this.updateKeyMetrics();

    // Update insights
    this.updateInsights();

    // Update funnel metrics
    this.updateFunnelMetrics();

    // Update auto-generated hotfix priorities
    this.updateHotfixPriorities();

    // Update personal analytics
    this.updatePersonalAnalytics();

    // Update activity table
    this.updateActivityTable();

    // Save data to localStorage
    localStorage.setItem('fitflow_analytics', JSON.stringify(this.analyticsData));
  }

  updateKeyMetrics() {
    const totalUsers = this.analyticsData.users.length;
    const totalWorkouts = this.analyticsData.workouts.length;
    const avgSessionTime = this.calculateAverageSessionTime();
    const completionRate = this.calculateCompletionRate();

    document.getElementById('total-users').textContent = totalUsers.toLocaleString();
    document.getElementById('total-workouts').textContent = totalWorkouts.toLocaleString();
    document.getElementById('avg-session-time').textContent = `${avgSessionTime} min`;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
  }

  calculateAverageSessionTime() {
    if (this.analyticsData.sessions.length === 0) return 0;
    const totalTime = this.analyticsData.sessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    return Math.round(totalTime / this.analyticsData.sessions.length);
  }

  calculateCompletionRate() {
    if (this.analyticsData.workouts.length === 0) return 0;
    const completed = this.analyticsData.workouts.filter((w) => w.completed).length;
    return Math.round((completed / this.analyticsData.workouts.length) * 100);
  }

  updateInsights() {
    const mostPopularEquipment = this.getMostPopular('equipment');
    const mostUsedMode = this.getMostUsedMode();
    const topDropOffStep = this.getTopDropOffStep();
    const retention = this.getRetentionRates();

    const equipmentEl = document.getElementById('most-popular-equipment');
    if (equipmentEl) equipmentEl.textContent = mostPopularEquipment;

    const modeEl = document.getElementById('most-used-mode');
    if (modeEl) modeEl.textContent = mostUsedMode;

    const dropOffEl = document.getElementById('drop-off-step');
    if (dropOffEl) dropOffEl.textContent = topDropOffStep;

    const d1El = document.getElementById('d1-retention');
    if (d1El) d1El.textContent = `${retention.d1}%`;

    const d7El = document.getElementById('d7-retention');
    if (d7El) d7El.textContent = `${retention.d7}%`;
  }

  updateFunnelMetrics() {
    const container = this.ensureFunnelSection();
    if (!container) return;

    const funnel = this.getFunnelMetrics();
    const steps = funnel.steps;

    steps.forEach((step) => {
      const countEl = document.getElementById(step.countId);
      if (countEl) countEl.textContent = step.count.toLocaleString();

      const rateEl = document.getElementById(step.rateId);
      if (rateEl) rateEl.textContent = step.rateLabel;
    });
  }

  ensureFunnelSection() {
    const existing = document.getElementById('funnel-metrics-section');
    if (existing) return existing;

    const main = document.querySelector('main');
    if (!main) return null;

    const section = document.createElement('section');
    section.id = 'funnel-metrics-section';
    section.className = 'bg-white rounded-2xl shadow-lg p-6 mb-6';
    section.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold text-fit-dark">Mobile Funnel Snapshot</h2>
            <p class="text-sm text-fit-secondary">Counts are based on local session events only.</p>
          </div>
          <span class="text-xs font-semibold bg-fit-primary/10 text-fit-primary px-3 py-1 rounded-full">Local</span>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="rounded-xl border border-gray-200 p-4">
            <p class="text-xs text-fit-secondary mb-1">App Open</p>
            <p id="funnel-app-open" class="text-2xl font-bold text-fit-dark">0</p>
            <p id="funnel-app-open-rate" class="text-xs text-fit-secondary mt-2">Baseline</p>
          </div>
          <div class="rounded-xl border border-gray-200 p-4">
            <p class="text-xs text-fit-secondary mb-1">Workout Generated</p>
            <p id="funnel-workout-generated" class="text-2xl font-bold text-fit-dark">0</p>
            <p id="funnel-workout-generated-rate" class="text-xs text-fit-secondary mt-2">0% from open</p>
          </div>
          <div class="rounded-xl border border-gray-200 p-4">
            <p class="text-xs text-fit-secondary mb-1">Workout Started</p>
            <p id="funnel-workout-started" class="text-2xl font-bold text-fit-dark">0</p>
            <p id="funnel-workout-started-rate" class="text-xs text-fit-secondary mt-2">0% from generated</p>
          </div>
          <div class="rounded-xl border border-gray-200 p-4">
            <p class="text-xs text-fit-secondary mb-1">Workout Completed</p>
            <p id="funnel-workout-completed" class="text-2xl font-bold text-fit-dark">0</p>
            <p id="funnel-workout-completed-rate" class="text-xs text-fit-secondary mt-2">0% from started</p>
          </div>
          <div class="rounded-xl border border-gray-200 p-4">
            <p class="text-xs text-fit-secondary mb-1">Feedback Submitted</p>
            <p id="funnel-feedback-submitted" class="text-2xl font-bold text-fit-dark">0</p>
            <p id="funnel-feedback-submitted-rate" class="text-xs text-fit-secondary mt-2">0% from completed</p>
          </div>
        </div>
      `;

    main.prepend(section);
    return section;
  }

  getFunnelMetrics() {
    const events = Array.isArray(this.analyticsData.activity) ? this.analyticsData.activity : [];
    const countBy = (names, stepName = null, fallbackNames = []) => {
      const explicitCount = events.filter((event) => names.includes(event.event)).length;
      if (explicitCount > 0) {
        return explicitCount;
      }

      const stepCount = stepName
        ? events.filter(
            (event) => event.event === 'step_completed' && event.details?.stepName === stepName
          ).length
        : 0;
      if (stepCount > 0) {
        return stepCount;
      }

      if (fallbackNames.length > 0) {
        return events.filter((event) => fallbackNames.includes(event.event)).length;
      }

      return 0;
    };

    const appOpen = countBy(['app_open'], null, ['session_started']);
    const workoutGenerated = countBy(['workout_generated'], 'workout_generated');
    const workoutStarted = countBy(['workout_started'], 'workout_started');
    const workoutCompleted = countBy(['workout_completed'], 'workout_completed');
    const feedbackSubmitted = countBy(['feedback_submitted']);

    const rate = (current, previous) =>
      previous > 0 ? `${Math.round((current / previous) * 100)}%` : '0%';

    return {
      steps: [
        {
          countId: 'funnel-app-open',
          rateId: 'funnel-app-open-rate',
          count: appOpen,
          rateLabel: 'Baseline',
        },
        {
          countId: 'funnel-workout-generated',
          rateId: 'funnel-workout-generated-rate',
          count: workoutGenerated,
          rateLabel: `${rate(workoutGenerated, appOpen)} from open`,
        },
        {
          countId: 'funnel-workout-started',
          rateId: 'funnel-workout-started-rate',
          count: workoutStarted,
          rateLabel: `${rate(workoutStarted, workoutGenerated)} from generated`,
        },
        {
          countId: 'funnel-workout-completed',
          rateId: 'funnel-workout-completed-rate',
          count: workoutCompleted,
          rateLabel: `${rate(workoutCompleted, workoutStarted)} from started`,
        },
        {
          countId: 'funnel-feedback-submitted',
          rateId: 'funnel-feedback-submitted-rate',
          count: feedbackSubmitted,
          rateLabel: `${rate(feedbackSubmitted, workoutCompleted)} from completed`,
        },
      ],
    };
  }

  getMostPopular(field) {
    const counts = {};
    this.analyticsData.workouts.forEach((workout) => {
      const value = workout[field];
      if (value == null) return;
      const normalized = Array.isArray(value) ? value.join(', ') : value;
      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    const labels = Object.keys(counts);
    if (labels.length === 0) return '-';
    return labels.reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }

  getMostUsedMode() {
    const modeEvents = this.analyticsData.activity.filter(
      (event) => event.event === 'mode_selected'
    );
    const counts = {};
    modeEvents.forEach((event) => {
      const modeType = event.details?.modeType || 'unknown';
      const mode = event.details?.mode || 'unknown';
      const key = `${modeType}:${mode}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const labels = Object.keys(counts);
    if (labels.length === 0) return '-';
    return labels.reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }

  getTopDropOffStep() {
    const abandoned = this.analyticsData.activity.filter(
      (event) => event.event === 'flow_abandoned'
    );
    if (abandoned.length === 0) return '-';

    const stepCounts = {};
    abandoned.forEach((event) => {
      const rawStep = Number.isFinite(event.stepIndex)
        ? event.stepIndex
        : Number.isFinite(event.details?.stepIndex)
          ? event.details.stepIndex
          : 0;
      const key = `Step ${rawStep}`;
      stepCounts[key] = (stepCounts[key] || 0) + 1;
    });

    return Object.keys(stepCounts).reduce((a, b) => (stepCounts[a] > stepCounts[b] ? a : b));
  }

  getRetentionRates() {
    const sessionStarts = this.analyticsData.activity.filter(
      (event) => event.event === 'session_started'
    );
    if (sessionStarts.length === 0) {
      return { d1: 0, d7: 0 };
    }

    const sessionsByUser = {};
    sessionStarts.forEach((event) => {
      const userId = event.userId || 'anonymous';
      if (!sessionsByUser[userId]) sessionsByUser[userId] = [];
      sessionsByUser[userId].push(this.parseEventTimestamp(event.timestamp));
    });

    const users = Object.values(sessionsByUser)
      .map((timestamps) => timestamps.sort((a, b) => a - b))
      .filter((timestamps) => timestamps.length > 0);

    if (users.length === 0) {
      return { d1: 0, d7: 0 };
    }

    let d1Users = 0;
    let d7Users = 0;

    users.forEach((timestamps) => {
      const first = timestamps[0];
      const hasD1 = timestamps.some((ts) => ts > first && ts <= first + 24 * 60 * 60 * 1000);
      const hasD7 = timestamps.some((ts) => ts > first && ts <= first + 7 * 24 * 60 * 60 * 1000);
      if (hasD1) d1Users += 1;
      if (hasD7) d7Users += 1;
    });

    return {
      d1: Math.round((d1Users / users.length) * 100),
      d7: Math.round((d7Users / users.length) * 100),
    };
  }

  getLatestModeBySession(modeType) {
    const modeEvents = this.analyticsData.activity.filter(
      (event) => event.event === 'mode_selected' && event.details?.modeType === modeType
    );
    const latestBySession = {};

    modeEvents.forEach((event) => {
      if (!event.sessionId) return;
      const current = latestBySession[event.sessionId];
      if (
        !current ||
        this.parseEventTimestamp(event.timestamp) > this.parseEventTimestamp(current.timestamp)
      ) {
        latestBySession[event.sessionId] = event;
      }
    });

    return latestBySession;
  }

  getSessionSet(eventName) {
    return new Set(
      this.analyticsData.activity
        .filter((event) => event.event === eventName && event.sessionId)
        .map((event) => event.sessionId)
    );
  }

  getAbandonmentByReason() {
    const counts = {};
    this.analyticsData.activity
      .filter((event) => event.event === 'flow_abandoned')
      .forEach((event) => {
        const reason = event.details?.reason || 'unknown';
        counts[reason] = (counts[reason] || 0) + 1;
      });
    return counts;
  }

  buildHotfixCandidates() {
    const priorities = [];
    const sessionsStarted = this.analyticsData.activity.filter(
      (event) => event.event === 'session_started'
    ).length;
    const sessionsCompleted = this.analyticsData.activity.filter(
      (event) => event.event === 'session_completed'
    ).length;
    const workoutStarted = this.analyticsData.activity.filter(
      (event) => event.event === 'step_completed' && event.details?.stepName === 'workout_started'
    ).length;
    const workoutCompleted = this.analyticsData.activity.filter(
      (event) => event.event === 'step_completed' && event.details?.stepName === 'workout_completed'
    ).length;
    const abandonedEvents = this.analyticsData.activity.filter(
      (event) => event.event === 'flow_abandoned'
    );
    const abandonByReason = this.getAbandonmentByReason();
    const retention = this.getRetentionRates();

    if (sessionsStarted >= 5) {
      const sessionCompletionRate = Math.round(
        (sessionsCompleted / Math.max(1, sessionsStarted)) * 100
      );
      if (sessionCompletionRate < 70) {
        priorities.push({
          score: 90 - sessionCompletionRate,
          severity: 'High',
          title: 'Improve end-to-end session completion',
          evidence: `${sessionCompletionRate}% sessions completed (${sessionsCompleted}/${sessionsStarted}).`,
          action:
            'Tighten the critical path from mode selection to first exercise start and reduce early exits.',
          criteria: 'Raise session completion to >= 75% over the next 30 sessions.',
        });
      }
    }

    if (workoutStarted >= 5) {
      const workoutCompletionRate = Math.round(
        (workoutCompleted / Math.max(1, workoutStarted)) * 100
      );
      if (workoutCompletionRate < 80) {
        priorities.push({
          score: 88 - workoutCompletionRate,
          severity: 'High',
          title: 'Reduce in-workout abandonment',
          evidence: `${workoutCompletionRate}% workouts completed after start (${workoutCompleted}/${workoutStarted}).`,
          action:
            'Adjust pacing, timer defaults, and transition UX to keep users through the final sets.',
          criteria: 'Raise workout completion-after-start to >= 85% in the next release window.',
        });
      }
    }

    if (abandonedEvents.length > 0) {
      const stepCounts = {};
      abandonedEvents.forEach((event) => {
        const step = Number.isFinite(event.stepIndex)
          ? event.stepIndex
          : Number.isFinite(event.details?.stepIndex)
            ? event.details.stepIndex
            : 0;
        stepCounts[step] = (stepCounts[step] || 0) + 1;
      });

      const topStep = Object.keys(stepCounts)
        .map((step) => ({ step: Number(step), count: stepCounts[step] }))
        .sort((a, b) => b.count - a.count)[0];

      if (topStep) {
        priorities.push({
          score: 70 + Math.min(20, topStep.count * 2),
          severity: topStep.count >= 5 ? 'High' : 'Medium',
          title: `Fix friction at Step ${topStep.step}`,
          evidence: `${topStep.count} abandonment events were captured at this step.`,
          action:
            'Instrument sub-step friction points and simplify the interaction before this step.',
          criteria: `Reduce Step ${topStep.step} abandonment by >= 30% over the next 2 weeks.`,
        });
      }
    }

    const exitWorkoutCount = abandonByReason.exit_workout || 0;
    if (exitWorkoutCount >= 3) {
      priorities.push({
        score: 78 + Math.min(15, exitWorkoutCount),
        severity: 'Medium',
        title: 'Mitigate manual exits during active workout',
        evidence: `${exitWorkoutCount} sessions ended with reason "exit_workout".`,
        action: 'Add a pause-confirm-exit flow with resume prompts and shorter rest guidance.',
        criteria: 'Cut "exit_workout" abandonment events by >= 25% in the next iteration.',
      });
    }

    const regenCount = abandonByReason.generate_new_workout || 0;
    if (regenCount >= 3) {
      priorities.push({
        score: 76 + Math.min(12, regenCount),
        severity: 'Medium',
        title: 'Improve first-pass workout relevance',
        evidence: `${regenCount} users abandoned flow by generating a new workout immediately.`,
        action: 'Improve generation diversity and expose quick filters before re-generation.',
        criteria:
          'Lower regeneration-driven abandonment by >= 20% and increase first-workout starts.',
      });
    }

    if (retention.d1 < 30 || retention.d7 < 15) {
      priorities.push({
        score: 85 - Math.min(retention.d1, retention.d7),
        severity: 'High',
        title: 'Improve short-term retention loop',
        evidence: `D1 retention: ${retention.d1}%, D7 retention: ${retention.d7}%.`,
        action:
          'Add post-session return cues: streak nudges, saved presets, and next-workout suggestions.',
        criteria: 'Reach D1 >= 35% and D7 >= 18% in the next 4-week cycle.',
      });
    }

    const generatorModesBySession = this.getLatestModeBySession('generator');
    const completedSessions = this.getSessionSet('session_completed');
    const modeStats = {};

    Object.values(generatorModesBySession).forEach((event) => {
      const mode = event.details?.mode || 'unknown';
      if (!modeStats[mode]) {
        modeStats[mode] = { total: 0, completed: 0 };
      }
      modeStats[mode].total += 1;
      if (completedSessions.has(event.sessionId)) {
        modeStats[mode].completed += 1;
      }
    });

    const modeRows = Object.entries(modeStats)
      .filter(([, row]) => row.total >= 3)
      .map(([mode, row]) => ({
        mode,
        total: row.total,
        completed: row.completed,
        completionRate: Math.round((row.completed / Math.max(1, row.total)) * 100),
      }))
      .sort((a, b) => a.completionRate - b.completionRate);

    if (modeRows.length > 0) {
      const weakest = modeRows[0];
      if (weakest.completionRate < 70) {
        priorities.push({
          score: 80 - weakest.completionRate + 8,
          severity: 'Medium',
          title: `Investigate ${weakest.mode} mode drop-off`,
          evidence: `${weakest.completionRate}% completion for ${weakest.mode} (${weakest.completed}/${weakest.total}).`,
          action: `Run a focused QA pass on ${weakest.mode} generation/timing flow and compare against best-performing mode.`,
          criteria: `Increase ${weakest.mode} completion rate to >= 75% with no regression in other modes.`,
        });
      }
    }

    return priorities.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  renderHotfixPriorityItem(item, index) {
    const severityClass =
      item.severity === 'High'
        ? 'bg-red-100 text-red-700'
        : item.severity === 'Medium'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-blue-100 text-blue-700';

    return `
            <li class="border border-gray-200 rounded-lg p-3">
                <div class="flex items-center justify-between gap-3 mb-2">
                    <div class="text-sm font-semibold text-fit-dark">${index + 1}. ${item.title}</div>
                    <span class="text-[11px] px-2 py-1 rounded-full ${severityClass}">
                        ${item.severity} · Score ${Math.round(item.score)}
                    </span>
                </div>
                <p class="text-xs text-fit-secondary mb-1"><strong>Evidence:</strong> ${item.evidence}</p>
                <p class="text-xs text-fit-secondary mb-1"><strong>Action:</strong> ${item.action}</p>
                <p class="text-xs text-fit-secondary"><strong>Acceptance:</strong> ${item.criteria}</p>
            </li>
        `;
  }

  updateHotfixPriorities() {
    const list = document.getElementById('hotfix-priority-list');
    const countBadge = document.getElementById('hotfix-item-count');
    if (!list || !countBadge) return;

    const candidates = this.buildHotfixCandidates();
    this.hotfixCandidates = candidates;
    countBadge.textContent = `${candidates.length} item${candidates.length === 1 ? '' : 's'}`;

    if (candidates.length === 0) {
      list.innerHTML = `
                <li class="border border-gray-200 rounded-lg p-3 text-xs text-fit-secondary">
                    No urgent hotfix signals detected yet. Keep collecting sessions to refine prioritization.
                </li>
            `;
      return;
    }

    list.innerHTML = candidates
      .map((item, index) => this.renderHotfixPriorityItem(item, index))
      .join('');
  }

  formatHotfixIssueTemplates(candidates) {
    const generatedAt = new Date().toISOString();
    const toSlug = (value) =>
      String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return candidates
      .map((item, index) => {
        const priority = index + 1;
        const slug = toSlug(item.title).slice(0, 50);
        const issueTitle = `[v2.2.1][P${priority}] ${item.title}`;
        const labels = [
          'hotfix',
          'v2.2.1',
          item.severity.toLowerCase() === 'high' ? 'priority:high' : 'priority:medium',
          `area:${slug || 'general'}`,
        ];

        return `## Issue ${priority}
Title: ${issueTitle}
Labels: ${labels.join(', ')}

### Summary
${item.action}

### Why this matters
${item.evidence}

### Acceptance Criteria
- ${item.criteria}

### Notes
- Generated from FitFlow analytics dashboard
- Severity: ${item.severity}
- Score: ${Math.round(item.score)}
- Generated at: ${generatedAt}
`;
      })
      .join('\n---\n\n');
  }

  setHotfixExportStatus(message, tone = 'neutral') {
    const statusEl = document.getElementById('hotfix-export-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = 'text-xs';
    if (tone === 'success') {
      statusEl.classList.add('text-green-700');
    } else if (tone === 'warning') {
      statusEl.classList.add('text-amber-700');
    } else {
      statusEl.classList.add('text-fit-secondary');
    }
  }

  generateHotfixIssueTemplates() {
    const wrap = document.getElementById('hotfix-issues-export-wrap');
    const textarea = document.getElementById('hotfix-issues-export');
    if (!wrap || !textarea) return;

    const candidates =
      this.hotfixCandidates.length > 0 ? this.hotfixCandidates : this.buildHotfixCandidates();

    if (candidates.length === 0) {
      wrap.classList.remove('hidden');
      textarea.value = 'Not enough hotfix signals yet. Collect a few sessions and try again.';
      this.setHotfixExportStatus('No priority items available yet.', 'warning');
      return;
    }

    textarea.value = this.formatHotfixIssueTemplates(candidates);
    wrap.classList.remove('hidden');
    this.setHotfixExportStatus(
      `Generated ${candidates.length} issue template${candidates.length === 1 ? '' : 's'}.`
    );
  }

  async copyHotfixIssueTemplates() {
    const textarea = document.getElementById('hotfix-issues-export');
    if (!textarea) return;

    if (!textarea.value.trim()) {
      this.setHotfixExportStatus('Generate templates first before copying.', 'warning');
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textarea.value);
      } else {
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
      }
      this.setHotfixExportStatus('Copied issue templates to clipboard.', 'success');
    } catch (error) {
      this.setHotfixExportStatus('Copy failed. Select text manually.', 'warning');
    }
  }

  updatePersonalAnalytics() {
    // Get personal workouts
    const personalWorkouts = this.analyticsData.workouts.filter((w) => w.personal);

    // Calculate personal metrics
    const totalWorkouts = personalWorkouts.length;
    const totalDuration = personalWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    const streak = this.calculatePersonalStreak(personalWorkouts);

    // Update personal metrics display
    document.getElementById('personal-total-workouts').textContent = totalWorkouts;
    document.getElementById('personal-total-duration').textContent =
      this.formatDuration(totalDuration);
    document.getElementById('personal-avg-duration').textContent = `${avgDuration}m`;
    document.getElementById('personal-streak').textContent = streak;

    // Update personal workouts table
    this.updatePersonalWorkoutsTable(personalWorkouts);
  }

  calculatePersonalStreak(workouts) {
    if (workouts.length === 0) return 0;

    // Sort workouts by date (most recent first)
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].timestamp);
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

  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  updatePersonalWorkoutsTable(workouts) {
    const tableBody = document.getElementById('personal-workouts-table');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    if (!Array.isArray(workouts) || workouts.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-3 py-4 text-xs text-fit-secondary text-center">
                        No personal workout history yet. Complete a workout to see analytics here.
                    </td>
                </tr>
            `;
      return;
    }

    // Show last 10 personal workouts
    const recentWorkouts = workouts.slice(0, 10);

    recentWorkouts.forEach((workout) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-secondary">
                    ${this.formatPersonalDate(workout.timestamp)}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-dark">
                    ${workout.duration}m
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-secondary">
                    ${workout.exerciseCount || 'N/A'}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-secondary">
                    ${Array.isArray(workout.equipment) ? workout.equipment.join(', ') : workout.equipment}
                </td>
            `;
      tableBody.appendChild(row);
    });
  }

  formatPersonalDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  updateActivityTable() {
    const tableBody = document.getElementById('activity-table');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!Array.isArray(this.analyticsData.activity) || this.analyticsData.activity.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-3 py-4 text-xs text-fit-secondary text-center">
                        No recent activity events found.
                    </td>
                </tr>
            `;
      return;
    }

    // Show last 8 activities to fit better on screen
    const recentActivity = this.analyticsData.activity.slice(0, 8);

    recentActivity.forEach((activity) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-secondary">
                    ${this.formatTimestamp(activity.timestamp)}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-dark">
                    ${activity.action || this.titleizeEventName(activity.event)}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-secondary">
                    ${this.formatActivityDetails(activity.details)}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-fit-secondary">
                    ${activity.userId || 'anonymous'}
                </td>
            `;
      tableBody.appendChild(row);
    });
  }

  formatActivityDetails(details) {
    if (details == null) return '-';
    if (typeof details === 'string') return details;
    if (typeof details !== 'object') return String(details);

    const summaryKeys = [
      'stepName',
      'modeType',
      'mode',
      'pattern',
      'reason',
      'duration',
      'sessionDurationSeconds',
    ];
    const parts = summaryKeys
      .filter((key) => details[key] != null)
      .map((key) => `${key}: ${details[key]}`);

    if (parts.length > 0) return parts.join(' | ');
    return JSON.stringify(details);
  }

  formatTimestamp(timestamp) {
    const now = new Date();
    const parsedTimestamp = new Date(timestamp);
    const diff = now - parsedTimestamp;
    if (!Number.isFinite(diff) || diff < 0) {
      return '-';
    }
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  createCharts() {
    this.createEquipmentChart();
    this.createPatternChart();
    this.createDurationChart();
    this.createFitnessChart();
  }

  createEquipmentChart() {
    const ctx = document.getElementById('equipment-chart').getContext('2d');
    const data = this.getChartData('equipment');

    this.charts.equipment = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 10,
              font: {
                size: 11,
              },
            },
          },
        },
      },
    });
  }

  createPatternChart() {
    const ctx = document.getElementById('pattern-chart').getContext('2d');
    const data = this.getChartData('pattern');

    this.charts.pattern = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Usage Count',
            data: data.values,
            backgroundColor: '#3B82F6',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: 10,
              },
            },
          },
        },
      },
    });
  }

  createDurationChart() {
    const ctx = document.getElementById('duration-chart').getContext('2d');
    const data = this.getChartData('duration');

    this.charts.duration = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels.map((d) => `${d} min`),
        datasets: [
          {
            label: 'Workouts Generated',
            data: data.values,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 10,
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: 10,
              },
            },
          },
        },
      },
    });
  }

  createFitnessChart() {
    const ctx = document.getElementById('fitness-chart').getContext('2d');
    const data = this.getChartData('fitnessLevel');

    this.charts.fitness = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 10,
              font: {
                size: 11,
              },
            },
          },
        },
      },
    });
  }

  getChartData(field) {
    const counts = {};
    this.analyticsData.workouts.forEach((workout) => {
      const value = workout[field];
      counts[value] = (counts[value] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),
      values: Object.values(counts),
    };
  }

  refreshData() {
    // Simulate data refresh
    this.generateSampleData();
    this.updateDashboard();

    // Update charts
    Object.values(this.charts).forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
    this.createCharts();

    this.updateLastUpdated();
  }

  updateLastUpdated() {
    const now = new Date();
    document.getElementById('last-updated').textContent = now.toLocaleString();
  }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
  new AnalyticsDashboard();
});
