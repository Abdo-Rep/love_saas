'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Heart, Eye, ArrowLeft, Stars } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const POETRY_VERSES = [
  {
    title: 'نظرة أولى 👁️',
    verse: 'في عيونك.. شفت كون كامل ملوش نهاية ✨',
    sub: 'كل ما أبص لعينيكي بحس إن الوقت بيقف والكون كله بيهدى.'
  },
  {
    title: 'سر السعادة 💫',
    verse: 'عيونك فيها سر السعادة والبهجة.. والنور اللي بينور عتمة أيامي.',
    sub: 'ابتسامتك اللي بتنعكس في نظرتك هي دوا قلبي في كل وقت.'
  },
  {
    title: 'سحر الليل 🌙',
    verse: 'سواد عينيكي ليل دافي وجميل.. كأن ربنا جمع كل نجوم السماء وحطها في نظرتك.',
    sub: 'جمال ونقاء ملوش مثيل في الدنيا دي كلها.'
  },
  {
    title: 'دفء الروح 🔥',
    verse: 'نظرة واحدة من عينيكي بتخليني أنسى أي تعب وأحس إن الكون كله بين إيديا.',
    sub: 'إنتي المكان الوحيد اللي بحس فيه بالسكينة والأمان.'
  },
  {
    title: 'مجرة العشق 🌟',
    verse: 'في عيونك سحر يخلي العقول تتوه.. كأنها مجرة خضراء وذهبية حية بتقول قصائد عشق.',
    sub: 'بنات العالم كلهم في كفة.. ونظرة منك إنتي في كفة تانية لوحدك.'
  }
];

export const HerEyesGalaxy: React.FC<Props> = ({ onNext }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [verseIndex, setVerseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [sparkleCount, setSparkleCount] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Typewriter effect & auto-advance after finishing sentence
  useEffect(() => {
    const fullText = POETRY_VERSES[verseIndex].verse;
    setTypedText('');
    let i = 0;
    let pauseTimer: NodeJS.Timeout;

    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        // Pause for 1.8s after sentence finishes, then auto-advance to next verse
        pauseTimer = setTimeout(() => {
          setVerseIndex((prev) => (prev + 1) % POETRY_VERSES.length);
        }, 1800);
      }
    }, 40);

    return () => {
      clearInterval(interval);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [verseIndex]);

  // Audio Chime Feedback
  const playMagicChime = () => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Gentle golden chime frequency
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      const randomFreq = freqs[verseIndex % freqs.length];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomFreq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch (_) {}
  };

  // Canvas Galaxy Animation & Touch Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles Array
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];

    // Background Stars
    const bgStars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 150; i++) {
      bgStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005
      });
    }

    // Add Sparkles at position
    const addSparkles = (cx: number, cy: number, count = 12) => {
      const colors = ['#f59e0b', '#ec4899', '#10b981', '#6366f1', '#fbbf24', '#ffffff'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    };

    // Spawn initial eye sparkles at center
    addSparkles(width / 2, height * 0.4, 25);

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.3) {
        addSparkles(e.clientX, e.clientY, 3);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        addSparkles(e.touches[0].clientX, e.touches[0].clientY, 3);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.fillStyle = '#05020c';
      ctx.fillRect(0, 0, width, height);

      // Render Ambient Stars
      bgStars.forEach((star) => {
        star.alpha += Math.sin(time + star.x) * star.speed;
        const clampedAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.fillStyle = `rgba(255, 255, 255, ${clampedAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Central Cosmic Eye Iris Galaxies
      const centerX = width / 2;
      const centerY = height * 0.38;

      // Outer Radial Glow
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 220);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
      grad.addColorStop(0.4, 'rgba(16, 185, 129, 0.15)');
      grad.addColorStop(0.8, 'rgba(236, 72, 153, 0.08)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 220, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Emerald & Gold Iris Rings
      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer Iris Ring
      ctx.rotate(time * 0.3);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 90, 45, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Emerald Ring
      ctx.rotate(-time * 0.6);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 65, 32, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      // Center Pupil Core Glow
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, 8 + Math.sin(time * 2) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      // Render Active Sparkle Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Cycle Verse on Screen Tap/Click
  const handleScreenClick = (e: React.MouseEvent) => {
    // Avoid triggering when clicking the next button directly
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    playMagicChime();
    setSparkleCount((c) => c + 1);
    setVerseIndex((prev) => (prev + 1) % POETRY_VERSES.length);
  };

  return (
    <div
      onClick={handleScreenClick}
      className="relative w-full h-screen overflow-hidden bg-[#05020c] flex flex-col items-center justify-between p-6 text-center select-none cursor-pointer"
    >
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* TOP BAR BADGE */}
      <div className="relative z-20 pt-4 flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-amber-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.25)] animate-pulse">
          <Eye className="w-4 h-4 text-amber-400" />
          <span className="text-xs md:text-sm font-bold text-amber-300 tracking-wider" style={{ fontFamily: "'Cairo', sans-serif" }}>
            مجرة العيون الساحرة 👁️✨
          </span>
        </div>
        <p className="text-[11px] text-amber-200/60 font-medium" style={{ fontFamily: "'Cairo', sans-serif" }}>
          (إلمسي الشاشة في أي مكان لاكتشاف سحر عيونك 💫)
        </p>
      </div>

      {/* CENTER POETRY CARD & EYE SYMBOL */}
      <div className="relative z-20 flex flex-col items-center max-w-2xl w-full my-auto px-4">
        
        {/* Floating Eye Symbol */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-rose-500 blur-2xl opacity-70 animate-pulse" />
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-black/60 border-2 border-amber-400/60 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)]">
            <Eye className="w-12 h-12 md:w-16 md:h-16 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Verse Category Title */}
        <div className="text-amber-400/90 text-sm md:text-base font-bold mb-2 tracking-widest uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{POETRY_VERSES[verseIndex].title}</span>
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Typewritten Verse Text */}
        <h2
          className="text-amber-100 text-2xl md:text-4xl font-extrabold leading-relaxed text-center mb-4 min-h-[90px] flex items-center justify-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "'Amiri', 'Cairo', serif", direction: 'rtl' }}
        >
          {typedText}
          <span className="inline-block w-1 h-7 bg-amber-400 mr-1 animate-ping" />
        </h2>

        {/* Verse Subtitle Context */}
        <p
          className="text-amber-200/80 text-sm md:text-base max-w-lg leading-relaxed font-medium bg-black/40 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {POETRY_VERSES[verseIndex].sub}
        </p>

        {/* Step Indicator Dots */}
        <div className="flex items-center gap-2 mt-6">
          {POETRY_VERSES.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === verseIndex ? 'w-8 bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* BOTTOM ACTION BUTTON */}
      <div className="relative z-20 pb-6 w-full max-w-md flex flex-col items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-black text-sm md:text-base font-black shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-amber-300 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>تعالي كملي حكايتنا في الوجدان.. 💖</span>
          <ArrowLeft className="w-5 h-5 text-black group-hover:-translate-x-1.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};
