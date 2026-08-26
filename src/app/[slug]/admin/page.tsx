'use client';

import React, { useState, useEffect } from 'react';
import { TenantStore } from '@/lib/tenantStore';
import { TenantProvider, useTenant } from '@/lib/tenantContext';
import AdminPage from '@/app/admin/page';

interface TenantAdminWrapperProps {
  slug: string;
}

function TenantAdminWrapper({ slug }: TenantAdminWrapperProps) {
  const { currentTenant, loadTenantBySlug } = useTenant();
  const [mounted, setMounted] = useState(false);

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
            لا يمكن الوصول إلى لوحة التحكم
          </h1>
          <p className="text-sm text-gray-400">
            الموقع معطل أو غير موجود حالياً.
          </p>
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
