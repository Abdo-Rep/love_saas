'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const GlobalBackButton: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full bg-black/60 border border-pink-400/40 text-pink-300 backdrop-blur-xl shadow-[0_0_20px_rgba(244,114,182,0.3)] hover:scale-110 active:scale-90 hover:border-pink-300 hover:text-white transition-all flex items-center justify-center cursor-pointer"
        title="رجوع للخلف"
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};
