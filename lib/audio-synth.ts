// Web Audio API Synthesizer for Interactive Audio Demonstrations
// Provides live sound synthesis for:
// 1. Airplane cabin rumble (low rumble with bandpass)
// 2. Busy office chatter/acoustics (pink noise + resonant filtering)
// 3. Street/subway environment (brown noise + frequency peaks)
// 4. Active Noise Cancellation Anti-Phase wave simulator

class AudioDemoEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private antiNoiseGain: GainNode | null = null;
  private isPlaying = false;
  private currentEnv = "airplane";
  private ancActive = false;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setAnc(enabled: boolean) {
    this.ancActive = enabled;
    if (this.gainNode && this.ctx) {
      const targetGain = enabled ? 0.08 : 0.45;
      this.gainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
    }
  }

  public setEnvironment(env: "airplane" | "office" | "subway") {
    this.currentEnv = env;
    if (!this.isPlaying) return;
    this.updateFilter();
  }

  private updateFilter() {
    if (!this.filterNode || !this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.currentEnv === "airplane") {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(260, now, 0.1);
      this.filterNode.Q.setTargetAtTime(3.5, now, 0.1);
    } else if (this.currentEnv === "office") {
      this.filterNode.type = "bandpass";
      this.filterNode.frequency.setTargetAtTime(1100, now, 0.1);
      this.filterNode.Q.setTargetAtTime(0.8, now, 0.1);
    } else {
      // subway / urban
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(450, now, 0.1);
      this.filterNode.Q.setTargetAtTime(2.0, now, 0.1);
    }
  }

  public togglePlay(env: "airplane" | "office" | "subway", anc: boolean): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.currentEnv = env;
      this.ancActive = anc;
      this.start();
      return true;
    }
  }

  private start() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown/Pink mixed noise synthesis
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    const masterGain = this.ctx.createGain();

    noise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    this.filterNode = filter;
    this.gainNode = masterGain;
    this.noiseNode = noise;

    this.updateFilter();
    masterGain.gain.setValueAtTime(this.ancActive ? 0.08 : 0.45, this.ctx.currentTime);

    noise.start();
    this.isPlaying = true;
  }

  public stop() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
    this.isPlaying = false;
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentEnv: this.currentEnv,
      ancActive: this.ancActive,
    };
  }
}

export const audioDemo = new AudioDemoEngine();
