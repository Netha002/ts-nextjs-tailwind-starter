'use client';

import React, { useState } from 'react';
import { treatments } from '@/data/treatmentsData';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import TreatmentQuiz from '@/components/quiz/TreatmentQuiz';
import BookingCTA from '@/components/ui/BookingCTA';
import TiltCard from '@/components/ui/TiltCard';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TreatmentsPage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="w-full min-h-screen pt-[130px] pb-24 bg-background">
      <div className="layout">
        
        {/* Header & Quiz CTA */}
        <div className="flex flex-col items-center text-center mb-20">
          <h1 className="font-primary text-primary text-[50px] md:text-[80px] leading-tight mb-6">
            Clinical & Aesthetic Treatments
          </h1>
          <p className="font-secondary text-text/80 text-[18px] max-w-2xl mb-10">
            Explore our comprehensive range of advanced treatments designed to illuminate your skin, restore your hair, and reveal your most confident self.
          </p>
          
          <button 
            onClick={() => setIsQuizOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-full font-secondary text-[16px] font-medium hover:bg-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <Sparkles size={20} />
            <span>Find Your Perfect Treatment</span>
          </button>
        </div>

        {/* Treatments List */}
        <div className="flex flex-col gap-24">
          {treatments.map((treatment, idx) => (
            <motion.div 
              key={treatment.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center"
            >
              <div className={`w-full lg:w-1/2 flex flex-col gap-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="inline-block px-4 py-1 border border-accent/30 text-accent rounded-full font-secondary text-[14px] w-fit">
                  {treatment.category}
                </div>
                <h2 className="font-primary text-primary text-[40px] leading-tight">
                  {treatment.name}
                </h2>
                <p className="font-secondary text-text/80 text-[18px] leading-relaxed">
                  {treatment.fullDescription}
                </p>
                
                <BookingCTA 
                  href="https://wa.me/+918055855585"
                  text="Book Consultation"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-full font-secondary text-[16px] font-medium hover:bg-primary hover:text-alternate transition-colors w-fit mt-4"
                />
              </div>

              <div className={`w-full lg:w-1/2 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <TiltCard maxTilt={3}>
                  {treatment.beforeAfterPair ? (
                    <BeforeAfterSlider 
                      beforeImage={treatment.beforeAfterPair.beforeImage}
                      afterImage={treatment.beforeAfterPair.afterImage}
                      treatmentName={treatment.name}
                      caption={treatment.beforeAfterPair.caption}
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-black/5 rounded-2xl flex items-center justify-center border border-border">
                      <p className="font-secondary text-text/50 italic">Clinical results coming soon</p>
                    </div>
                  )}
                </TiltCard>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Quiz Modal */}
      <TreatmentQuiz 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
      />
    </div>
  );
}
