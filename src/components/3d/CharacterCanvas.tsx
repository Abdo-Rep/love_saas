'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export interface CharacterItem {
  id: string;
  name: string;
  file: string;
  category?: string;
}

export const CHARACTER_LIST: CharacterItem[] = [
  { id: 'ch02', name: 'Character 02', file: 'Ch02_nonPBR.fbx' },
  { id: 'ch03', name: 'Character 03', file: 'Ch03_nonPBR.fbx' },
  { id: 'ch06', name: 'Character 06', file: 'Ch06_nonPBR.fbx' },
  { id: 'ch09', name: 'Character 09', file: 'Ch09_nonPBR.fbx' },
  { id: 'ch13', name: 'Character 13', file: 'Ch13_nonPBR.fbx' },
  { id: 'ch16', name: 'Character 16', file: 'Ch16_nonPBR.fbx' },
  { id: 'ch19', name: 'Character 19', file: 'Ch19_nonPBR.fbx' },
  { id: 'ch31', name: 'Character 31', file: 'Ch31_nonPBR.fbx' },
  { id: 'ch46', name: 'Character 46', file: 'Ch46_nonPBR.fbx' },
  { id: 'peasant_girl', name: 'Peasant Girl', file: 'Peasant Girl.fbx' },
  { id: 'the_boss', name: 'The Boss', file: 'The Boss.fbx' },
  { id: 'ty', name: 'Ty', file: 'Ty.fbx' },
  { id: 'claire', name: 'Claire', file: 'claire.fbx' },
  { id: 'marker_man', name: 'Marker Man', file: 'passive_marker_man.fbx' },
];

export interface AnimationItem {
  id: string;
  name: string;
  file: string;
}

export const ANIMATION_LIST: AnimationItem[] = [
  { id: 'thriller', name: 'Thriller Dance 🕺', file: 'Thriller Part 3.fbx' },
  { id: 'hiphop', name: 'Hip Hop Dance 🎧', file: 'Hip Hop Dancing.fbx' },
  { id: 'northern_soul', name: 'Northern Soul Spin 🌀', file: 'Northern Soul Spin.fbx' },
  { id: 'salsa', name: 'Salsa Dance 💃', file: 'Salsa Dancing.fbx' },
  { id: 'proposal', name: 'MJ Rose Proposal 🌹', file: 'proposal' },
];

export const createRoseMesh = () => {
  const group = new THREE.Group();
  group.name = 'proposal_rose';
  
  // Stem
  const stemGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.35, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = 0.175;
  group.add(stem);
  
  // Flower head / Petals
  const budGeo = new THREE.ConeGeometry(0.04, 0.09, 16);
  const budMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.6 });
  const bud = new THREE.Mesh(budGeo, budMat);
  bud.position.y = 0.22;
  group.add(bud);

  // Outer petal sphere
  const petalGeo = new THREE.SphereGeometry(0.03, 8, 8);
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c });
  const petal1 = new THREE.Mesh(petalGeo, petalMat);
  petal1.position.set(0.015, 0.21, 0);
  group.add(petal1);

  const petal2 = new THREE.Mesh(petalGeo, petalMat);
  petal2.position.set(-0.015, 0.21, 0);
  group.add(petal2);
  
  group.rotation.x = Math.PI / 2;
  return group;
};

export const createProposalAnimationClip = (character: THREE.Object3D, isBoss: boolean = false) => {
  const boneMap: { [key: string]: string } = {};
  character.traverse((child) => {
    const name = child.name;
    const cleanName = name.replace(/^mixamorig\d*[:_]?/i, '').toLowerCase();
    boneMap[cleanName] = name;
  });

  const getBoneName = (cleanName: string) => boneMap[cleanName] || cleanName;

  const times = [0, 2.5, 4.5, 7.5, 10.0, 14.0];
  const tracks: THREE.KeyframeTrack[] = [];

  const addQuatTrack = (cleanBone: string, eulers: [number, number, number][]) => {
    const bone = getBoneName(cleanBone);
    const quatValues: number[] = [];
    eulers.forEach((e) => {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(e[0], e[1], e[2]));
      quatValues.push(q.x, q.y, q.z, q.w);
    });
    tracks.push(new THREE.QuaternionKeyframeTrack(`${bone}.quaternion`, times, quatValues));
  };

  const hipsBone = getBoneName('hips');
  const hipsPos = [
    0, 0, 0,
    0, -0.08, -0.03,
    0, 0, 0,
    0, -1.05, -0.22,
    0, -1.05, -0.22,
    0, -1.05, -0.22
  ];
  tracks.push(new THREE.VectorKeyframeTrack(`${hipsBone}.position`, times, hipsPos));

  addQuatTrack('spine', [
    [0, 0, 0],
    [0.1, 0, 0],
    [0, 0, 0],
    [0.26, 0, 0],
    [0.26, 0, 0],
    [0.26, 0, 0]
  ]);

  addQuatTrack('leftupleg', [
    [0, 0, 0],
    [0.1, 0, 0],
    [0, 0, 0],
    [0.9, 0, 0],
    [0.9, 0, 0],
    [0.9, 0, 0]
  ]);

  addQuatTrack('leftleg', [
    [0, 0, 0],
    [-0.2, 0, 0],
    [0, 0, 0],
    [-1.6, 0, 0],
    [-1.6, 0, 0],
    [-1.6, 0, 0]
  ]);

  addQuatTrack('rightupleg', [
    [0, 0, 0],
    [0.1, 0, 0],
    [0, 0, 0],
    [-0.9, 0, 0],
    [-0.9, 0, 0],
    [-0.9, 0, 0]
  ]);

  addQuatTrack('rightleg', [
    [0, 0, 0],
    [-0.2, 0, 0],
    [0, 0, 0],
    [1.3, 0, 0],
    [1.3, 0, 0],
    [1.3, 0, 0]
  ]);

  // Adjust arm angles outwards if the character is the boss to prevent chest penetration
  addQuatTrack('rightarm', isBoss ? [
    [0, 0, 0],
    [-0.8, 0.45, -1.55], // Touching hat, pushed outward and forward
    [-0.2, 0.75, 1.05],  // Inside jacket, pushed outward and forward
    [-1.4, -0.2, 0.0],   // Offering rose, slightly wider
    [-1.4, -0.2, 0.0],
    [-1.4, -0.2, 0.0]
  ] : [
    [0, 0, 0],
    [-0.8, 0, -1.1],
    [-0.2, 0.4, 0.4],
    [-1.4, -0.4, 0],
    [-1.4, -0.4, 0],
    [-1.4, -0.4, 0]
  ]);

  addQuatTrack('rightforearm', [
    [0, 0, 0],
    [0, 1.4, 0],
    [0, 0.8, 0],
    [0, 0.1, 0],
    [0, 0.1, 0],
    [0, 0.1, 0]
  ]);

  addQuatTrack('leftarm', isBoss ? [
    [0, 0, 0],
    [0.2, 0.3, 1.6],     // Standing, left arm pushed wider
    [0, 0, 0],
    [-0.4, -0.25, -1.2], // Hand on chest, kept further outward
    [-0.4, -0.25, -1.2],
    [-0.4, -0.25, -1.2]
  ] : [
    [0, 0, 0],
    [0.2, 0.3, 1.2],
    [0, 0, 0],
    [-0.4, -0.6, -0.8],
    [-0.4, -0.6, -0.8],
    [-0.4, -0.6, -0.8]
  ]);

  addQuatTrack('head', [
    [0, 0, 0],
    [0.4, 0, 0],
    [0, 0, 0],
    [-0.3, 0, 0],
    [-0.3, 0, 0],
    [-0.3, 0, 0]
  ]);

  return new THREE.AnimationClip('proposal', 14.0, tracks);
};

const getCleanBoneName = (rawName: string): string => {
  const parts = rawName.split(/[:|/]/);
  const lastPart = parts[parts.length - 1] || rawName;
  return lastPart.replace(/^mixamorig\d*[:_]?/i, '').toLowerCase();
};

export const remapMixamoClip = (clip: THREE.AnimationClip, character: THREE.Object3D) => {
  const boneMap: { [key: string]: string } = {};

  character.traverse((child) => {
    if (child.name) {
      const clean = getCleanBoneName(child.name);
      boneMap[clean] = child.name;
    }
  });

  const newTracks: THREE.KeyframeTrack[] = [];

  clip.tracks.forEach((track) => {
    const parts = track.name.split('.');
    const rawBoneName = parts[0];
    const propertyName = parts.slice(1).join('.');
    const cleanTrackBoneName = getCleanBoneName(rawBoneName);

    if (boneMap[cleanTrackBoneName]) {
      const actualBoneName = boneMap[cleanTrackBoneName];
      const clonedTrack = track.clone();
      clonedTrack.name = `${actualBoneName}.${propertyName}`;
      newTracks.push(clonedTrack);
    }
  });

  return new THREE.AnimationClip(clip.name, clip.duration, newTracks);
};

interface Props {
  selectedCharacter: CharacterItem;
  selectedAnimation?: AnimationItem;
  autoRotate?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export const CharacterCanvas: React.FC<Props> = ({
  selectedCharacter,
  selectedAnimation = ANIMATION_LIST[0],
  autoRotate = true,
  onLoadingChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // References to keep state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const currentModelRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const pivotRef = useRef<THREE.Group | null>(null);

  // Orbit drag controls state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Initialize Three.js Scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 5.0);

    // Renderer - wrapped in try/catch to prevent Next.js unhandled runtime error overlay
    // when Chrome has exhausted its WebGL context limit (usually 8-16 contexts)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e1) {
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      } catch (e2) {
        try {
          renderer = new THREE.WebGLRenderer();
        } catch (e3) {
          console.warn('CharacterCanvas: WebGL unavailable, skipping 3D render.', e3);
          return;
        }
      }
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Pivot group to hold and rotate character in place
    const pivot = new THREE.Group();
    pivotRef.current = pivot;
    scene.add(pivot);

    // Platform / Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.2, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x120e2e,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x221144,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.1;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Glowing Pedestal Ring
    const ringGeo = new THREE.RingGeometry(1.75, 1.85, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(3, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xff758f, 1.2);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd700, 1.8);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Mouse / Touch Drag to Rotate Character
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !pivotRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      pivotRef.current.rotation.y += deltaX * 0.01;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !pivotRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      pivotRef.current.rotation.y += deltaX * 0.01;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Animation Loop
    const clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      const delta = clock.getDelta();

      // Update FBX Skeletal Animations if mixer exists
      if (mixerRef.current) {
        mixerRef.current.update(delta);
        
        // Prevent body clipping for wide characters (like 'the_boss')
        if (selectedCharacter.id === 'the_boss' && currentModelRef.current) {
          const rightArm = currentModelRef.current.getObjectByName('mixamorigRightArm') || 
                           currentModelRef.current.getObjectByName('RightArm');
          if (rightArm) rightArm.rotation.z -= 0.38;

          const leftArm = currentModelRef.current.getObjectByName('mixamorigLeftArm') || 
                          currentModelRef.current.getObjectByName('LeftArm');
          if (leftArm) leftArm.rotation.z += 0.38;

          const rightShoulder = currentModelRef.current.getObjectByName('mixamorigRightShoulder') || 
                                 currentModelRef.current.getObjectByName('RightShoulder');
          if (rightShoulder) rightShoulder.rotation.y -= 0.15;

          const leftShoulder = currentModelRef.current.getObjectByName('mixamorigLeftShoulder') || 
                                currentModelRef.current.getObjectByName('LeftShoulder');
          if (leftShoulder) leftShoulder.rotation.y += 0.15;
        }
        
        // Update Rose Scale based on proposal animation playback time
        if (selectedAnimation.id === 'proposal' && currentModelRef.current) {
          const rose = currentModelRef.current.getObjectByName('proposal_rose');
          if (rose) {
            const clip = currentModelRef.current.animations && currentModelRef.current.animations[0];
            if (clip) {
              const action = mixerRef.current.clipAction(clip);
              const time = action.time % 14.0;
              if (time >= 4.5 && time < 13.0) {
                rose.scale.setScalar(Math.min(1.0, (time - 4.5) / 0.5));
              } else if (time >= 13.0) {
                rose.scale.setScalar(Math.max(0.0, 1.0 - (time - 13.0) / 0.5));
              } else {
                rose.scale.set(0, 0, 0);
              }
            }
          }
        }
      }

      // Auto-rotation when not dragging
      if (autoRotate && pivotRef.current && !isDraggingRef.current) {
        pivotRef.current.rotation.y += delta * 0.4;
      }

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 340;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      // Force lose WebGL context to free Chrome's context slot immediately
      try {
        const gl = renderer.getContext();
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      } catch (_) {}
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  // Load selected FBX character & selected FBX animation
  useEffect(() => {
    if (!pivotRef.current) return;

    setLoading(true);
    setProgress(0);
    if (onLoadingChange) onLoadingChange(true);

    // Remove previous model safely
    if (currentModelRef.current) {
      pivotRef.current.remove(currentModelRef.current);
      currentModelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
      currentModelRef.current = null;
    }

    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }

    const loader = new FBXLoader();
    const filePath = `/models/${selectedCharacter.file}`;

    loader.load(
      filePath,
      (characterFbx) => {
        // Enable shadows and fix materials
        characterFbx.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => {
                  mat.side = THREE.DoubleSide;
                });
              } else {
                mesh.material.side = THREE.DoubleSide;
              }
            }
          }
        });

        // Calculate rendering bounding box ignoring bones or helper points
        const renderBbox = new THREE.Box3();
        let meshesFound = false;
        characterFbx.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.name.toLowerCase().includes('shadow') || mesh.name.toLowerCase().includes('helper')) return;
            if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
            renderBbox.union(mesh.geometry.boundingBox);
            meshesFound = true;
          }
        });

        if (!meshesFound) {
          renderBbox.setFromObject(characterFbx);
        }

        const size = renderBbox.getSize(new THREE.Vector3());
        const center = renderBbox.getCenter(new THREE.Vector3());
        const targetHeight = 2.4;
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? targetHeight / maxDim : 1;

        characterFbx.scale.set(scale, scale, scale);
        characterFbx.position.x = -center.x * scale;
        characterFbx.position.y = -renderBbox.min.y * scale;
        characterFbx.position.z = -center.z * scale;

        pivotRef.current?.add(characterFbx);
        currentModelRef.current = characterFbx;

        // Load and apply selected animation FBX onto the character
        const animPath = `/animations/${selectedAnimation.file}`;

        if (selectedAnimation.id === 'proposal') {
          const mixer = new THREE.AnimationMixer(characterFbx);
          const clip = createProposalAnimationClip(characterFbx, selectedCharacter.id === 'the_boss');
          characterFbx.animations = [clip]; // cache on character
          const action = mixer.clipAction(clip);
          action.play();
          mixerRef.current = mixer;

          // Attach rose to right hand
          let rightHandBone: THREE.Object3D | null = null;
          characterFbx.traverse((child) => {
            const cleanName = child.name.replace(/^mixamorig[a-zA-Z0-9]*:?/i, '').toLowerCase();
            if (cleanName === 'righthand') {
              rightHandBone = child;
            }
          });

          if (rightHandBone) {
            const oldRose = rightHandBone.getObjectByName('proposal_rose');
            if (oldRose) rightHandBone.remove(oldRose);

            const roseMesh = createRoseMesh();
            rightHandBone.add(roseMesh);
            roseMesh.scale.set(0, 0, 0);
          }

          setLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        } else {
          // Remove rose if other animation is selected
          characterFbx.traverse((child) => {
            if (child.name === 'proposal_rose') {
              child.parent?.remove(child);
            }
          });

          loader.load(
            animPath,
            (animFbx) => {
              if (animFbx.animations && animFbx.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(characterFbx);
                const originalClip = animFbx.animations[0];
                const clipToPlay = remapMixamoClip(originalClip, characterFbx);
                characterFbx.animations = [clipToPlay];
                const action = mixer.clipAction(clipToPlay);
                action.play();
                mixerRef.current = mixer;
              }
              setLoading(false);
              if (onLoadingChange) onLoadingChange(false);
            },
            undefined,
            (err) => {
              console.error('Animation FBX load failed:', animPath, err);
              if (characterFbx.animations && characterFbx.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(characterFbx);
                const action = mixer.clipAction(characterFbx.animations[0]);
                action.play();
                mixerRef.current = mixer;
              }
              setLoading(false);
              if (onLoadingChange) onLoadingChange(false);
            }
          );
        }
      },
      (xhr) => {
        if (xhr.total > 0) {
          setProgress(Math.round((xhr.loaded / xhr.total) * 100));
        } else {
          setProgress((prev) => Math.min(prev + 10, 90));
        }
      },
      (error) => {
        console.error('Error loading FBX character:', filePath, error);
        setLoading(false);
        if (onLoadingChange) onLoadingChange(false);
      }
    );
  }, [selectedCharacter, selectedAnimation, onLoadingChange]);

  return (
    <div className="relative w-full h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#140b2e] via-[#0d0722] to-[#080415] border border-cosmic-gold/30 shadow-[0_0_50px_rgba(255,215,0,0.15)] flex items-center justify-center">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#0d0722]/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-20 transition-opacity duration-300">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-cosmic-gold/20 border-t-cosmic-gold animate-spin" />
            <span className="text-xs font-bold text-cosmic-gold">{progress}%</span>
          </div>
          <span className="text-xs font-semibold text-white/90 animate-pulse">
            جاري تحميل الشخصية ({selectedCharacter.name})...
          </span>
        </div>
      )}

      {/* Interaction Hint Overlay */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none px-3 py-1 rounded-full bg-cosmic-bg/70 border border-cosmic-gold/30 text-[11px] text-cosmic-gold font-medium backdrop-blur-md opacity-80 flex items-center gap-1.5">
        <span>🔄 اسحبي بالماوس أو اللمس لتدوير الشخصية 360°</span>
      </div>
    </div>
  );
};
