'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function SignatureCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Track cursor position
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  
  // Track trailing position
  const trailingX = useRef(0);
  const trailingY = useRef(0);
  
  const animationFrameId = useRef<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Only mount on devices with a fine pointer (desktop/mouse)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    // Check reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const loop = () => {
      if (!reducedMotion) {
        // Lerp
        trailingX.current += (mouseX.current - trailingX.current) * 0.15;
        trailingY.current += (mouseY.current - trailingY.current) * 0.15;
      } else {
        // Snap instantly if reduced motion
        trailingX.current = mouseX.current;
        trailingY.current = mouseY.current;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${trailingX.current}px, ${trailingY.current}px, 0)`;
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };
    
    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isVisible, reducedMotion]);

  // Don't render anything on touch devices or if reduced motion dictates a completely static experience
  // Actually, we'll render it but snap it if reduced motion, or just not render it on touch.
  const isFinePointer = typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false;
  if (!isFinePointer) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] opacity-0 transition-opacity duration-300"
      style={{
        opacity: isVisible && !reducedMotion ? 0.6 : 0, // Hide on reduced motion or when mouse leaves window
        marginLeft: '-6px',
        marginTop: '-6px',
        boxShadow: '0 0 10px 2px rgba(124, 24, 36, 0.3)', // Soft primary color glow
        willChange: 'transform'
      }}
    />
  );
}
