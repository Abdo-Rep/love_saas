'use client';

import React, { useState, useRef } from 'react';
import { Heart, Sparkles, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useConfig } from '@/lib/configContext';

interface Props {
  onNext: () => void;
}

export const HorizontalLoveGallery: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);

  const photos = config.memoryPhotos || [];

  const handleNext = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || startXRef.current === null) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset > 35) {
      handleNext();
    } else if (dragOffset < -35) {
      handlePrev();
    }
    setDragOffset(0);
    startXRef.current = null;
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER CONNECTED TO CONFIG */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-6">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {config.galleryTitle || 'ذكريات منقوشة في القلب والعقل ✨'}
        </h1>
        <p className="text-xs sm:text-sm text-pink-200/80 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
          اسحبي الكروت يميناً ويساراً لمشاهدة أجمل اللحظات 📸💖
        </p>
      </div>

      {/* REAL-TIME SWIPEABLE 3D CAROUSEL */}
      <div className="relative z-20 w-full max-w-4xl mx-auto my-4 h-[440px] sm:h-[490px] md:h-[520px] flex items-center justify-center overflow-visible px-2 sm:px-6">
        
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:left-4 z-40 p-2.5 sm:p-3 rounded-full bg-black/60 border border-pink-500/40 text-pink-200 backdrop-blur-md hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(244,114,182,0.4)] flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-1 sm:right-4 z-40 p-2.5 sm:p-3 rounded-full bg-black/60 border border-pink-500/40 text-pink-200 backdrop-blur-md hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(244,114,182,0.4)] flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Cards Deck */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full max-w-xs sm:max-w-sm md:max-w-md h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {photos.map((photo, idx) => {
            const count = photos.length;
            let offset = (idx - activeIndex + count) % count;
            if (offset > count / 2) offset -= count;

            const isCenter = offset === 0;
            const isPrev = offset === -1 || (offset === count - 1 && count === 2);
            const isNext = offset === 1 || (offset === -(count - 1) && count === 2);

            let transform = 'scale(0.7) translateX(0px)';
            let zIndex = 0;
            let opacity = 0;

            if (isCenter) {
              transform = `scale(1) translateX(${dragOffset}px)`;
              zIndex = 30;
              opacity = 1;
            } else if (isNext) {
              transform = `scale(0.85) translateX(70px) rotate(-4deg)`;
              zIndex = 20;
              opacity = 0.6;
            } else if (isPrev) {
              transform = `scale(0.85) translateX(-70px) rotate(4deg)`;
              zIndex = 20;
              opacity = 0.6;
            }

            return (
              <div
                key={photo.id || idx}
                style={{ transform, zIndex, opacity }}
                className="absolute inset-0 transition-transform duration-300 ease-out rounded-3xl bg-black/80 border border-pink-400/30 backdrop-blur-xl shadow-[0_0_35px_rgba(244,114,182,0.3)] overflow-hidden"
              >
                {/* Full Card Image */}
                <img
                  src={photo.image}
                  alt={photo.caption}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

                {/* Top Small Tag Badge */}
                {photo.tag && (
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 border border-pink-400/30 backdrop-blur-md text-[10px] font-bold text-pink-200 flex items-center gap-1 shadow-md"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    <span>{photo.tag}</span>
                  </div>
                )}

                {/* Small Minimal Caption & Date Overlay at Bottom */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex flex-col gap-1.5 text-center items-center">
                  {photo.date && (
                    <div
                      className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-pink-400/30 backdrop-blur-md text-[10px] font-bold text-amber-200 flex items-center gap-1"
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      <Calendar className="w-3 h-3 text-pink-300" />
                      <span>{photo.date}</span>
                    </div>
                  )}

                  <p
                    className="text-xs sm:text-sm font-bold text-pink-100/95 leading-snug max-w-xs"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {photo.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FOOTER BUTTON CONNECTED DIRECTLY TO CONFIG */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.galleryButtonText || 'التالي: رسالة بصوتي 🎙️❤️'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
