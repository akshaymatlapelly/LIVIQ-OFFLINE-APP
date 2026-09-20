import React, { useState, useEffect } from 'react';
import { CameraScanner } from '../components/CameraScanner';
import { PatternInsightBanner } from '../components/PatternInsightBanner';
import { useVoiceAgent } from '../features/voice/VoiceAgentContext';
import {
  foodTraceService,
  LoggedMeal,
  FoodScanResult,
  MealType
} from '../services/foodTraceService';
import {
  Utensils,
  Sparkles,
  Camera,
  Check,
  Edit3,
  Clock,
  AlertCircle,
  ShieldCheck,
  PieChart,
  BarChart3,
  Flame,
  Apple,
  ArrowRight,
  RefreshCw,
  Plus,
  Trash2,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
  TrendingUp,
  Layers,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FoodTracePage: React.FC = () => {
  const { handleUserUtterance } = useVoiceAgent();

  // Primary State
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [todayTotals, setTodayTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 });

  // Scanner State
  const [isScanActive, setIsScanActive] = useState<boolean>(false);
  const [isProcessingScan, setIsProcessingScan] = useState<boolean>(false);
  const [currentScanResult, setCurrentScanResult] = useState<FoodScanResult | null>(null);

  // Correction & Edit Form State
  const [selectedMealType, setSelectedMealType] = useState<MealType>('Lunch');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    portion: string;
    portionGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: MealType;
  }>({
    name: '',
    portion: '',
    portionGrams: 250,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    mealType: 'Lunch'
  });

  // Manual Add Modal State
  const [showManualAdd, setShowManualAdd] = useState<boolean>(false);

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Load meals from service on mount and handle live events
  const refreshMeals = () => {
    const meals = foodTraceService.getLoggedMeals();
    setLoggedMeals(meals);
    setTodayTotals(foodTraceService.getTodayTotals());
  };

  useEffect(() => {
    refreshMeals();
    const handleLogEvent = () => refreshMeals();
    window.addEventListener('foodtrace-meal-logged', handleLogEvent);
    window.addEventListener('foodtrace-meal-updated', handleLogEvent);
    window.addEventListener('foodtrace-meal-deleted', handleLogEvent);
    return () => {
      window.removeEventListener('foodtrace-meal-logged', handleLogEvent);
      window.removeEventListener('foodtrace-meal-updated', handleLogEvent);
      window.removeEventListener('foodtrace-meal-deleted', handleLogEvent);
    };
  }, []);

  // Handle Food Scanner Capture
  const handleCaptureFood = async (capturedImageBase64?: string) => {
    setIsProcessingScan(true);
    setCurrentScanResult(null);

    try {
      const result = await foodTraceService.scanFood(capturedImageBase64 || 'mock_base64');
      setCurrentScanResult(result);
      setSelectedMealType(result.category);

      // Pre-fill edit form
      setEditFormData({
        name: result.recognizedFood,
        portion: result.estimatedPortion,
        portionGrams: result.portionGrams,
        calories: result.estimatedMacros.calories,
        protein: result.estimatedMacros.protein,
        carbs: result.estimatedMacros.carbs,
        fat: result.estimatedMacros.fat,
        mealType: result.category
      });
    } catch (err) {
      showToast('Vision scan failed. Please try again or use manual log.');
    } finally {
      setIsProcessingScan(false);
    }
  };

  // Confirm Recognized Meal (User clicks YES)
  const handleConfirmScanMeal = () => {
    if (!currentScanResult) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateStr = new Date().toISOString().split('T')[0];

    const newMeal = foodTraceService.logMeal({
      name: editFormData.name || currentScanResult.recognizedFood,
      mealType: selectedMealType,
      portion: editFormData.portion || currentScanResult.estimatedPortion,
      portionGrams: editFormData.portionGrams || currentScanResult.portionGrams,
      macros: {
        calories: editFormData.calories || currentScanResult.estimatedMacros.calories,
        protein: editFormData.protein || currentScanResult.estimatedMacros.protein,
        carbs: editFormData.carbs || currentScanResult.estimatedMacros.carbs,
        fat: editFormData.fat || currentScanResult.estimatedMacros.fat
      },
      glycemicIndex: currentScanResult.glycemicIndex,
      confidenceScore: currentScanResult.confidenceScore,
      isEstimate: true,
      timeFormatted: timeStr,
      dateFormatted: dateStr,
      notes: 'Logged via FoodTrace vision scanner'
    });

    setCurrentScanResult(null);
    setIsScanActive(false);
    setIsEditing(false);
    showToast(`Logged "${newMeal.name}" (${newMeal.macros.calories} kcal) to ${newMeal.mealType}!`);
  };

  // Delete meal from history
  const handleDeleteMeal = (id: string, name: string) => {
    foodTraceService.deleteMeal(id);
    showToast(`Removed "${name}" from food history.`);
  };

  // Targets
  const targetCalories = 2200;
  const targetProtein = 140; // g
  const targetCarbs = 250; // g
  const targetFat = 70; // g

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
          <span className="text-xs font-sans font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-900/40 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
              <Utensils className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>HEALTRACE SUB-MODULE • FOODTRACE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              FOODTRACE
              <span className="text-xs font-mono font-normal text-amber-400 border border-amber-400/30 px-2.5 py-1 rounded-full">
                AI Vision Telemetry
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Understand food intake and meal patterns. AI vision identifies meals, estimates macronutrients, and traces glycemic impact across your continuous HEALTRACE timeline.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setIsScanActive(true);
                setCurrentScanResult(null);
              }}
              className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans text-xs font-extrabold px-5 py-3.5 rounded-full shadow-lg flex items-center gap-2 transition transform hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>SCAN MEAL (AI VISION)</span>
            </button>

            <Link
              to="/healtrace"
              className="bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold px-4 py-3.5 rounded-full border border-white/20 flex items-center gap-2 transition"
            >
              <Layers className="w-4 h-4 text-[#A3E635]" />
              <span>HEALTRACE MAIN</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Non-Medical Disclaimer Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-800 text-xs font-sans">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Estimates Notice:</span> FoodTrace uses automated computer vision and local nutrition database models. Nutritional values (calories, protein, carbs, fats) are strictly <span className="underline font-bold">ESTIMATES</span> for personal lifestyle pattern recognition and do not constitute medical-grade nutrition therapy or diagnostic data.
        </div>
      </div>

      {/* TODAY'S MACRO & CALORIC INTAKE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>CALORIES LOGGED</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {todayTotals.calories}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">/ {targetCalories} kcal</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayTotals.calories / targetCalories) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>PROTEIN</span>
            <span className="text-xs font-bold text-emerald-600">30% Target</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {todayTotals.protein}g{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">/ {targetProtein}g</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayTotals.protein / targetProtein) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>CARBOHYDRATES</span>
            <span className="text-xs font-bold text-blue-600">45% Target</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {todayTotals.carbs}g{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">/ {targetCarbs}g</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayTotals.carbs / targetCarbs) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>FATS</span>
            <span className="text-xs font-bold text-purple-600">25% Target</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-black">
            {todayTotals.fat}g{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">/ {targetFat}g</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayTotals.fat / targetFat) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* FOOD SCAN CAMERA & VISION RECOGNITION SECTION */}
      {isScanActive && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-[#A3E635]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Food Vision Scanner</h3>
                <p className="text-xs text-slate-400 font-sans">Point camera at meal or dish to analyze nutrients</p>
              </div>
            </div>

            <button
              onClick={() => setIsScanActive(false)}
              className="text-xs text-slate-400 hover:text-white underline font-mono"
            >
              CLOSE SCANNER
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Frame: Camera Preview */}
            <div className="space-y-4">
              <CameraScanner
                isScanning={isProcessingScan}
                onCapture={handleCaptureFood}
                placeholderText="Center meal within optical scanner frame..."
                badgeLabel="FOOD VISION OPTICAL STREAM"
              />

              <div className="text-center">
                <button
                  onClick={() => handleCaptureFood()}
                  disabled={isProcessingScan}
                  className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-extrabold text-xs px-6 py-3 rounded-full shadow transition"
                >
                  {isProcessingScan ? 'Analyzing Vision Telemetry...' : 'SIMULATE CAMERA SCAN'}
                </button>
              </div>
            </div>

            {/* Right Frame: Recognition Results & Confirmation */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between space-y-4">
              {isProcessingScan ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#A3E635] animate-spin" />
                  <p className="text-sm font-bold text-slate-200">Processing visual volume & ingredient density...</p>
                  <p className="text-xs text-slate-400">Querying local nutrition model database adapter</p>
                </div>
              ) : currentScanResult ? (
                <div className="space-y-4 font-sans">
                  <div className="flex items-start justify-between border-b border-slate-700 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#A3E635] uppercase tracking-wider">
                        RECOGNIZED MEAL • {(currentScanResult.confidenceScore * 100).toFixed(0)}% MATCH
                      </span>
                      <h4 className="text-xl font-extrabold text-white mt-1">{currentScanResult.recognizedFood}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">Estimated Portion: {currentScanResult.estimatedPortion}</p>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                      ESTIMATED
                    </span>
                  </div>

                  {/* Estimated Nutrition Breakdown */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">ESTIMATED NUTRITION</span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 font-mono">CALORIES</div>
                        <div className="text-base font-extrabold text-amber-400 font-mono">{editFormData.calories}</div>
                        <div className="text-[9px] text-slate-500">kcal</div>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 font-mono">PROTEIN</div>
                        <div className="text-base font-extrabold text-emerald-400 font-mono">{editFormData.protein}g</div>
                        <div className="text-[9px] text-slate-500">grams</div>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 font-mono">CARBS</div>
                        <div className="text-base font-extrabold text-blue-400 font-mono">{editFormData.carbs}g</div>
                        <div className="text-[9px] text-slate-500">grams</div>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                        <div className="text-[10px] text-slate-400 font-mono">FAT</div>
                        <div className="text-base font-extrabold text-purple-400 font-mono">{editFormData.fat}g</div>
                        <div className="text-[9px] text-slate-500">grams</div>
                      </div>
                    </div>
                  </div>

                  {/* Meal Timing Selector */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">SELECT MEAL TIMING</span>
                    <div className="grid grid-cols-4 gap-2">
                      {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setSelectedMealType(t);
                            setEditFormData((prev) => ({ ...prev, mealType: t }));
                          }}
                          className={`py-2 text-xs font-bold rounded-xl border transition ${
                            selectedMealType === t
                              ? 'bg-[#A3E635] text-black border-[#A3E635]'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* User Correction Query Block: "Is this correct?" */}
                  <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">Is this nutrition estimate correct?</span>
                      <span className="text-[10px] font-mono text-slate-400">USER CORRECTION</span>
                    </div>

                    {!isEditing ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleConfirmScanMeal}
                          className="flex-1 bg-[#A3E635] hover:bg-[#84CC16] text-black font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
                        >
                          <Check className="w-4 h-4" />
                          <span>YES, LOG MEAL</span>
                        </button>

                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-xl border border-slate-600 flex items-center justify-center gap-2 transition"
                        >
                          <Edit3 className="w-4 h-4 text-amber-400" />
                          <span>EDIT VALUES</span>
                        </button>
                      </div>
                    ) : (
                      /* Editing Form Inputs */
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-mono text-slate-400">Meal Name</label>
                            <input
                              type="text"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-[#A3E635]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-slate-400">Portion</label>
                            <input
                              type="text"
                              value={editFormData.portion}
                              onChange={(e) => setEditFormData({ ...editFormData, portion: e.target.value })}
                              className="w-full bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-[#A3E635]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <label className="text-[10px] font-mono text-slate-400">Calories</label>
                            <input
                              type="number"
                              value={editFormData.calories}
                              onChange={(e) => setEditFormData({ ...editFormData, calories: Number(e.target.value) })}
                              className="w-full bg-slate-800 text-white text-xs px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-[#A3E635]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-slate-400">Protein (g)</label>
                            <input
                              type="number"
                              value={editFormData.protein}
                              onChange={(e) => setEditFormData({ ...editFormData, protein: Number(e.target.value) })}
                              className="w-full bg-slate-800 text-white text-xs px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-[#A3E635]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-slate-400">Carbs (g)</label>
                            <input
                              type="number"
                              value={editFormData.carbs}
                              onChange={(e) => setEditFormData({ ...editFormData, carbs: Number(e.target.value) })}
                              className="w-full bg-slate-800 text-white text-xs px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-[#A3E635]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-slate-400">Fat (g)</label>
                            <input
                              type="number"
                              value={editFormData.fat}
                              onChange={(e) => setEditFormData({ ...editFormData, fat: Number(e.target.value) })}
                              className="w-full bg-slate-800 text-white text-xs px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-[#A3E635]"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleConfirmScanMeal}
                          className="w-full bg-[#A3E635] text-black font-extrabold text-xs py-2 rounded-xl transition"
                        >
                          SAVE CORRECTED MEAL
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <Apple className="w-10 h-10 text-slate-600" />
                  <p className="text-sm font-bold text-slate-300">Ready to scan meal</p>
                  <p className="text-xs text-slate-500">Capture your dish to analyze estimated macros</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MEAL PATTERN VISUALIZATION & HEALTH INSIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pattern Observation Card */}
        <div className="md:col-span-2">
          <PatternInsightBanner
            title="FoodTrace Pattern Observation"
            observation="Your lunch was balanced with high lean protein (48g) and complex carbs. This supports sustained muscle glycogen replenishment without causing acute postprandial glucose spikes."
            disclaimer="Estimates based on visual telemetry and local database lookup. Non-medical guidance."
            actionText="Explore 7-Day Food Pattern"
            onAction={() => {}}
          />
        </div>

        {/* Macro Ratio Chart Block */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-black">Macro Breakdown Ratio</h3>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 font-sans">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Protein ({todayTotals.protein}g)</span>
                <span>{((todayTotals.protein * 4 / (todayTotals.calories || 1)) * 100).toFixed(0)}% kcal</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-[#8px] rounded-full" style={{ width: `${Math.min((todayTotals.protein * 4 / (todayTotals.calories || 1)) * 100, 100)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Carbohydrates ({todayTotals.carbs}g)</span>
                <span>{((todayTotals.carbs * 4 / (todayTotals.calories || 1)) * 100).toFixed(0)}% kcal</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-[#8px] rounded-full" style={{ width: `${Math.min((todayTotals.carbs * 4 / (todayTotals.calories || 1)) * 100, 100)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Healthy Fats ({todayTotals.fat}g)</span>
                <span>{((todayTotals.fat * 9 / (todayTotals.calories || 1)) * 100).toFixed(0)}% kcal</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-500 h-[#8px] rounded-full" style={{ width: `${Math.min((todayTotals.fat * 9 / (todayTotals.calories || 1)) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOD HISTORY & HEALTRACE TIMELINE INTEGRATION */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight">
              Logged Meals & Food History
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Integrated directly into your continuous HEALTRACE health timeline
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const sampleName = prompt('Enter Food Name:', 'Greek Yogurt Berry Parfait');
                if (sampleName) {
                  foodTraceService.logMeal({
                    name: sampleName,
                    mealType: 'Snack',
                    portion: '1 serving (200g)',
                    portionGrams: 200,
                    macros: { calories: 240, protein: 18, carbs: 26, fat: 6 },
                    glycemicIndex: 'LOW',
                    confidenceScore: 0.9,
                    isEstimate: true,
                    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    dateFormatted: new Date().toISOString().split('T')[0]
                  });
                  showToast(`Logged "${sampleName}" manually.`);
                }
              }}
              className="bg-black hover:bg-slate-800 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-[#A3E635]" />
              <span>MANUAL LOG</span>
            </button>

            <Link
              to="/healtrace"
              className="text-xs font-mono font-bold text-slate-600 hover:text-black flex items-center gap-1 border border-slate-200 px-3 py-2 rounded-full"
            >
              <span>VIEW TIMELINE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3 font-sans">
          {loggedMeals.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
              No meals logged today yet. Click "SCAN MEAL" to capture a dish!
            </div>
          ) : (
            loggedMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-[#FBFBF8] rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                    <Utensils className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-black">{meal.name}</h4>
                      <span className="bg-amber-100 text-amber-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        {meal.mealType}
                      </span>
                      {meal.isEstimate && (
                        <span className="text-[9px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                          ESTIMATE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-sans mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {meal.timeFormatted}
                      </span>
                      <span>•</span>
                      <span>{meal.portion}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-700 font-bold">
                        GI: {meal.glycemicIndex}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Macro Pills & Delete CTA */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-bold text-amber-600">{meal.macros.calories} kcal</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-emerald-600">{meal.macros.protein}g P</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-blue-600">{meal.macros.carbs}g C</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-purple-600">{meal.macros.fat}g F</span>
                  </div>

                  <button
                    onClick={() => handleDeleteMeal(meal.id, meal.name)}
                    className="text-slate-400 hover:text-red-500 transition p-1.5"
                    title="Delete meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodTracePage;
