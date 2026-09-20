import { InMemoryRepository } from '../repository/inMemoryDb';
import { HardwareStatus } from '../types';

export class HardwareService {
  private static repo = InMemoryRepository.getInstance();

  public static async getHardwareStatuses(): Promise<HardwareStatus[]> {
    return this.repo.getHardwareStatuses();
  }
}
