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

  public setTrack(url: string) {
    if (!url) return;
    if (this.currentUrl === url && this.audio) return;
    this.currentUrl = url;
    if (this.audio) {
      this.audio.pause();
    }
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.85;

    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime;
      this.duration = audio.duration || 0;
      this.timeListeners.forEach((cb) => cb(this.currentTime, this.duration));
    });

    audio.addEventListener('loadedmetadata', () => {
      this.duration = audio.duration || 0;
      this.timeListeners.forEach((cb) => cb(this.currentTime, this.duration));
    });

    audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyState();
    });

    audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyState();
    });

    this.audio = audio;
  }

  public play(url?: string, force: boolean = false) {
    // If the user manually muted/paused the song, respect their preference unless explicitly forced!
    if (this.isManuallyPaused && !force) return;

    if (force) {
      this.isManuallyPaused = false;
    }

    if (url) this.setTrack(url);
    if (!this.audio && this.currentUrl) this.setTrack(this.currentUrl);
    if (!this.audio) return;

    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.notifyState();
      })
      .catch((e) => {
        console.log('Audio playback waiting for touch interaction:', e);
        const onInteraction = () => {
          if (!this.isManuallyPaused) {
            this.audio
              ?.play()
              .then(() => {
                this.isPlaying = true;
                this.notifyState();
              })
              .catch(() => {});
          }
          window.removeEventListener('click', onInteraction);
          window.removeEventListener('touchstart', onInteraction);
        };
        window.addEventListener('click', onInteraction);
        window.addEventListener('touchstart', onInteraction);
      });
  }

  public pause(isManual: boolean = false) {
    if (isManual) {
      this.isManuallyPaused = true;
    }
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notifyState();
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause(true); // User explicitly clicked pause!
    } else {
      this.isManuallyPaused = false; // User explicitly clicked play!
      this.play(undefined, true);
    }
  }

  public seek(seconds: number) {
    if (this.audio && Number.isFinite(seconds)) {
      this.audio.currentTime = seconds;
    }
  }

  public subscribeState(cb: PlayStateListener) {
    this.stateListeners.add(cb);
    return () => this.stateListeners.delete(cb);
  }

  public subscribeTime(cb: TimeListener) {
    this.timeListeners.add(cb);
    return () => this.timeListeners.delete(cb);
  }

  private notifyState() {
    this.stateListeners.forEach((cb) => cb(this.isPlaying));
  }
}

// Global Singleton for uninterrupted background music across all steps
export const bgMusic = new BgMusicManager();
