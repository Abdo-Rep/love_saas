'use client';

import React from 'react';

export const SubtleWatermark: React.FC = () => {
  return (
    <div className="fixed bottom-3 right-4 z-40 pointer-events-none opacity-30 select-none">
      <span className="text-[11px] font-light text-pink-200/50 tracking-widest" style={{ fontFamily: "'Cairo', sans-serif" }}>
        مصمم بكل الحب والملكية ❤️
      </span>
    </div>
  );
};
