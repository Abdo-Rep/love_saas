'use client';

import React, { useState, useEffect } from 'react';
import { TenantProvider, useTenant } from '@/lib/tenantContext';
import { createDefaultConfigForTenant } from '@/lib/tenantStore';
import { CelestialHeartLanding } from '@/components/fresh/CelestialHeartLanding';
import { StarConstellationName } from '@/components/couples/StarConstellationName';
import { LoveCounter } from '@/components/couples/LoveCounter';
import { OpenWhenLetters } from '@/components/couples/OpenWhenLetters';
import { HorizontalLoveGallery } from '@/components/couples/HorizontalLoveGallery';
import { LoveRadioCassette } from '@/components/couples/LoveRadioCassette';
import { BucketListFutures } from '@/components/couples/BucketListFutures';
import { FinalHeartfeltLetter } from '@/components/couples/FinalHeartfeltLetter';
import { AntiScreenshot } from '@/components/common/AntiScreenshot';
import { SubtleWatermark } from '@/components/common/SubtleWatermark';
import { GlobalBackButton } from '@/components/common/GlobalBackButton';
import { BackgroundMusicPlayer } from '@/components/common/BackgroundMusicPlayer';
import { CosmicMeteorsBackground } from '@/components/common/CosmicMeteorsBackground';

interface SiteClientContentProps {
  slug: string;
}

function SiteClientContent({ slug }: SiteClientContentProps) {
  const { currentTenant, setCurrentTenantDirectly } = useTenant();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [siteState, setSiteState] = useState<'checking' | 'active' | 'suspended' | 'not_found'>('checking');
  const [cloudTenant, setCloudTenant] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined' && slug) {
      let formattedTitle = decodeURIComponent(slug).trim();
      if (formattedTitle.includes('-')) {
        formattedTitle = formattedTitle.split('-').map(s => s.trim()).filter(Boolean).join(' & ');
      } else if (formattedTitle.includes('_')) {
        formattedTitle = formattedTitle.split('_').map(s => s.trim()).filter(Boolean).join(' & ');
      }
      document.title = formattedTitle;
    }

    let isMounted = true;

    // Initial full fetch
    const fetchFullTenant = async () => {
      try {
        const res = await fetch(`/api/tenants?slug=${encodeURIComponent(slug)}&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json?.success && Array.isArray(json.tenants) && json.tenants.length > 0) {
            const found = json.tenants.find((t: any) => (t.slug || '').toLowerCase().trim() === slug.toLowerCase().trim());
            if (found && isMounted) {
              if (found.status === 'suspended') {
                setSiteState('suspended');
                return;
              }
              const finalAdminPass = found.adminPassword || found.admin_password || found.config?.adminPassword || 'love';
              const finalSitePass = found.sitePassword || found.site_password || found.config?.sitePassword || 'love';
              const mergedConfig = {
                ...createDefaultConfigForTenant(found.name || 'أميرتي', finalSitePass, finalAdminPass),
                ...found.config,
                adminPassword: finalAdminPass,
                sitePassword: finalSitePass
              };
              const withConfig = {
                ...found,
                adminPassword: finalAdminPass,
                sitePassword: finalSitePass,
                config: mergedConfig
              };
              setCloudTenant(withConfig);
              setCurrentTenantDirectly(withConfig);
              setSiteState('active');
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error fetching cloud tenant:', err);
      }

      if (isMounted) {
        setSiteState('not_found');
      }
    };

    fetchFullTenant();

    // Lightweight status-only Heartbeat (30ms) to detect live suspension/deletion without heavy payload
    const checkLiveStatus = async () => {
      try {
        const res = await fetch(`/api/tenants?slug=${encodeURIComponent(slug)}&checkStatusOnly=true&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json?.success && Array.isArray(json.tenants)) {
            const match = json.tenants.find((t: any) => (t.slug || '').toLowerCase().trim() === slug.toLowerCase().trim());
            if (!match) {
              if (isMounted) setSiteState('not_found');
            } else if (match.status === 'suspended') {
              if (isMounted) setSiteState('suspended');
            } else if (match.status === 'active') {
              if (isMounted && siteState !== 'active') setSiteState('active');
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
  }, [slug, setCurrentTenantDirectly, siteState]);

  // Instant top display on step change (no smooth scroll)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [currentStep]);

  if (!mounted || siteState === 'checking') {
    return (
      <div className="min-h-screen w-full bg-[#1c0617] text-white flex flex-col items-center justify-center font-sans dir-rtl">
        <CosmicMeteorsBackground />
        <div className="flex flex-col items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-pink-200/80 animate-pulse" style={{ fontFamily: "'Cairo', sans-serif" }}>
            جاري تحضير عالمكم الخاص... ✨💖
          </span>
        </div>
      </div>
    );
  }

  if (siteState === 'suspended' || siteState === 'not_found') {
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
            الموقع معطل أو غير موجود حالياً.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2.5 rounded-lg bg-[#2b2b2b] text-blue-400 hover:bg-[#383838] font-bold text-xs border border-gray-700 transition-colors cursor-pointer"
          >
            إعادة المحاولة 🔄
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleRestart = () => {
    setCurrentStep(1);
  };

  return (
    <main className="min-h-screen w-full bg-[#1c0617] text-white relative selection:bg-rose-500 selection:text-white overflow-x-hidden font-sans">
      <AntiScreenshot />
      <SubtleWatermark />
      <CosmicMeteorsBackground />
      <BackgroundMusicPlayer currentStep={currentStep} />

      {currentStep > 1 && <GlobalBackButton onBack={handleBack} />}

      {/* Step Navigation Flow */}
      {currentStep === 1 && (
        <CelestialHeartLanding onStart={() => setCurrentStep(2)} />
      )}
      {currentStep === 2 && (
        <StarConstellationName onNext={() => setCurrentStep(3)} />
      )}
      {currentStep === 3 && (
        <LoveCounter onNext={() => setCurrentStep(4)} />
      )}
      {currentStep === 4 && (
        <OpenWhenLetters onNext={() => setCurrentStep(5)} />
      )}
      {currentStep === 5 && (
        <HorizontalLoveGallery onNext={() => setCurrentStep(6)} />
      )}
      {currentStep === 6 && (
        <LoveRadioCassette onNext={() => setCurrentStep(7)} />
      )}
      {currentStep === 7 && (
        <BucketListFutures onNext={() => setCurrentStep(8)} />
      )}
      {currentStep === 8 && (
        <FinalHeartfeltLetter onRestart={handleRestart} />
      )}
    </main>
  );
}

export default function TenantDynamicRoute({ params }: { params: { slug: string } }) {
  const slug = params?.slug || 'rawda';

  return (
    <TenantProvider initialSlug={slug}>
      <SiteClientContent slug={slug} />
    </TenantProvider>
  );
}
