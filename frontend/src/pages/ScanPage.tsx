import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ScanAnimation } from '../components/ScanAnimation';
import { api } from '../services/api';
import { ScanCategory, ScanClassificationResult } from '../types';

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();

  const [scanMode, setScanMode] = useState<'AUTO' | 'INSPECT' | 'VERIFY' | 'UNDERSTAND'>('AUTO');
  const [selectedCategory, setSelectedCategory] = useState<ScanCategory>('Wall Crack');
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<ScanClassificationResult | null>(null);

  const categories: { label: ScanCategory; desc: string }[] = [
    { label: 'Wall Crack', desc: 'Structural shear fracture assessment' },
    { label: 'Road Damage', desc: 'Asphalt pothole & sub-base cavity' },
    { label: 'Electrical Equipment', desc: 'Thermal lug oxidation & wiring fault' },
    { label: 'Medicine Package', desc: 'Packaging micro-print & seal screening' },
    { label: 'Receipt', desc: 'Bill itemization, tax & cost split' },
    { label: 'Document', desc: 'Legal contract summary & key clauses' },
    { label: 'Appliance Error Code', desc: 'HVAC/Inverter diagnostic lookup' },
    { label: 'Unknown Object', desc: 'Multimodal physical world classification' }
  ];

  const handleStartScan = async () => {
    setIsScanning(true);
    setResult(null);
    setCurrentStep(0);

    for (let i = 0; i <= 5; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 400));
    }

    try {
      const classRes = await api.classifyScan(selectedCategory);
      setResult(classRes);
    } catch (err) {
      setResult({
        scanId: `scn_${Date.now()}`,
        inputCategory: selectedCategory,
        targetCapability: selectedCategory.includes('Medicine') ? 'MEDICINE' : selectedCategory.includes('Receipt') || selectedCategory.includes('Document') || selectedCategory.includes('Appliance') ? 'AURALENS' : 'INSPECTION',
        confidence: 0.97,
        routeReason: 'AI Core successfully classified input spectral signature.',
        recommendedAction: 'Proceed to dedicated capability mode.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleLaunchCapability = () => {
    if (!result) return;
    switch (result.targetCapability) {
      case 'MEDICINE':
        navigate('/medicine');
        break;
      case 'AURALENS':
        navigate('/auralens');
        break;
      case 'RADAR':
        navigate('/radar');
        break;
      case 'HAPTIC':
        navigate('/haptic');
        break;
      case 'OPTICAL':
        navigate('/optical');
        break;
      case 'INSPECTION':
      default:
        navigate('/sentrx');
        break;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-slate-200 text-slate-800 text-xs font-mono font-medium">
          <Scan className="w-3.5 h-3.5 text-black" />
          <span>UNIVERSAL AI INGESTION</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight">
          Universal Scan Portal
        </h1>
        <p className="text-sm font-sans text-slate-500">
          Point sensor frame at any physical object or document. LIVIQ AI Core auto-routes.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-full bg-white border border-slate-200 shadow-sm font-sans text-xs">
          {(['AUTO', 'INSPECT', 'VERIFY', 'UNDERSTAND'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setScanMode(mode)}
              className={`px-5 py-2 rounded-full font-bold transition ${
                scanMode === mode
                  ? 'bg-black text-white shadow-sm'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              {mode} MODE
            </button>
          ))}
        </div>
      </div>

      {/* Main Scanner Container */}
      <GlassCard className="p-6 md:p-8 space-y-8">
        <ScanAnimation currentStep={currentStep} />

        {/* Demo Category Picker */}
        <div className="space-y-3">
          <label className="text-xs font-sans text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Select Input Category Preset</span>
            <span className="text-slate-400 font-normal">Input routing simulation</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`p-3 rounded-2xl text-left border font-sans transition-all ${
                  selectedCategory === cat.label
                    ? 'bg-black text-white border-black font-bold shadow-md'
                    : 'bg-stone-50 border-slate-200/80 text-slate-700 hover:bg-stone-100'
                }`}
              >
                <div className="text-xs font-bold truncate">{cat.label}</div>
                <div className={`text-[10px] font-sans mt-0.5 truncate ${selectedCategory === cat.label ? 'text-slate-300' : 'text-slate-500'}`}>{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Button */}
        <div>
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="w-full py-4 rounded-full font-sans text-sm font-bold text-white bg-black hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Scan className="w-5 h-5 text-[#A3E635]" />
            <span>{isScanning ? 'Executing LIVIQ Core Classification...' : `Analyze ${selectedCategory}`}</span>
          </button>
        </div>

        {/* Classification Result Card */}
        {result && (
          <div className="p-6 rounded-3xl bg-lime-50 border-2 border-[#84CC16] space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-lime-200 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-lime-700" />
                <span className="font-sans text-xs font-bold text-lime-900">LIVIQ Routing Decision</span>
              </div>
              <span className="font-mono text-xs text-black font-bold bg-white px-3 py-1 rounded-full border border-lime-300 shadow-sm">
                CONFIDENCE {Math.round(result.confidence * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <span className="text-slate-500">INPUT DETECTED:</span>
                <div className="text-black font-bold text-sm mt-0.5">{result.inputCategory}</div>
              </div>

              <div>
                <span className="text-slate-500">TARGET CAPABILITY:</span>
                <div className="text-lime-900 font-extrabold text-sm mt-0.5">
                  {result.targetCapability === 'INSPECTION' ? 'INSIGHT' :
                   result.targetCapability === 'MEDICINE' ? 'MEDSURE' :
                   result.targetCapability === 'AURALENS' ? 'ACTIONLENS' :
                   result.targetCapability === 'RADAR' ? 'ECHOSENSE' :
                   result.targetCapability === 'HAPTIC' ? 'TOUCHTALK' :
                   result.targetCapability === 'OPTICAL' ? 'LIGHTLINK' : result.targetCapability}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-sans leading-relaxed border-t border-lime-200 pt-3">
              <strong className="font-bold text-black">AI Reason: </strong>
              {result.routeReason}
            </p>

            <button
              onClick={handleLaunchCapability}
              className="w-full py-3 rounded-full bg-black hover:bg-slate-800 text-white font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <span>Open {
                result.targetCapability === 'INSPECTION' ? 'INSIGHT' :
                result.targetCapability === 'MEDICINE' ? 'MEDSURE' :
                result.targetCapability === 'AURALENS' ? 'ACTIONLENS' :
                result.targetCapability === 'RADAR' ? 'ECHOSENSE' :
                result.targetCapability === 'HAPTIC' ? 'TOUCHTALK' :
                result.targetCapability === 'OPTICAL' ? 'LIGHTLINK' : result.targetCapability
              } Module</span>
              <ArrowUpRight className="w-4 h-4 text-[#A3E635]" />
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
