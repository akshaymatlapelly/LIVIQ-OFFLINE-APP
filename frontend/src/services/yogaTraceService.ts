// yogaTraceService.ts - Service & Storage Engine for YOGATRACE pose detection

export interface TargetAngleConfig {
  kneeAngle?: number;    // Target knee angle in degrees (e.g., 90 for Warrior II)
  backAngle?: number;    // Target back angle in degrees (e.g., 90 for vertical)
  armAngle?: number;     // Target arm extension in degrees (e.g., 180 for horizontal)
  hipAngle?: number;     // Target hip flex angle
}

export interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetHoldSeconds: number;
  targetAngles: TargetAngleConfig;
  instructions: string[];
  benefits: string;
  iconName: string;
}

export interface YogaSessionRecord {
  id: string;
  poseId: string;
  poseName: string;
  durationSeconds: number;
  targetHoldSeconds: number;
  holdCompletionPercent: number; // 0 to 100
  alignmentScore: number;         // 0 to 100
  sessionDate: string;           // ISO date string
  timeFormatted: string;         // "18:00"
  caloriesBurned: number;
  feedbackGiven: string[];
  completedFully: boolean;
}

export const SUPPORTED_POSES: YogaPose[] = [
  {
    id: 'warrior-2',
    name: 'Warrior II',
    sanskritName: 'Virabhadrasana II',
    difficulty: 'Beginner',
    targetHoldSeconds: 30,
    targetAngles: { kneeAngle: 90, backAngle: 90, armAngle: 180 },
    instructions: [
      'Step feet wide, turn right foot out 90 degrees.',
      'Bend right knee directly over ankle to a 90-degree angle.',
      'Extend arms parallel to floor, shoulders relaxed over hips.',
      'Keep back torso upright and gaze over front fingertips.'
    ],
    benefits: 'Strengthens legs, stretches hips/chest, improves postural stability.',
    iconName: 'Flame'
  },
  {
    id: 'tree-pose',
    name: 'Tree Pose',
    sanskritName: 'Vrksasana',
    difficulty: 'Beginner',
    targetHoldSeconds: 25,
    targetAngles: { kneeAngle: 45, backAngle: 90, armAngle: 170 },
    instructions: [
      'Shift weight onto left foot, root down through heel.',
      'Place right foot sole against left inner thigh or calf.',
      'Bring palms together at heart center or reach arms overhead.',
      'Fix gaze on a steady focal point for spatial equilibrium.'
    ],
    benefits: 'Enhances neuromuscular balance, ankle strength, and mental focus.',
    iconName: 'Sparkles'
  },
  {
    id: 'downward-dog',
    name: 'Downward-Facing Dog',
    sanskritName: 'Adho Mukha Svanasana',
    difficulty: 'Intermediate',
    targetHoldSeconds: 35,
    targetAngles: { kneeAngle: 180, backAngle: 75, armAngle: 180 },
    instructions: [
      'Start on hands and knees, align wrists under shoulders.',
      'Tuck toes, lift knees, and send hips up and back into inverted V.',
      'Press firmly through knuckles, lengthen spine away from wrists.',
      'Keep legs straight or slightly soft knee bend.'
    ],
    benefits: 'Decompresses lumbar spine, stretches hamstrings and shoulders.',
    iconName: 'Activity'
  },
  {
    id: 'cobra-pose',
    name: 'Cobra Pose',
    sanskritName: 'Bhujangasana',
    difficulty: 'Beginner',
    targetHoldSeconds: 20,
    targetAngles: { backAngle: 135, armAngle: 120 },
    instructions: [
      'Lie prone on stomach with legs extended, tops of feet flat.',
      'Place hands under shoulders, elbows hugging ribs.',
      'Inhale and lift chest off mat using back muscles.',
      'Keep lower ribs down and shoulders away from ears.'
    ],
    benefits: 'Strengthens erector spinae muscles and opens thoracic respiratory ribcage.',
    iconName: 'HeartPulse'
  },
  {
    id: 'triangle-pose',
    name: 'Triangle Pose',
    sanskritName: 'Trikonasana',
    difficulty: 'Intermediate',
    targetHoldSeconds: 30,
    targetAngles: { kneeAngle: 180, backAngle: 45, armAngle: 180 },
    instructions: [
      'Stand with feet wide apart, reach arms horizontally.',
      'Hinge sideways at right hip, bringing right hand to shin or floor.',
      'Extend left arm straight up toward ceiling.',
      'Keep both sides of waist long and neck neutral.'
    ],
    benefits: 'Stretches hamstrings, groins, and hips while strengthening core obliques.',
    iconName: 'Layers'
  }
];

const YOGA_STORAGE_KEY = 'liviq_yogatrace_history_v1';

const DEFAULT_HISTORY: YogaSessionRecord[] = [
  {
    id: 'yoga-hist-1',
    poseId: 'warrior-2',
    poseName: 'Warrior II',
    durationSeconds: 30,
    targetHoldSeconds: 30,
    holdCompletionPercent: 100,
    alignmentScore: 94,
    sessionDate: new Date().toISOString(),
    timeFormatted: '18:15',
    caloriesBurned: 45,
    feedbackGiven: ['Front knee aligned at 92°', 'Back torso perpendicular', 'Arms horizontal'],
    completedFully: true
  },
  {
    id: 'yoga-hist-2',
    poseId: 'tree-pose',
    poseName: 'Tree Pose',
    durationSeconds: 25,
    targetHoldSeconds: 25,
    holdCompletionPercent: 100,
    alignmentScore: 89,
    sessionDate: new Date(Date.now() - 86400000).toISOString(),
    timeFormatted: '07:45',
    caloriesBurned: 35,
    feedbackGiven: ['Standing leg stable', 'Core engagement steady'],
    completedFully: true
  }
];

export class YogaTraceService {
  public getHistory(): YogaSessionRecord[] {
    try {
      const stored = localStorage.getItem(YOGA_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(YOGA_STORAGE_KEY, JSON.stringify(DEFAULT_HISTORY));
        return DEFAULT_HISTORY;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_HISTORY;
    }
  }

  public saveSession(session: Omit<YogaSessionRecord, 'id'>): YogaSessionRecord {
    const history = this.getHistory();
    const newRecord: YogaSessionRecord = {
      ...session,
      id: `yoga-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    const updated = [newRecord, ...history];
    localStorage.setItem(YOGA_STORAGE_KEY, JSON.stringify(updated));

    // Notify listeners
    window.dispatchEvent(new CustomEvent('yogatrace-session-saved', { detail: newRecord }));
    return newRecord;
  }

  public getStats() {
    const history = this.getHistory();
    const totalSessions = history.length;
    const totalMinutes = Math.round(history.reduce((acc, s) => acc + s.durationSeconds, 0) / 60);
    const avgScore = totalSessions > 0
      ? Math.round(history.reduce((acc, s) => acc + s.alignmentScore, 0) / totalSessions)
      : 0;

    return { totalSessions, totalMinutes, avgScore };
  }
}

export const yogaTraceService = new YogaTraceService();
