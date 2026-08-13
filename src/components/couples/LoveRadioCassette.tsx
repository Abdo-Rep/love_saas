'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles, Mic, Play, Pause, ArrowRight, Square, RotateCcw } from 'lucide-react';
import { useConfig } from '@/lib/configContext';
import { bgMusic } from '@/lib/bgMusic';

interface Props {
  onNext: () => void;
}

export const LoveRadioCassette: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. Temporary auto-pause background song when arriving at voice message
    bgMusic.pause(false);

    // Clean up any legacy audio instance if exists
    if (typeof window !== 'undefined' && (window as any)._bgAudio) {
      try {
        (window as any)._bgAudio.pause();
        (window as any)._bgAudio = null;
      } catch (_) {}
    }

    // Custom voice audio from config or fallback
    const src = config.voiceAudioUrl || '/sound/WhatsApp Video 2026-08-11 at 3.56.53 AM.mp4';
    setAudioUrl(src);

    const voiceAudio = new Audio(src);
    voiceAudio.loop = false; // Do NOT repeat voice
    audioRef.current = voiceAudio;

    // 2. Auto-play recorded voice
    voiceAudio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log('Voice autoplay waiting for interaction:', err);
      setIsPlaying(false);
    });

    // 3. When voice finishes: stop voice, resume background song (only if not manually muted by user)
    voiceAudio.onended = () => {
      setIsPlaying(false);
      if (config.storySongUrl) {
        bgMusic.play(config.storySongUrl, false);
      }
    };

    return () => {
      voiceAudio.pause();
      // Resume background music when leaving step 7 (only if not manually muted by user)
      if (config.storySongUrl) {
        bgMusic.play(config.storySongUrl, false);
      }
    };
  }, [config.voiceAudioUrl, config.storySongUrl]);

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
          
          {/* FULL SPINNING DISC WITH PHOTO COVERING ENTIRE REEL */}
          <div className="relative flex items-center justify-center">
            <div
              className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1.5 shadow-[0_0_40px_rgba(244,114,182,0.5)] border-4 border-pink-400/60 flex items-center justify-center overflow-hidden bg-black ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            >
              {/* Full Covering Image */}
              <img
                src={config.voicePhotoUrl || '/images/peasant_girl.jpg'}
                alt="Voice Disc Photo"
                className="w-full h-full object-cover rounded-full"
              />

              {/* Vinyl Grooves & Center Spindle Overlay */}
              <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 border-2 border-white/80 shadow-[0_0_15px_rgba(245,158,11,0.8)] flex items-center justify-center pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-black" />
              </div>
            </div>

            {/* Floating Heart Icon Overlay */}
            <div className="absolute top-1 right-1 p-2.5 rounded-full bg-rose-500/90 border border-pink-200 text-white shadow-lg animate-bounce z-10">
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

      {/* FOOTER BUTTON WITH CLEARANCE */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-24 sm:pb-28">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.voiceButtonText || 'التالي: عجلة الأحكام 🎡💋'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
