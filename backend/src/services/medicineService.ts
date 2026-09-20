import { MedicineAnalysisResult } from '../types';

export class MedicineService {
  public static analyzePackage(packageName: string, simulateFlagged: boolean = false): MedicineAnalysisResult {
    const id = `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    if (simulateFlagged) {
      return {
        id,
        packageName: packageName || 'Target Pharmaceutical Sample',
        status: 'POTENTIAL COUNTERFEIT INDICATORS DETECTED',
        confidence: 0.93,
        observedIndicators: [
          {
            name: 'Font Alignment & Microtext',
            status: 'FLAGGED',
            detail: 'Inconsistent kerning on batch serial number. Sub-pixel misalignment observed on manufacturer logo.'
          },
          {
            name: 'Package Edge Geometry',
            status: 'SUSPICIOUS',
            detail: 'Blister foil seal pattern lacks standard heat-embossed diamond crosshatch.'
          },
          {
            name: 'Color Spectrum Accuracy',
            status: 'FLAGGED',
            detail: 'Primary brand hue shift detected (-12% Cyan offset compared to manufacturer reference standard).'
          },
          {
            name: 'Hologram / Anti-Tamper Seal',
            status: 'PASS',
            detail: 'Reflective optical security foil element present.'
          }
        ],
        comparisonSummary: 'Visual analysis revealed 3 discrepancies against official packaging design specs for this product line.',
        recommendedVerification: 'Quarantine item immediately. Scan manufacturer 2D DataMatrix code via authorized pharmacy registry or contact drug regulatory authority.',
        timestamp: new Date().toISOString(),
        disclaimer: 'Visual screening cannot guarantee pharmaceutical authenticity. Suspected counterfeit medicines should be verified through authorized channels.'
      };
    }

    return {
      id,
      packageName: packageName || 'Amoxicillin 500mg Trihydrate Packaging',
      status: 'NO COUNTERFEIT INDICATORS DETECTED',
      confidence: 0.97,
      observedIndicators: [
        {
          name: 'Font Alignment & Microtext',
          status: 'PASS',
          detail: 'Batch number printing, line spacing, and micro-print resolution align with authentic baseline.'
        },
        {
          name: 'Package Edge Geometry',
          status: 'PASS',
          detail: 'Heat-sealed blister perforation margins match precision industrial die cut.'
        },
        {
          name: 'Color Spectrum Accuracy',
          status: 'PASS',
          detail: 'Pantone brand color matches official lab spec within 99.1% tolerance.'
        },
        {
          name: 'Tamper Evidence',
          status: 'PASS',
          detail: 'Carton safety tab intact with original adhesive shear pattern.'
        }
      ],
      comparisonSummary: 'All checked packaging parameters (4/4) align with official manufacturer visual indicators.',
      recommendedVerification: 'Always verify expiry date (EXP) and batch number with your dispensing pharmacist.',
      timestamp: new Date().toISOString(),
      disclaimer: 'Visual screening cannot guarantee pharmaceutical authenticity. Suspected counterfeit medicines should be verified through authorized channels.'
    };
  }
}
