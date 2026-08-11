'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Heart, FastForward, Sparkles } from 'lucide-react';
import { useConfig } from '@/lib/configContext';

interface Props {
  planets?: any[];
  onStepComplete: () => void;
}

// ── 100 UNIQUE SINGLE ARABIC ROMANTIC WORDS ─────────────────────────────────
const WORDS_1 = [
  "أحبكِ","روحي","قلبي","نبضي","عمري","حياتي","سعادتي","أمانِي","وجودكِ","قدري",
  "وطني","أنسي","شوقي","نوري","نجمتي","دنيتي","عيوني","حلمي","بهجتي","جوهري",
  "صبري","نعمتي","هنائي","راحتي","فرحتي","ملاذي","معناي","زهرتي","أميرتي","رفيقتي",
  "صوتكِ","ابتسامتكِ","لمستكِ","طيبتكِ","صدقكِ","وفاؤكِ","حضوركِ","ذكراكِ","بريقكِ","سحركِ",
  "صفاؤكِ","روعتكِ","جمالكِ","حكمتكِ","عمقكِ","حُسنكِ","لطفكِ","حنانكِ","دفؤكِ","إشراقكِ",
  "قمركِ","شمسكِ","كنزكِ","إلهامي","رباني","يشتاق","يعشق","يحنّ","يهواكِ","يُكمل",
  "دائماً","أبداً","وحدكِ","يسكن","يبقى","يُضيء","يحمي","تألّقي","توهّجكِ","أعمق",
  "أصفى","أرقى","أنقى","أوفى","أجمل","أحلى","أثمن","أعزّ","أبهى","أنضر",
  "لقائي","ظلّكِ","خطواتكِ","نورانيّتكِ","غيابكِ","مَلاكي","ضياؤكِ","عُمقكِ","سِرّي","رُوحاني",
  "يُبدع","يُعطي","تُعلّمني","تُكملني","تُنيرني","تُسعدني","تُلهمني","تُهدّئني","يُدفئني","يُحلّق",
];

// ── 100 UNIQUE 2-WORD ARABIC ROMANTIC PHRASES ───────────────────────────────
const WORDS_2 = [
  "أنتِ الأمان","نبض قلبي","أجمل هدية","كل حياتي","حبي الأبدي","روحي معكِ",
  "قلبي لكِ","عمري أنتِ","نوري الدائم","ملاكي أنتِ","حلمي تحقّق","أميرتي الغالية",
  "وجودكِ نعمة","اشتقت إليكِ","يبقى دائماً","أحبكِ جداً","سعادتي أنتِ","حياتي معكِ",
  "كوني أنتِ","قدري اخترتكِ","صوتكِ جنّة","ابتسامتكِ نور","لمستكِ دفء","طيبتكِ سحر",
  "وفاؤكِ يُدهشني","إشراقكِ يعمي","بريقكِ يُبهج","جمالكِ يُسحر","عمقكِ يُلهم","حنانكِ يشفي",
  "صفاؤكِ نقاء","دفؤكِ ملجأ","شوقي يكبر","أنسي وحدكِ","فرحتي معكِ","راحتي جنبكِ",
  "هنائي أنتِ","بهجتي كلها","نعمتي الكبرى","كنزكِ الثمين","زهرتي الجميلة","روعتكِ تسحرني",
  "حكمتكِ تُعلّمني","لطفكِ يلمسني","قمركِ يُضيء","شمسكِ تُدفئ","حلمي بدأ","لقاؤنا سماوي",
  "ظلّكِ أمان","يدكِ دفء","عينيكِ بحر","شعركِ ليل","ضحكتكِ صبح","روحكِ صافية",
  "قلبكِ طاهر","نيّتكِ جميلة","وردتي الحمراء","نجمتي الساطعة","فلكي أنتِ","كوكبي الوحيد",
  "أغلى اختيار","أعزّ وجود","أجمل لحظة","أحلى ذكرى","أثمن هدية","أبهى صورة",
  "يُسعدني وجودكِ","يُكملني حبّكِ","يُنيرني نورك","يُلهمني كلامكِ","يُدفئني حضوركِ","يُهدّئني صوتكِ",
  "قصّتنا تستمر","رحلتنا جميلة","دنيانا معاً","مستقبلنا واعد","حلمنا مشترك","حياتنا كاملة",
  "أنتِ كافية","أنتِ عطائي","أنتِ أجمل","أنتِ أعمق","أنتِ أحلى","معكِ أكتمل",
  "معكِ أسمو","معكِ أحلق","معكِ أجد","معكِ أبدع","إليكِ دائماً","لكِ وحدكِ",
  "فيكِ أجمل","بكِ أحيا","منكِ أتعلم","حولكِ عالمي","بجانبكِ ألوان","عندكِ أمان",
  "بحبكِ كثيراً","بحبكِ جداً",
];

// ── 100 UNIQUE 3-WORD ARABIC ROMANTIC PHRASES ───────────────────────────────
const WORDS_3 = [
  "أحبكِ إلى الأبد","أنتِ كل شيء","وجودكِ أجمل نعمة","كل يوم أحبكِ","سأبقى معكِ دائماً",
  "أنتِ أجمل قصة","روحي معكِ دائماً","قلبي لكِ فقط","عمري بدأ بكِ","حياتي تكتمل بكِ",
  "سعادتي في عينيكِ","أنتِ نور درب","معكِ أنا أحيا","بكِ أجد نفسي","فيكِ ألوان الحياة",
  "لكِ كل قلبي","أنتِ قدري اخترتكِ","وجودكِ يشعل الفرح","ابتسامتكِ تُنير الكون","صوتكِ يُهدّئ الروح",
  "كل نبضة لكِ","أنتِ أجمل حلم","روحانا التقتا هنا","حبّنا فوق الكلام","دنيانا معاً جميلة",
  "معكِ ألتقي نفسي","بجانبكِ أجد أمان","أنتِ شمسي وقمري","بكِ يكتمل معناي","لأجلكِ أسمو دائماً",
  "أنتِ كنز نادر","معكِ كل شيء","قصّتنا لا تنتهي","رحلتنا ممتعة جداً","حلمنا يكبر يومياً",
  "أحلى لقاء عمري","أجمل هدية الله","أعزّ وجود قلبي","أثمن اختيار عمري","أبهى صفحة حياتي",
  "أنتِ روحي الثانية","أحبكِ من أعماقي","وجودكِ نعمة كبرى","معكِ أحلق عالياً","إليكِ دائماً أعود",
  "لكِ أكتب قصائد","بكِ أغنّي دائماً","فيكِ أرى الجمال","حولكِ ألوان الحياة","عندكِ ملجأ روحي",
  "أنتِ بيتي الدافئ","معكِ لا أخاف","بجانبكِ أشعر بالأمان","أنتِ غالية جداً","بكِ يكتمل كوني",
  "أحبكِ بلا حدود","وجودكِ يُسعد قلبي","ابتسامتكِ تُنسيني همومي","صوتكِ أجمل موسيقى","لمستكِ تُشفي جراحي",
  "طيبتكِ تُلهم الجميع","حنانكِ يملأ الروح","لطفكِ يسحر القلوب","دفؤكِ يُذيب الجليد","إشراقكِ يُنير الطريق",
  "بريقكِ يُبهج عيني","جمالكِ فوق الوصف","عمقكِ لا حدود","حكمتكِ تُعلّم الجميع","صفاؤكِ كالماء النقي",
  "روعتكِ تأخذ الأنفاس","سحركِ لا يُقاوَم","أنتِ المعنى الحقيقي","معكِ أجد السلام","أنتِ أماني كلها",
  "بحبكِ قد النجوم","بحبكِ فوق الكلام","بحبكِ أكثر بكثير","بحبكِ من كل قلبي","بحبكِ للأبد أنا",
  "أنتِ ملكتي الحقيقية","معكِ أكتسب القوة","بكِ أتجاوز الصعاب","أنتِ سبب ابتسامتي","معكِ أعرف نفسي",
  "أنتِ تكملين حياتي","معكِ أصنع الذكريات","بكِ يكبر قلبي","أنتِ كل أحلامي","معكِ حياتي معنى",
  "أحبكِ يا روحي","أحبكِ يا قلبي","أحبكِ يا حياتي","أحبكِ يا نجمتي","أحبكِ يا أميرتي",
  "سأظل أحبكِ دائماً","سأبقى لكِ وفياً","سأعطيكِ كل شيء","سأكون بج�    if (sequence === 'TUNNEL_FLIGHT') {
      // 11s high-speed flight through cylinder, then 4s finale = 15s total!
      const t = setTimeout(()=>setSequence('HEART_FINALE'), 11000);
      return ()=>clearTimeout(t);
    }
    if (sequence === 'HEART_FINALE') {
      const t = setTimeout(()=>setSequence('SOLAR_ORBIT'), 4000);
      return ()=>clearTimeout(t);
    }
    if (sequence === 'SOLAR_ORBIT') {
      const t = setTimeout(()=>onStepComplete(), 5000);
      return ()=>clearTimeout(t);
    }
  }, [sequence, onStepComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    // ── HELICAL SPIRAL CYLINDER CONFIG ─────────────────────────────────────
    const FOV          = 560;
    const WALL_R       = 210;   // 50% larger for edge-to-edge fill
    const BASE_SPD     = 26.0;  // High-speed sprint through the cylinder!
    const N_ITEMS      = 350;   // Total items along fixed-length spiral
    const SPIRAL_ANG   = 0.35;
    const SPIRAL_Z_GAP = 10.5;  // Cylinder length = ~3675 depth units

    // Master content pool
    const rawPool: string[] = [];
    const maxLen = Math.max(WORDS_1.length, WORDS_2.length, WORDS_3.length);
    for (let i = 0; i < maxLen; i++) {
      if (WORDS_1[i]) rawPool.push(WORDS_1[i]);
      if (WORDS_2[i]) rawPool.push(WORDS_2[i]);
      if (WORDS_3[i]) rawPool.push(WORDS_3[i]);
      if (i < EMOJI_ITEMS.length) rawPool.push(EMOJI_ITEMS[i]);
    }
    const ALL_TEXT: string[] = rawPool.filter(Boolean);

    // Shuffle pool
    for (let i = ALL_TEXT.length - 1; i > 0; i--) {
      const j = Math.floor((i * 7919 + 1) % (i + 1));
      [ALL_TEXT[i], ALL_TEXT[j]] = [ALL_TEXT[j], ALL_TEXT[i]];
    }

    const COLORS = ['#ff758f','#ffd700','#ff4d6d','#ffb6c1','#a855f7','#38bdf8','#ffffff','#ff9ef5','#a0f0a0','#f0c0ff'];

    // ── STARS ───────────────────────────────────────────────────────────────
    const stars: {sx:number;sy:number;sz:number;r:number}[] = [];
    for (let i=0;i<380;i++)
      stars.push({sx:(Math.random()-.5)*W*4,sy:(Math.random()-.5)*H*4,sz:Math.random()*1500+80,r:Math.random()*1.8+.4});

    // ── FINITE HELICAL (SPIRAL) CYLINDER ITEMS ──────────────────────────────
    type CylItem = {
      baseAngle: number; z: number; text: string; color: string;
      fontSize: number; isEmoji: boolean; isLong: boolean;
      radiusFactor: number;
      screenX: number; screenY: number;
    };
    const items: CylItem[] = [];

    for (let i = 0; i < N_ITEMS; i++) {
      const text = ALL_TEXT[i % ALL_TEXT.length] || "حب";
      const isEmoji = /\p{Emoji}/u.test(text) && text.length <= 4;
      const wordCount = text.split(' ').length;
      const isLong = wordCount >= 3;

      const layer = i % 3;
      const radiusFactor = layer === 0 ? 0.75 : layer === 1 ? 1.0 : 1.25;

      items.push({
        baseAngle: i * SPIRAL_ANG,
        z: i * SPIRAL_Z_GAP + 150, // Fixed z position from start to end of cylinder
        text,
        color: COLORS[i % COLORS.length],
        fontSize: isEmoji ? 22 : isLong ? 11 : 14,
        isEmoji, isLong,
        radiusFactor,
        screenX: W/2, screenY: H/2,
      });
    }

    // ── FLOATING PHOTOS ALONG SPIRAL ─────────────────────────────────────────
    type Photo = {
      baseAngle: number; z: number; rotation: number; floatPhase: number;
      radiusFactor: number; screenX: number; screenY: number;
      gradColors: [string, string]; label: string;
    };
    const PHOTO_LABELS = ["ذكرياتنا","معكِ","لحظتنا","قلبان","حب","قصتنا","ملكتي","أنتِ","أبداً","روحي","وجودكِ","سعادتي"];
    const PHOTO_GRADS: [string,string][] = [
      ['#ff758f','#ff4d6d'],['#a855f7','#6d28d9'],['#38bdf8','#0ea5e9'],
      ['#ffd700','#f97316'],['#ff758f','#a855f7'],['#38bdf8','#a855f7'],
      ['#ffd700','#10b981'],['#ff4d6d','#f97316'],['#c026d3','#7c3aed'],
      ['#0ea5e9','#14b8a6'],['#ff758f','#ffd700'],['#84cc16','#10b981'],
    ];
    const photos: Photo[] = [];
    const PHOTO_COUNT = 14;
    for (let i = 0; i < PHOTO_COUNT; i++) {
      const idxOnSpiral = Math.floor(i * (N_ITEMS / PHOTO_COUNT));
      photos.push({
        baseAngle: idxOnSpiral * SPIRAL_ANG + Math.PI / 6,
        z: idxOnSpiral * SPIRAL_Z_GAP + 250,
        rotation: (Math.random() - 0.5) * 0.17,
        floatPhase: Math.random() * Math.PI * 2,
        radiusFactor: 0.92,
        screenX: W/2, screenY: H/2,
        gradColors: PHOTO_GRADS[i % PHOTO_GRADS.length],
        label: PHOTO_LABELS[i % PHOTO_LABELS.length],
      });
    }

    // ── HIGHLIGHT TRACKING ───────────────────────────────────────────────────
    const hlDone = new Array(WALL_HIGHLIGHTS.length).fill(false);

    // ── FINALE STATE ─────────────────────────────────────────────────────────
    type FinItem = {text:string;color:string;fs:number;isEmoji:boolean;sx:number;sy:number;tx:number;ty:number};
    let finaleItems: FinItem[] = [];
    let finaleInit = false;
    type Part = {x:number;y:number;vx:number;vy:number;a:number;color:string;r:number};
    const parts: Part[] = [];

    // ── RUNTIME STATE ────────────────────────────────────────────────────────
    let camZ     = 0;
    let cylRot   = 0;
    let orbitAng = 0;
    let speed    = BASE_SPD;
    let targetSpd = BASE_SPD;
    let pausing  = false;
    let pauseLeft = 0;
    let finT     = 0;
    let animId: number;

    // ── PROJECTION ───────────────────────────────────────────────────────────
    const proj = (wx:number,wy:number,relZ:number,cx:number,cy:number) => {
      if (relZ <= 1) return null;
      const k = FOV / relZ;
      return { sx: cx + wx*k, sy: cy + wy*k, k };
    };

    // ── DRAW PHOTO CARD ──────────────────────────────────────────────────────
    const drawPhoto = (px:number,py:number,scale:number,rot:number,floatOff:number,gradC:[string,string],label:string,alpha:number) => {
      const w = 28 * scale, h = 21 * scale;
      if (w < 4) return;
      ctx.save();
      ctx.globalAlpha = Math.min(0.85, alpha * 0.85);
      ctx.translate(px, py + floatOff);
      ctx.rotate(rot);

      ctx.shadowColor = gradC[0];
      ctx.shadowBlur = 8 * scale;

      const r = 4 * scale;
      ctx.beginPath();
      ctx.roundRect(-w/2, -h/2, w, h, r);
      ctx.clip();

      const grd = ctx.createLinearGradient(-w/2,-h/2,w/2,h/2);
      grd.addColorStop(0, gradC[0] + 'dd');
      grd.addColorStop(1, gradC[1] + 'dd');
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.font = `${Math.max(4, 9*scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('❤️', 0, -h/6);

      if (scale > 0.5) {
        ctx.font = `bold ${Math.max(4, 5.5*scale)}px "Segoe UI", Tahoma, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.fillText(label, 0, h/4);
      }

      ctx.restore();

      ctx.save();
      ctx.globalAlpha = Math.min(0.9, alpha * 0.8);
      ctx.translate(px, py + floatOff);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.roundRect(-w/2, -h/2, w, h, r);
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = Math.max(0.4, 1 * scale);
      ctx.stroke();
      ctx.restore();
    };

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const render = () => {
      ctx.fillStyle = '#04000d';
      ctx.fillRect(0, 0, W, H);
      const cx = W/2, cy = H/2;

      // ── STATIC STARS ────────────────────────────────────────────────────
      if (sequence === 'LIVE_TYPING' || sequence === 'COUNTDOWN') {
        for (const s of stars) {
          const p = proj(s.sx, s.sy, s.sz, cx, cy);
          if (p && p.sx>0&&p.sx<W&&p.sy>0&&p.sy<H) {
            ctx.beginPath(); ctx.arc(p.sx,p.sy,Math.max(.3,p.k*s.r*.22),0,Math.PI*2);
            ctx.fillStyle='#fff'; ctx.fill();
          }
        }
      }

      // ── TUNNEL FLIGHT (11s SPRINT TO END OF CYLINDER) ────────────────────
      if (sequence === 'TUNNEL_FLIGHT') {
        speed += (targetSpd - speed) * 0.08;

        if (pausing) {
          pauseLeft--;
          if (pauseLeft <= 0) { pausing=false; targetSpd=BASE_SPD; }
        } else {
          camZ  += speed;
          cylRot += 0.009; // Dynamic rotation
        }

        const swayX = Math.sin(camZ*.007)*6, swayY = Math.cos(camZ*.005)*4;
        const vCx = cx+swayX, vCy = cy+swayY;

        // Moving stars
        for (const s of stars) {
          const relZ = ((s.sz - camZ%1500)+1500)%1500+80;
          const p = proj(s.sx,s.sy,relZ,vCx,vCy);
          if (!p||p.sx<0||p.sx>W||p.sy<0||p.sy>H) continue;
          ctx.beginPath(); ctx.arc(p.sx,p.sy,Math.max(.25,p.k*s.r*.28),0,Math.PI*2);
          ctx.fillStyle=`rgba(255,255,255,${Math.min(1,p.k)})`; ctx.fill();
        }

        // ── Collect & sort finite cylinder items (No recycling loop!) ─────
        type VItem = {kind:'text'|'photo'|'highlight'; relZ:number; sx:number; sy:number; k:number;
                      item?: CylItem; photo?: Photo; hlIdx?: number};
        const vis: VItem[] = [];

        // Spiral Text Words
        for (const it of items) {
          const relZ = it.z - camZ;
          if (relZ<=0||relZ>1800) continue;
          const ang = it.baseAngle + cylRot;
          const curR = WALL_R * it.radiusFactor;
          const p = proj(Math.cos(ang)*curR, Math.sin(ang)*curR, relZ, vCx, vCy);
          if (!p) continue;
          if (p.sx<-W*.45||p.sx>W*1.45||p.sy<-H*.45||p.sy>H*1.45) continue;
          it.screenX=p.sx; it.screenY=p.sy;
          vis.push({kind:'text', relZ, sx:p.sx, sy:p.sy, k:p.k, item:it});
        }

        // Photos on Spiral
        for (const ph of photos) {
          const relZ = ph.z - camZ;
          if (relZ<180||relZ>1200) continue;
          const ang = ph.baseAngle + cylRot;
          const curR = WALL_R * ph.radiusFactor;
          const p = proj(Math.cos(ang)*curR, Math.sin(ang)*curR, relZ, vCx, vCy);
          if (!p) continue;
          if (p.sx<-W*.3||p.sx>W*1.3||p.sy<-H*.3||p.sy>H*1.3) continue;
          ph.screenX=p.sx; ph.screenY=p.sy;
          vis.push({kind:'photo', relZ, sx:p.sx, sy:p.sy, k:p.k, photo:ph});
        }

        // Highlights
        for (let hi=0; hi<WALL_HIGHLIGHTS.length; hi++) {
          const hl = WALL_HIGHLIGHTS[hi];
          const relZ = hl.z - camZ;
          if (relZ<=0||relZ>1800) continue;
          const ang = hl.baseAngle + cylRot;
          const p = proj(Math.cos(ang)*WALL_R, Math.sin(ang)*WALL_R, relZ, vCx, vCy);
          if (!p) continue;
          vis.push({kind:'highlight', relZ, sx:p.sx, sy:p.sy, k:p.k, hlIdx:hi});
          if (!hlDone[hi] && relZ<300 && !pausing) {
            pausing=true; pauseLeft=30; hlDone[hi]=true; targetSpd=8.0; // Quick brief highlight slow-down
          }
        }ter';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('❤️', 0, -h/6);

      if (scale > 0.5) {
        ctx.font = `bold ${Math.max(4, 5.5*scale)}px "Segoe UI", Tahoma, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.fillText(label, 0, h/4);
      }

      ctx.restore();

      ctx.save();
      ctx.globalAlpha = Math.min(0.9, alpha * 0.8);
      ctx.translate(px, py + floatOff);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.roundRect(-w/2, -h/2, w, h, r);
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = Math.max(0.4, 1 * scale);
      ctx.stroke();
      ctx.restore();
    };

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const render = () => {
      ctx.fillStyle = '#04000d';
      ctx.fillRect(0, 0, W, H);
      const cx = W/2, cy = H/2;

      // ── STATIC STARS ────────────────────────────────────────────────────
      if (sequence === 'LIVE_TYPING' || sequence === 'COUNTDOWN') {
        for (const s of stars) {
          const p = proj(s.sx, s.sy, s.sz, cx, cy);
          if (p && p.sx>0&&p.sx<W&&p.sy>0&&p.sy<H) {
            ctx.beginPath(); ctx.arc(p.sx,p.sy,Math.max(.3,p.k*s.r*.22),0,Math.PI*2);
            ctx.fillStyle='#fff'; ctx.fill();
          }
        }
      }

      // ── TUNNEL FLIGHT ────────────────────────────────────────────────────
      if (sequence === 'TUNNEL_FLIGHT') {
        speed += (targetSpd - speed) * 0.04;

        if (pausing) {
          pauseLeft--;
          if (pauseLeft <= 0) { pausing=false; targetSpd=BASE_SPD; }
        } else {
          camZ  += speed;
          cylRot += 0.0075; // Faster, hypnotic spiral rotation
        }

        const swayX = Math.sin(camZ*.007)*6, swayY = Math.cos(camZ*.005)*4;
        const vCx = cx+swayX, vCy = cy+swayY;

        // Moving stars
        for (const s of stars) {
          const relZ = ((s.sz - camZ%1500)+1500)%1500+80;
          const p = proj(s.sx,s.sy,relZ,vCx,vCy);
          if (!p||p.sx<0||p.sx>W||p.sy<0||p.sy>H) continue;
          ctx.beginPath(); ctx.arc(p.sx,p.sy,Math.max(.25,p.k*s.r*.28),0,Math.PI*2);
          ctx.fillStyle=`rgba(255,255,255,${Math.min(1,p.k)})`; ctx.fill();
        }

        // ── Collect & sort all helical spiral items ────────────────────
        type VItem = {kind:'text'|'photo'|'highlight'; relZ:number; sx:number; sy:number; k:number;
                      item?: CylItem; photo?: Photo; hlIdx?: number};
        const vis: VItem[] = [];

        // Spiral Text Words (Near, Mid, Far layers)
        for (const it of items) {
          while (it.z - camZ < -100) it.z += DEPTH_SPAN;
          const relZ = it.z - camZ;
          if (relZ<=0||relZ>1800) continue;
          const ang = it.baseAngle + cylRot;
          const curR = WALL_R * it.radiusFactor;
          const p = proj(Math.cos(ang)*curR, Math.sin(ang)*curR, relZ, vCx, vCy);
          if (!p) continue;
          if (p.sx<-W*.45||p.sx>W*1.45||p.sy<-H*.45||p.sy>H*1.45) continue;
          it.screenX=p.sx; it.screenY=p.sy;
          vis.push({kind:'text', relZ, sx:p.sx, sy:p.sy, k:p.k, item:it});
        }

        // Photos on Spiral
        for (const ph of photos) {
          while (ph.z - camZ < -100) ph.z += DEPTH_SPAN;
          const relZ = ph.z - camZ;
          if (relZ<180||relZ>1200) continue;
          const ang = ph.baseAngle + cylRot;
          const curR = WALL_R * ph.radiusFactor;
          const p = proj(Math.cos(ang)*curR, Math.sin(ang)*curR, relZ, vCx, vCy);
          if (!p) continue;
          if (p.sx<-W*.3||p.sx>W*1.3||p.sy<-H*.3||p.sy>H*1.3) continue;
          ph.screenX=p.sx; ph.screenY=p.sy;
          vis.push({kind:'photo', relZ, sx:p.sx, sy:p.sy, k:p.k, photo:ph});
        }

        // Highlights
        for (let hi=0; hi<WALL_HIGHLIGHTS.length; hi++) {
          const hl = WALL_HIGHLIGHTS[hi];
          const relZ = hl.z - camZ;
          if (relZ<=0||relZ>1800) continue;
          const ang = hl.baseAngle + cylRot;
          const p = proj(Math.cos(ang)*WALL_R, Math.sin(ang)*WALL_R, relZ, vCx, vCy);
          if (!p) continue;
          vis.push({kind:'highlight', relZ, sx:p.sx, sy:p.sy, k:p.k, hlIdx:hi});
          if (!hlDone[hi] && relZ<320 && !pausing) {
            pausing=true; pauseLeft=135; hlDone[hi]=true; targetSpd=0.5;
          }
        }

        // Sort far → near
        vis.sort((a,b)=>b.relZ-a.relZ);
        const now = performance.now() / 1000;

        for (const v of vis) {
          const fade = Math.min(1, Math.max(0.08, 1.1 - v.relZ/1600));

          if (v.kind==='text' && v.item) {
            const it = v.item;
            const fs = Math.round(it.fontSize * Math.max(.3, Math.min(3.2, FOV/v.relZ)));
            if (fs<5) continue;
            ctx.globalAlpha = fade;
            ctx.font = it.isEmoji ? `${fs}px sans-serif` : `bold ${fs}px "Segoe UI", Tahoma, sans-serif`;
            ctx.fillStyle = it.color;
            ctx.fillText(it.text, v.sx, v.sy);
          }

          if (v.kind==='photo' && v.photo) {
            const ph = v.photo;
            const floatOff = Math.sin(now*0.8 + ph.floatPhase) * 4 * v.k;
            const rot = ph.rotation + Math.sin(now*0.4 + ph.floatPhase) * 0.06;
            drawPhoto(v.sx, v.sy, v.k, rot, floatOff, ph.gradColors, ph.label, fade*1.2);
          }

          if (v.kind==='highlight' && v.hlIdx !== undefined) {
            const hl = WALL_HIGHLIGHTS[v.hlIdx];
            const fs = Math.round(26 * Math.max(.4, Math.min(3.5, FOV/v.relZ)));
            const f = Math.min(1, Math.max(.15, 1.1 - v.relZ/1300));
            if (fs<10) continue;
            ctx.globalAlpha = f*0.2;
            ctx.beginPath(); ctx.arc(v.sx,v.sy,fs*1.8,0,Math.PI*2);
            ctx.fillStyle='#ffd700'; ctx.fill();
            ctx.globalAlpha = f;
            ctx.font = `bold ${fs}px "Segoe UI", Tahoma, sans-serif`;
            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 22;
            ctx.fillText(hl.text, v.sx, v.sy);
            ctx.shadowBlur = 0;
          }
        }
        ctx.globalAlpha = 1;

        // Faint spiral guide rings
        for (const guideZ of [200, 500, 850, 1300]) {
          const k = FOV / guideZ;
          const rw = WALL_R * k;
          ctx.beginPath();
          ctx.ellipse(vCx, vCy, rw, rw, 0, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(255,182,193,${Math.max(0,.05 - guideZ/30000)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // ── HEART FINALE ─────────────────────────────────────────────────────
      if (sequence === 'HEART_FINALE') {
        finT += 0.018;

        if (!finaleInit) {
          finaleInit = true;
          const HS = 22;
          finaleItems = items.map((w,i)=>{
            const t = (i/items.length)*Math.PI*2;
            const hp = heartPoint(t, HS);
            return { text:w.text, color:w.color, fs:w.fontSize, isEmoji:w.isEmoji,
                     sx:w.screenX, sy:w.screenY, tx:cx+hp.x*5.2, ty:cy+hp.y*5.2 };
          });
        }

        // Fading stars
        const sfa = Math.max(0, 1-finT*.45);
        if (sfa>0) {
          for (const s of stars) {
            const p = proj(s.sx,s.sy,s.sz,cx,cy);
            if (p&&p.sx>0&&p.sx<W&&p.sy>0&&p.sy<H) {
              ctx.globalAlpha=sfa*.5;
              ctx.beginPath(); ctx.arc(p.sx,p.sy,Math.max(.25,p.k*s.r*.2),0,Math.PI*2);
              ctx.fillStyle='#fff'; ctx.fill();
            }
          }
          ctx.globalAlpha=1;
        }

        // Converge words to heart (ease 4s)
        const conv = Math.min(1, finT/4);
        const eased = conv<.5 ? 2*conv*conv : 1-Math.pow(-2*conv+2,2)/2;

        ctx.textAlign='center'; ctx.textBaseline='middle';
        for (const fi of finaleItems) {
          const x = fi.sx+(fi.tx-fi.sx)*eased;
          const y = fi.sy+(fi.ty-fi.sy)*eased;
          const fs = Math.max(7, Math.round(fi.fs*(.7+eased*.6)));
          ctx.globalAlpha = Math.min(1,.2+eased*.9);
          ctx.font = fi.isEmoji ? `${fs}px sans-serif` : `bold ${fs}px "Segoe UI", Tahoma, sans-serif`;
          ctx.fillStyle = fi.color;
          ctx.fillText(fi.text, x, y);
        }
        ctx.globalAlpha=1;

        if (finT>4) {
          const g = Math.min(1,(finT-4)/1.5);
          const pulse = .88+Math.sin(finT*4)*.12;

          // Heart fill glow
          ctx.globalAlpha=g*.2*pulse;
          ctx.beginPath();
          for (let i=0;i<=80;i++) {
            const t=(i/80)*Math.PI*2;
            const hp=heartPoint(t,22*5.2*pulse);
            i===0?ctx.moveTo(cx+hp.x,cy+hp.y):ctx.lineTo(cx+hp.x,cy+hp.y);
          }
          ctx.closePath(); ctx.fillStyle='#ff758f'; ctx.fill();

          // Particles from heart perimeter
          if (Math.random()<.65) {
            const t=Math.random()*Math.PI*2;
            const hp=heartPoint(t,22*5.2);
            parts.push({x:cx+hp.x,y:cy+hp.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4-.9,
              a:.92,color:['#ff758f','#ffd700','#ff4d6d','#ffb6c1','#fff'][~~(Math.random()*5)],r:Math.random()*5+2});
          }

          // "إلى الأبد" message
          ctx.globalAlpha=g;
          ctx.font=`bold ${Math.round(26+g*20)}px "Segoe UI", Tahoma, sans-serif`;
          ctx.fillStyle='#ffffff'; ctx.shadowColor='#ffd700'; ctx.shadowBlur=42;
          ctx.fillText('إلى الأبد ❤️', cx, cy);
          ctx.shadowBlur=0; ctx.globalAlpha=1;
        }

        for (let i=parts.length-1;i>=0;i--) {
          const p=parts[i];
          p.x+=p.vx; p.y+=p.vy; p.a-=.011; p.r*=.99;
          if (p.a<=0){parts.splice(i,1);continue;}
          ctx.globalAlpha=p.a;
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();
        }
        ctx.globalAlpha=1;

        if (finT>7) {
          ctx.fillStyle=`rgba(4,0,13,${Math.min(1,(finT-7)/2)})`;
          ctx.fillRect(0,0,W,H);
        }
      }

      // ── SOLAR SYSTEM ─────────────────────────────────────────────────────
      if (sequence === 'SOLAR_ORBIT') {
        orbitAng+=.01;
        ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=1;
        for (const p of PLANETS_11) {
          ctx.beginPath();ctx.ellipse(cx,cy,p.radius*1.05,p.radius*.5,0,0,Math.PI*2);ctx.stroke();
        }
        ctx.beginPath();ctx.arc(cx,cy,36,0,Math.PI*2);ctx.fillStyle='#ffd700';ctx.fill();
        PLANETS_11.forEach((p,i)=>{
          const a=orbitAng*(40/p.speed)+(i*Math.PI*2)/11;
          const px=cx+Math.cos(a)*p.radius*1.05, py=cy+Math.sin(a)*p.radius*.5;
          if(p.ring){ctx.beginPath();ctx.ellipse(px,py,p.size*.85,p.size*.25,-Math.PI/6,0,Math.PI*2);ctx.strokeStyle='rgba(255,215,0,.7)';ctx.lineWidth=2;ctx.stroke();}
          ctx.beginPath();ctx.arc(px,py,p.size/2,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    const onResize=()=>{ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
    window.addEventListener('resize',onResize);
    return ()=>{ cancelAnimationFrame(animId); window.removeEventListener('resize',onResize); };
  }, [sequence]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#04000d] select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 pointer-events-none z-10"
           style={{background:'radial-gradient(ellipse at center, transparent 38%, rgba(4,0,13,0.78) 100%)'}} />

      {sequence==='LIVE_TYPING' && (
        <div className="absolute z-30 inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div className="glass-panel-gold rounded-3xl p-6 border-2 border-cosmic-gold/70 shadow-[0_0_50px_rgba(255,215,0,0.5)] backdrop-blur-2xl space-y-3 max-w-sm text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-cosmic-gold mx-auto flex items-center justify-center shadow-[0_0_20px_#ff4d6d]">
              <Heart className="w-5 h-5 text-rose-400 fill-current animate-pulse" />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cosmic-gold via-rose-300 to-cosmic-gold min-h-[3rem] flex items-center justify-center leading-relaxed">
              "{typedQuote}"
            </h2>
          </div>
        </div>
      )}

      {sequence==='COUNTDOWN' && (
        <div className="absolute z-40 inset-0 flex flex-col items-center justify-center pointer-events-none space-y-4">
          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-cosmic-gold/40 flex items-center justify-center shadow-[0_0_60px_rgba(255,215,0,0.6)] bg-cosmic-bg/40 backdrop-blur-md">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-rose-400 animate-spin" />
            <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cosmic-gold via-amber-300 to-cosmic-gold">{countdownNum}</span>
          </div>
          <span className="text-xs font-bold text-cosmic-gold tracking-widest bg-cosmic-bg/60 px-4 py-1 rounded-full border border-cosmic-gold/40 backdrop-blur-md animate-bounce">استعد للانطلاق الكوني 🚀</span>
        </div>
      )}

      <div className="absolute top-5 left-5 right-5 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cosmic-rosegold/30 border border-cosmic-gold flex items-center justify-center">
            <Heart className="w-4 h-4 fill-current text-rose-500 animate-pulse" />
          </div>
          <span className="text-xs font-bold text-cosmic-gold">
            {sequence==='LIVE_TYPING'?'رسالة الحب ❤️':sequence==='COUNTDOWN'?`${countdownNum}..`:sequence==='TUNNEL_FLIGHT'?'نفق العشق الكوني 💖':sequence==='HEART_FINALE'?'نهاية سينمائية عاطفية 💖':'المجموعة الشمسية ☀️'}
          </span>
        </div>
        <button onClick={onStepComplete}
          className="pointer-events-auto px-3 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold text-xs text-cosmic-gold font-bold flex items-center gap-1 backdrop-blur-md hover:bg-cosmic-rosegold/40 transition">
          <FastForward className="w-3.5 h-3.5" /> تخطي
        </button>
      </div>

      {sequence==='SOLAR_ORBIT' && (
        <div className="absolute bottom-8 inset-x-0 z-40 flex justify-center pointer-events-none">
          <div className="glass-panel-gold px-7 py-3 rounded-full border-2 border-cosmic-gold shadow-2xl backdrop-blur-2xl">
            <h3 className="text-sm md:text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cosmic-gold" /> المجموعة الشمسية والـ 11 كوكب تدور حول الشمس ✨
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};
