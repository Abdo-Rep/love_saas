'use client';

import React, { useState } from 'react';
import { Heart, Lock, Key, ArrowLeft, Crown, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useConfig } from '@/lib/configContext';

interface Props {
  onStart: () => void;
}

export const CelestialHeartLanding: React.FC<Props> = ({ onStart }) => {
  const { config } = useConfig();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleTriggerUnlock = () => {
    setIsUnlocking(true);
    setError('');

    try {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
      });
    } catch (_) {}

    // Instant smooth transition to next step after celebration
    setTimeout(() => {
      onStart();
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTriggerUnlock();
  };

  return (
    <div
      className={`relative w-full min-h-[100dvh] overflow-y-auto bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] flex flex-col items-center justify-between p-4 sm:p-8 text-center select-none transition-all duration-700 ${
        isUnlocking ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'
      }`}
    >
      {/* Ambient Deep Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.25)_0%,_transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18)_0%,_transparent_60%)] pointer-events-none z-0" />

      {/* Starry Grid Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
        <div className="w-full h-full bg-[radial-gradient(#ec4899_1.5px,transparent_1.5px)] [background-size:28px_28px] animate-pulse" />
      </div>

      {/* TOP DECORATIVE SPACE */}
      <div className="relative z-10 pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-pink-400/30 text-amber-300 text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span style={{ fontFamily: "'Cairo', sans-serif" }}>
            {config.landingBadge || 'رحلة العشق الملكية 👑'}
          </span>
        </div>
      </div>

      {/* MAIN CENTRAL LUXURY CARD */}
      <div className="relative z-10 max-w-xl w-full my-auto py-6 flex flex-col items-center gap-6">
        
        {/* GLOWING HEART EMBLEM */}
        <div
          className="relative group cursor-pointer my-2"
          onClick={handleTriggerUnlock}
          title="انقر للدخول ✨"
        >
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 blur-2xl opacity-60 group-hover:opacity-100 transition duration-700 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-black/80 border-2 border-rose-500/60 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.6)] transform group-hover:scale-105 transition duration-500">
            <Heart className="w-14 h-14 sm:w-18 sm:h-18 text-rose-500 fill-rose-500 animate-bounce" />
          </div>
        </div>

        {/* CONTAINER CARD FOR NO TEXT CLIPPING */}
        <div className="w-full p-6 sm:p-10 rounded-3xl bg-black/40 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(244,63,94,0.35)] flex flex-col items-center gap-5 text-center">
          
          {/* TITLE WITH NO TEXT CUTOFF OR CLIPPING */}
          <div className="w-full pt-2 pb-4 overflow-visible">
            <h1
              className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-100 to-pink-300 leading-relaxed py-2 px-1 tracking-normal drop-shadow-[0_2px_12px_rgba(244,63,94,0.4)]"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {config.landingTitle || 'إلى أميرتي وسر سعادتي 👑💖'}
            </h1>
          </div>

          {/* POETIC SUBTITLE */}
          <p
            className="text-white/90 text-xs sm:text-base max-w-md mx-auto leading-loose font-bold px-2"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {config.landingSubtitle || 'عالمٌ خُصص لأجلكِ وحدكِ.. حيث تبتسم الذكريات وتُحكى أجمل حكايات العشق ✨'}
          </p>

          {/* SECRET ENTRY FORM */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 mt-2">
            <div className="relative w-full">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={config.passwordPlaceholder || 'اكتب كلمة السر هنا ✨'}
                className="w-full py-4 px-12 rounded-2xl bg-black/80 border-2 border-rose-500/50 text-center text-amber-200 placeholder-white/40 focus:outline-none focus:border-pink-300 backdrop-blur-xl shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all font-bold text-sm tracking-widest"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400 pointer-events-none" />
              <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm sm:text-base border border-white/30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2 group cursor-pointer"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <span>{config.enterButtonText || 'دخول عالمنا الخاص 🚀'}</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
          </form>

        </div>
      </div>

      {/* BOTTOM FOOTER SPACING */}
      <div className="relative z-10 pb-4 text-xs text-pink-200/40 font-semibold">
        <span style={{ fontFamily: "'Cairo', sans-serif" }}>مصمم بكل الحب والملكِيّة ❤️</span>
      </div>
    </div>
  );
};
