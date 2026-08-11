'use client';

import React, { useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { Gift, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SurpriseButtonSection: React.FC = () => {
  const { config } = useConfig();
  const steps = config.surpriseSteps || [
    'هل أنتِ جادة وتريدين رؤية المفاجأة؟ 🎁',
    'متأكدة 100%؟ لا توجد العودة بعد هذه النقطة! 🙈',
    'فرصتكِ الأخيرة للتراجع.. تضغطي حقاً؟ 💖',
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClick = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsRevealed(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#b76e79', '#ffffff'],
      });
    }
  };

  return (
    <section className="w-full py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md glass-panel-gold rounded-3xl p-8 border-2 border-cosmic-gold/50 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cosmic-rosegold/30 border border-cosmic-gold flex items-center justify-center mx-auto text-cosmic-gold">
          <Gift className="w-8 h-8 animate-bounce" />
        </div>

        <h3 className="text-xl font-bold text-white">زر المفاجأة الكبرى ✨</h3>

        {!isRevealed ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-cosmic-gold">
              {steps[currentStepIndex]}
            </p>

            <button
              onClick={handleClick}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cosmic-rosegold via-cosmic-gold to-cosmic-rosegold text-cosmic-bg font-extrabold text-lg shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" /> اضغطي هنا لمواصلة المفاجأة
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cosmic-deep to-[#14143a] border border-cosmic-gold animate-fade-in space-y-4 shadow-2xl">
            <Heart className="w-10 h-10 text-rose-500 fill-current mx-auto animate-pulse" />
            <p className="text-lg md:text-xl font-bold text-white leading-relaxed typewriter-glow">
              "{config.surpriseFinalMessage}"
            </p>
            <button
              onClick={() => {
                setIsRevealed(false);
                setCurrentStepIndex(0);
              }}
              className="text-xs text-cosmic-rosegold hover:underline pt-2 inline-block"
            >
              إعادة تجربة الزر 🔄
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
