// unifiedTimelineService.ts - Unified Permission-Based Health Timeline Service for LIVIQ
// Connects INSIGHT, MEDSURE, and HEALTRACE into one single, searchable, privacy-permissioned timeline stream.

export type EventSource = 'INSIGHT' | 'MEDSURE' | 'HEALTRACE';

export type EventCategoryFilter = 
  | 'ALL' 
  | 'FOOD' 
  | 'ACTIVITY' 
  | 'WORKOUT' 
  | 'MEDICINE' 
  | 'SLEEP' 
  | 'HYDRATION' 
  | 'INCIDENT';

export type EventType =
  | 'INCIDENT'
  | 'MEDICINE_SCAN'
  | 'MEDICINE_LOG'
  | 'FOOD'
  | 'YOGA'
  | 'GYM'
  | 'HYDRATION'
  | 'ACTIVITY'
  | 'SLEEP';

export interface UnifiedTimelineEvent {
  id: string;
  timestamp: string;      // e.g., "19:00"
  dateFormatted: string;  // e.g., "15 SEP 2026"
  type: EventType;
  categoryFilter: Exclude<EventCategoryFilter, 'ALL'>;
  source: EventSource;
  title: string;
  summary: string;
  data: Record<string, any>;
  optionalNotes?: string;
  privacyPermission: 'PERMITTED' | 'PRIVATE_GATED';
  badgeColor: string;
}

const TIMELINE_STORAGE_KEY = 'liviq_unified_permission_timeline_v1';

const DEFAULT_UNIFIED_STREAM: UnifiedTimelineEvent[] = [
  {
    id: 'tl-0800',
    timestamp: '08:00',
    dateFormatted: 'TODAY, 15 SEP 2026',
    type: 'SLEEP',
    categoryFilter: 'SLEEP',
    source: 'HEALTRACE',
    title: 'Wake & Sleep Rest Telemetry',
    summary: 'Rest duration 7h 45m (88% efficiency score). High restorative deep sleep.',
    data: { durationMinutes: 465, efficiencyPercent: 88, deepSleepPercent: 24 },
    optionalNotes: 'Woke feeling refreshed with zero alarm interruptions.',
    privacyPermission: 'PERMITTED',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
  },
  {
    id: 'tl-0830',
    timestamp: '08:30',
    dateFormatted: 'TODAY, 15 SEP 2026',
    type: 'FOOD',
    categoryFilter: 'FOOD',
    source: 'HEALTRACE',
    title: 'Breakfast Ingestion Logged',
    summary: 'High-protein oats & berries (450 kcal, 22g protein, 64g carbs).',
    data: { mealType: 'Breakfast', calories: 450, protein: 22, carbs: 64, fat: 10 },
    optionalNotes: 'Scanned via FoodTrace AI vision model.',
    privacyPermission: 'PERMITTED',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    id: 'tl-1000',
    timestamp: '10:00',
    dateFormatted: 'TODAY, 15 SEP 2026',
    type: 'ACTIVITY',
    categoryFilter: 'ACTIVITY',
    source: 'HEALTRACE',
    title: 'Morning Walk Cadence',
    summary: 'Completed 2,100 morning baseline steps (1.5 km distance).',
    data: { steps: 2100, distanceKm: 1.5, sensor: 'iQOO Accelerometer' },
    optionalNotes: 'Walking cadence 110 steps/min.',
    privacyPermission: 'PERMITTED',
    badgeColor: 'bg-lime-100 text-lime-900 border-lime-200'
  },
  {
    id: 'tl-1200',
    timestamp: '12:00',
    dateFormatted: 'TODAY, 15 SEP 2026',
    type: 'HYDRATION',
    categoryFilter: 'HYDRATION',
    source: 'HEALTRACE',
    title: 'Water Intake Logged',
    summary: '+500 ml fluid intake logged (Sports Bottle).',
    data: { amountMl: 500, container: 'Bottle', totalTodayMl: 1250 },
    optionalNotes: 'Triggered via LIVIQ voice action.',
    privacyPermission: 'PERMITTED',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200'
  },
  {
    id: 'tl-1300',
    timestamp: '13:00',
    dateFormatted: 'TODAY, 15 SEP 2026',
    type: 'FOOD',
    categoryFilter: 'FOOD',
    source: 'HEALTRACE',
    title: 'Lunch Ingestion Logged',
    summary: 'Grilled chicken salad & quinoa bowl (650 kcal, 48g protein).',
    data: { mealType: 'Lunch', calories: 650, protein: 48, carbs: 55, fat: 20 },
    optionalNotes: 'Balanced macronutrients with low glycemic impact.',
    privacyPermission: 'PERMITTED',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    id: 'tl-1800',
    timestamp: '18:00',
    dateFormatted: 'TODAY, 15 SEP 2026',
    type: 'GYM',
    categoryFilter: 'WORKOUT',
    source: 'HEALTRACE',
    title: 'Barbell Squat Session',
    summary: 'Completed 3 sets x 10 reps (50 kg load, 1,500 kg total volume).',
    data: { exercise: 'Barbell Squat', weightKg: 50, sets: 3, reps: 10, formScore: 92 },
    optionalNotes: 'GymTrace camera rep counter active.',
    privacyPermission: 'PERMITTED',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
  },
  {
    id: 'tl-1900',
    timestamp: '19:00',
    dateFormatted: 'TODAY, 15 SEP 2026',
    type: 'MEDICINE_LOG',
    categoryFilter: 'MEDICINE',
    source: 'MEDSURE',
    title: 'Amoxicillin 500mg Taken',
    summary: 'Evening prescription dose logged. Zero allergen conflict confirmed.',
    data: { medicineName: 'Amoxicillin Trihydrate', strength: '500mg', dosage: '1 capsule' },
    optionalNotes: 'Permission-gated medication log.',
    privacyPermission: 'PRIVATE_GATED',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
  },
  {
    id: 'tl-2030',
    timestamp: '20:30',
    dateFormatted: 'TODAY, 15 SEP 2026',
    type: 'FOOD',
    categoryFilter: 'FOOD',
    source: 'HEALTRACE',
    title: 'Dinner Ingestion Logged',
    summary: 'Steamed salmon & vegetables (550 kcal, 42g protein).',
    data: { mealType: 'Dinner', calories: 550, protein: 42, carbs: 12, fat: 32 },
    optionalNotes: 'On-schedule dinner timing alignment.',
    privacyPermission: 'PERMITTED',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    id: 'tl-2300',
    timestamp: '23:00',
    dateFormatted: 'TODAY, 15 SEP 2026',
    type: 'SLEEP',
    categoryFilter: 'SLEEP',
    source: 'HEALTRACE',
    title: 'Bedtime Window Start',
    summary: 'Target bedtime initiated. Circadian consistency tracking active.',
    data: { targetBedtime: '23:15', expectedWake: '07:00' },
    optionalNotes: 'Device set to night rest mode.',
    privacyPermission: 'PERMITTED',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
  },
  {
    id: 'tl-incident-1',
    timestamp: 'YESTERDAY, 14:20',
    dateFormatted: '14 SEP 2026',
    type: 'INCIDENT',
    categoryFilter: 'INCIDENT',
    source: 'INSIGHT',
    title: 'Skin Swelling Incident Framing',
    summary: 'Incident triage scanner flagged minor localized swelling. Low risk protocol assigned.',
    data: { incidentType: 'Localized Swelling', riskLevel: 'LOW', hazards: ['Minor friction'] },
    optionalNotes: 'Routed to local first-aid guidelines.',
    privacyPermission: 'PRIVATE_GATED',
    badgeColor: 'bg-red-100 text-red-900 border-red-200'
  }
];

export class UnifiedTimelineService {
  public getEvents(
    filter: EventCategoryFilter = 'ALL',
    searchQuery: string = ''
  ): UnifiedTimelineEvent[] {
    let events = this.getAllEvents();

    if (filter !== 'ALL') {
      events = events.filter((e) => e.categoryFilter === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          (e.optionalNotes && e.optionalNotes.toLowerCase().includes(q)) ||
          e.source.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q)
      );
    }

    return events;
  }

  public getAllEvents(): UnifiedTimelineEvent[] {
    try {
      const stored = localStorage.getItem(TIMELINE_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(DEFAULT_UNIFIED_STREAM));
        return DEFAULT_UNIFIED_STREAM;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_UNIFIED_STREAM;
    }
  }

  public addEvent(event: Omit<UnifiedTimelineEvent, 'id'>): UnifiedTimelineEvent {
    const events = this.getAllEvents();
    const newEvent: UnifiedTimelineEvent = {
      ...event,
      id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    const updated = [newEvent, ...events];
    localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('liviq-timeline-updated', { detail: newEvent }));
    return newEvent;
  }
}

export const unifiedTimelineService = new UnifiedTimelineService();
