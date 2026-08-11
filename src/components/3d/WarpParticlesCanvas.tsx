'use client';

import React, { useEffect, useRef } from 'react';

interface HeartParticle {
  hx: number; // Parametric heart X offset
  hy: number; // Parametric heart Y offset
  z: number;
  size: number;
  symbol: string;
  color: string;
}

const FLOWERS_AND_HEARTS = ['🌸', '🌹', '💖', '✨', '❤️', '💕', '💐'];

export const WarpParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#ff758f', '#ffd700', '#ff4d6d', '#ffffff', '#ffb6c1'];
    const numParticles = 72;

    // PARAMETRIC HEART SHAPE SPANNER OUTSIDE THE CENTER TEXT BOX
    const createHeartParticle = (zPos?: number): HeartParticle => {
      const t = Math.random() * Math.PI * 2;
      // Larger scale so heart curve envelops the outer space, far clear of the center text card
      const scale = 24 + Math.random() * 16;
      const hx = 16 * Math.pow(Math.sin(t), 3) * scale;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;

      return {
        hx,
        hy,
        z: zPos ?? Math.random() * width,
        size: Math.random() * 0.8 + 0.9,
        symbol: FLOWERS_AND_HEARTS[Math.floor(Math.random() * FLOWERS_AND_HEARTS.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const particles: HeartParticle[] = Array.from({ length: numParticles }, () => createHeartParticle());

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '22px sans-serif';

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= 22; // Smooth fast flight

        if (p.z <= 0) {
          particles[i] = createHeartParticle(width);
          continue;
        }

        const k = 240 / p.z;
        const px = p.hx * k + cx;
        const py = p.hy * k + cy;

        // STRICT CENTER EXCLUSION ZONE (Keep the transparent text card 100% clean & clear!)
        const isInsideCenterCard = Math.abs(px - cx) < 230 && Math.abs(py - cy) < 260;
        if (isInsideCenterCard) {
          continue;
        }

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const prevK = 240 / (p.z + 30);
          const prevPx = p.hx * prevK + cx;
          const prevPy = p.hy * prevK + cy;

          // Fast Light Trail Line
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.min(4, (1 - p.z / width) * 3.5);
          ctx.stroke();

          // Emoji Flower / Heart Icon
          ctx.fillText(p.symbol, px, py);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    let animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
