'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Sparkles, Heart, ArrowRight, FastForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useConfig } from '@/lib/configContext';
import { bgMusic } from '@/lib/bgMusic';
import { getPlayableAudioUrl } from '@/lib/getPlayableAudioUrl';
import { remapMixamoClip } from './LuxuryTheaterStage';

interface Props {
  onNext: () => void;
}

// MODULE-LEVEL CACHE FOR WALKING ANIMATION
let cachedWalkingFbx: any | null = null;
let walkingFbxLoading = false;
const walkingFbxCallbacks: Array<(fbx: any) => void> = [];

function preloadWalkingFbx(onReady: (fbx: any) => void) {
  if (cachedWalkingFbx) {
    onReady(cachedWalkingFbx);
    return;
  }
  walkingFbxCallbacks.push(onReady);
  if (walkingFbxLoading) return;
  walkingFbxLoading = true;
  const loader = new FBXLoader();
  loader.load('/animations/Walking.fbx', (fbx) => {
    cachedWalkingFbx = fbx;
    walkingFbxLoading = false;
    const cbs = [...walkingFbxCallbacks];
    walkingFbxCallbacks.length = 0;
    cbs.forEach((cb) => cb(fbx));
  }, undefined, () => {
    walkingFbxLoading = false;
    walkingFbxCallbacks.length = 0;
  });
}

export const BossDanceStage: React.FC<Props> = ({ onNext }) => {
  const { config } = useConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const walkAudioRef = useRef<HTMLAudioElement | null>(null);
  const songAudioRef = useRef<HTMLAudioElement | null>(null);

  const [hasError, setHasError] = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true); // Keep curtains closed and show loading screen first!

  // Live Typewriter State after character disappears
  const [showLiveMessage, setShowLiveMessage] = useState(false);
  const [typedText, setTypedText] = useState('');

  const fullMessage = config.theaterWalkMessage || 'كل خطوة خطيتها في الطريق ده.. كانت عشان أوصل لقلبكِ يا روضة 🌸 أنتي مش مجرد شخص في حياتي، أنتي القصة والروح اللي اتمنيت أعيش معاها طول عمري ✨💖';
  const characterModelPath = config.selectedCharacterModel || '/models/passive_marker_man.fbx';

  useEffect(() => {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ff4d6d', '#ffd700', '#ec4899', '#ffffff']
      });
    } catch (_) {}

    // 1. Walking entrance sound (Custom theater audio if set, otherwise default WhatsApp Video clip)
    let walkAudio: HTMLAudioElement | null = null;
    if (typeof window !== 'undefined') {
      const defaultWalkSound = '/sound/WhatsApp Video 2026-08-11 at 3.56.53 AM.mp4';
      const customWalkSound = config.theaterAudioUrl ? getPlayableAudioUrl(config.theaterAudioUrl) : defaultWalkSound;
      walkAudio = new Audio(customWalkSound);
      walkAudio.volume = 1.0;
      walkAudioRef.current = walkAudio;
    }

    // 2. Romantic Song Audio that starts when typewriter message appears
    if (config.storySongUrl) {
      bgMusic.setTrack(config.storySongUrl);
    }

    // AFTER CHARACTER DISAPPEARS (AT 13.5 SECONDS): SHOW LIVE TYPEWRITER MESSAGE SCREEN & PLAY CUSTOM SONG!
    const showMessageTimer = setTimeout(() => {
      setShowLiveMessage(true);

      // Stop walk sound and start the uploaded romantic story song
      if (walkAudioRef.current) {
        walkAudioRef.current.pause();
        walkAudioRef.current.currentTime = 0;
        walkAudioRef.current.src = '';
        walkAudioRef.current = null;
      }
    }, 13500);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return () => clearTimeout(showMessageTimer);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL Error:', e);
      setHasError(true);
      setCurtainsOpen(true);
      return () => clearTimeout(showMessageTimer);
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x120310, 0.08);

    // CAMERA POSITIONED TO SHOW FULL HEAD AND BODY WITHOUT ANY CLIPPING
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.25, 3.8);
    camera.lookAt(0, 0.95, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffe4e6, 0);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffd700, 0);
    spotLight.position.set(0, 6, 3);
    spotLight.angle = Math.PI / 3;
    spotLight.penumbra = 0.8;
    scene.add(spotLight);

    const pinkSpot = new THREE.SpotLight(0xf472b6, 0);
    pinkSpot.position.set(-2.5, 4, 2);
    scene.add(pinkSpot);

    // FBX Loader
    const fbxLoader = new FBXLoader();
    let mixer: THREE.AnimationMixer | null = null;
    let bossModelRef: THREE.Object3D | null = null;
    let startTime: number | null = null;

    // 3.5s Safety fallback timer: if 3D model takes too long, hide spinner & open curtains gracefully
    // 20s Safety fallback: if 3D model takes too long, skip 3D stage and go directly to typewriter message!
    const safetyTimer = setTimeout(() => {
      if (walkAudioRef.current) {
        walkAudioRef.current.pause();
        walkAudioRef.current.src = '';
      }
      setIsLoadingModel(false);
      setShowLiveMessage(true);
    }, 20000);

    // DYNAMICALLY LOAD THE CHOSEN 3D CHARACTER MODEL
    fbxLoader.load(
      characterModelPath,
      (bossModel) => {
        const box = new THREE.Box3().setFromObject(bossModel);
        const size = box.getSize(new THREE.Vector3());
        if (size.y > 0) {
          const targetHeight = 1.95; // Perfect 1.95m height
          bossModel.scale.setScalar(targetHeight / size.y);
        } else {
          bossModel.scale.setScalar(0.0125);
        }

        bossModel.position.set(0, 0, -8.5);
        bossModel.visible = true;
        scene.add(bossModel);
        bossModelRef = bossModel;

        // Open floral curtains & hide loading spinner instantly!
        clearTimeout(safetyTimer);
        setIsLoadingModel(false);
        setCurtainsOpen(true);

        if (startTime === null && clock) {
          startTime = clock.getElapsedTime();
        }

        if (walkAudio) {
          walkAudio.play().catch(() => {
            const handleFirstTouch = () => {
              if (walkAudioRef.current) {
                walkAudioRef.current.play().catch(() => {});
              }
              window.removeEventListener('click', handleFirstTouch);
              window.removeEventListener('touchstart', handleFirstTouch);
            };
            window.addEventListener('click', handleFirstTouch);
            window.addEventListener('touchstart', handleFirstTouch);
          });
        }

        preloadWalkingFbx((animFbx) => {
          try {
            if (animFbx.animations && animFbx.animations.length > 0) {
              const rawClip = animFbx.animations[0];
              const remappedClip = remapMixamoClip(rawClip, bossModel);
              
              // Strip Z forward root displacement from keyframes to avoid loop snapping glitches!
              remappedClip.tracks = remappedClip.tracks.map((track) => {
                if (track.name.toLowerCase().includes('.position')) {
                  const cloned = track.clone();
                  for (let i = 2; i < cloned.values.length; i += 3) {
                    cloned.values[i] = 0; // Zero Z so Three.js lerp moves the character smoothly
                  }
                  return cloned;
                }
                return track;
              });

              mixer = new THREE.AnimationMixer(bossModel);
              const action = mixer.clipAction(remappedClip);
              action.setEffectiveTimeScale(1.0);
              action.setEffectiveWeight(1.0);
              action.play();
            } else if (bossModel.animations && bossModel.animations.length > 0) {
              mixer = new THREE.AnimationMixer(bossModel);
              mixer.clipAction(bossModel.animations[0]).play();
            }
          } catch (err) {
            console.warn('Animation Remap Exception:', err);
          }
        });
      },
      undefined,
      (err) => {
        console.warn('Model Load Error:', err);
        clearTimeout(safetyTimer);
        setIsLoadingModel(false);
        setHasError(true);
      }
    );

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Render Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      if (bossModelRef && bossModelRef.visible) {
        if (startTime === null) {
          startTime = clock.getElapsedTime();
        }
        const elapsed = clock.getElapsedTime() - startTime;

        if (elapsed < 1.5) {
          // Entrance from dark distance
          const progress = elapsed / 1.5;
          ambientLight.intensity = progress * 0.8;
          spotLight.intensity = progress * 2.5;
          pinkSpot.intensity = progress * 1.5;
          bossModelRef.rotation.y = 0;
          bossModelRef.position.z = THREE.MathUtils.lerp(-8.0, -5.0, progress);
        } else if (elapsed < 7.5) {
          // Main entrance walk towards the camera
          const lightFade = Math.min((elapsed - 1.5) / 1.0, 1.0);
          ambientLight.intensity = 1.6 * lightFade;
          spotLight.intensity = 4.8 * lightFade;
          pinkSpot.intensity = 3.2 * lightFade;
          bossModelRef.rotation.y = 0;

          const progress = (elapsed - 1.5) / 6.0;
          bossModelRef.position.z = THREE.MathUtils.lerp(-5.0, -0.5, progress);
        } else if (elapsed < 8.8) {
          // Smooth 180-degree turnaround
          const rotProgress = (elapsed - 7.5) / 1.3;
          const smoothRot = 0.5 - 0.5 * Math.cos(rotProgress * Math.PI);
          bossModelRef.rotation.y = smoothRot * Math.PI;
          bossModelRef.position.z = -0.5;
        } else {
          // Walk back into the distance and smoothly fade out
          const exitElapsed = elapsed - 8.8;
          const exitProgress = Math.min(exitElapsed / 4.2, 1.0);
          const lightFade = Math.max(1.0 - exitProgress, 0);

          ambientLight.intensity = 1.6 * lightFade;
          spotLight.intensity = 4.8 * lightFade;
          pinkSpot.intensity = 3.2 * lightFade;
          bossModelRef.rotation.y = Math.PI;
          bossModelRef.position.z = THREE.MathUtils.lerp(-0.5, -8.5, exitProgress);
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      clearTimeout(showMessageTimer);
      clearTimeout(safetyTimer);
      if (walkAudioRef.current) {
        walkAudioRef.current.pause();
        walkAudioRef.current.currentTime = 0;
        walkAudioRef.current.src = '';
        walkAudioRef.current = null;
      }
      renderer.dispose();
    };
  }, [config.theaterWalkMessage, characterModelPath, config.storySongUrl]);

  // TYPEWRITER EFFECT FOR LIVE MESSAGE WHEN CHARACTER DISAPPEARS
  useEffect(() => {
    if (!showLiveMessage) return;

    let index = 0;
    const timer = setInterval(() => {
      setTypedText(fullMessage.slice(0, index));
      index++;
      if (index > fullMessage.length) {
        clearInterval(timer);
      }
    }, 45);

    return () => clearInterval(timer);
  }, [showLiveMessage, fullMessage]);

  const handleNextClick = () => {
    if (walkAudioRef.current) {
      walkAudioRef.current.pause();
    }
    // Keep romantic song playing or handle smoothly across steps
    onNext();
  };

  const handleSkip = () => {
    if (walkAudioRef.current) {
      walkAudioRef.current.pause();
      walkAudioRef.current.currentTime = 0;
      walkAudioRef.current.src = '';
      walkAudioRef.current = null;
    }

    if (!showLiveMessage) {
      setShowLiveMessage(true);
    } else {
      onNext();
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#1c0617] via-[#10030e] to-[#090108] text-white flex flex-col justify-center items-center p-0 select-none overflow-x-hidden text-center">
      
      {/* FLOATING SKIP STAGE BUTTON */}
      {!showLiveMessage && (
        <button
          onClick={handleSkip}
          className="fixed top-5 left-5 z-50 px-4 py-2 rounded-full bg-black/75 border border-pink-400/50 text-amber-300 font-extrabold text-xs backdrop-blur-md hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,114,182,0.4)] flex items-center gap-1.5 cursor-pointer"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <FastForward className="w-4 h-4 text-pink-400" />
          <span>تخطي المسرح ⏭️</span>
        </button>
      )}

      {/* FLORAL ROSE CURTAINS (ستارة الزهور والورود الملكية بأشكال متنوعة) */}
      <div
        style={{
          transform: curtainsOpen ? 'translateX(-105%)' : 'translateX(0%)',
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="fixed inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#2e051c] via-[#1a0212] to-black border-r-2 border-pink-400/80 z-50 pointer-events-none will-change-transform flex flex-col justify-between p-4 overflow-hidden shadow-[10px_0_40px_rgba(0,0,0,0.9)]"
      >
        {/* Background Floral Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#f472b6_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        
        {/* Floating Petals Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,114,182,0.25)_0%,_transparent_70%)] pointer-events-none" />

        {/* Top Left Floral Bouquet */}
        <div className="relative z-10 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-3xl sm:text-4xl filter drop-shadow-[0_0_12px_#f472b6] animate-pulse">
            <span>🌹</span>
            <span>🌸</span>
            <span>🌺</span>
          </div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-pink-400 to-transparent" />
        </div>

        {/* Center Floral Vine Column */}
        <div className="relative z-10 my-auto flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-pink-500/30 to-rose-900/40 border-2 border-pink-400/60 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(244,114,182,0.5)] animate-bounce">
            💐
          </div>
          <div className="flex items-center gap-3 text-2xl sm:text-3xl opacity-90">
            <span>🌷</span>
            <span>🌻</span>
            <span>🏵️</span>
            <span>🌼</span>
          </div>
        </div>

        {/* Bottom Left Floral Border */}
        <div className="relative z-10 flex flex-col items-start gap-1">
          <div className="h-[1px] w-32 bg-gradient-to-r from-pink-400 to-transparent" />
          <div className="flex items-center gap-2 text-3xl sm:text-4xl filter drop-shadow-[0_0_12px_#f472b6]">
            <span>🥀</span>
            <span>🌸</span>
            <span>🌹</span>
          </div>
        </div>
      </div>

      <div
        style={{
          transform: curtainsOpen ? 'translateX(105%)' : 'translateX(0%)',
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="fixed inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#2e051c] via-[#1a0212] to-black border-l-2 border-pink-400/80 z-50 pointer-events-none will-change-transform flex flex-col justify-between p-4 overflow-hidden shadow-[-10px_0_40px_rgba(0,0,0,0.9)]"
      >
        {/* Background Floral Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#f472b6_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        
        {/* Floating Petals Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,114,182,0.25)_0%,_transparent_70%)] pointer-events-none" />

        {/* Top Right Floral Bouquet */}
        <div className="relative z-10 flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-3xl sm:text-4xl filter drop-shadow-[0_0_12px_#f472b6] animate-pulse">
            <span>🌺</span>
            <span>🌸</span>
            <span>🌹</span>
          </div>
          <div className="h-[1px] w-32 bg-gradient-to-l from-pink-400 to-transparent" />
        </div>

        {/* Center Floral Vine Column */}
        <div className="relative z-10 my-auto flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-pink-500/30 to-rose-900/40 border-2 border-pink-400/60 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_30px_rgba(244,114,182,0.5)] animate-bounce">
            🌹
          </div>
          <div className="flex items-center gap-3 text-2xl sm:text-3xl opacity-90">
            <span>🌼</span>
            <span>🏵️</span>
            <span>🌻</span>
            <span>🌷</span>
          </div>
        </div>

        {/* Bottom Right Floral Border */}
        <div className="relative z-10 flex flex-col items-end gap-1">
          <div className="h-[1px] w-32 bg-gradient-to-l from-pink-400 to-transparent" />
          <div className="flex items-center gap-2 text-3xl sm:text-4xl filter drop-shadow-[0_0_12px_#f472b6]">
            <span>🌹</span>
            <span>🌸</span>
            <span>🥀</span>
          </div>
        </div>
      </div>

      {/* CENTER FLORAL SEAL EMBLEM (Splits open gracefully) */}
      {!curtainsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-pulse">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-pink-500 via-rose-600 to-amber-400 border-2 border-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_40px_rgba(244,114,182,0.9)]">
            🌹
          </div>
        </div>
      )}

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.2)_0%,_transparent_75%)] pointer-events-none" />

      {/* FULL SCREEN 3D CANVAS CONTAINER */}
      <div ref={containerRef} className="relative z-20 w-full h-[100dvh] flex items-center justify-center overflow-hidden">

        {hasError ? (
          <div className="w-full h-full p-6 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-300 shadow-[0_0_30px_#f472b6] animate-pulse">
              <img src="/images/the_boss.jpg" alt="The Boss" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-black text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
                Prince Walk Show 🕺✨
              </h3>
              <p className="text-xs text-pink-200/80 font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                عرض ملوكي لأجلكِ!
              </p>
            </div>
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full" />
        )}

        {/* LOADING SPINNER OVERLAY */}
        {isLoadingModel && !showLiveMessage && !hasError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#10030e]/85 backdrop-blur-md text-center p-4">
            <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#f472b6] mb-2" />
            <p className="text-xs sm:text-sm font-bold text-amber-200 animate-pulse" style={{ fontFamily: "'Cairo', sans-serif" }}>
              جاري تجهيز العرض الملكي 🎭✨
            </p>
            <button
              onClick={handleSkip}
              className="mt-4 px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs sm:text-sm border border-white/30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(244,114,182,0.6)] cursor-pointer"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              تخطي الانتظار ودخول العرض فوراً ⚡💖
            </button>
          </div>
        )}

        {/* LIVE TYPEWRITER MESSAGE OVERLAY SCREEN */}
        {showLiveMessage && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 sm:p-10 animate-fade-in text-center">
            <div className="max-w-xl w-full flex flex-col items-center gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-rose-950/40 via-purple-950/30 to-black/60 border border-pink-400/30 shadow-[0_0_50px_rgba(244,114,182,0.4)] relative overflow-hidden">
              
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-pink-400/50 flex items-center justify-center shadow-[0_0_20px_#f472b6] animate-pulse">
                <Heart className="w-7 h-7 text-pink-400 fill-pink-400" />
              </div>

              {/* LIVE TYPED ROMANTIC MESSAGE FROM CONFIG */}
              <p className="text-base sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 leading-relaxed min-h-[120px]" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {typedText}
                <span className="inline-block w-2 h-5 bg-pink-400 ml-1 animate-pulse" />
              </p>

              {/* CUSTOM BUTTON FROM CONFIG */}
              <button
                onClick={handleNextClick}
                className="w-full sm:w-auto mt-4 py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-xs sm:text-sm border border-white/40 hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(244,114,182,0.7)] flex items-center justify-center gap-3 group"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <span>{config.theaterButtonText || 'كلمة حلوة.. تعالي نخش جوه قصة حياتنا 💖✨'}</span>
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
