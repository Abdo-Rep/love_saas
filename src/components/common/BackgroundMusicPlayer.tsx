'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useConfig } from '@/lib/configContext';
import { Play, Pause, Music, Heart, Sparkles } from 'lucide-react';
import { bgMusic } from '@/lib/bgMusic';

interface Props {
  currentStep: number;
}

export const BackgroundMusicPlayer: React.FC<Props> = ({ currentStep }) => {
  const { config } = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (config.storySongUrl) {
      bgMusic.setTrack(config.storySongUrl);
    }

    const unsubState = bgMusic.subscribeState((playing) => {
      setIsPlaying(playing);
    });

    const unsubTime = bgMusic.subscribeTime((curr, dur) => {
      setCurrentTime(curr);
      setDuration(dur);
    });

    return () => {
      unsubState();
      unsubTime();
    };
  }, [config.storySongUrl]);

  if (!config.storySongUrl || currentStep <= 1) return null;

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePlay = () => {
    bgMusic.toggle();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    bgMusic.seek(val);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md animate-fade-in select-none">
      <div className="relative rounded-full p-[1px] bg-gradient-to-r from-rose-500/60 via-pink-500/40 to-amber-400/60 shadow-[0_4px_30px_rgba(244,63,94,0.4)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-[#12020e]/90 border border-pink-500/30 text-white">
          
          {/* LEFT: MUSIC ICON & NOTE */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 to-rose-700 flex items-center justify-center shadow-md ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
              <Music className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* CENTER: ROMANTIC TITLE & REAL-TIME PROGRESS BAR */}
          <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[11px] sm:text-xs font-black text-amber-200 truncate dir-rtl text-right"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                أغنيتنا المفضلة.. بحبها احنا الاتنين ودايماً بتعبر عن احساسي ليكي 🎵❤️
              </span>
            </div>

            {/* PROGRESS BAR SLIDER */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-[9px] font-mono text-pink-200/60 shrink-0">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 flex items-center h-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-400 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #f43f5e 0%, #fb7185 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%, rgba(255,255,255,0.15) 100%)`
                  }}
                />
              </div>

              <span className="text-[9px] font-mono text-pink-200/60 shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT: CIRCULAR PLAY / PAUSE BUTTON */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] shrink-0 cursor-pointer border border-white/40"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white text-white" />
            ) : (
              <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
