'use client';

import React from 'react';

export const SubtleWatermark: React.FC = () => {
  return (
    <div className="fixed bottom-1.5 right-3 z-30 pointer-events-none opacity-25 select-none hidden sm:block">
      <span className="text-[10px] font-light text-pink-200/50 tracking-widest" style={{ fontFamily: "'Cairo', sans-serif" }}>
        مصمم بكل الحب والملكية ❤️
      </span>
    </div>
  );
};
