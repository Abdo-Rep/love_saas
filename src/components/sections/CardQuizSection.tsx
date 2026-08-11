'use client';

import React, { useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { Gamepad2, CheckCircle2, Sparkles } from 'lucide-react';

export const CardQuizSection: React.FC = () => {
  const { config } = useConfig();
  const questions = config.quizQuestions || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const activeQ = questions[currentIdx];
  if (!activeQ) return null;

  const handleSelect = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <section className="w-full py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md glass-panel-gold rounded-3xl p-6 border-2 border-cosmic-gold/50 shadow-2xl space-y-6">
        {/* Header & Progress Bar */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold text-xs text-cosmic-gold font-bold">
            <Gamepad2 className="w-4 h-4" /> تعالي نلعب؟ (سؤال ورأي)
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cosmic-rosegold to-cosmic-gold h-full transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          <span className="text-[11px] text-cosmic-rosegold font-semibold">
            سؤال {currentIdx + 1} من {questions.length}
          </span>
        </div>

        {/* Question text */}
        <h3 className="text-lg font-bold text-white text-center leading-relaxed">
          {activeQ.question}
        </h3>

        {/* 4 Option Cards */}
        <div className="grid grid-cols-2 gap-3">
          {activeQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`p-4 rounded-2xl border text-sm font-bold text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                selectedOption === idx
                  ? 'bg-gradient-to-tr from-cosmic-rosegold to-cosmic-gold text-cosmic-bg border-cosmic-gold shadow-[0_0_20px_#FFD700]'
                  : 'bg-cosmic-deep/80 text-white border-cosmic-rosegold/30 hover:border-cosmic-gold/60'
              }`}
            >
              <span>{opt}</span>
              {selectedOption === idx && <CheckCircle2 className="w-5 h-5 text-cosmic-bg" />}
            </button>
          ))}
        </div>

        {/* Response Feedback */}
        {selectedOption !== null && (
          <div className="p-4 rounded-2xl bg-cosmic-bg/90 border border-cosmic-gold animate-fade-in text-center space-y-3">
            <p className="text-sm font-bold text-cosmic-gold flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" /> رد حبيبكِ:
            </p>
            <p className="text-sm font-medium text-white">
              "{activeQ.responses[selectedOption]}"
            </p>

            <button
              onClick={handleNext}
              className="mt-2 text-xs font-bold text-cosmic-bg bg-cosmic-gold px-4 py-2 rounded-xl shadow hover:brightness-110 transition"
            >
              السؤال التالي ⬅️
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
