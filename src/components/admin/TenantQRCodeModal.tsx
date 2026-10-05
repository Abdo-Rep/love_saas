import React, { useState } from 'react';
import { Tenant } from '@/types/tenant';
import { X, Copy, Download, QrCode, Check } from 'lucide-react';

interface Props {
  tenant?: Tenant | null;
  slug?: string;
  tenantName?: string;
  isOpen?: boolean;
  onClose: () => void;
}

export const TenantQRCodeModal: React.FC<Props> = ({
  tenant,
  slug: rawSlug,
  tenantName: rawTenantName,
  isOpen = true,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const slug = tenant?.slug || rawSlug || 'soulove';
  const displayName = tenant?.name || rawTenantName || `موقع ${slug}`;

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
    } catch {
      window.open(qrImageUrl, '_blank');
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 selection:bg-pink-500 selection:text-white font-sans dir-rtl cursor-pointer"
    >
      <div className="bg-[#1c0617] border border-pink-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full relative text-center shadow-2xl cursor-default">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-pink-400/60 hover:text-pink-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl mb-3">
          <QrCode className="w-6 h-6 text-pink-400" />
        </div>

        <h3 className="text-base font-bold text-pink-100 mb-1">
          رمز QR لموقع {displayName}
        </h3>
        <p className="text-xs text-pink-300/60 mb-5 font-mono">/{slug}</p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl inline-block mb-5 shadow-inner">
          <img
            src={qrImageUrl}
            alt={`QR Code for ${slug}`}
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ الرابط بنجاح ✨' : 'نسخ رابط الموقع 🔗'}</span>
          </button>

          <button
            onClick={handleDownloadQR}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-pink-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-pink-400" />
            <span>تحميل صورة الـ QR 📱</span>
          </button>
        </div>
      </div>
    </div>
  );
};
