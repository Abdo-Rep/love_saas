'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export const AntiScreenshot: React.FC = () => {
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key or Cmd/Ctrl + Shift + S / P
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === 'I' || e.key === 'i')) ||
        (e.metaKey && e.shiftKey && (e.key === '4' || e.key === '3'))
      ) {
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 4000);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('');
        }
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 4000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!isProtected) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-[#0a0a1af2] backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold flex items-center justify-center mb-6 animate-pulse">
        <ShieldAlert className="w-10 h-10 text-cosmic-gold" />
      </div>
      <h2 className="text-2xl font-bold text-cosmic-gold mb-3">الذكريات دي مش للشاشة..</h2>
      <p className="text-xl text-white font-medium max-w-sm leading-relaxed typewriter-glow">
        هي للقلب ✨❤️
      </p>
    </div>
  );
};
