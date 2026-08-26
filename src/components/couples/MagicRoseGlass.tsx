'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Heart, ArrowLeft, Sun, Feather, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onNext: () => void;
}

const ROSE_VERSES = [
  {
    title: 'الوردة الأبدیة 🌹',
    text: 'كأن ربنا خلق الورد ده كله عشان يختصر جمـالك ونقاء قلبك في وردة واحدة.'
  },
  {
    title: 'سحر النظرة 💫',
    text: 'جمالك مش محتاج توصفه كلمات، أنتي الوردة الوحيدة اللي بتنور عتمة أيامي.'
  },
  {
    title: 'عهد العشق 💍',
    text: 'بنات العالم كلهم زهور عادية.. وأنتي الوردة الملكية اللي ملهاش مثيل في الدنيا.'
  }
];

export const MagicRoseGlass: React.FC<Props> = ({ onNext }) => {
  const [verseIndex, setVerseIndex] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(1);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = () => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.5);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch (_) {}
  };

  const handleTouchRose = () => {
    setGlowIntensity((prev) => Math.min(prev + 0.5, 3));
    setVerseIndex((prev) => (prev + 1) % ROSE_VERSES.length);
    playChime();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#ff4d6d', '#ffd700', '#fbbf24']
      });
    } catch (_) {}
  };

  return (
    <div className="relative w-full min-h-screen bg-[#06010b] text-white flex flex-col justify-between p-4 md:p-8 select-none overflow-hidden text-center">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,63,94,0.22)_0%,_rgba(245,158,11,0.12)_45%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-rose-500/30 backdrop-blur-md self-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span className="text-xs md:text-sm font-bold text-rose-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            وردة العشق السحرية تحت الزجاج 🌹✨
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-300 to-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
          وردتك التي لا تذبل أبداً
        </h1>
        <p className="text-xs text-rose-200/70" style={{ fontFamily: "'Cairo', sans-serif" }}>
          (اضغطي على الجرس الزجاجي لسقي الوردة بالنور وسماع سرها 🔮)
        </p>
      </div>

      {/* MAGIC ROSE GLASS CLOCHE CONTAINER */}
      <div className="relative z-20 max-w-md w-full mx-auto my-auto flex flex-col items-center">
        
        {/* Interactive Glass Jar */}
        <div
          onClick={handleTouchRose}
          className="group cursor-pointer relative w-64 h-80 rounded-t-full bg-gradient-to-b from-white/10 via-white/5 to-black/60 border-2 border-rose-400/50 p-6 flex flex-col items-center justify-end shadow-[0_0_60px_rgba(244,63,94,0.4)] backdrop-blur-md transition-all duration-500 hover:scale-105"
        >
          {/* Glass Specular Refraction Highlight */}
          <div className="absolute top-4 left-6 w-3 h-48 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-full blur-[1px] pointer-events-none" />

          {/* Glowing Magic Rose Emblem */}
          <div className="relative mb-6">
            <div
              className="absolute -inset-6 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 blur-2xl transition-all duration-500 animate-pulse"
              style={{ opacity: 0.4 * glowIntensity }}
            />
            <div className="relative text-7xl transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]">
              🌹
            </div>
          </div>

          {/* Wooden Base Pedestal */}
          <div className="w-56 h-6 rounded-full bg-gradient-to-r from-[#2d1406] via-[#47220b] to-[#2d1406] border border-amber-600/50 shadow-2xl" />
        </div>

        {/* Verse Card */}
        <div className="w-full bg-black/50 border border-rose-500/40 p-4 rounded-2xl text-center mt-6 backdrop-blur-xl shadow-lg">
          <span className="text-amber-300 font-bold text-xs block mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {ROSE_VERSES[verseIndex].title}
          </span>
          <p className="text-white/95 text-sm md:text-base leading-relaxed font-bold" style={{ fontFamily: "'Amiri', 'Cairo', serif", direction: 'rtl' }}>
            "{ROSE_VERSES[verseIndex].text}"
          </p>
        </div>

      </div>

      {/* FOOTER ACTION BUTTON */}
      <div className="relative z-20 max-w-md mx-auto w-full pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 text-white font-extrabold text-sm md:text-base border border-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>تصفحي دفتر قصص الكوميكس الكارتونية.. 🎨📖</span>
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
