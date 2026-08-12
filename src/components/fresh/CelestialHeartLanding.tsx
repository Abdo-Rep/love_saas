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

    setTimeout(() => {
      onStart();
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = (password || '').trim().toLowerCase();
    const cleanExpected = (config.sitePassword || 'love').trim().toLowerCase();

    if (!cleanExpected || cleanInput === cleanExpected) {
      handleTriggerUnlock();
    } else {
      setError('كلمة السر غير صحيحة 💔 جربي مرة تانية يا روحي ✨');
    }
  };

  return (
    <div
      className={`relative w-full min-h-[100dvh] overflow-y-auto bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] flex flex-col items-center justify-between p-4 sm:p-8 text-center select-none transition-all duration-700 ${
        isUnlocking ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'
      }`}
    >
      {/* Ambient Deep Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.3)_0%,_transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.2)_0%,_transparent_60%)] pointer-events-none z-0" />

      {/* Starry Grid Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
        <div className="w-full h-full bg-[radial-gradient(#ec4899_1.5px,transparent_1.5px)] [background-size:28px_28px] animate-pulse" />
      </div>

      {/* TOP DECORATIVE BADGE */}
      <div className="relative z-10 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-pink-400/30 text-amber-300 text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span style={{ fontFamily: "'Cairo', sans-serif" }}>
            {config.landingBadge || 'رحلة العشق الملكية 👑'}
          </span>
        </div>
      </div>

      {/* MAIN FLOATING ROMANTIC CONTENT (NO HEAVY RECTANGLE BOX) */}
      <div className="relative z-10 max-w-xl w-full my-auto py-6 flex flex-col items-center gap-6">
        
        {/* GLOWING FLOATING HEART EMBLEM */}
        <div className="relative group my-2">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 blur-2xl opacity-70 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-rose-600 to-pink-900 border-2 border-pink-300/80 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.8)]">
            <Heart className="w-12 h-12 sm:w-14 sm:h-14 text-white fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
          </div>
        </div>

        {/* FLOATING TEXT SECTION */}
        <div className="w-full flex flex-col items-center gap-4 text-center px-4">
          
          {/* TITLE */}
          <div className="w-full overflow-visible">
            <h1
              className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-100 to-pink-300 leading-relaxed py-2 px-1 tracking-normal drop-shadow-[0_2px_15px_rgba(244,63,94,0.6)]"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {config.landingTitle || 'إلى أميرتي وسر سعادتي 👑💖'}
            </h1>
          </div>

          {/* POETIC SUBTITLE */}
          <p
            className="text-pink-100/90 text-xs sm:text-base max-w-md mx-auto leading-loose font-semibold px-2 drop-shadow-md"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {config.landingSubtitle || 'عالمٌ خُصص لأجلكِ وحدكِ.. حيث تبتسم الذكريات وتُحكى أجمل حكايات العشق ✨'}
          </p>

          {/* SECRET ENTRY FORM WITH STRICT PASSWORD VALIDATION */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3.5 mt-3">
            <div className="relative w-full">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder={config.passwordPlaceholder || 'اكتب كلمة السر هنا ✨'}
                className="w-full py-4 px-12 rounded-2xl bg-black/70 border-2 border-rose-500/60 text-center text-amber-200 placeholder-white/40 focus:outline-none focus:border-pink-300 backdrop-blur-xl shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all font-bold text-xs sm:text-sm tracking-widest"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 pointer-events-none" />
              <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs sm:text-sm border border-white/30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(244,63,94,0.7)] flex items-center justify-center gap-2 group cursor-pointer"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <span>{config.enterButtonText || 'دخول عالمنا الخاص 🚀'}</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
          </form>

        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="relative z-10 pb-3 text-[11px] text-pink-200/40 font-semibold">
        <span style={{ fontFamily: "'Cairo', sans-serif" }}>مصمم بكل الحب والملكِيّة ❤️</span>
      </div>
    </div>
  );
};
