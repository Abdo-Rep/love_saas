'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Mail, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onRestart: () => void;
}

export const SealedLoveEnvelope: React.FC<Props> = ({ onRestart }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLetter = () => {
    setIsOpen(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffd700', '#ff758f', '#ffffff']
      });
    } catch (_) {}
  };

  return (
    <div className="relative w-full min-h-screen bg-[#04010a] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden text-center">
      
      {/* Ambient Radial Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.2)_0%,_transparent_70%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-pink-500/30 backdrop-blur-md self-center">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-xs font-bold text-pink-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            الرسالة الملكية المشمعة 💌
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
          كلمات نُقشت بماء الذهب
        </h1>
      </div>

      {/* 3D ENVELOPE / LETTER DISPLAY */}
      <div className="relative z-20 max-w-lg w-full">
        {!isOpen ? (
          /* CLOSED WAX-SEALED ENVELOPE */
          <div
            onClick={handleOpenLetter}
            className="group cursor-pointer relative w-full h-72 md:h-80 rounded-3xl bg-gradient-to-br from-rose-950 via-pink-900/60 to-black border-2 border-rose-500/50 p-6 flex flex-col items-center justify-center gap-4 shadow-[0_0_50px_rgba(244,63,94,0.4)] hover:scale-105 transition-all duration-500 backdrop-blur-xl"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg border-2 border-amber-300/60 animate-bounce">
              <Mail className="w-10 h-10 text-white" />
            </div>

            <p className="text-rose-200 font-extrabold text-lg tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
              اضغط هنا لفك الخاتم الملكي وفتح الرسالة 🔑✨
            </p>
            <span className="text-xs text-white/50" style={{ fontFamily: "'Cairo', sans-serif" }}>
              رسالة خاصة جداً مصممة لأجلك فقط
            </span>
          </div>
        ) : (
          /* OPENED HANDWRITTEN LOVE LETTER */
          <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#1a0826] via-[#0f0418] to-black border-2 border-rose-500/60 p-8 md:p-10 text-right shadow-[0_0_60px_rgba(244,63,94,0.5)] backdrop-blur-2xl flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-rose-500/30 pb-4">
              <span className="text-xs text-rose-300 font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                من أعماق القلب ❤️
              </span>
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
            </div>

            <div className="flex flex-col gap-4 text-rose-100 text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <p className="font-bold text-amber-300 text-lg">إلى أميرتي الفاتنة... 👑</p>
              <p>
                دورت في كل مكان وفي كل زمان، وقابلت ناس كتير.. بس مفيش حد يقدر يملى عيني وقلبي غيرك إنتي.
              </p>
              <p>
                إنتي المشاعر الدافئة اللي بتخليني أحس إن الحياة جميلة، وإنتي النور اللي بينور كل خطوة في مستقبلي.
              </p>
              <p className="font-extrabold text-pink-300 text-base text-center pt-2">
                مكانك في قلبي محفور للأبد.. وعمري ما هستغنى عنك يا أغلى ما عندي ✨💖
              </p>
            </div>

            <div className="pt-4 border-t border-rose-500/30 flex justify-center">
              <button
                onClick={onRestart}
                className="px-6 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة الرحلة من البداية 🔄</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
