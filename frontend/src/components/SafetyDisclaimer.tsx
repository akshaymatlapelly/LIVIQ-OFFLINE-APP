import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface SafetyDisclaimerProps {
  message?: string;
  category?: 'INSPECTION' | 'MEDICINE' | 'RADAR' | 'OPTICAL';
}

export const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({
  message,
  category = 'INSPECTION'
}) => {
  const defaultMessages = {
    INSPECTION: 'FIRST-LEVEL SCREENING ASSISTANT: INSIGHT provides visual risk assessment for preliminary evaluation. It does NOT replace certified structural engineers, electricians, or professional safety inspectors.',
    MEDICINE: 'SAFETY DISCLAIMER: Visual screening analyzes packaging graphics and anti-tamper characteristics. It cannot guarantee pharmaceutical chemical authenticity. Suspected counterfeit medicines must be verified through official pharmacy registries.',
    RADAR: 'PROTOTYPE SENSING: Ultrasonic spatial visualization depends on microphone frequency response and acoustic speaker characteristics.',
    OPTICAL: 'SIMULATION MODE: Demonstrates camera/screen light framing concepts without raw flash driver overrides.'
  };

  const text = message || defaultMessages[category];

  return (
    <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-sm">
      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div className="leading-relaxed font-sans">
        <strong className="font-semibold text-amber-950">Safety & Trust Protocol: </strong>
        {text}
      </div>
    </div>
  );
};
