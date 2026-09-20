import { ParsedVoiceIntent, ContextualSuggestion } from './types';

export class VoiceIntentEngine {
  public static getContextualGreeting(route: string, userName?: string, lang: string = 'en-US'): string {
    const name = userName ? userName.split(' ')[0] : '';
    const langCode = lang ? lang.split('-')[0] : 'en';

    if (langCode === 'te') {
      const teName = name ? `అవును ${name}. ` : "అవును, నేను ఇక్కడ ఉన్నాను. ";
      switch (route) {
        case '/profile':
          return `${teName}మీరు ప్రొఫైల్ పేజీలో ఉన్నారు.`;
        case '/insight':
          return `${teName}మీరు INSIGHT లో ఉన్నారు. అత్యవసర పరీక్ష సిద్ధంగా ఉందా?`;
        case '/medsure':
          return `${teName}మీరు MEDSURE లో ఉన్నారు. ఔషధ ప్యాకేజీని తనిఖీ చేయాలా?`;
        case '/healtrace':
          return `${teName}మీరు HEALTRACE లో ఉన్నారు. ల్యాబ్ నివేదికను స్కాన్ చేయాలా?`;
        case '/replay':
          return `${teName}మీరు 7-రోజుల హెల్త్ రీప్లే టైమ్‌లైన్‌లో ఉన్నారు.`;
        default:
          return `${teName}LIVIQ కి స్వాగతం. నేను మీకు ఏమి సహాయం చేయగలను?`;
      }
    }

    if (langCode === 'hi') {
      const hiName = name ? `हाँ ${name}। ` : "हाँ, मैं यहाँ हूँ। ";
      switch (route) {
        case '/profile':
          return `${hiName}आप प्रोफ़ाइल पेज में हैं।`;
        case '/insight':
          return `${hiName}आप INSIGHT में हैं। आपातकालीन जाँच शुरू करें?`;
        case '/medsure':
          return `${hiName}आप MEDSURE में हैं। क्या दवा का पैकेट जांचना है?`;
        case '/healtrace':
          return `${hiName}आप HEALTRACE में हैं।`;
        default:
          return `${hiName}LIVIQ में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ?`;
      }
    }

    // Default English
    const nameGreeting = name ? `Yeah, ${name}. ` : "Yeah, I'm here. ";
    switch (route) {
      case '/insight':
        return `${nameGreeting}You're in INSIGHT. Ready for emergency response framing.`;
      case '/medsure':
        return `${nameGreeting}You're in MEDSURE. Ready to verify medicine packaging.`;
      case '/healtrace':
        return `${nameGreeting}You're in HEALTRACE. Everyday Health Intelligence active.`;
      case '/replay':
        return `${nameGreeting}Viewing 7-Day Health Replay timeline.`;
      case '/yogatrace':
        return `${nameGreeting}YogaTrace pose detection active.`;
      case '/gymtrace':
        return `${nameGreeting}GymTrace rep counter active.`;
      case '/foodtrace':
        return `${nameGreeting}FoodTrace nutrition scanner active.`;
      case '/home':
      default:
        return `${nameGreeting}Welcome to LIVIQ Universal Voice. Say "Scan accident", "Start yoga", or "I drank 500 ml water".`;
    }
  }

  public static getSuggestionsForRoute(route: string): ContextualSuggestion[] {
    switch (route) {
      case '/insight':
        return [
          { text: 'Scan this accident', action: 'INSIGHT_SCAN' },
          { text: 'Find an emergency hospital', action: 'INSIGHT_FACILITY' },
          { text: 'Call the hospital', action: 'CALL_FACILITY_CONFIRMATION' },
          { text: 'Share my location', action: 'LOCATION_SHARE_CONFIRMATION' }
        ];
      case '/medsure':
        return [
          { text: 'Scan this medicine', action: 'MEDSURE_SCAN' },
          { text: 'Explain this medicine in Telugu', action: 'MEDSURE_EXPLAIN_TELUGU' },
          { text: 'Replay my week', action: 'HEALTH_REPLAY' }
        ];
      case '/healtrace':
      case '/yogatrace':
      case '/gymtrace':
      case '/foodtrace':
        return [
          { text: 'Start yoga', action: 'START_YOGA' },
          { text: 'Start my workout', action: 'START_WORKOUT' },
          { text: 'I drank 500 ml water', action: 'ADD_WATER' },
          { text: 'Log my breakfast', action: 'LOG_MEAL' }
        ];
      case '/home':
      default:
        return [
          { text: 'Scan this accident', action: 'INSIGHT_SCAN' },
          { text: 'Find an emergency hospital', action: 'INSIGHT_FACILITY' },
          { text: 'Scan this medicine', action: 'MEDSURE_SCAN' },
          { text: 'Start yoga', action: 'START_YOGA' },
          { text: 'Replay my week', action: 'HEALTH_REPLAY' }
        ];
    }
  }

  public static parseUtterance(rawText: string, currentRoute: string, lang: string = 'en-US'): ParsedVoiceIntent {
    const text = rawText.toLowerCase().trim();
    const langCode = lang ? lang.split('-')[0] : 'en';

    // Cancel / Stop
    if (text.includes('stop') || text.includes('cancel') || text.includes('आपु') || text.includes('అపు') || text.includes('रोक')) {
      return {
        action: 'CANCEL',
        confidence: 0.99,
        spokenResponse: langCode === 'te' ? 'ఆపివేసాను.' : (langCode === 'hi' ? 'रोक दिया गया।' : 'Stopped.')
      };
    }

    // 1. "Scan this accident" -> INSIGHT_SCAN
    if (text.includes('scan this accident') || text.includes('scan accident') || text.includes('scan incident') || text.includes('accident scan')) {
      return {
        action: 'INSIGHT_SCAN',
        confidence: 0.96,
        spokenResponse: 'Opening INSIGHT emergency incident scanner.',
        targetPath: '/insight'
      };
    }

    // 2. "Find an emergency hospital" -> INSIGHT_FACILITY
    if (text.includes('find an emergency hospital') || text.includes('find emergency hospital') || text.includes('find hospital') || text.includes('trauma center')) {
      return {
        action: 'INSIGHT_FACILITY',
        confidence: 0.95,
        spokenResponse: 'Searching for nearest Level 1 Trauma Facility.',
        targetPath: '/insight'
      };
    }

    // 3. "Call the hospital" -> CALL_FACILITY_CONFIRMATION (Sensitive Action)
    if (text.includes('call the hospital') || text.includes('call hospital') || text.includes('call 108') || text.includes('dial emergency')) {
      return {
        action: 'CALL_FACILITY_CONFIRMATION',
        confidence: 0.98,
        spokenResponse: 'Confirming emergency hospital call.',
        requiresConfirmation: true,
        confirmationTitle: 'Confirm Emergency Hospital Call',
        confirmationPrompt: 'Are you sure you want to dial 108 Emergency Trauma Facility now?'
      };
    }

    // 4. "Share my location" -> LOCATION_SHARE_CONFIRMATION (Sensitive Action)
    if (text.includes('share my location') || text.includes('send location') || text.includes('share gps') || text.includes('broadcast coordinates')) {
      return {
        action: 'LOCATION_SHARE_CONFIRMATION',
        confidence: 0.98,
        spokenResponse: 'Confirming live GPS location broadcast.',
        requiresConfirmation: true,
        confirmationTitle: 'Confirm GPS Location Sharing',
        confirmationPrompt: 'Are you sure you want to broadcast your GPS coordinates to trusted emergency contacts?'
      };
    }

    // 5. "Scan this medicine" -> MEDSURE_SCAN
    if (text.includes('scan this medicine') || text.includes('scan medicine') || text.includes('verify medicine') || text.includes('check pill')) {
      return {
        action: 'MEDSURE_SCAN',
        confidence: 0.95,
        spokenResponse: 'Opening MEDSURE OCR medicine scanner.',
        targetPath: '/medsure'
      };
    }

    // 6. "Explain this medicine in Telugu" -> MEDSURE_EXPLAIN_TELUGU
    if (text.includes('explain this medicine in telugu') || text.includes('explain in telugu') || text.includes('telugu medicine')) {
      return {
        action: 'MEDSURE_EXPLAIN_TELUGU',
        confidence: 0.97,
        spokenResponse: 'ఈ మందు వివరణ మరియు భద్రతా సలహాలు తెలుగులో లభిస్తాయి.',
        targetPath: '/medsure'
      };
    }

    // 7. "Start yoga" -> START_YOGA
    if (text.includes('start yoga') || text.includes('begin yoga') || text.includes('guided yoga')) {
      return {
        action: 'START_YOGA',
        confidence: 0.98,
        spokenResponse: 'Starting YogaTrace pose detection.',
        targetPath: '/yogatrace'
      };
    }

    // 8. "Start my workout" -> START_WORKOUT
    if (text.includes('start my workout') || text.includes('start workout') || text.includes('begin workout') || text.includes('gym workout')) {
      return {
        action: 'START_WORKOUT',
        confidence: 0.98,
        spokenResponse: 'Starting GymTrace rep counter workout.',
        targetPath: '/gymtrace'
      };
    }

    // 9. "I drank 500 ml water" -> ADD_WATER 500ml
    if (text.includes('drank') && (text.includes('water') || text.includes('ml'))) {
      return {
        action: 'ADD_WATER',
        confidence: 0.95,
        spokenResponse: 'Logged +500 ml fluid intake to HydrateTrace.',
        payload: { amountMl: 500 },
        targetPath: '/hydratetrace'
      };
    }

    // 10. "Log my breakfast" -> LOG_MEAL
    if (text.includes('log my breakfast') || text.includes('log breakfast') || text.includes('log meal') || text.includes('log lunch')) {
      return {
        action: 'LOG_MEAL',
        confidence: 0.95,
        spokenResponse: 'Opening FoodTrace meal logger.',
        targetPath: '/foodtrace'
      };
    }

    // 11. "Replay my last seven days" -> HEALTH_REPLAY 7D
    if (text.includes('replay my last seven days') || text.includes('replay my week') || text.includes('replay week') || text.includes('health replay')) {
      return {
        action: 'HEALTH_REPLAY',
        confidence: 0.98,
        spokenResponse: 'Opening 7-day Health Replay timeline.',
        targetPath: '/replay'
      };
    }

    // Navigation fallbacks
    if (text.includes('insight') || text.includes('emergency')) {
      return { action: 'OPEN_INSPECTION', confidence: 0.95, spokenResponse: 'Opening INSIGHT Emergency Intelligence.', targetPath: '/insight' };
    }
    if (text.includes('medsure') || text.includes('medicine')) {
      return { action: 'OPEN_MEDICINE', confidence: 0.95, spokenResponse: 'Opening MEDSURE Medication Safety.', targetPath: '/medsure' };
    }
    if (text.includes('healtrace') || text.includes('health')) {
      return { action: 'OPEN_AURALENS', confidence: 0.95, spokenResponse: 'Opening HEALTRACE Everyday Health Intelligence.', targetPath: '/healtrace' };
    }

    return {
      action: 'SHOW_HELP',
      confidence: 0.5,
      spokenResponse: 'You can say "Scan accident", "Find hospital", "Start yoga", or "Replay my week".'
    };
  }
}
