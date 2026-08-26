'use client';

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { WarpParticlesCanvas } from '../3d/WarpParticlesCanvas';
import { Sparkles, FastForward } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Step3SpaceWarp: React.FC<Props> = ({ onComplete }) => {
  const { config } = useConfig();
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [typedText, setTypedText] = useState('');

  const sentences = config.travelSentences || [];
  const currentSentence = sentences[sentenceIndex] || { text: 'نعبر الفضاء والزمان برحلتنا الكونية...', duration: 4 };

  useEffect(() => {
    if (!currentSentence) return;

    setTypedText('');
    let idx = 0;
    const fullText = currentSentence.text;

    const timer = setInterval(() => {
      if (idx < fullText.length) {
        setTypedText(fullText.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
        // Wait for configured duration, then move to next sentence
        setTimeout(() => {
          if (sentenceIndex < sentences.length - 1) {
            setSentenceIndex((prev) => prev + 1);
          } else {
            onComplete();
          }
        }, currentSentence.duration * 1000);
      }
    }, 60);

    return () => clearInterval(timer);
  }, [sentenceIndex, sentences, currentSentence, onComplete]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-[#0a0a1a]">
      {/* 3D Warp Hyperdrive Background */}
      <WarpParticlesCanvas />

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-6 left-6 z-20 px-4 py-2 rounded-full bg-cosmic-deep/80 border border-cosmic-rosegold/40 text-xs text-cosmic-gold flex items-center gap-1.5 backdrop-blur-md hover:bg-cosmic-rosegold/20 transition"
      >
        <FastForward className="w-4 h-4" /> تخطي السفر
      </button>

      {/* Center Typed Sentence */}
      <div className="z-10 max-w-lg w-full">
        <div className="glass-panel-gold rounded-3xl p-8 border border-cosmic-gold/50 shadow-2xl backdrop-blur-xl animate-pulse-slow">
          <Sparkles className="w-8 h-8 text-cosmic-gold mx-auto mb-4 animate-spin" style={{ animationDuration: '8s' }} />
          <p className="text-xl md:text-3xl font-bold text-white leading-relaxed typewriter-glow min-h-[5rem] flex items-center justify-center">
            "{typedText}"
          </p>
          <div className="mt-6 flex justify-center gap-1.5">
            {sentences.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === sentenceIndex ? 'w-8 bg-cosmic-gold' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
