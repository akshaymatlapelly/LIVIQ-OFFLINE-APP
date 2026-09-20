// foodTraceService.ts - Service adapter & storage for LIVIQ FoodTrace
// Modular architecture supporting local mock database initially, designed for seamless replacement with USDA / Nutritionix APIs later.

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface MacroBreakdown {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;  // in grams
}

export interface LoggedMeal {
  id: string;
  name: string;
  mealType: MealType;
  portion: string;
  portionGrams: number;
  macros: MacroBreakdown;
  glycemicIndex: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number; // 0.0 to 1.0
  isEstimate: boolean;
  timeFormatted: string; // e.g., "14:00"
  dateFormatted: string; // e.g., "2026-09-15"
  notes?: string;
  imageUrl?: string;
}

export interface FoodScanResult {
  recognizedFood: string;
  category: MealType;
  estimatedPortion: string;
  portionGrams: number;
  estimatedMacros: MacroBreakdown;
  confidenceScore: number;
  glycemicIndex: 'LOW' | 'MEDIUM' | 'HIGH';
  alternativeMatches: string[];
  disclaimer: string;
}

// Interface for external nutrition provider (allows easy swap to external API later)
export interface INutritionDatabaseProvider {
  scanFoodImage(imageData: string): Promise<FoodScanResult>;
  searchFood(query: string): Promise<LoggedMeal[]>;
}

// Local Mock Nutrition Database & AI Vision Simulator
class LocalMockNutritionProvider implements INutritionDatabaseProvider {
  private mockDatabase: Array<Omit<FoodScanResult, 'disclaimer'>> = [
    {
      recognizedFood: 'Avocado & Egg Sourdough Toast',
      category: 'Breakfast',
      estimatedPortion: '2 slices (280g)',
      portionGrams: 280,
      estimatedMacros: { calories: 420, protein: 16, carbs: 38, fat: 22, fiber: 9 },
      confidenceScore: 0.94,
      glycemicIndex: 'LOW',
      alternativeMatches: ['Poached Egg Toast', 'Guacamole Bread', 'Breakfast Sandwich']
    },
    {
      recognizedFood: 'Grilled Chicken & Brown Rice Bowl',
      category: 'Lunch',
      estimatedPortion: '1 medium bowl (420g)',
      portionGrams: 420,
      estimatedMacros: { calories: 580, protein: 44, carbs: 62, fat: 14, fiber: 7 },
      confidenceScore: 0.91,
      glycemicIndex: 'LOW',
      alternativeMatches: ['Chicken Quinoa Bowl', 'Teriyaki Chicken Rice', 'Turkey Rice Plate']
    },
    {
      recognizedFood: 'Pan-Seared Salmon & Asparagus',
      category: 'Dinner',
      estimatedPortion: '1 fillet + greens (350g)',
      portionGrams: 350,
      estimatedMacros: { calories: 510, protein: 42, carbs: 12, fat: 32, fiber: 5 },
      confidenceScore: 0.96,
      glycemicIndex: 'LOW',
      alternativeMatches: ['Grilled Trout', 'Baked Salmon Salad', 'Seafood Medley']
    },
    {
      recognizedFood: 'Greek Yogurt Berry Parfait',
      category: 'Snack',
      estimatedPortion: '1 cup (220g)',
      portionGrams: 220,
      estimatedMacros: { calories: 240, protein: 18, carbs: 28, fat: 6, fiber: 4 },
      confidenceScore: 0.89,
      glycemicIndex: 'LOW',
      alternativeMatches: ['Berry Smoothie Bowl', 'Mixed Berry Yogurt', 'Chia Seed Pudding']
    },
    {
      recognizedFood: 'Masala Dosa with Vegetable Sambhar',
      category: 'Breakfast',
      estimatedPortion: '1 dosa + 150ml sambhar (320g)',
      portionGrams: 320,
      estimatedMacros: { calories: 460, protein: 11, carbs: 68, fat: 16, fiber: 8 },
      confidenceScore: 0.93,
      glycemicIndex: 'MEDIUM',
      alternativeMatches: ['Plain Dosa', 'Rava Dosa', 'Uttapam']
    }
  ];

  async scanFoodImage(_imageData: string): Promise<FoodScanResult> {
    // Simulate vision processing latency
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Pick a mock result probabilistically or sequentially
    const randomPick = this.mockDatabase[Math.floor(Math.random() * this.mockDatabase.length)];
    return {
      ...randomPick,
      disclaimer: 'Nutritional metrics are AI-assisted estimates based on visual volume recognition. Values may vary by preparation and ingredients.'
    };
  }

  async searchFood(query: string): Promise<LoggedMeal[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const lower = query.toLowerCase();
    const matches = this.mockDatabase.filter(item => item.recognizedFood.toLowerCase().includes(lower));

    return matches.map((m, index) => ({
      id: `search-res-${index}-${Date.now()}`,
      name: m.recognizedFood,
      mealType: m.category,
      portion: m.estimatedPortion,
      portionGrams: m.portionGrams,
      macros: m.estimatedMacros,
      glycemicIndex: m.glycemicIndex,
      confidenceScore: m.confidenceScore,
      isEstimate: true,
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      dateFormatted: new Date().toISOString().split('T')[0]
    }));
  }
}

// Default Storage Service
const LOCAL_STORAGE_KEY = 'liviq_foodtrace_logged_meals';

const DEFAULT_MEALS: LoggedMeal[] = [
  {
    id: 'meal-def-1',
    name: 'High-Protein Oats & Fresh Berries',
    mealType: 'Breakfast',
    portion: '1 bowl (300g)',
    portionGrams: 300,
    macros: { calories: 450, protein: 22, carbs: 64, fat: 10, fiber: 9 },
    glycemicIndex: 'LOW',
    confidenceScore: 0.95,
    isEstimate: true,
    timeFormatted: '08:30',
    dateFormatted: new Date().toISOString().split('T')[0],
    notes: 'Logged via FoodTrace vision scan'
  },
  {
    id: 'meal-def-2',
    name: 'Grilled Chicken Salad & Quinoa',
    mealType: 'Lunch',
    portion: '1 plate (400g)',
    portionGrams: 400,
    macros: { calories: 650, protein: 48, carbs: 55, fat: 20, fiber: 8 },
    glycemicIndex: 'LOW',
    confidenceScore: 0.92,
    isEstimate: true,
    timeFormatted: '14:00',
    dateFormatted: new Date().toISOString().split('T')[0],
    notes: 'Added extra olive oil dressing'
  }
];

export class FoodTraceService {
  private provider: INutritionDatabaseProvider;

  constructor(provider?: INutritionDatabaseProvider) {
    this.provider = provider || new LocalMockNutritionProvider();
  }

  // Get all logged meals from local storage (or defaults)
  public getLoggedMeals(): LoggedMeal[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_MEALS));
        return DEFAULT_MEALS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_MEALS;
    }
  }

  // Save new meal
  public logMeal(meal: Omit<LoggedMeal, 'id'>): LoggedMeal {
    const meals = this.getLoggedMeals();
    const newMeal: LoggedMeal = {
      ...meal,
      id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    const updated = [newMeal, ...meals];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Also dispatch a custom window event so HEALTRACE components update dynamically
    window.dispatchEvent(new CustomEvent('foodtrace-meal-logged', { detail: newMeal }));
    return newMeal;
  }

  // Edit existing meal
  public updateMeal(id: string, updatedFields: Partial<LoggedMeal>): LoggedMeal | null {
    const meals = this.getLoggedMeals();
    const index = meals.findIndex(m => m.id === id);
    if (index === -1) return null;

    meals[index] = { ...meals[index], ...updatedFields };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meals));
    window.dispatchEvent(new CustomEvent('foodtrace-meal-updated', { detail: meals[index] }));
    return meals[index];
  }

  // Delete meal
  public deleteMeal(id: string): void {
    const meals = this.getLoggedMeals();
    const filtered = meals.filter(m => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('foodtrace-meal-deleted', { detail: id }));
  }

  // Get today's total macros
  public getTodayTotals(): { calories: number; protein: number; carbs: number; fat: number; mealCount: number } {
    const meals = this.getLoggedMeals();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMeals = meals.filter(m => m.dateFormatted === todayStr);

    return todayMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.macros.calories,
        protein: acc.protein + m.macros.protein,
        carbs: acc.carbs + m.macros.carbs,
        fat: acc.fat + m.macros.fat,
        mealCount: acc.mealCount + 1
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 }
    );
  }

  // Vision scan helper using active provider
  public async scanFood(imageData: string): Promise<FoodScanResult> {
    return this.provider.scanFoodImage(imageData);
  }
}

export const foodTraceService = new FoodTraceService();
