'use client';

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { Volume2, VolumeX } from 'lucide-react';
import { bgMusic } from '@/lib/bgMusic';

interface Props {
  currentStep: number;
}

export const BackgroundMusicPlayer: React.FC<Props> = ({ currentStep }) => {
  const { config } = useConfig();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (config.storySongUrl) {
      bgMusic.setTrack(config.storySongUrl);
    }
    const unsubscribe = bgMusic.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsubscribe();
    };
  }, [config.storySongUrl]);

  if (!config.storySongUrl || currentStep <= 1) return null;

  const toggleAudio = () => {
    bgMusic.toggle();
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
