'use client';

import React, { useState, useEffect } from 'react';
import { TenantProvider, useTenant } from '@/lib/tenantContext';
import AdminPage from '@/app/admin/page';

import { CosmicMeteorsBackground } from '@/components/common/CosmicMeteorsBackground';

interface TenantAdminWrapperProps {
  slug: string;
}

function TenantAdminWrapper({ slug }: TenantAdminWrapperProps) {
  const { currentTenant, setCurrentTenantDirectly } = useTenant();
  const [adminState, setAdminState] = useState<'checking' | 'active' | 'suspended' | 'not_found'>('checking');
  const [foundTenant, setFoundTenant] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTenant = async () => {
      try {
        const res = await fetch(`/api/tenants?slug=${encodeURIComponent(slug)}&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json?.success && Array.isArray(json.tenants) && json.tenants.length > 0) {
            const match = json.tenants.find((t: any) => (t.slug || '').toLowerCase().trim() === slug.toLowerCase().trim());
            if (match && isMounted) {
              if (match.status === 'suspended') {
                setAdminState('suspended');
                return;
              }
              setFoundTenant(match);
              setCurrentTenantDirectly(match);
              setAdminState('active');
              return;
            }
          }
        }
      } catch (e) {
        console.error('Error fetching admin tenant:', e);
      }

      if (isMounted) {
        setAdminState('not_found');
      }
    };

    fetchTenant();

    // Lightweight status-only Heartbeat (30ms) to detect live suspension/deletion without heavy payload
    const checkLiveStatus = async () => {
      try {
        const res = await fetch(`/api/tenants?slug=${encodeURIComponent(slug)}&checkStatusOnly=true&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json?.success && Array.isArray(json.tenants)) {
            const match = json.tenants.find((t: any) => (t.slug || '').toLowerCase().trim() === slug.toLowerCase().trim());
            if (!match) {
              if (isMounted) setAdminState('not_found');
            } else if (match.status === 'suspended') {
              if (isMounted) setAdminState('suspended');
            } else if (match.status === 'active') {
              if (isMounted && adminState !== 'active') setAdminState('active');
            }
          }
        }
      } catch (_) {}
    };

    const heartbeatInterval = setInterval(() => {
      if (isMounted) {
        checkLiveStatus();
      }
    }, 6000);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMounted) {
        checkLiveStatus();
      }
    };

    window.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(heartbeatInterval);
      window.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onVisibilityChange);
    };
  }, [slug, setCurrentTenantDirectly, adminState]);

  if (adminState === 'checking') {
    return (
      <div className="min-h-screen w-full bg-[#1c0617] text-white flex flex-col items-center justify-center font-sans dir-rtl">
        <CosmicMeteorsBackground />
        <div className="flex flex-col items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-pink-200/80 animate-pulse" style={{ fontFamily: "'Cairo', sans-serif" }}>
            جاري فتح لوحة التحكم... ✨🔒
          </span>
        </div>
      </div>
    );
  }

  if (adminState === 'suspended' || adminState === 'not_found') {
    return (
      <div className="min-h-screen w-full bg-[#121212] text-gray-200 flex flex-col items-center justify-center p-6 text-center select-none font-sans dir-rtl">
        <div className="max-w-md w-full flex flex-col items-center gap-4 text-right">
          <div className="w-16 h-16 text-gray-400 mb-2">
            <svg className="w-full h-full fill-current opacity-70" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
            لا يمكن الوصول إلى لوحة التحكم
          </h1>
          <p className="text-sm text-gray-400">
            الموقع معطل أو غير موجود حالياً.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-colors"
          >
            إعادة المحاولة 🔄
          </button>
        </div>
      </div>
    );
  }

  return <AdminPage />;
}

export default function TenantAdminDynamicRoute({ params }: { params: { slug: string } }) {
  const slug = params?.slug || 'rawda';

  return (
    <TenantProvider initialSlug={slug}>
      <TenantAdminWrapper slug={slug} />
    </TenantProvider>
  );
}
