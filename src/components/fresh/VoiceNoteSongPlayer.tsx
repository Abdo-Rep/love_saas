'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Music, Play, Pause, Volume2, ArrowLeft, Disc, Heart, Radio } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const LYRICS = [
  '🎵 "دورت في كل مكان ورجعت عشانك.. إنتي مش واحدة من بنات العالم، إنتي العالم كله." 💖',
  '🎶 "ابتسامتك هي النور اللي بينور عتمة أيامي.. ونظرة عيونك دوا لقلبي." ✨',
  '🎵 "بنات العالم كلهم في كفة.. وإنتي في كفة تانية لوحدك يا ملكتي." 👑',
  '🎶 "مكانك في قلبي محفور للأبد.. وعهد ووعد مش هينتهي طول العمر." 💍'
];

export const VoiceNoteSongPlayer: React.FC<Props> = ({ onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthCleanupRef = useRef<(() => void) | null>(null);

  // Cycle Lyric Ticker when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentLyricIndex((prev) => (prev + 1) % LYRICS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Web Audio Synthesizer Romantic Song Loop
  const startRomanticSynthMusic = () => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23]  // G7
      ];

      let chordIdx = 0;
      const playBeat = () => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;
        const currentChord = chords[chordIdx];

        currentChord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.035, now + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(900, now);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 3.2);
        });

        chordIdx = (chordIdx + 1) % chords.length;
      };

      playBeat();
      const timer = setInterval(playBeat, 3500);

      synthCleanupRef.current = () => {
        clearInterval(timer);
      };
    } catch (_) {}
  };

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      startRomanticSynthMusic();
    } else {
      setIsPlaying(false);
      if (synthCleanupRef.current) {
        synthCleanupRef.current();
        synthCleanupRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (synthCleanupRef.current) synthCleanupRef.current();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#07020d] text-white flex flex-col justify-between p-4 md:p-8 select-none overflow-x-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.18)_0%,_rgba(236,72,153,0.15)_45%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-500/30 backdrop-blur-md self-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Music className="w-4 h-4 text-amber-400" />
          <span className="text-xs md:text-sm font-bold text-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            مشغل الأغنية والرسالة الصوتية الملكية 🎵🎙️
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-pink-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
          أنغام سُجلت بقلبي لأجلكِ
        </h1>
      </div>

      {/* VINYL DISC AUDIO PLAYER CARD */}
      <div className="relative z-20 max-w-lg mx-auto w-full my-6 flex flex-col items-center">
        <div className="w-full bg-gradient-to-b from-[#1c0a26] via-[#12051c] to-black border-2 border-amber-500/50 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] backdrop-blur-2xl flex flex-col items-center gap-6">
          
          {/* SPINNING VINYL DISC */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-black via-[#1a1a1a] to-black border-4 border-amber-500/60 p-2 shadow-2xl flex items-center justify-center">
            
            {/* Vinyl Record Tracks */}
            <div
              className={`w-full h-full rounded-full bg-[radial-gradient(circle_at_center,_#262626_0%,_#0a0a0a_70%)] border border-amber-400/30 flex items-center justify-center transition-transform duration-1000 ${
                isPlaying ? 'animate-spin [animation-duration:6s]' : ''
              }`}
            >
              {/* Record Label Core */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex flex-col items-center justify-center p-1 shadow-inner border border-amber-300">
                <Disc className="w-6 h-6 text-white" />
                <span className="text-[9px] font-bold text-white tracking-widest uppercase">Love Track</span>
              </div>
            </div>

            {/* Glowing Arm Needle */}
            <div
              className={`absolute top-2 right-4 w-12 h-20 origin-top-right transition-transform duration-500 ${
                isPlaying ? 'rotate-12' : '-rotate-12'
              }`}
            >
              <div className="w-2 h-16 bg-amber-400/80 rounded-full shadow-[0_0_10px_#f59e0b]" />
            </div>
          </div>

          {/* EQUALIZER WAVEFORM VISUALIZER */}
          <div className="flex items-center gap-1.5 h-8 my-1">
            {[40, 75, 55, 90, 60, 85, 45, 100, 65, 80, 50].map((h, idx) => (
              <div
                key={idx}
                className={`w-1.5 rounded-full bg-gradient-to-t from-amber-500 to-rose-500 transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'h-2 opacity-30'
                }`}
                style={{ height: isPlaying ? `${h}%` : '8px' }}
              />
            ))}
          </div>

          {/* PLAY / PAUSE BUTTON */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 text-black flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-110 active:scale-95 transition-all border border-amber-200"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black ml-1" />}
          </button>

          {/* LIVE LYRICS / MESSAGE TICKER */}
          <div className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-center min-h-[70px] flex items-center justify-center">
            <p
              className="text-amber-200 text-sm md:text-base font-bold leading-relaxed transition-all duration-500"
              style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}
            >
              {isPlaying ? LYRICS[currentLyricIndex] : 'اضغطي على زر التشغيل لبدء عزف رسالتنا الخاصة 💖'}
            </p>
          </div>

        </div>
      </div>

      {/* FOOTER ACTION BUTTON */}
      <div className="relative z-20 max-w-md mx-auto w-full pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-black font-extrabold text-sm md:text-base border border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>افتحي صندوق الوعد والخاتم الملكي.. 🗝️</span>
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
      </div>
    </div>
  );
};
