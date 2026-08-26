'use client';

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/lib/configContext';
import { Sparkles, Heart, Share2 } from 'lucide-react';
import { InstagramShareModal } from '../common/InstagramShareModal';

export const GrandFinaleSection: React.FC = () => {
  const { config } = useConfig();
  const [typedQuote, setTypedQuote] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fullText = config.finalQuote || 'في كل مجرة وفي كل زمن.. ستظلين أنتِ نجمتي الوحيدة وعالمي بأكمله.';
    let idx = 0;

    const timer = setInterval(() => {
      if (idx < fullText.length) {
        setTypedQuote(fullText.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 60);

    return () => clearInterval(timer);
  }, [config.finalQuote]);

  return (
    <section className="w-full py-16 px-4 flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#14143a] to-[#0a0a1a]">
      {/* Background Star Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cosmic-gold/15 blur-3xl pointer-events-none animate-pulse" />

      <div className="z-10 max-w-md w-full glass-panel-gold rounded-3xl p-8 border-2 border-cosmic-gold/60 shadow-[0_0_60px_rgba(255,215,0,0.3)] space-y-6">
        {/* Glowing Couple Photo & Golden Star */}
        <div className="relative w-44 h-44 mx-auto">
          <div className="absolute inset-0 rounded-full bg-cosmic-gold animate-ping opacity-25" />
          <div className="w-full h-full rounded-full p-1.5 bg-gradient-to-tr from-cosmic-gold via-cosmic-rosegold to-cosmic-gold shadow-[0_0_40px_#FFD700] overflow-hidden">
            <img
              src={config.couplePhotoUrl || config.herPortraitUrl}
              alt="Together Forever"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute -bottom-3 right-1/2 translate-x-1/2 bg-cosmic-gold text-cosmic-bg text-xs px-3 py-1 rounded-full font-extrabold flex items-center gap-1 shadow-lg">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-600" /> معاً للأبد
          </div>
        </div>

        {/* Live Typed Final Quote */}
        <div className="space-y-3 pt-2">
          <span className="text-xs text-cosmic-gold font-bold px-3 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold inline-block">
            ✨ نوتة ختامية
          </span>
          <p className="text-xl md:text-2xl font-bold text-white leading-relaxed typewriter-glow min-h-[4rem] flex items-center justify-center">
            "{typedQuote}"
          </p>
        </div>

        {/* Smart Instagram Share Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cosmic-rosegold via-cosmic-gold to-cosmic-rosegold text-cosmic-bg font-extrabold text-base shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" /> إنشاء بطاقة الإنستجرام الذكية 📸
        </button>

        <p className="text-[11px] text-cosmic-rosegold font-light">
          صُنِعت هذه الرحلة بكل الحب والأمنيات لكِ وحدكِ ❤️
        </p>
      </div>

      {/* Share Modal */}
      <InstagramShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
