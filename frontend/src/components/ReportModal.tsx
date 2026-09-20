import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, X, Download, Send, PhoneCall, MapPin } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  hazardType: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'FLAGGED';
  category: 'INSPECTION' | 'MEDICINE' | 'AURALENS';
  location?: string;
  evidenceSummary?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  title,
  hazardType,
  severity = 'HIGH',
  category,
  location = 'Building Sector 4 - Geotag: 37.7749° N, 122.4194° W',
  evidenceSummary
}) => {
  const [recipient, setRecipient] = useState<string>(
    category === 'INSPECTION'
      ? 'Civil Engineering & Safety Board'
      : category === 'MEDICINE'
      ? 'National Drug & Pharmacy Control Authority'
      : 'Technical Service & Repair Operations'
  );
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');

  if (!isOpen) return null;

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `REP-${category}-${Date.now().toString().slice(-6)}`;
    setReportId(id);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">OFFICIAL HAZARD REPORT PROTOCOL</span>
              <h3 className="font-extrabold text-lg text-black leading-tight">Report Critical Issue</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmitReport} className="space-y-4 text-xs font-sans">
            {/* Target Hazard Summary Box */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex justify-between items-center font-mono">
                <span className="font-bold text-rose-900">{hazardType}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-600 text-white uppercase">
                  {severity}
                </span>
              </div>
              <p className="text-rose-800 leading-relaxed text-xs">{title}</p>
              {evidenceSummary && (
                <div className="text-[11px] text-rose-700 font-mono pt-1">
                  Evidence: {evidenceSummary}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Report Recipient Authority</label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-stone-50 border border-slate-200 rounded-xl px-4 py-2.5 font-sans text-xs text-black font-semibold focus:outline-none focus:border-black"
              >
                <option value="Civil Engineering & Safety Board">Civil Engineering & Safety Board</option>
                <option value="National Drug & Pharmacy Control Authority">National Drug & Pharmacy Control Authority</option>
                <option value="Municipal Infrastructure Emergency">Municipal Infrastructure Emergency</option>
                <option value="Technical Service & Repair Operations">Technical Service & Repair Operations</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Geotag Location & Evidence</label>
              <div className="p-3 rounded-xl bg-stone-50 border border-slate-200 text-slate-600 font-mono text-[11px] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Additional Inspector Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Describe observations, immediate risks, or scene photos captured..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-stone-50 border border-slate-200 rounded-xl p-3 font-sans text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Submit Official Report</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4 font-sans">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs text-emerald-700 font-bold">REPORT SUBMITTED SUCCESSFULLY</div>
              <h4 className="text-xl font-extrabold text-black">Incident Case #{reportId}</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto pt-1">
                Dispatched to <strong className="text-black">{recipient}</strong>. Geotag evidence and sensor logs locked in audit trail.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
