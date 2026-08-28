'use client';

import React, { useState, useEffect } from 'react';
import { TenantProvider, useTenant } from '@/lib/tenantContext';
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
  const [isLoading, setIsLoading] = useState(true);
  const [cloudTenant, setCloudTenant] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    let isMounted = true;
    const fetchFromCloud = async () => {
      try {
        const res = await fetch(`/api/tenants?slug=${encodeURIComponent(slug)}&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json?.success && Array.isArray(json.tenants)) {
            const found = json.tenants.find((t: any) => (t.slug || '').toLowerCase().trim() === slug.toLowerCase().trim());
            if (found && isMounted) {
              const { createDefaultConfigForTenant: cdf } = await import('@/lib/tenantStore');
              const mergedConfig = {
                ...cdf(found.name || 'أميرتي', found.sitePassword || 'love'),
                ...found.config
              };
              const withConfig = {
                ...found,
                config: mergedConfig
              };
              setCloudTenant(withConfig);
              setCurrentTenantDirectly(withConfig);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error fetching cloud tenant:', err);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchFromCloud();

    return () => {
      isMounted = false;
    };
  }, [slug, setCurrentTenantDirectly]);

  // Instant top display on step change (no smooth scroll)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [currentStep]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#090108] text-white flex flex-col items-center justify-center p-4 gap-3">
        <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-pink-300 font-medium">جاري تحميل رحلة العشق... ✨</p>
      </div>
    );
  }

  const activeTenant = (currentTenant && currentTenant.slug.toLowerCase() === slug.toLowerCase()) ? currentTenant : cloudTenant;

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
