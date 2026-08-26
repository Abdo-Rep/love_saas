'use client';

import React, { useState } from 'react';

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
  const siteUrl = `${origin}/${slug}`;
  
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(siteUrl)}&color=000000&bgcolor=ffffff&margin=10`;

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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl">
      <div className="max-w-sm w-full p-6 rounded-2xl bg-[#161b22] border border-slate-800 shadow-2xl flex flex-col items-center gap-4 text-center">
        
        {/* HEADER */}
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
            رمز QR
          </h3>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            إغلاق
          </button>
        </div>

        {/* QR CODE IMAGE IN CLEAN CONTAINER */}
        <div className="p-3 rounded-xl bg-white border border-slate-700 shadow-md">
          <img
            src={qrImageUrl}
            alt={`QR Code for ${slug}`}
            className="w-48 h-48 object-contain rounded-lg"
          />
        </div>

        {/* URL & COPY */}
        <div className="w-full p-2 rounded-xl bg-[#0d1117] border border-slate-800 flex items-center justify-between gap-2 text-xs">
          <span className="font-mono text-slate-300 truncate dir-ltr text-left flex-1 px-1">
            {siteUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-all shrink-0 cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {copied ? 'تم النسخ' : 'نسخ'}
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
          <button
            onClick={handleDownloadQR}
            className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-950 font-bold text-xs hover:bg-white transition-all cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            تحميل الكود
          </button>

          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all text-center cursor-pointer border border-slate-700"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            فتح الموقع
          </a>
        </div>

      </div>
    </div>
  );
};
