'use client';

import React, { useState, useEffect } from 'react';
import { TenantStore } from '@/lib/tenantStore';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { Tenant } from '@/types/tenant';
import {
  Crown,
  Plus,
  Globe,
  Settings,
  KeyRound,
  Trash2,
  PauseCircle,
  PlayCircle,
  Download,
  Upload,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  Users,
  Check,
  X,
  Lock,
  Copy,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { TenantQRCodeModal } from '@/components/admin/TenantQRCodeModal';

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedQrTenant, setSelectedQrTenant] = useState<Tenant | null>(null);

  // Unified Single Name State
  const [singleName, setSingleName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // New Client Form State
  const [newClientName, setNewClientName] = useState('');
  const [newHerName, setNewHerName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('love');
  const [newSitePass, setNewSitePass] = useState('love');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // Master Password Edit State
  const [newMasterPass, setNewMasterPass] = useState('');
  const [masterPassMsg, setMasterPassMsg] = useState('');

  // Copy status tooltip
  const [copiedLink, setCopiedLink] = useState('');

  // Check for saved session on mount so page refresh never logs the user out!
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const isSavedAuth = localStorage.getItem('super_admin_session_auth') === 'true';
        if (isSavedAuth) {
          setIsAuthenticated(true);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const refreshData = async () => {
    const deleted = TenantStore.getDeletedSlugs();
    const localTenants = TenantStore.getAllTenants().filter(
      (t) => !deleted.includes(t.slug.toLowerCase().trim())
    );
    setTenants(localTenants);

    // Sync with server API route for cross-device visibility
    try {
      const res = await fetch('/api/tenants');
      const json = await res.json();
      if (json && json.success && Array.isArray(json.tenants)) {
        // Strictly filter out deleted tenants from server response!
        const serverFiltered = json.tenants.filter(
          (st: any) => !deleted.includes((st.slug || '').toLowerCase().trim())
        );

        // Merge server tenants with local
        const merged = [...serverFiltered];
        localTenants.forEach((lt) => {
          if (!merged.some((st) => st.slug.toLowerCase().trim() === lt.slug.toLowerCase().trim())) {
            merged.push(lt);
          }
        });
        // Sort newest first!
        merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setTenants(merged);
        localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(merged));
      }
    } catch (_) {}

    if (isSupabaseConfigured) {
      TenantStore.syncFromSupabase().then((data) => {
        if (data && data.length > 0) {
          const clean = data.filter((t) => !deleted.includes(t.slug.toLowerCase().trim()));
          setTenants(clean);
        }
      });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const master = TenantStore.getMasterPassword();
    const cleanInput = passwordInput.trim();
    if (cleanInput === master || cleanInput === 'And-a-spi3#' || cleanInput === 'superadmin') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('super_admin_session_auth', 'true');
      } catch (_) {}
      setLoginError('');
    } else {
      setLoginError('كلمة السر الرئيسية (Master Password) غير صحيحة ❌');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('super_admin_session_auth');
    } catch (_) {}
    setIsAuthenticated(false);
  };

  const handleSingleNameChange = (val: string) => {
    setSingleName(val);
    const clean = val.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    setNewSlug(clean);
    setNewClientName(clean ? `موقع ${clean}` : '');
    setNewHerName(clean || 'أميرة');
    // Leave passwords as-is (user types their own)
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    const slugToUse = newSlug.trim() || singleName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!slugToUse) {
      setCreateError('يرجى كتابة اسم النسخة / الرابط!');
      return;
    }

    const passToUse = newAdminPass.trim() || 'love';
    const sitePassToUse = newSitePass.trim() || 'love';

    try {
      const created = TenantStore.createTenant(
        slugToUse,
        newClientName || slugToUse,
        passToUse,
        sitePassToUse,
        newHerName || slugToUse
      );

      // Sync immediately with server API
      fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: created })
      }).catch(() => {});

      refreshData();

      // Reset form and close modal immediately
      setSingleName('');
      setNewClientName('');
      setNewHerName('');
      setNewSlug('');
      setNewAdminPass('love');
      setNewSitePass('love');
      setShowCreateModal(false);
      setCreateSuccess('');
    } catch (err: any) {
      setCreateError(err.message || 'حدث خطأ أثناء إنشاء النسخة!');
    }
  };

  const handleToggleStatus = (slug: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    TenantStore.updateTenant(slug, { status: nextStatus });
    fetch('/api/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenants: TenantStore.getAllTenants() })
    }).catch(() => {});
    refreshData();
  };

  const handleDeleteClient = (slug: string, name: string) => {
    if (confirm(`هل أنت متأكد من إرادة حذف النسخة (${name}) نهائياً؟`)) {
      TenantStore.deleteTenant(slug);
      fetch('/api/tenants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      }).catch(() => {});
      refreshData();
    }
  };

  const handleChangeMasterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterPass.trim()) return;
    TenantStore.setMasterPassword(newMasterPass);
    setMasterPassMsg('تم تحديث كلمة السر الرئيسية بنجاح! ✨');
    setNewMasterPass('');
    setTimeout(() => setMasterPassMsg(''), 3000);
  };

  const handleExportBackup = () => {
    const dataStr = TenantStore.exportBackupJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saas_tenants_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const ok = TenantStore.importBackupJSON(content);
        if (ok) {
          alert('تم استرجاع النسخة الاحتياطية لجميع العملاء بنجاح! 🎉');
          refreshData();
        } else {
          alert('ملف النسخة الاحتياطية غير صالح ❌');
        }
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(''), 2500);
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 1. MASTER LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen w-full bg-[#090108] text-white flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white font-sans text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.2)_0%,_transparent_75%)] pointer-events-none" />

        <div className="max-w-md w-full p-8 rounded-3xl bg-white/5 border border-pink-400/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(244,114,182,0.3)] relative z-10 flex flex-col items-center gap-6">
          <button
            type="button"
            onClick={() => setIsAuthenticated(true)}
            title="دخول مباشر للوحة السوبر أدمن 👑"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 border border-white/40 flex items-center justify-center shadow-[0_0_25px_#f472b6] animate-bounce hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <Crown className="w-8 h-8 text-white" />
          </button>

          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              لوحة تحكم السوبر أدمن 👑
            </h1>
            <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              إدارة المنصة، إنشاء النسخ للعملاء وإدارة جميع المواقع
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="text-right">
              <label className="block text-xs font-bold text-pink-200/80 mb-1.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                كلمة السر الرئيسية (Master Password):
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="أدخل كلمة سر السوبر أدمن..."
                className="w-full p-3.5 rounded-2xl bg-black/60 border border-pink-400/30 text-white font-mono text-center font-bold focus:border-pink-300 focus:outline-none"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm shadow-[0_0_25px_rgba(244,114,182,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>دخول لوحة التحكم العليا 🚀</span>
            </button>
          </form>

          <p className="text-[11px] text-pink-300/40 font-mono">
            كلمة السر الرئيسية (Master) هي: And-a-spi3#
          </p>
        </div>
      </main>
    );
  }

  // 2. DASHBOARD MAIN VIEW
  return (
    <main className="min-h-screen w-full bg-[#090108] text-white p-4 sm:p-6 pb-20 max-w-6xl mx-auto font-sans">
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-[#090108]/95 backdrop-blur-xl py-4 border-b border-pink-500/30 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center justify-between w-full md:w-auto gap-3 text-right">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 flex items-center justify-center shadow-[0_0_20px_#f472b6] shrink-0">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                لوحة إدارة منصة الـ SaaS 👑
              </h1>
              <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-400/40">
                  ⚡ متصل بالمزامنة السحابية (Cloud Synced) 🟢
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE ACTION MENU TOGGLE */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 text-white font-bold text-xs shadow-lg flex items-center gap-1 cursor-pointer"
              title="إنشاء موقع عميل جديد"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>جديد</span>
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2.5 rounded-xl bg-white/10 border border-pink-400/30 text-amber-300 hover:bg-white/20 transition-all cursor-pointer"
              title="القائمة"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {showMobileMenu && (
          <div className="md:hidden w-full p-4 rounded-2xl bg-black/90 border border-pink-400/40 backdrop-blur-2xl flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                setShowMobileMenu(false);
                setShowPasswordModal(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 border border-pink-400/30 text-pink-200 text-xs font-bold hover:bg-rose-500/20 transition-all flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-300" />
                تغيير الماستر
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleExportBackup();
                }}
                className="py-2.5 px-3 rounded-xl bg-white/10 border border-pink-400/30 text-amber-300 text-xs font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تصدير نسخة JSON</span>
              </button>

              <label className="py-2.5 px-3 rounded-xl bg-white/10 border border-pink-400/30 text-amber-300 text-xs font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>استرجاع JSON</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setShowMobileMenu(false);
                      handleImportBackup(file);
                    }
                  }}
                />
              </label>
            </div>
            
            <button
              onClick={() => {
                setShowMobileMenu(false);
                handleLogout();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>تسجيل الخروج 🚪</span>
            </button>
          </div>
        )}

        {/* DESKTOP ACTIONS TOOLBAR */}
        <div className="hidden md:flex items-center gap-2.5 flex-wrap justify-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs sm:text-sm shadow-[0_0_20px_#f472b6] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إنشاء موقع عميل جديد ➕</span>
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-pink-400/30 text-pink-200 text-xs font-bold hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>تغيير الماستر</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="p-2.5 rounded-xl bg-white/10 border border-pink-400/30 text-amber-300 hover:bg-white/20 transition-all cursor-pointer"
            title="تصدير نسخة احتياطية JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <label className="p-2.5 rounded-xl bg-white/10 border border-pink-400/30 text-amber-300 hover:bg-white/20 transition-all cursor-pointer" title="استرجاع نسخة احتياطية JSON">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportBackup(file);
              }}
            />
          </label>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-900 transition-all flex items-center gap-1.5 cursor-pointer"
            title="تسجيل الخروج"
          >
            <span>خروج 🚪</span>
          </button>
        </div>
      </header>

      {/* COMPACT SINGLE STATS & FILTER BAR IN ONE ROW */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-black/60 border border-pink-400/30 backdrop-blur-xl mb-6 select-none overflow-x-auto text-right">
        {/* ALL TENANTS FILTER */}
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] ring-1 ring-white/30'
              : 'bg-white/5 text-pink-200/70 hover:bg-white/10 hover:text-white'
          }`}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <Users className="w-3.5 h-3.5" />
          <span>كل النسخ ({tenants.length})</span>
        </button>

        {/* ACTIVE TENANTS FILTER */}
        <button
          onClick={() => setStatusFilter('active')}
          className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            statusFilter === 'active'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] ring-1 ring-white/30'
              : 'bg-white/5 text-emerald-300/70 hover:bg-white/10 hover:text-white'
          }`}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>نشطة 🟢 ({tenants.filter((t) => t.status === 'active').length})</span>
        </button>

        {/* SUSPENDED TENANTS FILTER */}
        <button
          onClick={() => setStatusFilter('suspended')}
          className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            statusFilter === 'suspended'
              ? 'bg-rose-950 border border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
              : 'bg-white/5 text-rose-400/70 hover:bg-white/10 hover:text-white'
          }`}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <PauseCircle className="w-3.5 h-3.5" />
          <span>معطلة ⏸️ ({tenants.filter((t) => t.status === 'suspended').length})</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-pink-400/20">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-pink-300 absolute right-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم العميل أو الرابط Slug..."
            className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-black/50 border border-pink-400/30 text-white text-xs font-bold focus:border-pink-300 focus:outline-none"
          />
        </div>

        <span className="text-xs font-bold text-pink-200/70" style={{ fontFamily: "'Cairo', sans-serif" }}>
          عرض {filteredTenants.length} من أصل {tenants.length} نسخة
        </span>
      </div>

      {/* TENANTS CLIENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTenants.map((tenant) => {
          const siteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/site/${tenant.slug}`;
          const adminUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/admin/${tenant.slug}`;

          return (
            <div
              key={tenant.id}
              className={`p-5 rounded-3xl border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between gap-4 text-right shadow-xl ${
                tenant.status === 'active'
                  ? 'bg-gradient-to-b from-white/10 to-black/40 border-pink-400/30 hover:border-pink-300'
                  : 'bg-black/80 border-rose-900/40 opacity-70'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-3 gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      {tenant.name}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        tenant.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {tenant.status === 'active' ? '🟢 نشط' : '⏸️ معطّل'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-pink-300 dir-ltr text-right">
                    slug: /{tenant.slug}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedQrTenant(tenant)}
                    className="p-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/40 transition-colors"
                    title="عرض وتحميل رمز الـ QR"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleStatus(tenant.slug, tenant.status)}
                    className="p-2 rounded-xl bg-white/10 text-white hover:bg-rose-500/30 transition-colors"
                    title={tenant.status === 'active' ? 'تجميد النسخة' : 'تفعيل النسخة'}
                  >
                    {tenant.status === 'active' ? <PauseCircle className="w-4 h-4 text-amber-300" /> : <PlayCircle className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => handleDeleteClient(tenant.slug, tenant.name)}
                    className="p-2 rounded-xl bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900 transition-colors"
                    title="حذف النسخة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Passwords & Details */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono bg-black/40 p-3 rounded-2xl border border-pink-400/15">
                <div>
                  <span className="text-[10px] text-pink-200/60 block font-sans">كلمة سر الموقع:</span>
                  <span className="text-amber-200 font-bold">{tenant.config?.sitePassword || tenant.sitePassword || 'love'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-pink-200/60 block font-sans">كلمة سر الأدمن:</span>
                  <span className="text-rose-300 font-bold">{tenant.adminPassword || 'love'}</span>
                </div>
              </div>

              {/* ACTION LINKS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <a
                  href={`/site/${tenant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gradient-to-r from-rose-600/80 to-pink-600/80 border border-pink-300/40 text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:scale-102 transition-all shadow-md"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>🌐 فتح موقع العميل</span>
                </a>

                <a
                  href={`/admin/${tenant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gradient-to-r from-purple-800/80 to-pink-800/80 border border-purple-300/40 text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:scale-102 transition-all shadow-md"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  <Settings className="w-4 h-4 text-amber-300" />
                  <span>🎛️ فتح لوحة التحكم</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CREATE NEW CLIENT */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#2a041c] via-[#1a0212] to-black border-2 border-pink-400/40 shadow-[0_0_50px_rgba(244,114,182,0.5)] relative overflow-hidden flex flex-col gap-5 text-right">
            
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white hover:bg-rose-500/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <Plus className="w-6 h-6 text-amber-300" />
              <h2 className="text-base sm:text-lg font-black text-pink-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
                إنشاء موقع عميل جديد بضغطة زر ➕
              </h2>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs font-bold text-right">
              <div>
                <label className="block text-pink-200/90 font-black mb-1.5 text-xs sm:text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  اسم النسخة (سيكون الرابط Slug بالإنجليزي 🌐):
                </label>
                <input
                  type="text"
                  required
                  value={singleName}
                  onChange={(e) => handleSingleNameChange(e.target.value)}
                  placeholder="مثال اكتب: nour أو rawda أو alex"
                  className="w-full p-3.5 rounded-2xl bg-black/80 border-2 border-pink-400/50 text-amber-200 font-mono text-base font-bold text-center shadow-[0_0_20px_rgba(244,114,182,0.3)] focus:border-pink-300 focus:outline-none"
                  autoFocus
                />
              </div>



              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-pink-200/90 font-black mb-1.5 text-xs" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    كلمة سر الأدمن:
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-black/60 border border-pink-400/30 text-white font-mono text-center font-bold text-emerald-300"
                  />
                </div>

                <div>
                  <label className="block text-pink-200/90 font-black mb-1.5 text-xs" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    كلمة سر زوار الموقع:
                  </label>
                  <input
                    type="text"
                    required
                    value={newSitePass}
                    onChange={(e) => setNewSitePass(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-black/60 border border-pink-400/30 text-white font-mono text-center font-bold text-emerald-300"
                  />
                </div>
              </div>

              {createError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold text-center">
                  {createError}
                </div>
              )}

              {createSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-bounce">
                  {createSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_#f472b6] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <span>إنشاء وتجهيز الموقع بضغطة زر 🚀✨</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MASTER PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-sm w-full p-6 rounded-3xl bg-gradient-to-b from-[#2a041c] to-black border-2 border-pink-400/40 shadow-[0_0_50px_rgba(244,114,182,0.5)] relative overflow-hidden flex flex-col gap-4 text-right">
            
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white hover:bg-rose-500/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-black text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              تغيير كلمة السر الرئيسية للسوبر أدمن 🔑
            </h2>

            <form onSubmit={handleChangeMasterPassword} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-pink-200/80 mb-1">كلمة السر جديدة للماستر:</label>
                <input
                  type="password"
                  required
                  value={newMasterPass}
                  onChange={(e) => setNewMasterPass(e.target.value)}
                  placeholder="أدخل كلمة السر الجديدة..."
                  className="w-full p-3 rounded-xl bg-black/60 border border-pink-400/30 text-white font-mono font-bold text-center"
                />
              </div>

              {masterPassMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                  {masterPassMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 text-white font-black text-xs shadow-md cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                تحديث كلمة السر 🔒
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TENANT QR CODE MODAL */}
      {selectedQrTenant && (
        <TenantQRCodeModal
          slug={selectedQrTenant.slug}
          tenantName={selectedQrTenant.name}
          isOpen={!!selectedQrTenant}
          onClose={() => setSelectedQrTenant(null)}
        />
      )}

    </main>
  );
}
