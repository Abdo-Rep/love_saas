'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Sparkles } from 'lucide-react';
import { remapMixamoClip } from './LuxuryTheaterStage';

interface Props {
  onNext: () => void;
}

export const RoyalCoupleGreeting: React.FC<Props> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadMsg, setLoadMsg] = useState('جاري تحميل مسرح الشخصيات ثلاثية الأبعاد...');
  const [is2DFallback, setIs2DFallback] = useState(false);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const boyRef = useRef<THREE.Object3D | null>(null);
  const girlRef = useRef<THREE.Object3D | null>(null);
  const mixersRef = useRef<THREE.AnimationMixer[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06030a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 4.2);
    camera.lookAt(0, 0.85, 0);

    // 2. Reliable Three.js WebGLRenderer Creation (Appended dynamically to container)
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e1) {
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      } catch (e2) {
        console.warn('WebGL initialization failed in Chrome:', e2);
      }
    }

    if (renderer) {
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      renderer.domElement.className = 'absolute inset-0 z-0 w-full h-full block pointer-events-none';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } else {
      console.warn('Switching gracefully to 2D Stage Mode.');
      setIs2DFallback(true);
      setIsLoading(false);
      return;
    }

    // 3. Stage Pedestal Floor & Glowing Base
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.8, 0.2, 48),
      new THREE.MeshStandardMaterial({
        color: 0x140d28,
        roughness: 0.4,
        metalness: 0.7,
        emissive: 0x0a0418,
      })
    );
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    stageGroup.add(floor);

    // Glowing Pedestal Ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(2.45, 2.55, 64),
      new THREE.MeshBasicMaterial({ color: 0xff3366, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    stageGroup.add(ring);

    // Spotlight floor glow discs under characters
    [-0.7, 0.7].forEach((x, i) => {
      const glowDisc = new THREE.Mesh(
        new THREE.CircleGeometry(1.0, 32),
        new THREE.MeshBasicMaterial({
          color: i === 0 ? 0xffd700 : 0xff4d6d,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
        })
      );
      glowDisc.rotation.x = -Math.PI / 2;
      glowDisc.position.set(x, 0.002, 0);
      stageGroup.add(glowDisc);
    });

    // 4. Bright Cinematic Romantic Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    scene.add(new THREE.HemisphereLight(0xffe8f0, 0x1a0a2a, 1.3));

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(0, 5, 4);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const leftSpot = new THREE.SpotLight(0xffd700, 10, 12, 0.5, 0.5);
    leftSpot.position.set(-2, 6, 2);
    leftSpot.target.position.set(-0.7, 0.8, 0);
    scene.add(leftSpot);
    scene.add(leftSpot.target);

    const rightSpot = new THREE.SpotLight(0xff4d6d, 10, 12, 0.5, 0.5);
    rightSpot.position.set(2, 6, 2);
    rightSpot.target.position.set(0.7, 0.8, 0);
    scene.add(rightSpot);
    scene.add(rightSpot.target);

    // 5. Render Loop with gentle camera sway
    const clock = new THREE.Clock();
    const tick = () => {
      animFrameRef.current = requestAnimationFrame(tick);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      mixersRef.current.forEach((m) => m.update(delta));

      camera.position.x = Math.sin(time * 0.35) * 0.22;
      camera.lookAt(0, 0.85, 0);

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
    };
    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Precise Character Setup Function (Exact Bounding Box Formula from CharacterCanvas)
    const setupAndPlaceCharacter = (fbx: THREE.Object3D, posX: number, rotY: number) => {
      fbx.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => { m.side = THREE.DoubleSide; });
            } else {
              mesh.material.side = THREE.DoubleSide;
            }
          }
        }
      });

      const renderBbox = new THREE.Box3();
      let meshesFound = false;
      fbx.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.name.toLowerCase().includes('shadow') || mesh.name.toLowerCase().includes('helper')) return;
          if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
          if (mesh.geometry.boundingBox) {
            renderBbox.union(mesh.geometry.boundingBox);
            meshesFound = true;
          }
        }
      });

      if (!meshesFound) {
        renderBbox.setFromObject(fbx);
      }

      const size = renderBbox.getSize(new THREE.Vector3());
      const center = renderBbox.getCenter(new THREE.Vector3());
      const targetHeight = 1.95;
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? targetHeight / maxDim : 1;

      fbx.scale.set(scale, scale, scale);

      const pivot = new THREE.Group();
      pivot.position.set(posX, 0, 0);
      pivot.rotation.y = rotY;

      fbx.position.set(-center.x * scale, -renderBbox.min.y * scale, -center.z * scale);
      pivot.add(fbx);
      stageGroup.add(pivot);

      return fbx;
    };

    // 7. Load Models and Salsa Dance Animation
    const loader = new FBXLoader();

    setLoadMsg('جاري تحميل شخصية The Boss.fbx...');
    loader.load('/models/The Boss.fbx', (theBoss) => {
      const bossModel = setupAndPlaceCharacter(theBoss, -0.68, 0.35);
      boyRef.current = bossModel;

      setLoadMsg('جاري تحميل شخصية Peasant Girl.fbx...');
      loader.load('/models/Peasant Girl.fbx', (peasantGirl) => {
        const girlModel = setupAndPlaceCharacter(peasantGirl, 0.68, -0.35);
        girlRef.current = girlModel;

        setLoadMsg('جاري تطبيق رقصة السالسا الثنائية...');
        loader.load('/animations/Salsa Dancing.fbx', (anim) => {
          if (anim.animations && anim.animations.length > 0) {
            const clip = anim.animations[0];
            [bossModel, girlModel].forEach((model) => {
              const remapped = remapMixamoClip(clip, model);
              if (remapped.tracks.length > 0) {
                const mixer = new THREE.AnimationMixer(model);
                const action = mixer.clipAction(remapped);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.timeScale = 1;
                action.play();
                mixersRef.current.push(mixer);
              }
            });
          }
          setIsLoading(false);
        }, undefined, () => setIsLoading(false));
      }, undefined, () => setIsLoading(false));
    }, undefined, () => setIsLoading(false));

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      mixersRef.current = [];
      boyRef.current = null;
      girlRef.current = null;
      if (rendererRef.current) {
        try {
          const domElem = rendererRef.current.domElement;
          if (domElem && domElem.parentNode) {
            domElem.parentNode.removeChild(domElem);
          }
          rendererRef.current.dispose();
        } catch (_) {}
        rendererRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#06030a] flex flex-col justify-between select-none touch-none">
      
      {/* 2D ANIMATED THEATER STAGE (Guaranteed ZERO-black-screen view if Chrome WebGL hardware is disabled) */}
      {is2DFallback && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
          {/* Sweeping Spotlight Beams */}
          <div className="absolute top-0 left-1/4 w-60 h-full bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent blur-3xl transform -rotate-12 pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-60 h-full bg-gradient-to-b from-rose-500/20 via-rose-500/5 to-transparent blur-3xl transform rotate-12 pointer-events-none" />

          {/* Stage Pedestal */}
          <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center">
            {/* Glowing Base Platform */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 h-36 rounded-[100%] bg-gradient-to-r from-rose-600/35 via-amber-500/25 to-purple-600/35 blur-md border border-rose-500/40 shadow-[0_0_65px_rgba(244,63,94,0.45)]" />

            {/* CHARACTERS DANCING ON STAGE */}
            <div className="relative z-30 flex items-center justify-center gap-6 md:gap-12 w-full">
              
              {/* THE BOSS */}
              <div className="flex flex-col items-center animate-[bounce_1.5s_infinite_ease-in-out]">
                <div className="relative w-36 h-48 md:w-44 md:h-56 rounded-3xl overflow-hidden border-2 border-amber-500/70 shadow-[0_15px_40px_rgba(245,158,11,0.4)] bg-black/60 backdrop-blur-md">
                  <img src="/images/the_boss.jpg" alt="The Boss" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent p-2.5 text-center">
                    <span className="text-sm font-extrabold text-amber-300 tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>The Boss 🎩</span>
                  </div>
                </div>
                <div className="w-28 h-3 rounded-full bg-amber-500/30 blur-sm mt-3" />
              </div>

              {/* PEASANT GIRL */}
              <div className="flex flex-col items-center animate-[bounce_1.5s_infinite_ease-in-out] [animation-delay:0.25s]">
                <div className="relative w-36 h-48 md:w-44 md:h-56 rounded-3xl overflow-hidden border-2 border-rose-500/70 shadow-[0_15px_40px_rgba(244,63,94,0.4)] bg-black/60 backdrop-blur-md">
                  <img src="/images/peasant_girl.jpg" alt="Peasant Girl" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent p-2.5 text-center">
                    <span className="text-sm font-extrabold text-rose-300 tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>Peasant Girl 💃</span>
                  </div>
                </div>
                <div className="w-28 h-3 rounded-full bg-rose-500/30 blur-sm mt-3" />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Decorative Vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(6,3,10,0.85)_100%)]" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-40 bg-[#06030a]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-rose-500/30 border-t-rose-400 animate-spin" />
          <p className="text-rose-300 font-bold text-sm animate-pulse" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {loadMsg} ✨
          </p>
        </div>
      )}

      {/* TOP TEXT CONTENT */}
      <div className="relative z-20 text-center px-4 pt-10 md:pt-14 max-w-xl mx-auto flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-pink-500/30 backdrop-blur-md self-center">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span className="text-[11px] md:text-xs font-bold text-pink-300 tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
            الملتقى الملكي الفاخر 👑
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 drop-shadow-sm leading-snug" style={{ fontFamily: "'Cairo', sans-serif" }}>
          The Boss &amp; Peasant Girl
        </h1>
        <p className="text-white/70 text-xs md:text-sm leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
          لقاء يجمع الهيبة والجمال في لوحة فنية كونية، ترحيباً بكِ في رحلة الحب والذكريات...
        </p>
      </div>

      {/* BOTTOM BUTTON CONTAINER */}
      <div className="relative z-20 px-6 pb-10 md:pb-14 max-w-sm mx-auto w-full text-center">
        <button
          onClick={onNext}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white text-base font-extrabold border-2 border-pink-400/50 hover:from-pink-500 hover:to-amber-400 transition-all active:scale-95 shadow-[0_0_30px_rgba(236,72,153,0.5)] flex items-center justify-center gap-3 group"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span>استكشف ذكرياتنا الكونية 📸</span>
        </button>
      </div>
    </div>
  );
};
