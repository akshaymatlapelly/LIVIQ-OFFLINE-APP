// liviqPrivacyService.ts - Service & Storage for LIVIQ Privacy & Safety Architecture

export interface PrivacyPermissions {
  cameraAccess: boolean;
  microphoneAccess: boolean;
  locationAccess: boolean;
  healthDataAccess: boolean;
  medicineLogAccess: boolean;
  cloudSyncAccess: boolean;
  emergencyCallConfirmationRequired: boolean;
  locationShareConfirmationRequired: boolean;
}

export interface PrivacyPrinciple {
  id: number;
  title: string;
  description: string;
  enforcementMechanism: string;
  status: 'ENFORCED ON-DEVICE';
}

const PRIVACY_PERMISSIONS_KEY = 'liviq_privacy_permissions_v1';

const DEFAULT_PERMISSIONS: PrivacyPermissions = {
  cameraAccess: true,
  microphoneAccess: true,
  locationAccess: true,
  healthDataAccess: true,
  medicineLogAccess: true,
  cloudSyncAccess: true,
  emergencyCallConfirmationRequired: true,
  locationShareConfirmationRequired: true
};

export const CORE_12_PRINCIPLES: PrivacyPrinciple[] = [
  { id: 1, title: 'Local-First Processing', description: 'AI inference (Vision, OCR, Pose) runs 100% on-device via Snapdragon NPU/CPU.', enforcementMechanism: 'On-Device Execution Providers', status: 'ENFORCED ON-DEVICE' },
  { id: 2, title: 'Explicit Location Permission', description: 'GPS coordinates are never shared without explicit user confirmation.', enforcementMechanism: 'Interactive Modal Locks', status: 'ENFORCED ON-DEVICE' },
  { id: 3, title: 'Explicit Call Confirmation', description: 'Emergency 108/112 calls require multi-step user button confirmation.', enforcementMechanism: 'Confirmation Modal Requirement', status: 'ENFORCED ON-DEVICE' },
  { id: 4, title: 'User Data Control', description: 'Users can reset baselines, export timeline JSON, or wipe local data at any time.', enforcementMechanism: 'Local Storage Wiping API', status: 'ENFORCED ON-DEVICE' },
  { id: 5, title: 'Clear Sync Telemetry', description: 'Every cloud backup sync shows explicit status pills and pending queue counts.', enforcementMechanism: 'OfflineSyncService Telemetry', status: 'ENFORCED ON-DEVICE' },
  { id: 6, title: 'No Hidden Medical Claims', description: 'LIVIQ explicitly avoids clinical diagnostic claims across all screens.', enforcementMechanism: 'Content Guardrails Engine', status: 'ENFORCED ON-DEVICE' },
  { id: 7, title: 'No Image Diagnosis', description: 'Camera frames perform structural observation & triage, NOT clinical disease diagnosis.', enforcementMechanism: 'Observation-Only Guardrails', status: 'ENFORCED ON-DEVICE' },
  { id: 8, title: 'No Medication Prescribing', description: 'MEDSURE parses packaging label text; it never prescribes or recommends drugs.', enforcementMechanism: 'Label Verification Protocol', status: 'ENFORCED ON-DEVICE' },
  { id: 9, title: 'No Dosage Changes', description: 'MEDSURE never alters prescribed dosages. Users are directed to pharmacists.', enforcementMechanism: 'Dosage Modification Guardrail', status: 'ENFORCED ON-DEVICE' },
  { id: 10, title: 'Packaging Verification Limit', description: 'Visual scans verify label text & batch numbers; they do not guarantee chemical purity.', enforcementMechanism: 'Packaging Limit Disclaimer', status: 'ENFORCED ON-DEVICE' },
  { id: 11, title: 'Correlation ≠ Causation', description: 'Health Replay co-occurrences represent self-tracking patterns, not medical causation.', enforcementMechanism: 'Pattern Exploration Engine', status: 'ENFORCED ON-DEVICE' },
  { id: 12, title: 'Emergency Service Direction', description: 'Emergency situations direct users toward certified professional emergency services.', enforcementMechanism: '108/112 Triage Routing', status: 'ENFORCED ON-DEVICE' }
];

export class LiviqPrivacyService {
  public getPermissions(): PrivacyPermissions {
    try {
      const stored = localStorage.getItem(PRIVACY_PERMISSIONS_KEY);
      if (!stored) {
        localStorage.setItem(PRIVACY_PERMISSIONS_KEY, JSON.stringify(DEFAULT_PERMISSIONS));
        return DEFAULT_PERMISSIONS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_PERMISSIONS;
    }
  }

  public updatePermission<K extends keyof PrivacyPermissions>(key: K, value: PrivacyPermissions[K]): PrivacyPermissions {
    const current = this.getPermissions();
    const updated = { ...current, [key]: value };
    localStorage.setItem(PRIVACY_PERMISSIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('liviq-privacy-updated', { detail: updated }));
    return updated;
  }

  public exportUserDataJson(): void {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('liviq_')) {
        try {
          data[k] = JSON.parse(localStorage.getItem(k) || '');
        } catch {
          data[k] = localStorage.getItem(k);
        }
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LIVIQ_Health_Telemetry_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  public clearAllLocalData(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('liviq_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new CustomEvent('liviq-privacy-cleared'));
  }
}

export const liviqPrivacyService = new LiviqPrivacyService();
