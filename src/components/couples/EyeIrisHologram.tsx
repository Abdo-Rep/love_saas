'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Eye, Heart, RefreshCw, ShieldCheck, Crown, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onRestart: () => void;
}

export const EyeIrisHologram: React.FC<Props> = ({ onRestart }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = () => {
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

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440.0, now);
      osc.frequency.exponentialRampToValueAtTime(1320.0, now + 0.8);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch (_) {}
  };

  const handleStartScan = () => {
    setIsScanning(true);
    playChime();

    setTimeout(() => {
      setIsScanning(false);
      setIsScanned(true);

      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#00f0ff', '#ff4d6d', '#ffd700', '#ffffff']
        });
      } catch (_) {}
    }, 2000);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#04010a] text-white flex flex-col justify-between p-4 md:p-8 select-none overflow-hidden text-center">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.18)_0%,_rgba(244,63,94,0.12)_45%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 backdrop-blur-md self-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs md:text-sm font-bold text-cyan-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            ماسح بصمة العين والهولوغرام الكوني 👁️🔮
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-rose-300 to-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
          بصمة النظرة الخالدة
        </h1>
      </div>

      {/* BIOMETRIC SCANNER CONTAINER */}
      <div className="relative z-20 max-w-xl w-full mx-auto my-auto">
        {!isScanned ? (
          /* SCANNER DISPLAY */
          <div
            onClick={handleStartScan}
            className={`group cursor-pointer relative w-full rounded-3xl bg-gradient-to-br from-[#061e2e] via-[#09111c] to-black border-2 border-cyan-400/70 p-8 flex flex-col items-center justify-center gap-6 shadow-[0_0_60px_rgba(0,240,255,0.3)] backdrop-blur-2xl transition-all duration-500 hover:scale-105 ${
              isScanning ? 'animate-pulse border-cyan-300' : ''
            }`}
          >
            {/* Hologram Scanner Reticle */}
            <div className="relative w-32 h-32 rounded-full border-4 border-cyan-400/80 p-2 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.5)]">
              {/* Laser Scan Beam */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-cyan-300 shadow-[0_0_15px_#00f0ff] animate-ping pointer-events-none" />
              )}
              
              <div className="w-full h-full rounded-full bg-cyan-950/40 border border-cyan-300/40 flex items-center justify-center">
                <Eye className={`w-14 h-14 text-cyan-300 ${isScanning ? 'animate-spin' : 'animate-pulse'}`} />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-cyan-300 font-extrabold text-lg md:text-xl" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {isScanning ? 'جاري فحص بصمة العيون الكونية... ⚡' : 'اضغطي لبدء فحص بصمة عينيكي 👁️✨'}
              </span>
              <p className="text-xs text-cyan-200/60 font-medium" style={{ fontFamily: "'Cairo', sans-serif" }}>
                النظام البيومتري للقلب بانتظار نظرتك
              </p>
            </div>
          </div>
        ) : (
          /* REVEALED 3D HOLOGRAPHIC DECLARATION */
          <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#0a2538] via-[#0b1522] to-black border-2 border-cyan-400/80 p-6 md:p-10 text-center shadow-[0_0_80px_rgba(0,240,255,0.5)] backdrop-blur-2xl flex flex-col items-center gap-6 animate-fadeIn">
            
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-rose-500 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.6)]">
              <Crown className="w-8 h-8 text-white" />
            </div>

            <div className="flex flex-col gap-3 text-right w-full" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <span className="text-cyan-300 text-xs font-extrabold text-center">
                نتيجة الفحص البيومتري: التطابق 100% 💖
              </span>
              
              <h2 className="text-xl md:text-2xl font-black text-white text-center" style={{ fontFamily: "'Amiri', 'Cairo', serif" }}>
                "عينيكي هما المكان الوحيد اللي بلاقي فيه روحي وسري وسعادتي."
              </h2>

              <p className="text-cyan-100/90 text-sm md:text-base leading-relaxed text-center font-bold pt-2 border-t border-cyan-500/30">
                بنات العالم كلهم في كفة.. ونظرة منك أنتي في كفة تانية لوحدك لأنك أميرة قلبي والعالم كله 👑✨
              </p>
            </div>

            {/* Restart Button */}
            <button
              onClick={onRestart}
              className="mt-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-rose-500 to-amber-500 text-black font-extrabold text-xs md:text-sm border border-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <RefreshCw className="w-4 h-4 text-black" />
              <span>إعادة قراءة رحلة العشق من البداية 🔄</span>
            </button>

          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="relative z-20 pb-4 text-xs text-cyan-200/50 font-medium">
        رحلة عشقنا الأبدیة • دمتِ لي عمراً دافئاً لا ينتهي ✨
      </div>
    </div>
  );
};
