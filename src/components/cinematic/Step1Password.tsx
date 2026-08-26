'use client';

import React, { useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { audioManager } from '@/lib/audioManager';
import { Heart, KeyRound, Sparkles } from 'lucide-react';
import { WarpParticlesCanvas } from '../3d/WarpParticlesCanvas';

interface Props {
  onSuccess: () => void;
}

// 24 PERIMETER EMISSION POINTS FLOATING OUTWARD AROUND THE HEART FRAME
const HEART_PERIMETER_PARTICLES = [
  // Top Left Curve
  { left: '22%', top: '12%', dx: '-45px', dy: '-70px', icon: '❤️', size: '18px' },
  { left: '32%', top: '6%', dx: '-30px', dy: '-80px', icon: '💖', size: '20px' },
  { left: '42%', top: '4%', dx: '-10px', dy: '-85px', icon: '🌸', size: '16px' },

  // Top Right Curve
  { left: '58%', top: '4%', dx: '10px', dy: '-85px', icon: '🌸', size: '16px' },
  { left: '68%', top: '6%', dx: '30px', dy: '-80px', icon: '💖', size: '20px' },
  { left: '78%', top: '12%', dx: '45px', dy: '-70px', icon: '❤️', size: '18px' },

  // Left Outer Perimeter Edge
  { left: '8%', top: '22%', dx: '-70px', dy: '-55px', icon: '💕', size: '18px' },
  { left: '2%', top: '35%', dx: '-80px', dy: '-30px', icon: '💗', size: '22px' },
  { left: '4%', top: '50%', dx: '-75px', dy: '-10px', icon: '❤️', size: '16px' },
  { left: '10%', top: '65%', dx: '-65px', dy: '20px', icon: '💖', size: '20px' },
  { left: '20%', top: '78%', dx: '-50px', dy: '45px', icon: '🌸', size: '17px' },
  { left: '32%', top: '88%', dx: '-35px', dy: '65px', icon: '💕', size: '19px' },

  // Right Outer Perimeter Edge
  { left: '92%', top: '22%', dx: '70px', dy: '-55px', icon: '💕', size: '18px' },
  { left: '98%', top: '35%', dx: '80px', dy: '-30px', icon: '💗', size: '22px' },
  { left: '96%', top: '50%', dx: '75px', dy: '-10px', icon: '❤️', size: '16px' },
  { left: '90%', top: '65%', dx: '65px', dy: '20px', icon: '💖', size: '20px' },
  { left: '80%', top: '78%', dx: '50px', dy: '45px', icon: '🌸', size: '17px' },
  { left: '68%', top: '88%', dx: '35px', dy: '65px', icon: '💕', size: '19px' },

  // Bottom Tip Halo
  { left: '44%', top: '96%', dx: '-15px', dy: '75px', icon: '❤️', size: '21px' },
  { left: '50%', top: '100%', dx: '0px', dy: '85px', icon: '💖', size: '23px' },
  { left: '56%', top: '96%', dx: '15px', dy: '75px', icon: '❤️', size: '21px' },

  // Extra Floating Accents
  { left: '14%', top: '14%', dx: '-55px', dy: '-65px', icon: '✨', size: '15px' },
  { left: '86%', top: '14%', dx: '55px', dy: '-65px', icon: '✨', size: '15px' },
  { left: '50%', top: '2%', dx: '0px', dy: '-90px', icon: '💓', size: '22px' },
];

export const Step1Password: React.FC<Props> = ({ onSuccess }) => {
  const { config } = useConfig();
  const [inputPass, setInputPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPass.trim() === config.sitePassword) {
      audioManager.unlockAndPlay();
      onSuccess();
    } else {
      setErrorMsg('كلمة المرور غير صحيحة، حاول مجدداً يا قمر ✨');
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-[#070312]">
      {/* Background Warp Particles */}
      <WarpParticlesCanvas />

      {/* GIANT GLOWING HEART CONTAINER WITH AROUND-PERIMETER EMITTING HEARTS */}
      <div className="relative z-20 w-full max-w-[460px] flex flex-col items-center justify-center">
        
        {/* INSTANTLY ACTIVE OUTWARD EMITTING HEARTS AROUND THE HEART PERIMETER */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {HEART_PERIMETER_PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute animate-heart-burst opacity-0 filter drop-shadow-[0_0_10px_#ff4d6d]"
              style={{
                left: p.left,
                top: p.top,
                fontSize: p.size,
                // Negative delay starts animation INSTANTLY on frame 0 with ZERO waiting lag!
                animationDelay: `-${(i * 0.14).toFixed(2)}s`,
                animationDuration: `${2.8 + (i % 3) * 0.4}s`,
                '--dx': p.dx,
                '--dy': p.dy,
              } as React.CSSProperties}
            >
              {p.icon}
            </div>
          ))}
        </div>

        {/* SVG HEART BACKDROP FRAME WITH GLOW */}
        <div className="relative w-full h-[500px] md:h-[540px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 550"
            className="absolute inset-0 w-full h-full filter drop-shadow-[0_0_45px_rgba(255,215,0,0.65)] animate-pulse"
          >
            <defs>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2a0826" stopOpacity="0.96" />
                <stop offset="50%" stopColor="#18051e" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#0d0314" stopOpacity="0.98" />
              </linearGradient>
              <linearGradient id="heartBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#ff758f" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>

            {/* Wide Spacious Heart Path */}
            <path
              d="M 250 110 C 170 10, 20 60, 20 200 C 20 340, 180 440, 250 510 C 320 440, 480 340, 480 200 C 480 60, 330 10, 250 110 Z"
              fill="url(#heartGrad)"
              stroke="url(#heartBorder)"
              strokeWidth="5"
            />
          </svg>

          {/* INNER CONTENT INSIDE THE GIANT HEART */}
          <div className="relative z-30 px-8 pt-8 pb-14 max-w-[310px] text-center space-y-4 flex flex-col items-center justify-center">
            {/* Top Glowing Heart Icon */}
            <div className="w-11 h-11 rounded-full bg-rose-500/20 border border-cosmic-gold flex items-center justify-center shadow-[0_0_20px_#ff4d6d]">
              <Heart className="w-6 h-6 text-rose-400 fill-current animate-pulse" />
            </div>

            {/* Client Greeting */}
            <h2 className="text-base md:text-lg font-extrabold text-white leading-relaxed tracking-wide drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              {config.passwordGreeting}
            </h2>

            {/* Form Input */}
            <form onSubmit={handleLogin} className="w-full space-y-3.5">
              <div className="relative w-full">
                <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmic-gold" />
                <input
                  type="password"
                  value={inputPass}
                  onChange={(e) => {
                    setInputPass(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="أدخلي كلمة السر الخاصة..."
                  className="w-full pr-10 pl-3 py-3 rounded-xl bg-cosmic-bg/90 border border-cosmic-rosegold/60 text-white placeholder-cosmic-dimText focus:outline-none focus:border-cosmic-gold focus:ring-1 focus:ring-cosmic-gold transition text-center font-medium text-xs md:text-sm"
                />
              </div>

              {errorMsg && (
                <p className="text-[11px] text-rose-400 font-semibold animate-bounce">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cosmic-rosegold via-cosmic-gold to-cosmic-rosegold text-cosmic-bg font-extrabold text-xs md:text-sm shadow-[0_0_25px_rgba(255,215,0,0.5)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> انطلقي في مجرتنا ✨
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ULTRA-SMOOTH HARDWARE-ACCELERATED OUTWARD BURST ANIMATION */}
      <style jsx global>{`
        @keyframes heartBurstOutward {
          0% {
            transform: translate3d(0, 0, 0) scale(0.3);
            opacity: 0;
          }
          20% {
            opacity: 0.95;
          }
          75% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(var(--dx), var(--dy), 0) scale(1.3);
            opacity: 0;
          }
        }
        .animate-heart-burst {
          animation: heartBurstOutward 3s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};
