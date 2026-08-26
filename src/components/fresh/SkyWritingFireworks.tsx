'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, RefreshCw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onRestart: () => void;
}

export const SkyWritingFireworks: React.FC<Props> = ({ onRestart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fireworksCount, setFireworksCount] = useState(0);

  // Trigger heart fireworks on canvas click/tap
  const handleLaunchFirework = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setFireworksCount((prev) => prev + 1);

    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { x, y },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#38bdf8', '#a855f7'],
        shapes: ['circle', 'square'],
        scalar: 1.2
      });
    } catch (_) {}
  };

  // Launch initial celebration fireworks
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
      });
    } catch (_) {}
  }, []);

  return (
    <div
      onClick={handleLaunchFirework}
      className="relative w-full min-h-screen bg-[#030108] text-white flex flex-col justify-between p-6 select-none overflow-hidden cursor-crosshair text-center"
    >
      {/* Starry Night Canvas Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="w-full h-full bg-[radial-gradient(#ffd700_1.5px,transparent_1.5px)] [background-size:36px_36px] animate-pulse" />
      </div>

      {/* Radial Nebula Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.25)_0%,_transparent_75%)] pointer-events-none" />

      {/* TOP HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/40 backdrop-blur-md self-center">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span className="text-xs md:text-sm font-bold text-amber-300 tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
            سماء الألعاب النارية والقلوب المضيئة 🎆✨
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-200 to-pink-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
          اضغطي في أي مكان لإطلاق القلوب! 💖
        </h1>
        <p className="text-white/70 text-xs md:text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>
          عدد الألعاب النارية التي أطلقتها: <span className="font-extrabold text-amber-300 text-base">{fireworksCount}</span> 🎆
        </p>
      </div>

      {/* CENTER GLOWING SKY NAMES WRITING */}
      <div className="relative z-20 max-w-2xl mx-auto w-full my-auto flex flex-col items-center justify-center gap-6 pointer-events-none">
        <div className="relative p-8 md:p-12 rounded-3xl bg-black/50 border-2 border-amber-400/50 backdrop-blur-xl shadow-[0_0_80px_rgba(245,158,11,0.35)] flex flex-col items-center gap-4">
          
          <div className="flex items-center justify-center gap-4 text-3xl md:text-5xl font-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300 filter drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" style={{ fontFamily: "'Cairo', sans-serif" }}>
              حبيبتي الملكة
            </span>
            <Heart className="w-10 h-10 md:w-14 md:h-14 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" style={{ fontFamily: "'Cairo', sans-serif" }}>
              حبيب العمر
            </span>
          </div>

          <p className="text-amber-200/90 text-sm md:text-lg font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>
            مكتوبان في سماء العشق للأبد... 🌟
          </p>

        </div>
      </div>

      {/* FOOTER RESTART BUTTON */}
      <div className="relative z-20 max-w-xs mx-auto w-full pb-6 text-center">
        <button
          onClick={(e) => { e.stopPropagation(); onRestart(); }}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 text-white font-extrabold text-base border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <RefreshCw className="w-5 h-5" />
          <span>إعادة المغامرة من البداية 🔄</span>
        </button>
      </div>

    </div>
  );
};
