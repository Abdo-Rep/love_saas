'use client';

import React, { useState, useRef } from 'react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, LayoutGrid, Sliders, X, Maximize2 } from 'lucide-react';
import { useConfig } from '@/lib/configContext';

interface Props {
  onNext: () => void;
}

export const HorizontalLoveGallery: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  // Carousel swipe ref
  const startXRef = useRef<number | null>(null);
  // Modal touch swipe ref & state
  const modalStartXRef = useRef<number | null>(null);
  const [modalDragOffset, setModalDragOffset] = useState(0);

  const photos = config.memoryPhotos || [];

  const handleNext = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleModalNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length === 0) return;
    setSelectedPhotoIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleModalPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length === 0) return;
    setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
  };

  // Lightbox Touch/Swipe Handlers
  const handleModalTouchStart = (e: React.TouchEvent | React.PointerEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    modalStartXRef.current = clientX;
    setModalDragOffset(0);
  };

  const handleModalTouchMove = (e: React.TouchEvent | React.PointerEvent) => {
    if (modalStartXRef.current === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    const diff = clientX - modalStartXRef.current;
    setModalDragOffset(diff);
  };

  const handleModalTouchEnd = () => {
    if (modalStartXRef.current === null) return;
    if (modalDragOffset > 40) {
      handleModalPrev();
    } else if (modalDragOffset < -40) {
      handleModalNext();
    }
    modalStartXRef.current = null;
    setModalDragOffset(0);
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
      handlePrev();
    } else if (dragOffset < -35) {
      handleNext();
    }
    setDragOffset(0);
    startXRef.current = null;
  };

  const currentModalPhoto = selectedPhotoIndex !== null && photos[selectedPhotoIndex] ? photos[selectedPhotoIndex] : null;

  return (
    <div className="relative w-full min-h-[100dvh] bg-transparent text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Soft Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER CONNECTED TO CONFIG WITH CLEARANCE FOR BACK BUTTON */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-12 sm:pt-14 px-4 sm:px-16">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {config.galleryTitle || 'ذكريات منقوشة في القلب والعقل ✨'}
        </h1>
        <p className="text-xs sm:text-sm text-pink-200/80 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {viewMode === 'carousel' ? 'اسحبي الكروت يميناً ويساراً لمشاهدة أجمل اللحظات 📸💖' : 'استمتعي بجميع الذكريات في معرض الصور 🖼️✨'}
        </p>

        {/* TOGGLE VIEW MODE BUTTON */}
        <button
          type="button"
          onClick={() => setViewMode(prev => prev === 'carousel' ? 'grid' : 'carousel')}
          className="mt-2 px-4 py-2 rounded-full bg-black/60 border border-pink-400/40 backdrop-blur-md text-pink-200 text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(244,114,182,0.3)] flex items-center justify-center gap-2 mx-auto cursor-pointer"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {viewMode === 'carousel' ? (
            <>
              <LayoutGrid className="w-4 h-4 text-pink-300" />
              <span>تغيير العرض إلى معرض صور 🖼️</span>
            </>
          ) : (
            <>
              <Sliders className="w-4 h-4 text-amber-300" />
              <span>تغيير العرض إلى كروت متحركة 🎴</span>
            </>
          )}
        </button>
      </div>

      {/* 1. REAL-TIME SWIPEABLE 3D CAROUSEL VIEW */}
      {viewMode === 'carousel' ? (
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
      ) : (
        /* 2. GRID PHOTO GALLERY VIEW (EXACTLY 2 PER ROW WITH FRAMED BORDER SPACING) */
        <div className="relative z-20 w-full max-w-4xl mx-auto my-6 px-1.5 sm:px-4 dir-rtl">
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {photos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className="group relative rounded-2xl bg-black/70 border border-pink-400/30 backdrop-blur-xl overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(244,114,182,0.15)] hover:border-pink-400/60 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between p-1.5 sm:p-2.5"
              >
                <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden rounded-xl">
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity rounded-xl" />

                  {photo.tag && (
                    <span
                      className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 border border-pink-400/30 backdrop-blur-md text-[9px] sm:text-[10px] font-bold text-pink-200"
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      {photo.tag}
                    </span>
                  )}

                  <div className="absolute bottom-2 left-2 p-1.5 rounded-full bg-black/60 border border-pink-400/30 text-pink-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-2 sm:p-3 flex flex-col gap-1.5 text-center items-center">
                  {photo.date && (
                    <div
                      className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-pink-400/30 text-[9px] sm:text-[10px] font-bold text-amber-200 flex items-center gap-1"
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      <Calendar className="w-3 h-3 text-pink-300" />
                      <span>{photo.date}</span>
                    </div>
                  )}
                  <p
                    className="text-[11px] sm:text-xs font-bold text-pink-100/95 leading-relaxed line-clamp-2"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL PHOTO LIGHTBOX MODAL WITH TOUCH SWIPE & NAVIGATION ARROWS */}
      {currentModalPhoto && selectedPhotoIndex !== null && (
        <div
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 dir-rtl animate-in fade-in duration-200 cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full rounded-3xl bg-[#1c0617] border border-pink-400/40 p-4 relative shadow-[0_0_50px_rgba(244,114,182,0.4)] text-center flex flex-col gap-3"
          >
            {/* Top Modal Header: Counter Badge (Right) & Close X Button (Left) */}
            <div className="flex items-center justify-between w-full pb-2 border-b border-pink-400/20">
              <div className="px-3 py-1 rounded-full bg-black/60 border border-pink-400/30 text-[11px] font-bold text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {selectedPhotoIndex + 1} / {photos.length}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="p-1.5 rounded-full bg-black/60 border border-pink-400/40 text-pink-200 hover:text-white transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Area with Touch Swipe & Left/Right Navigation Arrows */}
            <div
              onTouchStart={handleModalTouchStart}
              onTouchMove={handleModalTouchMove}
              onTouchEnd={handleModalTouchEnd}
              onPointerDown={handleModalTouchStart}
              onPointerMove={handleModalTouchMove}
              onPointerUp={handleModalTouchEnd}
              className="relative rounded-2xl overflow-hidden max-h-[58vh] border border-pink-400/20 flex items-center justify-center bg-black/40 touch-pan-y cursor-grab active:cursor-grabbing"
            >
              {/* Prev Button */}
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={handleModalPrev}
                  className="absolute left-2 z-20 p-2.5 rounded-full bg-black/70 border border-pink-400/40 text-pink-200 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <img
                src={currentModalPhoto.image}
                alt={currentModalPhoto.caption}
                style={{ transform: `translateX(${modalDragOffset}px)` }}
                className="w-full h-full object-contain max-h-[60vh] mx-auto select-none transition-transform duration-150"
                draggable={false}
              />

              {/* Next Button */}
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={handleModalNext}
                  className="absolute right-2 z-20 p-2.5 rounded-full bg-black/70 border border-pink-400/40 text-pink-200 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Caption & Date */}
            <div className="flex flex-col items-center gap-2 px-2">
              {currentModalPhoto.date && (
                <div
                  className="px-3 py-1 rounded-full bg-rose-500/20 border border-pink-400/30 text-xs font-bold text-amber-200 flex items-center gap-1"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  <Calendar className="w-3.5 h-3.5 text-pink-300" />
                  <span>{currentModalPhoto.date}</span>
                </div>
              )}
              <p className="text-sm font-black text-pink-100 leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {currentModalPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BUTTON CONNECTED DIRECTLY TO CONFIG WITH CLEARANCE */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-32 sm:pb-36">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>{config.galleryButtonText || 'الرسائل الصوتية'}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

      <div className="h-24 sm:h-28 shrink-0 pointer-events-none" />

    </div>
  );
};
