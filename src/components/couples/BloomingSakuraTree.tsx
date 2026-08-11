'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onNext: () => void;
}

export const BloomingSakuraTree: React.FC<Props> = ({ onNext }) => {
  const [activeFlower, setActiveFlower] = useState<number | null>(null); // Null by default until she clicks!

  const flowers = [
    {
      id: 0,
      name: "زهرة الابتسامة",
      emoji: "💖",
      icon: "🌷",
      color: "from-pink-500/20 to-rose-500/10",
      quote: "ابتسامتكِ هي السحر اللي ينور دنيتي كلها ويخليني أبتسم بحب ورضا دايماً."
    },
    {
      id: 1,
      name: "زهرة المحبة",
      emoji: "🌸",
      icon: "🌹",
      color: "from-rose-500/30 to-pink-500/20",
      quote: "حنيتكِ وطيبة قلبكِ هما السند الحقيقي اللي بيهون عليا أي صعب في الحياة."
    },
    {
      id: 2,
      name: "زهرة العهد",
      emoji: "💍",
      icon: "🪷",
      color: "from-purple-500/20 to-indigo-500/10",
      quote: "نوعد بعض إن حبنا يفضل يزهر وينمو مع كل يوم جديد يعدي علينا سوا."
    },
    {
      id: 3,
      name: "زهرة الأمان",
      emoji: "🕊️",
      icon: "💐",
      color: "from-amber-500/20 to-rose-500/10",
      quote: "معاكي بحس إن الدنيا كلها بخير وإن قلبي في بيته الأمني المضمون."
    }
  ];

  const handleSelectFlower = (idx: number) => {
    setActiveFlower(idx);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
      });
    } catch (_) {}
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Rose Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.2)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER TITLE */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-1 pt-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
          بستان زهور مشاعرنا 🌸👑
        </h1>
      </div>

      {/* MAIN CONTAINER CARD */}
      <div className="relative z-20 max-w-3xl mx-auto w-full my-4">
        <div className="w-full rounded-[32px] bg-gradient-to-b from-[#2d0a22] via-[#1f0617] to-[#12020e] border-2 border-pink-400/40 p-5 sm:p-8 shadow-[0_0_60px_rgba(244,114,182,0.35)] flex flex-col items-center gap-6">
          
          {/* Top 3D Glowing Heart Badge */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 flex items-center justify-center shadow-[0_0_25px_#f472b6] border-2 border-white animate-bounce">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>

          {/* Card Title & Subtitle */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              بستان مشاعرنا الوردي 🌸👑
            </h2>
            <p className="text-xs sm:text-sm text-pink-300/80 font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              ✦ لغة الزهور تتحدث عن سر حُبي لكِ ✦
            </p>
          </div>

          {/* 4 FLOWER CARDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full pt-2">
            {flowers.map((flw) => {
              const isSelected = activeFlower === flw.id;

              return (
                <div
                  key={flw.id}
                  onClick={() => handleSelectFlower(flw.id)}
                  className={`group cursor-pointer relative rounded-2xl p-4 flex flex-col items-center justify-between gap-3 transition-all duration-300 backdrop-blur-md border ${
                    isSelected
                      ? 'bg-gradient-to-b from-rose-600/30 via-pink-600/20 to-purple-900/40 border-2 border-rose-400 shadow-[0_0_30px_rgba(244,114,182,0.5)] scale-105'
                      : 'bg-white/5 border-pink-400/20 hover:bg-white/10 hover:border-pink-300/40'
                  }`}
                >
                  {/* Top Checkmark Badge for Selected Card */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md border border-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* High-res Flower Illustration / Emoji */}
                  <div className={`text-4xl sm:text-5xl filter drop-shadow-[0_0_12px_rgba(244,114,182,0.5)] transition-transform duration-300 group-hover:scale-110 ${isSelected ? 'animate-bounce' : ''}`}>
                    {flw.icon}
                  </div>

                  {/* Flower Name Label */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs sm:text-sm font-black text-pink-100 group-hover:text-amber-200 transition-colors" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      {flw.name}
                    </span>
                    <span className="text-xs">{flw.emoji}</span>
                  </div>

                  {/* Bottom Radio Circle */}
                  <div className="mt-1">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-rose-400 bg-rose-500 shadow-[0_0_10px_#f472b6]'
                        : 'border-pink-400/40 bg-transparent'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* BOTTOM QUOTE BOX CONTAINER (HIDDEN UNTIL SHE CLICKS A FLOWER!) */}
          <div className="w-full p-4 sm:p-5 rounded-2xl bg-black/40 border border-pink-400/30 backdrop-blur-xl flex items-center justify-between gap-4 text-center sm:text-right relative overflow-hidden">
            
            {/* Quote Mark Left Accent */}
            <span className="text-3xl text-pink-400/40 font-serif font-bold leading-none shrink-0">
              “
            </span>

            {/* Selected Flower Quote Text */}
            <p className="text-xs sm:text-sm md:text-base font-bold text-pink-100 leading-relaxed flex-grow text-center" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {activeFlower !== null
                ? flowers[activeFlower].quote
                : "انقري على أي زهرة من الأعلى لاكتشاف سر مشاعرها لكِ... 🌸✨"}
            </p>

            {/* Heart Doodle Right Accent */}
            <div className="shrink-0 text-pink-400/60">
              <Heart className="w-5 h-5 fill-rose-500/30 text-pink-400" />
            </div>

          </div>

        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>التالي: قائمة أمنياتنا الكبرى 🗺️✈️</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
