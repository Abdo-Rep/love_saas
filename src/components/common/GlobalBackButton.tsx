'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const GlobalBackButton: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 pointer-events-auto">
      <button
        onClick={onBack}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 border border-pink-400/50 text-pink-300 backdrop-blur-xl shadow-[0_0_20px_rgba(244,114,182,0.4)] hover:scale-110 active:scale-90 hover:border-pink-300 hover:text-white transition-all flex items-center justify-center cursor-pointer"
        title="رجوع للخلف"
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};
