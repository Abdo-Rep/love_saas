'use client';

import React, { useState } from 'react';
import { X, ArrowRight, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useConfig } from '@/lib/configContext';

interface Props {
  onNext: () => void;
}

export const OpenWhenLetters: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [openingId, setOpeningId] = useState<number | null>(null);

  const letters = (config.openWhenLetters || []).filter((l) => l.enabled !== false);

  const handleOpenLetter = (idx: number) => {
    setOpeningId(idx);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
      });
    } catch {}

    setTimeout(() => {
      setActiveCategory(idx);
      setIsOpenModal(true);
      setOpeningId(null);
    }, 400);
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-transparent text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Rose Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER WITH CLEARANCE FOR BACK BUTTON */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-12 sm:pt-14 px-12 sm:px-16">
        <h1
          className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 leading-[1.8] py-1"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {config.openWhenLettersTitle || 'افتحيها لما تحسي بـ... 🌸'}
        </h1>
      </div>

      {/* 5 ENVELOPES VERTICAL LIST */}
      <div className="relative z-20 max-w-xl mx-auto w-full my-4 flex flex-col gap-3.5 px-2">
        {letters.map((letter, idx) => {
          const isOpening = openingId === idx;

          return (
            <div
              key={letter.id || idx}
              onClick={() => handleOpenLetter(idx)}
              className={`group cursor-pointer rounded-3xl p-5 sm:p-6 border border-pink-400/30 bg-white/5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between text-right hover:border-pink-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_25px_rgba(244,114,182,0.15)] relative overflow-hidden ${
                isOpening ? 'scale-105 border-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.5)]' : ''
              }`}
            >
              {/* Envelope Flap Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-pink-400/30 text-[11px] font-extrabold text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {letter.badge}
                </span>
                <span className="text-2xl">{letter.icon}</span>
              </div>

              {/* Envelope Body */}
              <div className="py-4 flex flex-col gap-1.5">
                <h3 className="text-base font-black text-pink-100 group-hover:text-amber-200 transition-colors" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {letter.title}
                </h3>
                <p className="text-xs text-pink-200/70 font-semibold line-clamp-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {letter.subtitle}
                </p>
              </div>

              {/* Click to open badge */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                <span>افتحي الرسالة ✨</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* LETTER FULL MODAL */}
      {isOpenModal && letters[activeCategory] && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-lg w-full rounded-3xl bg-gradient-to-b from-[#2a041c] via-[#1a0212] to-black border-2 border-pink-400/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(244,114,182,0.5)] relative overflow-hidden flex flex-col gap-5 text-right">
            
            <button
              onClick={() => setIsOpenModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white hover:bg-rose-500/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-3xl">{letters[activeCategory].icon}</span>
              <div>
                <span className="text-xs text-amber-300 font-extrabold block" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {letters[activeCategory].badge}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-pink-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {letters[activeCategory].title}
                </h2>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-pink-400/20 max-h-72 overflow-y-auto">
              <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed font-bold whitespace-pre-wrap" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {letters[activeCategory].content}
              </p>
            </div>

            <button
              onClick={() => setIsOpenModal(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer hover:scale-102 transition-transform"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              رجوع ↩️
            </button>
          </div>
        </div>
      )}

      {/* FOOTER BUTTON WITH CLEARANCE */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-32 sm:pb-36">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.openWhenLettersButtonText || 'ألبوم الصور'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

      <div className="h-24 sm:h-28 shrink-0 pointer-events-none" />

    </div>
  );
};
