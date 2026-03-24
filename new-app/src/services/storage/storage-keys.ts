export const STORAGE_NAMESPACE = 'workout-generator-react.v1'

export const STORAGE_KEYS = {
  builderDraft: `${STORAGE_NAMESPACE}.builder-draft`,
  activeSession: `${STORAGE_NAMESPACE}.active-session`,
  history: `${STORAGE_NAMESPACE}.history`,
  preferences: `${STORAGE_NAMESPACE}.preferences`,
} as const
