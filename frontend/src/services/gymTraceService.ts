// gymTraceService.ts - Service & Storage for GYMTRACE movement tracking & rep counting

export interface GymExercise {
  id: string;
  name: string;
  category: 'Legs' | 'Push' | 'Pull' | 'Arms' | 'Full Body';
  targetMuscleGroup: string;
  defaultWeightKg: number;
  defaultTargetReps: number;
  defaultTargetSets: number;
  formTips: string[];
}

export interface GymWorkoutRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setsCompleted: number;
  repsPerSet: number;
  weightKg: number;
  totalVolumeKg: number; // weightKg * repsPerSet * setsCompleted
  durationSeconds: number;
  formAccuracyScore: number; // 0 to 100%
  sessionDate: string;
  timeFormatted: string;
  caloriesBurned: number;
  formFeedbackNotes: string[];
  isVisionTracked: boolean;
}

export const SUPPORTED_EXERCISES: GymExercise[] = [
  {
    id: 'squat',
    name: 'Bodyweight / Barbell Squat',
    category: 'Legs',
    targetMuscleGroup: 'Quadriceps, Glutes & Core',
    defaultWeightKg: 40,
    defaultTargetReps: 10,
    defaultTargetSets: 3,
    formTips: ['Keep knees aligned over toes', 'Hinge hips backward', 'Maintain neutral lumbar spine']
  },
  {
    id: 'pushup',
    name: 'Standard Push-Up',
    category: 'Push',
    targetMuscleGroup: 'Pectorals, Anterior Deltoids & Triceps',
    defaultWeightKg: 0,
    defaultTargetReps: 15,
    defaultTargetSets: 3,
    formTips: ['Keep core engaged in rigid plank line', 'Lower chest to elbow depth (90°)', 'Avoid sagging hips']
  },
  {
    id: 'lunges',
    name: 'Walking Forward Lunges',
    category: 'Legs',
    targetMuscleGroup: 'Quads, Hamstrings & Glutes',
    defaultWeightKg: 20,
    defaultTargetReps: 12,
    defaultTargetSets: 3,
    formTips: ['Step forward to 90° knee angle', 'Keep torso upright', 'Do not let front knee collapse inward']
  },
  {
    id: 'bicep-curl',
    name: 'Dumbbell Bicep Curl',
    category: 'Arms',
    targetMuscleGroup: 'Biceps Brachii',
    defaultWeightKg: 12,
    defaultTargetReps: 12,
    defaultTargetSets: 3,
    formTips: ['Keep elbows pinned to ribcage', 'Full extension at bottom', 'Squeeze biceps at top of flexion']
  },
  {
    id: 'overhead-press',
    name: 'Dumbbell Overhead Press',
    category: 'Push',
    targetMuscleGroup: 'Deltoids & Upper Chest',
    defaultWeightKg: 16,
    defaultTargetReps: 10,
    defaultTargetSets: 3,
    formTips: ['Press weights overhead without arching back', 'Lock out arms vertically over shoulders']
  }
];

const GYM_STORAGE_KEY = 'liviq_gymtrace_history_v1';

const DEFAULT_WORKOUTS: GymWorkoutRecord[] = [
  {
    id: 'gym-def-1',
    exerciseId: 'squat',
    exerciseName: 'Bodyweight / Barbell Squat',
    setsCompleted: 3,
    repsPerSet: 10,
    weightKg: 50,
    totalVolumeKg: 1500,
    durationSeconds: 420,
    formAccuracyScore: 92,
    sessionDate: new Date().toISOString(),
    timeFormatted: '18:00',
    caloriesBurned: 180,
    formFeedbackNotes: ['Knee alignment maintained', 'Good depth reached', 'Controlled eccentric speed'],
    isVisionTracked: true
  },
  {
    id: 'gym-def-2',
    exerciseId: 'bicep-curl',
    exerciseName: 'Dumbbell Bicep Curl',
    setsCompleted: 3,
    repsPerSet: 12,
    weightKg: 14,
    totalVolumeKg: 504,
    durationSeconds: 300,
    formAccuracyScore: 95,
    sessionDate: new Date(Date.now() - 86400000).toISOString(),
    timeFormatted: '17:30',
    caloriesBurned: 110,
    formFeedbackNotes: ['Full extension reached', 'Controlled movement'],
    isVisionTracked: true
  }
];

export class GymTraceService {
  public getHistory(): GymWorkoutRecord[] {
    try {
      const stored = localStorage.getItem(GYM_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(GYM_STORAGE_KEY, JSON.stringify(DEFAULT_WORKOUTS));
        return DEFAULT_WORKOUTS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_WORKOUTS;
    }
  }

  public saveWorkout(workout: Omit<GymWorkoutRecord, 'id'>): GymWorkoutRecord {
    const history = this.getHistory();
    const newRecord: GymWorkoutRecord = {
      ...workout,
      id: `gym-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    const updated = [newRecord, ...history];
    localStorage.setItem(GYM_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch event to sync with HEALTRACE continuous timeline
    window.dispatchEvent(new CustomEvent('gymtrace-workout-logged', { detail: newRecord }));
    return newRecord;
  }

  public getStats() {
    const history = this.getHistory();
    const totalWorkouts = history.length;
    const totalVolumeKg = history.reduce((acc, w) => acc + w.totalVolumeKg, 0);
    const totalCalories = history.reduce((acc, w) => acc + w.caloriesBurned, 0);
    const avgScore = totalWorkouts > 0
      ? Math.round(history.reduce((acc, w) => acc + w.formAccuracyScore, 0) / totalWorkouts)
      : 0;

    return { totalWorkouts, totalVolumeKg, totalCalories, avgScore };
  }
}

export const gymTraceService = new GymTraceService();
