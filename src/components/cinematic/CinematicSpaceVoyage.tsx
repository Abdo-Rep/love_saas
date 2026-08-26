'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Props {
  onRestart: () => void;
}

export const CinematicSpaceVoyage: React.FC<Props> = ({ onRestart }) => {
  // Current spread index (0 to 5)
  const [spreadIndex, setSpreadIndex] = useState(0);

  // Typing phase: 'right' | 'right_pause' | 'left' | 'left_pause' | 'reading'
  const [typingPhase, setTypingPhase] = useState<'right' | 'right_pause' | 'left' | 'left_pause' | 'reading'>('right');

  const [rightTypedText, setRightTypedText] = useState("");
  const [leftTypedText, setLeftTypedText] = useState("");

  const [isFlipping, setIsFlipping] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthCleanupRef = useRef<(() => void) | null>(null);

  // The 11 Romantic Messages paired across 6 spreads (Right Page & Left Page)
  const bookSpreads = [
    {
      right: "طلعت أدور عليكِ في كل مكان ووسط كل الناس..",
      left: "شفت كل بنات العالم.. ومفيش واحدة فيهم خطفت عيوني وقلبي غيرك إنتي"
    },
    {
      right: "إنتي الشمس اللي بتنور حياتي.. والجمال اللي بيخليني أنسى أي قسوة في الدنيا",
      left: "قربك مني هو سر سعادتي.. إنتي أقرب لروحي ونفسي من أي حد في الدنيا دي"
    },
    {
      right: "رمز الرقة والجمال.. بتباني دايماً في عيوني أجمل وأرق بنت شافتها عيني",
      left: "بنات العالم كلهم في كفة.. وإنتي في كفة تانية لوحدك، كأنك جيتي من عالم تاني خالص"
    },
    {
      right: "القمر بيستمد نوره من الشمس.. بس إنتي بتنوري حياتي بنورك الخاص الدافئ",
      left: "حبك هو اللي بيديني الشجاعة والقوة.. عشان أقف قدام أي صعاب وأواجه الدنيا"
    },
    {
      right: "عظمة حبي ليكي ومكانتك الجوا قلبي.. تتجاوز حدود الكون ومفيش حاجة تقدر تقيسها",
      left: "ودبلة حبنا بتطوق قلبي للأبد.. عهد ووعد حقيقي مش هينتهي طول العمر"
    },
    {
      right: "دورت في كل مكان ورجعت عشانك.. إنتي مش واحدة من بنات العالم..",
      left: "إنتي العالم كله. 💫"
    }
  ];

  // 1. Play Soft Background Synth Music
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
        [98.00, 146.83, 174.61, 246.94],  // G13
        [110.00, 164.81, 196.00, 261.63], // Am9
        [87.31, 130.81, 174.61, 261.63]   // Fmaj9
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
          filter.frequency.setValueAtTime(550, now);

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
      if (synthCleanupRef.current) synthCleanupRef.current();
    };
  }, []);

  // 2. Typewriter Live Writing Logic with 2-Second Pauses
  useEffect(() => {
    if (showGrandFinale || isFlipping) return;

    const currentSpread = bookSpreads[spreadIndex];

    // PHASE 1: Write Right Page
    if (typingPhase === 'right') {
      setRightTypedText("");
      setLeftTypedText("");
      let charIdx = 0;
      const rightText = currentSpread.right;

      const interval = setInterval(() => {
        if (charIdx < rightText.length) {
          setRightTypedText(rightText.slice(0, charIdx + 1));
          charIdx++;
        } else {
          clearInterval(interval);
          setTypingPhase('right_pause'); // Pause after finishing right page!
        }
      }, 60);

      return () => clearInterval(interval);
    }

    // PHASE 2: 2-Second Pause After Right Page
    else if (typingPhase === 'right_pause') {
      const pauseTimer = setTimeout(() => {
        setTypingPhase('left'); // Start writing left page!
      }, 2000); // Exactly 2 seconds pause

      return () => clearTimeout(pauseTimer);
    }

    // PHASE 3: Write Left Page
    else if (typingPhase === 'left') {
      let charIdx = 0;
      const leftText = currentSpread.left;

      const interval = setInterval(() => {
        if (charIdx < leftText.length) {
          setLeftTypedText(leftText.slice(0, charIdx + 1));
          charIdx++;
        } else {
          clearInterval(interval);
          setTypingPhase('left_pause'); // Pause after finishing left page!
        }
      }, 60);

      return () => clearInterval(interval);
    }

    // PHASE 4: 2-Second Pause After Left Page
    else if (typingPhase === 'left_pause') {
      const pauseTimer = setTimeout(() => {
        setTypingPhase('reading'); // Trigger page flip!
      }, 2000); // Exactly 2 seconds pause

      return () => clearTimeout(pauseTimer);
    }
  }, [spreadIndex, typingPhase, showGrandFinale, isFlipping]);

  // 3. 0.8s Realistic Page Flip Trigger
  useEffect(() => {
    if (typingPhase === 'reading' && !showGrandFinale && !isFlipping) {
      const startFlipTimer = setTimeout(() => {
        // Keep written text intact while flipping (will be reset when new spread starts)
        setIsFlipping(true);

        const endFlipTimer = setTimeout(() => {
          setIsFlipping(false);

          if (spreadIndex < bookSpreads.length - 1) {
            setSpreadIndex((prev) => prev + 1);
            setTypingPhase('right'); // Start typing right page on new spread!
          } else {
            setShowGrandFinale(true);
          }
        }, 800); // Matches 0.8s animation duration

        return () => clearTimeout(endFlipTimer);
      }, 300); // 0.3s pre-flip trigger

      return () => clearTimeout(startFlipTimer);
    }
  }, [typingPhase, spreadIndex, showGrandFinale, isFlipping]);

  return (
    <div className="min-h-screen w-full bg-[#0b050f] flex items-center justify-center p-3 md:p-8 select-none relative overflow-hidden">
      {/* Candlelight Ambient Warmth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/30 via-[#0b050f] to-[#040208] pointer-events-none" />

      {/* Floating Golden Dust Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30 animate-pulse">
        <div className="w-full h-full bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* 3D REALISTIC BOOK CONTAINER */}
      <div className="relative w-full max-w-6xl h-[82vh] min-h-[520px] max-h-[750px] flex justify-center items-center perspective-1800 z-10">
        
        {/* Book Outer Leather Base Frame */}
        <div 
          className="relative w-full h-full rounded-[28px] bg-[#2a1308] p-3 md:p-5 border-4 border-[#522510] shadow-[0_30px_70px_rgba(0,0,0,0.95)] flex overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #3d1b0c 0%, #220d05 100%)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.95), inset 0 0 40px rgba(0,0,0,0.8)'
          }}
        >
          {/* Stitched Gold Border Decor */}
          <div className="absolute inset-2 border-2 border-dashed border-amber-600/30 rounded-[22px] pointer-events-none" />

          {/* Red Ribbon Bookmark Hanging from Top Spine */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-36 bg-gradient-to-b from-rose-700 via-rose-600 to-rose-800 rounded-b-md z-40 shadow-[0_4px_12px_rgba(0,0,0,0.6)] pointer-events-none border-x border-rose-900/50" />

          {/* THE OPEN PARCHMENT BOOK SPREAD */}
          <div className="relative w-full h-full rounded-[18px] bg-[#f4ebd9] border border-[#d2c2a8] flex overflow-hidden shadow-[inset_0_0_40px_rgba(160,130,90,0.35),0_6px_20px_rgba(0,0,0,0.4)]">
            
            {/* Paper Fiber Texture & Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(139,94,60,0.18)_100%)] pointer-events-none z-10" />

            {/* ========================================== */}
            {/* RIGHT PAGE (الصفحة اليمنى) */}
            {/* ========================================== */}
            <div className="w-1/2 h-full bg-gradient-to-l from-[#faf5eb] via-[#f4ebd9] to-[#e4d6be] p-6 md:p-12 flex flex-col justify-center relative border-l border-[#d3c2a6]">
              {/* Spine Shadow Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />

              {/* Corner Ornaments */}
              <div className="absolute top-4 right-4 text-amber-900/30 text-xl pointer-events-none">❦</div>
              <div className="absolute bottom-4 right-4 text-amber-900/30 text-xl pointer-events-none">❦</div>

              {/* RIGHT PAGE LIVE TEXT */}
              <div className="py-4 px-2 text-right z-10">
                <p 
                  className="text-[#231206] text-2xl md:text-3.5xl leading-relaxed font-bold select-text"
                  style={{ 
                    fontFamily: "'Amiri', 'Cairo', serif", 
                    direction: 'rtl',
                    textShadow: '0 1px 2px rgba(251, 191, 36, 0.15)'
                  }}
                >
                  {rightTypedText}
                  {typingPhase === 'right' && !isFlipping && (
                    <span className="inline-block w-1 h-7 bg-amber-800 ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>

            {/* CENTER BOOK SPINE CREASE */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[8px] -translate-x-1/2 bg-gradient-to-r from-black/35 via-amber-950/25 to-black/35 z-20 shadow-[0_0_15px_rgba(0,0,0,0.6)]" />

            {/* ========================================== */}
            {/* LEFT PAGE (الصفحة اليسرى) */}
            {/* ========================================== */}
            <div className="w-1/2 h-full bg-gradient-to-r from-[#faf5eb] via-[#f4ebd9] to-[#e4d6be] p-6 md:p-12 flex flex-col justify-center relative">
              {/* Spine Shadow Effect */}
              <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-black/25 via-black/10 to-transparent pointer-events-none" />

              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 text-amber-900/30 text-xl pointer-events-none">❦</div>
              <div className="absolute bottom-4 left-4 text-amber-900/30 text-xl pointer-events-none">❦</div>

              {/* LEFT PAGE LIVE TEXT */}
              <div className="py-4 px-2 text-right z-10">
                <p 
                  className="text-[#231206] text-2xl md:text-3.5xl leading-relaxed font-bold select-text"
                  style={{ 
                    fontFamily: "'Amiri', 'Cairo', serif", 
                    direction: 'rtl',
                    textShadow: '0 1px 2px rgba(251, 191, 36, 0.15)'
                  }}
                >
                  {leftTypedText}
                  {typingPhase === 'left' && !isFlipping && (
                    <span className="inline-block w-1 h-7 bg-amber-800 ml-1 animate-pulse" />
                  )}
                </p>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PURE BLANK PARCHMENT 3D FLIPPING LEAF (ZERO MIRRORED TEXT BUG!) */}
            {/* ========================================================================= */}
            {isFlipping && (
              <div 
                className="absolute inset-0 z-30 pointer-events-none"
                style={{ perspective: '1800px', perspectiveOrigin: '50% 50%' }}
              >
                <div 
                  className="absolute top-0 bottom-0 w-1/2 left-0 flex items-center"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'right center',
                    animation: 'realisticPaperTurn 0.8s ease-in-out forwards'
                  }}
                >
                  {/* Dynamic Gliding Paper Specular Sheen Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent z-20 animate-paperGlazeSheen pointer-events-none" />

                  {/* الوجه الأمامي - ورقة بردي ناصية خالية من النص */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#faf5eb] via-[#f4ebd9] to-[#e4d6be] border-r border-[#c4b39b] shadow-[inset_0_0_20px_rgba(139,94,60,0.2)]"
                    style={{ backfaceVisibility: 'hidden' }}
                  />

                  {/* الوجه الخلفي - ورقة بردي ناصية خالية من النص */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-l from-[#faf5eb] via-[#f4ebd9] to-[#e4d6be] border-l border-[#c4b39b] shadow-[inset_0_0_20px_rgba(139,94,60,0.2)]"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(-180deg)'
                    }}
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* GRAND FINALE OVERLAY */}
      {showGrandFinale && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-[fade-in_1s_ease-out] text-center">
          <div className="max-w-2xl flex flex-col items-center gap-6 bg-gradient-to-b from-[#2a150a] to-[#170903] border-2 border-amber-500/50 p-8 md:p-12 rounded-3xl shadow-[0_0_70px_rgba(251,191,36,0.35)]">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(236,72,153,0.6)] animate-bounce">
              💖
            </div>

            <h2 
              className="text-amber-100 text-3xl md:text-5xl font-extrabold leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" 
              style={{ fontFamily: "'Amiri', 'Cairo', serif", direction: 'rtl' }}
            >
              دورت في كل مكان ورجعت عشانك.. إنتي مش واحدة من بنات العالم.. إنتي العالم كله. 💫
            </h2>

            <div className="flex items-center justify-center gap-3 w-full my-2">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent flex-1" />
              <div className="w-2 h-2 rotate-45 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent flex-1" />
            </div>

            <p 
              className="text-amber-200/80 text-sm md:text-base max-w-md leading-relaxed" 
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              شكراً لأنكِ النجمة الثابتة في سمائي. دمتِ لي عمراً دافئاً لا ينتهي.
            </p>

            <button 
              onClick={() => {
                setShowGrandFinale(false);
                setSpreadIndex(0);
                setTypingPhase('right');
                onRestart();
              }}
              className="mt-4 px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black text-base font-extrabold border border-amber-300 hover:from-amber-400 hover:to-amber-300 transition-all active:scale-95 shadow-[0_0_35px_rgba(251,191,36,0.6)]"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              🔄 إعادة قراءة كتاب الحب
            </button>
          </div>
        </div>
      )}

      {/* Styled Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;600;700;900&display=swap');

        /* User Requested Realistic Paper Flip Keyframes */
        @keyframes realisticPaperTurn {
          0% {
            transform: rotateY(0deg);
          }
          30% {
            transform: rotateY(30deg) rotateX(5deg);
            filter: drop-shadow(20px 10px 20px rgba(0,0,0,0.35));
          }
          70% {
            transform: rotateY(150deg) rotateX(3deg);
            filter: drop-shadow(10px 5px 15px rgba(0,0,0,0.3));
          }
          100% {
            transform: rotateY(180deg);
            filter: none;
          }
        }

        /* Paper Glaze Dynamic Sheen Curve */
        @keyframes paperGlazeSheen {
          0% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 0.5; transform: translateX(0%); }
          100% { opacity: 0; transform: translateX(100%); }
        }

        .animate-paperGlazeSheen {
          animation: paperGlazeSheen 0.8s ease-in-out forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
