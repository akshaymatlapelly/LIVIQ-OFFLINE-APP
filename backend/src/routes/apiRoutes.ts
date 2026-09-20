import { Router } from 'express';
import {
  handleSignup,
  handleSignin,
  handleGetMe,
  handleUpdateProfile,
  handleClassifyScan,
  handleAnalyzeInspection,
  handleAnalyzeMedicine,
  handleAnalyzeAuraLens,
  handleSimulateRadar,
  handleGetHapticCodebook,
  handleEncodeHaptic,
  handleDecodeHaptic,
  handleTransferOptical,
  handleGetHistory,
  handleDeleteHistoryItem,
  handleClearHistory,
  handleGetHardwareStatus,
  handleVoiceIntent
} from '../controllers/apiControllers';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Auth Routes
router.post('/auth/signup', handleSignup);
router.post('/auth/signin', handleSignin);
router.get('/auth/me', authenticateToken, handleGetMe);
router.put('/auth/profile', authenticateToken, handleUpdateProfile);

// Universal Scan Routing
router.post('/scan/classify', handleClassifyScan);

// Capabilities
router.post('/inspection/analyze', handleAnalyzeInspection);
router.post('/medicine/analyze', handleAnalyzeMedicine);
router.post('/auralens/analyze', handleAnalyzeAuraLens);
router.post('/radar/simulate', handleSimulateRadar);

router.get('/haptic/codebook', handleGetHapticCodebook);
router.post('/haptic/encode', handleEncodeHaptic);
router.post('/haptic/decode', handleDecodeHaptic);

router.post('/optical/transfer', handleTransferOptical);

// Voice Assistant
router.post('/voice/intent', handleVoiceIntent);

// History
router.get('/history', handleGetHistory);
router.delete('/history/:id', handleDeleteHistoryItem);
router.delete('/history', handleClearHistory);

// Hardware Status
router.get('/hardware', handleGetHardwareStatus);

export default router;
