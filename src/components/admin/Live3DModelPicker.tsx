'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useConfig, availableCharacterModels } from '@/lib/configContext';
import { Eye, RotateCw, Check, Sparkles, UserCheck } from 'lucide-react';

export const Live3DModelPicker: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const idx = availableCharacterModels.findIndex(
      (m) => m.file === config.selectedCharacterModel
    );
    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, [config.selectedCharacterModel]);

  const selectedModel = availableCharacterModels[activeIndex] || availableCharacterModels[0];

  const handleSelectModel = (idx: number) => {
    setActiveIndex(idx);
    const chosen = availableCharacterModels[idx];
    if (chosen) {
      updateConfig({ selectedCharacterModel: chosen.file });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;
    setIsLoadingModel(true);
    setLoadError(false);

    let w = container.clientWidth || 250;
    let h = container.clientHeight || 200;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });
      rendererRef.current = renderer;
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      setLoadError(true);
      setIsLoadingModel(false);
      return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
    camera.lookAt(0, 0.9, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffd700, 3.0);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const pinkLight = new THREE.DirectionalLight(0xf472b6, 2.5);
    pinkLight.position.set(-2, 2, -2);
    scene.add(pinkLight);

    let controls: OrbitControls | null = null;
    try {
      controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0;
      controls.target.set(0, 0.9, 0);
    } catch (_) {}

    let loadedModel: THREE.Object3D | null = null;
    const loader = new FBXLoader();

    loader.load(
      selectedModel.file,
      (fbx) => {
        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        if (size.y > 0) {
          const targetHeight = 1.8;
          fbx.scale.setScalar(targetHeight / size.y);
        } else {
          fbx.scale.setScalar(0.012);
        }

        const newBox = new THREE.Box3().setFromObject(fbx);
        const center = newBox.getCenter(new THREE.Vector3());
        fbx.position.x = -center.x;
        fbx.position.y = -newBox.min.y;
        fbx.position.z = -center.z;

        scene.add(fbx);
        loadedModel = fbx;
        setIsLoadingModel(false);
      },
      undefined,
      (err) => {
        console.warn('Live preview load error:', err);
        setLoadError(true);
        setIsLoadingModel(false);
      }
    );

    const clock = new THREE.Clock();
    const animate = () => {
      if (controls) controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      w = container.clientWidth || 250;
      h = container.clientHeight || 200;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (controls) controls.dispose();
      renderer.dispose();
    };
  }, [selectedModel]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-5 w-full select-none bg-black/40 p-4 sm:p-5 rounded-3xl border border-pink-500/30">
      
      {/* 3D LIVE PREVIEW BOX */}
      <div className="w-full md:w-64 shrink-0 flex flex-col items-center gap-2">
        <div className="flex items-center justify-between w-full text-xs font-bold text-amber-300">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-pink-400" />
            <span>معاينة الـ 3D التفاعلية:</span>
          </span>
          <span className="font-mono text-xs text-pink-200/80">{activeIndex + 1} من {availableCharacterModels.length}</span>
        </div>

        <div ref={containerRef} className="relative w-full h-56 sm:h-60 rounded-2xl bg-gradient-to-b from-[#2a041c] to-[#0a010b] border border-pink-400/40 shadow-[0_0_25px_rgba(244,114,182,0.2)] flex items-center justify-center overflow-hidden">
          {isLoadingModel && (
            <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-black/60 backdrop-blur-sm">
              <RotateCw className="w-5 h-5 text-amber-300 animate-spin" />
              <span className="text-xs text-pink-200 font-bold">جاري تحميل الشخصية...</span>
            </div>
          )}

          {loadError ? (
            <div className="flex flex-col items-center gap-1 text-center p-2">
              <span className="text-4xl">{selectedModel.icon}</span>
              <span className="text-xs text-pink-200 font-bold">{selectedModel.name}</span>
            </div>
          ) : (
            <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          )}

          <div className="absolute bottom-2.5 inset-x-2.5 z-10 px-3 py-1.5 rounded-xl bg-black/85 border border-pink-400/30 backdrop-blur-md flex items-center justify-between text-xs font-bold">
            <span className="text-amber-200 truncate">{selectedModel.icon} {selectedModel.name}</span>
            <span className="text-[10px] text-pink-300 font-mono dir-ltr">{selectedModel.file.split('/').pop()}</span>
          </div>
        </div>
      </div>

      {/* 4 DISTINCT CHARACTER CARDS (2 BOYS + 2 GIRLS) */}
      <div className="flex-1 w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-pink-200 flex items-center gap-1.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>الشخصيات الـ 4 المتاحة (2 أولاد + 2 بنات):</span>
          </span>
          <span className="text-[11px] font-bold text-amber-300/80">انقر لاختيار الشخصية فوراً</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {availableCharacterModels.map((model, idx) => {
            const isSelected = activeIndex === idx;

            return (
              <div
                key={model.id}
                onClick={() => handleSelectModel(idx)}
                className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 backdrop-blur-md ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-900 via-pink-800 to-amber-900 border-rose-400 shadow-[0_0_20px_#f472b6] font-extrabold text-white scale-[1.03]'
                    : 'bg-black/50 border-pink-400/20 text-pink-200 hover:bg-white/10 hover:border-pink-300/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-2xl shrink-0">{model.icon}</span>
                  <div className="flex flex-col truncate text-right">
                    <span className="truncate text-xs font-black text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      {model.name}
                    </span>
                    <span className="text-[10px] text-pink-200/70 truncate">
                      {model.description}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 border border-white shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
