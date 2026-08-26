'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Lock, Unlock, Calendar, ArrowRight, Hourglass, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onNext: () => void;
}

export const LoveTimeCapsule: React.FC<Props> = ({ onNext }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Target Date State (Default: 14 March 2025 - Anniversary Date)
  const [targetDateStr, setTargetDateStr] = useState('2025-03-14');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const targetDate = new Date(`${targetDateStr}T00:00:00`);
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        // AUTOMATIC UNLOCK WHEN TARGET DATE IS REACHED/PASSED!
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!isUnlocked) {
          setIsUnlocked(true);
          try {
            confetti({
              particleCount: 140,
              spread: 90,
              origin: { y: 0.5 },
              colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
            });
          } catch (_) {}
        }
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr, isUnlocked]);

  const handleUnlockCapsule = () => {
    setIsUnlocked(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
      });
    } catch (_) {}
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-6">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
          رسالة محفوظة للمستقبل لا تُفتح إلا بحب 💖
        </h1>
      </div>

      {/* CAPSULE INTERFACE */}
      <div className="relative z-20 max-w-md mx-auto w-full my-4">
        {!isUnlocked ? (
          /* LOCKED CAPSULE CARD WITH INTERACTIVE TARGET DATE SELECTOR */
          <div className="w-full bg-white/5 border border-pink-400/30 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(244,114,182,0.2)] flex flex-col items-center gap-5 text-center">
            
            {/* Lock Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 flex items-center justify-center shadow-lg border border-white/50 animate-bounce">
              <Lock className="w-9 h-9 text-white" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-base sm:text-lg font-black text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                كبسولة العشق المستقبلية 🌸
              </h3>
              <p className="text-xs text-pink-200/80 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                تفتح تلقائياً عند حلول موعد المناسبة المناسبة ✨
              </p>
            </div>

            {/* DATE SELECTOR INPUT (اختر تاريخ فتح الرسالة) */}
            <div className="w-full flex flex-col gap-1.5 p-3 rounded-2xl bg-black/40 border border-pink-400/30">
              <label className="text-[11px] font-bold text-amber-200 flex items-center justify-center gap-1.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                <span>اختر تاريخ موعد الفتح المستقبلي:</span>
              </label>
              <input
                type="date"
                value={targetDateStr}
                onChange={(e) => setTargetDateStr(e.target.value)}
                className="w-full bg-pink-950/40 border border-pink-400/40 rounded-xl py-2 px-3 text-center text-xs font-black text-amber-200 focus:outline-none focus:border-pink-400 font-mono shadow-inner cursor-pointer"
              />
            </div>

            {/* LIVE COUNTDOWN GRID */}
            <div className="grid grid-cols-4 gap-2 w-full pt-1">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-pink-400/20 flex flex-col items-center">
                <span className="text-lg font-black text-amber-200 font-mono">{timeLeft.days}</span>
                <span className="text-[10px] text-pink-300 font-bold">يوم</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-pink-400/20 flex flex-col items-center">
                <span className="text-lg font-black text-pink-200 font-mono">{timeLeft.hours}</span>
                <span className="text-[10px] text-pink-300 font-bold">ساعة</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-pink-400/20 flex flex-col items-center">
                <span className="text-lg font-black text-rose-200 font-mono">{timeLeft.minutes}</span>
                <span className="text-[10px] text-pink-300 font-bold">دقيقة</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-pink-400/20 flex flex-col items-center">
                <span className="text-lg font-black text-amber-300 font-mono animate-pulse">{timeLeft.seconds}</span>
                <span className="text-[10px] text-amber-300 font-bold">ثانية</span>
              </div>
            </div>

            {/* FORCE UNLOCK BUTTON */}
            <button
              onClick={handleUnlockCapsule}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs sm:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <Unlock className="w-4 h-4 text-white" />
              <span>افتحي الكبسولة فوراً بالحب 💖</span>
            </button>

          </div>
        ) : (
          /* UNLOCKED FUTURE LETTER */
          <div className="w-full bg-white/5 border border-pink-400/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,114,182,0.3)] flex flex-col gap-4 text-right animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
              <span className="text-xs text-amber-200 font-extrabold flex items-center gap-1.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>رسالة المستقبل الفائقة الروعة لكِ يا روضة ❤️</span>
              </span>
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
            </div>

            <p className="text-pink-100 text-xs sm:text-sm leading-[2.3] font-semibold text-right" style={{ fontFamily: "'Cairo', sans-serif" }}>
              مهما مرت الأيام والسنوات يا أميرتي، المكان ده والرسالة دي شهادة إن حبي ليكي هيكبر مع كل يوم جديد يعدي علينا.. نوعد بعض إننا نفضل سند لبعض ونضحك سوا دايماً ومفيش أي حاجة تفرقنا عن بعض أبداً ✨❤️
            </p>

          </div>
        )}
      </div>

      {/* FOOTER BUTTON */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>التالي: شجرة الزهور المتفتحة 🌸🌳</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
