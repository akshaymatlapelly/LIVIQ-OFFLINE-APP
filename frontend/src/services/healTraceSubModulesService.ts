// healTraceSubModulesService.ts - Storage & Telemetry Service for SLEEPTRACE, HYDRATETRACE, and ACTIVITYTRACE

// --- 1. SLEEPTRACE TYPES ---
export interface SleepRecord {
  id: string;
  sleepStart: string; // e.g., "23:15"
  wakeTime: string;   // e.g., "07:00"
  durationMinutes: number; // e.g., 465 (7h 45m)
  efficiencyPercent: number; // e.g., 88%
  deepSleepPercent: number;  // e.g., 22%
  remSleepPercent: number;   // e.g., 25%
  lightSleepPercent: number; // e.g., 45%
  awakeMinutes: number;      // e.g., 38m
  consistencyScore: number;  // e.g., 91%
  dateFormatted: string;     // YYYY-MM-DD
}

// --- 2. HYDRATETRACE TYPES ---
export interface WaterLogEntry {
  id: string;
  amountMl: number;
  containerType: 'Glass' | 'Cup' | 'Bottle' | 'Sports Flask' | 'Voice Command';
  timeFormatted: string; // e.g., "12:30"
  dateFormatted: string; // YYYY-MM-DD
}

// --- 3. ACTIVITYTRACE TYPES ---
export interface ActivityRecord {
  id: string;
  stepsCount: number;
  distanceKm: number;
  caloriesBurned: number;
  activeMinutes: number;
  sedentaryHours: number;
  dataSource: 'iQOO On-Device Accelerometer' | 'Pedestrian Dead Reckoning (PDR)' | 'BLE Smartwatch Sync';
  dateFormatted: string;
  hourlyStepDistribution: number[]; // 24-hour steps array
}

// --- STORAGE KEYS ---
const SLEEP_STORAGE_KEY = 'liviq_sleeptrace_history_v1';
const HYDRATE_STORAGE_KEY = 'liviq_hydratetrace_history_v1';
const ACTIVITY_STORAGE_KEY = 'liviq_activitytrace_history_v1';

// DEFAULT DATASETS
const DEFAULT_SLEEP: SleepRecord[] = [
  {
    id: 'sleep-def-1',
    sleepStart: '23:15',
    wakeTime: '07:00',
    durationMinutes: 465,
    efficiencyPercent: 88,
    deepSleepPercent: 24,
    remSleepPercent: 26,
    lightSleepPercent: 42,
    awakeMinutes: 35,
    consistencyScore: 92,
    dateFormatted: new Date().toISOString().split('T')[0]
  },
  {
    id: 'sleep-def-2',
    sleepStart: '23:45',
    wakeTime: '07:15',
    durationMinutes: 450,
    efficiencyPercent: 85,
    deepSleepPercent: 20,
    remSleepPercent: 25,
    lightSleepPercent: 45,
    awakeMinutes: 40,
    consistencyScore: 88,
    dateFormatted: new Date(Date.now() - 86400000).toISOString().split('T')[0]
  }
];

const DEFAULT_HYDRATE: WaterLogEntry[] = [
  {
    id: 'h-def-1',
    amountMl: 500,
    containerType: 'Bottle',
    timeFormatted: '08:30',
    dateFormatted: new Date().toISOString().split('T')[0]
  },
  {
    id: 'h-def-2',
    amountMl: 250,
    containerType: 'Cup',
    timeFormatted: '10:15',
    dateFormatted: new Date().toISOString().split('T')[0]
  },
  {
    id: 'h-def-3',
    amountMl: 500,
    containerType: 'Voice Command',
    timeFormatted: '12:30',
    dateFormatted: new Date().toISOString().split('T')[0]
  },
  {
    id: 'h-def-4',
    amountMl: 500,
    containerType: 'Bottle',
    timeFormatted: '15:45',
    dateFormatted: new Date().toISOString().split('T')[0]
  }
];

const DEFAULT_ACTIVITY: ActivityRecord = {
  id: 'act-def-1',
  stepsCount: 8420,
  distanceKm: 6.2,
  caloriesBurned: 480,
  activeMinutes: 65,
  sedentaryHours: 4.5,
  dataSource: 'iQOO On-Device Accelerometer',
  dateFormatted: new Date().toISOString().split('T')[0],
  hourlyStepDistribution: [0, 0, 0, 0, 0, 0, 0, 400, 1200, 800, 2100, 600, 950, 450, 620, 800, 500, 0, 0, 0, 0, 0, 0, 0]
};

export class HealTraceSubModulesService {
  // --- SLEEPTRACE METHODS ---
  public getSleepHistory(): SleepRecord[] {
    try {
      const stored = localStorage.getItem(SLEEP_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(SLEEP_STORAGE_KEY, JSON.stringify(DEFAULT_SLEEP));
        return DEFAULT_SLEEP;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SLEEP;
    }
  }

  public logSleepSession(record: Omit<SleepRecord, 'id'>): SleepRecord {
    const history = this.getSleepHistory();
    const newRecord: SleepRecord = {
      ...record,
      id: `sleep-${Date.now()}`
    };
    const updated = [newRecord, ...history];
    localStorage.setItem(SLEEP_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sleeptrace-logged', { detail: newRecord }));
    return newRecord;
  }

  // --- HYDRATETRACE METHODS ---
  public getHydrateHistory(): WaterLogEntry[] {
    try {
      const stored = localStorage.getItem(HYDRATE_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(HYDRATE_STORAGE_KEY, JSON.stringify(DEFAULT_HYDRATE));
        return DEFAULT_HYDRATE;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_HYDRATE;
    }
  }

  public addWaterIntake(amountMl: number, containerType: WaterLogEntry['containerType'] = 'Bottle'): WaterLogEntry {
    const history = this.getHydrateHistory();
    const newEntry: WaterLogEntry = {
      id: `water-${Date.now()}`,
      amountMl,
      containerType,
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      dateFormatted: new Date().toISOString().split('T')[0]
    };
    const updated = [newEntry, ...history];
    localStorage.setItem(HYDRATE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hydratetrace-logged', { detail: newEntry }));
    return newEntry;
  }

  public getTodayWaterTotal(): number {
    const history = this.getHydrateHistory();
    const todayStr = new Date().toISOString().split('T')[0];
    return history
      .filter((e) => e.dateFormatted === todayStr)
      .reduce((acc, e) => acc + e.amountMl, 0);
  }

  // --- ACTIVITYTRACE METHODS ---
  public getActivityRecord(): ActivityRecord {
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(DEFAULT_ACTIVITY));
        return DEFAULT_ACTIVITY;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_ACTIVITY;
    }
  }

  public updateActivitySteps(addedSteps: number): ActivityRecord {
    const current = this.getActivityRecord();
    const updated: ActivityRecord = {
      ...current,
      stepsCount: current.stepsCount + addedSteps,
      distanceKm: Number((current.distanceKm + addedSteps * 0.00075).toFixed(2)),
      caloriesBurned: current.caloriesBurned + Math.round(addedSteps * 0.04)
    };
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('activitytrace-updated', { detail: updated }));
    return updated;
  }
}

export const healTraceSubModulesService = new HealTraceSubModulesService();
