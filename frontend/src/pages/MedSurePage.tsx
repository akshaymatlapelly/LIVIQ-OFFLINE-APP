import React, { useState } from 'react';
import { CameraScanner } from '../components/CameraScanner';
import {
  Pill,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  FileText,
  Search,
  ExternalLink,
  Volume2,
  Globe,
  HelpCircle,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Plus,
  Play,
  Square,
  ShieldAlert,
  Clock,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { speechService } from '../features/voice/speechService';

type MedSureStep = 'LANDING' | 'SCAN' | 'RESULT' | 'CHECK' | 'CABINET' | 'INTERACTION';

interface CabinetMedicine {
  id: string;
  name: string;
  strength: string;
  manufacturer: string;
  expiryDate: string;
  schedule: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
  purpose: string;
}

export const MedSurePage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<MedSureStep>('LANDING');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [ocrConfidence, setOcrConfidence] = useState<number>(0.98);

  // Audio / Voice Explanation State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [explanationMode, setExplanationMode] = useState<'ENGLISH' | 'TELUGU' | 'SIMPLE'>('ENGLISH');
  const [checklistOpen, setChecklistOpen] = useState(false);

  // Saved Cabinet Medicines Data
  const [cabinetMeds, setCabinetMeds] = useState<CabinetMedicine[]>([
    {
      id: 'med_01',
      name: 'Amoxicillin Trihydrate',
      strength: '500 mg',
      manufacturer: 'Cipla Health Ltd.',
      expiryDate: 'DEC 2027',
      schedule: 'Every 8 hours with water',
      status: 'ACTIVE',
      purpose: 'Antibiotic for bacterial infections'
    },
    {
      id: 'med_02',
      name: 'Metformin Hydrochloride',
      strength: '500 mg',
      manufacturer: 'Sun Pharma Ltd.',
      expiryDate: 'NOV 2026',
      schedule: 'Twice daily with meals',
      status: 'EXPIRING_SOON',
      purpose: 'Blood sugar regulation'
    },
    {
      id: 'med_03',
      name: 'Multivitamin Complex',
      strength: '1 Tablet',
      manufacturer: 'Abbott Healthcare',
      expiryDate: 'JAN 2028',
      schedule: 'Once daily in morning',
      status: 'ACTIVE',
      purpose: 'Daily dietary supplementation'
    }
  ]);

  // Multi-Medicine Checker Selection
  const [selectedMedIds, setSelectedMedIds] = useState<string[]>(['med_01', 'med_02']);
  const [interactionResult, setInteractionResult] = useState<any | null>(null);

  // Handle Capture Action
  const handleCapture = (lowConfidence: boolean = false) => {
    setIsScanning(true);
    setScanResult(null);
    const conf = lowConfidence ? 0.58 : 0.98;
    setOcrConfidence(conf);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        medicineName: 'Amoxicillin Trihydrate',
        strength: '500 mg Capsule',
        manufacturer: 'Cipla Health Ltd.',
        batchLot: 'LOT #AMX-2026-88',
        expiryDate: 'DEC 2027',
        generalPurpose: 'Amoxicillin is a widely prescribed antibiotic used to treat bacterial infections such as ear, nose, throat, or chest infections.',
        labelDirections: 'Take 1 capsule every 8 hours with a full glass of water. Complete full prescribed 7-day duration even if symptoms improve early.',
        sideEffects: ['Mild stomach upset', 'Nausea', 'Headache', 'Temporary rash'],
        warnings: [
          'Do NOT use if allergic to Penicillin or Beta-lactam antibiotics.',
          'Take with food to minimize potential gastric sensitivity.',
          'Do NOT stop or change dosage without consulting your prescribing doctor.'
        ],
        precautions: [
          'Store below 25°C away from direct moisture.',
          'Keep strictly out of reach of children.'
        ],
        authenticityIndicators: {
          microKerning: 'MATCHED (100%)',
          antiTamperSeal: 'INTACT & VERIFIED',
          expiryVerification: 'DEC 2027 (VALID)'
        }
      });
      setActiveStep('RESULT');
    }, 2200);
  };

  // Explanation Texts
  const teluguExplanation = 'అమోక్సిసిలిన్ (Amoxicillin 500mg) అనేది బాక్టీరియల్ ఇన్ఫెక్షన్ల (చెవి, గొంతు, ఊపిరితిత్తులు) చికిత్సకు ఉపయోగించే యాంటీబయాటిక్ ఔషధం. ప్రతి 8 గంటలకు ఒకసారి నీటితో తీసుకోవాలి. పెన్సిలిన్ అలెర్జీ ఉంటే వాడకండి.';
  const simpleExplanation = 'Amoxicillin 500mg is an antibiotic that fights bacterial infections in your body. Take 1 pill every 8 hours with water. Finish all pills even if you feel better.';

  const handleAudioPlayback = (textToRead: string, langCode: string = 'en-US') => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    speechService.speak(textToRead, langCode, () => {
      setIsPlayingAudio(false);
    });
  };

  // Run Interaction Check
  const runInteractionCheck = () => {
    if (selectedMedIds.length < 2) {
      setInteractionResult(null);
      return;
    }

    setInteractionResult({
      detected: true,
      severity: 'POTENTIAL INTERACTION DETECTED',
      description: 'Concomitant administration of Amoxicillin and Metformin may alter GI absorption rate or increase stomach sensitivity.',
      actionNotice: 'Please confirm with a pharmacist or clinician before combining these medications.'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Header Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {activeStep !== 'LANDING' && (
            <button
              type="button"
              onClick={() => {
                if (activeStep === 'SCAN') setActiveStep('LANDING');
                else if (activeStep === 'RESULT') setActiveStep('SCAN');
                else if (activeStep === 'CHECK') setActiveStep('RESULT');
                else if (activeStep === 'CABINET') setActiveStep('LANDING');
                else if (activeStep === 'INTERACTION') setActiveStep('CABINET');
              }}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-black transition"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-emerald-900 border border-emerald-200 text-[10px] font-mono font-bold">
              <Pill className="w-3 h-3 text-[#84CC16]" />
              <span>MEDSURE • MEDICINE UNDERSTANDING & SAFETY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              {activeStep === 'LANDING' && 'MEDSURE Overview'}
              {activeStep === 'SCAN' && 'Medicine Packaging Scanner'}
              {activeStep === 'RESULT' && 'Medicine Profile & Explanation'}
              {activeStep === 'CHECK' && 'Packaging Discrepancy Check'}
              {activeStep === 'CABINET' && 'My Medicine Cabinet'}
              {activeStep === 'INTERACTION' && 'Multi-Medicine Interaction Checker'}
            </h1>
          </div>
        </div>

        {/* Stepper Navigation Badges */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono font-bold">
          {(['LANDING', 'SCAN', 'RESULT', 'CHECK', 'CABINET', 'INTERACTION'] as const).map((st, i) => (
            <button
              key={st}
              onClick={() => setActiveStep(st)}
              className={`px-2.5 py-1 rounded-full transition ${
                activeStep === st
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:text-black'
              }`}
            >
              0{i + 1} {st}
            </button>
          ))}
        </div>
      </div>

      {/* SCREEN 1: LANDING SCREEN */}
      {activeStep === 'LANDING' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Hero Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 text-[#A3E635] font-mono text-xs font-bold">
                <Pill className="w-3.5 h-3.5" />
                <span>LAYER 2 • MEDICINE UNDERSTANDING & SAFETY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                MEDSURE
              </h2>
              <p className="text-sm font-bold text-[#A3E635] font-sans">
                "Understand what you're taking."
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Macro-lens optical package kerning verification, pill identification, multi-lingual voice explanations, allergen alerts, and multi-medicine interaction screening.
              </p>
            </div>

            {/* Primary CTA: SCAN MEDICINE */}
            <div className="pt-2 relative z-10">
              <button
                type="button"
                onClick={() => setActiveStep('SCAN')}
                className="w-full sm:w-auto bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-extrabold text-sm py-4 px-8 rounded-full shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5 text-black" />
                <span>SCAN MEDICINE NOW</span>
                <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => setActiveStep('CABINET')}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-left space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-black text-[#A3E635] flex items-center justify-center group-hover:scale-105 transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-black font-sans">Medicine Cabinet</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">3 Saved active medications</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('SCAN')}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-left space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-black font-sans">Scan History</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Review past OCR package scans</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('CABINET')}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-left space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-black text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-black font-sans">Expiry Alerts</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">1 Medicine expiring soon</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('INTERACTION')}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-left space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-black text-cyan-400 flex items-center justify-center group-hover:scale-105 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-black font-sans">Multi-Medicine Check</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Check interaction risks between meds</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: MEDICINE SCANNER */}
      {activeStep === 'SCAN' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-black" />
                <h2 className="text-sm font-extrabold text-black font-sans">Medicine Macro Camera Scanner</h2>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-emerald-800 border border-emerald-200">
                OCR ENGINE ACTIVE
              </span>
            </div>

            <CameraScanner
              onCapture={() => handleCapture(false)}
              isScanning={isScanning}
              placeholderText="Align camera reticle with medicine blister strip or carton label"
              badgeLabel="MEDSURE MACRO SENSOR STREAM"
            />

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCapture(true)}
                className="text-[11px] font-mono text-slate-500 hover:text-black underline"
              >
                [Simulate Low OCR Confidence Safeguard]
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-black" />
              <h3 className="text-sm font-extrabold text-black">OCR Extraction Protocol</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-sans">
              <p>
                <strong>MEDSURE OCR</strong> extracts text printed on blister foils, cardboard cartons, and pharmacy prescription labels:
              </p>
              <div className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-1.5 font-mono text-xs">
                <div>• Medicine Name & Active Ingredient</div>
                <div>• Dosage Strength (e.g. 500mg)</div>
                <div>• Manufacturer Name</div>
                <div>• Batch / Lot Number</div>
                <div>• Expiration Date</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Uncertainty Safeguard:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  If OCR confidence is low or packaging text is blurry, LIVIQ explicitly prompts you to verify details with a pharmacist.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 3: MEDICINE RESULT PAGE */}
      {activeStep === 'RESULT' && scanResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Low Confidence Warning Callout (If Applicable) */}
          {ocrConfidence < 0.7 && (
            <div className="bg-amber-100 border-2 border-amber-300 text-amber-950 p-4 rounded-3xl flex items-center gap-3 shadow-sm">
              <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
              <div className="space-y-0.5">
                <div className="text-xs font-mono font-extrabold uppercase">OCR CONFIDENCE UNCERTAIN ({Math.round(ocrConfidence * 100)}%)</div>
                <p className="text-xs font-sans font-bold">
                  Medicine identification is uncertain. Please verify the packaging with a pharmacist or qualified professional.
                </p>
              </div>
            </div>
          )}

          {/* Main Structured Result Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">IDENTIFIED MEDICINE PROFILE</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black">{scanResult.medicineName}</h2>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800">
                  {scanResult.strength} • {scanResult.manufacturer}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-400 block">EXPIRY DATE</span>
                <span className="font-mono text-sm font-extrabold text-emerald-700">{scanResult.expiryDate} (VALID)</span>
              </div>
            </div>

            {/* Language & Voice Explanation Control Bar */}
            <div className="bg-[#FBFBF8] p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-black" />
                <span className="text-xs font-bold text-black font-sans">Multi-Lingual Voice Explanation:</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setExplanationMode('ENGLISH');
                    handleAudioPlayback(scanResult.generalPurpose, 'en-US');
                  }}
                  className={`px-3.5 py-1.5 text-xs font-mono font-extrabold rounded-full transition ${
                    explanationMode === 'ENGLISH' ? 'bg-black text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  English Voice
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExplanationMode('TELUGU');
                    handleAudioPlayback(teluguExplanation, 'te-IN');
                  }}
                  className={`px-3.5 py-1.5 text-xs font-mono font-extrabold rounded-full transition ${
                    explanationMode === 'TELUGU' ? 'bg-[#84CC16] text-black shadow-sm' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Explain in Telugu (తెలుగు)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExplanationMode('SIMPLE');
                    handleAudioPlayback(simpleExplanation, 'en-US');
                  }}
                  className={`px-3.5 py-1.5 text-xs font-mono font-extrabold rounded-full transition ${
                    explanationMode === 'SIMPLE' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Explain Simply
                </button>
              </div>
            </div>

            {/* Dynamic Explanation Content Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase">
                {explanationMode === 'TELUGU' ? 'తెలుగు వివరణ (TELUGU EXPLANATION):' : 'GENERAL PURPOSE & ACTION:'}
              </div>
              <p className="text-sm text-slate-900 font-sans leading-relaxed font-medium">
                {explanationMode === 'ENGLISH' && scanResult.generalPurpose}
                {explanationMode === 'TELUGU' && teluguExplanation}
                {explanationMode === 'SIMPLE' && simpleExplanation}
              </p>
            </div>

            {/* Label Directions & Side Effects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-black font-sans flex items-center gap-2">
                  <FileText className="w-4 h-4 text-black" />
                  <span>Label Directions:</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 font-sans leading-relaxed">
                  {scanResult.labelDirections}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-black font-sans flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Common Side Effects:</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                  {scanResult.sideEffects.map((se: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{se}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Warnings & Precautions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-rose-900 font-sans flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Warnings & Precautions:</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAudioPlayback(scanResult.warnings.join(' '), 'en-US')}
                  className="text-xs font-mono font-bold text-rose-700 hover:underline flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Read Warnings Out Loud</span>
                </button>
              </div>

              <div className="space-y-2">
                {scanResult.warnings.map((w: string, i: number) => (
                  <div key={i} className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-950 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strict Compliance Medical Disclaimer */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-sans leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Medical Safety Notice:</strong> LIVIQ provides OCR package reading and pharmacopeia information for guidance. LIVIQ does <strong>NOT</strong> prescribe medication, recommend changing dosage, or instruct users to stop/start prescribed medication. Always consult your prescribing doctor or pharmacist.
              </span>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveStep('CHECK')}
                className="w-full sm:w-auto bg-black hover:bg-slate-800 text-white font-sans text-xs font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition"
              >
                <span>Run Packaging Discrepancy Check</span>
                <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const newMed: CabinetMedicine = {
                    id: `med_${Date.now()}`,
                    name: scanResult.medicineName,
                    strength: scanResult.strength,
                    manufacturer: scanResult.manufacturer,
                    expiryDate: scanResult.expiryDate,
                    schedule: 'As directed by physician',
                    status: 'ACTIVE',
                    purpose: scanResult.generalPurpose
                  };
                  setCabinetMeds([...cabinetMeds, newMed]);
                  setActiveStep('CABINET');
                }}
                className="w-full sm:w-auto bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-extrabold text-xs py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-md transition"
              >
                <span>Add to My Medicine Cabinet</span>
                <CheckCircle2 className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 4: PACKAGING CHECK */}
      {activeStep === 'CHECK' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">OPTICAL PACKAGING CHECK</span>
              <h2 className="text-2xl font-extrabold text-black">Packaging Kerning & Seal Verification</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-mono font-extrabold">
              LAYOUT MATCHED
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600 font-sans">Micro-Printing Kerning Alignment:</span>
              <span className="font-extrabold text-emerald-700">MATCHED (100% Alignment)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600 font-sans">Anti-Tamper Foil & Seal Integrity:</span>
              <span className="font-extrabold text-emerald-700">INTACT & VERIFIED</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600 font-sans">Batch & Expiry Code Verification:</span>
              <span className="font-extrabold text-slate-800">DEC 2027 (VALID)</span>
            </div>
          </div>

          {/* Mandatory Discrepancy Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-sans leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Authenticity Disclaimer:</strong> Image analysis checks for visible packaging text alignment and printing layout. It cannot definitively prove chemical authenticity or drug purity.
            </span>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep('RESULT')}
              className="bg-slate-100 hover:bg-slate-200 text-black font-sans text-xs font-bold py-3 px-6 rounded-full transition"
            >
              Back to Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('CABINET')}
              className="bg-black hover:bg-slate-800 text-white font-sans text-xs font-bold py-3 px-6 rounded-full transition"
            >
              View Medicine Cabinet
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 5: MEDICINE CABINET */}
      {activeStep === 'CABINET' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-black">My Medicine Cabinet</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Saved medications, expiry alerts, and schedule tracking</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep('INTERACTION')}
              className="bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-extrabold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Multi-Medicine Interaction Check</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cabinetMeds.map((med) => (
              <div key={med.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">{med.strength}</span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      med.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' : 'bg-amber-100 text-amber-900 border-amber-200'
                    }`}>
                      {med.status === 'ACTIVE' ? 'VALID' : 'EXPIRING SOON'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-black">{med.name}</h3>
                  <p className="text-xs text-slate-500 font-sans">{med.manufacturer}</p>
                  <p className="text-xs text-slate-700 font-sans pt-1 font-medium">{med.purpose}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-sans">
                  <div className="flex justify-between text-slate-600">
                    <span>Schedule:</span>
                    <span className="font-bold text-black">{med.schedule}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-mono text-[11px]">
                    <span>Expiry:</span>
                    <span className="font-bold text-slate-800">{med.expiryDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 6: MULTI-MEDICINE INTERACTION CHECKER */}
      {activeStep === 'INTERACTION' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">SAFETY INTERACTION CHECKER</span>
              <h2 className="text-2xl font-extrabold text-black">Multi-Medicine Interaction Check</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-mono font-extrabold">
              TRUSTED PHARMACOPEIA DATA
            </span>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-black font-sans">Select 2 or more medicines to check potential interactions:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cabinetMeds.map((m) => {
                const isSelected = selectedMedIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMedIds(selectedMedIds.filter((id) => id !== m.id));
                      } else {
                        setSelectedMedIds([...selectedMedIds, m.id]);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left font-sans transition ${
                      isSelected ? 'bg-black text-white border-black shadow-sm' : 'bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs">{m.name}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{m.strength}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={runInteractionCheck}
            disabled={selectedMedIds.length < 2}
            className="w-full bg-black hover:bg-slate-800 text-white font-sans text-xs font-extrabold py-3.5 px-6 rounded-full shadow-md transition disabled:opacity-50"
          >
            Run Multi-Medicine Interaction Analysis
          </button>

          {/* Interaction Output Banner */}
          {interactionResult && (
            <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="font-extrabold text-sm font-sans">{interactionResult.severity}</h3>
              </div>

              <p className="text-xs text-amber-900 font-sans leading-relaxed">
                {interactionResult.description}
              </p>

              <div className="p-3 rounded-2xl bg-amber-100 border border-amber-200 font-bold text-xs text-amber-950 font-sans">
                Notice: {interactionResult.actionNotice}
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-sans leading-relaxed">
            <strong>Safety Rule:</strong> LIVIQ interaction checks provide safety guidance based on pharmacopeia records. LIVIQ does not alter dosage or provide instructions to discontinue prescribed drugs.
          </div>
        </div>
      )}
    </div>
  );
};
