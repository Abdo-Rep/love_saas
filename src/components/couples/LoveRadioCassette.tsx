'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, ArrowRight } from 'lucide-react';
import { useConfig } from '@/lib/configContext';
import { bgMusic } from '@/lib/bgMusic';
import { getPlayableAudioUrl } from '@/lib/getPlayableAudioUrl';

interface Props {
  onNext: () => void;
}

export const LoveRadioCassette: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const voiceUrl = config.voiceAudioUrl || '/sound/WhatsApp Video 2026-08-11 at 3.56.53 AM.mp4';
  const playableVoiceUrl = getPlayableAudioUrl(voiceUrl);

  // Auto-pause background music on mount and handle cleanup
  useEffect(() => {
    // 1. Pause background music while on the voice note page
    bgMusic.pause(false);

    return () => {
      // Pause voice audio if playing when leaving the component
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // 2. Resume background music when leaving the voice note page
      if (config.storySongUrl) {
        bgMusic.play(config.storySongUrl, false);
      }
    };
  }, [config.storySongUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNextClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (config.storySongUrl) {
      bgMusic.play(config.storySongUrl, false);
    }
    onNext();
  };

  const title = config.voiceMessageTitle || 'كلمات بصوتي طالعة من قلبي لأجلكِ';
  const subtitle = config.voiceMessageSubtitle || 'استمعي للرسالة الصوتية الخاصة بكِ مع أعذب مشاعر الحب 🎙️❤️';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between py-12 px-4 relative z-10 text-white dir-rtl">
      {/* Hidden HTML Audio Element */}
      <audio
        ref={audioRef}
        src={playableVoiceUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* TOP TITLE HEADER */}
      <div className="text-center space-y-3 max-w-xl animate-fadeIn pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-xs font-bold shadow-[0_0_15px_rgba(244,114,182,0.2)]">
          <Mic className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>رسالة صوتية مخصصة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-rose-300">
          {title}
        </h2>
      </div>

      {/* MAIN SINGLE VOICE PLAYER CARD */}
      <div className="w-full max-w-lg my-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#2a0720]/90 to-[#0e020c]/90 border-2 border-pink-400/40 backdrop-blur-xl shadow-[0_0_50px_rgba(244,63,94,0.25)] space-y-6 text-center animate-scaleUp">
        
        {/* VINYL / CASSETTE DISK ANIMATED GRAPHIC */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 opacity-20 blur-xl ${isPlaying ? 'animate-pulse' : ''}`} />
          
          <div className={`w-36 h-36 rounded-full border-4 border-pink-400/50 bg-black/80 flex items-center justify-center shadow-2xl relative overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
            {/* Inner Vinyl Rings */}
            <div className="w-28 h-28 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 border-2 border-amber-300 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VOICE TEXT CONTENT */}
        <div className="p-4 rounded-2xl bg-black/50 border border-pink-400/20 text-right space-y-2">
          <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-medium whitespace-pre-wrap">
            {subtitle}
          </p>
        </div>

        {/* AUDIO CONTROLS & PROGRESS */}
        <div className="space-y-4 pt-2">
          {/* PLAY / PAUSE BUTTON */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/40"
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
          </div>

          {/* PROGRESS BAR & TIMINGS */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 rounded-lg bg-white/10 appearance-none cursor-pointer accent-pink-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-pink-200/70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEXT BUTTON */}
      <div className="w-full max-w-md pt-4">
        <button
          onClick={handleNextClick}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm border border-white/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{config.voiceButtonText || 'التالي: أمنيات المستقبل 🗺️✨'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
};
