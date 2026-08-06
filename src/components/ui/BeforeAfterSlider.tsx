'use client';

import { ChevronsLeftRight } from 'lucide-react';
import Image from 'next/image';
import React, { KeyboardEvent,useEffect, useRef, useState } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  treatmentName?: string;
  caption?: string;
  hoverMode?: boolean;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  treatmentName,
  caption,
  hoverMode = false,
}: BeforeAfterSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Logical position (0 to 100)
  const targetPosition = useRef(50);
  const currentPosition = useRef(50);
  const animationFrameId = useRef<number>(0);
  
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const loop = () => {
      // Lerp for smooth tracking
      const lerpFactor = reducedMotion ? 1 : 0.15;
      
      if (Math.abs(targetPosition.current - currentPosition.current) > 0.05) {
        currentPosition.current += (targetPosition.current - currentPosition.current) * lerpFactor;
        // Update CSS variables
        container.style.setProperty('--slider-pos', `${currentPosition.current}%`);
      }
      
      animationFrameId.current = requestAnimationFrame(loop);
    };
    animationFrameId.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, [reducedMotion]);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let pos = ((clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    targetPosition.current = pos;
  };

  // Mouse & Touch events
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (hoverMode && e.type !== 'touchstart') return; // Desktop hover disables drag, but mobile touch still allows dragging
    setIsDragging(true);
    updatePosition('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (hoverMode && e.type === 'mousemove') {
      updatePosition((e as React.MouseEvent).clientX);
      return;
    }
    if (!isDragging) return;
    updatePosition('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => updatePosition(e.clientX);
    const handleGlobalTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX);
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('touchmove', handleGlobalTouchMove);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
    };
  }, [isDragging]);

  // Keyboard accessibility
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = 5;
    if (e.key === 'ArrowLeft') {
      targetPosition.current = Math.max(0, targetPosition.current - step);
    } else if (e.key === 'ArrowRight') {
      targetPosition.current = Math.min(100, targetPosition.current + step);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {treatmentName && (
        <h3 className="font-primary text-[24px] text-primary">{treatmentName}</h3>
      )}
      
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-xl select-none group"
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onMouseLeave={hoverMode ? () => { targetPosition.current = 50; } : undefined}
        style={{ '--slider-pos': '50%' } as React.CSSProperties}
      >
        {/* Before Image (Background) */}
        <Image 
          src={beforeImage}
          alt={`Before ${treatmentName || 'treatment'}`}
          fill
          unoptimized={true}
          className="object-cover object-center pointer-events-none"
        />
        
        {/* Before Label */}
        <div 
          className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md text-white font-secondary text-[14px] rounded-full transition-opacity duration-300 z-10"
          style={{ opacity: `calc(1 - max(0, (var(--slider-pos) - 80) * 5))` }} 
        >
          {beforeLabel}
        </div>

        {/* After Image (Foreground clipped) */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ clipPath: 'inset(0 calc(100% - var(--slider-pos)) 0 0)' }}
        >
          <Image 
            src={afterImage}
            alt={`After ${treatmentName || 'treatment'}`}
            fill
            unoptimized={true}
            className="object-cover object-center pointer-events-none"
          />
          
          {/* After Label */}
          <div 
            className="absolute top-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md text-white font-secondary text-[14px] rounded-full transition-opacity duration-300 z-30"
            style={{ opacity: `calc(1 - max(0, (20 - var(--slider-pos)) * 5))` }}
          >
            {afterLabel}
          </div>
        </div>

        {/* Divider Line & Handle */}
        <button
          className={`absolute top-0 bottom-0 z-30 flex items-center justify-center w-[2px] bg-white transform -translate-x-1/2 focus:outline-none focus:ring-4 focus:ring-accent/50 focus:ring-offset-2 ${isDragging ? 'cursor-grabbing' : (hoverMode ? 'cursor-crosshair' : 'cursor-grab')}`}
          style={{ left: 'var(--slider-pos)' }}
          onKeyDown={handleKeyDown}
          aria-label={`Image comparison slider. Currently showing ${Math.round(currentPosition.current)}% of the before image. Use left and right arrow keys to adjust.`}
          aria-valuenow={Math.round(currentPosition.current)}
          aria-valuemin={0}
          aria-valuemax={100}
          role="slider"
        >
          {/* Handle Grip */}
          <div className={`w-[40px] h-[40px] rounded-full bg-white shadow-lg flex items-center justify-center text-primary transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
            <ChevronsLeftRight size={20} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      {caption && (
        <p className="font-secondary text-text/80 text-[14px] italic text-center">
          {caption}
        </p>
      )}
    </div>
  );
}
