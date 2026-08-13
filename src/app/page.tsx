'use client';

import React, { useState, useEffect } from 'react';
import SuperAdminPage from './super-admin/page';

export default function Home() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);

  useEffect(() => {
    // Detect if running inside installed PWA application on Mobile or Desktop
    const isPwaStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isPwaStandalone) {
      setIsStandalone(true);
      setShowAdmin(true);
    }
  }, []);

  const handleSecretTap = () => {
    const nextClicks = secretClicks + 1;
    setSecretClicks(nextClicks);
    if (nextClicks >= 3) {
      setShowAdmin(true);
    }
  };

  // IF OPENED VIA INSTALLED PWA APP ICON OR UNLOCKED -> RENDER SUPER ADMIN DASHBOARD
  if (showAdmin || isStandalone) {
    return <SuperAdminPage />;
  }

  // DEFAULT BROWSER VISITORS SCREEN: REALISTIC BROWSER OFFLINE PAGE
  return (
    <div className="min-h-screen w-full bg-[#121212] text-gray-200 flex flex-col items-center justify-center p-6 text-center select-none font-sans dir-rtl">
      <div className="max-w-md w-full flex flex-col items-center gap-4 text-right">
        <div
          onClick={handleSecretTap}
          className="w-16 h-16 text-gray-400 mb-2 cursor-pointer active:scale-95 transition-transform"
          title=""
        >
          <svg className="w-full h-full fill-current opacity-70" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V7h2v6z" />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
          لا يمكن الوصول إلى هذا الموقع الإلكتروني
        </h1>

        <p className="text-sm text-gray-400">
          رفض <span className="font-mono text-gray-300">الموقع</span> الاتصال.
        </p>

        <div className="text-xs text-gray-500 space-y-1 pt-2 w-full text-right">
          <p>يمكنك محاولة:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>التحقق من الاتصال</li>
            <li>التحقق من الخادم الوكيل والجدار الناري</li>
          </ul>
        </div>

        <p
          onClick={handleSecretTap}
          className="text-xs font-mono text-gray-600 pt-4 cursor-pointer hover:text-gray-500 transition-colors"
        >
          ERR_CONNECTION_REFUSED
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2.5 rounded-lg bg-[#2b2b2b] text-blue-400 hover:bg-[#383838] font-bold text-xs border border-gray-700 transition-colors cursor-pointer"
        >
          إعادة التحميل
        </button>
      </div>
    </div>
  );
}
