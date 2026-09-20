import React, { useState } from 'react';
import { Pill, Camera, Zap, CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { CameraScanner } from '../components/CameraScanner';
import { ReportModal } from '../components/ReportModal';
import { api } from '../services/api';
import { MedicineAnalysisResult } from '../types';

export const MedicinePage: React.FC = () => {
  const [packageName, setPackageName] = useState('Amoxicillin 500mg Trihydrate Packaging');
  const [simulateFlagged, setSimulateFlagged] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<MedicineAnalysisResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleScanMedicine = async () => {
    setIsScanning(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1200));

    try {
      const res = await api.analyzeMedicine(packageName, simulateFlagged);
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
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-slate-200 text-slate-800 text-xs font-mono font-medium mb-2">
          <Pill className="w-3.5 h-3.5 text-black" />
          <span>CAPABILITY 02: PHARMACEUTICAL PACKAGE SCREENING</span>
        </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
            MEDSURE
          </h1>
          <p className="text-sm font-sans text-slate-500 font-semibold">
            Medicine Screening
          </p>
      </div>

      <SafetyDisclaimer category="MEDICINE" />

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Camera Viewport */}
        <GlassCard className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-sans text-slate-500 font-bold uppercase tracking-wider">
              OPTICAL PACKAGING SCANNER
            </div>

            {/* Live Camera Scanner Component */}
            <CameraScanner
              onCapture={handleScanMedicine}
              isScanning={isScanning}
              placeholderText="Align medicine box or blister pack inside live camera frame"
              badgeLabel="PHARMACEUTICAL PACKAGING CAMERA"
            />
          </div>

          {/* Test Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-sans text-slate-600 font-bold">Target Medicine Product Name</label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full bg-stone-50 border border-slate-200 focus:border-black rounded-xl px-4 py-2.5 text-xs text-black font-semibold"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-slate-200 text-xs font-sans">
              <span className="text-slate-700 font-medium">Simulate Flagged Counterfeit Indicators</span>
              <button
                type="button"
                onClick={() => setSimulateFlagged(!simulateFlagged)}
                className={`w-11 h-6 rounded-full transition-colors relative ${simulateFlagged ? 'bg-rose-600' : 'bg-slate-300'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${simulateFlagged ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Right: Results Card */}
        <div className="lg:col-span-6">
          {result ? (
            <GlassCard glow className="space-y-6 border-[#84CC16]">
              <div className={`p-4 rounded-2xl border flex items-center gap-3 font-sans text-xs font-bold ${
                result.status.includes('NO COUNTERFEIT')
                  ? 'bg-lime-100 border-lime-300 text-lime-900'
                  : 'bg-rose-100 border-rose-300 text-rose-900 animate-pulse'
              }`}>
                {result.status.includes('NO COUNTERFEIT') ? (
                  <ShieldCheck className="w-6 h-6 shrink-0 text-lime-700" />
                ) : (
                  <ShieldAlert className="w-6 h-6 shrink-0 text-rose-700" />
                )}
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-normal">SCREENING STATUS RESULT</div>
                  <div className="text-sm font-black tracking-wide mt-0.5">{result.status}</div>
                </div>
              </div>

              <ConfidenceMeter score={result.confidence} label="Packaging Feature Correlation" />

              {/* Observed Indicators List */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  CHECKED VISUAL PACKAGING INDICATORS
                </span>
                <div className="space-y-2">
                  {result.observedIndicators.map((ind) => (
                    <div key={ind.name} className="p-3 rounded-2xl bg-stone-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-black font-bold">{ind.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          ind.status === 'PASS' ? 'bg-lime-200 text-lime-900' : 'bg-rose-200 text-rose-900'
                        }`}>
                          {ind.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans">{ind.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs font-sans border-t border-slate-100 pt-3">
                <div>
                  <strong className="font-mono text-[11px] text-black block">SUMMARY: </strong>
                  <span className="text-slate-700">{result.comparisonSummary}</span>
                </div>
                <div>
                  <strong className="font-mono text-[11px] text-black block">NEXT VERIFICATION STEP: </strong>
                  <span className="text-slate-700">{result.recommendedVerification}</span>
                </div>
              </div>

              {/* Emergency Reporting Button */}
              <div className="pt-2">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-bold shadow-md flex items-center justify-center gap-2 transition"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>🚨 REPORT SUSPECTED COUNTERFEIT MEDICINE</span>
                </button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="h-full flex flex-col items-center justify-center text-center p-8 border-slate-200 space-y-3">
              <Pill className="w-12 h-12 text-slate-300" />
              <div className="font-mono text-sm font-bold text-slate-600">AWAITING MEDICINE SCAN</div>
              <p className="text-xs text-slate-500 max-w-xs font-sans">
                Align packaging inside live camera frame and click "CAPTURE FRAME & RUN SCAN".
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
          title={result.comparisonSummary}
          hazardType={`Suspected Pharmaceutical Packaging Discrepancy (${result.packageName})`}
          severity={result.status.includes('POTENTIAL COUNTERFEIT') ? 'CRITICAL' : 'HIGH'}
          category="MEDICINE"
          location="Authorized Pharmacy Scanning Terminal"
          evidenceSummary={result.observedIndicators.map(i => `${i.name}: ${i.status}`).join(' | ')}
        />
      )}
    </div>
  );
};
