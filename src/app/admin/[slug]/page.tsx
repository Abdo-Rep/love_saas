'use client';

import React, { useState, useEffect } from 'react';
import { TenantStore } from '@/lib/tenantStore';
import { Tenant } from '@/types/tenant';
import { TenantProvider, useTenant } from '@/lib/tenantContext';
import AdminPage from '../page';
import { Settings, Lock, ShieldCheck, HelpCircle } from 'lucide-react';

interface TenantAdminWrapperProps {
  slug: string;
}

function TenantAdminWrapper({ slug }: TenantAdminWrapperProps) {
  const { currentTenant, loadTenantBySlug } = useTenant();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMounted(true);
    loadTenantBySlug(slug);
  }, [slug]);

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-[#090108] text-white flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const directTenant = TenantStore.getTenantBySlug(slug);
  const activeTenant = (currentTenant && currentTenant.slug.toLowerCase() === slug.toLowerCase()) ? currentTenant : directTenant;

  // 1. CHECK IF TENANT IS DELETED OR SUSPENDED -> SHOW BROWSER OFFLINE ERROR
  if (!activeTenant || activeTenant.status === 'suspended') {
    return (
      <div className="min-h-screen w-full bg-[#121212] text-gray-200 flex flex-col items-center justify-center p-6 text-center select-none font-sans dir-rtl">
        <div className="max-w-md w-full flex flex-col items-center gap-4 text-right">
          <div className="w-16 h-16 text-gray-400 mb-2">
            <svg className="w-full h-full fill-current opacity-70" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
            لا يمكن الوصول إلى هذا الموقع الإلكتروني
          </h1>
          <p className="text-sm text-gray-400">
            رفض <span className="font-mono text-gray-300">localhost</span> الاتصال.
          </p>
          <div className="text-xs text-gray-500 space-y-1 pt-2 w-full text-right">
            <p>يمكنك محاولة:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>التحقق من الاتصال</li>
              <li>التحقق من الخادم الوكيل والجدار الناري</li>
            </ul>
          </div>
          <p className="text-xs font-mono text-gray-600 pt-4">ERR_CONNECTION_REFUSED</p>

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

  const tenantToUse = activeTenant;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === tenantToUse.adminPassword || passwordInput === TenantStore.getMasterPassword()) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('كلمة سر الأدمن الخاصة بهذه النسخة غير صحيحة ❌');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#090108] text-white flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white font-sans text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/5 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(244,114,182,0.3)] relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 border border-white/40 flex items-center justify-center shadow-[0_0_25px_#f472b6] animate-pulse">
            <Settings className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '10s' }} />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              لوحة تحكم ({tenantToUse.name}) 🎛️
            </h1>
            <p className="text-xs text-pink-200/70 font-semibold dir-ltr font-mono">
              /admin/{slug}
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="text-right">
              <label className="block text-xs font-bold text-pink-200/80 mb-1.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                كلمة سر الأدمن للنسخة:
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="أدخل كلمة سر الأدمن الخاصة بك..."
                className="w-full p-3.5 rounded-2xl bg-black/60 border border-pink-400/30 text-white font-mono text-center font-bold focus:border-pink-300 focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm shadow-[0_0_25px_rgba(244,114,182,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>دخول لوحة التحكم 🚀</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Once authenticated, render AdminPage scoped to this tenant!
  return <AdminPage />;
}

export default function DynamicTenantAdminPage({ params }: { params: { slug: string } }) {
  const slug = params?.slug || 'rawda';

  return (
    <TenantProvider initialSlug={slug}>
      <TenantAdminWrapper slug={slug} />
    </TenantProvider>
  );
}
