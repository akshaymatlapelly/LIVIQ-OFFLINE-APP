export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  preferredLanguage?: string; // e.g. 'en-US', 'te-IN', 'hi-IN', 'ta-IN', 'kn-IN', 'es-ES'
  createdAt?: string;
}

export type CapabilityType = 
  | 'INSPECTION'
  | 'MEDICINE'
  | 'AURALENS'
  | 'RADAR'
  | 'HAPTIC'
  | 'OPTICAL';

export type ScanCategory = 
  | 'Wall Crack'
  | 'Road Damage'
  | 'Electrical Equipment'
  | 'Medicine Package'
  | 'Receipt'
  | 'Document'
  | 'Appliance Error Code'
  | 'Unknown Object';

export interface ScanClassificationResult {
  scanId: string;
  inputCategory: ScanCategory;
  targetCapability: CapabilityType;
  confidence: number;
  routeReason: string;
  recommendedAction: string;
  timestamp: string;
}

export interface InspectionAnalysisResult {
  id: string;
  category: string;
  detectedIssue: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  observation: string;
  explanation: string;
  recommendedAction: string;
  evidenceSummary: string;
  location: string;
  timestamp: string;
  disclaimer: string;
}

export interface MedicineAnalysisResult {
  id: string;
  packageName: string;
  status: 'NO COUNTERFEIT INDICATORS DETECTED' | 'POTENTIAL COUNTERFEIT INDICATORS DETECTED';
  confidence: number;
  observedIndicators: {
    name: string;
    status: 'PASS' | 'FLAGGED' | 'SUSPICIOUS';
    detail: string;
  }[];
  comparisonSummary: string;
  recommendedVerification: string;
  timestamp: string;
  disclaimer: string;
}

export interface AuraLensAnalysisResult {
  id: string;
  mode: 'RECEIPT' | 'DOCUMENT' | 'OBJECT' | 'APPLIANCE ERROR CODE';
  title: string;
  summary: string;
  extractedData: Record<string, any>;
  suggestedActions: string[];
  confidence: number;
  timestamp: string;
}

export interface RadarPoint {
  id: string;
  distanceMeter: number;
  bearingDegree: number;
  motionStatus: 'Stationary' | 'Approaching' | 'Receding' | 'Micro-vibration' | 'Moving';
  signalStrength: number;
  classifiedObject: string;
}

export interface RadarSimulationResult {
  id: string;
  frequencyKhz: number;
  pointsDetected: RadarPoint[];
  environmentMapSummary: string;
  acousticNoiseFloorDb: number;
  timestamp: string;
  disclaimer: string;
}

export interface HapticCodeItem {
  symbol: string;
  label: string;
  pattern: number[];
  intensity: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'EMERGENCY' | 'NAVIGATION' | 'STATUS' | 'CUSTOM';
}

export interface HapticEncodeResponse {
  message: string;
  encodedPattern: number[];
  codebookMatch: string;
  transmissionPayload: string;
  timestamp: string;
}

export interface OpticalTransferResult {
  id: string;
  payload: string;
  sizeBytes: number;
  transferProgressPercent: number;
  opticalChannel: 'FLASH_STROBE' | 'SCREEN_PULSE' | 'DUAL_SPECTRUM';
  errorRate: number;
  integrityVerified: boolean;
  timestamp: string;
  disclaimer: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  type: CapabilityType;
  title: string;
  category: string;
  status: string;
  confidence: number;
  summary: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface HardwareStatus {
  id: string;
  name: string;
  status: 'ONLINE' | 'ACTIVE' | 'CALIBRATING' | 'STANDBY';
  telemetry: string;
  capabilitiesUsed: CapabilityType[];
  description: string;
}
