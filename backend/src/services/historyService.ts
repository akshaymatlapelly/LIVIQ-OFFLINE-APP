import { InMemoryRepository } from '../repository/inMemoryDb';
import { HistoryItem } from '../types';

export class HistoryService {
  private static repo = InMemoryRepository.getInstance();

  public static async getUserHistory(userId: string, filterType?: string): Promise<HistoryItem[]> {
    return this.repo.getHistory(userId, filterType);
  }

  public static async addHistory(userId: string, item: Omit<HistoryItem, 'id' | 'timestamp' | 'userId'>): Promise<HistoryItem> {
    return this.repo.addHistoryItem({
      ...item,
      userId
    });
  }

  public static async deleteHistory(id: string): Promise<boolean> {
    return this.repo.deleteHistoryItem(id);
  }

  public static async clearAll(userId: string): Promise<void> {
    return this.repo.clearHistory(userId);
  }
}
