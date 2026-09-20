import React, { useState } from 'react';
import {
  ScanText,
  Receipt,
  FileText,
  Wrench,
  Box,
  Share2,
  Download,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { CameraScanner } from '../components/CameraScanner';
import { ReportModal } from '../components/ReportModal';
import { api } from '../services/api';
import { AuraLensAnalysisResult } from '../types';

export const AuraLensPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'RECEIPT' | 'DOCUMENT' | 'OBJECT' | 'APPLIANCE ERROR CODE'>('RECEIPT');
  const [customTitle, setCustomTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AuraLensAnalysisResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const modes = [
    { id: 'RECEIPT', label: 'RECEIPT', icon: Receipt, desc: 'Expense breakdown & bill split' },
    { id: 'DOCUMENT', label: 'DOCUMENT', icon: FileText, desc: 'Contract summary & key clauses' },
    { id: 'APPLIANCE ERROR CODE', label: 'ERROR CODE', icon: Wrench, desc: 'HVAC/Appliance fault diagnosis' },
    { id: 'OBJECT', label: 'OBJECT', icon: Box, desc: 'Physical hardware identification' }
  ] as const;

  const handleProcessAuraLens = async () => {
    setIsProcessing(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1200));

    try {
      const res = await api.analyzeAuraLens(selectedMode, customTitle || undefined);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-slate-200 text-slate-800 text-xs font-mono font-medium mb-2">
          <ScanText className="w-3.5 h-3.5 text-black" />
          <span>CAPABILITY 03: MULTIMODAL INFORMATION STRUCTURING</span>
        </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
            ACTIONLENS
          </h1>
          <p className="text-sm font-sans text-slate-500 font-semibold">
            See → Understand → Act
          </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = selectedMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMode(m.id)}
              className={`p-4 rounded-3xl border text-left font-sans transition-all ${
                isActive
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-[#A3E635]' : 'text-black'}`} />
              <div className="text-xs font-bold">{m.label}</div>
              <div className={`text-[10px] font-sans mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{m.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Live Camera Scanner Box */}
      <GlassCard className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-sans text-slate-500 font-bold uppercase tracking-wider">
            AURALENS OPTICAL CAMERA INGESTION
          </div>
          
          <CameraScanner
            onCapture={handleProcessAuraLens}
            isScanning={isProcessing}
            placeholderText={`Align ${selectedMode.toLowerCase()} inside camera frame to capture and extract`}
            badgeLabel="AURALENS CAMERA INGESTION PORTAL"
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-xs font-sans text-slate-600 font-bold">Optional Document / Object Label</label>
          <input
            type="text"
            placeholder={`e.g. ${selectedMode === 'RECEIPT' ? 'Artisan Bistro Receipt' : selectedMode === 'APPLIANCE ERROR CODE' ? 'E4-82 Fault Code' : 'Commercial Contract'}`}
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-black font-semibold focus:outline-none focus:border-black"
          />
        </div>
      </GlassCard>

      {/* Result AI Card */}
      {result && (
        <GlassCard glow className="space-y-6 border-[#84CC16]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">{result.mode} MODE RESULT</span>
              <h2 className="text-xl font-extrabold text-black mt-0.5">{result.title}</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-lime-900 font-mono text-xs font-bold">
              98% PARSED
            </span>
          </div>

          <p className="text-xs text-slate-700 font-sans leading-relaxed">{result.summary}</p>

          {/* Mode-Specific Extracted Data */}
          {result.mode === 'RECEIPT' && result.extractedData.items && (
            <div className="space-y-4 font-sans">
              <div className="rounded-2xl bg-stone-50 border border-slate-200 p-4 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-black border-b border-slate-200 pb-2">
                  <span>ITEM DESCRIPTION</span>
                  <span>PRICE</span>
                </div>
                {result.extractedData.items.map((item: any) => (
                  <div key={item.name} className="flex justify-between text-slate-700">
                    <span>{item.count}x {item.name}</span>
                    <span>${(item.price * item.count).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 space-y-1 text-slate-500 text-[11px]">
                  <div className="flex justify-between"><span>Subtotal:</span><span>${result.extractedData.subtotal}</span></div>
                  <div className="flex justify-between"><span>Tax & Tip:</span><span>${(result.extractedData.tax + result.extractedData.tip).toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-black text-sm pt-1"><span>TOTAL:</span><span className="text-black">${result.extractedData.totalAmount}</span></div>
                </div>
              </div>

              {/* Bill Split Box */}
              <div className="p-4 rounded-2xl bg-stone-900 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#A3E635]" />
                  <div>
                    <div className="font-bold">EQUAL 4-WAY SPLIT</div>
                    <div className="text-slate-400 text-[10px]">Detected 4 diners from item counts</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-[#A3E635]">${result.extractedData.perPersonShare}</div>
                  <div className="text-[10px] text-slate-400">per person</div>
                </div>
              </div>
            </div>
          )}

          {result.mode === 'APPLIANCE ERROR CODE' && (
            <div className="space-y-3 font-sans text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="font-mono text-xs text-amber-900 font-bold">FAULT CODE: {result.extractedData.errorCode}</div>
                <p className="text-amber-950 font-medium">{result.extractedData.faultMeaning}</p>
              </div>

              <div className="space-y-1">
                <strong className="font-mono text-[11px] text-black block">LIKELY CAUSES:</strong>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {result.extractedData.likelyCauses?.map((c: string) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Actions & Report Issue Button */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">RECOMMENDED ACTIONS</span>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>🚨 REPORT ISSUE / FAULT</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.suggestedActions.map((act) => (
                <button
                  key={act}
                  className="p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-slate-200/80 text-left font-sans text-xs text-slate-800 font-semibold flex items-center justify-between transition"
                >
                  <span>{act}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-black shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Emergency Report Modal */}
      {result && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title={result.summary}
          hazardType={`ACTIONLENS Issue / Equipment Fault (${result.title})`}
          severity="HIGH"
          category="AURALENS"
          location="Facility Technical Operations"
          evidenceSummary={result.mode}
        />
      )}
    </div>
  );
};
