'use client';

import React, { useState, useRef } from 'react';
import { useConfig } from '@/lib/configContext';
import { useTenant } from '@/lib/tenantContext';
import { TenantStore } from '@/lib/tenantStore';
import { Live3DModelPicker } from '@/components/admin/Live3DModelPicker';
import { getPlayableAudioUrl } from '@/lib/getPlayableAudioUrl';
import {
  KeyRound,
  Settings,
  Sparkles,
  Save,
  Calendar,
  Mail,
  Camera,
  Mic,
  Gift,
  Compass,
  Crown,
  FileText,
  Upload,
  Image as ImageIcon,
  Square,
  Play,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Music,
  X
} from 'lucide-react';

import { TenantQRCodeModal } from '@/components/admin/TenantQRCodeModal';

export default function AdminPage() {
  const { config, updateConfig } = useConfig();
  let tenantCtx: any = null;
  try {
    tenantCtx = useTenant();
  } catch (_) {}

  const [activeStep, setActiveStep] = useState<number>(1);
  const [saveMessage, setSaveMessage] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Modern Date Picker states
  const selectedDate = config.relationshipStartDate ? new Date(`${config.relationshipStartDate}T00:00:00`) : new Date(2024, 2, 14);
  const [calYear, setCalYear] = useState<number>(selectedDate.getFullYear());
  const [calMonth, setCalMonth] = useState<number>(selectedDate.getMonth()); // 0-11

  const handleSave = () => {
    setSaveMessage('تم حفظ وتطبيق جميع التغييرات بنجاح على الموقع بالكامل ✨💖');
    setTimeout(() => setSaveMessage(''), 3500);
  };

  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Read file as base64, split into chunks, save each chunk separately
  // This bypasses Vercel's 4.5MB body limit by sending each chunk in its own request
  // Soulove Music Flow: Upload audio to /api/upload?category=music&slug=SLUG
  // Seamlessly handles files of any size (slices into 2.5MB chunks to bypass Vercel 4.5MB limit)
  const uploadAudioToCloud = async (file: File): Promise<string> => {
    setIsUploadingAudio(true);
    setUploadError('');

    try {
      const slug = tenantCtx?.tenant?.slug || 'default';
      const CHUNK_SIZE = 2.5 * 1024 * 1024; // 2.5MB per chunk to stay strictly under Vercel 4.5MB limit
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
        if (!res.ok || !json.success) {
          throw new Error(json.error || `فشل رفع جزء ${i + 1} من ${totalChunks}`);
        }

        if (json.isComplete && (json.proxyUrl || json.url)) {
          setIsUploadingAudio(false);
          return json.proxyUrl || json.url;
        }
      }

      setIsUploadingAudio(false);
      throw new Error('فشل استكمال رفع الملف');
    } catch (err: any) {
      console.error('[Music Upload Failed]', err);
      setIsUploadingAudio(false);
      const msg = err?.message || 'حدث خطأ أثناء رفع الملف!';
      setUploadError(msg);
      throw err;
    }
  };

  // Client-side WebP compression helper
  const compressToWebP = (file: File, quality = 0.85, maxWidth = 1600): Promise<string> => {
    return new Promise((resolve) => {
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

  // Disc photo upload handler (Compressed to WebP)
  const handleDiscPhotoUpload = async (file: File) => {
    const webp = await compressToWebP(file, 0.85);
    updateConfig({ voicePhotoUrl: webp });
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const dataUrl = reader.result as string;
            setRecordedAudioUrl(dataUrl);
            updateConfig({ voiceAudioUrl: dataUrl });
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      alert('يرجى إعطاء صلاحية الميكروفون للتسجيل المباشر 🎙️');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Modern Calendar Days Generator
  const monthsArabic = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0 is Sunday

  const handleSelectDay = (day: number) => {
    const mStr = String(calMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const dateStr = `${calYear}-${mStr}-${dStr}`;
    updateConfig({ relationshipStartDate: dateStr });
  };

  const tabs = [
    { id: 1, name: '🔑 الباسورد والترحيب (Step 1)', icon: KeyRound },
    { id: 2, name: '🎭 المسرح وشخصيات الـ 3D (Step 2)', icon: Crown },
    { id: 3, name: '🌌 سماء النجوم والاسم (Step 3)', icon: Sparkles },
    { id: 4, name: '💖 عداد الحب والتقويم (Step 4)', icon: Calendar },
    { id: 5, name: '💌 مظاريف الحب الـ 5 (Step 5)', icon: Mail },
    { id: 6, name: '📸 ألبوم الصور ورفع الصور (Step 6)', icon: Camera },
    { id: 7, name: '🎙️ تسجيل الصوت بالمايك (Step 7)', icon: Mic },
    { id: 8, name: '🗺️ قائمة الأمنيات والأحلام (Step 8)', icon: Compass },
    { id: 9, name: '💌 الرسالة الأخيرة (Step 9)', icon: FileText },
  ];

  return (
    <main className="min-h-screen w-full bg-[#090108] text-white p-4 pb-20 max-w-4xl mx-auto font-sans">
      
      {/* STICKY TOP HEADER WITH SAVE & SUPER ADMIN LINK */}
      <header className="sticky top-0 z-50 bg-[#090108]/95 backdrop-blur-xl py-3.5 border-b border-pink-500/30 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-3 text-right">
          <Settings className="w-6 h-6 text-pink-400 animate-spin shrink-0" />
          <div>
            <h1 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              لوحة تحكم الموقع 👑
            </h1>
            <p className="text-[11px] text-pink-200/70 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              تحكم كامل في جميع النصوص، أزرار الانتقال، الصور، الشخصيات، والأصوات!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap justify-end">
          <button
            onClick={() => setShowQrModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 border border-pink-400/40 text-amber-300 font-bold text-xs hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <span>رمز الـ QR لموقعك 📱✨</span>
          </button>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs sm:text-sm border border-white/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_#f472b6] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <Save className="w-4 h-4 text-white" />
            <span>حفظ التغييرات 💖</span>
          </button>
        </div>
      </header>

      {/* Tabs Navigation Grid */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStep === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStep(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap flex items-center gap-2 transition-all shadow-md ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white border border-amber-200 shadow-[0_0_20px_#f472b6] scale-105'
                  : 'bg-white/5 border border-pink-400/20 text-pink-200 hover:bg-white/10'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {saveMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-black text-center animate-bounce shadow-lg" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {saveMessage}
        </div>
      )}

      {/* STEP 1: PASSWORD GATE */}
      {activeStep === 1 && (
        <div className="space-y-4 rounded-3xl bg-white/5 border border-pink-400/30 p-6 backdrop-blur-xl">
          <h3 className="text-base font-black text-amber-200 border-b border-pink-500/20 pb-3 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <KeyRound className="w-5 h-5 text-pink-400" />
            <span>الخطوة 1: نصوص صفحة الدخول والباسورد وزر الانتقال</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-pink-200/80 mb-1.5">كلمة سر دخول الموقع:</label>
              <input
                type="text"
                value={config.sitePassword}
                onChange={(e) => {
                  const val = e.target.value;
                  updateConfig({ sitePassword: val });
                  if (tenantCtx?.currentTenant) {
                    TenantStore.updateTenant(tenantCtx.currentTenant.slug, { sitePassword: val });
                    tenantCtx.refreshTenants();
                  }
                }}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-amber-200 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">كلمة سر لوحة التحكم (الأدمن):</label>
              <input
                type="text"
                value={tenantCtx?.currentTenant?.adminPassword || 'love'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (tenantCtx?.currentTenant) {
                    TenantStore.updateTenant(tenantCtx.currentTenant.slug, { adminPassword: val });
                    tenantCtx.refreshTenants();
                  }
                }}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-rose-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">اسم الحبيبة (الذي يظهر في الترحيب):</label>
              <input
                type="text"
                value={config.herName}
                onChange={(e) => updateConfig({ herName: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">الشارة العلوية (Badge):</label>
              <input
                type="text"
                value={config.landingBadge}
                onChange={(e) => updateConfig({ landingBadge: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">العنوان الرئيسي الكبير:</label>
              <input
                type="text"
                value={config.landingTitle}
                onChange={(e) => updateConfig({ landingTitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-pink-200/80 mb-1.5">الوصف والرسالة الشاعرية تحت العنوان:</label>
              <textarea
                rows={2}
                value={config.landingSubtitle}
                onChange={(e) => updateConfig({ landingSubtitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">نص خانة كتابة كلمة السر (Placeholder):</label>
              <input
                type="text"
                value={config.passwordPlaceholder}
                onChange={(e) => updateConfig({ passwordPlaceholder: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">نص زر الدخول والانتقال للمسرح:</label>
              <input
                type="text"
                value={config.enterButtonText}
                onChange={(e) => updateConfig({ enterButtonText: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white font-bold text-amber-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: 3D THEATER ENTRANCE */}
      {activeStep === 2 && (
        <div className="space-y-5 rounded-3xl bg-white/5 border border-pink-400/30 p-6 backdrop-blur-xl">
          <h3 className="text-base font-black text-amber-200 border-b border-pink-500/20 pb-3 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Crown className="w-5 h-5 text-pink-400" />
            <span>الخطوة 2: المعاينة الحية الـ 3D لشخصيات المسرح والرسالة وزر الانتقال</span>
          </h3>

          <div className="space-y-3 text-xs font-bold pb-4 border-b border-white/10">
            <div>
              <label className="block text-pink-200/80 mb-1.5">الرسالة المباشرة (Live Typewriter Message) عند وصول الشخصية:</label>
              <textarea
                rows={3}
                value={config.theaterWalkMessage}
                onChange={(e) => updateConfig({ theaterWalkMessage: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">نص زر الانتقال للمرحلة التالية:</label>
              <input
                type="text"
                value={config.theaterButtonText}
                onChange={(e) => updateConfig({ theaterButtonText: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white font-bold text-amber-200"
              />
            </div>
          </div>

          {/* ROMANTIC SONG UPLOAD — Plays automatically after theater, loops through all steps */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-950/60 via-rose-950/40 to-black/60 border border-purple-400/30 p-5 space-y-4">
            <h4 className="text-xs font-black text-purple-200 flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              <span>🎵 أغنية الرحلة الرومانسية (تبدأ تلقائياً بعد انتهاء المسرح)</span>
            </h4>
            <p className="text-[11px] text-pink-200/60 leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
              الأغنية تبدأ تلقائياً في اللحظة التي يختفي فيها الشخصية ويظهر الكلام المكتوب على الشاشة، وتستمر تلقائياً طوال الرحلة.
            </p>

            {/* CURRENT SONG STATUS */}
            {config.storySongUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-950/60 border border-green-400/30">
                <Music className="w-5 h-5 text-green-400 shrink-0 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-green-300">✅ أغنية محملة وجاهزة للتشغيل!</p>
                  <audio controls src={getPlayableAudioUrl(config.storySongUrl)} className="w-full mt-2 h-8" style={{ filter: 'invert(0.8) hue-rotate(270deg)' }} />
                </div>
                <button
                  onClick={() => updateConfig({ storySongUrl: '' })}
                  className="shrink-0 p-2 rounded-xl bg-red-950/60 border border-red-400/30 text-red-300 hover:bg-red-900/60 transition"
                  title="حذف الأغنية"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-dashed border-purple-400/40">
                <Music className="w-5 h-5 text-purple-400/50" />
                <p className="text-[11px] text-purple-200/50">لا توجد أغنية محملة بعد.. ارفع أغنية من جهازك أدناه 👇</p>
              </div>
            )}

            {/* UPLOAD BUTTON / STATUS */}
            {isUploadingAudio ? (
              <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black text-purple-300">جاري رفع الأغنية للسيرفر السحابي الآمن... يرجى الانتظار ⏳</p>
              </div>
            ) : (
              <label className="cursor-pointer flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-gradient-to-r from-purple-800/60 via-rose-800/50 to-pink-800/60 border border-purple-300/30 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white font-black text-xs">
                <Upload className="w-5 h-5 text-purple-200" />
                <span>📂 اختار أغنية من جهازك (MP3، MP4، OGG، WAV)</span>
                <input
                  type="file"
                  accept="audio/*,video/mp4"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const songUrl = await uploadAudioToCloud(file);
                      if (songUrl) {
                        updateConfig({ storySongUrl: songUrl, music_src: songUrl, storySongPart2: '', storySongPart3: '' });
                      }
                    } catch (err: any) {
                      setUploadError(err.message || 'حدث خطأ أثناء رفع الأغنية!');
                    }
                    e.target.value = '';
                  }}
                />
              </label>
            )}

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-bold text-center">
                {uploadError}
              </div>
            )}
          </div>

          <Live3DModelPicker />
        </div>
      )}

      {/* STEP 3: STAR CONSTELLATION NAME */}
      {activeStep === 3 && (
        <div className="space-y-4 rounded-3xl bg-white/5 border border-pink-400/30 p-6 backdrop-blur-xl">
          <h3 className="text-base font-black text-amber-200 border-b border-pink-500/20 pb-3 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span>الخطوة 3: سماء النجوم، كتابة الاسم المضيء، والرسالة وزر الانتقال</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-pink-200/80 mb-1.5">الاسم الإنجليزي المضيء في سماء النجوم:</label>
              <input
                type="text"
                value={config.constellationName}
                onChange={(e) => updateConfig({ constellationName: e.target.value })}
                placeholder="مثال: RAWDA أو NOUR"
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white font-mono font-black text-sm uppercase"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">عنوان الصفحة الرئيسي:</label>
              <input
                type="text"
                value={config.constellationTitle}
                onChange={(e) => updateConfig({ constellationTitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-pink-200/80 mb-1.5">الرسالة الشاعرية المكتوبة لايف أسفل النجوم:</label>
              <textarea
                rows={3}
                value={config.constellationMessage}
                onChange={(e) => updateConfig({ constellationMessage: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white leading-relaxed"
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

      {/* STEP 4: LOVE COUNTER WITH ULTRA MODERN INTERACTIVE CALENDAR */}
      {activeStep === 4 && (
        <div className="space-y-5 rounded-3xl bg-white/5 border border-pink-400/30 p-6 backdrop-blur-xl">
          <h3 className="text-base font-black text-amber-200 border-b border-pink-500/20 pb-3 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Calendar className="w-5 h-5 text-pink-400" />
            <span>الخطوة 4: عداد الحب والتقويم التفاعلي الحديث والرسالة</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-pink-200/80 mb-1.5">عنوان العداد الرئيسي:</label>
              <input
                type="text"
                value={config.counterTitle}
                onChange={(e) => updateConfig({ counterTitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">نص زر الانتقال للمظاريف:</label>
              <input
                type="text"
                value={config.counterButtonText}
                onChange={(e) => updateConfig({ counterButtonText: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white font-bold text-amber-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-pink-200/80 mb-1.5">الكلام المكتوب داخل صندوق الاقتباس أسفل العداد:</label>
              <textarea
                rows={2}
                value={config.counterQuote}
                onChange={(e) => updateConfig({ counterQuote: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white leading-relaxed"
              />
            </div>
          </div>

          {/* ULTRA MODERN INTERACTIVE CALENDAR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#25051b]/80 to-[#0c010c] border border-pink-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300">
                📅 اختاري تاريخ بداية علاقتكم (يحسب الثواني والأيام فوراً):
              </span>
              <span className="text-xs font-mono font-extrabold text-pink-200 px-3 py-1 rounded-full bg-rose-500/20 border border-pink-400/30">
                التاريخ المختار: {config.relationshipStartDate}
              </span>
            </div>

            {/* Calendar Month/Year Switcher */}
            <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-pink-400/20">
              <button
                type="button"
                onClick={() => {
                  if (calMonth === 0) {
                    setCalMonth(11);
                    setCalYear((y) => y - 1);
                  } else {
                    setCalMonth((m) => m - 1);
                  }
                }}
                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-rose-500/40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-black text-pink-100">
                <span>{monthsArabic[calMonth]}</span>
                <select
                  value={calYear}
                  onChange={(e) => setCalYear(Number(e.target.value))}
                  className="bg-black/60 border border-pink-400/40 text-center rounded-xl text-amber-200 py-1 px-3 font-mono font-black text-xs cursor-pointer hover:border-pink-300 transition"
                >
                  {Array.from({ length: 35 }, (_, i) => 2000 + i).map((yr) => (
                    <option key={yr} value={yr} className="bg-[#1c0617] text-amber-200 font-mono font-bold">
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (calMonth === 11) {
                    setCalMonth(0);
                    setCalYear((y) => y + 1);
                  } else {
                    setCalMonth((m) => m + 1);
                  }
                }}
                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-rose-500/40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
              {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((d, i) => (
                <span key={i} className="text-[10px] font-bold text-pink-300/60 py-1">{d}</span>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const mStr = String(calMonth + 1).padStart(2, '0');
                const dStr = String(dayNum).padStart(2, '0');
                const thisDateStr = `${calYear}-${mStr}-${dStr}`;
                const isSelected = config.relationshipStartDate === thisDateStr;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-8 sm:h-9 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-500 to-amber-400 text-white shadow-[0_0_15px_#f472b6] scale-110 border border-white'
                        : 'bg-black/30 text-pink-100 hover:bg-rose-500/20 border border-pink-400/10'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: OPEN WHEN LETTERS */}
      {activeStep === 5 && (
        <div className="space-y-4 rounded-3xl bg-white/5 border border-pink-400/30 p-6 backdrop-blur-xl">
          <h3 className="text-base font-black text-amber-200 border-b border-pink-500/20 pb-3 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Mail className="w-5 h-5 text-pink-400" />
            <span>الخطوة 5: مظاريف الحب الـ 5 المخصصة وزر الانتقال</span>
          </h3>

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

      {/* STEP 6: PHOTO GALLERY WITH DIRECT LOCAL FILE PICKER */}
      {activeStep === 6 && (
        <div className="space-y-4 rounded-3xl bg-white/5 border border-pink-400/30 p-6 backdrop-blur-xl">
          <h3 className="text-base font-black text-amber-200 border-b border-pink-500/20 pb-3 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Camera className="w-5 h-5 text-pink-400" />
            <span>الخطوة 6: ألبوم الصور (اختيار ورفع الصور مباشرة من جهازك)</span>
          </h3>

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
                    image: '/images/the_boss.jpg',
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
              <span>إضافة صورة جديدة للألبوم ➕</span>
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

      {/* STEP 7: LIVE MICROPHONE VOICE RECORDING */}
      {activeStep === 7 && (
        <div className="space-y-5 rounded-3xl bg-white/5 border border-pink-400/30 p-6 backdrop-blur-xl">
          <h3 className="text-base font-black text-amber-200 border-b border-pink-500/20 pb-3 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Mic className="w-5 h-5 text-pink-400" />
            <span>الخطوة 7: تسجيل صوتك مباشرة بالمايك والتحكم بالأسطوانة</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-pink-200/80 mb-1.5">عنوان التسجيل الصوتي الرئيسي:</label>
              <input
                type="text"
                value={config.voiceMessageTitle}
                onChange={(e) => updateConfig({ voiceMessageTitle: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white"
              />
            </div>

            <div>
              <label className="block text-pink-200/80 mb-1.5">نص زر الانتقال لعجلة الأحكام:</label>
              <input
                type="text"
                value={config.voiceButtonText}
                onChange={(e) => updateConfig({ voiceButtonText: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/40 border border-pink-400/30 text-white font-bold text-amber-200"
              />
            </div>
          </div>

          {/* LIVE RECORDING STUDIO PANEL */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#2a041c] to-[#0a010b] border border-pink-500/30 flex flex-col items-center gap-4 text-center">
            <span className="text-xs font-black text-amber-300">
              🎙️ استوديو التسجيل الصوتي المباشر:
            </span>

            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(244,114,182,0.6)] flex items-center gap-2 animate-pulse"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  <Mic className="w-4 h-4" />
                  <span>بدء تسجيل صوتك الآن 🔴</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-6 py-3 rounded-2xl bg-red-600 text-white font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_red] flex items-center gap-2 animate-bounce"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>إيقاف وحفظ التسجيل ⏹️</span>
                </button>
              )}
            </div>

            {config.voiceAudioUrl && (
              <div className="w-full p-3 rounded-xl bg-black/50 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>تم حفظ التسجيل الصوتي بنجاح! سيتم تشغيله على الموقع 🎵</span>
                </span>
                <audio controls src={config.voiceAudioUrl} className="h-8 max-w-xs" />
              </div>
            )}

            {/* DISC PHOTO CHANGER */}
            <div className="w-full pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-pink-200/80 font-bold">صورة منتصف الأسطوانة الدائرية:</span>
              <label className="px-4 py-2 rounded-xl bg-white/10 border border-pink-400/30 text-white text-center cursor-pointer hover:bg-rose-500/30 transition-all flex items-center gap-1.5 font-bold">
                <ImageIcon className="w-3.5 h-3.5 text-pink-300" />
                <span>رفع صورة جديدة لوسط الأسطوانة 📁</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDiscPhotoUpload(file);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: BUCKET LIST (INDIVIDUAL WISH BOXES & CHECKMARKS) */}
      {activeStep === 8 && (
        <div className="space-y-5 rounded-3xl bg-white/5 border border-pink-400/30 p-6 backdrop-blur-xl">
          <h3 className="text-base font-black text-amber-200 border-b border-pink-500/20 pb-3 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Compass className="w-5 h-5 text-pink-400" />
            <span>الخطوة 8: قائمة أمنياتنا المخصصة (كل أمنية في مربع مستقل + علامة إنجاز)</span>
          </h3>

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
                <span>إضافة أمنية جديدة ➕</span>
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

      {/* STEP 9: FINAL HEARTFELT LETTER */}
      {activeStep === 9 && (
        <div className="space-y-4 rounded-3xl bg-white/5 border border-pink-400/30 p-6 backdrop-blur-xl">
          <h3 className="text-base font-black text-amber-200 border-b border-pink-500/20 pb-3 flex items-center gap-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <FileText className="w-5 h-5 text-pink-400" />
            <span>الخطوة 9: الرسالة الأخيرة المكتوبة لايف</span>
          </h3>

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

    </main>
  );
}
