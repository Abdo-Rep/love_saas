'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Volume2, VolumeX, Heart, Check, RefreshCw } from 'lucide-react';
import { ANIMATION_LIST, AnimationItem } from '@/components/3d/CharacterCanvas';

interface Props {
  onFinish?: () => void;
}

// ── ROBUST HUMANOID BONE REMAPPING UTILITY ──
export const remapMixamoClip = (clip: THREE.AnimationClip, model: THREE.Object3D): THREE.AnimationClip => {
  const modelBones: { name: string; clean: string }[] = [];

  const simplify = (str: string) => {
    return str
      .toLowerCase()
      .replace(/^.*[:|/]/, '')
      .replace(/^(mixamorig|character\d+|bip\d*|armature|root)[_:]?/i, '')
      .replace(/[^a-z0-9]/g, '');
  };

  model.traverse((child) => {
    if (child.name) {
      modelBones.push({
        name: child.name,
        clean: simplify(child.name)
      });
    }
  });

  const newTracks: THREE.KeyframeTrack[] = [];

  clip.tracks.forEach((track) => {
    const parts = track.name.split('.');
    const rawBone = parts[0];
    const property = parts.slice(1).join('.');
    const cleanTrackBone = simplify(rawBone);

    const matched = modelBones.find(
      (b) => b.clean === cleanTrackBone || (cleanTrackBone && b.clean.endsWith(cleanTrackBone)) || (b.clean && cleanTrackBone.endsWith(b.clean))
    );

    if (matched) {
      const cloned = track.clone();
      cloned.name = `${matched.name}.${property}`;
      newTracks.push(cloned);
    } else {
      const directMatch = modelBones.find((b) => b.name === rawBone);
      if (directMatch) {
        newTracks.push(track.clone());
      }
    }
  });

  if (newTracks.length === 0) {
    return clip.clone();
  }

  return new THREE.AnimationClip(clip.name, clip.duration, newTracks);
};

export const LuxuryTheaterStage: React.FC<Props> = ({ onFinish }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedAnimation, setSelectedAnimation] = useState<AnimationItem>(
    ANIMATION_LIST.find((a) => a.id === 'salsa') || ANIMATION_LIST[0]
  );
  const [loadMsg, setLoadMsg] = useState('جاري تحميل شخصيات المسرح الملكي...');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicCleanupRef = useRef<(() => void) | null>(null);
  const isMutedRef = useRef(false);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const stageGroupRef = useRef<THREE.Group | null>(null);
  const boyRef = useRef<THREE.Object3D | null>(null);
  const girlRef = useRef<THREE.Object3D | null>(null);
  const mixersRef = useRef<THREE.AnimationMixer[]>([]);
  const animFrameRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  // ── ROMANTIC LOVE R&B BEAT (95 BPM) ──
  const startMusic = () => {
    try {
      if (musicCleanupRef.current) { musicCleanupRef.current(); musicCleanupRef.current = null; }
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume();
      audioCtxRef.current = ctx;

      const master = ctx.createGain(); master.gain.value = 0.45;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4;
      master.connect(comp); comp.connect(ctx.destination);

      const BPM = 95, beat = 60 / BPM, stepDur = beat / 4;
      const chords = [[261.63, 329.63, 392, 523.25], [220, 261.63, 329.63, 440], [174.61, 220, 261.63, 349.23], [196, 246.94, 293.66, 392]];
      const bass = [65.41, 55, 43.65, 49];
      const mel = [523.25, 587.33, 659.25, 698.46, 783.99, 698.46, 659.25, 587.33, 523.25, 493.88, 523.25, 587.33, 659.25, 523.25, 493.88, 440];
      let t = 0, ci = 0, mi = 0, ct = 0;

      const step = () => {
        if (!ctx || isMutedRef.current || ctx.state === 'suspended') return;
        const now = ctx.currentTime;

        if (t % 4 === 0) {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(240, now);
          o.frequency.exponentialRampToValueAtTime(55, now + 0.12);
          g.gain.setValueAtTime(1, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          o.connect(g); g.connect(master); o.start(now); o.stop(now + 0.14);
        }

        if (t % 8 === 4) {
          [240, 420].forEach((f, i) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'triangle'; o.frequency.value = f;
            g.gain.setValueAtTime(i ? 0.25 : 0.4, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            o.connect(g); g.connect(master); o.start(now); o.stop(now + 0.09);
          });
        }

        {
          const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
          o.type = 'square'; o.frequency.value = 9500;
          f.type = 'highpass'; f.frequency.value = 6000;
          const v = t % 4 === 0 ? 0.07 : t % 2 === 0 ? 0.045 : 0.02;
          g.gain.setValueAtTime(v, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
          o.connect(f); f.connect(g); g.connect(master); o.start(now); o.stop(now + 0.025);
        }

        if (t % 4 === 0 || t % 8 === 6) {
          const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
          o.type = 'sine'; o.frequency.value = bass[ci];
          f.type = 'lowpass'; f.frequency.value = 300;
          g.gain.setValueAtTime(t % 4 === 0 ? 0.6 : 0.3, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + stepDur * 3.5);
          o.connect(f); f.connect(g); g.connect(master); o.start(now); o.stop(now + stepDur * 3.5);
        }

        if (t % 4 === 0) {
          chords[ci].forEach((fr) => {
            const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
            o.type = 'triangle'; o.frequency.value = fr;
            f.type = 'lowpass'; f.frequency.value = 1400;
            g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.07, now + 0.04);
            g.gain.exponentialRampToValueAtTime(0.001, now + beat * 0.9);
            o.connect(f); f.connect(g); g.connect(master); o.start(now); o.stop(now + beat * 0.9);
          });
          ct++; if (ct % 4 === 0) ci = (ci + 1) % chords.length;
        }

        if (t % 8 === 0) {
          const fr = mel[mi % mel.length];
          const o = ctx.createOscillator(), g = ctx.createGain(), vb = ctx.createOscillator(), vbG = ctx.createGain(), f = ctx.createBiquadFilter();
          o.type = 'triangle'; o.frequency.value = fr;
          vb.frequency.value = 5.5; vbG.gain.value = 4;
          vb.connect(vbG); vbG.connect(o.frequency);
          f.type = 'lowpass'; f.frequency.value = 3000;
          g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.13, now + 0.06);
          g.gain.setValueAtTime(0.12, now + beat * 1.4); g.gain.linearRampToValueAtTime(0, now + beat * 2);
          o.connect(f); f.connect(g); g.connect(master);
          vb.start(now); o.start(now); vb.stop(now + beat * 2); o.stop(now + beat * 2);
          mi++;
        }

        if (t % 8 === 2 || t % 8 === 6) {
          [1200, 2400, 3600].forEach((fr) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = fr;
            g.gain.setValueAtTime(0.018, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            o.connect(g); g.connect(master); o.start(now); o.stop(now + 0.04);
          });
        }

        t = (t + 1) % 16;
      };

      step();
      const id = setInterval(step, stepDur * 1000);
      musicCleanupRef.current = () => { clearInterval(id); ctx.close().catch(() => {}); };
      setIsPlayingMusic(true);
    } catch (e) {
      console.warn('Music error', e);
    }
  };

  const toggleMusic = () => {
    if (!audioCtxRef.current) { startMusic(); return; }
    if (audioCtxRef.current.state === 'suspended') { audioCtxRef.current.resume(); setIsPlayingMusic(true); return; }
    isMutedRef.current = !isMutedRef.current;
    setIsPlayingMusic(!isMutedRef.current);
  };

  // ── APPLY ANIMATION CLIP TO BOTH CHARACTERS ──
  const applyAnimToModels = (clip: THREE.AnimationClip) => {
    const boy = boyRef.current;
    const girl = girlRef.current;
    if (!boy || !girl) return;

    mixersRef.current.forEach((m) => m.stopAllAction());
    mixersRef.current = [];

    [boy, girl].forEach((model) => {
      const remapped = remapMixamoClip(clip, model);
      if (remapped.tracks.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(remapped);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
        mixersRef.current.push(mixer);
      }
    });
  };

  // ── MOUNT & INITIALIZE STAGE ──
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040208);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 6.5);
    camera.lookAt(0, 0.9, 0);

    // Compatible WebGLRenderer initialization
    const createRenderer = (): THREE.WebGLRenderer | null => {
      try {
        const r = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
        });
        r.setSize(width, height);
        r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        r.shadowMap.enabled = true;
        r.shadowMap.type = THREE.PCFSoftShadowMap;
        r.toneMapping = THREE.ACESFilmicToneMapping;
        r.toneMappingExposure = 1.1;
        return r;
      } catch (e1) {
        try {
          const r = new THREE.WebGLRenderer({ canvas, antialias: false, failIfMajorPerformanceCaveat: false });
          r.setSize(width, height);
          return r;
        } catch (e2) {
          return null;
        }
      }
    };

    const activeRenderer = createRenderer();
    if (activeRenderer) {
      rendererRef.current = activeRenderer;
    } else {
      // Fallback stage triggered
      setHasWebGLError(true);
      setIsLoading(false);
      startMusic();
    }

    // 3. Stage Platform & Spotlights
    const stageGroup = new THREE.Group();
    stageGroupRef.current = stageGroup;
    scene.add(stageGroup);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(7, 64),
      new THREE.MeshStandardMaterial({ color: 0x08050f, roughness: 0.8, metalness: 0.3 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    stageGroup.add(floor);

    // Spotlights Floor Glow Rings
    [-0.85, 0.85].forEach((x, i) => {
      const ring = new THREE.Mesh(
        new THREE.CircleGeometry(1.4, 32),
        new THREE.MeshBasicMaterial({
          color: i === 0 ? 0xffd880 : 0xf43f5e,
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending,
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(x, 0.001, 0);
      stageGroup.add(ring);
    });

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    scene.add(new THREE.HemisphereLight(0xfff0f5, 0x200830, 1.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(0, 4, 5);
    scene.add(keyLight);

    const spotL = new THREE.SpotLight(0xffe0a0, 8, 12, 0.5, 0.6);
    spotL.position.set(-2, 7, 2);
    spotL.target.position.set(-0.85, 0, 0);
    scene.add(spotL);
    scene.add(spotL.target);

    const spotR = new THREE.SpotLight(0xff5577, 8, 12, 0.5, 0.6);
    spotR.position.set(2, 7, 2);
    spotR.target.position.set(0.85, 0, 0);
    scene.add(spotR);
    scene.add(spotR.target);

    // 4. Drag Controls (360° Stage Rotation)
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !stageGroupRef.current) return;
      stageGroupRef.current.rotation.y += (e.clientX - prevMouseRef.current.x) * 0.007;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDraggingRef.current = false;
    };
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 5. Render Loop with WebGL Context Retry Recovery
    const clock = new THREE.Clock();
    const tick = () => {
      animFrameRef.current = requestAnimationFrame(tick);

      // Auto-retry renderer creation if Chrome WebGL freed context slots
      if (!rendererRef.current && !hasWebGLError) {
        const retry = createRenderer();
        if (retry) {
          rendererRef.current = retry;
        }
      }

      const delta = clock.getDelta();

      // Update animation mixers frame by frame
      mixersRef.current.forEach((m) => m.update(delta));

      // Ambient camera movement
      if (!isDraggingRef.current) {
        camera.position.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.25;
      }
      camera.lookAt(0, 0.9, 0);

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
    };
    tick();

    // 6. Window Resize Listener
    const onResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 7. Load FBX Character Models & Animation Clip
    const loader = new FBXLoader();
    const charGroup = new THREE.Group();
    stageGroup.add(charGroup);

    const setupModel = (model: THREE.Object3D, posX: number, rotY: number) => {
      model.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          const m = c as THREE.Mesh;
          m.castShadow = true;
          m.receiveShadow = true;
          if (m.material) {
            const fix = (mat: THREE.Material) => { mat.side = THREE.DoubleSide; };
            Array.isArray(m.material) ? m.material.forEach(fix) : fix(m.material);
          }
        }
      });
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = size.y > 0 ? 2.0 / size.y : 1;
      model.scale.setScalar(scale);
      model.position.set(posX - center.x * scale, -box.min.y * scale, -center.z * scale);
      model.rotation.y = rotY;
      charGroup.add(model);
    };

    setLoadMsg('جاري تحميل شخصية The Boss.fbx...');

    loader.load(
      '/models/The Boss.fbx',
      (boy) => {
        setupModel(boy, -0.85, 0.3);
        boyRef.current = boy;

        setLoadMsg('جاري تحميل شخصية Peasant Girl.fbx...');
        loader.load(
          '/models/Peasant Girl.fbx',
          (girl) => {
            setupModel(girl, 0.85, -0.3);
            girlRef.current = girl;

            const animFile = selectedAnimation.id === 'proposal' ? 'Salsa Dancing.fbx' : selectedAnimation.file;
            setLoadMsg(`جاري تحميل رقصة ${selectedAnimation.name}...`);

            loader.load(
              `/animations/${animFile}`,
              (animFbx) => {
                if (animFbx.animations && animFbx.animations.length > 0) {
                  applyAnimToModels(animFbx.animations[0]);
                }
                setIsLoading(false);
                startMusic();
              },
              undefined,
              () => { setIsLoading(false); startMusic(); }
            );
          },
          undefined,
          () => { setIsLoading(false); startMusic(); }
        );
      },
      undefined,
      () => { setIsLoading(false); startMusic(); }
    );

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (musicCleanupRef.current) { musicCleanupRef.current(); musicCleanupRef.current = null; }
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      mixersRef.current = [];
      boyRef.current = null;
      girlRef.current = null;

      if (rendererRef.current) {
        try {
          const gl = rendererRef.current.getContext();
          const ext = gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        } catch (_) {}
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, []);

  // ── UPDATE DANCE WHEN USER CHOOSES FROM SELECTOR BAR ──
  useEffect(() => {
    if (!boyRef.current || !girlRef.current) return;
    const animFile = selectedAnimation.id === 'proposal' ? 'Salsa Dancing.fbx' : selectedAnimation.file;
    setLoadMsg(`جاري تغيير الرقصة إلى ${selectedAnimation.name}...`);
    setIsLoading(true);

    const loader = new FBXLoader();
    loader.load(
      `/animations/${animFile}`,
      (animFbx) => {
        if (animFbx.animations && animFbx.animations.length > 0) {
          applyAnimToModels(animFbx.animations[0]);
        }
        setIsLoading(false);
      },
      undefined,
      () => setIsLoading(false)
    );
  }, [selectedAnimation]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#040208] select-none touch-none">
      
      {/* 1. 3D WebGL Canvas (Only rendered when WebGL is supported/available) */}
      {!hasWebGLError && (
        <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full block" />
      )}

      {/* 2. HIGH-AESTHETIC HYBRID 2D STAGE FALLBACK IF WEBGL IS FULLY BLOCKED */}
      {hasWebGLError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          {/* Spotlight Beams */}
          <div className="absolute top-0 left-1/4 w-52 h-full bg-gradient-to-b from-amber-500/25 via-amber-500/5 to-transparent blur-2xl transform -rotate-12" />
          <div className="absolute top-0 right-1/4 w-52 h-full bg-gradient-to-b from-rose-500/25 via-rose-500/5 to-transparent blur-2xl transform rotate-12" />

          {/* Stage Pedestal */}
          <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center">
            {/* Glowing Spotlight Stage Pedestal */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 h-32 rounded-[100%] bg-gradient-to-r from-rose-600/35 via-amber-500/25 to-purple-600/35 blur-md border border-rose-500/40 animate-pulse shadow-[0_0_55px_rgba(244,63,94,0.45)]" />

            {/* DANCING CHARACTERS CONTAINER */}
            <div className="relative z-30 flex items-center justify-around w-full px-6 gap-8">
              
              {/* THE BOSS (🕴️) */}
              <div className="flex flex-col items-center animate-[bounce_1.4s_infinite_ease-in-out]">
                <div className="relative w-36 h-48 md:w-44 md:h-60 rounded-3xl overflow-hidden border-2 border-amber-500/60 shadow-[0_15px_40px_rgba(245,158,11,0.35)] bg-black/60 backdrop-blur-sm">
                  {/* Actual Character image loaded dynamically */}
                  <img
                    src="/images/the_boss.jpg"
                    alt="The Boss"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 text-center">
                    <span className="text-sm font-extrabold text-amber-300 tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>The Boss</span>
                    <span className="block text-[10px] text-amber-200/70 font-semibold">حركة هيب هوب 🕺</span>
                  </div>
                </div>
                <div className="w-28 h-4 rounded-full bg-black/70 blur-sm mt-3" />
              </div>

              {/* PEASANT GIRL (💃) */}
              <div className="flex flex-col items-center animate-[bounce_1.4s_infinite_ease-in-out] [animation-delay:0.2s]">
                <div className="relative w-36 h-48 md:w-44 md:h-60 rounded-3xl overflow-hidden border-2 border-rose-500/60 shadow-[0_15px_40px_rgba(244,63,94,0.35)] bg-black/60 backdrop-blur-sm">
                  {/* Actual Character image loaded dynamically */}
                  <img
                    src="/images/peasant_girl.jpg"
                    alt="Peasant Girl"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 text-center">
                    <span className="text-sm font-extrabold text-rose-300 tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>Peasant Girl</span>
                    <span className="block text-[10px] text-rose-200/70 font-semibold">حركة سالسا 💃</span>
                  </div>
                </div>
                <div className="w-28 h-4 rounded-full bg-black/70 blur-sm mt-3" />
              </div>

            </div>
          </div>

          {/* Quick instructions in Arabic */}
          <div className="relative z-40 mt-3 text-center max-w-xs px-4">
            <p className="text-amber-200/80 text-xs font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
              💡 إذا أردت استعراض الـ 3D التفاعلي، يرجى إغلاق علامات التبويب غير المستخدمة وإعادة المحاولة.
            </p>
          </div>
        </div>
      )}

      {/* Radial Glow Vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(4,2,8,0.85)_100%)]" />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-rose-500/30 border-t-rose-400 animate-spin" />
          <p className="text-rose-300 font-bold text-base animate-pulse" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {loadMsg} 💃🕺
          </p>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
        <div className="px-4 py-2 rounded-full bg-black/65 border border-rose-500/50 backdrop-blur-md flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-500 animate-pulse" />
          <span className="text-xs md:text-sm font-bold text-rose-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
            مسرح الحب الملوكي (The Boss & Peasant Girl) 💖
          </span>
        </div>
        <button
          onClick={toggleMusic}
          className="p-2.5 rounded-full bg-black/65 border border-rose-500/50 text-rose-300 backdrop-blur-md hover:bg-rose-500/20 transition-all active:scale-95 z-40"
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/40" />}
        </button>
      </div>

      {/* BOTTOM DANCE SELECTOR BUTTONS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-2xl px-3 py-2.5 rounded-full bg-black/85 backdrop-blur-xl border border-rose-500/40 flex items-center justify-center gap-1.5 overflow-x-auto shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <span className="text-xs text-rose-300 font-bold pr-1 hidden md:inline shrink-0" style={{ fontFamily: "'Cairo', sans-serif" }}>
          💃 اختر الرقصة:
        </span>
        {ANIMATION_LIST.filter((a) => a.id !== 'proposal').map((anim) => {
          const active = anim.id === selectedAnimation.id;
          return (
            <button
              key={anim.id}
              onClick={() => setSelectedAnimation(anim)}
              className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-1 active:scale-95 shrink-0 ${
                active
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-[0_0_18px_rgba(244,63,94,0.75)] border border-rose-300'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white'
              }`}
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {active && <Check className="w-3 h-3 shrink-0" />}
              {anim.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
