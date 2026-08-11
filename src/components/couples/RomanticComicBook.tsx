'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, BookOpen, ArrowLeft, ArrowRight, Heart, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onNext: () => void;
}

const COMIC_PAGES = [
  {
    page: 1,
    title: 'الفصل الأول: البداية المفاجئة ⚡',
    illustration: '🎨 👧🏻 ↔️ 👦🏻',
    bubbleUser: 'كنت باصص في الأرض ومش مركز.. وفجأة شفت أجمل بنت في الدنيا 😳❤️',
    bubblePartner: 'وانا كنت مستغربة هو ماله متنح كده ليه 😂💖',
    caption: 'اللحظة اللي اتغيرت فيها كل حاجة في حياتنا!'
  },
  {
    page: 2,
    title: 'الفصل الثاني: خناقات الأكل 🍕',
    illustration: '🍕 🍔 🥊 💖',
    bubbleUser: 'هنطلب بيتزا ولا برجر النهاردة؟ 🤔',
    bubblePartner: 'هنطلب الاتنين ومتاكلش الشرايح بتعتي!! 😤🍕',
    caption: 'أفضل خناقة في التاريخ وكل مرة بننتهي متصالحين وبناكل سوا 😂'
  },
  {
    page: 3,
    title: 'الفصل الثالث: البطولة المطلقة 👑',
    illustration: '👑 ✨ 👸🏻 💖',
    bubbleUser: 'أنتي البطلة الحقيقية لقاعدتنا ولعمري كله ✨',
    bubblePartner: 'وعارفاها من زمان يا سيدي 👑❤️',
    caption: 'حكايتنا مستمرة ومفيش نهاية لقصة عشقنا!'
  }
];

export const RomanticComicBook: React.FC<Props> = ({ onNext }) => {
  const [currentPage, setCurrentPage] = useState(0);
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
      osc.frequency.setValueAtTime(440.0, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.3);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch (_) {}
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % COMIC_PAGES.length);
    playChime();
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + COMIC_PAGES.length) % COMIC_PAGES.length);
    playChime();
  };

  const activeComic = COMIC_PAGES[currentPage];

  return (
    <div className="relative w-full min-h-screen bg-[#07020d] text-white flex flex-col justify-between p-4 md:p-8 select-none overflow-hidden text-center">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.18)_0%,_rgba(236,72,153,0.12)_45%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-500/30 backdrop-blur-md self-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs md:text-sm font-bold text-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            مجلة الكوميكس والكرتون لحكايتنا 🎨📖
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-rose-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
          مواقف كارتونية لا تُنسى
        </h1>
      </div>

      {/* 3D COMIC BOOK SPREAD CONTAINER */}
      <div className="relative z-20 max-w-2xl w-full mx-auto my-auto flex flex-col items-center">
        <div className="w-full bg-gradient-to-b from-[#2a1122] via-[#1a0716] to-[#0c020d] border-4 border-amber-400/70 p-6 md:p-8 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.3)] backdrop-blur-xl flex flex-col gap-6 text-right">
          
          {/* Comic Header */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <span className="text-xs text-amber-300 font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              صفحة {activeComic.page} من {COMIC_PAGES.length}
            </span>
            <h3 className="text-lg md:text-xl font-black text-rose-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {activeComic.title}
            </h3>
          </div>

          {/* Comic Scene Illustration Placeholder */}
          <div className="w-full h-32 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-4xl shadow-inner">
            {activeComic.illustration}
          </div>

          {/* Speech Bubbles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Speech Bubble */}
            <div className="relative bg-amber-500/20 border border-amber-400/50 p-4 rounded-2xl text-xs md:text-sm font-bold text-amber-100 shadow-md" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <div className="text-[10px] text-amber-300/80 mb-1 font-extrabold">أنت:</div>
              "{activeComic.bubbleUser}"
            </div>

            {/* Partner Speech Bubble */}
            <div className="relative bg-rose-500/20 border border-rose-400/50 p-4 rounded-2xl text-xs md:text-sm font-bold text-rose-100 shadow-md" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <div className="text-[10px] text-rose-300/80 mb-1 font-extrabold">هي:</div>
              "{activeComic.bubblePartner}"
            </div>
          </div>

          {/* Comic Caption Footer */}
          <p className="text-center text-white/80 text-xs md:text-sm font-bold border-t border-white/10 pt-3" style={{ fontFamily: "'Cairo', sans-serif" }}>
            ✨ {activeComic.caption} ✨
          </p>

          {/* Page Flip Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevPage}
              className="px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500/40 text-rose-200 text-xs font-bold transition-all flex items-center gap-1"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <ArrowRight className="w-4 h-4" />
              <span>الصفحة السابقة</span>
            </button>

            <div className="flex items-center gap-2">
              {COMIC_PAGES.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`h-2 rounded-full cursor-pointer transition-all ${
                    idx === currentPage ? 'w-6 bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextPage}
              className="px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500/40 text-rose-200 text-xs font-bold transition-all flex items-center gap-1"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <span>الصفحة التالية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* FOOTER ACTION BUTTON */}
      <div className="relative z-20 max-w-md mx-auto w-full pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-black font-extrabold text-sm md:text-base border border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>افتحي ماسح بصمة العين والهولوغرام الكوني.. 👁️🔮</span>
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
      </div>
    </div>
  );
};
