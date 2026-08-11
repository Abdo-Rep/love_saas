'use client';

import React from 'react';
import { useConfig } from '@/lib/configContext';

export const SubtleWatermark: React.FC = () => {
  const { config } = useConfig();
  if (!config.herName) return null;

  return (
    <a
      href="/super-admin"
      title="السوبر أدمن 👑"
      className="fixed bottom-3 right-4 z-40 pointer-events-auto opacity-30 hover:opacity-100 transition-all cursor-pointer flex items-center gap-1 select-none"
    >
      <span className="text-xs font-light text-cosmic-rosegold tracking-widest typewriter-glow flex items-center gap-1">
        ✨ {config.herName} <span className="hover:scale-125 transition-transform">👑</span>
      </span>
    </a>
  );
};
