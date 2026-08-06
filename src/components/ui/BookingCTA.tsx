'use client';

import { AnimatePresence,motion } from 'framer-motion';
import { ArrowUpRight,Check } from 'lucide-react';
import React, { useState } from 'react';

interface BookingCTAProps {
  href: string;
  text: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function BookingCTA({ 
  href, 
  text, 
  className = "flex items-center justify-center gap-2 bg-accent text-white px-[32px] py-[16px] rounded-[30px] font-secondary font-medium text-[15px] hover:bg-white hover:text-accent transition-colors",
  icon = <ArrowUpRight size={18} strokeWidth={2} />
}: BookingCTAProps) {
  const [isBooking, setIsBooking] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsBooking(true);
    
    // Quick micro-animation delay before redirect
    setTimeout(() => {
      window.location.href = href;
      // Reset state slightly after redirect has triggered (in case user comes back via bfcache)
      setTimeout(() => setIsBooking(false), 500);
    }, 300);
  };

  return (
    <a 
      href={href}
      onClick={handleClick}
      className={`relative overflow-hidden ${className} ${isBooking ? 'scale-95' : ''} transition-transform duration-200`}
    >
      <AnimatePresence mode="wait">
        {isBooking ? (
          <motion.div 
            key="confirmed"
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-2 w-full h-full text-green-500 absolute inset-0 bg-white"
          >
            <Check size={20} strokeWidth={3} />
            <span className="font-secondary font-medium">Confirmed</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 w-full h-full"
          >
            <span>{text}</span>
            {icon}
          </motion.div>
        )}
      </AnimatePresence>
    </a>
  );
}
