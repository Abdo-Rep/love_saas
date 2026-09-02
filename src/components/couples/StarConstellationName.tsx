'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useConfig } from '@/lib/configContext';

interface Props {
  onNext: () => void;
}

export const StarConstellationName: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentConstellationName = (config.constellationName || config.herName || 'بحبك').trim();
  const nameLetters = currentConstellationName.split('');
  const [revealedCount, setRevealedCount] = useState(0);
  const [isCardUnified, setIsCardUnified] = useState(false);

  const fullMessage = config.constellationMessage || '"كتبتُ اسمكِ بين النجوم لأنكِ القمر الوحيد الذي ينور سمائي، والسر الجميل الذي يسعد قلبي في كل ثانية." ❤️✨';

  useEffect(() => {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.4 },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
      });
    } catch {}

    setRevealedCount(0);
    setIsCardUnified(false);

    let unifyTimer: any = null;
    const letterTimer = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev < nameLetters.length) {
          const nextVal = prev + 1;
          if (nextVal === nameLetters.length) {
            clearInterval(letterTimer);
            // Speed up time between last letter and unification into card to 600ms!
            unifyTimer = setTimeout(() => {
              setIsCardUnified(true);
            }, 600);
          }
          return nextVal;
        } else {
          clearInterval(letterTimer);
          return prev;
        }
      });
    }, 500);

    const canvas = canvasRef.current;
    if (!canvas) return () => {
      clearInterval(letterTimer);
      if (unifyTimer) clearTimeout(unifyTimer);
    };
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

    // Glowing Meteors (نيازك متساقطة في السماء الكونية)
    const meteors: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      size: number;
      color: string;
      angle: number;
    }> = [];

    const addMeteor = () => {
      if (meteors.length < 7) {
        const colors = ['#ffd700', '#f472b6', '#ff4d6d', '#ffffff', '#fbbf24', '#e879f9'];
        meteors.push({
          x: Math.random() * (width + 300) - 100,
          y: Math.random() * (height / 2) - 150,
          length: Math.random() * 130 + 70,
          speed: Math.random() * 9 + 5,
          size: Math.random() * 2.5 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.PI / 4 // 45 degree diagonal falling
        });
      }
    };

    const meteorInterval = setInterval(addMeteor, 700);

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
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffd700';
        ctx.fill();
      });

      // Render falling glowing meteors (نيازك)
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x -= m.speed * Math.cos(m.angle);
        m.y += m.speed * Math.sin(m.angle);

        // Tail gradient line
        const grad = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x + m.length * Math.cos(m.angle),
          m.y - m.length * Math.sin(m.angle)
        );
        grad.addColorStop(0, m.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(
          m.x + m.length * Math.cos(m.angle),
          m.y - m.length * Math.sin(m.angle)
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.size;
        ctx.shadowBlur = 14;
        ctx.shadowColor = m.color;
        ctx.stroke();

        // Glowing meteor head
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 18;
        ctx.shadowColor = m.color;
        ctx.fill();

        if (m.x < -300 || m.y > height + 200) {
          meteors.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(letterTimer);
      clearInterval(meteorInterval);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [nameLetters.length]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-transparent text-white flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden text-center dir-rtl">

      {/* AMBIENT RADIAL GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.2)_0%,_transparent_70%)] pointer-events-none z-0" />

      {/* TOP DECORATIVE BADGE */}
      <div className="relative z-10 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/5 border border-pink-400/30 text-amber-300 text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span style={{ fontFamily: "'Cairo', sans-serif" }}>
            اسمكِ المحفور بين النجوم 🌌✨
          </span>
        </div>
      </div>

      {/* CONSTELLATION NAME CONTAINER */}
      <div className="relative z-10 max-w-3xl w-full my-auto py-8 flex flex-col items-center gap-8">
        
        {/* REVEALING LETTERS OR SINGLE UNIFIED GLOWING WORD CARD */}
        {isCardUnified ? (
          <div className="relative px-8 py-5 sm:px-14 sm:py-7 rounded-[32px] bg-gradient-to-r from-amber-400 via-rose-500 to-pink-600 border-2 border-amber-200 shadow-[0_0_60px_rgba(251,191,36,0.95)] animate-pulse transition-all duration-700">
            <span
              className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-normal font-sans drop-shadow-[0_0_20px_rgba(255,255,255,1)]"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {currentConstellationName}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 dir-ltr">
            {nameLetters.map((letter, index) => {
              const isRevealed = index < revealedCount;
              return (
                <div
                  key={index}
                  className={`relative w-12 h-16 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-4xl transition-all duration-500 transform ${
                    isRevealed
                      ? 'bg-gradient-to-b from-rose-500 via-pink-600 to-rose-700 text-white border-2 border-amber-300/80 shadow-[0_0_35px_rgba(244,63,94,0.8)] scale-110 -translate-y-1'
                      : 'bg-white/5 border border-white/10 text-white/20 scale-90 rotate-3'
                  }`}
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {isRevealed ? letter : '★'}
                  {isRevealed && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_10px_#ffd700] animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ROMANTIC DEDICATION MESSAGE */}
        <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#160312]/90 border border-pink-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(244,63,94,0.3)]">
          <p
            className="text-base sm:text-lg md:text-xl font-bold text-pink-100 leading-relaxed drop-shadow"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {fullMessage}
          </p>
        </div>

      </div>

      {/* NEXT STEP ACTION BUTTON */}
      <div className="relative z-10 pb-6 w-full max-w-sm">
        <button
          onClick={onNext}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm sm:text-base shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.constellationButtonText || 'عداد الحب'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
