'use client';

import React, { useState } from 'react';
import { QrCode, Download, Copy, Check, ExternalLink, X, Heart, Sparkles } from 'lucide-react';

interface Props {
  slug: string;
  tenantName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TenantQRCodeModal: React.FC<Props> = ({ slug, tenantName, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://im-love-you-beby.vercel.app';
  const siteUrl = `${origin}/site/${slug}`;
  const directSlugUrl = `${origin}/${slug}`;
  
  // Real high-resolution QR code URL with pink/rose aesthetic styling
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(siteUrl)}&color=be123c&bgcolor=ffffff&margin=10`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `QR-Code-${slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(qrImageUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-sm w-full p-6 sm:p-8 rounded-[36px] bg-gradient-to-b from-[#2a041c] via-[#1a0212] to-black border-2 border-pink-400/40 shadow-[0_0_50px_rgba(244,114,182,0.5)] relative flex flex-col items-center gap-5 text-center">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-pink-200 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shadow-[0_0_20px_#f472b6]">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
            رمز الـ QR المخصص لموقع الزوار 📱✨
          </h3>
          <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
            امسح الكود بالكاميرا لفتح الموقع فوراً
          </p>
        </div>

        {/* REAL SCANNABLE QR CODE IMAGE IN LUXURY FRAME */}
        <div className="relative p-3 rounded-3xl bg-white shadow-[0_0_35px_rgba(244,63,94,0.6)] border-4 border-pink-400 flex items-center justify-center">
          <img
            src={qrImageUrl}
            alt={`QR Code for ${slug}`}
            className="w-52 h-52 object-contain rounded-2xl"
          />
          <div className="absolute -bottom-3 -right-3 p-2 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg border-2 border-white">
            <Heart className="w-4 h-4 fill-white animate-pulse" />
          </div>
        </div>

        {/* URL DISPLAY & COPY */}
        <div className="w-full p-2.5 rounded-2xl bg-black/60 border border-pink-400/30 flex items-center justify-between gap-2 text-xs">
          <span className="font-mono text-amber-200 truncate dir-ltr text-left flex-1 px-1">
            {siteUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:scale-105 transition-all shrink-0 cursor-pointer shadow-md flex items-center gap-1 font-bold text-[11px]"
            title="نسخ الرابط"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
          <button
            onClick={handleDownloadQR}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <Download className="w-4 h-4" />
            <span>تحميل الـ QR 📥</span>
          </button>

          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>فتح الموقع 🚀</span>
          </a>
        </div>

      </div>
    </div>
  );
};
