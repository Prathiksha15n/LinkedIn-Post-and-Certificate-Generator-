export type AppState = "IDLE" | "FORM_VALID" | "GENERATED" | "SHARE_PENDING" | "SHARE_SUCCESS" | "SHARE_FAILED"

export interface AppStateData {
  formData: {
    name: string
    jobRole: string
    companyName: string
  }
  linkedinPost: string
  certificateId: string
  certificatePreviewUrl: string
  error: string
  linkedinAuthenticated: boolean
  linkedinProfile: {
    firstName: string
    lastName: string
  } | null
}

export interface StateTransition {
  from: AppState
  to: AppState
  condition?: (data: AppStateData) => boolean
}

export const STATE_TRANSITIONS: StateTransition[] = [
  { from: "IDLE", to: "FORM_VALID" },
  { from: "FORM_VALID", to: "GENERATED" },
  { from: "GENERATED", to: "SHARE_PENDING" },
  { from: "SHARE_PENDING", to: "SHARE_SUCCESS" },
  { from: "SHARE_PENDING", to: "SHARE_FAILED" },
  { from: "SHARE_FAILED", to: "SHARE_PENDING" }, // Retry
  { from: "GENERATED", to: "FORM_VALID" }, // Reset after error
  { from: "SHARE_FAILED", to: "FORM_VALID" }, // Reset
]

export function canTransition(from: AppState, to: AppState, data?: AppStateData): boolean {
  const transition = STATE_TRANSITIONS.find((t) => t.from === from && t.to === to)
  if (!transition) return false

  if (transition.condition && data) {
    return transition.condition(data)
  }

  return true
}

export function getValidTransitions(currentState: AppState): AppState[] {
  return STATE_TRANSITIONS.filter((t) => t.from === currentState).map((t) => t.to)
}

export interface ButtonStates {
  generateButton: {
    enabled: boolean
    loading: boolean
    text: string
  }
  shareButton: {
    enabled: boolean
    loading: boolean
    text: string
  }
  downloadButton: {
    enabled: boolean
    loading: boolean
    text: string
  }
  authButton: {
    enabled: boolean
    loading: boolean
    text: string
    visible: boolean
  }
}

export function getButtonStates(
  appState: AppState,
  isFormValid: boolean,
  linkedinAuthenticated: boolean,
  hasContent: boolean,
): ButtonStates {
  return {
    generateButton: {
      enabled: isFormValid && (appState === "FORM_VALID" || appState === "IDLE"),
      loading: appState === "GENERATED",
      text: appState === "GENERATED" ? "Generated" : "Generate Content",
    },
    shareButton: {
      enabled: linkedinAuthenticated && hasContent && (appState === "GENERATED" || appState === "SHARE_FAILED"),
      loading: appState === "SHARE_PENDING",
      text: appState === "SHARE_PENDING" ? "Sharing..." : "Share on LinkedIn",
    },
    downloadButton: {
      enabled: appState === "SHARE_SUCCESS",
      loading: false,
      text: "Download Certificate",
    },
    authButton: {
      enabled: !linkedinAuthenticated,
      loading: false,
      text: "Connect LinkedIn",
      visible: !linkedinAuthenticated,
    },
  }
}

export function validateStateTransition(
  currentState: AppState,
  newState: AppState,
  data: AppStateData,
): { valid: boolean; error?: string } {
  // Validate form data for certain transitions
  if (newState === "FORM_VALID" || newState === "GENERATED") {
    const { name, jobRole, companyName } = data.formData
    if (!name.trim() || !jobRole.trim() || !companyName.trim()) {
      return { valid: false, error: "All form fields are required" }
    }
    if (name.length < 2 || jobRole.length < 2 || companyName.length < 2) {
      return { valid: false, error: "All fields must be at least 2 characters long" }
    }
  }

  // Validate LinkedIn authentication for sharing
  if (newState === "SHARE_PENDING" && !data.linkedinAuthenticated) {
    return { valid: false, error: "LinkedIn authentication required" }
  }

  // Validate content exists for sharing
  if (newState === "SHARE_PENDING" && !data.linkedinPost.trim()) {
    return { valid: false, error: "LinkedIn post content is required" }
  }

  // Validate certificate exists for sharing
  if (newState === "SHARE_PENDING" && !data.certificateId) {
    return { valid: false, error: "Certificate must be generated first" }
  }

  return { valid: true }
}

export function getStateDescription(state: AppState): string {
  switch (state) {
    case "IDLE":
      return "Ready to start - fill out the form to begin"
    case "FORM_VALID":
      return "Form completed - ready to generate content"
    case "GENERATED":
      return "Content generated - ready to share on LinkedIn"
    case "SHARE_PENDING":
      return "Sharing on LinkedIn..."
    case "SHARE_SUCCESS":
      return "Successfully shared! Certificate download is now available"
    case "SHARE_FAILED":
      return "Sharing failed - please try again"
    default:
      return "Unknown state"
  }
}
