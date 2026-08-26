'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Trophy, Award, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onNext: () => void;
}

export const WhoKnowsBetterGame: React.FC<Props> = ({ onNext }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      id: 1,
      tag: "سر السعادة 💖",
      question: "يا ترى إيه أكتر حاجة بتفرح قلبي لما تعمليها؟ 🌸",
      options: [
        { text: "ابتسامتكِ الرقيقة اللي بتنور الدنيا ✨", correct: true },
        { text: "لما تسرحي وتفكري فيا بعيونكِ الحلوة 🥺", correct: true },
        { text: "حنيتكِ واهتمامكِ بكل تفصيلة صغيرة 🕊️", correct: true }
      ]
    },
    {
      id: 2,
      tag: "ذكرياتنا الأولى ☕",
      question: "أول إحساس جالي لما شفت عيونكِ لأول مرة كان إيه؟ 👑",
      options: [
        { text: "إن الدنيا ابتسمتلي وإن إنتي أميرتي 👸", correct: true },
        { text: "إن قلبي مش هيعرف ينبض ولا يحب غيركِ 💕", correct: true },
        { text: "إحساس بالراحة والأمان المفتقد من زمان 🌸", correct: true }
      ]
    },
    {
      id: 3,
      tag: "الهدوء والراحة 🕊️",
      question: "لما أكون مضغوط في يومي.. إيه أكتر حاجة بتهديني؟ ☕",
      options: [
        { text: "صوتكِ الرقيق واهتمامكِ بيا 🎙️❤️", correct: true },
        { text: "لما أسمع ضحكتكِ اللي بتطمن قلبي 😊", correct: true },
        { text: "حضنكِ ووجودكِ جنبي في أي وقت 🛡️", correct: true }
      ]
    },
    {
      id: 4,
      tag: "الدلع والاهتمام 🌷",
      question: "إيه أكتر كلمة بحب أسمعها منكِ دايماً؟ 💌",
      options: [
        { text: "كلمة بحبك اللي طالعة من أعماق قلبكِ 💖", correct: true },
        { text: "اسم الدلع الخاص اللي بيننا بس 🙈", correct: true },
        { text: "لما تقوليلي إنت سندي وأماني 🕊️", correct: true }
      ]
    },
    {
      id: 5,
      tag: "العهد الأبدي 💍",
      question: "سر قوتنا وحبنا المتبادل الحقيقي هو إيه؟ 👑",
      options: [
        { text: "إننا روح واحدة مكتوبين لبعض للأبد ✨", correct: true },
        { text: "التفاهم والصلح السريع بالحب دايماً 🌸", correct: true },
        { text: "إننا بنكمل بعض ونقف مع بعض في كل خطوة ❤️", correct: true }
      ]
    }
  ];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setScore((prev) => prev + 20);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
          });
        } catch (_) {}
      }
    }, 450);
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden text-center">
      
      {/* Ambient Rose Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.18)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-pink-400/30 backdrop-blur-md self-center">
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
          <span className="text-xs md:text-sm font-bold text-pink-300 tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
            لعبة مين يعرف التاني أكتر؟ 🎯🌸
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
          اختبار القلوب العاطفي الممتع
        </h1>
      </div>

      {/* GAME CONTAINER */}
      <div className="relative z-20 max-w-md mx-auto w-full my-4">
        {!isCompleted ? (
          /* QUESTION CARD */
          <div className="w-full bg-white/5 border border-pink-400/30 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-[0_0_35px_rgba(244,114,182,0.2)] flex flex-col gap-5 text-right">
            
            {/* Progress Stepper & Tag */}
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
              <span className="text-xs font-bold text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                السؤال {currentQuestion + 1} من {questions.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-pink-400/30 text-[10px] font-bold text-pink-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {questions[currentQuestion].tag}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-black text-pink-100 leading-relaxed text-center" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {questions[currentQuestion].question}
            </h2>

            {/* Option Buttons */}
            <div className="flex flex-col gap-3 pt-1">
              {questions[currentQuestion].options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all text-right border flex items-center justify-between active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 border-amber-300 text-white shadow-[0_0_20px_rgba(244,114,182,0.6)]'
                        : 'bg-white/5 border-pink-400/20 text-pink-100 hover:bg-rose-500/20 hover:border-pink-300'
                    }`}
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    <span className="leading-relaxed">{opt.text}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-200 shrink-0 mr-2" />}
                  </button>
                );
              })}
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentQuestion ? 'w-7 bg-pink-400 shadow-[0_0_10px_#f472b6]' : idx < currentQuestion ? 'w-2 bg-pink-500' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

          </div>
        ) : (
          /* RESULT CARD */
          <div className="w-full bg-white/5 border border-pink-400/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,114,182,0.3)] flex flex-col items-center gap-5 animate-fadeIn">
            
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 flex items-center justify-center shadow-lg border border-white/50 animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              نتيجة معرفة القلوب: 100% 🏆💖
            </h2>

            <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 text-pink-100 text-xs sm:text-sm font-semibold leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <p className="font-extrabold text-amber-200 text-base mb-1.5">إنتي عارفة قلبي وفاهمة تفاصيلي أكتر من أي حد! 👑✨</p>
              <p>
                كل الإجابات أثبتت إننا روح واحدة وكيان واحد، وأن القلوب متصلة ببعضها بحب حقيقي لا ينتهي ❤️
              </p>
            </div>

            <button
              onClick={() => { setIsCompleted(false); setCurrentQuestion(0); setScore(0); setSelectedOption(null); }}
              className="py-2.5 px-6 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center gap-2"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الاختبار 🔄</span>
            </button>

          </div>
        )}
      </div>

      {/* FOOTER BUTTON */}
      <div className="relative z-20 max-w-sm mx-auto w-full text-center pb-4">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs md:text-sm border border-rose-300/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>التالي: قائمة أمنياتنا الكبرى 🗺️✈️</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
