// offlineSyncService.ts - Offline-First Sync Queue & Network Status Architecture for LIVIQ
// Philosophy: OFFLINE = CORE (100% on-device functionality), ONLINE = BOOST (cloud backup & fresh data updates)

export type EntityType = 
  | 'INCIDENT' 
  | 'MEDICINE' 
  | 'FOOD' 
  | 'YOGA' 
  | 'GYM' 
  | 'SLEEP' 
  | 'WATER' 
  | 'ACTIVITY' 
  | 'BASELINE';

export interface SyncQueueItem {
  id: string;
  entityType: EntityType;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: string;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retryCount: number;
}

const SYNC_QUEUE_KEY = 'liviq_offline_sync_queue_v1';
const SYNC_STATS_KEY = 'liviq_offline_sync_stats_v1';

export class OfflineSyncService {
  private isOnlineState: boolean;

  constructor() {
    this.isOnlineState = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.initNetworkListeners();
  }

  private initNetworkListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnlineState = true;
      this.notifyStatusChange();
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnlineState = false;
      this.notifyStatusChange();
    });
  }

  public getIsOnline(): boolean {
    return this.isOnlineState;
  }

  public getQueue(): SyncQueueItem[] {
    try {
      const stored = localStorage.getItem(SYNC_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public enqueue(entityType: EntityType, action: 'CREATE' | 'UPDATE' | 'DELETE', payload: any): SyncQueueItem {
    const queue = this.getQueue();
    const newItem: SyncQueueItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      entityType,
      action,
      payload,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      retryCount: 0
    };

    const updated = [newItem, ...queue];
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
    this.notifyStatusChange();

    // If online, attempt immediate background sync
    if (this.isOnlineState) {
      setTimeout(() => this.processQueue(), 500);
    }

    return newItem;
  }

  public async processQueue(): Promise<{ syncedCount: number; remainingPending: number }> {
    if (!this.isOnlineState) {
      return { syncedCount: 0, remainingPending: this.getQueue().filter(i => i.status === 'PENDING').length };
    }

    const queue = this.getQueue();
    const pendingItems = queue.filter(item => item.status === 'PENDING');
    if (pendingItems.length === 0) {
      return { syncedCount: 0, remainingPending: 0 };
    }

    let syncedCount = 0;

    // Process pending sync queue items sequentially
    for (const item of pendingItems) {
      item.status = 'SYNCING';
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));

      // Simulate cloud backup sync transmission latency
      await new Promise(resolve => setTimeout(resolve, 300));

      item.status = 'SYNCED';
      syncedCount++;
    }

    // Retain completed synced queue records and update stats
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    localStorage.setItem(SYNC_STATS_KEY, JSON.stringify({
      lastSyncTimestamp: new Date().toISOString(),
      totalSyncedRecords: (this.getSyncStats().totalSyncedRecords || 0) + syncedCount
    }));

    this.notifyStatusChange();
    window.dispatchEvent(new CustomEvent('liviq-sync-completed', { detail: { syncedCount } }));

    return {
      syncedCount,
      remainingPending: this.getQueue().filter(i => i.status === 'PENDING').length
    };
  }

  public getSyncStats() {
    const queue = this.getQueue();
    const pendingCount = queue.filter(i => i.status === 'PENDING').length;
    let totalSyncedRecords = 0;
    let lastSyncTimestamp = 'Never';

    try {
      const stored = localStorage.getItem(SYNC_STATS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        totalSyncedRecords = parsed.totalSyncedRecords || 0;
        lastSyncTimestamp = parsed.lastSyncTimestamp
          ? new Date(parsed.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Never';
      }
    } catch {
      // fallback
    }

    return {
      isOnline: this.isOnlineState,
      pendingCount,
      totalSyncedRecords,
      lastSyncTimestamp
    };
  }

  private notifyStatusChange() {
    window.dispatchEvent(new CustomEvent('liviq-network-status-changed', { detail: this.getSyncStats() }));
  }
}

export const offlineSyncService = new OfflineSyncService();
