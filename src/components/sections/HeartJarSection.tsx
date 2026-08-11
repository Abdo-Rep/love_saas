'use client';

import React, { useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { Heart, Sparkles, X } from 'lucide-react';

export const HeartJarSection: React.FC = () => {
  const { config } = useConfig();
  const jarQuotes = config.jarQuotes || [];
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  return (
    <section className="w-full py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-xs text-cosmic-gold font-bold px-3 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold">
            🫙 برطمان الجمل الكوني
          </span>
          <h3 className="text-2xl font-bold text-white">افتحي ورقة واقرئي ما يهمس به قلبي</h3>
        </div>

        {/* 3D Glass Heart Jar */}
        <div className="relative w-64 h-80 mx-auto glass-panel-gold rounded-[3rem] border-4 border-cosmic-gold/40 shadow-[0_0_50px_rgba(255,215,0,0.2)] flex flex-col items-center justify-center p-4 overflow-hidden">
          {/* Jar Lid */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-gradient-to-r from-cosmic-gold via-cosmic-rosegold to-cosmic-gold rounded-b-xl shadow-md border-b-2 border-cosmic-gold" />

          {/* Floating Heart Papers inside Jar */}
          <div className="w-full h-full pt-8 flex flex-wrap items-center justify-center gap-3 overflow-y-auto">
            {jarQuotes.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setSelectedQuote(item.quote)}
                className="w-14 h-12 bg-gradient-to-tr from-cosmic-rosegold to-cosmic-gold rounded-xl border border-white/40 shadow-lg flex items-center justify-center text-cosmic-bg font-bold transform hover:scale-110 active:scale-95 transition animate-float"
                style={{ animationDelay: `${idx * 0.4}s` }}
              >
                <Heart className="w-6 h-6 fill-current text-rose-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Quote Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-sm w-full glass-panel-gold rounded-3xl p-8 border-2 border-cosmic-gold text-center space-y-6 animate-fade-in shadow-[0_0_60px_rgba(255,215,0,0.4)]">
              <button
                onClick={() => setSelectedQuote(null)}
                className="absolute top-4 left-4 text-gray-400 hover:text-white p-1 rounded-full bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-cosmic-rosegold/30 border border-cosmic-gold flex items-center justify-center mx-auto text-cosmic-gold">
                <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
              </div>

              <h4 className="text-xs text-cosmic-gold font-bold uppercase tracking-wider">
                رسالة مطوية خاصة ✨
              </h4>

              <p className="text-xl md:text-2xl font-bold text-white leading-relaxed typewriter-glow">
                "{selectedQuote}"
              </p>

              <button
                onClick={() => setSelectedQuote(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cosmic-rosegold to-cosmic-gold text-cosmic-bg font-extrabold shadow-lg hover:brightness-110 transition"
              >
                إغلاق الورقة 💖
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
