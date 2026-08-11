'use client';

import React, { useState } from 'react';
import { Sparkles, User, RotateCw, Check, Music } from 'lucide-react';
import {
  CharacterCanvas,
  CHARACTER_LIST,
  CharacterItem,
  ANIMATION_LIST,
  AnimationItem,
} from '@/components/3d/CharacterCanvas';

export const CharacterViewerSection: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterItem>(CHARACTER_LIST[0]);
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationItem>(ANIMATION_LIST[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="w-full py-8 px-4 flex flex-col items-center space-y-6 animate-fade-in relative z-10">
      {/* Section Header Banner */}
      <div className="text-center space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-gold text-xs text-cosmic-gold font-extrabold shadow-lg">
          <Sparkles className="w-4 h-4 text-cosmic-gold animate-pulse" /> معرض الشخصيات والرقصات الثلاثية الأبعاد 🤖
        </div>
        <h2 className="text-2xl font-extrabold text-white title-glow">
          اختر شخصيتك والرقصة المفضلة 🌟
        </h2>
        <p className="text-xs text-white/70 font-medium">
          يمكنك اختيار أي شخصية وتطبيق أي حركة أو رقصة فضاء عليها مع التدوير 360 درجة
        </p>
      </div>

      {/* 3D Character Canvas Container */}
      <div className="w-full max-w-md relative">
        <CharacterCanvas
          selectedCharacter={selectedCharacter}
          selectedAnimation={selectedAnimation}
          autoRotate={autoRotate}
          onLoadingChange={setIsLoading}
        />

        {/* Floating Controls Bar */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-full border backdrop-blur-md transition-all flex items-center justify-center ${
              autoRotate
                ? 'bg-cosmic-gold/20 border-cosmic-gold text-cosmic-gold shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                : 'bg-cosmic-bg/60 border-white/20 text-white/70 hover:text-white'
            }`}
            title={autoRotate ? 'إيقاف الدوران التلقائي' : 'تشغيل الدوران التلقائي'}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>
        </div>
      </div>

      {/* Animation Selection Panel */}
      <div className="w-full max-w-md glass-panel-gold rounded-3xl p-4 border border-cosmic-gold/40 shadow-[0_0_30px_rgba(255,215,0,0.15)] space-y-3">
        <div className="flex items-center justify-between border-b border-cosmic-gold/20 pb-2.5">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-cosmic-gold" />
            <span className="text-sm font-bold text-white">اختر حركية الرقص (4 رقصات)</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cosmic-gold/20 text-cosmic-gold border border-cosmic-gold/40">
            {selectedAnimation.name}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ANIMATION_LIST.map((anim) => {
            const isSelected = selectedAnimation.id === anim.id;

            return (
              <button
                key={anim.id}
                onClick={() => setSelectedAnimation(anim)}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between text-xs font-bold ${
                  isSelected
                    ? 'bg-gradient-to-r from-cosmic-rosegold/40 to-cosmic-gold/30 border-cosmic-gold text-cosmic-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                    : 'bg-cosmic-bg/40 border-white/10 text-white/80 hover:border-cosmic-gold/50 hover:text-white'
                }`}
              >
                <span className="truncate">{anim.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-cosmic-gold ml-1 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Character Selection Grid Panel */}
      <div className="w-full max-w-md glass-panel-gold rounded-3xl p-5 border border-cosmic-gold/40 shadow-[0_0_40px_rgba(255,215,0,0.15)] space-y-4">
        <div className="flex items-center justify-between border-b border-cosmic-gold/20 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cosmic-gold" />
            <span className="text-sm font-bold text-white">قائمة الشخصيات (14 شخصية)</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cosmic-gold/20 text-cosmic-gold border border-cosmic-gold/40">
            {selectedCharacter.name}
          </span>
        </div>

        {/* Scrollable Character Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          {CHARACTER_LIST.map((char) => {
            const isSelected = selectedCharacter.id === char.id;

            return (
              <button
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                disabled={isLoading && isSelected}
                className={`group relative p-3 rounded-2xl border text-right transition-all flex flex-col justify-between h-20 ${
                  isSelected
                    ? 'bg-gradient-to-br from-cosmic-rosegold/30 to-cosmic-gold/20 border-cosmic-gold shadow-[0_0_20px_rgba(255,215,0,0.3)] scale-[1.02]'
                    : 'bg-cosmic-bg/40 border-white/10 hover:border-cosmic-gold/50 hover:bg-cosmic-bg/70'
                }`}
              >
                {/* Active Check Mark */}
                {isSelected && (
                  <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-cosmic-gold text-cosmic-bg flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="w-8 h-8 rounded-full bg-cosmic-rosegold/20 border border-cosmic-gold/30 flex items-center justify-center text-cosmic-gold mb-1 group-hover:scale-110 transition-transform">
                  <User className="w-4 h-4" />
                </div>

                <div className="truncate">
                  <span className={`text-xs font-bold block truncate ${isSelected ? 'text-cosmic-gold' : 'text-white/90'}`}>
                    {char.name}
                  </span>
                  <span className="text-[10px] text-white/50 block truncate font-mono">
                    {char.file}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
