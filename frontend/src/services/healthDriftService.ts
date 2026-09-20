// healthDriftService.ts - Health Drift Telemetry Service for LIVIQ
// Identifies meaningful deviations from the user's OWN recent personal baseline.
// Enforces strict non-diagnostic language ("changed", "below your recent pattern", "different from usual").

export interface HealthDriftItem {
  id: string;
  signalName: string;
  category: 'Sleep' | 'Activity' | 'Hydration' | 'Workout' | 'Nutrition';
  currentPatternText: string;   // e.g., "5h 50m"
  personalBaselineText: string; // e.g., "7h 20m"
  differenceText: string;       // e.g., "-1h 30m (-20%)"
  durationText: string;         // e.g., "Over the last 3 days"
  observationMessage: string;   // e.g., "Sleep has been below your recent baseline over the last 3 days."
  relatedSignals: string[];     // e.g., ["Late dinner timing (21:45)", "High sedentary hours (6.5 hrs)"]
  driftStatus: 'BELOW_BASELINE' | 'ABOVE_BASELINE' | 'SHIFTED_TIMING' | 'STABLE';
  disclaimer: string;
}

const DRIFT_STORAGE_KEY = 'liviq_health_drift_items_v1';

const DEFAULT_DRIFT_ITEMS: HealthDriftItem[] = [
  {
    id: 'drift-sleep-1',
    signalName: 'Nightly Sleep Rest',
    category: 'Sleep',
    currentPatternText: '5h 50m',
    personalBaselineText: '7h 20m',
    differenceText: '-1h 30m below baseline',
    durationText: 'Over the last 3 days',
    observationMessage: 'Sleep has been below your recent baseline over the last 3 days.',
    relatedSignals: ['Dinner timing shifted to 21:45', 'Late evening screen activity logged', 'Higher evening sedentary hours'],
    driftStatus: 'BELOW_BASELINE',
    disclaimer: 'Non-diagnostic pattern observation. Identifies lifestyle variance from your recent baseline.'
  },
  {
    id: 'drift-activity-2',
    signalName: 'Daily Movement Steps',
    category: 'Activity',
    currentPatternText: '4,200 steps',
    personalBaselineText: '6,800 steps',
    differenceText: '-2,600 steps below baseline',
    durationText: 'Over the last 3 days',
    observationMessage: 'Your activity has been lower than usual over the last 3 days.',
    relatedSignals: ['Sedentary hours increased to 6.2 hrs/day', 'Fewer morning walk intervals recorded'],
    driftStatus: 'BELOW_BASELINE',
    disclaimer: 'Non-diagnostic pattern observation. Identifies lifestyle variance from your recent baseline.'
  },
  {
    id: 'drift-hydration-3',
    signalName: 'Fluid Hydration Intake',
    category: 'Hydration',
    currentPatternText: '1.4 L (1,400 ml)',
    personalBaselineText: '2.1 L (2,100 ml)',
    differenceText: '-700 ml below baseline',
    durationText: 'Over the last 2 days',
    observationMessage: 'Hydration intake has been lower than your usual pattern over the last 2 days.',
    relatedSignals: ['Fewer afternoon water log entries', 'Warmer ambient temperature telemetry'],
    driftStatus: 'BELOW_BASELINE',
    disclaimer: 'Non-diagnostic pattern observation. Identifies lifestyle variance from your recent baseline.'
  },
  {
    id: 'drift-dinner-4',
    signalName: 'Evening Dinner Timing',
    category: 'Nutrition',
    currentPatternText: '9:45 PM (21:45)',
    personalBaselineText: '8:15 PM (20:15)',
    differenceText: '+1h 30m time shift',
    durationText: 'Over the last 4 days',
    observationMessage: 'Dinner timing has shifted later than usual over the last 4 days.',
    relatedSignals: ['Bedtime delayed by 45 mins', 'Post-meal digestion window reduced before sleep'],
    driftStatus: 'SHIFTED_TIMING',
    disclaimer: 'Non-diagnostic pattern observation. Identifies lifestyle variance from your recent baseline.'
  }
];

export class HealthDriftService {
  public getDriftItems(): HealthDriftItem[] {
    try {
      const stored = localStorage.getItem(DRIFT_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(DRIFT_STORAGE_KEY, JSON.stringify(DEFAULT_DRIFT_ITEMS));
        return DEFAULT_DRIFT_ITEMS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_DRIFT_ITEMS;
    }
  }

  public refreshDriftDetection(): HealthDriftItem[] {
    localStorage.setItem(DRIFT_STORAGE_KEY, JSON.stringify(DEFAULT_DRIFT_ITEMS));
    window.dispatchEvent(new CustomEvent('liviq-drift-updated', { detail: DEFAULT_DRIFT_ITEMS }));
    return DEFAULT_DRIFT_ITEMS;
  }
}

export const healthDriftService = new HealthDriftService();
