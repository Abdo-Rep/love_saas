'use client';

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react';
import { bgMusic } from '@/lib/bgMusic';
import { getPlayableAudioUrl } from '@/lib/getPlayableAudioUrl';

interface Props {
  currentStep: number;
}

export const BackgroundMusicPlayer: React.FC<Props> = ({ currentStep }) => {
  const { config } = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reconstruct full url or convert to HTTPS proxy URL
  const getFullSongUrl = () => {
    if (!config.storySongUrl && !config.music_src) return '';
    const rawUrl = config.storySongUrl || config.music_src || '';
    if (config.storySongPart2) {
      return getPlayableAudioUrl(rawUrl + (config.storySongPart2 || '') + (config.storySongPart3 || ''));
    }
    return getPlayableAudioUrl(rawUrl);
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

    // Auto-play when Step 2 or later is reached (except Step 6 live voice recording step)
    if (currentStep >= 2 && currentStep !== 6) {
      bgMusic.play(songUrl);
    } else {
      bgMusic.pause(false);
    }

    return () => {
      unsubState();
      unsubTime();
    };
  }, [config.storySongUrl, config.storySongPart2, config.storySongPart3, currentStep]);

  // Only render UI starting from Step 2 onwards if a song exists!
  const songUrl = getFullSongUrl();
  if (!songUrl || currentStep < 2 || currentStep === 6) return null;

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
    <>
      {/* FLOATING TOP-LEFT MUSIC BUTTON (EXACTLY OPPOSITE TO GLOBAL BACK BUTTON) */}
      <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 pointer-events-auto flex items-center gap-2">
        <button
          onClick={togglePlay}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
            isPlaying
              ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.8)] border border-white/60 animate-pulse'
              : 'bg-black/75 border border-pink-400/50 text-pink-300 backdrop-blur-xl hover:scale-110 active:scale-90 hover:text-white'
          }`}
          title={isPlaying ? 'إيقاف الأغنية الرومانسية' : 'تشغيل الأغنية الرومانسية'}
        >
          <Music className={`w-4 h-4 sm:w-5 sm:h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>

        {/* SMALL TOGGLE TO SHOW DETAILED PLAYER BAR */}
        <button
          onClick={() => setShowFullPlayer(!showFullPlayer)}
          className="p-1.5 rounded-full bg-black/60 border border-pink-400/30 text-pink-200/80 hover:text-white backdrop-blur-md text-[10px] font-bold px-2.5 transition-all"
        >
          {showFullPlayer ? 'إخفاء ✕' : 'التحكم 🎵'}
        </button>
      </div>

      {/* EXPANDABLE DETAILED PLAYER BAR */}
      {showFullPlayer && (
        <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md animate-slide-up select-none pointer-events-auto">
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
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-white shadow-[0_0_25px_rgba(244,63,94,0.7)] shrink-0 cursor-pointer border-2 border-white/50"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-white text-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
