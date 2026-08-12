'use client';

import React, { useState, useEffect } from 'react';
import { TenantStore } from '@/lib/tenantStore';
import { Tenant } from '@/types/tenant';
import { TenantProvider, useTenant } from '@/lib/tenantContext';
import { CelestialHeartLanding } from '@/components/fresh/CelestialHeartLanding';
import { BossDanceStage } from '@/components/3d/BossDanceStage';
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
import { Heart, PauseCircle, HelpCircle } from 'lucide-react';

interface SiteClientContentProps {
  slug: string;
}

function SiteClientContent({ slug }: SiteClientContentProps) {
  const { currentTenant, loadTenantBySlug } = useTenant();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadTenantBySlug(slug);
    setIsLoading(false);

    const handleSync = () => {
      loadTenantBySlug(slug);
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
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
      <BackgroundMusicPlayer currentStep={currentStep} />

      {currentStep > 1 && <GlobalBackButton onBack={handleBack} />}

      {/* STEP 1: PASSWORD GATE */}
      {currentStep === 1 && (
        <CelestialHeartLanding onStart={() => setCurrentStep(2)} />
      )}

      {/* STEP 2: 3D THEATER ENTRANCE */}
      {currentStep === 2 && (
        <BossDanceStage onNext={() => setCurrentStep(3)} />
      )}

      {/* STEP 3: STAR CONSTELLATION NAME */}
      {currentStep === 3 && (
        <StarConstellationName onNext={() => setCurrentStep(4)} />
      )}

      {/* STEP 4: LOVE COUNTER */}
      {currentStep === 4 && (
        <LoveCounter onNext={() => setCurrentStep(5)} />
      )}

      {/* STEP 5: OPEN WHEN LETTERS */}
      {currentStep === 5 && (
        <OpenWhenLetters onNext={() => setCurrentStep(6)} />
      )}

      {/* STEP 6: PHOTO GALLERY CAROUSEL */}
      {currentStep === 6 && (
        <HorizontalLoveGallery onNext={() => setCurrentStep(7)} />
      )}

      {/* STEP 7: LOVE RADIO CASSETTE VOICE */}
      {currentStep === 7 && (
        <LoveRadioCassette onNext={() => setCurrentStep(8)} />
      )}

      {/* STEP 8: BUCKET LIST WISHES */}
      {currentStep === 8 && (
        <BucketListFutures onNext={() => setCurrentStep(9)} />
      )}

      {/* STEP 9: FINAL HEARTFELT LETTER */}
      {currentStep === 9 && (
        <FinalHeartfeltLetter onRestart={handleRestart} />
      )}
    </main>
  );
}

export default function TenantSitePage({ params }: { params: { slug: string } }) {
  const slug = params?.slug || 'rawda';

  return (
    <TenantProvider initialSlug={slug}>
      <SiteClientContent slug={slug} />
    </TenantProvider>
  );
}
