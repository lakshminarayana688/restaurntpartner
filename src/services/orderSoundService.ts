// src/services/orderSoundService.ts
/**
 * FEEDO Restaurant Partner - Order Sound Alert Service
 * 
 * Provides a short, professional, crystal-clear synthesized restaurant alert sound (2.5s)
 * with zero external dependencies or copyrighted assets.
 * 
 * Features:
 * - Autoplay unlocking & permission handling
 * - Dedicated order ID deduplication (never replays on status update/reconnect)
 * - Safe test sound trigger
 * - Volume control & customizable repeat logic
 */

export interface OrderSoundSettings {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
  repeatCount: number; // 1, 2, or 3
}

const DEFAULT_SETTINGS: OrderSoundSettings = {
  enabled: true,
  volume: 0.75,
  repeatCount: 1,
};

const STORAGE_KEY_SETTINGS = 'feedo_order_sound_settings';

class OrderSoundService {
  private ctx: AudioContext | null = null;
  private notifiedOrderIds = new Set<string>();
  private isUnlocked = false;
  private activeTimers: number[] = [];
  private settings: OrderSoundSettings = DEFAULT_SETTINGS;

  constructor() {
    this.loadSettings();
    if (typeof window !== 'undefined') {
      this.attachUnlockListeners();
    }
  }

  private loadSettings(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (stored) {
          this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
      }
    } catch {
      this.settings = DEFAULT_SETTINGS;
    }
  }

  public saveSettings(newSettings: Partial<OrderSoundSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
      }
    } catch {
      // Ignore local storage write errors
    }
  }

  public getSettings(): OrderSoundSettings {
    return { ...this.settings };
  }

  /**
   * Initializes or returns active Web Audio Context
   */
  public getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {
        // Handled on next user gesture
      });
    } else if (this.ctx && this.ctx.state === 'running') {
      this.isUnlocked = true;
    }

    return this.ctx;
  }

  /**
   * Explicitly unlock audio context on user gesture (e.g., button click)
   */
  public async unlockAudio(): Promise<boolean> {
    const ctx = this.getAudioContext();
    if (!ctx) return false;

    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      this.isUnlocked = ctx.state === 'running';
      return this.isUnlocked;
    } catch {
      return false;
    }
  }

  public isAudioUnlocked(): boolean {
    if (!this.ctx) return false;
    return this.ctx.state === 'running';
  }

  private attachUnlockListeners(): void {
    const unlockHandler = () => {
      this.unlockAudio();
      window.removeEventListener('click', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };

    window.addEventListener('click', unlockHandler, { once: true });
    window.addEventListener('touchstart', unlockHandler, { once: true });
    window.addEventListener('keydown', unlockHandler, { once: true });
  }

  /**
   * Seed known order IDs to prevent existing orders from triggering alerts on app start/reconnect
   */
  public seedKnownOrderIds(orderIds: string[]): void {
    for (const id of orderIds) {
      if (id) {
        this.notifiedOrderIds.add(id);
      }
    }
  }

  /**
   * Check whether an order ID has already received its one-time incoming alert
   */
  public hasOrderBeenNotified(orderId: string): boolean {
    return this.notifiedOrderIds.has(orderId);
  }

  /**
   * Primary entry point when an order arrives from Realtime, Polling, or Demo Simulation.
   * Returns true if sound was triggered for a brand new order.
   */
  public notifyNewOrderIfNew(orderId: string, isSoundEnabled?: boolean): boolean {
    if (!orderId) return false;

    // Strict idempotency: if already alerted, ignore completely
    if (this.notifiedOrderIds.has(orderId)) {
      return false;
    }

    // Mark as notified immediately to avoid race conditions
    this.notifiedOrderIds.add(orderId);

    const soundActive = isSoundEnabled !== undefined ? isSoundEnabled : this.settings.enabled;
    if (soundActive) {
      this.playNewOrderAlert();
    }

    return true;
  }

  /**
   * Plays the professional FEEDO restaurant alert chime.
   * Distinctive 4-note ascending chord + warm decay tail (~2.4s total duration)
   */
  public playNewOrderAlert(customVolume?: number): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopAlert(); // Clear previous ongoing repeats

    const playSequence = () => {
      if (!ctx || ctx.state !== 'running') return;
      const now = ctx.currentTime;
      const baseGain = (customVolume !== undefined ? customVolume : this.settings.volume) * 0.4;

      // Note definition: frequency, startTimeOffset, duration, waveform, gainFactor
      const notes: Array<[number, number, number, OscillatorType, number]> = [
        [659.25, 0.00, 0.35, 'triangle', 0.8], // E5
        [783.99, 0.18, 0.40, 'triangle', 0.9], // G5
        [1046.50, 0.38, 0.45, 'sine', 1.0],    // C6
        [1318.51, 0.58, 1.40, 'sine', 1.1],    // E6 (Harmonic bell peak)
        [523.25, 0.58, 1.20, 'triangle', 0.4], // C5 (Warm bass grounding)
      ];

      notes.forEach(([freq, offset, duration, type, factor]) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = type;
          osc.frequency.setValueAtTime(freq, now + offset);

          const peakGain = baseGain * factor;
          gain.gain.setValueAtTime(0.001, now + offset);
          gain.gain.exponentialRampToValueAtTime(peakGain, now + offset + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + offset);
          osc.stop(now + offset + duration);
        } catch {
          // Audio node lifecycle safety
        }
      });
    };

    // Play initial chime
    playSequence();

    // Optional repeat if configured (up to repeatCount times with 2.8s spacing)
    const repeats = Math.min(Math.max(this.settings.repeatCount, 1), 3);
    for (let i = 1; i < repeats; i++) {
      const timer = window.setTimeout(() => {
        playSequence();
      }, i * 2800);
      this.activeTimers.push(timer);
    }
  }

  /**
   * Test sound button trigger (always plays immediately for preview)
   */
  public testSound(): void {
    this.unlockAudio();
    this.playNewOrderAlert(this.settings.volume);
  }

  /**
   * Cancels any pending repeat timers (e.g. when order is accepted/acknowledged)
   */
  public stopAlert(): void {
    this.activeTimers.forEach((t) => clearTimeout(t));
    this.activeTimers = [];
  }

  /**
   * Reset notification state (for testing or logging out)
   */
  public resetNotifiedOrders(): void {
    this.notifiedOrderIds.clear();
    this.stopAlert();
  }
}

export const orderSoundService = new OrderSoundService();
