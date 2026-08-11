class CosmicAudioManager {
  private ambientAudio: HTMLAudioElement | null = null;
  private personalAudio: HTMLAudioElement | null = null;
  private voiceAudio: HTMLAudioElement | null = null;
  private isUnlocked: boolean = false;
  private isVoicePlaying: boolean = false;

  public init(ambientUrl: string, personalUrl: string, voiceUrl: string) {
    if (typeof window === 'undefined') return;

    if (!this.ambientAudio && ambientUrl) {
      this.ambientAudio = new Audio(ambientUrl);
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.4;
    }

    if (!this.personalAudio && personalUrl) {
      this.personalAudio = new Audio(personalUrl);
      this.personalAudio.loop = true;
      this.personalAudio.volume = 0.2;
    }

    if (!this.voiceAudio && voiceUrl) {
      this.voiceAudio = new Audio(voiceUrl);
      this.voiceAudio.volume = 1.0;

      this.voiceAudio.addEventListener('play', () => {
        this.isVoicePlaying = true;
        this.duckBackgroundMusic(true);
      });

      this.voiceAudio.addEventListener('pause', () => {
        this.isVoicePlaying = false;
        this.duckBackgroundMusic(false);
      });

      this.voiceAudio.addEventListener('ended', () => {
        this.isVoicePlaying = false;
        this.duckBackgroundMusic(false);
      });
    }
  }

  public updateUrls(ambientUrl: string, personalUrl: string, voiceUrl: string) {
    if (this.ambientAudio && ambientUrl) this.ambientAudio.src = ambientUrl;
    if (this.personalAudio && personalUrl) this.personalAudio.src = personalUrl;
    if (this.voiceAudio && voiceUrl) this.voiceAudio.src = voiceUrl;
  }

  public async unlockAndPlay() {
    this.isUnlocked = true;
    try {
      if (this.ambientAudio) {
        this.ambientAudio.volume = 0.4;
        await this.ambientAudio.play();
      }
      if (this.personalAudio) {
        this.personalAudio.volume = 0.2;
        await this.personalAudio.play();
      }
    } catch (e) {
      console.warn('Autoplay prevented or interrupted:', e);
    }
  }

  public pauseAll() {
    this.ambientAudio?.pause();
    this.personalAudio?.pause();
    this.voiceAudio?.pause();
  }

  public playVoice() {
    if (!this.voiceAudio) return;
    this.voiceAudio.play().catch(console.error);
  }

  public pauseVoice() {
    if (!this.voiceAudio) return;
    this.voiceAudio.pause();
  }

  public isVoiceActive(): boolean {
    return this.isVoicePlaying;
  }

  public getVoiceAudioElement(): HTMLAudioElement | null {
    return this.voiceAudio;
  }

  private duckBackgroundMusic(duck: boolean) {
    const fadeDuration = 500;
    const steps = 10;
    const intervalTime = fadeDuration / steps;

    if (duck) {
      // Fade out background music
      let currentStep = 0;
      const initialAmbient = this.ambientAudio?.volume || 0.4;
      const initialPersonal = this.personalAudio?.volume || 0.2;

      const timer = setInterval(() => {
        currentStep++;
        const factor = 1 - currentStep / steps;
        if (this.ambientAudio) this.ambientAudio.volume = Math.max(0, initialAmbient * factor);
        if (this.personalAudio) this.personalAudio.volume = Math.max(0, initialPersonal * factor);

        if (currentStep >= steps) {
          clearInterval(timer);
          this.ambientAudio?.pause();
          this.personalAudio?.pause();
        }
      }, intervalTime);
    } else {
      // Resume background music with fade in
      if (this.ambientAudio) this.ambientAudio.play().catch(console.error);
      if (this.personalAudio) this.personalAudio.play().catch(console.error);

      let currentStep = 0;
      const targetAmbient = 0.4;
      const targetPersonal = 0.2;

      const timer = setInterval(() => {
        currentStep++;
        const factor = currentStep / steps;
        if (this.ambientAudio) this.ambientAudio.volume = Math.min(targetAmbient, targetAmbient * factor);
        if (this.personalAudio) this.personalAudio.volume = Math.min(targetPersonal, targetPersonal * factor);

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, intervalTime);
    }
  }
}

export const audioManager = new CosmicAudioManager();
