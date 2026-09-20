import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Upload, CheckCircle2, Zap, Shield, Image } from 'lucide-react';

interface CameraScannerProps {
  onCapture: () => void;
  isScanning: boolean;
  placeholderText?: string;
  badgeLabel?: string;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onCapture,
  isScanning,
  placeholderText = 'Align camera frame with target item',
  badgeLabel = 'LIVE OPTICAL CAMERA STREAM'
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useUploadMode, setUseUploadMode] = useState<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      if (useUploadMode) return;
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } catch (err: any) {
        console.warn('Camera access unavailable:', err);
        setCameraError('Camera access unavailable. Using high-resolution optical preview simulator.');
        setCameraActive(false);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useUploadMode]);

  return (
    <div className="space-y-4">
      {/* Viewport Frame */}
      <div className="relative aspect-video rounded-3xl bg-stone-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center tech-grid shadow-lg">
        {/* Top Status Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-white">
          <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-[#A3E635] animate-pulse' : 'bg-amber-400'}`} />
          <span>{cameraActive ? badgeLabel : 'OPTICAL SENSOR SIMULATOR'}</span>
        </div>

        {/* Top Right Toggle */}
        <button
          type="button"
          onClick={() => setUseUploadMode(!useUploadMode)}
          className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold shadow-sm flex items-center gap-1 transition"
        >
          {useUploadMode ? <Camera className="w-3 h-3 text-black" /> : <Image className="w-3 h-3 text-black" />}
          <span>{useUploadMode ? 'Live Camera' : 'Demo Photo'}</span>
        </button>

        {/* Live Camera Stream */}
        {!useUploadMode && (
          <video
            ref={videoRef}
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              cameraActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Reticle Overlay */}
        <div className="absolute inset-6 border border-dashed border-white/40 rounded-2xl pointer-events-none flex items-center justify-center z-10">
          {/* Corner Markers */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#A3E635]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#A3E635]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#A3E635]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#A3E635]" />

          {/* Laser Scanning Line */}
          {isScanning && (
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#A3E635] to-transparent shadow-[0_0_15px_#A3E635] animate-scan-line" />
          )}
        </div>

        {/* Fallback Display if Camera Inactive or Photo Mode */}
        {(!cameraActive || useUploadMode) && !isScanning && (
          <div className="text-center space-y-2 p-6 z-10 text-white">
            <Camera className="w-10 h-10 text-[#A3E635] mx-auto mb-1 animate-pulse" />
            <div className="font-mono text-xs font-bold">{placeholderText}</div>
            <div className="text-[11px] text-slate-400 font-sans max-w-xs mx-auto">
              Ready for real-time optical frame extraction and AI inference.
            </div>
          </div>
        )}

        {/* Loading Spinner during scan */}
        {isScanning && (
          <div className="text-center space-y-3 p-4 z-20 bg-black/60 backdrop-blur-sm inset-0 absolute flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-3 border-[#A3E635] border-t-transparent animate-spin" />
            <div className="font-mono text-xs text-[#A3E635] font-bold tracking-wider uppercase">
              Analyzing Optical Telemetry...
            </div>
          </div>
        )}
      </div>

      {/* Capture Button */}
      <button
        onClick={onCapture}
        disabled={isScanning}
        className="w-full py-4 rounded-full font-sans text-xs font-extrabold text-white bg-black hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 transition transform hover:scale-[1.01] disabled:opacity-50"
      >
        <Camera className="w-4 h-4 text-[#A3E635]" />
        <span>{isScanning ? 'PROCESSING OPTICAL SCAN...' : '📸 CAPTURE FRAME & RUN SCAN'}</span>
      </button>
    </div>
  );
};
