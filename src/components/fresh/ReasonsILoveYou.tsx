'use client';

import React, { useState, useRef } from 'react';
import { Heart, Sparkles, ArrowLeft, ArrowRight, CheckCircle2, Gift, X, Eye, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onNext: () => void;
}

const REASONS = [
  {
    id: 1,
    title: 'السبب الأول 💖',
    short: 'طيبة قلبك ونقائه',
    full: 'طيبة قلبك الصافي ونقائه اللي مفيش زيها في الدنيا دي كلها، بجد ربنا يديمك في حياتي ونعمتك في عمري.'
  },
  {
    id: 2,
    title: 'السبب الثاني 💫',
    short: 'ابتسامتك اللي بتنور يومي',
    full: 'ابتسامتك اللي بتفرحني وتخليني أنسى أي تعب أو ضيق من أول ما بشوفها في أي وقت.'
  },
  {
    id: 3,
    title: 'السبب الثالث 🌟',
    short: 'سحر عيونك ودفئها',
    full: 'عيونك الساحرة اللي بشوف فيها عالمي كله وسري ومكاني الآمن الوحيد اللي برتاح فيه.'
  },
  {
    id: 4,
    title: 'السبب الرابع 👑',
    short: 'حنيتك وتفاصيلك الصغيرة',
    full: 'حنيتك واهتمامك بأصغر التفاصيل اللي بتخطف قلبي كل يوم وتخليني أعشقك أكتر.'
  },
  {
    id: 5,
    title: 'السبب الخامس 💍',
    short: 'إنك السند والأمان لروحي',
    full: 'وجودك جنبي اللي بيديني الشجاعة والقوة قدام أي صعاب في الدنيا دي كلها.'
  },
  {
    id: 6,
    title: 'السبب السادس 🌹',
    short: 'روحك الحلوة وظلك الخفيف',
    full: 'ضحكتك الخفيفة وروحك الجميلة اللي بتملى أي مكان بالفرحة والبهجة والسرور.'
  },
  {
    id: 7,
    title: 'السبب السابع ✨',
    short: 'فهمك ليا من غير ما أتكلم',
    full: 'إنك بتفهمني من نظرة واحدة وبتحسي بيا من غير ما أنطق ولا كلمة ولا أشرح.'
  },
  {
    id: 8,
    title: 'السبب الثامن 🔮',
    short: 'ذوقك وأناقتك الفاتنة',
    full: 'أناقتك ورقتك الملكية اللي بتباني بيها دايماً أجمل وأرق ملكة في عيوني وقلبي.'
  },
  {
    id: 9,
    title: 'السبب التاسع 🕊️',
    short: 'نقاء نواياكي وصدقك',
    full: 'صدقك ونقاء مشاعرك اللي بيخلوني أثق فيكي وأحبك أكتر كل ثانية في حياتي.'
  },
  {
    id: 10,
    title: 'السبب العاشر 👑💖',
    short: 'أنك إنتي.. بكل ما فيكي',
    full: 'بنات العالم كلهم في كفة.. وإنتي في كفة لوحدك لأنك ملكة قلبي والعالم كله.'
  }
];

export const ReasonsILoveYou: React.FC<Props> = ({ onNext }) => {
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = () => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.35);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (_) {}
  };

  const handleOpenCard = (index: number) => {
    const reason = REASONS[index];
    setActiveModalIndex(index);
    playChime();

    if (!revealedIds.includes(reason.id)) {
      const newRevealed = [...revealedIds, reason.id];
      setRevealedIds(newRevealed);

      if (newRevealed.length === REASONS.length) {
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#ec4899', '#fbbf24', '#ffffff']
          });
        } catch (_) {}
      }
    }
  };

  const handleNextModal = () => {
    if (activeModalIndex !== null) {
      const nextIdx = (activeModalIndex + 1) % REASONS.length;
      handleOpenCard(nextIdx);
    }
  };

  const handlePrevModal = () => {
    if (activeModalIndex !== null) {
      const prevIdx = (activeModalIndex - 1 + REASONS.length) % REASONS.length;
      handleOpenCard(prevIdx);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#07020d] text-white flex flex-col justify-between p-4 md:p-8 select-none overflow-x-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.18)_0%,_rgba(236,72,153,0.1)_45%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-500/30 backdrop-blur-md self-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-xs md:text-sm font-bold text-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            10 أسباب سحرية كافية لأعشقك 🎴💖
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-pink-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
          لماذا أنتي الوحيدة في قلبي؟
        </h1>

        <p className="text-xs md:text-sm text-amber-200/70" style={{ fontFamily: "'Cairo', sans-serif" }}>
          (اضغطي على أي بطاقة لفتح سرها في نافذة ملكية مكبرة 🔮)
        </p>

        {/* Progress Tracker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 self-center text-xs font-semibold text-rose-300 mt-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>كروت مكشوفة: {revealedIds.length} / {REASONS.length}</span>
        </div>
      </div>

      {/* 10 CARDS GRID */}
      <div className="relative z-20 max-w-5xl mx-auto w-full my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 px-2">
        {REASONS.map((reason, idx) => {
          const isRevealed = revealedIds.includes(reason.id);

          return (
            <div
              key={reason.id}
              onClick={() => handleOpenCard(idx)}
              className={`relative w-full h-44 md:h-52 cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-between transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-md ${
                isRevealed
                  ? 'bg-gradient-to-br from-[#260e20] via-[#1a081a] to-[#0c0312] border-rose-500/70 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  : 'bg-gradient-to-br from-[#2a1308] via-[#1a0814] to-[#0d0312] border-amber-500/40 shadow-[inset_0_0_20px_rgba(245,158,11,0.15)]'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-xs font-bold">
                  #{reason.id}
                </span>
                {isRevealed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>

              <Gift className={`w-9 h-9 transition-transform ${isRevealed ? 'text-rose-400' : 'text-amber-400 animate-pulse'}`} />

              <div className="text-center w-full">
                <span className="text-xs font-bold text-amber-200/90 block truncate" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {reason.short}
                </span>
                <span className="text-[10px] text-white/40 block mt-0.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  اضغطي للتكبير ✨
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTION BUTTON */}
      <div className="relative z-20 max-w-md mx-auto w-full pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-black font-extrabold text-sm md:text-base border border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>افتحي صندوق الوعد والخاتم الملكي.. 🗝️</span>
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* POP-UP MODAL DIALOG FOR REVEALED REASON */}
      {activeModalIndex !== null && (
        <div
          onClick={() => setActiveModalIndex(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-gradient-to-b from-[#2a0e24] via-[#1a061a] to-[#0c0212] border-2 border-rose-500/70 p-6 md:p-8 rounded-3xl shadow-[0_0_70px_rgba(236,72,153,0.5)] text-right flex flex-col gap-5 cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-rose-500/30 pb-3">
              <button
                onClick={() => setActiveModalIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-extrabold text-sm md:text-base" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {REASONS[activeModalIndex].title}
                </span>
              </div>
            </div>

            {/* Short Title */}
            <h2 className="text-xl md:text-2xl font-black text-rose-200 border-b border-white/10 pb-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {REASONS[activeModalIndex].short}
            </h2>

            {/* Full Reason Body Message */}
            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl shadow-inner">
              <p
                className="text-white/95 text-base md:text-lg leading-relaxed font-bold"
                style={{ fontFamily: "'Amiri', 'Cairo', serif", direction: 'rtl' }}
              >
                "{REASONS[activeModalIndex].full}"
              </p>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-rose-500/30">
              <button
                onClick={handlePrevModal}
                className="px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <ArrowRight className="w-4 h-4" />
                <span>السبب السابق</span>
              </button>

              <span className="text-xs text-amber-300/80 font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {activeModalIndex + 1} من 10
              </span>

              <button
                onClick={handleNextModal}
                className="px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <span>السبب التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
