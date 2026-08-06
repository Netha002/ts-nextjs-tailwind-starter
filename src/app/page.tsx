'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

import GlowRevealSlideshow from '@/components/ui/GlowRevealSlideshow';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import TreatmentQuiz from '@/components/quiz/TreatmentQuiz';
import TiltCard from '@/components/ui/TiltCard';
import BookingCTA from '@/components/ui/BookingCTA';
import { treatments } from '@/data/treatmentsData';
import { useState } from 'react';

const HERO_IMAGES = [
  "/images/young-woman-skin-care-model-2-scaled.jpg",
  "/images/Screenshot-2026-03-13-100436.webp",
  "/images/luxury-woman-face.jpg"
];

export default function HomePage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  
  // Get the first treatment that has a before/after pair for the homepage highlight
  const featuredTreatment = treatments.find(t => t.beforeAfterPair);

  return (
    <div className="w-full relative">
      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/+918055855585" className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col justify-center overflow-hidden bg-black">
        {/* Glow Reveal Interactive Background Slideshow */}
        <GlowRevealSlideshow 
          images={HERO_IMAGES}
          intervalMs={5000}
          className="absolute inset-0 w-full h-full z-0"
        />

        {/* Content */}
        <div className="layout relative z-20 flex flex-col justify-center h-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.h1 variants={fadeInUp} className="font-primary text-[36px] md:text-[68px] leading-[1.05em] tracking-tight text-white mb-6 md:mb-8 mt-24 md:mt-0">
              Your Skin Deserves Expert Care.<br />
              Your Confidence Deserves pH5 Aesthetics.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="font-secondary text-[16px] md:text-[20px] font-medium text-white mb-10 md:mb-12">
              Advanced dermatology & aesthetic care for skin, hair and aesthetics.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => setIsQuizOpen(true)}
                className="flex items-center justify-center gap-2 bg-accent text-white px-[32px] py-[16px] rounded-[30px] font-secondary font-medium text-[15px] hover:bg-white hover:text-accent transition-colors"
              >
                <span>Find Your Treatment</span>
                <ArrowUpRight size={18} strokeWidth={2} />
              </button>
              <BookingCTA 
                href="https://wa.me/+918055855585"
                text="WhatsApp Us"
                className="flex items-center justify-center gap-2 border-2 border-white/50 text-white px-[32px] py-[16px] rounded-[30px] font-secondary font-medium text-[15px] hover:bg-white hover:text-black transition-colors"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Welcome Section */}
      <section id="about" className="py-24 bg-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="layout flex flex-col items-center text-center"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            {/* Sunburst abstract logo SVG */}
            <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 20 L100 0" stroke="#CE4927" strokeWidth="2"/>
              <path d="M140 30 L154 16" stroke="#CE4927" strokeWidth="2"/>
              <path d="M170 70 L190 60" stroke="#CE4927" strokeWidth="2"/>
              <path d="M180 100 L200 100" stroke="#CE4927" strokeWidth="2"/>
              <path d="M60 30 L46 16" stroke="#CE4927" strokeWidth="2"/>
              <path d="M30 70 L10 60" stroke="#CE4927" strokeWidth="2"/>
              <path d="M20 100 L0 100" stroke="#CE4927" strokeWidth="2"/>
              <circle cx="100" cy="110" r="40" stroke="#CE4927" strokeWidth="2" fill="none" strokeDasharray="10 5" />
              <text x="100" y="145" fontFamily="serif" fontSize="60" fill="#CE4927" textAnchor="middle">a</text>
            </svg>
          </motion.div>
          
          <motion.h3 variants={fadeInUp} className="font-secondary text-primary text-[14px] uppercase tracking-[0.2em] mb-10">
            WELCOME TO PH5 AESTHETICS!
          </motion.h3>
          
          <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
            <p className="font-primary text-text text-[22px] md:text-[24px] leading-[1.6em] flex flex-wrap justify-center gap-x-[0.25em]">
              {"We, at pH5 Aesthetics Clinic believe healthy skin is the foundation of confidence and self-care. We offer expert solutions for skin, hair and aesthetic needs through safe, advanced and personalized dermatological care. We combine medical expertise with luxury care to deliver visible, natural and long-lasting results in a calm and welcoming environment."
                .split(' ')
                .map((word, i) => (
                  <motion.span 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                  >
                    {word}
                  </motion.span>
                ))}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Real Results Section */}
      {featuredTreatment?.beforeAfterPair && (
        <section className="py-24 bg-alternate">
          <div className="layout flex flex-col items-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-primary text-[42px] md:text-[56px] text-primary mb-16 text-center"
            >
              Real Results.
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-4xl mx-auto"
            >
              <BeforeAfterSlider 
                beforeImage={featuredTreatment.beforeAfterPair.beforeImage}
                afterImage={featuredTreatment.beforeAfterPair.afterImage}
                treatmentName={featuredTreatment.name}
                caption={featuredTreatment.beforeAfterPair.caption}
                hoverMode={true}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link href="/treatments" className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-8 py-3 text-primary font-secondary text-[16px] hover:bg-primary hover:text-white transition-colors">
                <span>View all treatments</span>
                <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Doctor Profile Section */}
      <section className="py-24 bg-background">
        <div className="layout">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Arched Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full aspect-[3/4] max-w-[500px] mx-auto overflow-hidden rounded-t-[50%] rounded-b-lg"
            >
              <Image 
                src="/images/young-woman-skin-care-model-2-scaled.jpg" 
                alt="Dr Profile"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2, delayChildren: 0.6 }
                }
              }}
              className="flex flex-col"
            >
              <motion.h2 variants={fadeInUp} className="font-primary text-[42px] md:text-[56px] text-primary mb-2">
                DR. DIVYA SREE VARRI
              </motion.h2>
              <motion.h4 variants={fadeInUp} className="font-secondary text-[14px] font-bold tracking-widest text-text uppercase mb-12">
                MD, CHIEF CONSULTANT DERMATOLOGIST, CLINICAL &<br/>AESTHETIC DERMATOLOGY
              </motion.h4>
              
              <motion.h3 variants={fadeInUp} className="font-primary text-[24px] text-text mb-6">
                WHAT WE DO?
              </motion.h3>
              <motion.p variants={fadeInUp} className="font-secondary text-text text-[16px] leading-[1.8em]">
                We, at pH5 Aesthetics Clinic offer a wide range of
                medical and cosmetic dermatology services designed to
                address skin, hair and aesthetic concerns with precision and
                care. Our treatments are all customized by our chief
                dermatology expert to suit individual skin types and
                conditions, ensuring safe procedures and visible
                results.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background relative overflow-hidden">
        <div className="layout relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Skin Concerns Card */}
            <motion.div variants={fadeInUp}>
              <TiltCard className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                <Image src="/images/young-woman-skin-care-model-2-scaled.jpg" alt="Skin Concerns" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-6 left-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                </div>
                <h3 className="absolute bottom-8 left-8 font-primary text-white text-[32px]">Skin Concerns</h3>
              </TiltCard>
            </motion.div>

            {/* Hair Concerns Card (Golden text background) */}
            <motion.div variants={fadeInUp}>
              <TiltCard className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-accent p-10 flex flex-col justify-end">
                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>
                <div className="absolute top-6 left-6 z-10">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="relative z-10">
                  <h3 className="font-primary text-primary text-[32px] mb-4">Hair Concerns</h3>
                  <p className="font-secondary text-primary/80 text-[15px] mb-8 leading-relaxed">
                    Thinning of hair, loss of density, shedding of excess hair, receding hair line are common hair loss symptoms.
                  </p>
                  <Link href="/treatments" className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-6 py-2 text-primary font-secondary text-[14px] hover:bg-primary hover:text-white transition-colors">
                    <span>View Details</span>
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </TiltCard>
            </motion.div>

            {/* Body Concerns Card */}
            <motion.div variants={fadeInUp}>
              <TiltCard className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                <Image src="/images/Screenshot-2026-03-13-100436.webp" alt="Body Concerns" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-6 left-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-4.5 4a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
                </div>
                <h3 className="absolute bottom-8 left-8 font-primary text-white text-[32px]">Body Concerns</h3>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Appointments Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Subtle radial highlight background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="layout relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Arched Image Left */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full aspect-[4/5] max-w-[500px] overflow-hidden rounded-t-[50%] rounded-b-2xl mx-auto md:ml-0"
            >
              <Image 
                src="/images/young-woman-skin-care-model-2-scaled.jpg" 
                alt="Appointments"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Text Right */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <motion.h2 variants={fadeInUp} className="font-primary text-[50px] md:text-[68px] text-primary mb-12">
                For Appointments
              </motion.h2>
              <motion.div variants={fadeInUp}>
                <BookingCTA 
                  href="tel:+918055855585"
                  text="Book Appointment"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Quiz Modal */}
      <TreatmentQuiz 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
      />
    </div>
  );
}
