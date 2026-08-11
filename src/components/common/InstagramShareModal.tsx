'use client';

import React, { useRef, useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { Download, Share2, X, Sparkles, Heart } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramShareModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { config } = useConfig();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0a0a1a',
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${config.herName}-cosmic-memory.png`;
      link.click();
    } catch (e) {
      console.error('Failed to generate image:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-cosmic-deep border border-cosmic-rosegold/50 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white p-1 rounded-full bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-center text-cosmic-gold mb-4 flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" /> بطاقة الذكرى للإنستجرام
        </h3>

        {/* Printable Card Node */}
        <div
          ref={cardRef}
          className="w-full aspect-[4/5] bg-gradient-to-b from-[#0d0d2b] via-[#14143a] to-[#0a0a1a] border border-cosmic-gold/40 rounded-xl p-5 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-2xl"
        >
          {/* Background sparkles */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cosmic-rosegold/10 via-transparent to-transparent pointer-events-none" />

          {/* Header */}
          <div className="z-10 mt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold/40 text-xs text-cosmic-gold font-medium">
              <Sparkles className="w-3.5 h-3.5" /> رحلتنا الكونية الخاصة
            </div>
          </div>

          {/* Couple Image */}
          <div className="z-10 relative my-3">
            <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-cosmic-gold via-cosmic-rosegold to-cosmic-gold shadow-[0_0_20px_rgba(255,215,0,0.4)] overflow-hidden mx-auto">
              <img
                src={config.couplePhotoUrl || config.herPortraitUrl}
                alt="Memory"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-cosmic-gold text-cosmic-bg text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-md">
              <Heart className="w-3 h-3 fill-current text-rose-600" /> {config.herName}
            </div>
          </div>

          {/* Message */}
          <div className="z-10 space-y-2">
            <p className="text-xs text-cosmic-gold font-semibold tracking-wide">
              {config.countryDateText || '17 يناير 2024'}
            </p>
            <p className="text-sm font-medium text-white px-2 leading-relaxed italic">
              "{config.finalQuote}"
            </p>
          </div>

          {/* Footer watermark */}
          <div className="z-10 mb-1 border-t border-white/10 w-full pt-2 flex items-center justify-between text-[10px] text-gray-400">
            <span>✨ Cosmic Love Journey</span>
            <span className="text-cosmic-rosegold font-bold">{config.herName}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-cosmic-rosegold via-cosmic-gold to-cosmic-rosegold text-cosmic-bg font-bold shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          {isGenerating ? 'جاري تجهيز الصورة...' : 'حفظ الصورة للإنستجرام'}
        </button>
      </div>
    </div>
  );
};
