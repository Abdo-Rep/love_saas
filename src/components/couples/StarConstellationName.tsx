'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useConfig } from '@/lib/configContext';

interface Props {
  onNext: () => void;
}

export const StarConstellationName: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Take the constellation name directly from config (default 'RAWDA')
  const currentConstellationName = (config.constellationName || config.herName || 'RAWDA').trim().toUpperCase();
  const nameLetters = currentConstellationName.split('');
  const [revealedCount, setRevealedCount] = useState(0);

  // Live Message Typewriter State
  const [typedMessage, setTypedMessage] = useState('');
  const fullMessage = config.constellationMessage || '"كتبتُ اسمكِ بين النجوم لأنكِ القمر الوحيد الذي ينور سمائي، والسر الجميل الذي يسعد قلبي في كل ثانية." ❤️✨';

  useEffect(() => {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.4 },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
      });
    } catch (_) {}

    // Reset revealed count when name changes
    setRevealedCount(0);
    const letterTimer = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev < nameLetters.length) {
          return prev + 1;
        } else {
          clearInterval(letterTimer);
          return prev;
        }
      });
    }, 350);

    // Canvas Starfield Background
    const canvas = canvasRef.current;
    if (!canvas) return () => clearInterval(letterTimer);
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => clearInterval(letterTimer);

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    }));

    // Shooting Stars
    const shootingStars: Array<{ x: number; y: number; len: number; speed: number; size: number; color: string }> = [];

    const addShootingStar = () => {
      if (shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height / 2),
          len: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 4,
          size: Math.random() * 1.5 + 0.5,
          color: '#ffd700'
        });
      }
    };

    const interval = setInterval(addShootingStar, 1800);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render stars
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.speed = -star.speed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${Math.abs(star.alpha)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffd700';
        ctx.fill();
      });

      // Render shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y + s.len * 0.4);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.shadowBlur = 14;
        ctx.shadowColor = s.color;
        ctx.stroke();

        s.x += s.speed;
        s.y += s.speed * 0.4;

        if (s.x > width + s.len || s.y > height + s.len) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(letterTimer);
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentConstellationName]);

  // LIVE TYPEWRITER EFFECT FOR CONSTELLATION MESSAGE
  useEffect(() => {
    let index = 0;
    setTypedMessage('');
    const startDelay = setTimeout(() => {
      const typeTimer = setInterval(() => {
        setTypedMessage(fullMessage.slice(0, index));
        index++;
        if (index > fullMessage.length) {
          clearInterval(typeTimer);
        }
      }, 40);
      return () => clearInterval(typeTimer);
    }, 600);

    return () => clearTimeout(startDelay);
  }, [fullMessage]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden text-center">
      
      {/* Dynamic Starfield & Shooting Stars Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-80" />

      {/* Soft Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.25)_0%,_transparent_70%)] pointer-events-none z-10" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-100 to-amber-300 leading-relaxed py-1"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {config.constellationTitle || `نجمتي الأميرة ${currentConstellationName}... 💫`}
        </h1>
      </div>

      {/* DYNAMIC LIVE ANIMATED CONSTELLATION NAME */}
      <div className="relative z-20 max-w-lg mx-auto w-full my-4 flex flex-col items-center gap-6">
        
        <div className="relative group w-full p-6 sm:p-10 rounded-3xl bg-white/5 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(244,114,182,0.4)] flex flex-col items-center gap-6 text-center">
          
          {/* Animated Heart Badges */}
          <div className="flex items-center gap-3 text-rose-400">
            <Heart className="w-6 h-6 fill-rose-500 animate-bounce" />
            <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
            <Heart className="w-6 h-6 fill-rose-500 animate-bounce" />
          </div>

          {/* CONNECTED CONSTELLATION NAME */}
          <div className="relative my-2 flex flex-col items-center justify-center gap-3">
            {/* Glowing Stars Row */}
            <div className="flex items-center gap-2 text-amber-300">
              <Star className="w-5 h-5 fill-amber-300 filter drop-shadow-[0_0_10px_#ffd700] animate-bounce" />
              <Star className="w-5 h-5 fill-amber-300 filter drop-shadow-[0_0_10px_#ffd700] animate-pulse" />
              <Star className="w-5 h-5 fill-amber-300 filter drop-shadow-[0_0_10px_#ffd700] animate-bounce" />
              <Star className="w-5 h-5 fill-amber-300 filter drop-shadow-[0_0_10px_#ffd700] animate-pulse" />
            </div>

            {/* Connected Name Text */}
            <h2
              className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-100 to-pink-300 drop-shadow-[0_0_40px_rgba(255,215,0,0.9)] tracking-normal animate-pulse py-2"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {currentConstellationName}
            </h2>
          </div>

          {/* LIVE TYPED ROMANTIC MESSAGE BELOW */}
          <div className="min-h-[90px] flex items-center justify-center">
            <p className="text-pink-100 text-xs sm:text-base font-bold leading-relaxed max-w-md pt-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {typedMessage}
              {typedMessage.length > 0 && typedMessage.length < fullMessage.length && (
                <span className="inline-block w-2 h-4 bg-pink-400 ml-1 animate-pulse" />
              )}
            </p>
          </div>

        </div>

      </div>

      {/* FOOTER BUTTON CONNECTED DIRECTLY TO CONFIG */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(244,114,182,0.6)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.constellationButtonText || 'انتقلي لرحلة عشقنا 💖✨'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
