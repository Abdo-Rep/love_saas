'use client';

import React, { useState } from 'react';
import { Heart, Lock, Key, ArrowLeft, Sparkles } from 'lucide-react';
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

    // Initialize single bgMusic track
    try {
      if (config.storySongUrl) {
        bgMusic.setTrack(config.storySongUrl);
      }
    } catch (_) {}

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
      {/* Ambient Deep Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.25)_0%,_transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.15)_0%,_transparent_60%)] pointer-events-none z-0" />

      {/* Starry Grid Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
        <div className="w-full h-full bg-[radial-gradient(#ec4899_1.5px,transparent_1.5px)] [background-size:28px_28px] animate-pulse" />
      </div>

      {/* TOP DECORATIVE PILL BADGE */}
      <div className="relative z-10 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/5 border border-pink-400/30 text-amber-300 text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span style={{ fontFamily: "'Cairo', sans-serif" }}>
            {config.landingBadge || 'رحلة العشق الملكية 👑'}
          </span>
        </div>
      </div>

      {/* CENTRAL LUXURY CARD CONTAINER (MATCHING SCREENSHOT 1) */}
      <div className="relative z-10 max-w-md w-full my-auto py-10 flex flex-col items-center">
        
        {/* TOP OVERLAPPING HEART MEDALLION */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 blur-xl opacity-80 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-400 p-1 border-2 border-pink-200/80 shadow-[0_0_35px_rgba(244,63,94,0.8)] flex items-center justify-center">
              <Heart className="w-12 h-12 text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
        </div>

        {/* LUXURY ROUNDED CARD WITH GLOW */}
        <div className="w-full pt-20 pb-10 px-6 sm:px-8 rounded-[36px] bg-[#160312]/95 border border-pink-500/40 backdrop-blur-2xl shadow-[0_0_60px_rgba(244,63,94,0.4)] flex flex-col items-center gap-5 text-center relative">
          
          {/* TITLE */}
          <div className="w-full">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-200 leading-snug py-1"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {config.landingTitle || 'إلى أميرتي وسر سعادتي'}
            </h1>
            <div className="flex items-center justify-center gap-2 text-xl pt-1">
              <span>💛</span>
              <span>👑</span>
            </div>
          </div>

          {/* POETIC SUBTITLE */}
          <p
            className="text-pink-100/85 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed font-semibold px-2"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {config.landingSubtitle || 'عالمٌ خُصص لأجلكِ وحدكِ.. حيث تبتسم الذكريات وتُحكى أجمل حكايات العشق ✨'}
          </p>

          {/* SECRET ENTRY FORM */}
          <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3.5 mt-2" autoComplete="off">
            {/* Hidden dummy fields to trick browser autofill away from real input */}
            <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} readOnly />
            <input type="password" name="prevent_autofill" autoComplete="new-password" style={{ display: 'none' }} readOnly />
            <div className="relative w-full">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder={config.passwordPlaceholder || 'اكتب كلمة السر هنا ✨'}
                autoComplete="new-password"
                name="site_password"
                className="w-full py-3.5 px-10 rounded-2xl bg-black/80 border border-pink-500/40 text-center text-amber-200 placeholder-white/40 focus:outline-none focus:border-pink-300 backdrop-blur-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all font-bold text-xs sm:text-sm tracking-widest"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 pointer-events-none" />
              <Key className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-bold animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#f43f5e] via-[#fb7185] to-[#f59e0b] text-white font-extrabold text-xs sm:text-sm border border-white/30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2 cursor-pointer"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <span>{config.enterButtonText || 'دخول عالمنا الخاص 🚀'}</span>
              <ArrowLeft className="w-4 h-4" />
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
