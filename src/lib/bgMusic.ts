class BgMusicManager {
  private audio: HTMLAudioElement | null = null;
  private currentUrl: string = '';
  public isPlaying: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();

  public setTrack(url: string) {
    if (!url) return;
    if (this.currentUrl === url && this.audio) return;
    this.currentUrl = url;
    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio(url);
    this.audio.loop = true;
    this.audio.volume = 0.85;
  }

  public play(url?: string) {
    if (url) this.setTrack(url);
    if (!this.audio && this.currentUrl) this.setTrack(this.currentUrl);
    if (!this.audio) return;

    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.notify();
      })
      .catch((e) => {
        console.log('Audio playback waiting for touch interaction:', e);
        const onInteraction = () => {
          this.audio
            ?.play()
            .then(() => {
              this.isPlaying = true;
              this.notify();
            })
            .catch(() => {});
          window.removeEventListener('click', onInteraction);
          window.removeEventListener('touchstart', onInteraction);
        };
        window.addEventListener('click', onInteraction);
        window.addEventListener('touchstart', onInteraction);
      });
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }
}

// Global Singleton for uninterrupted background music across all steps
const globalMusicInstance = new BgMusicManager();

export const bgMusic = globalMusicInstance;
