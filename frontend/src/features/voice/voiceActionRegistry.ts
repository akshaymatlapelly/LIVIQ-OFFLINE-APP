import { ParsedVoiceIntent } from './types';
import { healTraceSubModulesService } from '../../services/healTraceSubModulesService';

export class VoiceActionRegistry {
  public static executeAction(
    intent: ParsedVoiceIntent,
    navigate: (path: any) => void
  ): boolean {
    switch (intent.action) {
      case 'NAVIGATE_HOME':
        navigate('/home');
        return true;

      case 'OPEN_INSPECTION':
      case 'INSIGHT_SCAN':
      case 'INSIGHT_FACILITY':
        navigate('/insight');
        return true;

      case 'OPEN_MEDICINE':
      case 'MEDSURE_SCAN':
      case 'MEDSURE_EXPLAIN_TELUGU':
        navigate('/medsure');
        return true;

      case 'OPEN_AURALENS':
        navigate('/healtrace');
        return true;

      case 'START_YOGA':
        navigate('/yogatrace');
        return true;

      case 'START_WORKOUT':
        navigate('/gymtrace');
        return true;

      case 'LOG_MEAL':
        navigate('/foodtrace');
        return true;

      case 'ADD_WATER':
        healTraceSubModulesService.addWaterIntake(500, 'Voice Command');
        navigate('/hydratetrace');
        return true;

      case 'HEALTH_REPLAY':
      case 'OPEN_HISTORY':
        navigate('/replay');
        return true;

      case 'OPEN_VOICE':
        navigate('/profile');
        return true;

      case 'OPEN_PROFILE':
        navigate('/profile');
        return true;

      case 'OPEN_HOW_IT_WORKS':
        navigate('/how-it-works');
        return true;

      case 'OPEN_DEMO':
        navigate('/demo');
        return true;

      case 'GO_BACK':
        navigate(-1);
        return true;

      case 'START_SCAN':
        if (intent.targetPath) {
          navigate(intent.targetPath);
        } else {
          navigate('/scan');
        }
        return true;

      case 'CALL_FACILITY_CONFIRMATION':
      case 'LOCATION_SHARE_CONFIRMATION':
      case 'CANCEL':
      case 'SHOW_HELP':
      default:
        if (intent.targetPath) {
          navigate(intent.targetPath);
          return true;
        }
        return false;
    }
  }
}
