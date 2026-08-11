'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles, Mic, Play, Pause, ArrowRight, Square, RotateCcw } from 'lucide-react';
import { useConfig } from '@/lib/configContext';

interface Props {
  onNext: () => void;
}

export const LoveRadioCassette: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Custom audio from config or fallback
    const src = config.voiceAudioUrl || '/sound/WhatsApp Video 2026-08-11 at 3.56.53 AM.mp4';
    setAudioUrl(src);

    const voiceAudio = new Audio(src);
    voiceAudio.loop = false; // Do NOT repeat automatically
    audioRef.current = voiceAudio;

    // 1. Pause background song immediately when arriving at voice page
    if (typeof window !== 'undefined' && (window as any)._bgAudio) {
      try {
        (window as any)._bgAudio.pause();
      } catch (_) {}
    }

    // 2. Auto-play recorded voice immediately
    voiceAudio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log('Voice autoplay waiting for interaction:', err);
      setIsPlaying(false);
    });

    // 3. When voice finishes: stop voice, resume background song, do NOT loop voice
    voiceAudio.onended = () => {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && (window as any)._bgAudio) {
        try {
          (window as any)._bgAudio.play().catch(() => {});
        } catch (_) {}
      }
    };

    return () => {
      voiceAudio.pause();
      if (typeof window !== 'undefined' && (window as any)._bgAudio) {
        try {
          (window as any)._bgAudio.play().catch(() => {});
        } catch (_) {}
      }
    };
  }, [config.voiceAudioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (typeof window !== 'undefined' && (window as any)._bgAudio) {
        try {
          (window as any)._bgAudio.play().catch(() => {});
        } catch (_) {}
      }
    } else {
      if (typeof window !== 'undefined' && (window as any)._bgAudio) {
        try {
          (window as any)._bgAudio.pause();
        } catch (_) {}
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error('Audio play error:', e);
        setIsPlaying(false);
      });
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Rose Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-6">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {config.voiceMessageTitle || 'كلمات بصوتي طالعة من قلبي لأجلكِ'}
        </h1>
      </div>

      {/* CUTE ROMANTIC VINYL PLAYER WITH PHOTO IN CENTER */}
      <div className="relative z-20 max-w-md mx-auto w-full my-4">
        <div className="w-full bg-white/5 border border-pink-400/30 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(244,114,182,0.25)] flex flex-col items-center gap-6 text-center">
          
          {/* SPINNING VINYL WITH REAL PHOTO CENTER DISC */}
          <div className="relative flex items-center justify-center">
            <div className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-black via-rose-950 to-pink-950 p-2 shadow-[0_0_35px_rgba(244,114,182,0.3)] border-4 border-pink-400/40 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
              
              {/* Vinyl Grooves */}
              <div className="w-full h-full rounded-full border-2 border-white/10 flex items-center justify-center p-3">
                <div className="w-full h-full rounded-full border border-pink-500/20 flex items-center justify-center p-3">
                  
                  {/* PHOTO IN CENTER DISC */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-300 shadow-md">
                    <img
                      src={config.voicePhotoUrl || '/images/peasant_girl.jpg'}
                      alt="Voice Disc Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>

                </div>
              </div>

            </div>

            {/* Floating Heart Icon Overlay */}
            <div className="absolute top-2 right-2 p-2 rounded-full bg-rose-500/80 border border-pink-200 text-white shadow-lg animate-bounce">
              <Heart className="w-4 h-4 fill-white" />
            </div>
          </div>

          {/* AUDIO WAVE VISUALIZER */}
          <div className="flex items-center justify-center gap-1.5 h-8">
            {[40, 75, 50, 90, 60, 100, 45, 80, 55, 70].map((h, idx) => (
              <div
                key={idx}
                className={`w-1 rounded-full bg-gradient-to-t from-rose-500 to-amber-300 transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{ height: isPlaying ? `${h}%` : '25%' }}
              />
            ))}
          </div>

          {/* TRACK INFO */}
          <div className="flex flex-col gap-1">
            <h3 className="text-base sm:text-lg font-black text-pink-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {config.voiceMessageSubtitle || 'رسالة حب بصوتي 🎙️❤️'}
            </h3>
            <span className="text-xs text-amber-200 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              طالعة من أعماق القلب ✨
            </span>
          </div>

          {/* PLAY / PAUSE BUTTON */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white shadow-[0_0_25px_rgba(244,114,182,0.6)] border border-pink-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white translate-x-0.5" />
            )}
          </button>

        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.voiceButtonText || 'التالي: عجلة الأحكام 🎡💋'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
