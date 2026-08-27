'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, ArrowRight } from 'lucide-react';
import { useConfig } from '@/lib/configContext';
import { bgMusic } from '@/lib/bgMusic';
import { getPlayableAudioUrl } from '@/lib/getPlayableAudioUrl';

interface Props {
  onNext: () => void;
}

export const LoveRadioCassette: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const voiceUrl = config.voiceAudioUrl || '/sound/WhatsApp Video 2026-08-11 at 3.56.53 AM.mp4';
  const playableVoiceUrl = getPlayableAudioUrl(voiceUrl);

  // Auto-pause background music on mount and handle cleanup
  useEffect(() => {
    bgMusic.pause(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (config.storySongUrl) {
        bgMusic.play(config.storySongUrl, false);
      }
    };
  }, [config.storySongUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNextClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (config.storySongUrl) {
      bgMusic.play(config.storySongUrl, false);
    }
    onNext();
  };

  const title = config.voiceMessageTitle || 'فويس بصوتي من قلبي ليكي يروحي';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between py-10 px-4 relative z-10 text-white dir-rtl">
      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={playableVoiceUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* TOP BADGE & TITLE */}
      <div className="text-center space-y-3 max-w-xl animate-fadeIn pt-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-rose-500/20 via-pink-500/30 to-amber-500/20 border border-pink-400/40 text-pink-200 text-xs font-black shadow-[0_0_20px_rgba(244,114,182,0.3)]">
          <Mic className="w-4 h-4 text-pink-400 animate-bounce" />
          <span>رسالة بصوتي</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-rose-300 drop-shadow-[0_0_15px_rgba(251,113,133,0.4)]" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {title}
        </h2>
      </div>

      {/* MAIN LUXURY VOICE CARD */}
      <div className="w-full max-w-lg my-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#2d0723]/95 via-[#1a0416]/95 to-[#0b0109]/95 border-2 border-pink-400/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(244,63,94,0.3)] space-y-8 text-center animate-scaleUp relative overflow-hidden">
        
        {/* BACKGROUND GLOW ACCENTS */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* VINYL / SOUNDWAVE VISUALIZER (INTERACTIVE PLAY BUTTON DISC) */}
        <div className="relative flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            className="relative w-36 h-36 flex items-center justify-center cursor-pointer group focus:outline-none"
            title={isPlaying ? 'إيقاف الفويس' : 'تشغيل الفويس'}
          >
            {/* Outer Pulsing Aura */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 opacity-30 blur-xl transition-all group-hover:scale-125 ${isPlaying ? 'scale-125 animate-pulse' : 'scale-100'}`} />

            {/* Spinning Disc */}
            <div className={`w-32 h-32 rounded-full border-4 border-amber-300/60 bg-gradient-to-br from-black via-[#1a0516] to-black flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-700 group-hover:border-amber-300 ${isPlaying ? 'animate-spin-slow shadow-[0_0_35px_rgba(251,113,133,0.6)]' : 'shadow-[0_0_20px_rgba(244,63,94,0.3)]'}`}>
              <div className="w-24 h-24 rounded-full border border-white/15 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-pink-400/30 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 border border-amber-200 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white fill-current" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* DYNAMIC EQUALIZER WAVEFORM BARS */}
          <div className="flex items-end justify-center gap-1.5 h-8 pt-2">
            {[40, 75, 100, 60, 90, 50, 85, 95, 45, 80, 65, 100, 55, 85, 40].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.max(15, (h * (i % 3 + 1)) % 100)}%` : '20%',
                  opacity: isPlaying ? 0.9 : 0.4
                }}
              />
            ))}
          </div>
        </div>

        {/* PROGRESS BAR & TIMINGS */}
        <div className="space-y-2 px-2 pt-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg bg-white/15 appearance-none cursor-pointer accent-pink-400 hover:bg-white/25 transition-all"
          />
          <div className="flex justify-between text-[11px] font-mono text-pink-200/80 font-bold">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* NEXT BUTTON */}
      <div className="w-full max-w-md pt-4">
        <button
          onClick={handleNextClick}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm border border-white/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.voiceButtonText || 'التالي: أمنيات المستقبل 🗺️✨'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
};
