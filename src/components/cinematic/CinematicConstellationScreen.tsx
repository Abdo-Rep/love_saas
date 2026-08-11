'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface Props {
  onRestart: () => void;
}

export const CinematicConstellationScreen: React.FC<Props> = ({ onRestart }) => {
  const [activeStarIdx, setActiveStarIdx] = useState(-1);
  const [lineProgress, setLineProgress] = useState(0); // 0 to 1 for growing connection lines
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDesc, setTypedDesc] = useState("");
  const [isTextFadingOut, setIsTextFadingOut] = useState(false);
  const [showCenterHeart, setShowCenterHeart] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthCleanupRef = useRef<(() => void) | null>(null);

  const stars = [
    { x: 32, y: 35, name: "النجمة الأولى: أول لقاء 💫", desc: "أول يوم عيوني شافتك فيه، كأن دنيتي بدأت من اللحظة دي." },
    { x: 50, y: 45, name: "النجمة الثانية: أول ضحكة 😂", desc: "ضحكتك الأولى اللي دخلت قلبي وفضل صداها مالي حياتي فرحة." },
    { x: 68, y: 35, name: "النجمة الثالثة: أول وعد 🤝", desc: "يوم ما اتعاهدنا نفضل سوا، وكان ده أجمل عهد أخذته على نفسي." },
    { x: 65, y: 65, name: "النجمة الرابعة: تفاصيلك الصامتة 🥰", desc: "بحب كل تفاصيلك الصغيرة، حتى طريقة كلامك وزعلك الهادي." },
    { x: 50, y: 82, name: "النجمة الخامسة: عهد الحب الأبدي ♾️", desc: "هنفضل لآخر العمر سوا، حبنا مكتوب في النجوم وما بينتهي." },
    { x: 35, y: 65, name: "النجمة السادسة: نبض الروح ❤️", desc: "في كل لحظة وكل ثانية، قلبك هو المأوى والأمان الوحيد ليا." }
  ];

  // 1. Play Mellow Violin/Harp Theme
  useEffect(() => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.06, ctx.currentTime); // Soft background volume
      masterGain.connect(ctx.destination);

      // Sweet arpeggiated love chords playing
      const chords = [
        [261.63, 329.63, 392.00, 523.25], // Cmaj7
        [220.00, 261.63, 329.63, 440.00], // Am7
        [174.61, 220.00, 261.63, 349.23], // Fmaj7
        [196.00, 246.94, 293.66, 392.00]  // G7
      ];

      let step = 0;
      const playSequence = () => {
        const now = ctx.currentTime;
        const chord = chords[step % chords.length];
        
        // Play arpeggio
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine'; // soft violin-like tone
          osc.frequency.setValueAtTime(freq, now + idx * 0.4);
          
          gain.gain.setValueAtTime(0, now + idx * 0.4);
          gain.gain.linearRampToValueAtTime(0.025, now + idx * 0.4 + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.4 + 2.5);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          
          osc.start(now + idx * 0.4);
          osc.stop(now + idx * 0.4 + 2.5);
        });

        step++;
      };

      playSequence();
      const intervalId = setInterval(playSequence, 2400);

      synthCleanupRef.current = () => {
        clearInterval(intervalId);
        ctx.close().catch(() => {});
      };
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }

    return () => {
      if (synthCleanupRef.current) synthCleanupRef.current();
    };
  }, []);

  // 2. Stars Canvas Animation with growing constellation lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Background Stars (static constellation dots)
    const bgStars = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 0.5 + Math.random() * 1.5,
      twinkle: Math.random() * Math.PI
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Twinkle background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      bgStars.forEach((star) => {
        star.twinkle += 0.02;
        const opacity = 0.2 + (Math.sin(star.twinkle) + 1) * 0.4;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Constellation Lines
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 12;

      for (let i = 0; i <= activeStarIdx; i++) {
        const current = stars[i];
        let next = stars[i + 1];
        
        // Loop back to Star 0 if all stars ignited to close the heart shape
        if (i === stars.length - 1 && showCenterHeart) {
          next = stars[0];
        }

        if (!next) continue;

        const currentX = (current.x / 100) * w;
        const currentY = (current.y / 100) * h;
        const nextX = (next.x / 100) * w;
        const nextY = (next.y / 100) * h;

        ctx.beginPath();
        ctx.moveTo(currentX, currentY);

        // If drawing the current active connection line, animate its growth
        if (i === activeStarIdx && !showCenterHeart) {
          const dx = nextX - currentX;
          const dy = nextY - currentY;
          ctx.lineTo(currentX + dx * lineProgress, currentY + dy * lineProgress);
        } else {
          ctx.lineTo(nextX, nextY);
        }

        // Beautiful pulsing gradient glow for the constellation lines
        ctx.strokeStyle = `rgba(244, 63, 94, 0.65)`;
        ctx.shadowColor = 'rgba(244, 63, 94, 0.8)';
        ctx.stroke();
      }

      // Draw Main Stars (large glowing points)
      stars.forEach((star, idx) => {
        if (idx > activeStarIdx && activeStarIdx !== -1) return;

        const starX = (star.x / 100) * w;
        const starY = (star.y / 100) * h;

        // Outer glow circle
        ctx.fillStyle = idx === activeStarIdx ? 'rgba(251, 191, 36, 0.25)' : 'rgba(244, 63, 94, 0.18)';
        ctx.beginPath();
        ctx.arc(starX, starY, 14 + Math.sin(Date.now() / 200) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = idx === activeStarIdx ? '#fef08a' : '#fda4af';
        ctx.shadowColor = idx === activeStarIdx ? '#fb7185' : '#e11d48';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(starX, starY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeStarIdx, lineProgress, showCenterHeart]);

  // 3. Fully Automated Constellation Show Loop
  useEffect(() => {
    let activeIdx = 0;
    setActiveStarIdx(0); // Ignite Star 1

    const playStarSequence = () => {
      if (activeIdx < stars.length - 1) {
        // Grow connection line to the next star
        let progress = 0;
        const lineInterval = setInterval(() => {
          progress += 0.02;
          if (progress >= 1.0) {
            clearInterval(lineInterval);
            // Ignite next star!
            activeIdx++;
            setActiveStarIdx(activeIdx);
          } else {
            setLineProgress(progress);
          }
        }, 20); // 20ms update for smooth line drawing
      } else {
        // All stars ignited! Trigger the center heart finale
        setTimeout(() => {
          setShowCenterHeart(true);
        }, 1500);
      }
    };

    // We trigger the next star connection every 6 seconds (giving enough time for typing and reading!)
    const sequenceTimer = setInterval(() => {
      if (activeIdx < stars.length - 1) {
        // Fade out active text box first
        setIsTextFadingOut(true);
        setTimeout(() => {
          setIsTextFadingOut(false);
          playStarSequence();
        }, 500);
      } else {
        clearInterval(sequenceTimer);
        playStarSequence();
      }
    }, 6000);

    return () => {
      clearInterval(sequenceTimer);
    };
  }, []);

  // 4. Typewriter live text effect for the active star memory card
  useEffect(() => {
    if (activeStarIdx === -1) return;
    setTypedTitle("");
    setTypedDesc("");

    const star = stars[activeStarIdx];
    let titleCharIdx = 0;
    let descCharIdx = 0;

    const typeTitle = () => {
      const titleInterval = setInterval(() => {
        if (titleCharIdx < star.name.length) {
          setTypedTitle((prev) => prev + star.name.charAt(titleCharIdx));
          titleCharIdx++;
        } else {
          clearInterval(titleInterval);
          typeDesc();
        }
      }, 35);
    };

    const typeDesc = () => {
      const descInterval = setInterval(() => {
        if (descCharIdx < star.desc.length) {
          setTypedDesc((prev) => prev + star.desc.charAt(descCharIdx));
          descCharIdx++;
        } else {
          clearInterval(descInterval);
        }
      }, 40);
    };

    typeTitle();
  }, [activeStarIdx]);

  return (
    <div className="min-h-screen w-full bg-[#030109] flex flex-col items-center justify-center p-4 md:p-8 select-none relative overflow-hidden animate-[fade-in_1.5s_ease-out]">
      {/* Stars Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Floating Memory Glassmorphic Overlay next to the active star */}
      {activeStarIdx !== -1 && !showCenterHeart && (
        <div 
          className={`relative z-10 w-full max-w-md p-[1.5px] rounded-[2rem] bg-gradient-to-r from-blue-600/80 via-pink-500/80 to-rose-400/80 shadow-[0_20px_60px_rgba(0,0,0,0.8),_0_0_30px_rgba(236,72,153,0.1)] transition-all duration-500 ${
            isTextFadingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div 
            style={{ background: 'linear-gradient(135deg, rgba(16, 9, 32, 0.96) 0%, rgba(8, 4, 18, 0.98) 100%)' }}
            className="w-full rounded-[2rem] p-6 md:p-8 backdrop-blur-2xl text-center"
          >
            <h3 
              className="text-[#fef08a] text-xl font-bold flex items-center justify-center gap-1.5 filter drop-shadow-[0_0_6px_rgba(254,240,138,0.4)]"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {typedTitle}
            </h3>
            
            {/* Diamond Divider */}
            <div className="flex items-center justify-center gap-3 w-full my-3">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
              <div className="w-1.5 h-1.5 rotate-45 bg-purple-400/50" />
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
            </div>

            <p 
              className="text-white/80 text-base md:text-lg leading-relaxed font-medium"
              style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}
            >
              {typedDesc}
            </p>
          </div>
        </div>
      )}

      {/* GRAND FINALE HEART CONSTELLATION OVERLAY */}
      {showCenterHeart && (
        <div className="relative z-20 w-full max-w-lg p-[1.5px] rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-pink-500 to-rose-400 shadow-[0_30px_100px_rgba(0,0,0,0.85),_0_0_50px_rgba(236,72,153,0.25)] animate-[fade-in_1.2s_ease-out]">
          <div 
            style={{ background: 'linear-gradient(135deg, rgba(16, 9, 32, 0.96) 0%, rgba(8, 4, 18, 0.98) 100%)' }}
            className="w-full rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl text-center flex flex-col items-center gap-6"
          >
            {/* Pulsing Large Rose Heart */}
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center animate-[heart-beat_1.3s_infinite]">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            </div>

            <h2 
              className="text-[#fef08a] text-2xl md:text-3.5xl font-extrabold filter drop-shadow-[0_0_12px_rgba(254,240,138,0.4)] leading-relaxed" 
              style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}
            >
              حبنا مكتوب في النجوم.. حبيبتي للأبد 🌍❤️
            </h2>

            <div className="flex items-center justify-center gap-3 w-full my-1">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent flex-1" />
              <div className="w-1.5 h-1.5 rotate-45 bg-purple-400" />
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent flex-1" />
            </div>

            <p 
              className="text-white/60 text-xs md:text-sm max-w-sm leading-relaxed" 
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              كل كوكب ونجمة يشهدان على حبي لكي، دمتي لي نبضاً وروحاً وعمراً جميلاً لا ينتهي.
            </p>

            <button 
              onClick={onRestart}
              className="mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black text-sm font-extrabold border border-amber-300 hover:from-amber-400 hover:to-amber-300 transition-all active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center gap-2"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              🔄 إعادة تشغيل العرض 
            </button>
          </div>
        </div>
      )}

      {/* Styled Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
};
