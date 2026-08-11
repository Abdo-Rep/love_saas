'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Mail, RefreshCw, Key, ShieldCheck, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onRestart: () => void;
}

export const PromiseVaultLetter: React.FC<Props> = ({ onRestart }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenVault = () => {
    setIsOpen(true);
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffd700', '#ff758f', '#ffffff']
      });
    } catch (_) {}
  };

  return (
    <div className="relative w-full min-h-screen bg-[#04010a] text-white flex flex-col items-center justify-between p-4 md:p-8 select-none overflow-x-hidden text-center">
      {/* Ambient Radial Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,63,94,0.22)_0%,_rgba(245,158,11,0.12)_45%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-rose-500/30 backdrop-blur-md self-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          <Crown className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-xs md:text-sm font-bold text-rose-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            صندوق الوعد والختم الملكي الخالد 🗝️📜
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
          كلمات نُقشت بماء الذهب
        </h1>
      </div>

      {/* VAULT & LETTER DISPLAY */}
      <div className="relative z-20 max-w-xl w-full my-auto">
        {!isOpen ? (
          /* CLOSED WAX-SEALED VAULT */
          <div
            onClick={handleOpenVault}
            className="group cursor-pointer relative w-full rounded-3xl bg-gradient-to-br from-[#2b0d18] via-[#1a0612] to-black border-2 border-amber-500/60 p-8 flex flex-col items-center justify-center gap-5 shadow-[0_0_60px_rgba(244,63,94,0.4)] hover:scale-105 transition-all duration-500 backdrop-blur-2xl"
          >
            {/* Wax Seal Emblem */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.6)] border-4 border-amber-300/80 animate-bounce">
              <Mail className="w-12 h-12 text-white" />
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className="text-amber-200 font-black text-lg md:text-xl tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
                اضغطي هنا لفك الخاتم الملكي وفتح الخزنة 🗝️✨
              </p>
              <span className="text-xs text-rose-200/60 font-medium" style={{ fontFamily: "'Cairo', sans-serif" }}>
                رسالة وعهد خاص محفور باسمك فقط
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold mt-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>عهد ووعد حقيقي مش هينتهي طول العمر</span>
            </div>
          </div>
        ) : (
          /* OPENED HANDWRITTEN ROYAL PARCHMENT LETTER */
          <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#1c0722] via-[#0f0316] to-black border-2 border-rose-500/60 p-6 md:p-10 text-right shadow-[0_0_70px_rgba(244,63,94,0.5)] backdrop-blur-2xl flex flex-col gap-6 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-rose-500/30 pb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-xs text-rose-300 font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  العهد والوعد الخالد ❤️
                </span>
              </div>
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
            </div>

            <div className="flex flex-col gap-4 text-rose-100 text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
              <p className="font-extrabold text-amber-300 text-lg md:text-xl">إلى أميرتي الفاتنة... 👑</p>
              
              <p>
                دورت في كل مكان وفي كل زمان، وقابلت ناس كتير.. بس مفيش حد يقدر يملى عيني وقلبي غيرك إنتي.
              </p>
              
              <p>
                إنتي المشاعر الدافئة اللي بتخليني أحس إن الحياة جميلة، وإنتي النور اللي بينور كل خطوة في مستقبلي.
              </p>

              <p className="font-extrabold text-pink-300 text-base md:text-lg text-center pt-3 border-t border-rose-500/20">
                مكانك في قلبي محفور للأبد.. ودبلة حبنا بتطوق قلبي وعهدي ليكي مش هينتهي طول العمر ✨💖
              </p>
            </div>

            <div className="pt-4 border-t border-rose-500/30 flex justify-center">
              <button
                onClick={onRestart}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-extrabold text-xs md:text-sm border border-amber-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,63,94,0.5)] flex items-center gap-2"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة قراءة رحلة العشق من البداية 🔄</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="relative z-20 pb-4 text-xs text-amber-200/40 font-medium">
        رحلة عشقنا الخالدة • دمتِ لي عمراً دافئاً لا ينتهي ✨
      </div>
    </div>
  );
};
