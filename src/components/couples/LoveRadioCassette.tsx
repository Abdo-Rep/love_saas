'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles, Mic, Play, Pause, ArrowRight, Square, Trash2, Plus, Check } from 'lucide-react';
import { useConfig } from '@/lib/configContext';
import { useTenant } from '@/lib/tenantContext';
import { bgMusic } from '@/lib/bgMusic';

interface Props {
  onNext: () => void;
}

interface VoiceTape {
  id: string;
  senderName: string;
  audioUrl: string;
  duration?: number;
  dateStr: string;
}

export const LoveRadioCassette: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const { currentTenant } = useTenant();
  const slug = currentTenant?.slug || 'rawda';

  // Audio Player State
  const [tapes, setTapes] = useState<VoiceTape[]>([]);
  const [activeTapeId, setActiveTapeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Live Microphone Recorder State
  const [showRecorderModal, setShowRecorderModal] = useState(false);
  const [senderNameInput, setSenderNameInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const storageKey = `soulove_voice_tapes_${slug}`;

  // Load saved tapes on mount
  useEffect(() => {
    // 1. Pause background music while listening to voice
    bgMusic.pause(false);

    let loadedTapes: VoiceTape[] = [];
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        loadedTapes = JSON.parse(saved);
      }
    } catch (_) {}

    // Default initial tapes if empty
    if (loadedTapes.length === 0) {
      const defaultSrc = config.voiceAudioUrl || '/sound/WhatsApp Video 2026-08-11 at 3.56.53 AM.mp4';
      loadedTapes = [
        {
          id: 'tape_1',
          senderName: config.hisName || 'أحمد',
          audioUrl: defaultSrc,
          dateStr: 'رسالة سابقة'
        }
      ];
    }

    setTapes(loadedTapes);
    if (loadedTapes.length > 0) {
      setActiveTapeId(loadedTapes[0].id);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (config.storySongUrl) {
        bgMusic.play(config.storySongUrl, false);
      }
    };
  }, [slug]);

  // Audio Playback effect
  const activeTape = tapes.find((t) => t.id === activeTapeId);

  const togglePlayActiveTape = () => {
    if (!activeTape) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(activeTape.audioUrl);
    audioRef.current = newAudio;

    newAudio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log('Play failed:', err);
      setIsPlaying(false);
    });

    newAudio.onended = () => {
      setIsPlaying(false);
    };
  };

  // Start Live Audio Recording
  const startRecording = async () => {
    if (!senderNameInput.trim()) {
      alert('يرجى كتابة اسمك أولاً (مثال: أحمد أو روان)');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const newTape: VoiceTape = {
            id: `tape_${Date.now()}`,
            senderName: senderNameInput.trim(),
            audioUrl: base64Audio,
            dateStr: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
          };

          const updated = [newTape, ...tapes];
          setTapes(updated);
          setActiveTapeId(newTape.id);
          try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
          } catch (_) {}

          setShowRecorderModal(false);
          setSenderNameInput('');
          setIsRecording(false);
          setRecordingTime(0);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      alert('لم نتمكن من الوصول للميكروفون! يرجى السماح للمتصفح بالوصول للميكروفون.');
    }
  };

  // Stop Live Audio Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Delete Tape
  const handleDeleteTape = (id: string) => {
    const updated = tapes.filter((t) => t.id !== id);
    setTapes(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (_) {}
    if (activeTapeId === id) {
      setActiveTapeId(updated[0]?.id || null);
      setIsPlaying(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-transparent text-white flex flex-col justify-between p-4 sm:p-6 select-none overflow-x-hidden text-center dir-rtl">
      
      {/* AMBIENT GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.2)_0%,_transparent_70%)] pointer-events-none z-0" />

      {/* HEADER */}
      <div className="relative z-10 max-w-xl mx-auto flex flex-col gap-2 pt-10 sm:pt-12">
        <div className="inline-flex items-center justify-center gap-2 px-5 py-1.5 rounded-full bg-white/5 border border-pink-400/30 text-amber-300 text-xs font-bold backdrop-blur-md mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span style={{ fontFamily: "'Cairo', sans-serif" }}>
            كاسيت الرسائل الصوتية المتبادلة 🎙️💖
          </span>
        </div>
        <h1
          className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          أصواتكم ورسائلكم بصوتكم في مكان واحد
        </h1>
      </div>

      {/* MAIN CASSETTE PLAYER */}
      <div className="relative z-10 max-w-md mx-auto w-full my-6 flex flex-col items-center gap-6">
        
        {/* VINYL / CASSETTE DISC WITH PLAY CONTROL */}
        <div className="w-full bg-[#160312]/95 border border-pink-500/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.3)] flex flex-col items-center gap-6 text-center">
          
          {/* SPINNING DISC COVER */}
          <div className="relative flex items-center justify-center">
            <div
              className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1.5 shadow-[0_0_40px_rgba(244,114,182,0.5)] border-4 border-pink-400/60 flex items-center justify-center overflow-hidden bg-black ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            >
              <img
                src={config.voicePhotoUrl || '/images/peasant_girl.jpg'}
                alt="Voice Disc"
                className="w-full h-full object-cover rounded-full opacity-90"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* CENTER PLAY BUTTON */}
            <button
              onClick={togglePlayActiveTape}
              className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.8)] border-2 border-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              )}
            </button>
          </div>

          {/* ACTIVE TAPE INFO */}
          {activeTape && (
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-extrabold text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                شريط بصوت: {activeTape.senderName} 🎙️
              </span>
              <span className="text-xs text-pink-300/70 font-mono">
                {activeTape.dateStr}
              </span>
            </div>
          )}

          {/* EQUALIZER WAVE ANIMATION */}
          <div className="flex items-center justify-center gap-1 h-6">
            {[12, 24, 16, 28, 20, 14, 26, 18, 22].map((height, i) => (
              <span
                key={i}
                className={`w-1 rounded-full bg-gradient-to-t from-rose-500 to-amber-300 transition-all ${
                  isPlaying ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  height: isPlaying ? `${height}px` : '6px',
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>

        </div>

        {/* TAPES LIST & RECORD NEW BUTTON */}
        <div className="w-full flex flex-col gap-3">
          
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
              الأشرطة الصوتية المسجلة ({tapes.length}):
            </span>

            <button
              onClick={() => setShowRecorderModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>تسجيل صوت جديد</span>
            </button>
          </div>

          {/* TAPES DECK SCROLLABLE LIST */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {tapes.map((tape) => (
              <div
                key={tape.id}
                onClick={() => {
                  setActiveTapeId(tape.id);
                  setIsPlaying(false);
                }}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  activeTapeId === tape.id
                    ? 'bg-rose-950/70 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3 text-right">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeTapeId === tape.id ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-300'
                  }`}>
                    🎙️
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      رسالة بصوت: {tape.senderName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {tape.dateStr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTape(tape.id);
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs"
                    title="حذف الشريط"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* RECORD NEW VOICE MESSAGE MODAL */}
      {showRecorderModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-sm w-full p-6 rounded-3xl bg-[#160312] border-2 border-pink-500/50 shadow-2xl flex flex-col items-center gap-5 text-center relative">
            
            <div className="w-full flex items-center justify-between border-b border-pink-500/20 pb-3">
              <h3 className="text-sm font-extrabold text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                تسجيل رسالة صوتية جديدة 🎙️
              </h3>
              <button
                onClick={() => {
                  if (isRecording) stopRecording();
                  setShowRecorderModal(false);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
            </div>

            {/* SENDER NAME INPUT */}
            <div className="w-full text-right">
              <label className="block text-xs font-bold text-pink-200 mb-1.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                أكتب اسمك هنا (مثال: أحمد أو روان):
              </label>
              <input
                type="text"
                value={senderNameInput}
                onChange={(e) => setSenderNameInput(e.target.value)}
                placeholder="اسمك هنا..."
                disabled={isRecording}
                className="w-full p-3 rounded-xl bg-black/60 border border-pink-500/30 text-white font-semibold text-center focus:border-rose-400 focus:outline-none text-xs"
                style={{ fontFamily: "'Cairo', sans-serif" }}
                autoFocus
              />
            </div>

            {/* RECORDING STATUS & TIMER */}
            {isRecording && (
              <div className="flex flex-col items-center gap-2 my-2">
                <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center animate-ping">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-lg font-mono font-bold text-amber-300">
                  {formatSeconds(recordingTime)}
                </span>
                <span className="text-xs text-rose-300 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  جاري التسجيل الآن... تحدث بصوتك ❤️
                </span>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="w-full pt-2">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-500 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  <Mic className="w-4 h-4" />
                  <span>بدء التسجيل بالميكروفون 🔴</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>إيقاف وحفظ الشريط ⏹️</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* NEXT STEP ACTION BUTTON */}
      <div className="relative z-10 pb-4 max-w-sm mx-auto w-full">
        <button
          onClick={onNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>أمنيات المستقبل</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

    </div>
  );
};
