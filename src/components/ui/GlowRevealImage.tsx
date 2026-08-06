'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface GlowRevealImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function GlowRevealImage({ src, alt, className = '' }: GlowRevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  
  const isHovering = useRef(false);
  const lastInteractionTime = useRef(Date.now());
  const particles = useRef<Particle[]>([]);
  
  const animationFrameId = useRef<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match container
    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // Init target to center
      if (!isHovering.current) {
        targetX.current = canvas.width / 2;
        targetY.current = canvas.height / 2;
        currentX.current = targetX.current;
        currentY.current = targetY.current;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;

    const loop = () => {
      frame++;
      const now = Date.now();
      const timeSinceInteraction = now - lastInteractionTime.current;
      
      // Idle autonomous movement (Lissajous figure) if inactive for 1.5s
      if (timeSinceInteraction > 1500) {
        const time = now * 0.001;
        const width = canvas.width;
        const height = canvas.height;
        // Figure-8 pattern across the center of the image
        targetX.current = width / 2 + (width * 0.3) * Math.sin(time * 0.7);
        targetY.current = height / 2 + (height * 0.2) * Math.sin(time * 1.3) * Math.cos(time * 0.5);
      }

      // Linear Interpolation (Lerp) towards target
      currentX.current += (targetX.current - currentX.current) * 0.12;
      currentY.current += (targetY.current - currentY.current) * 0.12;

      // Update CSS Variables for the mask
      container.style.setProperty('--mx', `${currentX.current}px`);
      container.style.setProperty('--my', `${currentY.current}px`);

      // Spawn particles if interacting
      if (isHovering.current && frame % 3 === 0) {
        particles.current.push({
          x: targetX.current + (Math.random() - 0.5) * 40,
          y: targetY.current + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 1.5 - 0.5, // Move upwards
          life: 0,
          maxLife: 60 + Math.random() * 30, // ~1s at 60fps
          size: 1 + Math.random() * 3
        });
      }

      // Draw Particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life >= p.maxLife) {
          particles.current.splice(i, 1);
          continue;
        }

        // Fade in and out
        const progress = p.life / p.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.6; // Max opacity 0.6
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 186, 96, ${alpha})`; // Using the accent golden color
        ctx.fill();
        
        // Add subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(239, 186, 96, 0.8)';
      }
      ctx.shadowBlur = 0; // Reset

      animationFrameId.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [reducedMotion]);

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (reducedMotion) return;
    if (!containerRef.current) return;
    
    isHovering.current = true;
    lastInteractionTime.current = Date.now();
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    targetX.current = clientX - rect.left;
    targetY.current = clientY - rect.top;
  };

  const handlePointerLeave = () => {
    isHovering.current = false;
    lastInteractionTime.current = Date.now(); // Reset idle timer when leaving so it pauses briefly before autonomous motion
  };

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden ${className || 'relative'}`}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handlePointerMove}
      onTouchStart={handlePointerMove}
      onTouchEnd={handlePointerLeave}
    >
      {/* Base Layer: Muted and Desaturated */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={src} 
          alt={alt}
          fill
          className="object-cover object-center pointer-events-none"
          style={{ filter: 'brightness(0.9) saturate(0.9)' }}
          priority
        />
      </div>

      {/* Enhanced Layer: Luminous, Warm, masked by CSS variable coords */}
      <div 
        className="absolute inset-0 z-10 transition-opacity duration-500"
        style={reducedMotion ? {
          opacity: 0,
          WebkitMaskImage: 'none',
          maskImage: 'none'
        } : {
          WebkitMaskImage: 'radial-gradient(circle 250px at var(--mx, 50%) var(--my, 50%), black 0%, black 45%, transparent 75%)',
          maskImage: 'radial-gradient(circle 250px at var(--mx, 50%) var(--my, 50%), black 0%, black 45%, transparent 75%)',
        }}
      >
        <Image 
          src={src} 
          alt={`${alt} Enhanced`}
          fill
          className="object-cover object-center pointer-events-none"
          style={{ filter: 'brightness(1.15) saturate(1.15) sepia(0.15)' }}
          priority
        />
      </div>

      {/* Static hover fallback for Reduced Motion */}
      {reducedMotion && (
        <div className="absolute inset-0 z-10 opacity-0 hover:opacity-100 transition-opacity duration-700">
           <Image 
            src={src} 
            alt={`${alt} Enhanced Hover`}
            fill
            className="object-cover object-center pointer-events-none"
            style={{ filter: 'brightness(1.15) saturate(1.15) sepia(0.15)' }}
            priority
          />
        </div>
      )}

      {/* Particle Canvas */}
      {!reducedMotion && (
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 z-20 pointer-events-none"
        />
      )}
    </div>
  );
}
