'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, TreePine, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onNext: () => void;
}

export const FutureTreeWishes: React.FC<Props> = ({ onNext }) => {
  const [activeWish, setActiveWish] = useState<number | null>(null);

  const wishes = [
    {
      id: 1,
      title: "أمنية البيت الدافي 🏡💖",
      content: "بيت صغنن ودافي يجمعنا سوا، مالي بالضحك والهدوء والحب اللي مبيخلصش."
    },
    {
      id: 2,
      title: "أمنية السفرية المجنونة ✈️🌴",
      content: "نسافر مكان بعيد للبحر والنجوم، وننسى كل الدنيا ونعيش نضحك سوا."
    },
    {
      id: 3,
      title: "أمنية النجاح المشترك 🏆✨",
      content: "أشوفك دايماً في أعلا المراتب وأنجح النماذج وأنا جنبك فخور بيكي وداعم ليكي."
    },
    {
      id: 4,
      title: "أمنية الضحكة الخالدة 👑😊",
      content: "إن الضحكة الرقيقة دي عمرها ما تفارق وشك طول العمر، وأكون دايماً السبب فيها."
    }
  ];

  const handleLeafClick = (idx: number) => {
    setActiveWish(idx);
    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#ff4d6d', '#ffffff']
      });
    } catch (_) {}
  };

  return (
    <div className="relative w-full min-h-screen bg-[#04010a] text-white flex flex-col justify-between p-4 md:p-8 select-none overflow-x-hidden text-center">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.18)_0%,_transparent_70%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/40 backdrop-blur-md self-center">
          <TreePine className="w-4 h-4 text-amber-300 animate-bounce" />
          <span className="text-xs md:text-sm font-bold text-amber-300 tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
            شجرة أحلامنا ورسائل المستقبل 🌳💌
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-200 to-pink-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
          اضغطي على الأوراق المضيئة لاكتشاف أحلامنا
        </h1>
      </div>

      {/* INTERACTIVE GOLDEN TREE INTERFACE */}
      <div className="relative z-20 max-w-lg mx-auto w-full my-6 flex flex-col items-center">
        <div className="relative w-full p-8 rounded-3xl bg-gradient-to-b from-[#1c0a2a] via-[#100318] to-black border-2 border-amber-400/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(245,158,11,0.3)] flex flex-col items-center gap-6">
          
          {/* GLOWING LEAVES GRID */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {wishes.map((w, idx) => (
              <button
                key={w.id}
                onClick={() => handleLeafClick(idx)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 text-center active:scale-95 ${
                  activeWish === idx
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 border-amber-300 text-white shadow-[0_0_25px_rgba(245,158,11,0.7)] scale-105'
                    : 'bg-white/5 border-amber-400/30 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400'
                }`}
              >
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                <span className="text-xs md:text-sm font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {w.title}
                </span>
              </button>
            ))}
          </div>

          {/* ACTIVE WISH DISPLAY */}
          {activeWish !== null && (
            <div className="w-full p-5 rounded-2xl bg-white/5 border border-amber-400/40 text-amber-100 text-xs md:text-sm font-bold leading-relaxed animate-fadeIn" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {wishes[activeWish].content}
            </div>
          )}

        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-2">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 text-white font-extrabold text-base border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>انتقلي لـ قائمة أمنياتنا الكبرى 🗺️✈️</span>
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
      </div>

    </div>
  );
};
