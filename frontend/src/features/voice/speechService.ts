export class SpeechService {
  private static instance: SpeechService;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  public speak(text: string, langOrOnEnd?: string | (() => void), onEnd?: () => void): void {
    if (!this.synth) {
      if (typeof langOrOnEnd === 'function') langOrOnEnd();
      else if (onEnd) onEnd();
      return;
    }

    let lang = 'en-US';
    let callback = onEnd;

    if (typeof langOrOnEnd === 'function') {
      callback = langOrOnEnd;
    } else if (typeof langOrOnEnd === 'string') {
      lang = langOrOnEnd;
    }

    this.stop(); // Cancel previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Pick voice matching preferred language if available
    const voices = this.synth.getVoices();
    const langPrefix = lang.split('-')[0]; // e.g., 'te', 'hi', 'en', 'es', etc.

    const preferredVoice =
      voices.find((v) => v.lang === lang) ||
      voices.find((v) => v.lang.startsWith(langPrefix)) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (callback) callback();
    };

    utterance.onerror = (e) => {
      console.warn('[SpeechService] TTS Error:', e);
      this.currentUtterance = null;
      if (callback) callback();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }
}

export const speechService = SpeechService.getInstance();
