'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useConfig } from '@/lib/configContext';

interface Props {
  onNext: () => void;
}

export const LoveCounter: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateTimer = () => {
      const startStr = config.relationshipStartDate || '2024-03-14';
      const parts = startStr.split('-');
      let startDate: Date;
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        startDate = new Date(y, m, d, 0, 0, 0);
      } else {
        startDate = new Date(startStr);
      }

      const now = new Date();
      const diff = Math.max(0, now.getTime() - startDate.getTime());

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [config.relationshipStartDate]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-transparent text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Rose Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.2)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER WITH FLOURISH DIVIDER AND CLEARANCE FOR BACK BUTTON */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-12 sm:pt-14 px-12 sm:px-16">
        {/* MAIN TITLE FROM CONFIG */}
        <h1
          className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 leading-[1.8] py-1 max-w-xl mx-auto px-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {config.counterTitle || 'معكِ في كل ثانية ودقيقة من العمر 🌸'}
        </h1>

        {/* ELEGANT FLOURISH DIVIDER */}
        <div className="flex items-center justify-center gap-3 text-pink-400/60 my-1">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
          <Heart className="w-4 h-4 fill-pink-400/80 animate-pulse" />
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
        </div>
      </div>

      {/* CHAMFERED VERTICAL TIMER CARDS */}
      <div className="relative z-20 max-w-2xl mx-auto w-full my-4 flex flex-col items-center gap-5">
        
        {/* TIMER GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full">
          
          {/* Card 1: Days */}
          <div className="relative p-4 sm:p-5 rounded-3xl bg-white/5 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_25px_rgba(244,114,182,0.2)] flex flex-col items-center gap-2 hover:border-pink-300 transition-all overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-pink-400/40 flex items-center justify-center text-lg shadow-inner">
              🗓️
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-200 font-mono" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {timeElapsed.days}
            </span>
            <span className="text-[11px] font-bold text-pink-200/90" style={{ fontFamily: "'Cairo', sans-serif" }}>يوماً من الحب</span>
          </div>

          {/* Card 2: Hours */}
          <div className="relative p-4 sm:p-5 rounded-3xl bg-white/5 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_25px_rgba(244,114,182,0.2)] flex flex-col items-center gap-2 hover:border-pink-300 transition-all overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-pink-400/40 flex items-center justify-center text-lg shadow-inner">
              ⏰
            </div>
            <span className="text-2xl sm:text-3xl font-black text-pink-200 font-mono" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {timeElapsed.hours}
            </span>
            <span className="text-[11px] font-bold text-pink-200/90" style={{ fontFamily: "'Cairo', sans-serif" }}>ساعة دافئة</span>
          </div>

          {/* Card 3: Minutes */}
          <div className="relative p-4 sm:p-5 rounded-3xl bg-white/5 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_25px_rgba(244,114,182,0.2)] flex flex-col items-center gap-2 hover:border-pink-300 transition-all overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-pink-400/40 flex items-center justify-center text-lg shadow-inner">
              💖
            </div>
            <span className="text-2xl sm:text-3xl font-black text-rose-200 font-mono" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {timeElapsed.minutes}
            </span>
            <span className="text-[11px] font-bold text-pink-200/90" style={{ fontFamily: "'Cairo', sans-serif" }}>دقيقة عشق</span>
          </div>

          {/* Card 4: Seconds */}
          <div className="relative p-4 sm:p-5 rounded-3xl bg-white/5 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_25px_rgba(244,114,182,0.2)] flex flex-col items-center gap-2 hover:border-pink-300 transition-all overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-pink-400/40 flex items-center justify-center text-lg shadow-inner animate-pulse">
              ✨
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono animate-pulse" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {timeElapsed.seconds}
            </span>
            <span className="text-[11px] font-bold text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>ثانية نبض</span>
          </div>

        </div>

        {/* ROMANTIC QUOTE BOX DYNAMICALLY CONNECTED TO CONFIG */}
        <div className="w-full p-5 sm:p-6 rounded-3xl bg-white/5 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(244,114,182,0.2)] flex flex-col items-center gap-2 text-center overflow-hidden relative">
          
          <span className="text-3xl font-black text-rose-400 filter drop-shadow-[0_0_8px_#f472b6]">
            “ ”
          </span>

          <p className="text-xs sm:text-sm font-bold text-pink-100 max-w-lg leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {config.counterQuote || '"كل ثانية مرت وأنا معاك، كانت تساوي عمر كامل من السعادة والراحة.. ووقفت قلبي يزيد معك في كل دقيقة تمضي" ❤️✨'}
          </p>

          {/* Subtle Floating Heart Outlines */}
          <Heart className="absolute bottom-3 left-4 w-6 h-6 text-pink-500/20 pointer-events-none" />
          <Heart className="absolute top-3 right-4 w-6 h-6 text-pink-500/20 pointer-events-none" />

        </div>

      </div>

      {/* FOOTER BUTTON CONNECTED DIRECTLY TO CONFIG WITH CLEARANCE */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-32 sm:pb-36">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.counterButtonText || 'المظاريف والرسائل'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

      <div className="h-24 sm:h-28 shrink-0 pointer-events-none" />

    </div>
  );
};
