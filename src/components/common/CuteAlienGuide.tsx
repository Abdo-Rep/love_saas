'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, X, Mic } from 'lucide-react';

interface Props {
  currentStep?: number;
}

export const CuteAlienGuide: React.FC<Props> = ({ currentStep = 1 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFinale, setIsFinale] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isWiggling, setIsWiggling] = useState(false);

  const periodicQuote = 'استعد... لسه فيه مفاجآت.';
  const finaleQuote = 'مهمتي انتهت... دلوقتى دوركوا تكملوا الحكاية.';

  const currentQuote = isFinale ? finaleQuote : periodicQuote;

  // Sound synthesizer for cute alien sound effect
  const playAlienSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Osc 1 (Cute high melody note)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.25);

      // Osc 2 (Cosmic chime)
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start();
        osc2.stop(ctx.currentTime + 0.2);
      }, 120);
    } catch {
      // Ignore audio context autoplay restriction errors
    }
  };

  // Scroll detection to trigger finale quote when near bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 350) {
        setIsFinale(true);
      } else {
        setIsFinale(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Periodic speech bubble popup & text typing
  useEffect(() => {
    let idx = 0;
    setTypedText('');
    const fullText = currentQuote;

    playAlienSound();

    const timer = setInterval(() => {
      if (idx < fullText.length) {
        setTypedText(fullText.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 55);

    return () => clearInterval(timer);
  }, [currentQuote, isFinale]);

  // Auto show speech bubble periodically
  useEffect(() => {
    const autoInterval = setInterval(() => {
      if (!isOpen) {
        setIsOpen(true);
        setIsWiggling(true);
        playAlienSound();
        setTimeout(() => setIsWiggling(false), 1000);
      }
    }, 16000);

    return () => clearInterval(autoInterval);
  }, [isOpen]);

  const handleAvatarClick = () => {
    setIsOpen(true);
    setIsWiggling(true);
    playAlienSound();
    setTimeout(() => setIsWiggling(false), 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto">
      {/* Speech Bubble Container */}
      {isOpen && (
        <div className="mb-3 max-w-[280px] sm:max-w-xs w-full glass-panel-gold rounded-2xl p-4 border border-cosmic-gold/50 shadow-[0_0_30px_rgba(255,215,0,0.25)] backdrop-blur-xl animate-fade-in relative transition-all">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2.5 left-2.5 p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
            title="إغلاق"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Avatar Header Tag line matching prompt screenshot */}
          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-cosmic-gold/20">
            <span className="text-[11px] font-extrabold text-cosmic-gold flex items-center gap-1 bg-cosmic-rosegold/20 px-2 py-0.5 rounded-full border border-cosmic-gold/40">
              AI Avatar .1 <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />
            </span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-[10px] text-white/70 hover:text-cosmic-gold flex items-center gap-0.5 mr-auto"
            >
              {soundEnabled ? <Volume2 className="w-3 h-3 text-cosmic-gold" /> : <VolumeX className="w-3 h-3 text-gray-400" />}
            </button>
          </div>

          {/* Typing Quote Text */}
          <div className="text-sm font-semibold text-white leading-relaxed min-h-[2.5rem] flex items-center">
            <p className="typewriter-glow">
              "{typedText}"
            </p>
          </div>

          {/* Cute Pointer Triangle pointing down-right to the alien */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#140f28] border-r border-b border-cosmic-gold/50 rotate-45" />
        </div>
      )}

      {/* Cute Floating Alien Avatar Button */}
      <button
        onClick={handleAvatarClick}
        className={`group relative flex items-center justify-center p-2 rounded-full transition-transform active:scale-95 ${
          isWiggling ? 'animate-bounce' : 'hover:scale-105'
        }`}
        title="اضغطي للتحدث مع المرشد الفضائي 🛸"
      >
        {/* Outer Cosmic Halo Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-pink-500 to-cosmic-gold blur-md opacity-70 group-hover:opacity-100 animate-pulse" />

        {/* Cute Alien Helmet Vessel Container */}
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#0d0d2b] border-2 border-cyan-300/80 shadow-[0_0_25px_rgba(56,189,248,0.6)] flex items-center justify-center overflow-visible">
          {/* Animated Stars around Alien */}
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-cosmic-gold animate-spin" style={{ animationDuration: '6s' }} />

          {/* High Detail Cute Alien Vector Illustration */}
          <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            <defs>
              <linearGradient id="alienBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="helmetGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
                <stop offset="100%" stopColor="rgba(236, 72, 153, 0.15)" />
              </linearGradient>
            </defs>

            {/* Antenna with Wiggling Star Tip */}
            <path d="M50 30 L50 14" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            <polygon points="50,6 53,12 59,13 54,17 56,23 50,19 44,23 46,17 41,13 47,12" fill="#FFD700" className="animate-pulse" />

            {/* Cute Rounded Alien Head & Ears */}
            <path d="M30 42 C20 40 22 55 30 52" fill="url(#alienBody)" />
            <path d="M70 42 C80 40 78 55 70 52" fill="url(#alienBody)" />
            <ellipse cx="50" cy="50" rx="22" ry="20" fill="url(#alienBody)" />

            {/* Big Shiny Kawaii Eyes */}
            <ellipse cx="41" cy="48" rx="5" ry="7" fill="#0f172a" />
            <ellipse cx="59" cy="48" rx="5" ry="7" fill="#0f172a" />

            {/* Eye Sparkle Highlights */}
            <circle cx="43" cy="46" r="2" fill="#ffffff" />
            <circle cx="61" cy="46" r="2" fill="#ffffff" />
            <circle cx="39" cy="50" r="1" fill="#ffffff" />
            <circle cx="57" cy="50" r="1" fill="#ffffff" />

            {/* Cute Rosy Blushed Cheeks */}
            <ellipse cx="34" cy="54" rx="3" ry="1.5" fill="#f43f5e" opacity="0.75" />
            <ellipse cx="66" cy="54" rx="3" ry="1.5" fill="#f43f5e" opacity="0.75" />

            {/* Cute Smile */}
            <path d="M46 56 Q50 60 54 56" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Floating Saucer Base Ring */}
            <ellipse cx="50" cy="72" rx="28" ry="6" fill="#FFD700" opacity="0.9" />
            <ellipse cx="50" cy="72" rx="24" ry="4" fill="#f43f5e" />
            <circle cx="35" cy="72" r="1.5" fill="#ffffff" className="animate-ping" />
            <circle cx="50" cy="73" r="1.5" fill="#ffffff" className="animate-ping" style={{ animationDelay: '0.3s' }} />
            <circle cx="65" cy="72" r="1.5" fill="#ffffff" className="animate-ping" style={{ animationDelay: '0.6s' }} />

            {/* Glass Astronaut Helmet Bubble */}
            <circle cx="50" cy="48" r="25" fill="url(#helmetGlass)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            {/* Glass Reflection Arc */}
            <path d="M32 38 A 20 20 0 0 1 56 28" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </button>
    </div>
  );
};
