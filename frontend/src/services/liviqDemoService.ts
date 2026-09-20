// liviqDemoService.ts - Preloaded Controlled Data & State Engine for Hackathon Demo Mode

export interface DemoStep {
  id: number;
  key: 'INSIGHT' | 'MEDSURE' | 'HEALTRACE' | 'HEALTH_REPLAY';
  title: string;
  voiceTrigger: string;
  subtitle: string;
  badge: string;
  duration: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    key: 'INSIGHT',
    title: 'INSIGHT — Emergency Response Intelligence',
    voiceTrigger: 'Scan this accident.',
    subtitle: 'Incident computer vision, location locking, facility selection & Speak for Me',
    badge: 'DEMO 1',
    duration: '1.5 min'
  },
  {
    id: 2,
    key: 'MEDSURE',
    title: 'MEDSURE — Medicine Understanding & Safety',
    voiceTrigger: 'Scan this medicine and explain it in Telugu.',
    subtitle: 'Label OCR, expiry check, warnings & multi-lingual Telugu speech',
    badge: 'DEMO 2',
    duration: '1.5 min'
  },
  {
    id: 3,
    key: 'HEALTRACE',
    title: 'HEALTRACE — Pose Estimation & Hydration Logging',
    voiceTrigger: 'Start yoga. / I drank 500 ml water.',
    subtitle: 'MediaPipe pose canvas, hold countdown timer, voice hydration update',
    badge: 'DEMO 3',
    duration: '1.5 min'
  },
  {
    id: 4,
    key: 'HEALTH_REPLAY',
    title: 'HEALTH REPLAY — Personal Baseline & Health Drift',
    voiceTrigger: 'Replay my last 7 days.',
    subtitle: 'Unified timeline, rolling baseline, Health Drift & 7-day pattern reconstruction',
    badge: 'DEMO 4',
    duration: '1.5 min'
  }
];

export interface InsightDemoData {
  incidentType: string;
  severity: string;
  observations: string[];
  location: { lat: number; lng: number; address: string };
  facility: { name: string; distance: string; eta: string; phone: string };
  speakForMeText: { en: string; hi: string };
}

export interface MedSureDemoData {
  medicineName: string;
  dosage: string;
  manufacturer: string;
  batchNo: string;
  expiryDate: string;
  confidence: number;
  warnings: string[];
  teluguExplanationText: string;
}

export interface HealTraceDemoData {
  poseName: string;
  targetHoldSeconds: number;
  jointAngles: { hipAngle: number; kneeAngle: number; shoulderAngle: number };
  waterProgressBefore: number;
  waterAdded: number;
  waterProgressAfter: number;
}

export interface ReplayDemoData {
  personalBaseline: { sleep: string; water: string; activity: string; workout: string };
  healthDrift: { status: string; metric: string; description: string };
  weeklyReplay: Array<{ day: string; sleep: string; activity: string; water: string; energy: string; notes: string }>;
  suggestedAction: string;
}

export class LiviqDemoService {
  private isOfflineForforced: boolean = true;

  public setForcedOffline(status: boolean): void {
    this.isOfflineForforced = status;
    window.dispatchEvent(new CustomEvent('liviq-demo-offline-changed', { detail: status }));
  }

  public getForcedOffline(): boolean {
    return this.isOfflineForforced;
  }

  public getInsightData(): InsightDemoData {
    return {
      incidentType: 'Roadside Vehicle Collision & Impact',
      severity: 'HIGH (Urgent Triage Required)',
      observations: [
        'Vehicle front bumper structural deformation detected',
        'Liquid leak on pavement surface observed',
        '2 individuals standing safely on adjacent sidewalk',
        'No active smoke or fire flame signatures'
      ],
      location: {
        lat: 17.4451,
        lng: 78.3792,
        address: 'Cyber Towers Main Junction, HITEC City, Hyderabad, 500081'
      },
      facility: {
        name: 'KIMS Hospitals Emergency & Trauma Care Unit',
        distance: '0.8 km',
        eta: '3 mins via Emergency Direct Route',
        phone: '108 / +91-40-44885000'
      },
      speakForMeText: {
        en: 'Emergency request: Vehicle collision reported at Cyber Towers Junction, HITEC City. 2 persons present. Please dispatch ambulance service.',
        hi: 'आपत्कालीन अनुरोध: साइबर टावर्स जंक्शन, हाईटेक सिटी में वाहन दुर्घटना की सूचना मिली है। कृपया एम्बुलेंस भेजें।'
      }
    };
  }

  public getMedSureData(): MedSureDemoData {
    return {
      medicineName: 'Amoxicillin Trihydrate',
      dosage: '500 mg Capsule',
      manufacturer: 'Cipla Healthcare Ltd.',
      batchNo: 'LOT #AMX-2026-88',
      expiryDate: 'DEC 2027 (VERIFIED VALID)',
      confidence: 98.4,
      warnings: [
        'Complete the full prescribed course even if symptoms resolve early.',
        'Take with or after food to minimize stomach discomfort.',
        'Do not take if you have a known severe penicillin allergy.'
      ],
      teluguExplanationText: 'అమోక్సిసిలిన్ బాక్టీరియా ఇన్ఫెక్షన్ల చికిత్సకు ఉపయోగించే యాంటీబయాటిక్. దయచేసి మీ వైద్యుడు సూచించిన పూర్తి కోర్సును కొనసాగించండి. దీనిని ఆహారంతో పాటు తీసుకోండి.'
    };
  }

  public getHealTraceData(): HealTraceDemoData {
    return {
      poseName: 'Vrikshasana (Tree Pose)',
      targetHoldSeconds: 10,
      jointAngles: { hipAngle: 89, kneeAngle: 174, shoulderAngle: 178 },
      waterProgressBefore: 1.6,
      waterAdded: 0.5,
      waterProgressAfter: 2.1
    };
  }

  public getReplayData(): ReplayDemoData {
    return {
      personalBaseline: {
        sleep: '7h 20m',
        water: '2.1L',
        activity: '6,800 steps',
        workout: '3 sessions/week'
      },
      healthDrift: {
        status: 'BELOW BASELINE',
        metric: 'Sleep & Activity',
        description: 'Over the last 3 days, sleep (5h 50m) and activity (4,100 steps) were below your recent baseline pattern.'
      },
      weeklyReplay: [
        { day: 'MON', sleep: '7h 30m', activity: '7,200 steps', water: '2.2L', energy: 'High', notes: 'Gym workout completed' },
        { day: 'TUE', sleep: '7h 15m', activity: '6,900 steps', water: '2.1L', energy: 'Normal', notes: 'Yoga morning session' },
        { day: 'WED', sleep: '7h 10m', activity: '6,600 steps', water: '2.0L', energy: 'Normal', notes: 'Hydration target met' },
        { day: 'THU', sleep: '5h 50m', activity: '4,200 steps', water: '1.6L', energy: 'Low', notes: 'Late night project work' },
        { day: 'FRI', sleep: '5h 45m', activity: '4,000 steps', water: '1.5L', energy: 'Low', notes: 'Reported fatigue' },
        { day: 'SAT', sleep: '6h 00m', activity: '4,100 steps', water: '1.7L', energy: 'Moderate', notes: 'Light walking' },
        { day: 'SUN', sleep: '6h 10m', activity: '4,300 steps', water: '1.8L', energy: 'Moderate', notes: 'Rest day' }
      ],
      suggestedAction: 'Return toward your usual sleep schedule (7h 20m) and activity level (6,800 steps), then continue tracking.'
    };
  }
}

export const liviqDemoService = new LiviqDemoService();
