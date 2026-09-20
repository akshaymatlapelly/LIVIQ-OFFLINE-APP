import React, { useState } from 'react';
import {
  Eye,
  Camera,
  AlertTriangle,
  FileCheck,
  Share2,
  PhoneCall,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { RiskBadge } from '../components/RiskBadge';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { CameraScanner } from '../components/CameraScanner';
import { ReportModal } from '../components/ReportModal';
import { api } from '../services/api';
import { InspectionAnalysisResult } from '../types';

export const InspectionPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Wall Crack');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<InspectionAnalysisResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const demoPresets = [
    { name: 'Wall Crack', tag: 'Masonry Fracture' },
    { name: 'Pothole', tag: 'Asphalt Sub-base' },
    { name: 'Electrical Equipment', tag: 'Thermal Lug Oxidation' },
    { name: 'Water Leakage', tag: 'Pressurized Seep' }
  ];

  const handleRunInspection = async () => {
    setIsScanning(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1200));

    try {
      const res = await api.analyzeInspection(selectedCategory);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-slate-200 text-slate-800 text-xs font-mono font-medium mb-2">
            <Eye className="w-3.5 h-3.5 text-black" />
            <span>CAPABILITY 01: REAL-WORLD VISUAL INSPECTION</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
            INSIGHT
          </h1>
          <p className="text-sm font-sans text-slate-500 font-semibold">
            Physical World Intelligence
          </p>
        </div>
      </div>

      <SafetyDisclaimer category="INSPECTION" />

      {/* Main Inspection Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera Preview & Presets */}
        <GlassCard className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-sans text-slate-500 font-bold uppercase tracking-wider">
              OPTICAL CAMERA CAPTURE FRAME
            </div>
            
            {/* Live Camera Scanner Component */}
            <CameraScanner
              onCapture={handleRunInspection}
              isScanning={isScanning}
              placeholderText="Align camera with structural wall crack or electrical defect"
              badgeLabel="LIVE OPTICAL CAMERA STREAM"
            />
          </div>

          {/* Preset Selection */}
          <div className="space-y-3">
            <label className="text-xs font-sans text-slate-500 font-bold uppercase">Select Target Defect Category</label>
            <div className="grid grid-cols-2 gap-2">
              {demoPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setSelectedCategory(preset.name)}
                  className={`p-3 rounded-2xl border text-left font-sans text-xs transition ${
                    selectedCategory === preset.name
                      ? 'bg-black text-white border-black font-bold shadow-md'
                      : 'bg-stone-50 border-slate-200 text-slate-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="truncate">{preset.name}</div>
                  <div className={`text-[10px] font-sans mt-0.5 ${selectedCategory === preset.name ? 'text-slate-300' : 'text-slate-500'}`}>{preset.tag}</div>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Right: Inspection Results Card */}
        <div className="lg:col-span-6">
          {result ? (
            <GlassCard glow className="space-y-6 border-[#84CC16]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <RiskBadge level={result.riskLevel} />
                <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-black" />
                  {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">DETECTED HAZARD / DEFECT</div>
                  <h3 className="text-xl font-extrabold text-black mt-0.5">{result.detectedIssue}</h3>
                </div>

                <ConfidenceMeter score={result.confidence} />

                <div className="space-y-3 font-sans text-xs border-t border-slate-100 pt-3">
                  <div>
                    <strong className="font-mono text-[11px] block text-black">OBSERVATION:</strong>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{result.observation}</p>
                  </div>

                  <div>
                    <strong className="font-mono text-[11px] block text-black">TECHNICAL EXPLANATION:</strong>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{result.explanation}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <strong className="font-mono text-[11px] block text-amber-900">RECOMMENDED ACTION:</strong>
                    <p className="text-amber-950 mt-0.5 font-medium leading-relaxed">{result.recommendedAction}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 border border-slate-200 space-y-1 font-mono text-[11px]">
                    <div className="text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" /> LOCATION: {result.location}
                    </div>
                    <div className="text-slate-600">EVIDENCE: {result.evidenceSummary}</div>
                  </div>
                </div>

                {/* Reporting Action Button (Always available for hazards) */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-bold shadow-md flex items-center justify-center gap-2 transition"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>🚨 REPORT HAZARD / EMERGENCY ISSUE</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="h-full flex flex-col items-center justify-center text-center p-8 border-slate-200 space-y-3">
              <Eye className="w-12 h-12 text-slate-300" />
              <div className="font-mono text-sm font-bold text-slate-600">AWAITING INSPECTION SCAN</div>
              <p className="text-xs text-slate-500 max-w-xs font-sans">
                Point live camera at target defect and click "CAPTURE FRAME & RUN SCAN".
              </p>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Emergency Report Modal */}
      {result && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title={result.observation}
          hazardType={result.detectedIssue}
          severity={result.riskLevel}
          category="INSPECTION"
          location={result.location}
          evidenceSummary={result.evidenceSummary}
        />
      )}
    </div>
  );
};
