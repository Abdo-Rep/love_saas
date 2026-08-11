'use client';

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/lib/configContext';
import { Clock, Heart } from 'lucide-react';

export const LoveCounterSection: React.FC = () => {
  const { config } = useConfig();
  const [timeDiff, setTimeDiff] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date(config.relationshipStartDate || '2024-01-17T00:00:00.000Z');

    const updateCounter = () => {
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - startDate.getTime());

      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const years = Math.floor(totalDays / 365);
      const remainingDaysAfterYears = totalDays % 365;
      const months = Math.floor(remainingDaysAfterYears / 30);
      const days = remainingDaysAfterYears % 30;

      setTimeDiff({ years, months, days, hours, minutes, seconds });
    };

    updateCounter();
    const timer = setInterval(updateCounter, 1000);
    return () => clearInterval(timer);
  }, [config.relationshipStartDate]);

  const timeUnits = [
    { label: 'سنوات', value: timeDiff.years },
    { label: 'أشهر', value: timeDiff.months },
    { label: 'أيام', value: timeDiff.days },
    { label: 'ساعات', value: timeDiff.hours },
    { label: 'دقائق', value: timeDiff.minutes },
    { label: 'ثواني', value: timeDiff.seconds },
  ];

  return (
    <section className="w-full py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-cosmic-rosegold/40 shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold/50 text-xs text-cosmic-gold font-bold">
          <Clock className="w-4 h-4 text-cosmic-gold" /> عداد حبنا الحقيقي
        </div>

        <h3 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
          معاً منذ أن أشرقت شمسنا <Heart className="w-5 h-5 text-rose-500 fill-current animate-pulse" />
        </h3>

        {/* Counter Grid */}
        <div className="grid grid-cols-3 gap-3">
          {timeUnits.map((unit, idx) => (
            <div
              key={idx}
              className="bg-cosmic-deep/90 border border-cosmic-gold/30 rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg"
            >
              <span className="text-2xl md:text-3xl font-extrabold text-cosmic-gold tracking-tight typewriter-glow">
                {unit.value < 10 ? `0${unit.value}` : unit.value}
              </span>
              <span className="text-xs text-cosmic-rosegold font-medium mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-cosmic-dimText font-light italic">
          وكل ثانية قادمة ستكون أجمل من التي سبقتها.. ✨
        </p>
      </div>
    </section>
  );
};
