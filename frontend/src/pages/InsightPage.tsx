import React, { useState } from 'react';
import { CameraScanner } from '../components/CameraScanner';
import {
  AlertTriangle,
  Shield,
  PhoneCall,
  MapPin,
  Clock,
  Car,
  Users,
  Eye,
  Navigation,
  Mic,
  Volume2,
  Share2,
  UserCheck,
  History,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Info,
  AlertCircle,
  Phone,
  Compass,
  FileText,
  Zap,
  Play,
  Square
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { speechService } from '../features/voice/speechService';

type InsightStep = 'LANDING' | 'SCAN' | 'UNDERSTAND' | 'LOCATE' | 'CONNECT' | 'REPORT';

interface IncidentReportData {
  id: string;
  timestamp: string;
  location: string;
  gpsCoords: string;
  classification: string;
  visibleVehicles: number;
  peopleVisible: number;
  hazards: string[];
  facilitySelected?: string;
  callStatus: string;
  notes: string;
}

export const InsightPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<InsightStep>('LANDING');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  // Modal Confirmation State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // Audio Playback State for "Speak for Me"
  const [isPlayingBriefing, setIsPlayingBriefing] = useState(false);

  // History State
  const [incidentHistory, setIncidentHistory] = useState<IncidentReportData[]>([
    {
      id: 'inc_01',
      timestamp: '15 SEP 2026, 20:45 IST',
      location: 'Jubilee Hills Main Rd, Sector 4',
      gpsCoords: '17.4385° N, 78.4482° E',
      classification: 'Vehicle Collision',
      visibleVehicles: 2,
      peopleVisible: 3,
      hazards: ['Broken glass on roadway', 'Traffic obstruction'],
      facilitySelected: 'City General Trauma & Emergency Center',
      callStatus: 'ALERTED & CONNECTED',
      notes: 'Initial responder triage packet transmitted.'
    }
  ]);

  // Mock Emergency Facilities
  const emergencyFacilities = [
    {
      id: 'fac_01',
      name: 'City General Trauma & Emergency Center',
      distance: '1.2 km',
      suitability: '24/7 Level 1 Trauma Center',
      routeTime: '4 mins',
      phone: '108 / +91 40 2300 1122',
      address: 'Plot 12, Jubilee Hills Road No. 36',
      dataStatus: 'LOCAL CACHED & LIVE GPS'
    },
    {
      id: 'fac_02',
      name: 'Metro Community Urgent Care Hospital',
      distance: '3.4 km',
      suitability: '24/7 ER & Ambulance Base',
      routeTime: '8 mins',
      phone: '+91 40 2355 9900',
      address: 'Banjara Hills Rd No. 12',
      dataStatus: 'LOCAL CACHED DATA'
    },
    {
      id: 'fac_03',
      name: 'St. Jude Speciality Medical Center',
      distance: '5.1 km',
      suitability: 'Super-Specialty ER & ICU',
      routeTime: '12 mins',
      phone: '+91 40 4400 5500',
      address: 'Madhapur Main Boulevard',
      dataStatus: 'LOCAL CACHED DATA'
    }
  ];

  const [selectedFacility, setSelectedFacility] = useState(emergencyFacilities[0]);

  // Handle Capture Action
  const handleCapture = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        incidentType: 'Vehicle Collision',
        visibleVehicles: 2,
        peopleVisible: 3,
        potentialHazards: ['Broken glass on roadway', 'Traffic obstruction', 'Fluid leak risk'],
        location: 'Jubilee Hills Main Road, Sector 4',
        gps: '17.4385° N, 78.4482° E',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
        confidence: 0.96
      });
      setActiveStep('UNDERSTAND');
    }, 2200);
  };

  // Generate Factual Briefing for "Speak for Me"
  const speakForMeText = `An incident occurred at ${scanResult?.location || 'Jubilee Hills Main Road'} (GPS ${scanResult?.gps || '17.4385 N, 78.4482 E'}). LIVIQ detected a ${scanResult?.incidentType?.toLowerCase() || 'vehicle collision'} involving ${scanResult?.visibleVehicles || 2} visible vehicles. ${scanResult?.peopleVisible || 3} people are visible. The scene contains ${scanResult?.potentialHazards?.join(' and ') || 'broken glass'}. Please assess the situation.`;

  const handleSpeakForMe = () => {
    if (isPlayingBriefing) {
      speechService.stop();
      setIsPlayingBriefing(false);
      return;
    }

    setIsPlayingBriefing(true);
    speechService.speak(speakForMeText, 'en-US', () => {
      setIsPlayingBriefing(false);
    });
  };

  const handleActionWithConfirm = (title: string, description: string, action: () => void) => {
    setConfirmModal({
      open: true,
      title,
      description,
      onConfirm: () => {
        setConfirmModal(null);
        action();
      }
    });
  };

  const saveIncidentReport = () => {
    const newReport: IncidentReportData = {
      id: `inc_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      location: scanResult?.location || 'Jubilee Hills Main Rd',
      gpsCoords: scanResult?.gps || '17.4385° N, 78.4482° E',
      classification: scanResult?.incidentType || 'Vehicle Collision',
      visibleVehicles: scanResult?.visibleVehicles || 2,
      peopleVisible: scanResult?.peopleVisible || 3,
      hazards: scanResult?.potentialHazards || ['Broken glass on roadway'],
      facilitySelected: selectedFacility.name,
      callStatus: 'ALERTED & CONNECTED',
      notes: 'Emergency incident saved to health record timeline.'
    };

    setIncidentHistory([newReport, ...incidentHistory]);
    setActiveStep('REPORT');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fadeIn font-sans">
      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{confirmModal.title}</h3>
                <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">EMERGENCY CONFIRMATION</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {confirmModal.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-sans text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-extrabold shadow-md transition"
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Stepper Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {activeStep !== 'LANDING' && (
            <button
              type="button"
              onClick={() => {
                if (activeStep === 'SCAN') setActiveStep('LANDING');
                else if (activeStep === 'UNDERSTAND') setActiveStep('SCAN');
                else if (activeStep === 'LOCATE') setActiveStep('UNDERSTAND');
                else if (activeStep === 'CONNECT') setActiveStep('LOCATE');
                else if (activeStep === 'REPORT') setActiveStep('LANDING');
              }}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-black transition"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200 text-[10px] font-mono font-bold">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>INSIGHT • EMERGENCY RESPONSE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              {activeStep === 'LANDING' && 'INSIGHT Overview'}
              {activeStep === 'SCAN' && 'Incident Scanner'}
              {activeStep === 'UNDERSTAND' && 'Incident Understanding'}
              {activeStep === 'LOCATE' && 'Emergency Facility Routing'}
              {activeStep === 'CONNECT' && 'Connect & Speak for Me'}
              {activeStep === 'REPORT' && 'Incident Report & History'}
            </h1>
          </div>
        </div>

        {/* Stepper Badges */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono font-bold">
          {(['LANDING', 'SCAN', 'UNDERSTAND', 'LOCATE', 'CONNECT', 'REPORT'] as const).map((st, i) => (
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

      {/* SCREEN 1: INSIGHT LANDING PAGE */}
      {activeStep === 'LANDING' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Hero Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 font-mono text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>LAYER 1 • EMERGENCY RESPONSE INTELLIGENCE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                INSIGHT
              </h2>
              <p className="text-sm font-bold text-rose-300 font-sans">
                "When something goes wrong."
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                On-device Emergency Response Intelligence designed to reduce friction, eliminate delays, and coordinate incident response during critical situations.
              </p>
            </div>

            {/* Primary CTA: SCAN INCIDENT */}
            <div className="pt-2 relative z-10">
              <button
                type="button"
                onClick={() => setActiveStep('SCAN')}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-sans font-extrabold text-sm py-4 px-8 rounded-full shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <CameraScanner onCapture={() => {}} isScanning={false} />
                <Eye className="w-5 h-5 text-white" />
                <span>SCAN INCIDENT NOW</span>
                <ChevronRight className="w-4 h-4 text-white stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => setActiveStep('LOCATE')}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-left space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-black text-[#A3E635] flex items-center justify-center group-hover:scale-105 transition">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-black font-sans">Find Emergency Facility</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Locate nearest trauma & 24/7 ER units</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleActionWithConfirm(
                'Share Emergency Location',
                'Are you sure you want to broadcast your live GPS coordinates (17.4385° N, 78.4482° E) to emergency responders?',
                () => setActiveStep('CONNECT')
              )}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-left space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-black text-rose-400 flex items-center justify-center group-hover:scale-105 transition">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-black font-sans">Share Location</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Transmit live GPS telemetry</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleActionWithConfirm(
                'Alert Emergency Contacts',
                'Send emergency notification SMS to your connected primary contact (Dr. Sarah Jenkins)?',
                () => setActiveStep('CONNECT')
              )}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-left space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-black text-[#A3E635] flex items-center justify-center group-hover:scale-105 transition">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-black font-sans">Emergency Contacts</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Alert 1 connected trusted person</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('REPORT')}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-black transition text-left space-y-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-black font-sans">Incident History</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Review past saved triage reports</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: INCIDENT SCANNER */}
      {activeStep === 'SCAN' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-extrabold text-black font-sans">Emergency Incident Camera Viewport</h2>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                NPU INCIDENT DETECTOR ACTIVE
              </span>
            </div>

            <CameraScanner
              onCapture={handleCapture}
              isScanning={isScanning}
              placeholderText="Align camera frame with incident scene, vehicles, or physical environment"
              badgeLabel="INSIGHT EMERGENCY OPTICAL STREAM"
            />

            <p className="text-xs text-slate-500 font-sans text-center">
              Keep camera steady. LIVIQ will frame visible objects, vehicle count, and environmental hazards.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Info className="w-4 h-4 text-black" />
              <h3 className="text-sm font-extrabold text-black">Scan Telemetry & Guidance</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-sans">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Visible Observation Guidelines:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  LIVIQ extracts visible facts (vehicles, people count, glass/obstacles). It does <strong>NOT</strong> make medical diagnoses or definitive injury claims.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FBFBF8] border border-slate-200 space-y-2 font-mono text-xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Target Telemetry:</div>
                <div>• Auto-Detect Vehicle Collision</div>
                <div>• Count Visible Bystanders/Passengers</div>
                <div>• Flag Obstructions & Hazard Hazards</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 3: INCIDENT UNDERSTANDING */}
      {activeStep === 'UNDERSTAND' && scanResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase">INCIDENT UNDERSTANDING REPORT</span>
              <h2 className="text-2xl font-extrabold text-black mt-0.5">{scanResult.incidentType}</h2>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-200 text-xs font-mono font-extrabold">
              AI CONFIDENCE: {(scanResult.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 font-mono uppercase">What LIVIQ Sees (Visible Observations):</div>
                <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                  Camera optical frame identified a <strong>{scanResult.incidentType}</strong>. The scene contains <strong>{scanResult.visibleVehicles} visible vehicles</strong> and <strong>{scanResult.peopleVisible} visible people</strong>.
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 font-mono uppercase">Location & Time:</div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1 font-mono">
                  <div><strong>Address:</strong> {scanResult.location}</div>
                  <div><strong>GPS:</strong> {scanResult.gps}</div>
                  <div><strong>Timestamp:</strong> {scanResult.timestamp}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 font-mono uppercase">Potential Scene Hazards:</div>
                <div className="space-y-1.5">
                  {scanResult.potentialHazards.map((hz: string, i: number) => (
                    <div key={i} className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{hz}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-sans leading-relaxed">
                <strong>Safety Note:</strong> These structured details are generated from real-time visual frame analysis to facilitate first responder coordination.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActiveStep('LOCATE')}
              className="w-full sm:w-auto bg-black hover:bg-slate-800 text-white font-sans text-xs font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition"
            >
              <span>Locate Nearby Emergency Facilities</span>
              <Navigation className="w-4 h-4 text-[#A3E635]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('CONNECT')}
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-extrabold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>Connect & Speak For Me</span>
              <PhoneCall className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 4: EMERGENCY FACILITY ROUTING */}
      {activeStep === 'LOCATE' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-black">Nearby Emergency Facilities</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Ranked by distance and emergency trauma suitability</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              LOCAL CACHED & LIVE GPS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyFacilities.map((fac) => (
              <div
                key={fac.id}
                className={`bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between space-y-4 transition ${
                  selectedFacility.id === fac.id ? 'border-black ring-2 ring-black/10' : 'border-slate-200/80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-slate-400">{fac.distance} AWAY</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {fac.routeTime} EST
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-black leading-tight">{fac.name}</h3>
                    <p className="text-xs font-bold text-rose-600 font-sans mt-1">{fac.suitability}</p>
                    <p className="text-xs text-slate-500 font-sans mt-1">{fac.address}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">{fac.dataStatus}</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFacility(fac);
                        handleActionWithConfirm(
                          `Call Emergency Center`,
                          `Place direct emergency phone call to ${fac.name} (${fac.phone})?`,
                          () => setActiveStep('CONNECT')
                        );
                      }}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFacility(fac);
                        setActiveStep('CONNECT');
                      }}
                      className="flex-1 bg-black hover:bg-slate-800 text-white font-sans text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>Route</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep('CONNECT')}
              className="bg-black hover:bg-slate-800 text-white font-sans text-xs font-bold py-3.5 px-6 rounded-full flex items-center gap-2 shadow-md transition"
            >
              <span>Proceed to Connect & Speak For Me</span>
              <ChevronRight className="w-4 h-4 text-[#A3E635]" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 5: CONNECT & "SPEAK FOR ME" */}
      {activeStep === 'CONNECT' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Action Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => handleActionWithConfirm(
                `Emergency Call to ${selectedFacility.name}`,
                `Confirm placing an urgent phone call to ${selectedFacility.name} (${selectedFacility.phone})?`,
                () => alert(`Dialing ${selectedFacility.phone}... Emergency connection active.`)
              )}
              className="p-6 rounded-3xl bg-rose-600 hover:bg-rose-700 text-white text-left space-y-3 shadow-md transition transform hover:scale-[1.02] group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base font-sans">CALL FACILITY</h3>
                <p className="text-xs text-rose-100 font-sans mt-0.5">{selectedFacility.name}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleActionWithConfirm(
                'Broadcast Emergency Location',
                'Share live GPS coordinates (17.4385° N, 78.4482° E) with first responders?',
                () => alert('Live GPS location packet broadcasted.')
              )}
              className="p-6 rounded-3xl bg-black hover:bg-slate-800 text-white text-left space-y-3 shadow-md transition transform hover:scale-[1.02] group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-[#A3E635]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base font-sans">SHARE LOCATION</h3>
                <p className="text-xs text-slate-300 font-sans mt-0.5">Jubilee Hills Main Rd (17.4385° N)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleActionWithConfirm(
                'Alert Primary Contact',
                'Send emergency incident SMS and call notification to Dr. Sarah Jenkins?',
                () => alert('Notification SMS sent to Dr. Sarah Jenkins.')
              )}
              className="p-6 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white text-left space-y-3 shadow-md transition transform hover:scale-[1.02] group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base font-sans">CONTACT TRUSTED PERSON</h3>
                <p className="text-xs text-slate-300 font-sans mt-0.5">Dr. Sarah Jenkins (+1 555-0192)</p>
              </div>
            </button>
          </div>

          {/* SPEAK FOR ME BOX */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-black" />
                <h3 className="font-extrabold text-lg text-black">SPEAK FOR ME (Concise Factual Briefing)</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                FACTS ONLY • NO INVENTED INJURIES
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBFBF8] border border-slate-200 text-sm font-mono text-slate-900 leading-relaxed">
              "{speakForMeText}"
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handleSpeakForMe}
                className={`w-full sm:w-auto font-sans font-extrabold text-xs px-6 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md transition ${
                  isPlayingBriefing ? 'bg-rose-600 text-white' : 'bg-black text-white hover:bg-slate-800'
                }`}
              >
                {isPlayingBriefing ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 text-[#A3E635] fill-current" />}
                <span>{isPlayingBriefing ? 'Stop Voice Briefing' : 'Play Voice Briefing (TTS)'}</span>
              </button>

              <button
                type="button"
                onClick={saveIncidentReport}
                className="w-full sm:w-auto bg-[#A3E635] hover:bg-[#84CC16] text-black font-sans font-extrabold text-xs py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-md transition"
              >
                <span>Save Incident Report & History</span>
                <CheckCircle2 className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 6: INCIDENT REPORT & HISTORY */}
      {activeStep === 'REPORT' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Latest Saved Report Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-black" />
                <h2 className="text-xl font-extrabold text-black">Incident Report Summary</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-mono font-extrabold">
                SAVED & ARCHIVED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">CLASSIFICATION</div>
                <div className="font-extrabold text-black text-sm">{incidentHistory[0]?.classification || 'Vehicle Collision'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">TIMESTAMP & GPS</div>
                <div className="font-mono text-slate-800">{incidentHistory[0]?.timestamp} ({incidentHistory[0]?.gpsCoords})</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBF8] border border-slate-200 text-xs text-slate-700 space-y-2 font-sans">
              <div className="font-bold text-black font-mono text-[10px] uppercase">VISIBLE OBSERVATIONS SUMMARY:</div>
              <p>
                LIVIQ detected a {incidentHistory[0]?.classification.toLowerCase()} at {incidentHistory[0]?.location}. Visible count: {incidentHistory[0]?.visibleVehicles} vehicles, {incidentHistory[0]?.peopleVisible} people. Potential hazards: {incidentHistory[0]?.hazards.join(', ')}.
              </p>
            </div>
          </div>

          {/* INCIDENT HISTORY STREAM */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-black" />
                <h3 className="font-extrabold text-base text-black">Incident History Logs</h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">{incidentHistory.length} ENTRIES</span>
            </div>

            <div className="space-y-3">
              {incidentHistory.map((inc) => (
                <div key={inc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{inc.timestamp}</span>
                      <span className="font-extrabold text-black">{inc.classification}</span>
                    </div>
                    <p className="text-slate-600">{inc.location} ({inc.gpsCoords})</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono text-[10px] font-bold self-start sm:self-center">
                    {inc.callStatus}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={() => setActiveStep('LANDING')}
                className="bg-black hover:bg-slate-800 text-white font-sans text-xs font-bold py-3 px-6 rounded-full flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to INSIGHT Overview</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
