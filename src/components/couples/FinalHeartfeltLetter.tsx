'use client';

import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, RefreshCw, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useConfig } from '@/lib/configContext';

interface Props {
  onRestart?: () => void;
}

export const FinalHeartfeltLetter: React.FC<Props> = ({ onRestart }) => {
  const { config } = useConfig();
  const [typedMessage, setTypedMessage] = useState('');
  const [isFinishedTyping, setIsFinishedTyping] = useState(false);

  const fullMessage = config.finalLetterContent || "يا أغلى ما عندي في الدنيا ✨ لو كتبتلك كل كلام الحب اللي في العالم مش هيكفي، ولا جزء بسيط اللي حاسس بيه ناحيتك. إنتي النور اللي بينور أيامي، والراحة اللي بدونها الدنيا بتكون صعبة، والسر الوحيد اللي يخليني أبتسم من غير أي سبب. نوعد بعض إننا نفضل سند لبعض، ونعدي أي حاجة، ونضحك سوا ونحقق كل أحلامنا الجاية. بحبك من أعماق قلبي.";

  useEffect(() => {
    try {
      confetti({
        particleCount: 160,
        spread: 95,
        origin: { y: 0.5 },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
      });
    } catch (_) {}

    // LIVE TYPEWRITER EFFECT (30ms PER CHARACTER)
    let index = 0;
    setTypedMessage('');
    setIsFinishedTyping(false);
    const timer = setInterval(() => {
      setTypedMessage(fullMessage.slice(0, index));
      index++;
      if (index > fullMessage.length) {
        clearInterval(timer);
        setIsFinishedTyping(true);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [fullMessage]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Rose Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.22)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER WITH CLEARANCE FOR BACK BUTTON */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-12 sm:pt-14 px-12 sm:px-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {config.finalLetterTitle || 'كلمات نُقشت بماء الذهب'}
        </h1>
        {config.finalLetterSubtitle && (
          <p className="text-xs sm:text-sm font-medium text-pink-200/80 animate-fade-in" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {config.finalLetterSubtitle}
          </p>
        )}
      </div>

      {/* PARCHMENT LETTER SCROLL BOX */}
      <div className="relative z-20 max-w-2xl mx-auto w-full my-4 px-2">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-rose-950/40 via-purple-950/30 to-black/60 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(244,114,182,0.3)] relative overflow-hidden flex flex-col items-center gap-6 text-center">
          
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-pink-400/50 flex items-center justify-center shadow-[0_0_25px_#f472b6] animate-pulse">
            <Heart className="w-7 h-7 text-pink-400 fill-pink-400" />
          </div>

          <p className="text-sm sm:text-base md:text-lg font-bold text-pink-100/95 leading-loose min-h-[140px] text-right" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {typedMessage}
            {!isFinishedTyping && <span className="inline-block w-2 h-4 bg-pink-400 ml-1 animate-pulse" />}
          </p>

          {/* SIGNATURE PROMISE */}
          <div className="pt-4 border-t border-pink-400/30 w-full flex flex-col items-center gap-1">
            <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {config.finalLetterPromise || 'بحبك أوي أوي... ووعدتِ، عمرنا دايماً لا ينتهي 💕💖'}
            </span>
          </div>

        </div>
      </div>

      {/* FOOTER WITH CLEARANCE */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-32 sm:pb-36">
        {onRestart && (
          <button
            onClick={onRestart}
            className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة العرض من البداية 💖✨</span>
          </button>
        )}
      </div>

      <div className="h-24 sm:h-28 shrink-0 pointer-events-none" />

    </div>
  );
};
