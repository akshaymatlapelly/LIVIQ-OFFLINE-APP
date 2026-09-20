import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { IntelligenceService } from '../services/intelligenceService';
import { InspectionService } from '../services/inspectionService';
import { MedicineService } from '../services/medicineService';
import { AuraLensService } from '../services/auraLensService';
import { RadarService } from '../services/radarService';
import { HapticService } from '../services/hapticService';
import { OpticalService } from '../services/opticalService';
import { HistoryService } from '../services/historyService';
import { HardwareService } from '../services/hardwareService';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Auth Controllers
export const handleSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }
    const result = await AuthService.register(name, email, password);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    next(err);
  }
};

export const handleSignin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    const result = await AuthService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message || 'Invalid credentials' });
  }
};

export const handleGetMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const user = await AuthService.getUserById(req.user.userId);
    res.status(200).json({ success: true, data: { user } });
  } catch (err: any) {
    next(err);
  }
};

export const handleUpdateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr_demo_01';
    const { name, email, phone, bio, preferredLanguage } = req.body;
    const user = await AuthService.updateProfile(userId, { name, email, phone, bio, preferredLanguage });
    res.status(200).json({ success: true, data: { user } });
  } catch (err: any) {
    next(err);
  }
};

// Universal Scan Controller
export const handleClassifyScan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ success: false, error: 'Scan category input is required.' });
    }
    const result = IntelligenceService.classifyInput(category);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    next(err);
  }
};

// SENTRIX Inspection Controller
export const handleAnalyzeInspection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category, imageUri } = req.body;
    const result = InspectionService.analyzeInspection(category || 'Wall Crack', imageUri);
    
    // Save to history automatically if logged in
    const userId = req.user?.userId || 'usr_demo_01';
    await HistoryService.addHistory(userId, {
      type: 'INSPECTION',
      title: `${result.detectedIssue} Inspection`,
      category: category || 'Wall Crack',
      status: `${result.riskLevel} RISK`,
      confidence: result.confidence,
      summary: result.observation,
      details: result
    });

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    next(err);
  }
};

// Medicine Investigator Controller
export const handleAnalyzeMedicine = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { packageName, simulateFlagged } = req.body;
    const result = MedicineService.analyzePackage(packageName, Boolean(simulateFlagged));

    const userId = req.user?.userId || 'usr_demo_01';
    await HistoryService.addHistory(userId, {
      type: 'MEDICINE',
      title: `${result.packageName} Screening`,
      category: 'Packaging Visual Verification',
      status: result.status,
      confidence: result.confidence,
      summary: result.comparisonSummary,
      details: result
    });

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    next(err);
  }
};

// AuraLens Controller
export const handleAnalyzeAuraLens = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { mode, title } = req.body;
    const result = AuraLensService.analyze(mode || 'RECEIPT', title);

    const userId = req.user?.userId || 'usr_demo_01';
    await HistoryService.addHistory(userId, {
      type: 'AURALENS',
      title: result.title,
      category: result.mode,
      status: 'PROCESSED',
      confidence: result.confidence,
      summary: result.summary,
      details: result
    });

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    next(err);
  }
};

// Radar Controller
export const handleSimulateRadar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = RadarService.simulateRadarSweep();

    const userId = req.user?.userId || 'usr_demo_01';
    await HistoryService.addHistory(userId, {
      type: 'RADAR',
      title: 'Ultrasonic Acoustic Spatial Radar Mapping',
      category: 'Spatial Sound Radar',
      status: `${result.pointsDetected.length} TARGETS`,
      confidence: 0.93,
      summary: result.environmentMapSummary,
      details: result
    });

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    next(err);
  }
};

// Haptic Controllers
export const handleGetHapticCodebook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const codebook = HapticService.getCodebook();
    res.status(200).json({ success: true, data: { codebook } });
  } catch (err: any) {
    next(err);
  }
};

export const handleEncodeHaptic = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message input is required.' });
    }
    const result = HapticService.encodeMessage(message);

    const userId = req.user?.userId || 'usr_demo_01';
    await HistoryService.addHistory(userId, {
      type: 'HAPTIC',
      title: `Haptic Pattern: "${result.message}"`,
      category: 'Vibration Encoder',
      status: 'ENCODED',
      confidence: 1.0,
      summary: `Pattern sequence: ${result.encodedPattern.join('-')}ms`,
      details: result
    });

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    next(err);
  }
};

export const handleDecodeHaptic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payload } = req.body;
    if (!payload) {
      return res.status(400).json({ success: false, error: 'Payload input is required.' });
    }
    const result = HapticService.decodePayload(payload);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    next(err);
  }
};

// Optical Transfer Controller
export const handleTransferOptical = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { payload } = req.body;
    const result = OpticalService.simulateOpticalTransfer(payload);

    const userId = req.user?.userId || 'usr_demo_01';
    await HistoryService.addHistory(userId, {
      type: 'OPTICAL',
      title: 'Optical Air-Gap Light Transmission',
      category: 'Device-to-Device Data Link',
      status: 'VERIFIED',
      confidence: 0.99,
      summary: `Transferred ${result.sizeBytes} bytes optical light framing payload. Zero RF footprint.`,
      details: result
    });

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    next(err);
  }
};

// History Controllers
export const handleGetHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr_demo_01';
    const filter = req.query.type as string;
    const history = await HistoryService.getUserHistory(userId, filter);
    res.status(200).json({ success: true, data: { history } });
  } catch (err: any) {
    next(err);
  }
};

export const handleDeleteHistoryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await HistoryService.deleteHistory(id);
    res.status(200).json({ success: true, message: 'History item deleted.' });
  } catch (err: any) {
    next(err);
  }
};

export const handleClearHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId || 'usr_demo_01';
    await HistoryService.clearAll(userId);
    res.status(200).json({ success: true, message: 'History cleared.' });
  } catch (err: any) {
    next(err);
  }
};

// Hardware Status Controller
export const handleGetHardwareStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hardware = await HardwareService.getHardwareStatuses();
    res.status(200).json({ success: true, data: { hardware } });
  } catch (err: any) {
    next(err);
  }
};

// Voice Intent Controller
export const handleVoiceIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transcript, currentRoute } = req.body;
    res.status(200).json({
      success: true,
      data: {
        receivedTranscript: transcript || '',
        currentRoute: currentRoute || '/home',
        status: 'PROCESSED'
      }
    });
  } catch (err: any) {
    next(err);
  }
};
