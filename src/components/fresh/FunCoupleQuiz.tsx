'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Trophy, Award, CheckCircle2, RotateCcw, Zap, Crown, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onNext?: () => void;
}

export const FunCoupleQuiz: React.FC<Props> = ({ onNext }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const questions = [
    {
      id: 1,
      tag: "الاهتمام والحب 💖",
      question: "مين اللي بيقعد يفكر في التاني طول اليوم وما بيطلعش من باله أبداً؟",
      badge: "🔥 مستوى العشق الصافي",
      options: [
        { text: "أنا طبعاً.. عايش في تفكيري طول الوقت 👑", points: 50 },
        { text: "هي القمر اللي خاطفة عيوني وتفكيري 🌸", points: 50 },
        { text: "إحنا الإثنين بنفكر في بعض كل ثانية ✨", points: 100 }
      ]
    },
    {
      id: 2,
      tag: "الدلع والصلح 🙈",
      question: "لما يحصل سوء فهم بسيط.. مين صاحب أسرع خطوة للصلح والدلع؟",
      badge: "🕊️ حمامة السلام الملكية",
      options: [
        { text: "أنا اللي بجري أصالها وأدلعها فوراً 💕", points: 50 },
        { text: "هي بطيبتها وحنيتها بتنسى في ثانية 🌷", points: 50 },
        { text: "بنصالح بعض في نفس الدقيقة بالحب ❤️", points: 100 }
      ]
    },
    {
      id: 3,
      tag: "الأناقة والخروج 👗🎩",
      question: "مين اللي بياخد وقت أطول عشان يجهز ويتأنق قبل أي خروجة؟",
      badge: "✨ أساطير الأناقة والجمال",
      options: [
        { text: "أنا عشان أظهر قدامها بأحلى مظهر 🎩", points: 50 },
        { text: "هي الملكة ولازم تطلع قمر كالعادة 👸", points: 50 },
        { text: "بنتأنق سوى وبنطلع أشيك ثنائي 📸", points: 100 }
      ]
    },
    {
      id: 4,
      tag: "الذوق والأكل 🍕🍔",
      question: "مين صاحب القرار الأول دايماً في اختيار المكان والأكل المفضل؟",
      badge: "👑 بوصلة السعادة والذوق",
      options: [
        { text: "أنا صاحب الأفكار والفسح الجديدة 🚗", points: 50 },
        { text: "ذوقها هو القرار الأول والأخير دايماً 💖", points: 50 },
        { text: "بنتفق سوى وبنستمتع بأحلى وقت ✨", points: 100 }
      ]
    },
    {
      id: 5,
      tag: "الحنية والسند 🛡️❤️",
      question: "مين السند والأمان والحنية الحقيقية اللي بتنور الحياة؟",
      badge: "🏆 الجائزة الكبرى للعمر",
      options: [
        { text: "هي أرق وأحن إنسانة شافتها عيني 🕊️", points: 100 },
        { text: "أنا الحامي والسند ليها طول العمر 🛡️", points: 100 },
        { text: "قلبي وقلبها روح واحدة في جسدين 💖", points: 100 }
      ]
    }
  ];

  const handleSelectOption = (idx: number, points: number) => {
    setSelectedOption(idx);
    setScore((prev) => prev + points);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#ff4d6d', '#ffd700', '#ec4899', '#38bdf8', '#ffffff']
          });
        } catch (_) {}
      }
    }, 400);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#04010a] text-white flex flex-col justify-between p-4 md:p-8 select-none overflow-hidden text-center">
      
      {/* Dynamic Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,63,94,0.22)_0%,_transparent_75%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-20 text-center max-w-xl mx-auto flex flex-col gap-2 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-amber-400/40 backdrop-blur-md self-center">
          <Crown className="w-4 h-4 text-amber-300 animate-bounce" />
          <span className="text-xs md:text-sm font-black text-amber-300 tracking-wider" style={{ fontFamily: "'Cairo', sans-serif" }}>
            تحدي العشاق الملوكي 🎡🏆
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-100 to-amber-300 drop-shadow-md" style={{ fontFamily: "'Cairo', sans-serif" }}>
          رحلة اكتشاف أسرار العشق
        </h1>
      </div>

      {/* MAIN GAME CONTAINER */}
      <div className="relative z-20 max-w-2xl mx-auto w-full my-4">
        {!isCompleted ? (
          /* QUESTION CARD FRAME */
          <div className="w-full bg-gradient-to-b from-[#140620] via-[#0b0312] to-black border-2 border-rose-500/50 backdrop-blur-2xl rounded-3xl p-6 md:p-10 shadow-[0_0_60px_rgba(244,63,94,0.35)] flex flex-col gap-6 text-right">
            
            {/* Top Bar Status */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs md:text-sm font-black" style={{ fontFamily: "'Cairo', sans-serif" }}>
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>نقاط الحب: {score} XP</span>
              </div>
              <span className="text-xs font-bold text-rose-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {questions[currentQuestion].badge}
              </span>
            </div>

            {/* Question Badge Tag */}
            <div className="inline-block px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-xs font-extrabold text-pink-300 self-start" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {questions[currentQuestion].tag}
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-black text-white leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {questions[currentQuestion].question}
            </h2>

            {/* Option Cards */}
            <div className="flex flex-col gap-3.5 pt-2">
              {questions[currentQuestion].options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx, opt.points)}
                    className={`w-full py-4 px-6 rounded-2xl text-sm md:text-base font-bold transition-all duration-300 text-right border flex items-center justify-between active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 border-amber-300 text-white shadow-[0_0_25px_rgba(245,158,11,0.8)] scale-[1.02]'
                        : 'bg-white/5 border-white/15 text-white/90 hover:bg-rose-500/20 hover:border-rose-400/50 hover:text-white'
                    }`}
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    <span>{opt.text}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-amber-300 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/30 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentQuestion ? 'w-8 bg-amber-400 shadow-[0_0_12px_#f59e0b]' : idx < currentQuestion ? 'w-2.5 bg-rose-500' : 'w-2.5 bg-white/20'
                  }`}
                />
              ))}
            </div>

          </div>
        ) : (
          /* GRAND ROYAL CERTIFICATE AWARD */
          <div className="w-full bg-gradient-to-b from-[#1f092b] via-[#12041a] to-black border-2 border-amber-400/70 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(245,158,11,0.5)] flex flex-col items-center gap-6 animate-fadeIn">
            
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.8)] border-2 border-amber-300 animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-xs font-black text-amber-300 self-center">
                <Crown className="w-4 h-4" />
                <span>شهادة العشق الملوكي الخالدة</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-200 to-pink-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
                النتيجة: {score} / 600 XP (أعلى تقييم ملوكي!) 🏆
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-amber-400/40 text-rose-100 text-sm md:text-base leading-relaxed max-w-lg" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <p className="font-extrabold text-amber-300 text-lg mb-2">تُوجتما بلقب أعظم ثنائي في الوجود! 👑💖</p>
              <p>
                أثبتت النتائج أن كل تفصيلة بينكما تنبض بالعشق الخالص، وأن الحب المتبادل بينكما يتجاوز كل المقاييس والحدود! ✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
              <button
                onClick={() => { setIsCompleted(false); setCurrentQuestion(0); setScore(100); }}
                className="w-full py-3.5 px-6 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-xs md:text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة التحدي 🔄</span>
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
