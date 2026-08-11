'use client';

import React, { useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { PenTool, Send, CheckCircle } from 'lucide-react';

export const WrittenQASection: React.FC = () => {
  const { config, submitAnswer } = useConfig();
  const questions = config.writtenQuestions || [];
  const [answersMap, setAnswersMap] = useState<{ [key: string]: string }>({});
  const [submittedMap, setSubmittedMap] = useState<{ [key: string]: boolean }>({});

  const handleTextChange = (id: string, text: string) => {
    setAnswersMap((prev) => ({ ...prev, [id]: text }));
  };

  const handleSubmit = (id: string, questionText: string) => {
    const answerText = answersMap[id];
    if (!answerText || !answerText.trim()) return;

    submitAnswer(id, questionText, answerText.trim());
    setSubmittedMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="w-full py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs text-cosmic-gold font-bold px-3 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold">
            ✍️ أسئلة بصوت قلمكِ
          </span>
          <h3 className="text-2xl font-bold text-white">اكتبي إجاباتكِ لتصل لقلبي مباشرة</h3>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isSubmitted = !!submittedMap[q.id];

            return (
              <div
                key={q.id || idx}
                className="glass-panel rounded-3xl p-6 border border-cosmic-rosegold/40 shadow-xl space-y-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cosmic-gold/20 border border-cosmic-gold flex items-center justify-center text-cosmic-gold text-xs font-bold">
                    #{idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-relaxed">{q.question}</h4>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={3}
                    disabled={isSubmitted}
                    value={answersMap[q.id] || ''}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    placeholder="اكتبي إجابتكِ الرومانسية هنا..."
                    className="w-full p-3.5 rounded-2xl bg-cosmic-bg/90 border border-cosmic-rosegold/50 text-white text-sm placeholder-cosmic-dimText focus:outline-none focus:border-cosmic-gold transition resize-none font-medium"
                  />

                  <button
                    onClick={() => handleSubmit(q.id, q.question)}
                    disabled={isSubmitted || !answersMap[q.id]?.trim()}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                      isSubmitted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : 'bg-gradient-to-r from-cosmic-rosegold to-cosmic-gold text-cosmic-bg hover:brightness-110 shadow-lg'
                    }`}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> تم إرسال إجابتكِ لقلبه بنجاح ✨
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> إرسال الإجابة حية 💌
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
