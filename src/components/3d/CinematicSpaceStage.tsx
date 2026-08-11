'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { FastForward, Sparkles, Heart } from 'lucide-react';

interface Props {
  onComplete: () => void;
  defaultCharacterFile?: string;
}

export interface StageAnimationItem {
  id: string;
  name: string;
  file: string;
}

export const STAGE_ANIMATIONS: StageAnimationItem[] = [
  { id: 'thriller', name: 'Thriller Dance 🕺', file: 'Thriller Part 3.fbx' },
  { id: 'hiphop', name: 'Hip Hop Dance 🎧', file: 'Hip Hop Dancing.fbx' },
  { id: 'northern_soul', name: 'Northern Soul Spin 🌀', file: 'Northern Soul Spin.fbx' },
  { id: 'salsa', name: 'Salsa Dance 💃', file: 'Salsa Dancing.fbx' },
];

export const CinematicSpaceStage: React.FC<Props> = ({
  onComplete,
  defaultCharacterFile = 'Ty.fbx',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedAnim, setSelectedAnim] = useState<StageAnimationItem>(STAGE_ANIMATIONS[0]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const currentFbxRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const stageGroupRef = useRef<THREE.Group | null>(null);
  const char1GroupRef = useRef<THREE.Group | null>(null);
  const char2GroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    scene.fog = new THREE.FogExp2(0x0a0a1a, 0.015);
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 6.0);
    camera.lookAt(0, 1.2, 0);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. STARFIELD BACKGROUND
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 120;

      const colorType = Math.random();
      if (colorType > 0.7) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.84; starColors[i * 3 + 2] = 0.0;
      } else if (colorType > 0.4) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.46; starColors[i * 3 + 2] = 0.56;
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;
      }
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 5. STAGE GROUP
    const stageGroup = new THREE.Group();
    stageGroupRef.current = stageGroup;
    scene.add(stageGroup);

    // Circular Stage Base
    const stageRadius = 3.2;
    const stageGeo = new THREE.CylinderGeometry(stageRadius, stageRadius + 0.3, 0.4, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x0f0b24,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x1a0f3c,
      emissiveIntensity: 0.4,
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.y = -0.2;
    stageMesh.receiveShadow = true;
    stageGroup.add(stageMesh);

    // Stage Glowing Rings
    const outerRingGeo = new THREE.RingGeometry(stageRadius - 0.08, stageRadius + 0.12, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.01;
    stageGroup.add(outerRing);

    const innerRingGeo = new THREE.RingGeometry(1.6, 1.68, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xff758f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.02;
    stageGroup.add(innerRing);

    // 6. CHARACTER PLACEMENT GROUPS
    const char1Group = new THREE.Group();
    char1Group.position.set(0, 0, 0);
    char1GroupRef.current = char1Group;
    stageGroup.add(char1Group);

    const char2Group = new THREE.Group();
    char2Group.position.set(1.2, 0, 0);
    char2Group.visible = false;
    char2GroupRef.current = char2Group;
    stageGroup.add(char2Group);

    // 7. LIGHTING SETUP
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xffffff, 3.5);
    keySpot.position.set(2, 7, 5);
    keySpot.angle = Math.PI / 5;
    keySpot.penumbra = 0.6;
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    keySpot.target.position.set(0, 1.2, 0);
    scene.add(keySpot);
    scene.add(keySpot.target);

    const rimSpot = new THREE.SpotLight(0xff758f, 2.5);
    rimSpot.position.set(-3, 6, -4);
    rimSpot.angle = Math.PI / 4;
    rimSpot.penumbra = 0.7;
    rimSpot.target.position.set(0, 1.2, 0);
    scene.add(rimSpot);
    scene.add(rimSpot.target);

    const goldFill = new THREE.PointLight(0xffd700, 2.0, 10);
    goldFill.position.set(0, 0.4, 2.5);
    scene.add(goldFill);

    // 8. ANIMATION LOOP & SMOOTH CAMERA MOVEMENT
    const clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update Skeletal animations
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Live Concert Beat Spotlight Flashes
      const flashRhythm = Math.sin(time * 8.0);
      if (flashRhythm > 0.6) {
        keySpot.color.setHex(0xff758f);
        goldFill.color.setHex(0x38bdf8);
      } else if (flashRhythm < -0.6) {
        keySpot.color.setHex(0xffd700);
        goldFill.color.setHex(0xff758f);
      } else {
        keySpot.color.setHex(0xffffff);
        goldFill.color.setHex(0xffd700);
      }

      // Stars rotation
      starField.rotation.y = time * 0.02;

      // Smooth Orbiting Camera
      const cameraRadius = 5.8;
      const cameraSpeed = 0.3;
      camera.position.x = Math.sin(time * cameraSpeed) * cameraRadius;
      camera.position.z = Math.cos(time * cameraSpeed) * cameraRadius;
      camera.position.y = 1.8 + Math.sin(time * 0.5) * 0.3;
      camera.lookAt(0, 1.25, 0);

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Effect to load character FBX and apply selected FBX animation clip from public/animations
  useEffect(() => {
    if (!char1GroupRef.current) return;

    setLoading(true);
    setProgress(0);

    // Clear previous model & mixer
    if (currentFbxRef.current) {
      char1GroupRef.current.remove(currentFbxRef.current);
      currentFbxRef.current = null;
    }
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }

    const loader = new FBXLoader();
    const charPath = `/models/${defaultCharacterFile}`;

    loader.load(
      charPath,
      (fbx) => {
        fbx.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => { mat.side = THREE.DoubleSide; });
              } else {
                mesh.material.side = THREE.DoubleSide;
              }
            }
          }
        });

        // Auto-scale & center character facing camera
        const bbox = new THREE.Box3().setFromObject(fbx);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());

        const targetHeight = 2.5;
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? targetHeight / maxDim : 1;

        fbx.scale.set(scale, scale, scale);
        fbx.position.x = -center.x * scale;
        fbx.position.y = -bbox.min.y * scale;
        fbx.position.z = -center.z * scale;
        fbx.rotation.set(0, 0, 0);

        char1GroupRef.current?.add(fbx);
        currentFbxRef.current = fbx;

        // Load & Play selected animation FBX from public/animations
        const animPath = `/animations/${selectedAnim.file}`;
        loader.load(
          animPath,
          (animFbx) => {
            if (animFbx.animations && animFbx.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(fbx);
              const action = mixer.clipAction(animFbx.animations[0]);
              action.play();
              mixerRef.current = mixer;
            }
            setLoading(false);
          },
          undefined,
          (err) => {
            console.warn('Animation FBX fallback to embedded clip:', err);
            if (fbx.animations && fbx.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(fbx);
              const action = mixer.clipAction(fbx.animations[0]);
              action.play();
              mixerRef.current = mixer;
            }
            setLoading(false);
          }
        );
      },
      (xhr) => {
        if (xhr.total > 0) {
          setProgress(Math.round((xhr.loaded / xhr.total) * 100));
        } else {
          setProgress((prev) => Math.min(prev + 10, 90));
        }
      },
      (error) => {
        console.error('Error loading stage character FBX:', charPath, error);
        setLoading(false);
      }
    );
  }, [defaultCharacterFile, selectedAnim]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a1a] select-none">
      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(10,10,26,0.85)_100%)] pointer-events-none z-10" />

      {/* Top Controls & Skip Button */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cosmic-rosegold/30 border border-cosmic-gold flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.4)]">
            <Heart className="w-4 h-4 fill-current text-rose-500 animate-pulse" />
          </div>
          <span className="text-xs font-extrabold text-cosmic-gold bg-cosmic-bg/60 px-3 py-1 rounded-full border border-cosmic-gold/40 backdrop-blur-md">
            مسرح الشخصية الفضائية 🌌
          </span>
        </div>

        <button
          onClick={onComplete}
          className="pointer-events-auto px-4 py-1.5 rounded-full bg-cosmic-rosegold/20 border border-cosmic-gold text-xs text-cosmic-gold font-extrabold flex items-center gap-1.5 backdrop-blur-md hover:bg-cosmic-rosegold/40 transition-all shadow-lg active:scale-95"
        >
          <span>متابعة إلى القلب</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#0a0a1a]/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-40 transition-opacity">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-cosmic-gold/20 border-t-cosmic-gold animate-spin" />
            <span className="text-xs font-bold text-cosmic-gold">{progress}%</span>
          </div>
          <span className="text-xs font-semibold text-white/90 animate-pulse">
            جاري تجهيز المسرح الفضائي والشخصية...
          </span>
        </div>
      )}

      {/* Bottom Cinematic Banner & Live Animation Selector */}
      {!loading && (
        <div className="absolute bottom-6 inset-x-0 z-30 flex flex-col items-center space-y-3 px-4">
          {/* Live Dance Animation Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 pointer-events-auto custom-scrollbar">
            {STAGE_ANIMATIONS.map((anim) => {
              const isSelected = selectedAnim.id === anim.id;
              return (
                <button
                  key={anim.id}
                  onClick={() => setSelectedAnim(anim)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all backdrop-blur-md border whitespace-nowrap ${
                    isSelected
                      ? 'bg-cosmic-gold/30 border-cosmic-gold text-cosmic-gold shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105'
                      : 'bg-black/50 border-white/20 text-white/80 hover:border-cosmic-gold/50 hover:text-white'
                  }`}
                >
                  {anim.name}
                </button>
              );
            })}
          </div>

          <div className="glass-panel-gold px-6 py-2 rounded-full border border-cosmic-gold/60 shadow-[0_0_30px_rgba(255,215,0,0.3)] backdrop-blur-xl animate-fade-in pointer-events-none">
            <p className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cosmic-gold animate-pulse" />
              الرقصة الحالية: {selectedAnim.name} ✨
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
