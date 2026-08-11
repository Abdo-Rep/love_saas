'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const GlobalBackButton: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={onBack}
        className="px-3.5 py-2 rounded-full bg-black/70 border border-pink-400/40 text-amber-300 backdrop-blur-xl shadow-[0_0_20px_rgba(244,114,182,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
        style={{ fontFamily: "'Cairo', sans-serif" }}
        title="الرجوع للخطوة السابقة"
      >
        <ArrowLeft className="w-4 h-4 text-pink-400" />
        <span>رجوع ↩️</span>
      </button>
    </div>
  );
};
