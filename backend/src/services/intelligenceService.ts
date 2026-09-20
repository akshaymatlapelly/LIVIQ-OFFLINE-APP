import { ScanCategory, CapabilityType, ScanClassificationResult } from '../types';

export class IntelligenceService {
  public static classifyInput(categoryInput: string | ScanCategory): ScanClassificationResult {
    const scanId = `scn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const cat = categoryInput as ScanCategory;

    let targetCapability: CapabilityType = 'INSPECTION';
    let confidence = 0.96;
    let routeReason = '';
    let recommendedAction = '';

    switch (cat) {
      case 'Wall Crack':
      case 'Road Damage':
      case 'Electrical Equipment':
        targetCapability = 'INSPECTION';
        confidence = 0.98;
        routeReason = 'Visual structural defect detected. Directing to SENTRIX Inspection for depth, risk level, and structural hazard evaluation.';
        recommendedAction = 'Position camera 30cm from damage and initiate multiscale visual capture.';
        break;

      case 'Medicine Package':
        targetCapability = 'MEDICINE';
        confidence = 0.95;
        routeReason = 'Pharmaceutical package detected. Directing to Medicine Investigator to analyze micro-printing alignment and tamper seals.';
        recommendedAction = 'Align box or blister pack within highlighted guide frame and ensure LED flash is enabled.';
        break;

      case 'Receipt':
      case 'Document':
      case 'Appliance Error Code':
      case 'Unknown Object':
        targetCapability = 'AURALENS';
        confidence = 0.96;
        routeReason = 'Textual or structured item detected. Directing to AuraLens to extract information, split expenses, or diagnose error code.';
        recommendedAction = 'Ensure document text or error display is clear and well-lit.';
        break;

      default:
        targetCapability = 'INSPECTION';
        confidence = 0.89;
        routeReason = 'Unclassified input. Directing to general SENTRIX Inspection engine.';
        recommendedAction = 'Proceed with visual camera analysis.';
        break;
    }

    return {
      scanId,
      inputCategory: cat,
      targetCapability,
      confidence,
      routeReason,
      recommendedAction,
      timestamp: new Date().toISOString()
    };
  }
}
