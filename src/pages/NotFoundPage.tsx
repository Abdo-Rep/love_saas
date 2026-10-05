import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#121212] text-gray-200 flex flex-col items-center justify-center p-6 text-center select-none font-sans dir-rtl">
      <div className="max-w-md w-full flex flex-col items-center gap-4 text-right">
        <div className="w-16 h-16 text-gray-400 mb-2">
          <svg className="w-full h-full fill-current opacity-70" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V7h2v6z" />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
          لا يمكن الوصول إلى هذا الموقع الإلكتروني
        </h1>

        <p className="text-sm text-gray-400">
          الموقع غير موجود أو الرابط غير صحيح.
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2.5 rounded-lg bg-[#2b2b2b] text-blue-400 hover:bg-[#383838] font-bold text-xs border border-gray-700 transition-colors cursor-pointer"
        >
          العودة للرئيسية 🏠
        </button>
      </div>
    </div>
  );
}
