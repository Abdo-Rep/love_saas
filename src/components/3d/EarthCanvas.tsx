'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  countryName: string;
  coordinates: [number, number]; // [lat, lng]
  videoUrl: string;
  overlayText: string;
  dateText: string;
  onComplete: () => void;
}

export const EarthCanvas: React.FC<Props> = ({
  countryName,
  coordinates,
  videoUrl,
  overlayText,
  dateText,
  onComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);
  const [typedText, setTypedText] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const fullMessage = `في ${dateText}.. في ${countryName}.. ${overlayText}`;
    let idx = 0;

    const timer = setInterval(() => {
      if (idx < fullMessage.length) {
        setTypedText(fullMessage.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 3500);
      }
    }, 70);

    return () => clearInterval(timer);
  }, [countryName, dateText, overlayText, onComplete]);

  // Three.js Earth setup with safe WebGL & 2D fallback
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId: number | null = null;

    try {
      // 1. Try creating Three.js WebGL Scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 15);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'default',
      });

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(5, 3, 5);
      scene.add(dirLight);

      const textureLoader = new THREE.TextureLoader();
      const earthTexture = textureLoader.load(
        'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80'
      );

      const earthGeo = new THREE.SphereGeometry(4, 64, 64);
      const earthMat = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.6,
      });
      const earthMesh = new THREE.Mesh(earthGeo, earthMat);
      scene.add(earthMesh);

      // Target Pin Marker on Earth surface
      const [lat, lng] = coordinates;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);

      const pinRadius = 4.1;
      const pinX = -(pinRadius * Math.sin(phi) * Math.cos(theta));
      const pinY = pinRadius * Math.cos(phi);
      const pinZ = pinRadius * Math.sin(phi) * Math.sin(theta);

      const pinGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(pinX, pinY, pinZ);
      earthMesh.add(pinMesh);

      let time = 0;

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        time += 0.02;

        earthMesh.rotation.y += 0.008;

        // Smooth zoom into the country after 2.5 seconds
        if (time > 2.5) {
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.2, 0.03);
          if (camera.position.z < 6.2 && !showVideo) {
            setShowVideo(true);
          }
        }

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();
    } catch (e) {
      console.warn('WebGL Context creation failed. Switching to 2D Canvas Fallback:', e);
      setUseFallback(true);
    }

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (renderer) {
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [coordinates, showVideo]);

  // 2D Canvas Earth Fallback Engine (Runs when WebGL is unavailable)
  useEffect(() => {
    if (!useFallback) return;

    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let angle = 0;
    let scale = 1;
    let time = 0;

    const render = () => {
      time += 0.02;
      angle += 0.01;

      if (time > 2.5 && scale < 2.5) {
        scale += 0.015;
        if (scale > 1.8 && !showVideo) {
          setShowVideo(true);
        }
      }

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.22 * scale;

      ctx.save();
      ctx.translate(cx, cy);

      // Atmosphere Glow
      const glow = ctx.createRadialGradient(0, 0, r * 0.8, 0, 0, r * 1.3);
      glow.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      glow.addColorStop(0.6, 'rgba(37, 99, 235, 0.3)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Earth Blue Ocean Sphere
      const earthGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      earthGrad.addColorStop(0, '#60a5fa');
      earthGrad.addColorStop(0.5, '#2563eb');
      earthGrad.addColorStop(1, '#1e3a8a');
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = earthGrad;
      ctx.fill();

      // Continents Simulation (Rotating)
      ctx.clip();
      ctx.fillStyle = '#22c55e';
      for (let i = 0; i < 5; i++) {
        const ca = angle + (i * Math.PI) / 2.5;
        const cxPos = Math.sin(ca) * r * 0.75;
        const cyPos = Math.cos(ca * 0.7) * r * 0.5;
        if (cxPos > -r && cxPos < r) {
          ctx.beginPath();
          ctx.arc(cxPos, cyPos, r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Golden Target Location Pin
      const pinX = Math.sin(angle * 0.8) * r * 0.6;
      const pinY = -r * 0.2;
      ctx.beginPath();
      ctx.arc(pinX, pinY, 8 * Math.max(1, scale * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [useFallback, showVideo]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a1a]">
      {/* Background Video layer once zoomed in */}
      {videoUrl && (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${
            showVideo ? 'opacity-60' : 'opacity-0'
          }`}
        />
      )}

      {/* 3D Earth Globe Canvas Mount */}
      {!useFallback ? (
        <div ref={mountRef} className="absolute inset-0 z-10" />
      ) : (
        <canvas ref={fallbackCanvasRef} className="absolute inset-0 z-10" />
      )}

      {/* Text Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-[#0a0a1a] via-transparent to-[#0a0a1a]/60 pointer-events-none">
        <div className="glass-panel-gold rounded-3xl p-8 max-w-md w-full border border-cosmic-gold/50 shadow-2xl backdrop-blur-xl animate-fade-in pointer-events-auto">
          <span className="text-xs uppercase tracking-widest text-cosmic-gold px-3 py-1 rounded-full bg-cosmic-rosegold/30 border border-cosmic-rosegold inline-block mb-4 font-bold">
            🌍 كوكب الأرض • نقطة اللقاء
          </span>
          <p className="text-xl md:text-2xl font-bold text-white leading-relaxed typewriter-glow min-h-[4rem] flex items-center justify-center">
            {typedText}
          </p>
        </div>
      </div>
    </div>
  );
};
