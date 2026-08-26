'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Trophy, ArrowRight, RotateCw, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useConfig } from '@/lib/configContext';

interface Props {
  onNext: () => void;
}

export const RomanticSpinWheel: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedRule, setSelectedRule] = useState<number | null>(null);
  const [kissCount, setKissCount] = useState<number>(0);

  const rules = [
    { text: config.spinWheelOutcomeText || "عليكِ بوسة رقيقة يا أميرتي 💋😘", icon: "💋", color: "from-rose-500 to-pink-500" },
    { text: "💆‍♂️ مساج 5 دقائق لكتفها وراحتها", icon: "💆‍♂️", color: "from-pink-500 to-purple-500" },
    { text: "🍦 تطلب لها الأكلة أو الحلو اللي بتحبه", icon: "🍦", color: "from-amber-400 to-rose-500" },
    { text: "🎶 ترقصوا سوا على أغنيتكم المفضلة", icon: "🎶", color: "from-rose-600 to-pink-400" },
    { text: "💌 تقول لها 3 حاجات بتحبهم فيها دلوقتي", icon: "💌", color: "from-purple-500 to-pink-500" },
    { text: "👑 يوم كامل دلال واهتمام خاص لأميرتك", icon: "👑", color: "from-amber-500 to-rose-500" }
  ];

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedRule(null);

    const targetIndex = 0; // Index 0: Kiss 💋
    const targetAngle = 360 - (targetIndex * 60 + 30); 
    const extraDegree = 360 * 5 + targetAngle; // 5 full spins + exact target angle
    const newRotation = rotation + extraDegree;

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedRule(targetIndex);
      setKissCount((prev) => prev + 1);

      try {
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
        });
      } catch (_) {}
    }, 3200);
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-6">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
          عجلة الأحكام الرومانسية 🎡💋
        </h1>
        <p className="text-xs sm:text-sm text-pink-200/80 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
          لِفي العجلة وشوفي إيه الحكم العاطفي المكتوب لكِ! ✨
        </p>
      </div>

      {/* SPIN WHEEL CENTER */}
      <div className="relative z-20 max-w-md mx-auto w-full my-4 flex flex-col items-center gap-6">
        
        {/* KISS COUNTER */}
        <div className="px-5 py-2 rounded-full bg-rose-500/20 border border-pink-400/40 backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_rgba(244,114,182,0.3)]">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-black text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
            رصيد البوسات المجمعة: {kissCount} 💋
          </span>
        </div>

        {/* WHEEL CONTAINER */}
        <div className="relative flex items-center justify-center">
          
          {/* Top Pointer */}
          <div className="absolute -top-4 z-30 w-8 h-8 flex items-center justify-center filter drop-shadow-[0_0_10px_#f472b6]">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-300" />
          </div>

          {/* THE WHEEL DISC */}
          <div
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
            }}
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-pink-400/50 shadow-[0_0_40px_rgba(244,114,182,0.4)] relative overflow-hidden bg-gradient-to-tr from-[#2a041c] to-[#0a010b]"
          >
            {rules.map((rule, idx) => {
              const deg = idx * 60;
              return (
                <div
                  key={idx}
                  style={{
                    transform: `rotate(${deg}deg)`,
                    transformOrigin: '50% 100%',
                    clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                  }}
                  className="absolute top-0 left-0 w-full h-1/2 flex flex-col items-center pt-3 text-center"
                >
                  <span className="text-2xl filter drop-shadow-md">{rule.icon}</span>
                </div>
              );
            })}
          </div>

          {/* SPIN BUTTON CENTER HUB */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs border-2 border-white/60 shadow-[0_0_25px_rgba(244,114,182,0.7)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {isSpinning ? <RotateCw className="w-6 h-6 animate-spin" /> : <span>دوران! 🎡</span>}
          </button>
        </div>

        {/* OUTCOME BOX */}
        {selectedRule !== null && (
          <div className="w-full p-4 rounded-2xl bg-rose-950/60 border border-pink-400/40 backdrop-blur-xl animate-fade-in text-center shadow-lg">
            <span className="text-xs text-amber-300 font-extrabold block mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
              الحكم الملكي الفائز: 👑💖
            </span>
            <p className="text-sm sm:text-base font-black text-pink-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {rules[selectedRule].text}
            </p>
          </div>
        )}

      </div>

      {/* FOOTER BUTTON CONNECTED TO CONFIG */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.spinWheelButtonText || 'التالي: قائمة أمنياتنا 🗺️✨'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
