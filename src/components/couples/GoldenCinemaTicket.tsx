'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Film, ArrowLeft, Play, Ticket, Star, Popcorn, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onNext: () => void;
}

export const GoldenCinemaTicket: React.FC<Props> = ({ onNext }) => {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const movieSlides = [
    {
      title: 'المشهد الأول: النظرة الأولى ✨',
      subtitle: 'عندما التقت أعيننا وتوقف الزمن',
      quote: 'من أول ثانية شفتك فيها عرفت إن حكايتنا مش مجرد صدقة، دي قصة حب اتكتبت في السماء.'
    },
    {
      title: 'المشهد الثاني: سر البسمة 💖',
      subtitle: 'كل يوم وكل ثانية معاكي',
      quote: 'ابتسامتك هي فيلمي المفضّل، ونبرة صوتك هي الموسيقى التصويرية لحياتي.'
    },
    {
      title: 'المشهد الثالث: البطولة المطلقة 👑',
      subtitle: 'أنتي النجمة الوحيدة في حياتي',
      quote: 'بنات العالم كلهم كومودينو، وأنتي البطلة الحقيقية اللي خطفت قلبي والعرض كله.'
    }
  ];

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
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.4);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (_) {}
  };

  const handleOpenTicket = () => {
    setCurtainsOpen(true);
    playChime();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff4d6d', '#ffffff']
      });
    } catch (_) {}
  };

  return (
    <div className="relative w-full min-h-screen bg-[#07020a] text-white flex flex-col justify-between p-4 md:p-8 select-none overflow-hidden text-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.2)_0%,_rgba(236,72,153,0.12)_45%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-500/30 backdrop-blur-md self-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Ticket className="w-4 h-4 text-amber-400" />
          <span className="text-xs md:text-sm font-bold text-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            تذكرة السينما الذهبية الملكية 🎟️🍿
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-pink-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
          عرض خاص: قصة عشقنا الخالدة
        </h1>
      </div>

      {/* TICKET / CINEMA DISPLAY */}
      <div className="relative z-20 max-w-3xl w-full mx-auto my-auto min-h-[380px] flex items-center justify-center">
        {!curtainsOpen ? (
          /* GOLDEN TICKET PASS */
          <div
            onClick={handleOpenTicket}
            className="group cursor-pointer relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-[#3b200b] via-[#221105] to-black border-2 border-amber-400/80 p-6 md:p-8 shadow-[0_0_60px_rgba(245,158,11,0.4)] hover:scale-105 transition-all duration-500 backdrop-blur-2xl flex flex-col items-center gap-5"
          >
            {/* Perforation Line & Ticket Stub */}
            <div className="absolute top-0 bottom-0 left-16 border-r-2 border-dashed border-amber-500/40 pointer-events-none" />
            
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300 flex items-center justify-center shadow-lg border-2 border-amber-200 animate-bounce">
              <Film className="w-10 h-10 text-black" />
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
                VIP TICKET • SEAT #1 🎟️
              </span>
              <h2 className="text-xl md:text-2xl font-black text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                اضغطي هنا لفتح ستائر السينما 🍿🎬
              </h2>
              <p className="text-xs text-white/60" style={{ fontFamily: "'Cairo', sans-serif" }}>
                عرض خاص مخصص لأميرة حياتي فقط
              </p>
            </div>
          </div>
        ) : (
          /* OPENED RED VELVET CINEMA SCREEN */
          <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#1c0818] via-[#0f0410] to-black border-2 border-amber-500/60 p-6 md:p-10 text-right shadow-[0_0_70px_rgba(245,158,11,0.5)] backdrop-blur-2xl flex flex-col gap-6 animate-fadeIn">
            
            {/* Cinema Screen Top Bar */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2">
                <Popcorn className="w-5 h-5 text-amber-400" />
                <span className="text-xs text-amber-300 font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  شاشة العرض الخاص 🎬
                </span>
              </div>
              <span className="text-xs text-rose-300 font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                مشهد {activeSlide + 1} من {movieSlides.length}
              </span>
            </div>

            {/* Movie Slide Text Content */}
            <div className="flex flex-col gap-3 text-right bg-black/40 p-5 rounded-2xl border border-white/10 shadow-inner">
              <span className="text-amber-400 font-bold text-xs" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {movieSlides[activeSlide].subtitle}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-rose-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {movieSlides[activeSlide].title}
              </h3>
              <p className="text-white/90 text-sm md:text-base leading-relaxed font-bold pt-2 border-t border-white/10" style={{ fontFamily: "'Amiri', 'Cairo', serif", direction: 'rtl' }}>
                "{movieSlides[activeSlide].quote}"
              </p>
            </div>

            {/* Movie Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveSlide((prev) => (prev - 1 + movieSlides.length) % movieSlides.length)}
                className="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 hover:bg-amber-500/40 text-amber-200 text-xs font-bold transition-all"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                ◀ المشهد السابق
              </button>

              <div className="flex items-center gap-2">
                {movieSlides.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      idx === activeSlide ? 'w-6 bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % movieSlides.length)}
                className="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 hover:bg-amber-500/40 text-amber-200 text-xs font-bold transition-all"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                المشهد التالي ▶
              </button>
            </div>

          </div>
        )}
      </div>

      {/* FOOTER ACTION BUTTON */}
      <div className="relative z-20 max-w-md mx-auto w-full pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-black font-extrabold text-sm md:text-base border border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>ادخلي بستان الوردة السحرية.. 🌹✨</span>
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
      </div>
    </div>
  );
};
