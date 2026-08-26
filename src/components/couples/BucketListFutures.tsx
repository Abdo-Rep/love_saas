'use client';

import React from 'react';
import { Heart, Sparkles, Compass, ArrowRight, CheckCircle2, Circle, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useConfig } from '@/lib/configContext';
import { BucketListItem } from '@/types/config';

interface Props {
  onNext?: () => void;
}

export const BucketListFutures: React.FC<Props> = ({ onNext }) => {
  const { config, updateConfig } = useConfig();

  const items: BucketListItem[] = config.bucketListItems || [
    { id: 1, text: '✨ أول لقاء يجمعنا ونظرة العيون التي بدأت بها أجمل قصة حب ❤️', completed: true },
    { id: 2, text: '✈️ سفرية سوا لدولة أو مكان بنحبه ننسى فيها كل العالم ونستمتع بالبحر والنجوم', completed: false },
    { id: 3, text: '🍿 سهرة سينما مخصصة تحت النجوم مع فشار وفلمنا المفضل والهدوء التام', completed: false },
    { id: 4, text: '👩‍🍳 طبخة جديدة نجرب نعملها سوياً في المطبخ بكل حب وضحك', completed: false },
    { id: 5, text: '🏡 تفاصيل بيت أحلامنا المستقبلي ونختار كل ركن ولون وديكور سوا لمملكتنا', completed: false }
  ];

  const handleToggleItem = (index: number) => {
    const newItems = [...items];
    const nextState = !newItems[index].completed;
    newItems[index] = { ...newItems[index], completed: nextState };

    if (nextState) {
      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
        });
      } catch (_) {}
    }

    updateConfig({ bucketListItems: newItems });
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER WITH CLEARANCE FOR BACK BUTTON */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-12 sm:pt-14 px-12 sm:px-16">
        <h1
          className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 leading-[1.8] py-1"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {config.bucketListTitle || 'أحلام سنحققها معاً خطوة بخطوة 🌸'}
        </h1>

        <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
          انقري على أي أمنية لما تكتمل عشان نعلم عليها سوا 💖✨
        </p>

        {/* FLOURISH DIVIDER */}
        <div className="flex items-center justify-center gap-3 text-pink-400/60 my-1">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
          <Heart className="w-4 h-4 fill-pink-400/80 animate-pulse" />
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
        </div>
      </div>

      {/* INDIVIDUAL WISH BOXES LIST */}
      <div className="relative z-20 max-w-2xl mx-auto w-full my-4 flex flex-col gap-3.5 px-2">
        {items.map((item, idx) => {
          const isDone = !!item.completed;

          return (
            <div
              key={item.id || idx}
              onClick={() => handleToggleItem(idx)}
              className={`p-4 sm:p-5 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex items-center justify-between gap-3 text-right cursor-pointer shadow-lg select-none ${
                isDone
                  ? 'bg-gradient-to-r from-emerald-950/60 via-rose-950/40 to-black/60 border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.2)]'
                  : 'bg-white/5 border-pink-400/30 hover:border-pink-300/60 hover:scale-[1.01] active:scale-95 shadow-[0_0_20px_rgba(244,114,182,0.1)]'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Custom Interactive Checkbox Circle */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isDone
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-[0_0_15px_#34d399] scale-110'
                      : 'bg-black/40 border-2 border-pink-400/40 text-transparent'
                  }`}
                >
                  <Check className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[3] transition-transform ${isDone ? 'scale-100' : 'scale-0'}`} />
                </div>

                {/* Wish Text */}
                <p
                  className={`text-xs sm:text-sm font-black leading-relaxed transition-all ${
                    isDone ? 'text-emerald-200 line-through opacity-90' : 'text-pink-100/95'
                  }`}
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {item.text}
                </p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {isDone ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-extrabold text-emerald-300 shadow-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    حقّقناها 🎉
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-pink-400/20 text-[10px] font-bold text-pink-300/60" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    قيد التحقيق ✨
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER BUTTON WITH CLEARANCE */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-32 sm:pb-36">
        {onNext && (
          <button
            onClick={onNext}
            className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <span>{config.bucketListButtonText || 'التالي: الرسالة الأخيرة 💌👑'}</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>

      <div className="h-24 sm:h-28 shrink-0 pointer-events-none" />

    </div>
  );
};
