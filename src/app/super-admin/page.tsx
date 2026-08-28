'use client';

import React, { useState, useEffect } from 'react';
import { TenantStore } from '@/lib/tenantStore';
import { Tenant } from '@/types/tenant';
import { TenantQRCodeModal } from '@/components/admin/TenantQRCodeModal';
import { Search, AlertTriangle } from 'lucide-react';

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQrTenant, setSelectedQrTenant] = useState<Tenant | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<{ slug: string; name: string } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Form State
  const [singleName, setSingleName] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('love');
  const [newSitePass, setNewSitePass] = useState('love');
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('solaf_super_admin_session');
        if (stored === 'true') {
          setIsAuthenticated(true);
        }
      }
    } catch {}
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const refreshData = async () => {
    setIsLoadingData(true);
    setApiError(null);
    try {
      const res = await fetch(`/api/tenants?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) {
        setApiError(`عذراً، فشل الاتصال بقاعدة البيانات (API Status ${res.status}). يرجى التأكد من إعدادات الربط بالسيرفر.`);
        setIsLoadingData(false);
        return;
      }
      const json = await res.json();
      if (json?.success && Array.isArray(json.tenants)) {
        setTenants(json.tenants);
      } else {
        setApiError(json?.error || 'عذراً، لا يمكن جلب بيانات المستأجرين من API قاعدة البيانات.');
      }
    } catch (err: any) {
      setApiError('عذراً، لا يمكن الاتصال بـ API قاعدة البيانات. يرجى التأكد من تشغيل السيرفر أو الاتصال بالشبكة.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    const cleanPassword = passwordInput.trim();
    if (!cleanEmail || !cleanPassword) {
      setLoginError('يرجى كتابة البريد الإلكتروني وكلمة السر');
      return;
    }

    setLoginError('');
    try {
      const res = await fetch('/api/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        try {
          localStorage.setItem('solaf_super_admin_session', 'true');
        } catch {}
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError(json.error || 'البريد الإلكتروني أو كلمة السر غير صحيحة');
      }
    } catch {
      const master = TenantStore.getMasterPassword();
      if (master && cleanPassword === master) {
        try {
          localStorage.setItem('solaf_super_admin_session', 'true');
        } catch {}
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('البريد الإلكتروني أو كلمة السر غير صحيحة');
      }
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('solaf_super_admin_session');
    } catch {}
    setIsAuthenticated(false);
  };

  const handleSingleNameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSingleName(clean);
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    const cleanSlug = singleName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!cleanSlug) {
      setCreateError('يرجى إدخال حروف إنجليزية أو أرقام صالحة للرابط');
      return;
    }

    try {
      const created = TenantStore.createTenant(
        cleanSlug,
        cleanSlug,
        newAdminPass.trim() || 'love',
        newSitePass.trim() || 'love',
        cleanSlug
      );

      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: created }),
        cache: 'no-store'
      });

      if (!res.ok) {
        setCreateError('فشل حفظ النسخة في قاعدة البيانات (Status ' + res.status + ')');
        return;
      }

      await refreshData();
      setSingleName('');
      setNewAdminPass('love');
      setNewSitePass('love');
      setShowCreateModal(false);
    } catch (err: any) {
      setCreateError(err.message || 'حدث خطأ أثناء إنشاء النسخة في قاعدة البيانات');
    }
  };

  const handleToggleStatus = async (slug: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const updated = TenantStore.updateTenant(slug, { status: nextStatus });
    if (updated) {
      await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: updated }),
        cache: 'no-store'
      }).catch(() => {});
    }
    await refreshData();
  };

  const handleDeleteClient = async (slug: string, _name?: string) => {
    TenantStore.deleteTenant(slug);
    await fetch('/api/tenants', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      cache: 'no-store'
    }).catch(() => {});
    await refreshData();
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 0. PREVENT ANY LOGIN FLICKER / FLASH WHILE CHECKING SESSION
  if (isCheckingAuth) {
    return <main className="min-h-screen w-full bg-[#0b0f17]" />;
  }

  // 1. CALM MINIMAL LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen w-full bg-[#0b0f17] text-slate-100 flex items-center justify-center p-4 font-sans text-center dir-rtl">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#161b22] border border-slate-800 shadow-2xl flex flex-col items-center gap-6">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-2xl font-black text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
              سولاف
            </h1>
            <p className="text-xs text-slate-400 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              تسجيل دخول السوبر أدمن
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 text-right">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="w-full p-3 rounded-xl bg-[#0d1117] border border-slate-800 text-slate-100 font-mono text-center font-medium focus:border-slate-600 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                كلمة السر
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="كلمة السر"
                className="w-full p-3 rounded-xl bg-[#0d1117] border border-slate-800 text-slate-100 font-mono text-center font-medium focus:border-slate-600 focus:outline-none text-sm"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-900 text-rose-300 text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-slate-100 text-slate-950 font-bold text-sm hover:bg-white transition-all cursor-pointer"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </main>
    );
  }

  // 2. CALM PROFESSIONAL DASHBOARD
  return (
    <main className="min-h-screen w-full bg-[#0b0f17] text-slate-100 p-4 sm:p-6 pb-24 max-w-6xl mx-auto font-sans dir-rtl">
      
      {/* API ERROR MODAL DIALOG */}
      {apiError && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-red-500/40 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-7 h-7 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
                خطأ في الاتصال بقاعدة البيانات (API Error)
              </h3>
              <p className="text-xs text-red-200/90 leading-relaxed dir-rtl font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {apiError}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={refreshData}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                إعادة المحاولة 🔄
              </button>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-all cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* MINIMAL HEADER BAR WITH MOBILE SEARCH ICON TOGGLE */}
      <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur-md py-4 border-b border-slate-800/80 mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-right">
            <h1 className="text-xl sm:text-2xl font-black text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
              سولاف
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* MOBILE SEARCH TOGGLE BUTTON */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 sm:hidden cursor-pointer flex items-center justify-center"
              title="البحث"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* LOGOUT BUTTON */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer shrink-0"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* EXPANDABLE MOBILE SEARCH INPUT */}
        {showMobileSearch && (
          <div className="sm:hidden w-full pt-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث باسم العميل أو الرابط..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161b22] border border-slate-700 text-slate-100 text-xs font-semibold focus:border-slate-500 focus:outline-none"
              style={{ fontFamily: "'Cairo', sans-serif" }}
              autoFocus
            />
          </div>
        )}
      </header>

      {/* FILTER BUTTONS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        {/* STATUS FILTER PILLS - 3 EQUAL COLUMNS ON MOBILE */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto p-1 bg-[#161b22] border border-slate-800 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`py-2 px-2 sm:px-4 rounded-lg font-bold text-xs transition-all text-center cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-100 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            الكل ({tenants.length})
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`py-2 px-2 sm:px-4 rounded-lg font-bold text-xs transition-all text-center cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            نشط ({tenants.filter((t) => t.status === 'active').length})
          </button>

          <button
            onClick={() => setStatusFilter('suspended')}
            className={`py-2 px-2 sm:px-4 rounded-lg font-bold text-xs transition-all text-center cursor-pointer ${
              statusFilter === 'suspended'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            معطل ({tenants.filter((t) => t.status === 'suspended').length})
          </button>
        </div>

        {/* DESKTOP SEARCH INPUT */}
        <div className="hidden sm:block w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث بالرابط..."
            className="w-full px-3.5 py-2 rounded-xl bg-[#161b22] border border-slate-800 text-slate-100 text-xs font-semibold focus:border-slate-600 focus:outline-none"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          />
        </div>
      </div>

      {/* COMPACT CLEAN DATA TABLE */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-[#161b22] shadow-xl">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0d1117] text-slate-400 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <th className="p-3.5 pr-5">الرابط (Slug)</th>
              <th className="p-3.5">كلمات السر (موقع / أدمن)</th>
              <th className="p-3.5 text-center">الحالة</th>
              <th className="p-3.5 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredTenants.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  لا توجد نتائج مطابقة للبحث
                </td>
              </tr>
            ) : (
              filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Slug */}
                  <td className="p-3.5 pr-5 font-mono text-slate-200 font-bold whitespace-nowrap dir-ltr text-right text-sm">
                    /{tenant.slug}
                  </td>

                  {/* Passwords */}
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300" title="كلمة سر الموقع">
                        موقع: {tenant.config?.sitePassword || tenant.sitePassword || 'love'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300" title="كلمة سر الأدمن">
                        أدمن: {tenant.adminPassword || 'love'}
                      </span>
                    </div>
                  </td>

                  {/* Clickable Status Badge (Toggle Active/Suspended) */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(tenant.slug, tenant.status)}
                      title="اضغط لتغيير الحالة"
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold inline-block cursor-pointer transition-all hover:opacity-80 active:scale-95 ${
                        tenant.status === 'active'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                      }`}
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      {tenant.status === 'active' ? 'نشط' : 'معطل'}
                    </button>
                  </td>

                  {/* Quick Actions */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={`/${tenant.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-all"
                        style={{ fontFamily: "'Cairo', sans-serif" }}
                      >
                        الموقع
                      </a>

                      <a
                        href={`/${tenant.slug}/admin`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-all"
                        style={{ fontFamily: "'Cairo', sans-serif" }}
                      >
                        الأدمن
                      </a>

                      <button
                        onClick={() => setSelectedQrTenant(tenant)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] transition-all cursor-pointer"
                        style={{ fontFamily: "'Cairo', sans-serif" }}
                      >
                        QR
                      </button>

                      <button
                        onClick={() => setTenantToDelete({ slug: tenant.slug, name: tenant.slug })}
                        className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-900 text-rose-300 font-semibold text-[11px] transition-all cursor-pointer"
                        style={{ fontFamily: "'Cairo', sans-serif" }}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CALM MODAL: CREATE NEW CLIENT */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#161b22] border border-slate-800 shadow-2xl flex flex-col gap-4 text-right">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
                إنشاء موقع جديد
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                إغلاق
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs font-semibold text-right">
              <div>
                <label className="block text-slate-300 mb-1.5 text-xs font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  الرابط (Slug)
                </label>
                <input
                  type="text"
                  required
                  value={singleName}
                  onChange={(e) => handleSingleNameChange(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0d1117] border border-slate-800 text-slate-100 font-mono text-sm text-center focus:border-slate-600 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1.5 text-xs" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    كلمة سر الأدمن:
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0d1117] border border-slate-800 text-slate-100 font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5 text-xs" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    كلمة سر الزوار:
                  </label>
                  <input
                    type="text"
                    required
                    value={newSitePass}
                    onChange={(e) => setNewSitePass(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0d1117] border border-slate-800 text-slate-100 font-mono text-center"
                  />
                </div>
              </div>

              {createError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-900 text-rose-300 text-xs font-semibold text-center">
                  {createError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-slate-100 text-slate-950 font-bold text-xs hover:bg-white transition-all cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                إنشاء الموقع
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON (+) FOR NEW CLIENT */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-slate-100 text-slate-950 font-bold text-2xl hover:bg-white shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
        title="إنشاء موقع عميل جديد"
      >
        +
      </button>

      {/* TENANT QR CODE MODAL */}
      {selectedQrTenant && (
        <TenantQRCodeModal
          slug={selectedQrTenant.slug}
          tenantName={selectedQrTenant.name}
          isOpen={!!selectedQrTenant}
          onClose={() => setSelectedQrTenant(null)}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {tenantToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm dir-rtl">
          <div className="max-w-sm w-full p-6 rounded-2xl bg-[#161b22] border border-slate-800 text-center space-y-4 relative">
            <div>
              <h3 className="text-base font-bold text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
                تأكيد حذف النسخة
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                هل أنت متأكد من حذف النسخة (/{tenantToDelete.slug}) نهائياً؟
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleDeleteClient(tenantToDelete.slug, tenantToDelete.name);
                  setTenantToDelete(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                نعم، حذف النسخة
              </button>
              <button
                type="button"
                onClick={() => setTenantToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALM LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm dir-rtl">
          <div className="max-w-sm w-full p-6 rounded-2xl bg-[#161b22] border border-slate-800 text-center space-y-4 relative">
            <div>
              <h3 className="text-base font-bold text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
                تأكيد تسجيل الخروج
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                هل أنت متأكد من تسجيل الخروج من لوحة التحكم؟
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                نعم، تسجيل الخروج
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
