'use client';

import React, { useState, useRef } from 'react';
import { Heart, Sparkles, Laugh, ArrowRight, MessageCircle } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export const InsideJokesMoments: React.FC<Props> = ({ onNext }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const jokes = [
    {
      id: 1,
      title: " لما نتصل ونسرح سوا 📞😂",
      emoji: "🤪",
      subtitle: "المكالمة اللي بترسي على ضحك وسرحان",
      details: "افتكر دايماً لما نكون بنتكلم وتسرحي في النص، وأقولك رحتي فين؟ تقوليلي كنت بفكر فيك! ضحكتك وسرحانك هم سر سعادتي."
    },
    {
      id: 2,
      title: "لغة الإشارات العجيبة 🤫✨",
      emoji: "👀",
      subtitle: "الكلمات والنظرات اللي محدش بيفهمها غيرنا",
      details: "النظرة السريعة اللي بيننا وسط الناس، لما نفهم بعض من غير ما نتكلم كلمة واحدة.. دي أثبتت إننا روح واحدة مستحيل حد يفهمها غيرنا!"
    },
    {
      id: 3,
      title: "خناقة كل خروجة 🍔🍕",
      emoji: "🙈",
      subtitle: "هنأكل إيه النهاردة؟ - أي حاجة!",
      details: "الحوار الشهير اللي بيتكرر كل مرة: ناكل إيه؟ تقول لي أي حاجة، ولما اقترح تقولي لا مش بحب ده! وفي الآخر بنأكل نفس الحاجة وبنموت من الضحك!"
    },
    {
      id: 4,
      title: "القمصة السريعة والصلح السريع 🕊️💖",
      emoji: "🥺",
      subtitle: "الزعل اللي مبيكملش 5 دقائق",
      details: "أحلى حاجة فينا إن حتى لو زعلنا، الزعل مبيستحملش يقعد بيننا 5 دقائق! وبتنتهي دايماً بضحكة وحضن وسعادتنا ترجع أضعاف."
    }
  ];

  const minSwipeDistance = 35;

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    touchEndX.current = null;
    touchStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    touchEndX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev < jokes.length - 1 ? prev + 1 : 0));
      setIsOpen(false);
    } else if (isRightSwipe) {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : jokes.length - 1));
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Rose Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-pink-400/30 backdrop-blur-md self-center">
          <Laugh className="w-4 h-4 text-pink-400 fill-pink-400 animate-bounce" />
          <span className="text-xs md:text-sm font-bold text-pink-300 tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
            دفتر مواقفنا المضحكة 🤭🌸
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
          ذكريات بتخلينا نموت من الضحك سوا 💖
        </h1>
        <p className="text-pink-200/80 text-xs md:text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>
          👈 اسحبي بإصبعكِ يميناً ويساراً لتنقل بين كروت الذكريات ✨ 👉
        </p>
      </div>

      {/* HORIZONTAL SWIPE SEQUENTIAL CARDS (NO 2x2 GRID - HORIZONTAL SWIPE ONLY) */}
      <div className="relative z-20 max-w-md mx-auto w-full my-6 flex flex-col items-center">
        
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-grab active:cursor-grabbing w-full p-6 md:p-8 rounded-3xl bg-white/5 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(244,114,182,0.25)] flex flex-col items-center gap-4 text-center transition-all"
        >
          {/* Card Icon Emoji */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 flex items-center justify-center text-3xl shadow-lg border border-pink-200/50 shrink-0">
            {jokes[activeIndex].emoji}
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-base md:text-lg font-black text-pink-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {jokes[activeIndex].title}
            </h3>
            <p className="text-xs text-pink-200/70 font-semibold leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {jokes[activeIndex].subtitle}
            </p>
          </div>

          {isOpen ? (
            <div className="w-full mt-2 p-4 rounded-2xl bg-rose-500/10 border border-pink-400/20 text-xs md:text-sm text-pink-100 font-semibold leading-[2] animate-fadeIn text-center" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {jokes[activeIndex].details}
            </div>
          ) : (
            <span className="text-[11px] font-bold text-amber-200 flex items-center gap-1 mt-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <MessageCircle className="w-3.5 h-3.5" />
              <span>انقري لقراءة الذكرى بالكامل ✨</span>
            </span>
          )}

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {jokes.map((_, idx) => (
              <div
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); setIsOpen(false); }}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  idx === activeIndex ? 'w-7 bg-pink-400 shadow-[0_0_10px_#f472b6]' : 'w-2 bg-white/20'
                }`}
              />
            ))}
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
