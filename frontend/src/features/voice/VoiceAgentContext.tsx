import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VoiceAgentState, ApprovedVoiceAction, ParsedVoiceIntent, ContextualSuggestion } from './types';
import { speechService } from './speechService';
import { speechRecognitionService } from './speechRecognitionService';
import { VoiceIntentEngine } from './voiceIntentEngine';
import { VoiceActionRegistry } from './voiceActionRegistry';
import { useAuth } from '../../context/AuthContext';

interface VoiceAgentContextType {
  voiceState: VoiceAgentState;
  transcript: string;
  response: string;
  detectedIntent: ParsedVoiceIntent | null;
  pendingIntent: ParsedVoiceIntent | null;
  isActive: boolean;
  isMuted: boolean;
  errorMessage: string | null;
  suggestions: ContextualSuggestion[];
  activateAgent: () => void;
  deactivateAgent: () => void;
  toggleMute: () => void;
  handleUserUtterance: (text: string) => void;
  executeSuggestion: (suggestion: ContextualSuggestion) => void;
  confirmPendingAction: () => void;
  cancelPendingAction: () => void;
}

const VoiceAgentContext = createContext<VoiceAgentContextType | undefined>(undefined);

export const VoiceAgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [voiceState, setVoiceState] = useState<VoiceAgentState>('IDLE');
  const [transcript, setTranscript] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [detectedIntent, setDetectedIntent] = useState<ParsedVoiceIntent | null>(null);
  const [pendingIntent, setPendingIntent] = useState<ParsedVoiceIntent | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const suggestions = VoiceIntentEngine.getSuggestionsForRoute(location.pathname);
  const preferredLang = user?.preferredLanguage || 'en-US';

  useEffect(() => {
    speechService.stop();
  }, [location.pathname]);

  const speakResponse = (text: string, onEnd?: () => void) => {
    setResponse(text);
    if (isMuted) {
      if (onEnd) onEnd();
      return;
    }
    setVoiceState('SPEAKING');
    speechService.speak(text, preferredLang, () => {
      setVoiceState('IDLE');
      if (onEnd) onEnd();
    });
  };

  const handleUserUtterance = (text: string) => {
    setTranscript(text);
    setVoiceState('PROCESSING');

    const intent = VoiceIntentEngine.parseUtterance(text, location.pathname, preferredLang);
    setDetectedIntent(intent);

    if (intent.action === 'CANCEL') {
      speechService.stop();
      speechRecognitionService.stopListening();
      setVoiceState('IDLE');
      setResponse('Cancelled.');
      setPendingIntent(null);
      setIsActive(false);
      return;
    }

    if (intent.requiresConfirmation) {
      setPendingIntent(intent);
      setVoiceState('CONFIRMATION_REQUIRED');
      speakResponse(intent.confirmationPrompt || intent.spokenResponse);
      return;
    }

    setVoiceState('EXECUTING');
    speakResponse(intent.spokenResponse, () => {
      VoiceActionRegistry.executeAction(intent, navigate);
    });
  };

  const confirmPendingAction = () => {
    if (!pendingIntent) return;
    setVoiceState('EXECUTING');
    const intentToExecute = pendingIntent;
    setPendingIntent(null);

    const actionMsg = intentToExecute.action === 'CALL_FACILITY_CONFIRMATION'
      ? 'Dialing 108 Emergency Trauma Facility...'
      : 'Broadcasting live GPS coordinates to emergency contacts...';

    speakResponse(actionMsg, () => {
      VoiceActionRegistry.executeAction(intentToExecute, navigate);
    });
  };

  const cancelPendingAction = () => {
    setPendingIntent(null);
    setVoiceState('IDLE');
    speakResponse('Action cancelled.');
  };

  const activateAgent = () => {
    setIsActive(true);
    setErrorMessage(null);
    setTranscript('');
    setDetectedIntent(null);
    setPendingIntent(null);

    const greeting = VoiceIntentEngine.getContextualGreeting(location.pathname, user?.name, preferredLang);

    speakResponse(greeting, () => {
      if (!speechRecognitionService.checkSupport()) {
        setVoiceState('ERROR');
        setErrorMessage('Voice recognition is not supported in this browser. You can click suggestions below.');
        return;
      }

      setVoiceState('LISTENING');
      speechRecognitionService.startListening(
        {
          onStart: () => setVoiceState('LISTENING'),
          onResult: (text, isFinal) => {
            setTranscript(text);
            if (isFinal) {
              speechRecognitionService.stopListening();
              handleUserUtterance(text);
            }
          },
          onError: (err) => {
            if (err.includes('denied')) {
              setVoiceState('PERMISSION_REQUIRED');
              setErrorMessage('Microphone permission required for voice control.');
            } else {
              setVoiceState('ERROR');
              setErrorMessage(err);
            }
          },
          onEnd: () => {
            if (voiceState === 'LISTENING') {
              setVoiceState('IDLE');
            }
          }
        },
        preferredLang
      );
    });
  };

  const deactivateAgent = () => {
    speechService.stop();
    speechRecognitionService.stopListening();
    setIsActive(false);
    setVoiceState('IDLE');
    setTranscript('');
    setResponse('');
    setDetectedIntent(null);
    setPendingIntent(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      speechService.stop();
    }
  };

  const executeSuggestion = (suggestion: ContextualSuggestion) => {
    handleUserUtterance(suggestion.text);
  };

  return (
    <VoiceAgentContext.Provider
      value={{
        voiceState,
        transcript,
        response,
        detectedIntent,
        pendingIntent,
        isActive,
        isMuted,
        errorMessage,
        suggestions,
        activateAgent,
        deactivateAgent,
        toggleMute,
        handleUserUtterance,
        executeSuggestion,
        confirmPendingAction,
        cancelPendingAction
      }}
    >
      {children}
    </VoiceAgentContext.Provider>
  );
};

export const useVoiceAgent = () => {
  const context = useContext(VoiceAgentContext);
  if (!context) {
    throw new Error('useVoiceAgent must be used within a VoiceAgentProvider');
  }
  return context;
};
