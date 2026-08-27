'use client';

import React, { useEffect, useRef } from 'react';

export const CosmicMeteorsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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

    // Stars (نجوم لامعة)
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    }));

    // Glowing Meteors (نيازك متساقطة في السماء الكونية)
    const meteors: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      size: number;
      color: string;
      angle: number;
    }> = [];

    const addMeteor = () => {
      if (meteors.length < 7) {
        const colors = ['#ffd700', '#f472b6', '#ff4d6d', '#ffffff', '#fbbf24', '#e879f9'];
        meteors.push({
          x: Math.random() * (width + 300) - 100,
          y: Math.random() * (height / 2) - 150,
          length: Math.random() * 130 + 70,
          speed: Math.random() * 9 + 5,
          size: Math.random() * 2.5 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.PI / 4 // 45 degree diagonal falling
        });
      }
    };

    const meteorInterval = setInterval(addMeteor, 700);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render stars
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.speed = -star.speed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${Math.abs(star.alpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffd700';
        ctx.fill();
      });

      // Render falling glowing meteors (نيازك)
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x -= m.speed * Math.cos(m.angle);
        m.y += m.speed * Math.sin(m.angle);

        // Tail gradient line
        const grad = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x + m.length * Math.cos(m.angle),
          m.y - m.length * Math.sin(m.angle)
        );
        grad.addColorStop(0, m.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(
          m.x + m.length * Math.cos(m.angle),
          m.y - m.length * Math.sin(m.angle)
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.size;
        ctx.shadowBlur = 14;
        ctx.shadowColor = m.color;
        ctx.stroke();

        // Glowing meteor head
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 18;
        ctx.shadowColor = m.color;
        ctx.fill();

        if (m.x < -300 || m.y > height + 200) {
          meteors.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(meteorInterval);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.12)_0%,transparent_70%)] pointer-events-none" />
    </div>
  );
};
