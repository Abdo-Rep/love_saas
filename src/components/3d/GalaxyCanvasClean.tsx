'use client';

import React, { useEffect, useRef } from 'react';
import { useConfig } from '@/lib/configContext';

interface Props {
  onStepComplete?: () => void;
}

// 10 Symmetrical Heart Coordinates normalized (0.0 to 1.0)
const HEART_COORDS = [
  { x: 0.50, y: 0.24 },   // 1: Top Notch dip
  { x: 0.65, y: 0.17 },   // 2: Top right curve
  { x: 0.80, y: 0.25 },   // 3: Right upper
  { x: 0.85, y: 0.42 },   // 4: Right side
  { x: 0.74, y: 0.62 },   // 5: Lower right
  { x: 0.50, y: 0.82 },   // 6: Bottom tip
  { x: 0.26, y: 0.62 },   // 7: Lower left
  { x: 0.15, y: 0.42 },   // 8: Left side
  { x: 0.20, y: 0.25 },   // 9: Left upper
  { x: 0.35, y: 0.17 },   // 10: Top left curve
];

const ROMANTIC_SENTENCES = [
  "The first time I saw you, time decided to stop.",
  "Every star here carries a piece of what I feel.",
  "You made ordinary moments feel like forever.",
  "Even silence felt different when you were near.",
  "I didn't know light had a name until I met you.",
  "You are the reason I look up at the sky.",
  "Some feelings don't need words — but I'll try anyway.",
  "Every memory of you glows warmer than the last.",
  "The universe held its breath the day we met.",
  "And just like that — you became everything."
];

// The 10 different high-quality themed images for memories
const MEMORY_PHOTO_URLS = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop"
];

// Definition of letters for BASMALA in stars connected with lines
interface LetterDef {
  points: { x: number; y: number }[];
  lines: [number, number][];
}

const BASMALA_LETTERS: LetterDef[] = [
  // B (Index 0)
  {
    points: [
      { x: -180, y: -30 }, { x: -180, y: -10 }, { x: -180, y: 10 }, { x: -180, y: 30 }, { x: -180, y: 50 }, // stem
      { x: -160, y: -30 }, { x: -145, y: -20 }, { x: -145, y: -10 }, { x: -160, y: 0 }, // top loop
      { x: -145, y: 10 }, { x: -140, y: 25 }, { x: -140, y: 38 }, { x: -160, y: 50 }   // bottom loop
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8], [8, 2],
      [2, 9], [9, 10], [10, 11], [11, 12], [12, 4]
    ]
  },
  // A (Index 1)
  {
    points: [
      { x: -115, y: 50 }, { x: -105, y: 20 }, { x: -95, y: -10 }, { x: -85, y: -40 }, // left leg
      { x: -75, y: -10 }, { x: -65, y: 20 }, { x: -55, y: 50 },                      // right leg
      { x: -100, y: 20 }, { x: -70, y: 20 }                                          // crossbar
    ],
    lines: [
      [0, 1], [1, 2], [2, 3],
      [3, 4], [4, 5], [5, 6],
      [7, 8]
    ]
  },
  // S (Index 2)
  {
    points: [
      { x: -15, y: -35 }, { x: -30, y: -35 }, { x: -35, y: -20 }, { x: -25, y: -5 },
      { x: -15, y: 10 }, { x: -20, y: 25 }, { x: -35, y: 25 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
    ]
  },
  // M (Index 3)
  {
    points: [
      { x: -5, y: 50 }, { x: -5, y: 20 }, { x: -5, y: -10 }, { x: -5, y: -40 }, // left vertical
      { x: 10, y: -10 },                                                        // middle point
      { x: 25, y: -40 }, { x: 25, y: -10 }, { x: 25, y: 20 }, { x: 25, y: 50 }   // right vertical
    ],
    lines: [
      [0, 1], [1, 2], [2, 3],
      [3, 4], [4, 5],
      [5, 6], [6, 7], [7, 8]
    ]
  },
  // A (Index 4)
  {
    points: [
      { x: 45, y: 50 }, { x: 55, y: 20 }, { x: 65, y: -10 }, { x: 75, y: -40 },
      { x: 85, y: -10 }, { x: 95, y: 20 }, { x: 105, y: 50 },
      { x: 60, y: 20 }, { x: 90, y: 20 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3],
      [3, 4], [4, 5], [5, 6],
      [7, 8]
    ]
  },
  // L (Index 5)
  {
    points: [
      { x: 130, y: -40 }, { x: 130, y: -10 }, { x: 130, y: 20 }, { x: 130, y: 50 }, // vertical
      { x: 150, y: 50 }, { x: 170, y: 50 }                                          // horizontal base
    ],
    lines: [
      [0, 1], [1, 2], [2, 3],
      [3, 4], [4, 5]
    ]
  },
  // A (Index 6)
  {
    points: [
      { x: 195, y: 50 }, { x: 205, y: 20 }, { x: 215, y: -10 }, { x: 225, y: -40 },
      { x: 235, y: -10 }, { x: 245, y: 20 }, { x: 255, y: 50 },
      { x: 210, y: 20 }, { x: 240, y: 20 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3],
      [3, 4], [4, 5], [5, 6],
      [7, 8]
    ]
  }
];

export const GalaxyCanvasClean: React.FC<Props> = ({ onStepComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const { config } = useConfig();

  // Pre-load all romantic memory photos
  useEffect(() => {
    // Dynamically replace indices 0 & 1 with user custom images if available
    const urls = [...MEMORY_PHOTO_URLS];
    if (config.herPortraitUrl) urls[0] = config.herPortraitUrl;
    if (config.couplePhotoUrl) urls[1] = config.couplePhotoUrl;

    urls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        loadedImagesRef.current[i] = img;
      };
    });
  }, [config.herPortraitUrl, config.couplePhotoUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    // Cosmic background stars
    interface BackStar {
      x: number;
      y: number;
      size: number;
      twinklePhase: number;
      twinkleSpeed: number;
      alpha: number;
    }
    const backStars: BackStar[] = [];
    const NUM_BACK_STARS = 450;
    for (let i = 0; i < NUM_BACK_STARS; i++) {
      backStars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 1.5 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    // Explosion particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
      color: string;
      size: number;
      alpha: number;
    }
    const particles: Particle[] = [];

    // Animation state machine definitions
    type Phase =
      | 'SPACE_DRIFT'
      | 'STAR_AWAKEN'
      | 'ZOOM_IN'
      | 'MEMORY_SHOW'
      | 'ZOOM_OUT'
      | 'DRAW_LINE'
      | 'FINAL_HEART'
      | 'EXPLOSION'
      | 'BASMALA_REVEAL';

    let currentPhase: Phase = 'SPACE_DRIFT';
    let phaseTime = 0;
    let memoryIndex = 0;           // Active memory loop index (0 to 9)
    let starsUnlocked = 1;         // Stars lit up (starts with star 1)
    let lineDrawProgress = 0.0;    // Connection line animation progress

    // Camera variables
    let camX = W / 2;
    let camY = H / 2;
    let camZoom = 1.0;

    let targetCamX = W / 2;
    let targetCamY = H / 2;
    let targetCamZoom = 1.0;

    // Typewriter text drawing trackers
    let typedCharsCount = 0;
    let textTimer = 0;

    const startTime = performance.now();

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      phaseTime += 0.016; // rough 60fps frame delta

      // Recalculate normalized heart points relative to current canvas width/height
      const heartPoints = HEART_COORDS.map((pt) => ({
        x: pt.x * W,
        y: pt.y * H,
      }));

      // -----------------------------------------------------------------------
      // CINEMATIC STORY ROUTER
      // -----------------------------------------------------------------------
      if (currentPhase === 'SPACE_DRIFT') {
        // Slow drift phase
        if (phaseTime < 4.0) {
          // Slowly move camera down-right
          targetCamX = W / 2 + Math.sin(phaseTime * 0.2) * 35;
          targetCamY = H / 2 + Math.cos(phaseTime * 0.15) * 20;
        } else if (phaseTime >= 4.0 && phaseTime < 5.0) {
          // Decelerate and stop completely
          targetCamX = W / 2;
          targetCamY = H / 2;
        } else if (phaseTime >= 5.0) {
          // 1 full second of silence completed, awaken first star
          currentPhase = 'STAR_AWAKEN';
          phaseTime = 0;
        }
      }

      if (currentPhase === 'STAR_AWAKEN') {
        // Star glows dim -> medium -> intense warm gold over 2 seconds
        if (phaseTime >= 2.0) {
          currentPhase = 'ZOOM_IN';
          phaseTime = 0;
        }
      }

      if (currentPhase === 'ZOOM_IN') {
        // Camera accelerates directly into the active star
        const targetPt = heartPoints[memoryIndex];
        targetCamX = targetPt.x;
        targetCamY = targetPt.y;
        targetCamZoom = 55.0; // Zoom in extremely close

        if (phaseTime >= 1.6) {
          currentPhase = 'MEMORY_SHOW';
          phaseTime = 0;
          typedCharsCount = 0;
          textTimer = 0;
        }
      }

      if (currentPhase === 'MEMORY_SHOW') {
        const sentence = ROMANTIC_SENTENCES[memoryIndex];
        
        // Typewriter animation timing
        textTimer += 0.016;
        if (typedCharsCount < sentence.length && textTimer >= 0.07) {
          typedCharsCount++;
          textTimer = 0;
        }

        // Wait exactly 1 second after typing completes
        if (typedCharsCount >= sentence.length) {
          if (phaseTime >= sentence.length * 0.07 + 1.2) {
            currentPhase = 'ZOOM_OUT';
            phaseTime = 0;
          }
        }
      }

      if (currentPhase === 'ZOOM_OUT') {
        // Camera zooms back out, star shrinks back to point
        targetCamX = W / 2;
        targetCamY = H / 2;
        targetCamZoom = 1.0;

        if (phaseTime >= 1.5) {
          if (memoryIndex < 9) {
            currentPhase = 'DRAW_LINE';
            phaseTime = 0;
            lineDrawProgress = 0;
          } else {
            // Heart loop closed
            currentPhase = 'DRAW_LINE';
            phaseTime = 0;
            lineDrawProgress = 0;
          }
        }
      }

      if (currentPhase === 'DRAW_LINE') {
        lineDrawProgress = Math.min(1.0, phaseTime / 1.3);

        if (lineDrawProgress >= 1.0) {
          if (memoryIndex < 9) {
            memoryIndex++;
            starsUnlocked = memoryIndex + 1;
            currentPhase = 'STAR_AWAKEN';
            phaseTime = 0;
          } else {
            // All 10 segments complete! Show full closed heart
            currentPhase = 'FINAL_HEART';
            phaseTime = 0;
          }
        }
      }

      if (currentPhase === 'FINAL_HEART') {
        targetCamX = W / 2;
        targetCamY = H / 2;
        targetCamZoom = 1.0;

        if (phaseTime >= 3.0) {
          currentPhase = 'EXPLOSION';
          phaseTime = 0;

          // Spawn explosion particles from heart positions
          heartPoints.forEach((pt) => {
            for (let k = 0; k < 60; k++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 6.5 + 2.0;
              particles.push({
                x: pt.x,
                y: pt.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                targetX: 0,
                targetY: 0,
                color: '#FFD700',
                size: Math.random() * 2.5 + 1.0,
                alpha: 1.0
              });
            }
          });
        }
      }

      if (currentPhase === 'EXPLOSION') {
        // Expand particles outward for 2.5 seconds
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.985;
          p.vy *= 0.985;
        });

        if (phaseTime >= 2.5) {
          currentPhase = 'BASMALA_REVEAL';
          phaseTime = 0;

          // Assign targets to particles spelling out BASMALA letter by letter
          let particleIdx = 0;

          BASMALA_LETTERS.forEach((letDef) => {
            letDef.points.forEach((pt) => {
              // Scale and center the coordinates
              const targetX = W / 2 + pt.x * 1.8;
              const targetY = H / 2 + pt.y * 1.8;

              // Assign particle target
              if (particleIdx < particles.length) {
                particles[particleIdx].targetX = targetX;
                particles[particleIdx].targetY = targetY;
                particleIdx++;
              } else {
                // Spawn new particle if needed
                particles.push({
                  x: Math.random() * W,
                  y: Math.random() * H,
                  vx: 0,
                  vy: 0,
                  targetX,
                  targetY,
                  color: '#ffffff',
                  size: Math.random() * 2.5 + 1.0,
                  alpha: 1.0
                });
              }
            });
          });
        }
      }

      if (currentPhase === 'BASMALA_REVEAL') {
        // Pull particles inward to assemble letters
        particles.forEach((p) => {
          if (p.targetX !== 0) {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            p.x += dx * 0.085;
            p.y += dy * 0.085;
          }
        });

        // Trigger finish callback after 8 seconds of spelling basmala
        if (phaseTime >= 8.5) {
          onStepComplete?.();
        }
      }

      // Smooth camera interpolation
      camX += (targetCamX - camX) * 0.075;
      camY += (targetCamY - camY) * 0.075;
      camZoom += (targetCamZoom - camZoom) * 0.075;

      // Draw background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      // Render background stars (with soft parallax depending on camera translation)
      ctx.fillStyle = '#ffffff';
      backStars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.18 + 0.82;
        const sx = star.x - (camX - W / 2) * 0.12;
        const sy = star.y - (camY - H / 2) * 0.12;

        ctx.globalAlpha = star.alpha * twinkle;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Coordinate transformation helper mapping relative points under active zoom and translation
      const getProjCoord = (x: number, y: number) => {
        return {
          x: (x - camX) * camZoom + W / 2,
          y: (y - camY) * camZoom + H / 2,
        };
      };

      // -----------------------------------------------------------------------
      // DRAWING CONSTELLATION SEGMENTS & STARS
      // -----------------------------------------------------------------------
      const isConstellationRenderable =
        currentPhase !== 'EXPLOSION' && currentPhase !== 'BASMALA_REVEAL';

      if (isConstellationRenderable) {
        // Draw lines
        ctx.save();
        for (let i = 0; i < heartPoints.length; i++) {
          const ptA = heartPoints[i];
          const nextIdx = (i + 1) % heartPoints.length;
          const ptB = heartPoints[nextIdx];

          // Draw connected line segment depending on unlocked status
          let segmentProgress = 0.0;
          if (i < starsUnlocked - 1) {
            segmentProgress = 1.0;
          } else if (i === starsUnlocked - 1 && currentPhase === 'DRAW_LINE') {
            segmentProgress = lineDrawProgress;
          }

          // Force last closing line to show if loop is closed (FINAL_HEART phase)
          if (currentPhase === 'FINAL_HEART') {
            segmentProgress = 1.0;
          }

          if (segmentProgress > 0 && i < starsUnlocked) {
            const projA = getProjCoord(ptA.x, ptA.y);
            const projB = getProjCoord(ptB.x, ptB.y);

            const dx = projA.x + (projB.x - projA.x) * segmentProgress;
            const dy = projA.y + (projB.y - projA.y) * segmentProgress;

            // Soft Volumetric line glow
            ctx.beginPath();
            ctx.moveTo(projA.x, projA.y);
            ctx.lineTo(dx, dy);
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.12)';
            ctx.lineWidth = 6 * camZoom;
            ctx.stroke();

            // Main thin golden line
            ctx.strokeStyle = 'rgba(255, 215, 120, 0.7)';
            ctx.lineWidth = 1.2 * camZoom;
            ctx.stroke();
          }
        }
        ctx.restore();

        // Draw major stars
        heartPoints.forEach((pt, idx) => {
          // Decide star brightness
          let starAlpha = idx < starsUnlocked ? 0.75 : 0.0;
          let glowIntensity = 12;

          // Awaken star glow interpolation
          if (idx === memoryIndex && currentPhase === 'STAR_AWAKEN') {
            const glowRatio = Math.min(1.0, phaseTime / 2.0);
            starAlpha = glowRatio * 0.95;
            glowIntensity = 12 + glowRatio * 32;
          }

          if (starAlpha > 0) {
            const proj = getProjCoord(pt.x, pt.y);

            // Sync pulse effect on FINAL_HEART phase
            let pulseScale = 1.0;
            if (currentPhase === 'FINAL_HEART') {
              const pulse = Math.sin(phaseTime * 4.5) * 0.16 + 1.0;
              pulseScale = pulse;
              glowIntensity = 22 * pulse;
            }

            ctx.save();
            const starGlow = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, glowIntensity * pulseScale * camZoom);
            starGlow.addColorStop(0, 'rgba(255, 248, 220, 0.95)');
            starGlow.addColorStop(0.35, 'rgba(255, 215, 80, 0.45)');
            starGlow.addColorStop(1, 'rgba(255, 180, 50, 0)');
            ctx.fillStyle = starGlow;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, glowIntensity * pulseScale * camZoom, 0, Math.PI * 2);
            ctx.fill();

            // Draw bright star core
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = starAlpha;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, 2.5 * camZoom * pulseScale, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
      }

      // -----------------------------------------------------------------------
      // DRAWING MEMORY PHOTOS & LIVE TYPEWRITER TEXT INSIDE CANVAS
      // -----------------------------------------------------------------------
      if (currentPhase === 'MEMORY_SHOW') {
        const activeImg = loadedImagesRef.current[memoryIndex];
        
        // Compute fade transitions
        let opacity = 1.0;
        const totalDuration = ROMANTIC_SENTENCES[memoryIndex].length * 0.07 + 1.2;
        if (phaseTime >= totalDuration - 1.0) {
          // fade out image & text smoothly
          opacity = Math.max(0.0, 1.0 - (phaseTime - (totalDuration - 1.0)) / 1.0);
        }

        // Draw centered softly floating photo if loaded
        if (activeImg) {
          const imgW = Math.min(W * 0.65, 420);
          const imgH = imgW * (activeImg.height / activeImg.width || 0.7);
          const offsetY = Math.sin(phaseTime * 2.5) * 4;

          ctx.save();
          ctx.globalAlpha = opacity;
          
          // Draw soft glowing gold light shadow behind image
          const glowGrad = ctx.createRadialGradient(W / 2, H / 2 - 40 + offsetY, imgW * 0.3, W / 2, H / 2 - 40 + offsetY, imgW * 0.6);
          glowGrad.addColorStop(0, 'rgba(255, 215, 100, 0.15)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.fillRect(W / 2 - imgW, H / 2 - imgH - 100, imgW * 2, imgH * 2 + 100);

          // Clip and draw image directly
          ctx.beginPath();
          ctx.roundRect(W / 2 - imgW / 2, H / 2 - imgH / 2 - 40 + offsetY, imgW, imgH, 12);
          ctx.clip();
          ctx.drawImage(activeImg, W / 2 - imgW / 2, H / 2 - imgH / 2 - 40 + offsetY, imgW, imgH);
          ctx.restore();

          // Typewrite romantic sentence centered below image
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 22px "Playfair Display", "Cairo", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(255, 215, 100, 0.45)';
          ctx.shadowBlur = 8;
          
          const textToDraw = ROMANTIC_SENTENCES[memoryIndex].substring(0, typedCharsCount);
          ctx.fillText(textToDraw, W / 2, H / 2 + imgH / 2 + 35 + offsetY);
          ctx.restore();
        }
      }

      // ZOOM_IN / ZOOM_OUT White transition bloom flash
      if (currentPhase === 'WHITE_FLASH_IN' || currentPhase === 'WHITE_FLASH_OUT') {
        const flashAlpha = Math.sin((phaseTime / 1.2) * Math.PI);
        ctx.fillStyle = `rgba(255, 250, 230, ${flashAlpha * 0.98})`;
        ctx.fillRect(0, 0, W, H);
      }

      // -----------------------------------------------------------------------
      // EXPLOSION PARTICLES RENDER
      // -----------------------------------------------------------------------
      if (currentPhase === 'EXPLOSION' || currentPhase === 'BASMALA_REVEAL') {
        ctx.save();
        particles.forEach((p) => {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // SPELLING BASMALA IN STARS
      // -----------------------------------------------------------------------
      if (currentPhase === 'BASMALA_REVEAL') {
        ctx.save();
        
        // Draw letters and connection lines sequentially from left to right
        let visibleCount = Math.floor(phaseTime / 0.85); // reveal letters sequentially
        
        BASMALA_LETTERS.forEach((letDef, letIdx) => {
          if (letIdx > visibleCount) return;

          // Draw thin golden lines connecting the stars in this letter
          ctx.strokeStyle = 'rgba(255, 215, 120, 0.48)';
          ctx.lineWidth = 1.0;

          letDef.lines.forEach((line) => {
            const ptA = letDef.points[line[0]];
            const ptB = letDef.points[line[1]];

            const pxA = W / 2 + ptA.x * 1.8;
            const pyA = H / 2 + ptA.y * 1.8;
            const pxB = W / 2 + ptB.x * 1.8;
            const pyB = H / 2 + ptB.y * 1.8;

            ctx.beginPath();
            ctx.moveTo(pxA, pyA);
            ctx.lineTo(pxB, pyB);
            ctx.stroke();
          });

          // Draw the star points of this letter
          letDef.points.forEach((pt) => {
            const px = W / 2 + pt.x * 1.8;
            const py = H / 2 + pt.y * 1.8;

            const twinkle = Math.sin(elapsed * 4 + pt.x) * 0.15 + 0.85;

            // Star outer glow
            const grad = ctx.createRadialGradient(px, py, 0, px, py, 10 * twinkle);
            grad.addColorStop(0, 'rgba(255, 248, 220, 0.95)');
            grad.addColorStop(0.4, 'rgba(255, 215, 80, 0.4)');
            grad.addColorStop(1, 'rgba(255, 180, 50, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, 10 * twinkle, 0, Math.PI * 2);
            ctx.fill();

            // Star center core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, 2.0, 0, Math.PI * 2);
            ctx.fill();
          });
        });
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [onStepComplete]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none cursor-default">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 block w-full h-full" />
    </div>
  );
};
