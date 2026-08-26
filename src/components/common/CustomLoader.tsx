'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  text?: string;
}

export const CustomLoader: React.FC<Props> = ({ text = 'جاري سفر المجرة...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Glowing Planet Rings */}
        <div className="absolute inset-0 rounded-full border-2 border-cosmic-rosegold/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-cosmic-gold/50 animate-spin" style={{ animationDuration: '6s' }} />
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cosmic-rosegold via-cosmic-gold to-cosmic-deep shadow-[0_0_25px_#FFD700] flex items-center justify-center animate-pulse">
          <Sparkles className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '10s' }} />
        </div>
      </div>
      <p className="text-sm font-medium text-cosmic-gold tracking-wide animate-pulse">
        {text}
      </p>
    </div>
  );
};
