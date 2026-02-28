/**
 * Lightweight analytics tracker for local instrumentation.
 * Stores events in localStorage so the dashboard can compute KPIs.
 */

const EVENTS_STORAGE_KEY = 'fitflow_analytics_events';
const ANON_USER_STORAGE_KEY = 'fitflow_anon_user_id';
const MAX_STORED_EVENTS = 2000;

let trackerState = {
  initialized: false,
  sessionId: null,
  sessionStartedAt: null,
  highestStepIndex: 0,
  sessionCompleted: false,
  abandonmentTracked: false,
};

function safeReadJson(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallbackValue;
    const parsed = JSON.parse(raw);
    return parsed ?? fallbackValue;
  } catch (error) {
    console.warn('Failed to read analytics storage:', error);
    return fallbackValue;
  }
}

function safeWriteJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to write analytics storage:', error);
  }
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

function toActionLabel(eventName) {
  return String(eventName || '')
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getOrCreateAnonymousUserId() {
  const existing = localStorage.getItem(ANON_USER_STORAGE_KEY);
  if (existing) return existing;

  const created = generateId('anon');
  localStorage.setItem(ANON_USER_STORAGE_KEY, created);
  return created;
}

function getCurrentUserId() {
  if (window.userAccount?.isLoggedIn && window.userAccount?.currentUser?.id) {
    return window.userAccount.currentUser.id;
  }
  return getOrCreateAnonymousUserId();
}

function readEvents() {
  const events = safeReadJson(EVENTS_STORAGE_KEY, []);
  return Array.isArray(events) ? events : [];
}

function appendEvent(eventRecord) {
  const events = readEvents();
  events.push(eventRecord);

  if (events.length > MAX_STORED_EVENTS) {
    events.splice(0, events.length - MAX_STORED_EVENTS);
  }

  safeWriteJson(EVENTS_STORAGE_KEY, events);
}

function findLatestSessionStartForUser(userId) {
  const events = readEvents();
  const matches = events
    .filter((event) => event.event === 'session_started' && event.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return matches[0] || null;
}

function handleSessionUnload() {
  if (trackerState.sessionCompleted || trackerState.abandonmentTracked) {
    return;
  }
  trackFlowAbandoned(trackerState.highestStepIndex || 0, 'page_unload');
}

export function trackEvent(eventName, details = {}, options = {}) {
  const sanitizedDetails = details && typeof details === 'object' ? details : { value: details };

  const record = {
    id: generateId('evt'),
    event: eventName,
    action: toActionLabel(eventName),
    details: sanitizedDetails,
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
    sessionId: trackerState.sessionId,
  };

  if (Number.isFinite(options.stepIndex)) {
    record.stepIndex = options.stepIndex;
    trackerState.highestStepIndex = Math.max(trackerState.highestStepIndex, options.stepIndex);
  }

  appendEvent(record);

  if (eventName === 'session_completed') {
    trackerState.sessionCompleted = true;
  }

  return record;
}

export function initializeAnalyticsTracker() {
  if (trackerState.initialized) return;

  trackerState.initialized = true;
  trackerState.sessionId = generateId('session');
  trackerState.sessionStartedAt = Date.now();
  trackerState.highestStepIndex = 0;
  trackerState.sessionCompleted = false;
  trackerState.abandonmentTracked = false;

  const userId = getCurrentUserId();
  const previousSession = findLatestSessionStartForUser(userId);
  if (previousSession?.timestamp) {
    const previousStart = new Date(previousSession.timestamp).getTime();
    const diffMs = Date.now() - previousStart;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (diffMs > 0 && diffMs <= sevenDaysMs) {
      trackEvent('returned_within_7d', {
        daysSinceLastSession: Number((diffMs / (24 * 60 * 60 * 1000)).toFixed(2)),
      });
    }
  }

  trackEvent(
    'session_started',
    {
      path: window.location.pathname,
    },
    { stepIndex: 0 }
  );

  window.addEventListener('beforeunload', handleSessionUnload, { capture: true });
}

export function trackModeSelected(modeType, mode, details = {}) {
  return trackEvent('mode_selected', {
    modeType,
    mode,
    ...details,
  });
}

export function trackStepCompleted(stepIndex, stepName, details = {}) {
  return trackEvent(
    'step_completed',
    {
      stepName,
      ...details,
    },
    { stepIndex }
  );
}

export function trackFlowAbandoned(stepIndex, reason = 'unknown', details = {}) {
  if (trackerState.sessionCompleted || trackerState.abandonmentTracked) {
    return null;
  }

  trackerState.abandonmentTracked = true;
  const resolvedStep = Number.isFinite(stepIndex) ? stepIndex : trackerState.highestStepIndex;

  return trackEvent(
    'flow_abandoned',
    {
      reason,
      ...details,
    },
    { stepIndex: resolvedStep }
  );
}

export function trackSessionCompleted(details = {}) {
  if (trackerState.sessionCompleted) {
    return null;
  }

  const durationSeconds = trackerState.sessionStartedAt
    ? Math.max(0, Math.round((Date.now() - trackerState.sessionStartedAt) / 1000))
    : 0;

  trackStepCompleted(5, 'session_completed', {
    sessionDurationSeconds: durationSeconds,
    ...details,
  });

  return trackEvent('session_completed', {
    sessionDurationSeconds: durationSeconds,
    ...details,
  });
}

export function getAnalyticsEvents() {
  return readEvents();
}

window.fitflowAnalytics = {
  initializeAnalyticsTracker,
  trackEvent,
  trackModeSelected,
  trackStepCompleted,
  trackFlowAbandoned,
  trackSessionCompleted,
  getAnalyticsEvents,
};
