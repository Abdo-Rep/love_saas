'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Props {
  onFinish: () => void;
}

export const CinematicTextScreen: React.FC<Props> = ({ onFinish }) => {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const [isFadingOutText, setIsFadingOutText] = useState(false);

  // Parallax Tilt States
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthCleanupRef = useRef<(() => void) | null>(null);

  const romanticSentences = [
    "كل دقة في قلبي بتناديكي، كأن المسرح ده كله اتخلق بس علشان أقولك إني بحبك.",
    "ضحكتك هي الموسيقى الحقيقية اللي بتخليني أرقص فرحاً كل يوم.",
    "في عيونك شفت دنيتي كلها، كأنك النور الوحيد في وسط المسرح المظلم ده.",
    "كل خطوة بخطيها معاكي هي البداية لرحلة عمر مش عايزها تنتهي.",
    "أنتي مش بس حبيبتي، أنتي النجمة اللي بتنور حياتي وكل تفاصيلي.",
    "وعد مني ليكي.. هفضل أحبك وأحميكي لآخر يوم في عمري."
  ];

  // 1. Interactive Mouse Parallax Tilt Effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const xVal = (e.clientX - width / 2) / (width / 2);
    const yVal = (e.clientY - height / 2) / (height / 2);
    
    setRotateX(-yVal * 4.5);
    setRotateY(xVal * 4.5);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // 2. Play Soft Romantic Heavenly Pad Chords
  useEffect(() => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const chords = [
        [130.81, 196.00, 246.94, 329.63], // Cmaj9
        [110.00, 164.81, 196.00, 261.63], // Am9
        [87.31, 130.81, 174.61, 261.63],  // Fmaj9
        [98.00, 146.83, 174.61, 246.94],  // G13
      ];

      let chordIdx = 0;
      const playChord = () => {
        const now = ctx.currentTime;
        const currentChord = chords[chordIdx];
        
        currentChord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.025, now + 2.0);
          gain.gain.setValueAtTime(0.025, now + 4.5);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 6.5);
          
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, now);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          
          osc.start(now);
          osc.stop(now + 6.5);
        });

        chordIdx = (chordIdx + 1) % chords.length;
      };

      playChord();
      const intervalId = setInterval(playChord, 6000);

      synthCleanupRef.current = () => {
        clearInterval(intervalId);
        ctx.close().catch(() => {});
      };
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }

    return () => {
      if (synthCleanupRef.current) {
        synthCleanupRef.current();
      }
    };
  }, []);

  // 3. Canvas HTML5 Falling Romantic Bokeh Sparks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x = Math.random() * width;
      y = Math.random() * height;
      size = 15 + Math.random() * 25;
      speedX = -0.4 + Math.random() * 0.8;
      speedY = -0.3 - Math.random() * 0.7;
      opacity = 0.15 + Math.random() * 0.25;
      color = `hsla(${260 + Math.random() * 80}, 75%, 60%, ${this.opacity})`;

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 80) * 0.3;
        if (this.y < -40) {
          this.y = height + 40;
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        const grad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        c.fillStyle = grad;
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 4. Typewriter Effect
  useEffect(() => {
    setTypedText("");
    setIsTypingFinished(false);
    
    const sentence = romanticSentences[currentSentenceIdx];
    let charIdx = 0;
    
    const typingInterval = setInterval(() => {
      if (charIdx < sentence.length) {
        setTypedText((prev) => prev + sentence.charAt(charIdx));
        charIdx++;
      } else {
        clearInterval(typingInterval);
        setIsTypingFinished(true);
      }
    }, 45);
    
    return () => clearInterval(typingInterval);
  }, [currentSentenceIdx]);

  // 5. Automatic Slide Progression
  useEffect(() => {
    if (isTypingFinished) {
      const delay = setTimeout(() => {
        setIsFadingOutText(true);
        
        const switchTimer = setTimeout(() => {
          if (currentSentenceIdx < romanticSentences.length - 1) {
            setCurrentSentenceIdx((prev) => prev + 1);
            setIsFadingOutText(false);
          } else {
            // When all sentences finish, call onFinish to transition to Step 4!
            if (onFinish) {
              onFinish();
            }
          }
        }, 500);

        return () => clearTimeout(switchTimer);
      }, 3800);
      
      return () => clearTimeout(delay);
    }
  }, [isTypingFinished, currentSentenceIdx, onFinish]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen w-full bg-[#04010a] flex flex-col items-center justify-center p-4 md:p-8 select-none relative overflow-hidden animate-[fade-in_1.2s_ease-out]"
    >
      {/* 2D Canvas for Bokeh Floating Particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Double Border Gradient Wrapper Card - Made LARGER (max-w-2xl) */}
      <div 
        style={{ 
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`,
          transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className="relative z-10 w-full max-w-2xl p-[1.5px] rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-pink-500 to-rose-400 shadow-[0_30px_100px_rgba(0,0,0,0.85),_0_0_50px_rgba(236,72,153,0.15)]"
      >
        {/* Inner Card Container */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(16, 9, 32, 0.94) 0%, rgba(8, 4, 18, 0.98) 100%)'
          }}
          className="relative w-full aspect-[16/10] rounded-[2.5rem] flex flex-col justify-center overflow-hidden p-8 md:p-14 backdrop-blur-2xl"
        >
          {/* Regular Typing Slides - Message is the ONLY content, styled with beautiful calligraphic Amiri font */}
          <div className="flex-1 flex items-center justify-center text-center">
            <p 
              className={`text-white/95 text-2xl md:text-4xl leading-relaxed md:leading-loose font-medium select-text px-6 transition-opacity duration-500 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
                isFadingOutText ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ fontFamily: "'Amiri', serif", direction: 'rtl' }}
            >
              {typedText}
              {!isTypingFinished && <span className="text-rose-500 ml-2 animate-pulse text-lg md:text-xl">❤️</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Styled Animations & Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@400;600;700;900&display=swap');

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
