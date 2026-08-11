'use client';

import React, { useState } from 'react';
import { ReasonCard } from '@/types/config';
import { ChevronRight, ChevronLeft, Sparkles, Heart } from 'lucide-react';

interface Props {
  reasons: ReasonCard[];
}

export const SaturnRingCanvas: React.FC<Props> = ({ reasons }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reasons.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
  };

  const toggleFlip = (id: string | number) => {
    setFlippedCards((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
  };

  return (
    <div className="relative w-full py-12 px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Glow Rings in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-cosmic-gold/20 animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[22rem] rounded-full border border-cosmic-rosegold/30 pointer-events-none" />

      {/* Saturn 3D Orbit Layout */}
      <div className="relative w-full max-w-sm h-96 flex items-center justify-center perspective-1000">
        {reasons.map((item, idx) => {
          const total = reasons.length;
          const offset = (idx - activeIndex + total) % total;

          let transform = '';
          let zIndex = 0;
          let opacity = 0;

          if (offset === 0) {
            // Front Center Card
            transform = 'translate3d(0, 0, 100px) scale(1.05)';
            zIndex = 30;
            opacity = 1;
          } else if (offset === 1 || offset === total - 1) {
            // Immediate Left & Right
            const direction = offset === 1 ? 1 : -1;
            transform = `translate3d(${direction * 110}px, 0, -40px) rotateY(${direction * -25}deg) scale(0.85)`;
            zIndex = 20;
            opacity = 0.7;
          } else {
            // Far background cards
            const direction = offset < total / 2 ? 1 : -1;
            transform = `translate3d(${direction * 160}px, -20px, -120px) rotateY(${direction * -40}deg) scale(0.65)`;
            zIndex = 10;
            opacity = 0.3;
          }

          const isFlipped = !!flippedCards[String(item.id)];

          return (
            <div
              key={item.id}
              onClick={() => {
                if (offset === 0) {
                  toggleFlip(item.id);
                } else {
                  setActiveIndex(idx);
                }
              }}
              style={{
                transform,
                zIndex,
                opacity,
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              className="absolute w-64 h-80 cursor-pointer transform-style-3d select-none"
            >
              <div
                className={`w-full h-full relative duration-700 transform-style-3d transition-transform ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden rounded-2xl glass-panel-gold p-6 flex flex-col justify-between items-center text-center border-2 border-cosmic-gold/50 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                  <div className="w-12 h-12 rounded-full bg-cosmic-rosegold/30 border border-cosmic-rosegold flex items-center justify-center text-cosmic-gold mt-2">
                    <Heart className="w-6 h-6 fill-current text-rose-500 animate-pulse" />
                  </div>

                  <div>
                    <span className="text-xs text-cosmic-gold font-bold px-3 py-1 rounded-full bg-cosmic-bg/80 border border-cosmic-gold/30">
                      سبب رقم #{idx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-4">{item.title}</h3>
                  </div>

                  <p className="text-xs text-cosmic-rosegold flex items-center gap-1 font-medium mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> اضغطي لاكتشاف التفاصيل
                  </p>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-cosmic-deep via-cosmic-bg to-[#1a0a2a] p-6 flex flex-col justify-between items-center text-center border-2 border-cosmic-rosegold shadow-2xl">
                  <div className="w-full text-right border-b border-cosmic-rosegold/30 pb-2">
                    <span className="text-xs text-cosmic-gold font-bold">✨ سر قلبي</span>
                  </div>

                  <p className="text-sm md:text-base font-medium text-white leading-relaxed my-auto">
                    "{item.content}"
                  </p>

                  <p className="text-[10px] text-cosmic-rosegold">اضغطي مرة أخرى للقلب 🔄</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orbit Controls */}
      <div className="flex items-center gap-6 mt-8 z-40">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-cosmic-deep/80 border border-cosmic-gold/50 flex items-center justify-center text-cosmic-gold hover:scale-110 transition active:scale-95 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <span className="text-xs font-bold text-cosmic-gold tracking-widest px-4 py-1.5 rounded-full bg-cosmic-deep/60 border border-cosmic-rosegold/30">
          {activeIndex + 1} من {reasons.length}
        </span>

        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-cosmic-deep/80 border border-cosmic-gold/50 flex items-center justify-center text-cosmic-gold hover:scale-110 transition active:scale-95 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
