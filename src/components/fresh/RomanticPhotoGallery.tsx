'use client';

import React, { useState } from 'react';
import { Sparkles, Camera, ArrowLeft, ArrowRight, Heart, ZoomIn, Calendar, Star } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const PHOTOS = [
  {
    id: 1,
    url: '/images/the_boss.jpg',
    tag: 'سر السعادة 💖',
    date: 'أول نظرة ولقاء',
    caption: 'من أول دقيقة شفتك فيها، عرفت إن قلبي مش هيعرف يدق ولا يعشق حد تاني غيرك.'
  },
  {
    id: 2,
    url: '/images/peasant_girl.jpg',
    tag: 'ابتسامتك المشرقة ✨',
    date: 'كل يوم وكل ثانية',
    caption: 'كل ما تحسي بضيق، افتكري دايماً إن ابتسامتك هي دوا قلبي والنور اللي بينور أيامي.'
  },
  {
    id: 3,
    url: '/images/the_boss.jpg',
    tag: 'عهد العشق 💍',
    date: 'إلى الأبد',
    caption: 'بنات العالم كلهم في كفة، وأنتي لوحدك في كفة تانية كأنك ملكة جيتي من عالم تاني خالص.'
  }
];

export const RomanticPhotoGallery: React.FC<Props> = ({ onNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PHOTOS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  };

  const activePhoto = PHOTOS[currentIndex];

  return (
    <div className="relative w-full min-h-screen bg-[#05020c] text-white flex flex-col justify-between p-4 md:p-8 select-none overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(236,72,153,0.18)_0%,_rgba(245,158,11,0.1)_50%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-pink-500/30 backdrop-blur-md self-center shadow-[0_0_15px_rgba(236,72,153,0.2)]">
          <Camera className="w-4 h-4 text-pink-400" />
          <span className="text-xs md:text-sm font-bold text-pink-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            معرض الصور والذكريات الملكي 📸✨
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
          ذكريات حُفرت في الوجدان
        </h1>
      </div>

      {/* 3D POLAROID CAROUSEL DISPLAY */}
      <div className="relative z-20 max-w-4xl mx-auto w-full my-6 flex flex-col items-center">
        
        {/* Main Photo Card Frame */}
        <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-rose-500/50 rounded-3xl p-5 shadow-[0_0_50px_rgba(244,63,94,0.3)] backdrop-blur-xl flex flex-col items-center gap-4">
          
          {/* Photo Image Frame */}
          <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden border border-white/20 shadow-2xl group cursor-pointer" onClick={() => setIsZoomed(true)}>
            <img
              src={activePhoto.url}
              alt="Romantic Memory"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-black/70 text-white text-xs font-bold flex items-center gap-2 border border-white/20 backdrop-blur-md">
                <ZoomIn className="w-4 h-4 text-amber-400" /> تكبير الصورة
              </span>
            </div>

            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 border border-amber-400/50 text-xs font-bold text-amber-300 backdrop-blur-md" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {activePhoto.tag}
            </div>
          </div>

          {/* Photo Date & Caption */}
          <div className="w-full text-right flex flex-col gap-2 px-2">
            <div className="flex items-center justify-between text-xs text-rose-400 font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{activePhoto.date}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>صورة رقم {currentIndex + 1} / {PHOTOS.length}</span>
              </div>
            </div>

            <p className="text-white/90 text-sm md:text-base leading-relaxed font-bold pt-1 border-t border-white/10" style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
              {activePhoto.caption}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full pt-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/40 active:scale-95 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {PHOTOS.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-rose-500 shadow-[0_0_12px_#f43f5e]' : 'w-2.5 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/40 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl">
            <img src={activePhoto.url} alt="Zoomed Memory" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* FOOTER ACTION BUTTON */}
      <div className="relative z-20 max-w-md mx-auto w-full pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-extrabold text-sm md:text-base border border-pink-300 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>شغّلي أغنيتنا ورسالتنا الخاصة.. 🎵</span>
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
