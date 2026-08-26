'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Step6Celebration: React.FC<Props> = ({ onComplete }) => {
  useEffect(() => {
    // Fire golden stars & hearts confetti
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#b76e79', '#ffffff', '#e63946'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#b76e79', '#ffffff', '#e63946'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-[#0a0a1a]">
      <div className="z-10 space-y-6 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cosmic-gold via-cosmic-rosegold to-rose-600 flex items-center justify-center mx-auto shadow-[0_0_60px_#FFD700]">
          <Heart className="w-12 h-12 text-white fill-current animate-bounce" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white title-glow">
          مرحباً بكِ في عالمنا الدافئ ✨❤️
        </h2>
        <p className="text-sm text-cosmic-gold flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4" /> جاري التجهيز لاستكشاف الذكريات...
        </p>
      </div>
    </div>
  );
};
