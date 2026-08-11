'use client';

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { Heart, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Step5PortraitZoom: React.FC<Props> = ({ onComplete }) => {
  const { config } = useConfig();
  const [typedName, setTypedName] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Zoom animation trigger
    const timerZoom = setTimeout(() => {
      setIsZoomed(true);
    }, 300);

    // Typewriter effect for her name
    let idx = 0;
    const name = config.herName || 'نور قلبي';

    const timerText = setInterval(() => {
      if (idx < name.length) {
        setTypedName(name.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timerText);
        // 2-second romantic pause
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 120);

    return () => {
      clearTimeout(timerZoom);
      clearInterval(timerText);
    };
  }, [config.herName, onComplete]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-[#0a0a1a]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cosmic-rosegold/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Her Portrait with Gradual Zoom */}
      <div className="z-10 relative">
        <div
          className={`w-64 h-64 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-tr from-cosmic-gold via-cosmic-rosegold to-cosmic-gold shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all duration-3000 ease-out overflow-hidden mx-auto ${
            isZoomed ? 'scale-110 shadow-[0_0_80px_rgba(255,215,0,0.8)]' : 'scale-90'
          }`}
        >
          <img
            src={config.herPortraitUrl}
            alt={config.herName}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="mt-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold text-xs text-cosmic-gold font-bold">
            <Sparkles className="w-4 h-4" /> أميرة هذا اليوم والأبد
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide title-glow min-h-[3.5rem] flex items-center justify-center">
            {typedName} <Heart className="w-8 h-8 fill-current text-rose-500 mr-3 inline animate-bounce" />
          </h1>
        </div>
      </div>
    </div>
  );
};
