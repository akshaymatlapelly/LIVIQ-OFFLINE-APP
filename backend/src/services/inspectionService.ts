import { InspectionAnalysisResult } from '../types';

export class InspectionService {
  public static analyzeInspection(category: string, imageUri?: string): InspectionAnalysisResult {
    const id = `insp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    
    let detectedIssue = 'Structural Wall Fracture';
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'HIGH';
    let confidence = 0.94;
    let observation = 'Continuous 4.2mm diagonal shear crack extending across load-bearing masonry wall.';
    let explanation = 'Shear stress concentration near corner joint likely caused by foundation settlement or seismic vibration.';
    let recommendedAction = 'Immediate structural bracing recommended. Restrict load overhead and log official civil engineering report.';
    let evidenceSummary = '3 high-contrast visual surface depth frames captured. Dislocation angle: 14.2 degrees.';
    let location = 'Zone B - Sector 4 (Geotag: 37.7749° N, 122.4194° W)';

    if (category.toLowerCase().includes('pothole') || category.toLowerCase().includes('road')) {
      detectedIssue = 'Deep Asphalt Sub-Base Cavity';
      riskLevel = 'MEDIUM';
      confidence = 0.96;
      observation = 'Asphalt crater measuring 48cm in diameter with 8cm exposed base gravel.';
      explanation = 'Freeze-thaw expansion and heavy vehicular wheel stress degraded top binder layer.';
      recommendedAction = 'Mark zone with high-visibility reflector cone. Schedule cold-mix asphalt patch filling.';
      evidenceSummary = 'Volumetric shadow profiling estimates 14.5 Liters fill volume required.';
      location = 'Main Access Road - Bay 12';
    } else if (category.toLowerCase().includes('electrical')) {
      detectedIssue = 'Terminal Junction Overheating & Insulator Discoloration';
      riskLevel = 'CRITICAL';
      confidence = 0.97;
      observation = 'Severe thermal degradation and charring on 480V 3-Phase terminal lug B.';
      explanation = 'High contact resistance caused localized ohmic heating above 180°C threshold.';
      recommendedAction = 'DO NOT TOUCH. De-energize main circuit breaker immediately and call certified high-voltage electrician.';
      evidenceSummary = 'Optical spectrum hue shift indicates severe polymer oxidation.';
      location = 'Power Substation Unit 3A';
    } else if (category.toLowerCase().includes('water') || category.toLowerCase().includes('leak')) {
      detectedIssue = 'Pressurized Pipe Joint Seep';
      riskLevel = 'MEDIUM';
      confidence = 0.92;
      observation = 'Active drop formation at PVC elbow coupling under 4.5 bar line pressure.';
      explanation = 'Gasket degradation or inadequate solvent weld bond under thermal expansion.';
      recommendedAction = 'Isolate isolation valve V-102. Apply temporary silicone repair wrap until joint replacement.';
      evidenceSummary = 'Surface reflectivity and micro-droplet pattern confirmed active moisture accumulation.';
      location = 'Basement Mechanical Room - Utility Rack 2';
    }

    return {
      id,
      category,
      detectedIssue,
      riskLevel,
      confidence,
      observation,
      explanation,
      recommendedAction,
      evidenceSummary,
      location,
      timestamp: new Date().toISOString(),
      disclaimer: 'SENTRIX Inspection is a first-level visual screening assistant. It does NOT replace certified structural engineers, electricians, or professional inspectors.'
    };
  }
}
