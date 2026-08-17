'use client';

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { Play, Pause, Music2 } from 'lucide-react';
import { bgMusic } from '@/lib/bgMusic';

interface Props {
  currentStep: number;
}

export const BackgroundMusicPlayer: React.FC<Props> = ({ currentStep }) => {
  const { config } = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reconstruct full base64 from chunks if needed
  const getFullSongUrl = () => {
    if (!config.storySongUrl) return '';
    if (!config.storySongPart2) return config.storySongUrl;
    // Combine all parts
    return config.storySongUrl + (config.storySongPart2 || '') + (config.storySongPart3 || '');
  };

  useEffect(() => {
    const songUrl = getFullSongUrl();
    if (!songUrl) return;

    bgMusic.setTrack(songUrl);

    const unsubState = bgMusic.subscribeState((playing) => {
      setIsPlaying(playing);
    });

    const unsubTime = bgMusic.subscribeTime((curr, dur) => {
      setCurrentTime(curr);
      setDuration(dur);
    });

    // Auto-play as soon as Step 3 is reached (except Step 7 voice recording)
    if (currentStep >= 3 && currentStep !== 7) {
      bgMusic.play(songUrl);
    }

    return () => {
      unsubState();
      unsubTime();
    };
  }, [config.storySongUrl, config.storySongPart2, config.storySongPart3, currentStep]);

  // Only render UI starting from Step 3 (Constellation) onwards, and HIDE during Step 7 (Voice)!
  if (!config.storySongUrl || currentStep < 3 || currentStep === 7) return null;

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
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-slide-up select-none">
      <div className="relative rounded-full p-[1.5px] bg-gradient-to-r from-rose-500/70 via-pink-500/50 to-amber-400/70 shadow-[0_10px_40px_rgba(244,63,94,0.45)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-[#12020e]/95 border border-pink-500/30 text-white">
          
          {/* LEFT: AUDIO EQUALIZER BARS */}
          <div className="flex items-center gap-1 shrink-0 pl-1">
            {[45, 85, 60, 100, 70].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-gradient-to-t from-rose-500 to-amber-300 transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(8, (h * 18) / 100)}px` : '5px',
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>

          {/* CENTER: TITLE & REAL-TIME PROGRESS BAR */}
          <div className="flex-1 flex flex-col justify-center gap-1 min-w-0 px-1">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[11px] sm:text-xs font-black text-amber-200 truncate dir-rtl text-right"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                أغنيتنا المفضلة.. بتعبر عن احساسي ليكي 🎵❤️
              </span>
            </div>

            {/* PROGRESS BAR SLIDER */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-[10px] font-mono text-pink-200/70 shrink-0">
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
                  className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer accent-amber-300 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #f43f5e 0%, #fb7185 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%, rgba(255,255,255,0.15) 100%)`
                  }}
                />
              </div>

              <span className="text-[10px] font-mono text-pink-200/70 shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT: CIRCULAR PLAY / PAUSE BUTTON */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-white shadow-[0_0_25px_rgba(244,63,94,0.7)] shrink-0 cursor-pointer border-2 border-white/50"
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
