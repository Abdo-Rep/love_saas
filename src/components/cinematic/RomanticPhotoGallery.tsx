'use client';

import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Heart, Music } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export const RomanticPhotoGallery: React.FC<Props> = ({ onNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 10 Aesthetic Romantic Girl Portrait Cards
  const photoCards = [
    {
      id: 1,
      title: "أجمل عيون في الدنيا 👁️✨",
      subtitle: "من أول دقيقة شفتك فيها.. وعيونك خطفت قلبي وبقيت مش بشوف غيرك",
      bgGradient: "from-pink-900/60 via-purple-900/40 to-black",
      accentColor: "#ec4899",
      emoji: "🌸"
    },
    {
      id: 2,
      title: "ابتسامتك بتنور عتمة أيامي ☀️",
      subtitle: "كل ما تبتسمي، بحس إن الدنيا كلها بخير وإن ضحكتك هي دوا لقلبي",
      bgGradient: "from-amber-900/60 via-rose-900/40 to-black",
      accentColor: "#f59e0b",
      emoji: "💖"
    },
    {
      id: 3,
      title: "رقة ولطف مش موجودين في حد 🎀",
      subtitle: "طبتك ورقتك بيخلوني أحس إنك الملاك المرشد اللي جه غير حياتي للأفضل",
      bgGradient: "from-rose-900/60 via-pink-900/40 to-black",
      accentColor: "#f43f5e",
      emoji: "🕊️"
    },
    {
      id: 4,
      title: "النجمة الثابتة في سمائي 🌌",
      subtitle: "مهما تغيرت الظروف وتغيب النجوم.. بتفضلي إنتي النور الوحيد اللي مرشدني",
      bgGradient: "from-[#1a0c36] via-purple-900/40 to-black",
      accentColor: "#a855f7",
      emoji: "⭐"
    },
    {
      id: 5,
      title: "وردة عمري النادرة 🌹",
      subtitle: "قطفتلك حب قلبي كله، ووردة عمرها ما هتدبل طول ما أنا عايش",
      bgGradient: "from-red-950/70 via-rose-900/40 to-black",
      accentColor: "#ef4444",
      emoji: "🌷"
    },
    {
      id: 6,
      title: "أنا وأنتي ضد العالم 🛡️❤️",
      subtitle: "وجودك جنبي بيديني القوة والشجاعة عشان أواجه أي حاجة في الدنيا دي",
      bgGradient: "from-amber-950/70 via-orange-900/40 to-black",
      accentColor: "#fbbf24",
      emoji: "✨"
    },
    {
      id: 7,
      title: "سعادة مفرطة في كل لحظة 🦋",
      subtitle: "حبك بيخليني أطير زي الفراشة وسط النجوم خفيف وسعيد بقربك",
      bgGradient: "from-fuchsia-950/70 via-pink-900/40 to-black",
      accentColor: "#d946ef",
      emoji: "🦋"
    },
    {
      id: 8,
      title: "أرق الحكايات والنغمات 🎵",
      subtitle: "صوتك ووجودك هم أجمل نغمة سمعتها أذني في الحياة",
      bgGradient: "from-indigo-950/70 via-purple-900/40 to-black",
      accentColor: "#818cf8",
      emoji: "🎶"
    },
    {
      id: 9,
      title: "عهد ووعد للأبد 💍",
      subtitle: "مكانك في قلبي محفور للأبد، وعمري ما هستغنى عنك يا أغلى ما عندي",
      bgGradient: "from-amber-900/70 via-yellow-900/40 to-black",
      accentColor: "#facc15",
      emoji: "💎"
    },
    {
      id: 10,
      title: "إنتي مش واحدة من البنات.. إنتي العالم كله 👑💫",
      subtitle: "دورت في كل مكان وزمان، ورجعتلك إنتي عشان إنتي كل الدنيا بالنسبة لي",
      bgGradient: "from-rose-950/80 via-purple-950/60 to-black",
      accentColor: "#f43f5e",
      emoji: "👸"
    }
  ];

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);

  const handleNextCard = () => {
    if (currentIndex < photoCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || startXRef.current === null) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset > 35) {
      handlePrevCard();
    } else if (dragOffset < -35) {
      handleNextCard();
    }
    setDragOffset(0);
    startXRef.current = null;
  };

  return (
    <div className="min-h-screen w-full bg-[#05020a] text-white flex flex-col justify-between p-4 md:p-8 select-none relative overflow-hidden">
      {/* Ambient Radial Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/25 via-[#05020a] to-black pointer-events-none" />

      {/* Floating Sparkles Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30 animate-pulse">
        <div className="w-full h-full bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>

      {/* TOP HEADER */}
      <div className="relative z-10 flex justify-between items-center max-w-4xl mx-auto w-full pt-2">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-pink-500/30 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
          <span className="text-xs md:text-sm font-bold text-pink-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            معرض الصور والذكريات الكونية 📸
          </span>
        </div>
        
        <span className="text-xs md:text-sm font-mono text-amber-300/80 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
          {currentIndex + 1} / {photoCards.length}
        </span>
      </div>

      {/* MAIN CAROUSEL CARDS AREA */}
      <div className="relative z-10 my-auto w-full max-w-4xl mx-auto flex flex-col items-center">
        
        {/* SWIPABLE CARD CONTAINER */}
        <div 
          ref={scrollContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-[52vh] min-h-[380px] max-h-[520px] relative flex items-center justify-center perspective-1000 cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {photoCards.map((card, index) => {
            const offset = index - currentIndex;
            const isActive = index === currentIndex;

            // Compute 3D Card Stacking Transforms
            let transformStyle = '';
            let opacityStyle = 0;
            let zIndexStyle = 0;

            if (isActive) {
              transformStyle = `translateX(${dragOffset}px) scale(1) rotate(0deg)`;
              opacityStyle = 1;
              zIndexStyle = 30;
            } else if (offset === 1) {
              transformStyle = 'translateX(65%) scale(0.85) rotate(6deg)';
              opacityStyle = 0.55;
              zIndexStyle = 20;
            } else if (offset === -1) {
              transformStyle = 'translateX(-65%) scale(0.85) rotate(-6deg)';
              opacityStyle = 0.55;
              zIndexStyle = 20;
            } else if (offset > 1) {
              transformStyle = 'translateX(120%) scale(0.7) rotate(12deg)';
              opacityStyle = 0;
              zIndexStyle = 10;
            } else {
              transformStyle = 'translateX(-120%) scale(0.7) rotate(-12deg)';
              opacityStyle = 0;
              zIndexStyle = 10;
            }

            return (
              <div
                key={card.id}
                onClick={() => setCurrentIndex(index)}
                className={`absolute w-[88%] md:w-[68%] max-w-md h-full rounded-[32px] p-6 md:p-8 border-2 transition-all duration-700 ease-out cursor-pointer flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-gradient-to-b ${card.bgGradient}`}
                style={{
                  transform: transformStyle,
                  opacity: opacityStyle,
                  zIndex: zIndexStyle,
                  borderColor: isActive ? `${card.accentColor}80` : 'rgba(255,255,255,0.1)',
                  boxShadow: isActive ? `0 20px 50px ${card.accentColor}30, inset 0 0 30px ${card.accentColor}20` : 'none'
                }}
              >
                {/* Decorative Top Sparkle & Number */}
                <div className="flex justify-between items-center z-10">
                  <span className="text-4xl animate-bounce">{card.emoji}</span>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm border backdrop-blur-md"
                    style={{ 
                      borderColor: card.accentColor, 
                      color: card.accentColor,
                      backgroundColor: `${card.accentColor}15`
                    }}
                  >
                    #{card.id}
                  </div>
                </div>

                {/* Card Center Illustration Frame */}
                <div className="my-auto flex flex-col items-center justify-center text-center z-10 py-4">
                  <div 
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 p-2 flex items-center justify-center shadow-2xl relative mb-6"
                    style={{ borderColor: `${card.accentColor}60` }}
                  >
                    {/* Glowing Ring */}
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-25"
                      style={{ backgroundColor: card.accentColor }}
                    />
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-black/80 to-purple-900/60 flex items-center justify-center border border-white/20">
                      <span className="text-5xl md:text-6xl">{card.emoji}</span>
                    </div>
                  </div>

                  <h3 
                    className="text-2xl md:text-3xl font-extrabold mb-3 text-white tracking-wide leading-snug"
                    style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}
                  >
                    {card.title}
                  </h3>

                  <p 
                    className="text-white/80 text-sm md:text-base leading-relaxed max-w-xs font-medium"
                    style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}
                  >
                    {card.subtitle}
                  </p>
                </div>

                {/* Card Bottom Progress Accent */}
                <div className="flex items-center justify-between text-xs text-white/50 z-10 pt-2 border-t border-white/10" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  <span>سحب للتمرير ↔</span>
                  <span style={{ color: card.accentColor }}>ذكريات خاصة ♥</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CAROUSEL NAVIGATION ARROWS & DOTS */}
        <div className="flex items-center gap-6 mt-6 z-20">
          <button
            onClick={handlePrevCard}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full border transition-all active:scale-95 ${
              currentIndex === 0
                ? 'opacity-30 border-white/10 text-white/40 cursor-not-allowed'
                : 'opacity-100 border-pink-500/50 bg-pink-500/20 text-pink-300 hover:bg-pink-500/40'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {photoCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.8)]'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextCard}
            disabled={currentIndex === photoCards.length - 1}
            className={`p-3 rounded-full border transition-all active:scale-95 ${
              currentIndex === photoCards.length - 1
                ? 'opacity-30 border-white/10 text-white/40 cursor-not-allowed'
                : 'opacity-100 border-pink-500/50 bg-pink-500/20 text-pink-300 hover:bg-pink-500/40'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* BOTTOM BUTTON: "تيجي نرقص؟ 💃🕺" (Appears prominently!) */}
      <div className="relative z-20 max-w-md mx-auto w-full pb-4 pt-2 text-center">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white text-lg font-extrabold border-2 border-pink-400/60 hover:from-pink-500 hover:to-amber-400 transition-all active:scale-95 shadow-[0_0_35px_rgba(236,72,153,0.6)] flex items-center justify-center gap-3 group"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span className="text-2xl animate-bounce">📖</span>
          <span className="tracking-wide">افتح كتاب العشق الملكي</span>
          <span className="text-2xl animate-bounce">✨</span>
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
      `}</style>
    </div>
  );
};
