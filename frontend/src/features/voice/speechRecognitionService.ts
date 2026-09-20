export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private recognition: any = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      }
    }
  }

  public static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public startListening(callbacks: SpeechRecognitionCallbacks, lang: string = 'en-US'): void {
    if (!this.isSupported || !this.recognition) {
      if (callbacks.onError) {
        callbacks.onError('Voice recognition is not supported in this browser environment.');
      }
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = lang;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (callbacks.onStart) callbacks.onStart();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const currentText = finalTranscript || interimTranscript;
      if (callbacks.onResult && currentText) {
        callbacks.onResult(currentText.trim(), !!finalTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('[SpeechRecognitionService] Error:', event.error);
      this.isListening = false;
      if (callbacks.onError) {
        if (event.error === 'not-allowed') {
          callbacks.onError('Microphone permission denied. Please allow microphone access in browser settings.');
        } else if (event.error === 'no-speech') {
          callbacks.onError('No speech detected.');
        } else {
          callbacks.onError(`Speech recognition error: ${event.error}`);
        }
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (callbacks.onEnd) callbacks.onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('[SpeechRecognitionService] Failed to start:', e);
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore stop errors
      }
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechRecognitionService = SpeechRecognitionService.getInstance();
