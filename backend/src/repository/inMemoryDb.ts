import { User, HistoryItem, HardwareStatus } from '../types';
import bcrypt from 'bcryptjs';

// Pre-seeded Demo User: demo@sentrix.ai / password123
const demoPasswordHash = bcrypt.hashSync('password123', 10);

export class InMemoryRepository {
  private static instance: InMemoryRepository;

  private users: User[] = [
    {
      id: 'usr_demo_01',
      name: 'Akshay Mercer',
      email: 'demo@sentrix.ai',
      passwordHash: demoPasswordHash,
      phone: '+91 98765 43210',
      bio: 'Real-World Intelligence Systems Specialist & Sensor Network Architect',
      preferredLanguage: 'en-US',
      createdAt: new Date().toISOString()
    }
  ];

  private history: HistoryItem[] = [
    {
      id: 'hist_01',
      userId: 'usr_demo_01',
      type: 'INSPECTION',
      title: 'Structural Wall Inspection',
      category: 'Wall Crack',
      status: 'HIGH RISK',
      confidence: 0.94,
      summary: 'Deep shear fracture detected along main load-bearing brick wall.',
      details: {
        riskLevel: 'HIGH',
        location: 'Building B - North Wall',
        action: 'Notify building safety engineer immediately.'
      },
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'hist_02',
      userId: 'usr_demo_01',
      type: 'MEDICINE',
      title: 'Amoxicillin Packaging Screening',
      category: 'Blister Pack',
      status: 'NO SUSPICIOUS INDICATORS',
      confidence: 0.97,
      summary: 'Print alignment, font kerning, and edge seals match authentic manufacturer benchmarks.',
      details: {
        observedIndicatorsCount: 5,
        passedCount: 5
      },
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'hist_03',
      userId: 'usr_demo_01',
      type: 'AURALENS',
      title: 'Bistro Receipt Breakdown',
      category: 'Receipt',
      status: 'PROCESSED',
      confidence: 0.98,
      summary: 'Extracted $142.50 total. Split into 4 equal shares ($35.63 / person).',
      details: {
        totalAmount: '$142.50',
        itemsCount: 6
      },
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'hist_04',
      userId: 'usr_demo_01',
      type: 'RADAR',
      title: 'Acoustic Room Mapping',
      category: 'Spatial Sound Radar',
      status: '2 OBJECTS MAPPED',
      confidence: 0.91,
      summary: 'Mapped stationary obstacle at 2.4m left and dynamic target at 4.1m center.',
      details: {
        points: 2,
        frequency: '21.5 kHz'
      },
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];

  private hardware: HardwareStatus[] = [
    {
      id: 'hw_cam',
      name: 'High-Resolution Camera Array',
      status: 'ONLINE',
      telemetry: '4K @ 60 FPS / Macro Lens Ready',
      capabilitiesUsed: ['INSPECTION', 'MEDICINE', 'AURALENS', 'OPTICAL'],
      description: 'Captures visual spectrum data for structural analysis, OCR, package verification, and optical signal pulses.'
    },
    {
      id: 'hw_mic',
      name: 'Directional Acoustic Microphone',
      status: 'ONLINE',
      telemetry: '192 kHz / Ultrasonic Reception Active',
      capabilitiesUsed: ['RADAR'],
      description: 'Receives reflected high-frequency acoustic echo signals for spatial environment mapping.'
    },
    {
      id: 'hw_imu',
      name: '6-Axis IMU (Gyro + Accelerometer)',
      status: 'ONLINE',
      telemetry: '1000 Hz Polling / Pitch Roll Yaw Calibrated',
      capabilitiesUsed: ['INSPECTION', 'RADAR'],
      description: 'Tracks phone movement, tremor compensation, and 3D spatial alignment.'
    },
    {
      id: 'hw_npu',
      name: 'On-Device NPU / AI Core',
      status: 'ACTIVE',
      telemetry: '38 TOPS Neural Inference Engine',
      capabilitiesUsed: ['INSPECTION', 'MEDICINE', 'AURALENS', 'RADAR', 'HAPTIC', 'OPTICAL'],
      description: 'Executes real-world vision, sound wave processing, and local classification zero-latency models.'
    },
    {
      id: 'hw_speaker',
      name: 'Dual Acoustic Transducer',
      status: 'ONLINE',
      telemetry: 'Wideband Sound / Ultrasonic Emitter',
      capabilitiesUsed: ['RADAR'],
      description: 'Emits structured high-frequency acoustic chirps for obstacle bounce detection.'
    },
    {
      id: 'hw_flash',
      name: 'High-Intensity LED Flash',
      status: 'ONLINE',
      telemetry: 'High-Speed Strobe Pulse Engine',
      capabilitiesUsed: ['MEDICINE', 'OPTICAL'],
      description: 'Provides illuminated macro scanning and high-frequency optical air-gap data strobe bursts.'
    },
    {
      id: 'hw_haptics',
      name: 'Linear Resonant Haptic Engine',
      status: 'ONLINE',
      telemetry: 'Sub-10ms Response Vibration Motor',
      capabilitiesUsed: ['HAPTIC'],
      description: 'Generates structured tactile code patterns for silent and low-visibility communication.'
    },
    {
      id: 'hw_gps',
      name: 'Dual-Frequency GNSS / GPS',
      status: 'ONLINE',
      telemetry: 'Sub-meter Accuracy Locked',
      capabilitiesUsed: ['INSPECTION'],
      description: 'Provides exact spatial geotagging for real-world inspection evidence.'
    }
  ];

  public static getInstance(): InMemoryRepository {
    if (!InMemoryRepository.instance) {
      InMemoryRepository.instance = new InMemoryRepository();
    }
    return InMemoryRepository.instance;
  }

  // User Methods
  public async findUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public async createUser(name: string, email: string, passwordHash: string): Promise<User> {
    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  public async findUserById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    Object.assign(user, updates);
    return user;
  }

  // History Methods
  public async getHistory(userId: string, filterType?: string): Promise<HistoryItem[]> {
    return this.history
      .filter(item => item.userId === userId || userId === 'usr_demo_01')
      .filter(item => !filterType || filterType === 'ALL' || item.type.toUpperCase() === filterType.toUpperCase())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public async addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<HistoryItem> {
    const newItem: HistoryItem = {
      ...item,
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    this.history.unshift(newItem);
    return newItem;
  }

  public async deleteHistoryItem(id: string): Promise<boolean> {
    const idx = this.history.findIndex(h => h.id === id);
    if (idx !== -1) {
      this.history.splice(idx, 1);
      return true;
    }
    return false;
  }

  public async clearHistory(userId: string): Promise<void> {
    this.history = this.history.filter(h => h.userId !== userId && userId !== 'usr_demo_01');
  }

  // Hardware Status
  public async getHardwareStatuses(): Promise<HardwareStatus[]> {
    return this.hardware;
  }
}
