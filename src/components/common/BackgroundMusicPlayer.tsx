'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface Props {
  currentStep: number;
}

export const BackgroundMusicPlayer: React.FC<Props> = ({ currentStep }) => {
  const { config } = useConfig();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!config.storySongUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(config.storySongUrl);
      audio.loop = true;
      audio.volume = 0.8;
      audioRef.current = audio;
    } else if (audioRef.current.src !== config.storySongUrl) {
      audioRef.current.src = config.storySongUrl;
    }

    // Auto-start music from step 2 (theater text / constellation onwards)
    if (currentStep >= 3 && !hasStarted) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(() => {
          // Autoplay blocked: wait for first interaction
          const handleFirstClick = () => {
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                setIsPlaying(true);
                setHasStarted(true);
              }).catch(() => {});
            }
            window.removeEventListener('click', handleFirstClick);
            window.removeEventListener('touchstart', handleFirstClick);
          };
          window.addEventListener('click', handleFirstClick);
          window.addEventListener('touchstart', handleFirstClick);
        });
    }

    return () => {
      // Don't kill audio on step transitions, keep it persistent!
    };
  }, [config.storySongUrl, currentStep, hasStarted]);

  if (!config.storySongUrl || currentStep <= 1) return null;

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={toggleAudio}
        className="w-10 h-10 rounded-full bg-black/65 border border-pink-400/40 text-pink-300 backdrop-blur-xl shadow-[0_0_20px_rgba(244,114,182,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        title={isPlaying ? 'كتم الصوت 🔇' : 'تشغيل الأغنية 🎵'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-rose-400" />
        )}
      </button>
    </div>
  );
};
