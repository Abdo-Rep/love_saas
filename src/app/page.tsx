'use client';

import React, { useState } from 'react';
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
import { Crown, Sparkles } from 'lucide-react';

function DefaultTenantExperience() {
  const [currentStep, setCurrentStep] = useState<number>(1);

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

      {currentStep > 1 && <GlobalBackButton onBack={handleBack} />}

      {/* STEP 1: PASSWORD GATE */}
      {currentStep === 1 && (
        <CelestialHeartLanding onStart={() => setCurrentStep(2)} />
      )}

      {/* STEP 2: 3D THEATER ENTRANCE STAGE */}
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

      {/* STEP 6: HORIZONTAL PHOTO GALLERY */}
      {currentStep === 6 && (
        <HorizontalLoveGallery onNext={() => setCurrentStep(7)} />
      )}

      {/* STEP 7: LOVE RADIO CASSETTE */}
      {currentStep === 7 && (
        <LoveRadioCassette onNext={() => setCurrentStep(8)} />
      )}

      {/* STEP 8: BUCKET LIST FUTURES WISHES */}
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

export default function Home() {
  return (
    <TenantProvider initialSlug="rawda">
      <DefaultTenantExperience />
    </TenantProvider>
  );
}
