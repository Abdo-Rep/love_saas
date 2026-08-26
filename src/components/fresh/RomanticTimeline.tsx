'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Calendar, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export const RomanticTimeline: React.FC<Props> = ({ onNext }) => {
  const [activeStep, setActiveStep] = useState(0);

  const milestones = [
    {
      id: 1,
      tag: "اللقاء الأول ✨",
      title: "عندما التقت أعيننا لأول مرة",
      date: "لحظة غيرت مجرى حياتي",
      description: "من أول دقيقة شفتك فيها، عرفت إن الدنيا ابتسمتلي وإن قلبي مش هيعرف يدق لغيرك.",
      image: "/images/the_boss.jpg",
      color: "from-pink-600 to-rose-900"
    },
    {
      id: 2,
      tag: "سر السعادة 💖",
      title: "ابتسامتك التي تضيء عالمي",
      date: "كل يوم وبكل ثانية",
      description: "كل ما تحسي بضيق، افتكري دايماً إن ابتسامتك هي دوا لقلبي والنور اللي بينور عتمة أيامي.",
      image: "/images/peasant_girl.jpg",
      color: "from-amber-600 to-rose-900"
    },
    {
      id: 3,
      tag: "عهد ووعد 💍",
      title: "مكانك في القلب محفور للأبد",
      date: "إلى ما بعد النهاية",
      description: "بنات العالم كلهم في كفة، وأنتي لوحدك في كفة تانية كأنك ملكة جيتي من عالم تاني خالص.",
      image: "/images/the_boss.jpg",
      color: "from-purple-600 to-pink-900"
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#05020a] text-white flex flex-col justify-between p-6 md:p-12 select-none overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(236,72,153,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-pink-500/30 backdrop-blur-md self-center">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span className="text-xs font-bold text-pink-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
            محطات عشقنا الخالدة 📜
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
          ذكريات حُفرت في الوجدان
        </h1>
      </div>

      {/* TIMELINE CAROUSEL DISPLAY */}
      <div className="relative z-20 max-w-4xl mx-auto w-full my-8 flex flex-col items-center">
        <div className="w-full bg-black/60 border border-rose-500/30 backdrop-blur-2xl rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(244,63,94,0.25)] flex flex-col md:flex-row items-center gap-8">
          
          {/* Card Image Frame */}
          <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-rose-500/50 shadow-2xl shrink-0">
            <img
              src={milestones[activeStep].image}
              alt="Milestone"
              className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 border border-rose-400/50 text-xs font-bold text-amber-300 backdrop-blur-md" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {milestones[activeStep].tag}
            </div>
          </div>

          {/* Card Text Content */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 text-right">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <Calendar className="w-4 h-4" />
              <span>{milestones[activeStep].date}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-rose-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {milestones[activeStep].title}
            </h2>

            <p className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {milestones[activeStep].description}
            </p>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
              <button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className={`p-3 rounded-full border transition-all ${
                  activeStep === 0 ? 'opacity-30 cursor-not-allowed border-white/10' : 'bg-rose-500/20 border-rose-500/50 hover:bg-rose-500/40 text-rose-300'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {milestones.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                      idx === activeStep ? 'w-8 bg-rose-500 shadow-[0_0_12px_#f43f5e]' : 'w-2.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveStep((prev) => Math.min(milestones.length - 1, prev + 1))}
                disabled={activeStep === milestones.length - 1}
                className={`p-3 rounded-full border transition-all ${
                  activeStep === milestones.length - 1 ? 'opacity-30 cursor-not-allowed border-white/10' : 'bg-rose-500/20 border-rose-500/50 hover:bg-rose-500/40 text-rose-300'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 text-white font-extrabold text-base border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>افتح مظروف الرسالة السرية 💌</span>
        </button>
      </div>
    </div>
  );
};
