import { HapticCodeItem, HapticEncodeResponse } from '../types';

export class HapticService {
  private static codebook: HapticCodeItem[] = [
    {
      symbol: 'HELP',
      label: 'I NEED HELP',
      pattern: [300, 100, 300, 100, 300, 200, 600, 200, 600],
      intensity: 'HIGH',
      category: 'EMERGENCY'
    },
    {
      symbol: 'CLEAR',
      label: 'AREA CLEAR / ALL GOOD',
      pattern: [150, 100, 150],
      intensity: 'LOW',
      category: 'STATUS'
    },
    {
      symbol: 'DANGER',
      label: 'DANGER / DO NOT PROCEED',
      pattern: [500, 100, 500, 100, 500],
      intensity: 'HIGH',
      category: 'EMERGENCY'
    },
    {
      symbol: 'MOVE',
      label: 'PROCEED TO NEXT POINT',
      pattern: [200, 150, 400],
      intensity: 'MEDIUM',
      category: 'NAVIGATION'
    },
    {
      symbol: 'SILENT_ALERT',
      label: 'SILENT WATCH ALERT',
      pattern: [100, 50, 100, 50, 100],
      intensity: 'MEDIUM',
      category: 'STATUS'
    }
  ];

  public static getCodebook(): HapticCodeItem[] {
    return this.codebook;
  }

  public static encodeMessage(message: string): HapticEncodeResponse {
    const cleanMsg = message.trim().toUpperCase();
    const match = this.codebook.find(
      c => c.label.toUpperCase() === cleanMsg || c.symbol.toUpperCase() === cleanMsg
    );

    let pattern: number[];
    let codebookMatch = 'CUSTOM_TEXT_SEQUENCE';

    if (match) {
      pattern = match.pattern;
      codebookMatch = match.symbol;
    } else {
      // Generate deterministic rhythmic vibration pattern for custom text
      pattern = [];
      for (let i = 0; i < Math.min(cleanMsg.length, 10); i++) {
        const charCode = cleanMsg.charCodeAt(i);
        const duration = 100 + (charCode % 250);
        pattern.push(duration);
        if (i < cleanMsg.length - 1) pattern.push(100);
      }
    }

    const hexPayload = Buffer.from(cleanMsg).toString('hex');

    return {
      message: cleanMsg,
      encodedPattern: pattern,
      codebookMatch,
      transmissionPayload: `0xHAPTIC_${hexPayload}`,
      timestamp: new Date().toISOString()
    };
  }

  public static decodePayload(payload: string): { message: string; pattern: number[]; decodedSuccessfully: boolean } {
    let cleanHex = payload.replace('0xHAPTIC_', '');
    try {
      const decodedText = Buffer.from(cleanHex, 'hex').toString('utf8');
      const encodeRes = this.encodeMessage(decodedText);
      return {
        message: decodedText,
        pattern: encodeRes.encodedPattern,
        decodedSuccessfully: true
      };
    } catch {
      return {
        message: 'UNKNOWN_HAPTIC_SIGNAL',
        pattern: [100, 100, 100],
        decodedSuccessfully: false
      };
    }
  }
}
