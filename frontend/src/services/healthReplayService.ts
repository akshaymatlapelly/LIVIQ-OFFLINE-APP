// healthReplayService.ts - Health Replay Timeline Reconstruction Engine for LIVIQ
// Pipeline: LOCAL HEALTH DATA -> PERSONAL BASELINE -> PATTERN ENGINE -> HEALTH DRIFT -> HEALTH REPLAY
// Explores: What changed? When did it change? What patterns appear together? What can I try next?

export interface DailyReplaySnapshot {
  dayName: string; // e.g., "MONDAY"
  dateFormatted: string; // e.g., "14 SEP 2026"
  isToday: boolean;
  hasDrift: boolean;
  
  // Ingested Signals
  sleep: { durationText: string; efficiencyPercent: number; bedtime: string; isBelowBaseline: boolean };
  activity: { stepsCount: number; distanceKm: string; isBelowBaseline: boolean };
  hydration: { waterMl: number; isBelowBaseline: boolean };
  nutrition: { mealCount: number; calories: number; dinnerTime: string; isShifted: boolean };
  workout: { type: string; duration: string; completed: boolean };
  energy: { level: 'High' | 'Moderate' | 'Low'; score: number };
  medicine: { name: string; taken: boolean; time: string }[];
  
  summaryNote: string;
}

export interface ReplayTimeframeData {
  timeframe: '7 DAYS' | '14 DAYS' | '30 DAYS';
  dateRangeText: string;
  patternSynthesis: {
    whatChanged: string;
    whenItChanged: string;
    cooccurringPatterns: string;
    whatYouCouldTry: string;
  };
  dailySnapshots: DailyReplaySnapshot[];
}

const REPLAY_STORAGE_KEY = 'liviq_health_replay_data_v1';

const MOCK_REPLAY_7_DAYS: ReplayTimeframeData = {
  timeframe: '7 DAYS',
  dateRangeText: '09 SEP 2026 – 15 SEP 2026',
  patternSynthesis: {
    whatChanged: 'Over the last 3 days, your sleep duration and daily steps shifted below your personal baseline.',
    whenItChanged: 'Pattern deviation began on Sunday, September 13th following a 90-minute delay in evening dinner timing.',
    cooccurringPatterns: 'Lower sleep duration (5h 50m avg) co-occurred with reduced daily activity (4,100 steps) and lower self-reported energy ratings (5.2 / 10).',
    whatYouCouldTry: 'Return toward your usual sleep schedule (bedtime around 23:15) and baseline activity level, then continue tracking.'
  },
  dailySnapshots: [
    {
      dayName: 'MONDAY',
      dateFormatted: '15 SEP 2026',
      isToday: true,
      hasDrift: true,
      sleep: { durationText: '5h 50m', efficiencyPercent: 78, bedtime: '00:45', isBelowBaseline: true },
      activity: { stepsCount: 4200, distanceKm: '3.1 km', isBelowBaseline: true },
      hydration: { waterMl: 1750, isBelowBaseline: true },
      nutrition: { mealCount: 3, calories: 1650, dinnerTime: '21:45', isShifted: true },
      workout: { type: 'None', duration: '0 min', completed: false },
      energy: { level: 'Low', score: 5.2 },
      medicine: [{ name: 'Amoxicillin 500mg', taken: true, time: '08:30' }],
      summaryNote: 'Sleep & activity below baseline; dinner delayed by 90 minutes.'
    },
    {
      dayName: 'SUNDAY',
      dateFormatted: '14 SEP 2026',
      isToday: false,
      hasDrift: true,
      sleep: { durationText: '6h 05m', efficiencyPercent: 80, bedtime: '00:30', isBelowBaseline: true },
      activity: { stepsCount: 4100, distanceKm: '3.0 km', isBelowBaseline: true },
      hydration: { waterMl: 1500, isBelowBaseline: true },
      nutrition: { mealCount: 3, calories: 1720, dinnerTime: '21:30', isShifted: true },
      workout: { type: 'Guided Yoga', duration: '20 min', completed: true },
      energy: { level: 'Moderate', score: 6.0 },
      medicine: [{ name: 'Amoxicillin 500mg', taken: true, time: '08:30' }],
      summaryNote: 'Yoga completed. Sleep rest 1h 15m below 14-day baseline.'
    },
    {
      dayName: 'SATURDAY',
      dateFormatted: '13 SEP 2026',
      isToday: false,
      hasDrift: true,
      sleep: { durationText: '6h 15m', efficiencyPercent: 82, bedtime: '00:15', isBelowBaseline: true },
      activity: { stepsCount: 5200, distanceKm: '3.8 km', isBelowBaseline: true },
      hydration: { waterMl: 1800, isBelowBaseline: false },
      nutrition: { mealCount: 3, calories: 1950, dinnerTime: '21:15', isShifted: true },
      workout: { type: 'Bodyweight Squats', duration: '25 min', completed: true },
      energy: { level: 'Moderate', score: 6.5 },
      medicine: [{ name: 'Amoxicillin 500mg', taken: true, time: '08:30' }],
      summaryNote: 'First evening dinner time shift logged.'
    },
    {
      dayName: 'FRIDAY',
      dateFormatted: '12 SEP 2026',
      isToday: false,
      hasDrift: false,
      sleep: { durationText: '7h 35m', efficiencyPercent: 90, bedtime: '23:15', isBelowBaseline: false },
      activity: { stepsCount: 7800, distanceKm: '5.8 km', isBelowBaseline: false },
      hydration: { waterMl: 2200, isBelowBaseline: false },
      nutrition: { mealCount: 3, calories: 2100, dinnerTime: '20:15', isShifted: false },
      workout: { type: 'Outdoor Run', duration: '45 min', completed: true },
      energy: { level: 'High', score: 8.8 },
      medicine: [{ name: 'Amoxicillin 500mg', taken: true, time: '08:30' }],
      summaryNote: 'Baseline alignment strong across all 6 telemetry signals.'
    },
    {
      dayName: 'THURSDAY',
      dateFormatted: '11 SEP 2026',
      isToday: false,
      hasDrift: false,
      sleep: { durationText: '7h 20m', efficiencyPercent: 88, bedtime: '23:20', isBelowBaseline: false },
      activity: { stepsCount: 7100, distanceKm: '5.2 km', isBelowBaseline: false },
      hydration: { waterMl: 2100, isBelowBaseline: false },
      nutrition: { mealCount: 3, calories: 1980, dinnerTime: '20:30', isShifted: false },
      workout: { type: 'Dumbbell Curls', duration: '30 min', completed: true },
      energy: { level: 'High', score: 8.4 },
      medicine: [{ name: 'Multivitamin', taken: true, time: '09:00' }],
      summaryNote: 'Consistent evening meal and workout load.'
    },
    {
      dayName: 'WEDNESDAY',
      dateFormatted: '10 SEP 2026',
      isToday: false,
      hasDrift: false,
      sleep: { durationText: '7h 40m', efficiencyPercent: 91, bedtime: '23:10', isBelowBaseline: false },
      activity: { stepsCount: 8200, distanceKm: '6.1 km', isBelowBaseline: false },
      hydration: { waterMl: 2400, isBelowBaseline: false },
      nutrition: { mealCount: 3, calories: 2250, dinnerTime: '20:15', isShifted: false },
      workout: { type: 'Guided Yoga', duration: '20 min', completed: true },
      energy: { level: 'High', score: 8.9 },
      medicine: [{ name: 'Multivitamin', taken: true, time: '09:00' }],
      summaryNote: 'Optimal recovery score and hydration logged.'
    },
    {
      dayName: 'TUESDAY',
      dateFormatted: '09 SEP 2026',
      isToday: false,
      hasDrift: false,
      sleep: { durationText: '7h 25m', efficiencyPercent: 89, bedtime: '23:15', isBelowBaseline: false },
      activity: { stepsCount: 6900, distanceKm: '5.0 km', isBelowBaseline: false },
      hydration: { waterMl: 2150, isBelowBaseline: false },
      nutrition: { mealCount: 3, calories: 1900, dinnerTime: '20:20', isShifted: false },
      workout: { type: 'Walking Lunges', duration: '30 min', completed: true },
      energy: { level: 'High', score: 8.3 },
      medicine: [{ name: 'Multivitamin', taken: true, time: '09:00' }],
      summaryNote: 'Normal baseline pattern window.'
    }
  ]
};

export class HealthReplayService {
  public getReplayData(timeframe: '7 DAYS' | '14 DAYS' | '30 DAYS' = '7 DAYS'): ReplayTimeframeData {
    try {
      const stored = localStorage.getItem(`${REPLAY_STORAGE_KEY}_${timeframe}`);
      if (!stored) {
        localStorage.setItem(`${REPLAY_STORAGE_KEY}_${timeframe}`, JSON.stringify(MOCK_REPLAY_7_DAYS));
        return MOCK_REPLAY_7_DAYS;
      }
      return JSON.parse(stored);
    } catch {
      return MOCK_REPLAY_7_DAYS;
    }
  }
}

export const healthReplayService = new HealthReplayService();
