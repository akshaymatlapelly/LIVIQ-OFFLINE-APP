export type VoiceAgentState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'EXECUTING'
  | 'SPEAKING'
  | 'CONFIRMATION_REQUIRED'
  | 'ERROR'
  | 'PERMISSION_REQUIRED';

export type ApprovedVoiceAction =
  | 'NAVIGATE_HOME'
  | 'OPEN_SCAN'
  | 'OPEN_INSPECTION'
  | 'OPEN_MEDICINE'
  | 'OPEN_AURALENS'
  | 'OPEN_RADAR'
  | 'OPEN_HAPTIC'
  | 'OPEN_OPTICAL'
  | 'OPEN_MODES'
  | 'OPEN_HARDWARE'
  | 'OPEN_HISTORY'
  | 'OPEN_PROFILE'
  | 'OPEN_VOICE'
  | 'OPEN_HOW_IT_WORKS'
  | 'OPEN_DEMO'
  | 'GO_BACK'
  | 'START_SCAN'
  | 'SHOW_HELP'
  | 'CONFIRM_YES'
  | 'CONFIRM_NO'
  | 'CANCEL'
  // UNIVERSAL VOICE INTELLIGENCE ACTIONS
  | 'INSIGHT_SCAN'
  | 'INSIGHT_FACILITY'
  | 'CALL_FACILITY_CONFIRMATION'
  | 'LOCATION_SHARE_CONFIRMATION'
  | 'MEDSURE_SCAN'
  | 'MEDSURE_EXPLAIN_TELUGU'
  | 'START_YOGA'
  | 'START_WORKOUT'
  | 'ADD_WATER'
  | 'LOG_MEAL'
  | 'HEALTH_REPLAY';

export interface ParsedVoiceIntent {
  action: ApprovedVoiceAction;
  confidence: number;
  spokenResponse: string;
  targetPath?: string;
  payload?: any;
  requiresConfirmation?: boolean;
  confirmationPrompt?: string;
  confirmationTitle?: string;
}

export interface ContextualSuggestion {
  text: string;
  action: ApprovedVoiceAction;
}
