type TimeListener = (currentTime: number, duration: number) => void;
type PlayStateListener = (playing: boolean) => void;

class BgMusicManager {
  private audio: HTMLAudioElement | null = null;
  private currentUrl: string = '';
  public isPlaying: boolean = false;
  public isManuallyPaused: boolean = false;
  public currentTime: number = 0;
  public duration: number = 0;

  private stateListeners: Set<PlayStateListener> = new Set();
  private timeListeners: Set<TimeListener> = new Set();
  private interactionListenerAttached: boolean = false;

  public setTrack(url: string) {
    if (!url) return;
    if (this.currentUrl === url && this.audio) return;
    
    this.currentUrl = url;
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch (_) {}
    }

    const audio = new Audio();
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = 0.85;

    if (!url.startsWith('data:') && !url.startsWith('blob:')) {
      audio.crossOrigin = 'anonymous';
    }

    audio.src = url;

    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime;
      this.duration = audio.duration || 0;
      this.notifyTime();
    });

    audio.addEventListener('loadedmetadata', () => {
      this.duration = audio.duration || 0;
      this.notifyTime();
    });

    audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyState();
    });

    audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyState();
    });

    audio.addEventListener('ended', () => {
      if (audio.loop) {
        audio.play().catch(() => {});
      }
    });

    this.audio = audio;
    audio.load();

    // Attach global user interaction handler to bypass browser autoplay policies
    this.attachInteractionHandler();
  }

  private attachInteractionHandler() {
    if (this.interactionListenerAttached || typeof window === 'undefined') return;
    this.interactionListenerAttached = true;

    const unlockAudio = () => {
      if (this.audio && !this.isManuallyPaused) {
        this.audio.play().then(() => {
          this.isPlaying = true;
          this.notifyState();
        }).catch(() => {});
      }
    };

    window.addEventListener('click', unlockAudio, { once: false });
    window.addEventListener('touchstart', unlockAudio, { once: false });
    window.addEventListener('keydown', unlockAudio, { once: false });
  }

  public play(url?: string, force: boolean = false) {
    if (this.isManuallyPaused && !force) return;

    if (force) {
      this.isManuallyPaused = false;
    }

    if (url) this.setTrack(url);
    if (!this.audio && this.currentUrl) this.setTrack(this.currentUrl);
    if (!this.audio) return;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.notifyState();
        })
        .catch((err) => {
          console.warn('[BgMusicManager] Autoplay blocked, waiting for user gesture...', err);
        });
    }
  }

  public pause(isManual: boolean = false) {
    if (isManual) {
      this.isManuallyPaused = true;
    }
    if (this.audio) {
      try {
        this.audio.pause();
      } catch (_) {}
      this.isPlaying = false;
      this.notifyState();
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause(true);
    } else {
      this.isManuallyPaused = false;
      this.play(undefined, true);
    }
  }

  public seek(seconds: number) {
    if (this.audio && Number.isFinite(seconds)) {
      try {
        this.audio.currentTime = seconds;
      } catch (_) {}
    }
  }

  public subscribeState(cb: PlayStateListener) {
    this.stateListeners.add(cb);
    cb(this.isPlaying);
    return () => this.stateListeners.delete(cb);
  }

  public subscribeTime(cb: TimeListener) {
    this.timeListeners.add(cb);
    cb(this.currentTime, this.duration);
    return () => this.timeListeners.delete(cb);
  }

  private notifyState() {
    this.stateListeners.forEach((cb) => cb(this.isPlaying));
  }

  private notifyTime() {
    this.timeListeners.forEach((cb) => cb(this.currentTime, this.duration));
  }
}

export const bgMusic = new BgMusicManager();
