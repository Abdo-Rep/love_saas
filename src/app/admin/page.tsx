'use client';

import React, { useState, useRef } from 'react';
import { useConfig } from '@/lib/configContext';
import { useTenant } from '@/lib/tenantContext';
import { TenantStore } from '@/lib/tenantStore';
import { getPlayableAudioUrl } from '@/lib/getPlayableAudioUrl';
import {
  KeyRound,
  Settings,
  Sparkles,
  Save,
  Calendar,
  Mail,
  Camera,
  Compass,
  FileText,
  Upload,
  Check,
  Plus,
  Trash2,
  Music,
  Eye,
  EyeOff,
  Copy,
  Mic,
  Square
} from 'lucide-react';

import { TenantQRCodeModal } from '@/components/admin/TenantQRCodeModal';

const TABS_CONFIG = [
  { id: 1, name: 'عام', icon: KeyRound },
  { id: 2, name: 'النجوم', icon: Sparkles },
  { id: 3, name: 'العداد', icon: Calendar },
  { id: 4, name: 'الرسايل', icon: Mail },
  { id: 5, name: 'الألبوم', icon: Camera },
  { id: 6, name: 'الأغنية', icon: Music },
  { id: 7, name: 'الأمنيات', icon: Compass },
  { id: 8, name: 'الرسالة', icon: FileText },
];

export default function AdminPage() {
  const { config, updateConfig } = useConfig();
  let tenantCtx: any = null;
  try {
    tenantCtx = useTenant();
  } catch {}

  const [activeStep, setActiveStep] = useState<number>(1);
  const [saveMessage, setSaveMessage] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Password Visibility & Copy States
  const [showSitePassword, setShowSitePassword] = useState<boolean>(false);
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const [copyToast, setCopyToast] = useState<string>('');

  const handleCopyText = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyToast(`تم نسخ ${label} بنجاح ✨`);
    setTimeout(() => setCopyToast(''), 2500);
  };

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPassInput, setAdminPassInput] = useState<string>('');
  const [adminAuthError, setAdminAuthError] = useState<string>('');

  const currentSlug = tenantCtx?.currentTenant?.slug || 'rawda';
  const expectedAdminPass = tenantCtx?.currentTenant?.adminPassword || config.adminPassword || 'love';

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = adminPassInput.trim();
    if (!cleanInput) {
      setAdminAuthError('يرجى كتابة كلمة السر ❌');
      return;
    }

    setAdminAuthError('');

    try {
      // 1. Fetch real tenant auth record from Database / API
      let realAdminPass = expectedAdminPass;
      const res = await fetch('/api/tenants');
      if (res.ok) {
        const json = await res.json();
        if (json?.success && Array.isArray(json.tenants)) {
          const found = json.tenants.find((t: any) => (t.slug || '').toLowerCase().trim() === currentSlug.toLowerCase().trim());
          if (found) {
            realAdminPass = found.adminPassword || found.admin_password || realAdminPass;
          }
        }
      }

      // 2. Verify input password against DB record
      if (cleanInput === realAdminPass) {
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem(`admin_authenticated_${currentSlug}`, 'true');
        } catch {}
        setAdminAuthError('');
      } else {
        setAdminAuthError('كلمة سر الأدمن غير صحيحة ❌ غير مسموح بالدخول!');
      }
    } catch {
      // Fallback check against tenant context
      if (cleanInput === expectedAdminPass) {
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem(`admin_authenticated_${currentSlug}`, 'true');
        } catch {}
        setAdminAuthError('');
      } else {
        setAdminAuthError('كلمة سر الأدمن غير صحيحة ❌');
      }
    }
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem(`admin_authenticated_${currentSlug}`);
    } catch {}
    setIsAdminAuthenticated(false);
  };

  const handleSave = () => {
    setSaveMessage('تم حفظ وتطبيق جميع التغييرات بنجاح على الموقع بالكامل ✨💖');
    setTimeout(() => setSaveMessage(''), 3500);
  };

  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);

  // LIVE MICROPHONE RECORDER STATES FOR ADMIN
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordingTime, setVoiceRecordingTime] = useState(0);
  const voiceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceAudioChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<any>(null);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      voiceMediaRecorderRef.current = mediaRecorder;
      voiceAudioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          voiceAudioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(voiceAudioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          updateConfig({ voiceAudioUrl: base64Audio });
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
      setVoiceRecordingTime(0);

      voiceTimerRef.current = setInterval(() => {
        setVoiceRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      alert('تعذر فتح الميكروفون. يرجى التأكد من السماح بإذن الوصول للميكروفون بمتصفحك.');
    }
  };

  const stopVoiceRecording = () => {
    if (voiceMediaRecorderRef.current && isRecordingVoice) {
      voiceMediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    }
  };

  const formatVoiceTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  const uploadAudioToCloud = async (file: File): Promise<string> => {
    setIsUploadingAudio(true);

    const readFileAsDataUrl = (fileToRead: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(fileToRead);
      });
    };

    try {
      const slug = tenantCtx?.tenant?.slug || 'default';
      const CHUNK_SIZE = 2.5 * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const uploadId = `up_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunkBlob = file.slice(start, end, file.type);

        const formData = new FormData();
        formData.append('file', chunkBlob, file.name);
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', totalChunks.toString());

        const res = await fetch(`/api/upload?category=music&slug=${encodeURIComponent(slug)}`, {
          method: 'POST',
          body: formData,
        });

        const json = await res.json().catch(() => ({ error: 'فشل الرفع إلى السيرفر' }));

        if (res.ok && json.success) {
          if (json.isComplete && (json.proxyUrl || json.url)) {
            setIsUploadingAudio(false);
            return json.proxyUrl || json.url;
          }
        } else {
          // If server upload fails, seamlessly fallback to Data URL
          const dataUrl = await readFileAsDataUrl(file);
          setIsUploadingAudio(false);
          return dataUrl;
        }
      }
    } catch (_) {}

    // Fallback if network or server error occurred
    const fallbackUrl = await readFileAsDataUrl(file);
    setIsUploadingAudio(false);
    return fallbackUrl;
  };

  // Client-side WebP compression helper
  const compressToWebP = (file: File, quality = 0.85, maxWidth = 1600): Promise<string> => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const webpData = canvas.toDataURL('image/webp', quality);
            resolve(webpData);
          } else {
            resolve(img.src);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  // Image Upload handler (Compressed to WebP)
  const handleImageUpload = async (index: number, file: File) => {
    const webp = await compressToWebP(file, 0.85);
    const newPhotos = [...(config.memoryPhotos || [])];
    if (newPhotos[index]) {
      newPhotos[index].image = webp;
      updateConfig({ memoryPhotos: newPhotos });
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <main className="min-h-screen w-full bg-[#090108] text-white flex items-center justify-center p-4 font-sans dir-rtl">
        <div className="max-w-md w-full p-8 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 shadow-[0_0_50px_rgba(244,63,94,0.3)] space-y-6 text-center backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center mx-auto text-pink-300">
            <KeyRound className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              دخول لوحة تحكم الموقع 🔑
            </h2>
            <p className="text-xs text-pink-200/70 mt-1 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              أدخل كلمة سر الأدمن الخاصة بموقعك للتعديل
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="كلمة سر الأدمن..."
                value={adminPassInput}
                onChange={(e) => setAdminPassInput(e.target.value)}
                className="w-full p-4 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-amber-300 font-mono font-bold text-center text-lg focus:border-amber-300 transition-all shadow-inner"
                autoFocus
              />
            </div>

            {adminAuthError && (
              <p className="text-xs font-bold text-rose-400 animate-bounce" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {adminAuthError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-sm border border-white/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_#f472b6] cursor-pointer"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              دخول لوحة التحكم 🚀
            </button>
          </form>
        </div>
      </main>
    );
  }

  const tabs = TABS_CONFIG;

  return (
    <main className="min-h-screen w-full bg-[#090108] text-white p-4 pb-20 max-w-4xl mx-auto font-sans dir-rtl relative">
      
      {/* FLOATING SAVE TOAST NOTIFICATION */}
      {saveMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 p-4 px-6 rounded-2xl bg-emerald-950/95 border-2 border-emerald-400 text-emerald-100 text-xs sm:text-sm font-black shadow-[0_0_40px_rgba(16,185,129,0.6)] backdrop-blur-xl animate-bounce text-center">
          {saveMessage}
        </div>
      )}

      {/* STICKY TOP HEADER WITH SAVE & LOGOUT LINKS */}
      <header className="sticky top-0 z-40 bg-[#090108]/95 backdrop-blur-xl py-3.5 border-b border-pink-500/30 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-3 text-right">
          <Settings className="w-6 h-6 text-pink-400 shrink-0" />
          <div>
            <h1 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              لوحة تحكم الموقع
            </h1>
            <p className="text-[11px] text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              تخصيص كامل للنصوص، أزرار الانتقال، الصور، والأغاني!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs sm:text-sm border border-white/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_#f472b6] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <Save className="w-4 h-4 text-white" />
            <span>حفظ التغييرات</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-pink-400/40 text-amber-300 font-bold text-xs hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <span>رمز QR</span>
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-bold text-xs hover:bg-red-900/60 transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-md"
            title="تسجيل الخروج من لوحة التحكم"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </header>

      {/* ADVANCED CUSTOMIZATION TABS BAR (ICON + TEXT) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeStep === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStep(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.6)] scale-105'
                  : 'bg-white/5 border border-pink-400/20 text-pink-200 hover:bg-white/10'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: DUAL PASSWORDS GATE */}
      {activeStep === 1 && (
        <div className="space-y-5 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 p-6 backdrop-blur-xl shadow-2xl">
          <div className="border-b border-pink-500/20 pb-3 space-y-2">
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <KeyRound className="w-5 h-5 text-pink-400" />
              <span>كلمات السر</span>
            </h3>

            {/* ALERT WARNING BADGE */}
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/50 text-amber-200 text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <span className="text-base shrink-0">⚠️</span>
              <span>تنبيه: لا يسمح بأستخدام الحروف العربية أو المسافات في كلمات السر، تأكد من نسخ كلمة السر قبل الخروج.</span>
            </div>
          </div>

          {copyToast && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-green-500/20 to-teal-500/30 border border-green-400/50 text-green-200 font-extrabold text-xs text-center animate-fadeIn shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              {copyToast}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-bold">
            {/* SITE PASSWORD FOR HER */}
            <div className="space-y-2">
              <label className="block text-amber-300 text-sm font-extrabold">كلمة سر دخول الموقع لحبيبتك:</label>
              <div className="relative flex items-center">
                <input
                  type={showSitePassword ? 'text' : 'password'}
                  placeholder="اكتب كلمة سر الموقع هنا..."
                  value={config.sitePassword ?? ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[\u0600-\u06FF\s]/g, '');
                    updateConfig({ sitePassword: val });
                    if (tenantCtx?.currentTenant) {
                      TenantStore.updateTenant(tenantCtx.currentTenant.slug, { sitePassword: val });
                    }
                  }}
                  className="w-full p-4 pl-24 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-amber-300 font-mono font-black text-base focus:border-amber-300 transition-all shadow-inner"
                />
                <div className="absolute left-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowSitePassword(!showSitePassword)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-pink-200 transition cursor-pointer"
                    title={showSitePassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
                  >
                    {showSitePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText(config.sitePassword || 'love', 'كلمة سر الموقع')}
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-amber-300 transition cursor-pointer"
                    title="نسخ كلمة السر"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <span className="text-[11px] text-pink-200/60 block">تكتبها حبيبتك في بداية الصفحة لدخول الموقع.</span>
            </div>

            {/* ADMIN PASSWORD FOR YOU */}
            <div className="space-y-2">
              <label className="block text-rose-300 text-sm font-extrabold">كلمة سر لوحة التحكم (لك أنت):</label>
              <div className="relative flex items-center">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  placeholder="اكتب كلمة سر لوحة التحكم..."
                  value={config.adminPassword ?? tenantCtx?.currentTenant?.adminPassword ?? ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[\u0600-\u06FF\s]/g, '');
                    updateConfig({ adminPassword: val });
                    if (tenantCtx?.currentTenant) {
                      TenantStore.updateTenant(tenantCtx.currentTenant.slug, { adminPassword: val });
                    }
                  }}
                  className="w-full p-4 pl-24 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-rose-300 font-mono font-black text-base focus:border-rose-300 transition-all shadow-inner"
                />
                <div className="absolute left-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-pink-200 transition cursor-pointer"
                    title={showAdminPassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText(tenantCtx?.currentTenant?.adminPassword || config.adminPassword || 'love', 'كلمة سر لوحة التحكم')}
                    className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/40 text-rose-300 transition cursor-pointer"
                    title="نسخ كلمة السر"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <span className="text-[11px] text-pink-200/60 block">تستخدمها أنت فقط للدخول والتعديل في هذه اللوحة.</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: STAR CONSTELLATION NAME */}
      {activeStep === 2 && (
        <div className="space-y-5 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 p-6 backdrop-blur-xl shadow-2xl">
          <div className="border-b border-pink-500/20 pb-3 space-y-1">
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span>2. اسم نجمة السماء والبرج الخاص بها</span>
            </h3>
            <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              💡 شاشة سماء النجوم الرائعة! تُظهر اسم حبيبتك منقوشاً بالنجوم اللامعة في السماء.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-bold">
            <div>
              <label className="block text-amber-300 text-sm mb-1.5 font-extrabold">🌟 اسم النجمة المضيء:</label>
              <input
                type="text"
                value={config.constellationName}
                onChange={(e) => updateConfig({ constellationName: e.target.value })}
                placeholder="مثال: RAWDA أو NOUR"
                className="w-full p-4 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-amber-200 font-mono font-black text-base uppercase focus:border-amber-300 transition-all shadow-inner"
              />
              <span className="text-[11px] text-pink-200/60 mt-1 block">يُكتب بأحرف لامعة في سماء النجوم.</span>
            </div>

            <div>
              <label className="block text-pink-200 text-sm mb-1.5 font-extrabold">💖 عنوان الصفحة الرئيسي:</label>
              <input
                type="text"
                value={config.constellationTitle}
                onChange={(e) => updateConfig({ constellationTitle: e.target.value })}
                className="w-full p-4 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-white font-black text-base"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-pink-200 text-sm mb-1.5 font-extrabold">💌 الرسالة الشاعرية أسفل اسم النجمة:</label>
              <textarea
                rows={3}
                value={config.constellationMessage}
                onChange={(e) => updateConfig({ constellationMessage: e.target.value })}
                className="w-full p-4 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-white leading-relaxed text-sm font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-pink-200/80 mb-1.5">نص زر الانتقال للعداد:</label>
              <input
                type="text"
                value={config.constellationButtonText}
                onChange={(e) => updateConfig({ constellationButtonText: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white font-bold text-amber-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: LOVE COUNTER WITH ULTRA MODERN INTERACTIVE CALENDAR */}
      {activeStep === 3 && (
        <div className="space-y-5 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 p-6 backdrop-blur-xl shadow-2xl">
          <div className="border-b border-pink-500/20 pb-3 space-y-1">
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <Calendar className="w-5 h-5 text-pink-400" />
              <span>3. عداد الحب والتقويم التفاعلي البصري</span>
            </h3>
            <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              💡 يحسب الموقع تلقائياً وفي الوقت الفعلي عدد الأيام، الساعات، والدقائق التي مرت على حبكم من تاريخ ارتباطكم!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-bold">
            <div>
              <label className="block text-pink-200 text-sm mb-1.5 font-extrabold">💖 عنوان العداد الرئيسي:</label>
              <input
                type="text"
                value={config.counterTitle}
                onChange={(e) => updateConfig({ counterTitle: e.target.value })}
                className="w-full p-4 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-white font-black text-base"
              />
            </div>

            <div>
              <label className="block text-amber-300 text-sm mb-1.5 font-extrabold">✨ نص زر الانتقال للمظاريف:</label>
              <input
                type="text"
                value={config.counterButtonText}
                onChange={(e) => updateConfig({ counterButtonText: e.target.value })}
                className="w-full p-4 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-white font-black text-base"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-pink-200 text-sm mb-1.5 font-extrabold">💌 الاقتباس الشاعري أسفل العداد:</label>
              <textarea
                rows={2}
                value={config.counterQuote}
                onChange={(e) => updateConfig({ counterQuote: e.target.value })}
                className="w-full p-4 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-white leading-relaxed text-sm font-medium"
              />
            </div>
          </div>

          {/* COMPACT CLEAN DATE PICKER */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#25051b]/80 to-[#0c010c] border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <label className="block text-xs font-black text-amber-300">
                  📅 تاريخ بداية العلاقة:
                </label>
                <p className="text-[11px] text-pink-200/60 font-medium">
                  يحسب العداد الأيام والساعات في الوقت الفعلي من هذا التاريخ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="date"
                value={config.relationshipStartDate}
                onChange={(e) => {
                  if (e.target.value) {
                    updateConfig({ relationshipStartDate: e.target.value });
                  }
                }}
                className="w-full sm:w-auto p-3 rounded-xl bg-black/70 border-2 border-pink-400/40 text-amber-300 font-mono font-bold text-sm focus:border-pink-300 focus:outline-none cursor-pointer hover:border-pink-300/80 transition-all shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: OPEN WHEN LETTERS */}
      {activeStep === 4 && (
        <div className="space-y-5 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 p-6 backdrop-blur-xl shadow-2xl">
          <div className="border-b border-pink-500/20 pb-3 space-y-1">
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <Mail className="w-5 h-5 text-pink-400" />
              <span>4. رسايل الحب السرية</span>
            </h3>
            <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              💡 رسايل رومانسية سرية تفتحها حبيبتك عندما تشعر بـ (الشوق، الفرح، الحزن...). يمكن إظهار أو إخفاء أي رسالة!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold pb-2">
            <div>
              <label className="block text-pink-200/80 mb-1">عنوان المظاريف الرئيسي:</label>
              <input
                type="text"
                value={config.openWhenLettersTitle}
                onChange={(e) => updateConfig({ openWhenLettersTitle: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-black/40 border border-pink-400/30 text-white"
              />
            </div>
            <div>
              <label className="block text-pink-200/80 mb-1">نص زر الانتقال لألبوم الصور:</label>
              <input
                type="text"
                value={config.openWhenLettersButtonText}
                onChange={(e) => updateConfig({ openWhenLettersButtonText: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-black/40 border border-pink-400/30 text-white font-bold text-amber-200"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {config.openWhenLetters.map((letter, idx) => (
              <div
                key={letter.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 text-xs font-bold ${
                  letter.enabled !== false
                    ? 'bg-black/50 border-pink-400/30'
                    : 'bg-black/80 border-rose-900/40 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-200 font-extrabold">ظرف #{idx + 1} - {letter.badge}</span>
                    <span className="text-xl">{letter.icon}</span>
                  </div>

                  {/* VISUAL TOGGLE SWITCH CONTROL */}
                  <div
                    onClick={() => {
                      const newLetters = [...config.openWhenLetters];
                      newLetters[idx].enabled = letter.enabled === false ? true : false;
                      updateConfig({ openWhenLetters: newLetters });
                    }}
                    className="cursor-pointer flex items-center gap-2.5 bg-black/60 px-3.5 py-1.5 rounded-2xl border border-pink-400/30 hover:border-pink-300 transition-all select-none"
                  >
                    <span className={`text-xs font-black ${letter.enabled !== false ? 'text-emerald-300' : 'text-rose-400'}`}>
                      {letter.enabled !== false ? 'مفعّل (ظاهر في الموقع)' : 'غير مفعّل (مخفي)'}
                    </span>

                    <div
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                        letter.enabled !== false
                          ? 'bg-emerald-500 justify-end shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                          : 'bg-slate-800 border border-slate-600 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-pink-200/70 mb-1">عنوان الجواب:</label>
                    <input
                      type="text"
                      value={letter.title}
                      onChange={(e) => {
                        const newLetters = [...config.openWhenLetters];
                        newLetters[idx].title = e.target.value;
                        updateConfig({ openWhenLetters: newLetters });
                      }}
                      className="w-full p-2.5 rounded-lg bg-white/5 border border-pink-400/30 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-pink-200/70 mb-1">الشارة (Badge):</label>
                    <input
                      type="text"
                      value={letter.badge}
                      onChange={(e) => {
                        const newLetters = [...config.openWhenLetters];
                        newLetters[idx].badge = e.target.value;
                        updateConfig({ openWhenLetters: newLetters });
                      }}
                      className="w-full p-2.5 rounded-lg bg-white/5 border border-pink-400/30 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-pink-200/70 mb-1">نص الجواب الكامل:</label>
                    <textarea
                      rows={3}
                      value={letter.content}
                      onChange={(e) => {
                        const newLetters = [...config.openWhenLetters];
                        newLetters[idx].content = e.target.value;
                        updateConfig({ openWhenLetters: newLetters });
                      }}
                      className="w-full p-2.5 rounded-lg bg-white/5 border border-pink-400/30 text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: PHOTO GALLERY WITH DIRECT LOCAL FILE PICKER */}
      {activeStep === 5 && (
        <div className="space-y-5 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 p-6 backdrop-blur-xl shadow-2xl">
          <div className="border-b border-pink-500/20 pb-3 space-y-1">
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <Camera className="w-5 h-5 text-pink-400" />
              <span>5. ألبوم الصور والذكريات الساحرة</span>
            </h3>
            <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              💡 رفع اختيار صوركم الخاصة بضغطة زر وتعديل التعليق المكتوب تحت كل صورة الذكرى!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold pb-2">
            <div>
              <label className="block text-pink-200/80 mb-1">عنوان الألبوم الرئيسي (تغيير ذكريات منقوشة في القلب):</label>
              <input
                type="text"
                value={config.galleryTitle}
                onChange={(e) => updateConfig({ galleryTitle: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-black/40 border border-pink-400/30 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-pink-200/80 mb-1">نص زر الانتقال للتسجيل الصوتي:</label>
              <input
                type="text"
                value={config.galleryButtonText}
                onChange={(e) => updateConfig({ galleryButtonText: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-black/40 border border-pink-400/30 text-white font-bold text-amber-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-pink-500/20 pb-2">
            <span className="text-xs font-bold text-pink-200">الصور الحالية ({config.memoryPhotos.length})</span>
            <button
              onClick={() => {
                const newPhotos = [
                  ...(config.memoryPhotos || []),
                  {
                    id: Date.now(),
                    image: '/images/peasant_girl.jpg',
                    date: '١٤ فبراير ٢٠٢٤',
                    caption: 'لحظة جميلة محفورة في القلب والعقل ✨💖',
                    tag: 'ذكرى 🌸'
                  }
                ];
                updateConfig({ memoryPhotos: newPhotos });
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 text-white text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة صورة جديدة للألبوم</span>
            </button>
          </div>

          <div className="space-y-4">
            {config.memoryPhotos.map((photo, idx) => (
              <div key={photo.id} className="p-4 rounded-2xl bg-black/40 border border-pink-400/20 space-y-3 text-xs font-bold relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-1">
                  <span className="text-amber-200 font-extrabold">صورة الذكرى #{idx + 1}</span>
                  {config.memoryPhotos.length > 1 && (
                    <button
                      onClick={() => {
                        const newPhotos = config.memoryPhotos.filter((_, i) => i !== idx);
                        updateConfig({ memoryPhotos: newPhotos });
                      }}
                      className="p-1.5 rounded-lg bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/30 transition-colors"
                      title="حذف هذه الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Photo Preview & Direct Upload Button */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-black/60 border border-pink-400/30 relative flex items-center justify-center">
                      <img src={photo.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <label className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md">
                      <Upload className="w-3.5 h-3.5" />
                      <span>اختيار صورة (WebP تلقائي) 📁</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(idx, file);
                        }}
                      />
                    </label>
                  </div>

                  <div className="md:col-span-2 space-y-2.5">
                    <div>
                      <label className="block text-pink-200/70 mb-1">تاريخ الذكرى (تقويم حديث):</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          className="p-2.5 rounded-lg bg-black/60 border border-pink-400/40 text-amber-200 font-mono text-xs focus:border-pink-300 focus:outline-none cursor-pointer"
                          onChange={(e) => {
                            if (!e.target.value) return;
                            const d = new Date(e.target.value);
                            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                            const arabicDate = d.toLocaleDateString('ar-EG', options);
                            const newPhotos = [...config.memoryPhotos];
                            newPhotos[idx].date = arabicDate;
                            updateConfig({ memoryPhotos: newPhotos });
                          }}
                        />
                        <input
                          type="text"
                          value={photo.date}
                          placeholder="أو اكتب التاريخ..."
                          onChange={(e) => {
                            const newPhotos = [...config.memoryPhotos];
                            newPhotos[idx].date = e.target.value;
                            updateConfig({ memoryPhotos: newPhotos });
                          }}
                          className="flex-1 p-2.5 rounded-lg bg-white/5 border border-pink-400/30 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-pink-200/70 mb-1">الوصف العاطفي للصورة:</label>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => {
                          const newPhotos = [...config.memoryPhotos];
                          newPhotos[idx].caption = e.target.value;
                          updateConfig({ memoryPhotos: newPhotos });
                        }}
                        className="w-full p-2.5 rounded-lg bg-white/5 border border-pink-400/30 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: ROMANTIC SONG & SINGLE VOICE NOTE UPLOADER */}
      {activeStep === 6 && (
        <div className="space-y-6 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 p-6 backdrop-blur-xl shadow-2xl">
          <div className="border-b border-pink-500/20 pb-3 space-y-1">
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <Music className="w-5 h-5 text-pink-400" />
              <span>6. الأغنية والفويس الصوتي</span>
            </h3>
            <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              هنا يمكنك رفع خلفية الأغنية الرومانسية للموقع، وكذلك تسجيل الفويس الصوتي المخصص لحبيبتك!
            </p>
          </div>

          {/* SECTION 1: BACKGROUND MUSIC */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#2a041c] to-[#0a010b] border border-pink-500/30 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm border-b border-white/10 pb-2 w-full justify-center">
              <Music className="w-4 h-4 text-pink-400" />
              <span>الأغنية الرومانسية (خلفية الموقع الموسيقية)</span>
            </div>

            <label className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,114,182,0.5)] flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{isUploadingAudio ? 'جاري رفع الأغنية...' : 'إضافة / تغيير الأغنية الرومانسية'}</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                disabled={isUploadingAudio}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const url = await uploadAudioToCloud(file);
                      if (url) {
                        updateConfig({ storySongUrl: url });
                      }
                    } catch {}
                  }
                }}
              />
            </label>

            {config.storySongUrl ? (
              <div className="w-full p-4 sm:p-5 rounded-2xl bg-black/70 border border-emerald-500/40 flex flex-col gap-3 text-right">
                <div className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-black text-emerald-300 block text-sm">تم رفع وتفعيل الأغنية الرومانسية بنجاح!</span>
                    <span className="text-pink-200/70 text-xs">تعمل كخلفية موسيقية للموقع وتظهر بأيقونة الموسيقى المضيئة بأعلى الصفحة</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 w-full pt-2 border-t border-white/10">
                  <audio controls src={getPlayableAudioUrl(config.storySongUrl)} className="w-full h-11 rounded-xl" />
                  <button
                    type="button"
                    onClick={() => updateConfig({ storySongUrl: '' })}
                    className="p-3 rounded-xl bg-red-950/70 text-red-300 border border-red-500/40 hover:bg-red-900 transition-colors cursor-pointer shrink-0"
                    title="حذف الأغنية"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-pink-200/70 font-semibold">
                لم يتم رفع أغنية مخصصة بعد
              </p>
            )}
          </div>

          {/* SECTION 2: SINGLE VOICE NOTE */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#2a041c] to-[#0a010b] border border-pink-500/30 space-y-4 text-xs font-bold">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm border-b border-white/10 pb-2">
              <Mic className="w-4 h-4 text-pink-400" />
              <span>الرسالة الصوتية المخصصة (الفويس الصوتي)</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-pink-200 text-sm mb-1.5 font-extrabold">عنوان الرسالة الصوتية الرئيسي:</label>
                <input
                  type="text"
                  value={config.voiceMessageTitle}
                  onChange={(e) => updateConfig({ voiceMessageTitle: e.target.value })}
                  placeholder="مثال: فويس بصوتي من قلبي ليكي يروحي"
                  className="w-full p-4 rounded-2xl bg-black/60 border-2 border-pink-400/40 text-white font-black text-base"
                />
              </div>

              <div className="flex flex-col items-center gap-4 pt-2 border-t border-white/10 text-center">
                {/* LIVE MICROPHONE RECORDER SECTION */}
                <div className="w-full p-4 rounded-2xl bg-black/60 border border-pink-400/30 flex flex-col items-center gap-3">
                  <span className="text-xs font-black text-amber-300">
                    تسجيل فويس بصوتك مباشرة بالمايك من متصفحك:
                  </span>

                  {!isRecordingVoice ? (
                    <button
                      type="button"
                      onClick={startVoiceRecording}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 text-white font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,63,94,0.5)] flex items-center gap-2 cursor-pointer border border-white/30"
                    >
                      <Mic className="w-4 h-4 animate-bounce" />
                      <span>اضغط لبدء تسجل بصوتك الآن</span>
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-rose-400 font-mono text-sm font-extrabold flex items-center gap-2 animate-pulse">
                        <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                        جاري التسجيل المباشر... ({formatVoiceTime(voiceRecordingTime)})
                      </span>
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(239,68,68,0.6)] flex items-center gap-2 cursor-pointer border border-white/40"
                      >
                        <Square className="w-4 h-4 fill-current" />
                        <span>إيقاف وحفظ التسجيل الصوتي</span>
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 w-full flex flex-col items-center gap-1.5">
                    <span className="text-[11px] text-pink-200/60 font-semibold">أو اختيار ملف صوتي جاهز من جهازك:</span>
                    <label className="px-4 py-2 rounded-xl bg-white/10 border border-pink-400/30 text-pink-200 font-bold text-xs hover:bg-white/20 transition-all flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingVoice ? 'جاري رفع الملف...' : 'رفع ملف صوتي'}</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        disabled={isUploadingVoice}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsUploadingVoice(true);
                              const url = await uploadAudioToCloud(file);
                              if (url) {
                                updateConfig({ voiceAudioUrl: url });
                              }
                            } catch {} finally {
                              setIsUploadingVoice(false);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {config.voiceAudioUrl ? (
                  <div className="w-full p-4 sm:p-5 rounded-2xl bg-black/70 border border-emerald-500/40 flex flex-col gap-3 text-right">
                    <div className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-black text-emerald-300 block text-sm">تم تسجيل وتحديد الفويس الصوتي بنجاح!</span>
                        <span className="text-pink-200/70 text-xs">سيعرض لحبيبتك في شاشة الرسالة الصوتية</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 w-full pt-2 border-t border-white/10">
                      <audio controls src={getPlayableAudioUrl(config.voiceAudioUrl)} className="w-full h-11 rounded-xl" />
                      <button
                        type="button"
                        onClick={() => updateConfig({ voiceAudioUrl: '' })}
                        className="p-3 rounded-xl bg-red-950/70 text-red-300 border border-red-500/40 hover:bg-red-900 transition-colors cursor-pointer shrink-0"
                        title="حذف الفويس"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-pink-200/70 font-semibold">
                    لم يتم تسجيل أو رفع فويس مخصص بعد (يستخدم تسجيل افتراضي رومانسي).
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: BUCKET LIST (INDIVIDUAL WISH BOXES & CHECKMARKS) */}
      {activeStep === 7 && (
        <div className="space-y-5 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 p-6 backdrop-blur-xl shadow-2xl">
          <div className="border-b border-pink-500/20 pb-3 space-y-1">
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <Compass className="w-5 h-5 text-pink-400" />
              <span>7. قائمة الأحلام والأمنيات المستقبلية</span>
            </h3>
            <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              💡 قائمة بالأمنيات الشاعرية التي تخططان لتحقيقها معاً خطوة بخطوة، مع إمكانية تعليم ما تم إنجازه!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold pb-2">
            <div>
              <label className="block text-pink-200/80 mb-1.5">عنوان قائمة الأمنيات الرئيسي:</label>
              <input
                type="text"
                value={config.bucketListTitle}
                onChange={(e) => updateConfig({ bucketListTitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">نص زر الانتقال للرسالة الأخيرة:</label>
              <input
                type="text"
                value={config.bucketListButtonText}
                onChange={(e) => updateConfig({ bucketListButtonText: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white font-bold text-amber-200"
              />
            </div>
          </div>

          {/* INDIVIDUAL WISH BOXES EDITOR */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300">
                📝 مربعات الأمنيات (يمكنك تعديل أي أمنية، إضافة أو حذف):
              </span>
              <button
                type="button"
                onClick={() => {
                  const items = config.bucketListItems || [];
                  const newItem = { id: Date.now(), text: '✨ أمنية جديدة سنحققها سوا ❤️', completed: false };
                  updateConfig({ bucketListItems: [...items, newItem] });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة أمنية جديدة</span>
              </button>
            </div>

            {(config.bucketListItems || []).map((item, idx) => (
              <div key={item.id || idx} className="p-4 rounded-2xl bg-black/50 border border-pink-400/30 space-y-3 text-xs font-bold">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 flex-wrap gap-2">
                  <span className="text-amber-200 font-black">أمنية #{idx + 1}</span>

                  <div className="flex items-center gap-2">
                    {/* Checkmark Initial Status Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const items = [...(config.bucketListItems || [])];
                        items[idx].completed = !items[idx].completed;
                        updateConfig({ bucketListItems: items });
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                        item.completed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-white/10 text-pink-200/70 border border-white/10'
                      }`}
                    >
                      <span>{item.completed ? '✅ تم التحقيق' : '⏳ قيد الانتظار'}</span>
                    </button>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const items = (config.bucketListItems || []).filter((_, i) => i !== idx);
                        updateConfig({ bucketListItems: items });
                      }}
                      className="p-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900 transition-colors cursor-pointer"
                      title="حذف الأمنية"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-pink-200/70 mb-1">نص الأمنية:</label>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const items = [...(config.bucketListItems || [])];
                      items[idx].text = e.target.value;
                      updateConfig({ bucketListItems: items });
                    }}
                    className="w-full p-3 rounded-xl bg-white/5 border border-pink-400/30 text-white font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 8: FINAL HEARTFELT LETTER */}
      {activeStep === 8 && (
        <div className="space-y-5 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 p-6 backdrop-blur-xl shadow-2xl">
          <div className="border-b border-pink-500/20 pb-3 space-y-1">
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <FileText className="w-5 h-5 text-pink-400" />
              <span>8. الرسالة الكبيرة والوعد الختامي</span>
            </h3>
            <p className="text-xs text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              💡 رسالة العشق المؤثرة التي تُكتب تلقائياً بحركات آلة الكاتبة في الشاشة الأخيرة للموقع!
            </p>
          </div>

          <div className="space-y-3 text-xs font-bold">
            <div>
              <label className="block text-pink-200/80 mb-1.5">عنوان الرسالة الرئيسي:</label>
              <input
                type="text"
                value={config.finalLetterTitle}
                onChange={(e) => updateConfig({ finalLetterTitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">الإهداء الفرعي العلوي:</label>
              <input
                type="text"
                value={config.finalLetterSubtitle}
                onChange={(e) => updateConfig({ finalLetterSubtitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">نص الرسالة الكامل المكتوب لايف (Live Typewriter):</label>
              <textarea
                rows={5}
                value={config.finalLetterContent}
                onChange={(e) => updateConfig({ finalLetterContent: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">جملة التوقيع والوعد الختامية:</label>
              <input
                type="text"
                value={config.finalLetterPromise}
                onChange={(e) => updateConfig({ finalLetterPromise: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white font-bold text-amber-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* QR CODE MODAL FOR CLIENT SITE */}
      <TenantQRCodeModal
        slug={tenantCtx?.currentTenant?.slug || 'rawda'}
        tenantName={tenantCtx?.currentTenant?.name || 'موقعك الخاص'}
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-sm w-full p-6 rounded-3xl bg-gradient-to-b from-[#1a0824] to-[#0c0314] border-2 border-pink-400/40 shadow-[0_0_50px_rgba(244,63,94,0.4)] text-center space-y-5 relative">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mx-auto text-rose-400 animate-pulse">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
                تأكيد تسجيل الخروج 🔒
              </h3>
              <p className="text-xs text-pink-200/70 mt-1 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                هل أنت متأكد من تسجيل الخروج من لوحة التحكم؟
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleAdminLogout();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(244,63,94,0.5)] cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                نعم، تسجيل الخروج
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 border border-pink-400/20 text-pink-200 font-bold text-xs hover:bg-white/20 transition-all cursor-pointer"
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
