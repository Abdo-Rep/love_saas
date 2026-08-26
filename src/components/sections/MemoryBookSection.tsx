'use client';

import React, { useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { BookOpen, ChevronRight, ChevronLeft, Heart } from 'lucide-react';

export const MemoryBookSection: React.FC = () => {
  const { config } = useConfig();
  const pages = config.memoryPages || [];
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const activePage = pages[currentPageIndex] || pages[0];

  const handleNext = () => {
    setCurrentPageIndex((prev) => (prev + 1) % pages.length);
  };

  const handlePrev = () => {
    setCurrentPageIndex((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <section className="w-full py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs text-cosmic-gold font-bold px-3 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold">
            📖 كتاب الذكريات
          </span>
          <h3 className="text-2xl font-bold text-white">صفحات محفورة في القلب</h3>
        </div>

        {/* 3D Flip Book Card */}
        <div className="relative w-full aspect-[4/5] perspective-1000">
          <div className="w-full h-full glass-panel-gold rounded-3xl p-6 border-2 border-cosmic-gold/50 shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-500 transform hover:scale-[1.02]">
            {/* Header / Page count */}
            <div className="w-full flex items-center justify-between border-b border-cosmic-gold/20 pb-3">
              <span className="text-xs text-cosmic-gold font-bold flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> صفحة #{currentPageIndex + 1}
              </span>
              {activePage?.date && (
                <span className="text-xs text-cosmic-rosegold font-semibold">
                  {activePage.date}
                </span>
              )}
            </div>

            {/* Image Container */}
            <div className="w-full h-56 rounded-2xl overflow-hidden border border-cosmic-rosegold/40 my-3 relative shadow-inner">
              <img
                src={activePage?.imageUrl}
                alt={activePage?.title}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent opacity-60" />
            </div>

            {/* Description & Title */}
            <div className="space-y-2 my-auto">
              <h4 className="text-lg font-bold text-cosmic-gold">{activePage?.title}</h4>
              <p className="text-xs md:text-sm text-white leading-relaxed font-medium">
                "{activePage?.description}"
              </p>
            </div>

            {/* Navigation footer */}
            <div className="w-full flex items-center justify-between border-t border-cosmic-gold/20 pt-3">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-cosmic-deep border border-cosmic-gold/40 text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-bg transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <span className="text-[11px] text-cosmic-rosegold font-medium">
                {currentPageIndex + 1} من {pages.length}
              </span>

              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-cosmic-deep border border-cosmic-gold/40 text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-bg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
