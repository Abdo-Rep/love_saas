import React, { useState, useEffect } from 'react';
import { TenantStore } from '@/lib/tenantStore';
import { Tenant } from '@/types/tenant';
import { getSupabaseUrl, getSupabaseKey } from '@/lib/supabaseClient';
import { Search, AlertTriangle, Crown, ExternalLink, Key, Lock, Copy, Eye, EyeOff, X, Check, Plus, DoorOpen } from 'lucide-react';


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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMainSiteModal, setShowMainSiteModal] = useState(false);
  const [showMainSitePass, setShowMainSitePass] = useState(false);
  const [copiedPassText, setCopiedPassText] = useState<string | null>(null);
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

  const [copiedToastText, setCopiedToastText] = useState<string | null>(null);

  const handleCopyPassword = (pass: string, label: string) => {
    if (!pass) return;
    navigator.clipboard.writeText(pass);
    setCopiedToastText(`تم نسخ كلمة السر بنجاح ✨ (${pass})`);
    setTimeout(() => setCopiedToastText(null), 2500);
  };

  useEffect(() => {
    if (isAuthenticated) {
      // 1. Instant 0ms session cache render of all DB sites
      try {
        if (typeof window !== 'undefined') {
          const cached = sessionStorage.getItem('solaf_superadmin_tenants_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTenants(parsed);
              setIsLoadingData(false);
            }
          }
        }
      } catch {}

      // Fallback to TenantStore
      const local = TenantStore.getAllTenants();
      if (local && local.length > 0) {
        setTenants((prev) => (prev.length === 0 ? local : prev));
        setIsLoadingData(false);
      }

      refreshData();
    }
  }, [isAuthenticated]);

  const refreshData = async () => {
    setApiError(null);
    try {
      const list = await TenantStore.syncFromSupabase();
      if (Array.isArray(list)) {
        setTenants(list);
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('solaf_superadmin_tenants_cache', JSON.stringify(list));
          }
        } catch {}
      }
    } catch (err: any) {
      setApiError('عذراً، لا يمكن الاتصال بـ API قاعدة البيانات.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();
    if (!cleanEmail || !cleanPassword) {
      setLoginError('يرجى كتابة البريد الإلكتروني وكلمة السر');
      return;
    }

    setLoginError('');
    setIsLoggingIn(true);

    const envEmail = (import.meta.env?.VITE_SUPER_ADMIN_EMAIL || 'admin@soulove.com').trim().toLowerCase();
    const envPassword = (import.meta.env?.VITE_SUPER_ADMIN_PASSWORD || 'Mohammedosha1#').trim();
    const masterPass = TenantStore.getMasterPassword();

    if ((cleanEmail === envEmail && cleanPassword === envPassword) || cleanPassword === masterPass) {
      try {
        localStorage.setItem('solaf_super_admin_session', 'true');
      } catch {}
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('البريد الإلكتروني أو كلمة السر غير صحيحة ❌');
    }

    setIsLoggingIn(false);
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

      // Instant optimistic UI update (0ms latency)
      setTenants((prev) => [created, ...prev.filter((t) => t.slug.toLowerCase() !== cleanSlug)]);
      setSingleName('');
      setNewAdminPass('love');
      setNewSitePass('love');
      setShowCreateModal(false);

      // Background cloud save
      TenantStore.saveTenantToCloud(created).then((ok) => {
        if (!ok) refreshData();
      });
    } catch (err: any) {
      setCreateError(err.message || 'حدث خطأ أثناء إنشاء النسخة في قاعدة البيانات');
    }
  };

  const handleToggleStatus = async (slug: string, currentStatus: string) => {
    const nextStatus: 'active' | 'suspended' = currentStatus === 'active' ? 'suspended' : 'active';
    const cleanSlug = slug.toLowerCase().trim();

    // Instant optimistic UI update & cache sync (0ms latency)
    setTenants((prev) => {
      const updated = prev.map((t) => (t.slug.toLowerCase().trim() === cleanSlug ? { ...t, status: nextStatus } : t));
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('solaf_superadmin_tenants_cache', JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });

    const current = TenantStore.getTenantBySlug(cleanSlug);
    if (current) {
      TenantStore.updateTenant(cleanSlug, { status: nextStatus });
    }

    const url = getSupabaseUrl();
    const key = getSupabaseKey();
    if (url && key) {
      try {
        await fetch(`${url}/rest/v1/tenants?slug=eq.${encodeURIComponent(cleanSlug)}`, {
          method: 'PATCH',
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Accept-Profile': 'romantic-new-version',
            'Content-Profile': 'romantic-new-version',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ status: nextStatus }),
        });
      } catch (err) {
        console.warn('Failed to update status on Supabase:', err);
      }
    }
  };

  const handleDeleteClient = async (slug: string, _name?: string) => {
    const cleanSlug = slug.toLowerCase().trim();

    // Instant optimistic UI update & cache sync (0ms latency)
    setTenants((prev) => {
      const updated = prev.filter((t) => t.slug.toLowerCase().trim() !== cleanSlug);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('solaf_superadmin_tenants_cache', JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });

    const success = await TenantStore.deleteTenant(cleanSlug);
    if (success) {
      setCopiedToastText(`تم حذف موقع /${cleanSlug} نهائياً 🗑️`);
      setTimeout(() => setCopiedToastText(null), 2500);
    } else {
      // Re-sync if failed
      refreshData();
    }
  };

  const mainSiteTenant = tenants.find((t) => (t.slug || '').toLowerCase().trim() === 'soulove') ||
    tenants.find((t) => (t.slug || '').toLowerCase().trim() === 'default') || {
      slug: 'soulove',
      name: 'الموقع الرئيسي (soulove)',
      sitePassword: 'love',
      adminPassword: 'love',
      status: 'active'
    };

  const handleCopyPass = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPassText(label);
    setTimeout(() => setCopiedPassText(null), 2500);
  };

  // Sort: Newest at the top, Oldest at the bottom
  const filteredTenants = tenants
    .filter((t) => {
      const matchesSearch =
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.slug?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#090108] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090108] text-white flex items-center justify-center p-4 selection:bg-pink-500 selection:text-white font-sans dir-rtl">
        <div className="w-full max-w-md bg-[#130312]/90 border border-pink-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-2xl mb-4 shadow-inner">
              <Crown className="w-8 h-8 text-pink-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
              لوحة التحكم الملكية
            </h1>
            <p className="text-xs text-pink-300/60 mt-2 font-light">
              الرجاء تسجيل الدخول للوصول إلى إدارة جميع المواقع
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-pink-300/80 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@soulove.com"
                className="w-full bg-[#1c0617] border border-pink-500/20 rounded-xl px-4 py-3 text-sm text-pink-100 placeholder-pink-400/30 focus:outline-none focus:border-pink-500/50 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pink-300/80 mb-2">
                كلمة السر
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1c0617] border border-pink-500/20 rounded-xl px-4 py-3 text-sm text-pink-100 placeholder-pink-400/30 focus:outline-none focus:border-pink-500/50 transition-colors"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-600/20 transition-all active:scale-[0.98] disabled:opacity-50 text-sm cursor-pointer"
            >
              {isLoggingIn ? 'جاري التحقق...' : 'دخول المنصة الملكية ✨'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090108] text-white p-4 sm:p-6 lg:p-8 font-sans dir-rtl selection:bg-pink-500 selection:text-white">
      {/* Toast Notification */}
      {copiedToastText && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1c0617] border border-pink-500/50 text-pink-200 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copiedToastText}</span>
        </div>
      )}

      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-2xl shadow-inner">
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowMainSiteModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-pink-500/20 hover:from-amber-500/30 hover:to-pink-500/30 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>الموقع الرئيسي</span>
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            title="تسجيل الخروج"
            className="p-2.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20 hover:border-rose-500/40 rounded-xl transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
          >
            <DoorOpen className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Controls Bar */}
        <div className="bg-[#130312]/80 border border-pink-500/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center backdrop-blur-md">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-pink-400/60 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم أو الرابط..."
              className="w-full bg-[#1c0617] border border-pink-500/20 rounded-xl pr-10 pl-4 py-2.5 text-xs text-pink-100 placeholder-pink-400/30 focus:outline-none focus:border-pink-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                  : 'bg-white/5 text-pink-200 hover:bg-white/10'
              }`}
            >
              الكل ({tenants.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white/5 text-emerald-300 hover:bg-white/10'
              }`}
            >
              النشطة ({tenants.filter((t) => t.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('suspended')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'suspended'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-white/5 text-rose-300 hover:bg-white/10'
              }`}
            >
              المعطلة ({tenants.filter((t) => t.status === 'suspended').length})
            </button>
          </div>
        </div>

        {/* Sites Table / List with strict single row and overflow-x */}
        <div className="bg-[#130312]/80 border border-pink-500/10 rounded-2xl overflow-hidden backdrop-blur-md">
          {isLoadingData ? (
            <div className="p-12 text-center text-pink-300/60 text-xs">
              <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              جاري تحميل قائمة المواقع الملكية...
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="p-12 text-center text-pink-300/60 text-xs">
              لا توجد مواقع مطابقة للبحث حالياً ✨
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
              <table className="w-full min-w-[700px] text-right border-collapse">
                <tbody className="divide-y divide-pink-500/10">
                  {filteredTenants.map((t) => (
                    <tr
                      key={t.slug}
                      className="hover:bg-pink-500/[0.03] transition-colors"
                    >
                      {/* Right Cell: Slug + Passwords */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <span className="font-bold text-sm text-pink-100 font-mono tracking-wide">/{t.slug}</span>

                          {/* Visitor Password */}
                          <button
                            type="button"
                            onClick={() => handleCopyPassword(t.sitePassword || '', 'كلمة سر الزائر')}
                            title="اضغط لنسخ كلمة سر الزائر"
                            className="inline-flex items-center px-2.5 py-1 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-lg text-pink-300 font-mono text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95"
                          >
                            {t.sitePassword || '-'}
                          </button>

                          {/* Admin Password */}
                          <button
                            type="button"
                            onClick={() => handleCopyPassword(t.adminPassword || '', 'كلمة سر الأدمن')}
                            title="اضغط لنسخ كلمة سر الأدمن"
                            className="inline-flex items-center px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95"
                          >
                            {t.adminPassword || '-'}
                          </button>
                        </div>
                      </td>

                      {/* Left Cell: Actions strictly pinned to the left edge */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-left w-1">
                        <div className="flex items-center justify-end gap-2 shrink-0">
                          <a
                            href={`/${t.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-lg text-xs text-pink-300 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>الموقع</span>
                          </a>

                          <a
                            href={`/${t.slug}/admin`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>لوحة التحكم</span>
                          </a>

                          <button
                            onClick={() => handleToggleStatus(t.slug, t.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                              t.status === 'active'
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/20'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
                            }`}
                          >
                            {t.status === 'active' ? 'تعطيل' : 'تفعيل'}
                          </button>

                          <button
                            onClick={() => setTenantToDelete({ slug: t.slug, name: t.slug })}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Add Site (Bottom Right) */}
      <button
        onClick={() => setShowCreateModal(true)}
        title="إنشاء موقع جديد"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-white/20 cursor-pointer"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-[#1c0617] border border-pink-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative cursor-default">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 left-4 p-2 text-pink-400/60 hover:text-pink-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-pink-100 mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-pink-400" />
              <span>إنشاء موقع رومانسي جديد</span>
            </h3>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-pink-300/80 mb-1">
                  رابط الموقع (Slug بالإنجليزية)
                </label>
                <input
                  type="text"
                  value={singleName}
                  onChange={(e) => handleSingleNameChange(e.target.value)}
                  placeholder="ahmed-loly"
                  className="w-full bg-[#130312] border border-pink-500/20 rounded-xl px-4 py-2.5 text-xs text-pink-100 focus:outline-none focus:border-pink-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300/80 mb-1">
                  كلمة سر الموقع للزائر
                </label>
                <input
                  type="text"
                  value={newSitePass}
                  onChange={(e) => setNewSitePass(e.target.value)}
                  placeholder="love"
                  className="w-full bg-[#130312] border border-pink-500/20 rounded-xl px-4 py-2.5 text-xs text-pink-100 focus:outline-none focus:border-pink-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300/80 mb-1">
                  كلمة سر لوحة تحكم الأدمن
                </label>
                <input
                  type="text"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="love"
                  className="w-full bg-[#130312] border border-pink-500/20 rounded-xl px-4 py-2.5 text-xs text-pink-100 focus:outline-none focus:border-pink-500/50"
                />
              </div>

              {createError && (
                <p className="text-rose-400 text-xs font-bold">{createError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-pink-600/20 transition-all cursor-pointer"
              >
                تأكيد الإنشاء 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Site Modal */}
      {showMainSiteModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMainSiteModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-[#1c0617] border border-amber-500/30 rounded-3xl p-6 max-w-sm w-full text-center relative cursor-default">
            <button
              onClick={() => setShowMainSiteModal(false)}
              className="absolute top-4 left-4 p-2 text-pink-400/60 hover:text-pink-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-amber-200 mb-2">الموقع الرئيسي 🔑</h3>
            <p className="text-xs text-pink-300/70 mb-4 font-mono">/soulove</p>
            <div className="space-y-2 mb-4 text-right">
              <button
                type="button"
                onClick={() => handleCopyPassword(mainSiteTenant.sitePassword || 'love', 'كلمة سر الزائر')}
                className="w-full flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-pink-500/20 text-xs cursor-pointer hover:bg-black/60 transition-colors"
              >
                <span className="text-pink-300/80">كلمة سر الزائر:</span>
                <span className="font-mono font-bold text-pink-200">{mainSiteTenant.sitePassword || 'love'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopyPassword(mainSiteTenant.adminPassword || 'love', 'كلمة سر الأدمن')}
                className="w-full flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-pink-500/20 text-xs cursor-pointer hover:bg-black/60 transition-colors"
              >
                <span className="text-pink-300/80">كلمة سر الأدمن:</span>
                <span className="font-mono font-bold text-amber-200">{mainSiteTenant.adminPassword || 'love'}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/soulove"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs transition-colors text-center"
              >
                زيارة الموقع
              </a>
              <a
                href="/soulove/admin"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-colors text-center"
              >
                لوحة التحكم
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {tenantToDelete && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setTenantToDelete(null);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-[#1c0617] border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full text-center cursor-default">
            <h3 className="text-base font-bold text-rose-200 mb-2">تأكيد حذف الموقع ⚠️</h3>
            <p className="text-xs text-pink-300/70 mb-6 font-mono">
              هل أنت متأكد من حذف موقع "/{tenantToDelete.slug}" بشكل نهائي؟
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  handleDeleteClient(tenantToDelete.slug);
                  setTenantToDelete(null);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                نعم، احذف
              </button>
              <button
                onClick={() => setTenantToDelete(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-pink-200 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-[#1c0617] border border-pink-500/30 rounded-3xl p-6 max-w-sm w-full text-center cursor-default">
            <h3 className="text-base font-bold text-pink-200 mb-2">تسجيل الخروج</h3>
            <p className="text-xs text-pink-300/70 mb-6">
              هل تريد تسجيل الخروج من لوحة التحكم الملكية؟
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutModal(false);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                تأكيد الخروج
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-pink-200 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
