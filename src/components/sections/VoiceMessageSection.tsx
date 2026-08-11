'use client';

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/lib/configContext';
import { audioManager } from '@/lib/audioManager';
import { Play, Pause, Mic, Volume2 } from 'lucide-react';

export const VoiceMessageSection: React.FC = () => {
  const { config } = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audioEl = audioManager.getVoiceAudioElement();
    if (!audioEl) return;

    const updateProgress = () => {
      if (audioEl.duration) {
        setProgress((audioEl.currentTime / audioEl.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    audioEl.addEventListener('timeupdate', updateProgress);
    audioEl.addEventListener('ended', handleEnded);

    return () => {
      audioEl.removeEventListener('timeupdate', updateProgress);
      audioEl.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioManager.pauseVoice();
      setIsPlaying(false);
    } else {
      audioManager.playVoice();
      setIsPlaying(true);
    }
  };

  return (
    <section className="w-full py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md glass-panel-gold rounded-3xl p-6 border border-cosmic-gold/50 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cosmic-rosegold/30 border border-cosmic-rosegold flex items-center justify-center text-cosmic-gold">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">رسالة بصوتي لكِ</h3>
              <p className="text-xs text-cosmic-rosegold">استمعي لنبرة قلبي ❤️</p>
            </div>
          </div>
          <span className="text-[10px] text-cosmic-gold font-semibold px-2.5 py-1 rounded-full bg-cosmic-bg border border-cosmic-gold/30">
            صوت خاص ✨
          </span>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="w-full h-16 bg-cosmic-bg/90 rounded-2xl p-4 flex items-center justify-between gap-1 border border-cosmic-rosegold/30 overflow-hidden">
          {Array.from({ length: 28 }).map((_, idx) => {
            const heightFactor = Math.sin(idx * 0.4) * 0.5 + 0.5;
            const barHeight = isPlaying ? Math.max(20, heightFactor * 100) : 30;

            return (
              <div
                key={idx}
                style={{ height: `${barHeight}%` }}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-gradient-to-t from-cosmic-rosegold to-cosmic-gold' : 'bg-cosmic-rosegold/40'
                }`}
              />
            );
          })}
        </div>

        {/* Controls & Progress bar */}
        <div className="space-y-3">
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cosmic-rosegold to-cosmic-gold h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-cosmic-rosegold via-cosmic-gold to-cosmic-rosegold text-cosmic-bg font-bold flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition mx-auto"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current mr-0.5" />}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-center text-cosmic-dimText flex items-center justify-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-cosmic-gold" /> الموسيقى الخلفية تُخفَض تلقائياً عند التشغيل
        </p>
      </div>
    </section>
  );
};
