'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface GlowRevealSlideshowProps {
  images: string[];
  className?: string;
  intervalMs?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function GlowRevealSlideshow({ 
  images, 
  className = '', 
  intervalMs = 5000 
}: GlowRevealSlideshowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  
  const targetRadius = useRef(0); 
  const currentRadius = useRef(0);
  const targetBloom = useRef(0);
  const currentBloom = useRef(0);

  const isHovering = useRef(false);
  const particles = useRef<Particle[]>([]);
  
  const animationFrameId = useRef<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determine base radius based on window width
  const getBaseRadius = () => typeof window !== 'undefined' && window.innerWidth < 768 ? 110 : 100;

  // Slideshow interval
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [images.length, intervalMs]);

  useEffect(() => {
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

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      const baseRadius = getBaseRadius();

      if (isHovering.current) {
        if (targetRadius.current < baseRadius) {
           targetRadius.current = baseRadius;
        } else {
           // Slowly recover back to base radius from click expansion
           targetRadius.current += (baseRadius - targetRadius.current) * 0.05; 
        }
      } else {
        targetRadius.current = 0;
      }
      
      // Decay bloom
      targetBloom.current += (0 - targetBloom.current) * 0.1;

      // Lerp for ultra-smooth buttery tracking
      currentX.current += (targetX.current - currentX.current) * 0.12;
      currentY.current += (targetY.current - currentY.current) * 0.12;
      // Fade out radius slower (0.05) to give that 300-500ms fade out, fade in faster
      const radiusLerp = isHovering.current ? 0.15 : 0.06;
      currentRadius.current += (targetRadius.current - currentRadius.current) * radiusLerp;
      
      currentBloom.current += (targetBloom.current - currentBloom.current) * 0.15;

      // Update CSS Variables for mask and bloom
      container.style.setProperty('--mx', `${currentX.current}px`);
      container.style.setProperty('--my', `${currentY.current}px`);
      container.style.setProperty('--m-radius', `${currentRadius.current}px`);
      container.style.setProperty('--m-bloom', `${currentBloom.current}`);

      // Draw Particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Elegant floating motion
        p.vy -= 0.015; // float gently upward
        p.vx *= 0.98;

        if (p.life >= p.maxLife) {
          particles.current.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.5; // Soft opacity
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`; 
        ctx.fill();
        
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${p.color}, 0.4)`;
      }
      ctx.shadowBlur = 0; 

      animationFrameId.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [reducedMotion]);

  const updateCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
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

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (reducedMotion) return;
    isHovering.current = true;
    updateCoordinates(e);
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (reducedMotion) return;
    isHovering.current = true;
    updateCoordinates(e);
    
    // Expand glow slightly (1.2x) for beauty sponge effect
    targetRadius.current = getBaseRadius() * 1.2; 
    
    // Trigger golden shimmer bloom
    targetBloom.current = 1;

    // Elegant minimal sparkles (2-4 max)
    const particleCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: targetX.current + (Math.random() - 0.5) * 30,
        y: targetY.current + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -0.5 - Math.random() * 1, // gentle upward trajectory
        life: 0,
        maxLife: 45 + Math.random() * 20, // ~700-900ms
        size: 0.8 + Math.random() * 1.5,
        color: Math.random() > 0.5 ? '255, 230, 200' : '255, 245, 230' // Warm elegant whites/golds
      });
    }
  };

  const handlePointerLeave = () => {
    isHovering.current = false;
  };

  const maskGradient = 'radial-gradient(circle var(--m-radius, 0px) at var(--mx, 50%) var(--my, 50%), black 0%, black 20%, rgba(0,0,0,0.7) 45%, transparent 100%)';

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden ${className || 'relative'}`}
      onMouseMove={handlePointerMove}
      onMouseDown={handlePointerDown}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handlePointerMove}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerLeave}
    >
      {/* Base Layer Slideshow: Muted and Desaturated */}
      <div className="absolute inset-0 z-0">
        {images.map((src, idx) => (
          <Image 
            key={`base-${idx}`}
            src={src} 
            alt={`Hero Background ${idx + 1}`}
            fill
            className={`object-cover object-center pointer-events-none transition-opacity duration-1000 ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ filter: 'brightness(0.9) saturate(0.85)' }}
            unoptimized={true}
            priority={idx === 0}
          />
        ))}
      </div>

      {/* Enhanced Layer Slideshow: Luminous, Warm, mapped by feather-soft CSS mask */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={reducedMotion ? {
          opacity: 0,
          WebkitMaskImage: 'none',
          maskImage: 'none'
        } : {
          WebkitMaskImage: maskGradient,
          maskImage: maskGradient,
        }}
      >
        {images.map((src, idx) => (
          <Image 
            key={`enhanced-${idx}`}
            src={src} 
            alt={`Hero Background Enhanced ${idx + 1}`}
            fill
            className={`object-cover object-center pointer-events-none transition-opacity duration-1000 ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ filter: 'brightness(1.1) saturate(1.1) sepia(0.05)' }}
            unoptimized={true}
            priority={idx === 0}
          />
        ))}
      </div>

      {/* Golden Shimmer Bloom Effect overlay (Appears on click/tap) */}
      {!reducedMotion && (
        <div 
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
          style={{
            opacity: 'var(--m-bloom, 0)',
            background: 'radial-gradient(circle calc(var(--m-radius, 0px) * 1.5) at var(--mx, 50%) var(--my, 50%), rgba(255,240,210,0.7) 0%, rgba(255,220,180,0.3) 40%, transparent 100%)'
          }}
        />
      )}

      {/* Static hover fallback for Reduced Motion */}
      {reducedMotion && (
        <div className="absolute inset-0 z-10 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
           {images.map((src, idx) => (
             <Image 
               key={`fallback-${idx}`}
               src={src} 
               alt={`Hero Background Hover ${idx + 1}`}
               fill
               className={`object-cover object-center pointer-events-none transition-opacity duration-1000 ${
                 idx === currentIndex ? 'opacity-100' : 'opacity-0'
               }`}
               style={{ filter: 'brightness(1.1) saturate(1.1) sepia(0.05)' }}
               unoptimized={true}
               priority={idx === 0}
             />
           ))}
        </div>
      )}

      {/* Particle Canvas for elegant makeup sparkles */}
      {!reducedMotion && (
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 z-30 pointer-events-none"
        />
      )}
    </div>
  );
}
