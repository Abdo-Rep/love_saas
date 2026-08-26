'use client';

import React from 'react';
import { useConfig } from '@/lib/configContext';
import { Sparkles, CheckCircle2, Circle } from 'lucide-react';

export const BucketListSection: React.FC = () => {
  const { config } = useConfig();
  const wishes = config.wishes || [];

  return (
    <section className="w-full py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs text-cosmic-gold font-bold px-3 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold">
            ✨ قائمة أمنياتنا المشتركة
          </span>
          <h3 className="text-2xl font-bold text-white">أحلام نسعى لتحقيقها معاً</h3>
        </div>

        <div className="space-y-3">
          {wishes.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`glass-panel rounded-2xl p-4 border transition-all duration-300 flex items-center justify-between gap-4 ${
                item.completed
                  ? 'border-cosmic-gold/60 bg-cosmic-gold/5 shadow-[0_0_15px_rgba(255,215,0,0.15)]'
                  : 'border-cosmic-rosegold/30 hover:border-cosmic-rosegold/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-cosmic-gold">
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-cosmic-gold fill-cosmic-gold/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-cosmic-rosegold" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      item.completed ? 'text-cosmic-gold line-through' : 'text-white'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-cosmic-rosegold font-medium">
                    {item.category}
                  </span>
                </div>
              </div>

              {item.completed && (
                <span className="text-[10px] text-cosmic-gold font-bold px-2 py-0.5 rounded-full bg-cosmic-gold/20 border border-cosmic-gold/40">
                  تمت بحب ❤️
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
