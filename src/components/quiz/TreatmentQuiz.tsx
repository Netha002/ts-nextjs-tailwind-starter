'use client';

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Check, Lock, Unlock, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { calculateSkinScore, QuizState, ScoreResult } from '@/lib/skinScore';

import { getTreatmentBySlug, TreatmentData } from '@/data/treatmentsData';

interface TreatmentQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 'teaser' | 'result';

export default function TreatmentQuiz({ isOpen, onClose }: TreatmentQuizProps) {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<QuizState>({
    concern: '',
    skinType: '',
    routine: '',
    sunProtection: '',
    timeline: '',
    history: '',
  });
  const [recommendation, setRecommendation] = useState<{
    treatment: TreatmentData;
    rationale: string;
  } | null>(null);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const [contactInfo, setContactInfo] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Setup reduced motion listener
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Reset quiz when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAnswers({
        concern: '',
        skinType: '',
        routine: '',
        sunProtection: '',
        timeline: '',
        history: '',
      });
      setRecommendation(null);
      setScore(null);
      setContactInfo('');
      setIsBooking(false);
      setIsUnlocking(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAnswer = (key: keyof QuizState, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));

    // Auto advance
    setTimeout(() => {
      if (step === 1) setStep(2);
      else if (step === 2) setStep(3);
      else if (step === 3) setStep(4);
      else if (step === 4) setStep(5);
      else if (step === 5) setStep(6);
      else if (step === 6)
        calculateRecommendation({ ...answers, [key]: value });
    }, 300);
  };

  const calculateRecommendation = (finalAnswers: QuizState) => {
    let slug = 'ph5-signature-glow';
    let rationale =
      'Based on your answers, our signature glow facial is the perfect starting point to rejuvenate your skin.';

    if (finalAnswers.concern === 'acne') {
      slug = 'acne-clear-peel';
      rationale = `Since you're dealing with acne and have ${finalAnswers.skinType} skin, our Acne Clear Peel will help clear your complexion safely.`;
    } else if (finalAnswers.concern === 'aging/fine lines') {
      slug = 'anti-aging-resurfacing';
      rationale = `To target fine lines and aging, our advanced resurfacing treatment will stimulate collagen and restore a youthful texture.`;
    } else if (finalAnswers.concern === 'pigmentation') {
      slug = 'pigmentation-corrector';
      rationale = `To address pigmentation and sun damage, this specialized laser protocol will gently break down excess melanin.`;
    } else if (finalAnswers.concern === 'hair loss') {
      slug = 'prp-hair-restoration';
      rationale = `For hair thinning, our PRP restoration therapy is a scientifically proven method to stimulate your dormant follicles.`;
    }

    const matchedTreatment = getTreatmentBySlug(slug);
    if (matchedTreatment) {
      setRecommendation({ treatment: matchedTreatment, rationale });
      setScore(calculateSkinScore(finalAnswers));
      setStep('teaser');
    } else {
      onClose();
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) return;

    setIsUnlocking(true);

    // Fire background submission
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: 'YOUR_ACCESS_KEY', // Placeholder
        contact: contactInfo,
        score: score?.overall,
        answers,
      }),
    }).catch(() => {
      // Silently ignore tracking errors so they don't break the user flow
    });

    setTimeout(
      () => {
        setStep('result');
        setIsUnlocking(false);
      },
      reducedMotion ? 0 : 300
    );
  };

  const handleBook = () => {
    setIsBooking(true);
    setTimeout(() => {
      if (score && recommendation) {
        const message = `Hi, I completed the Skin Score quiz on your website.
My Skin Score: ${score.overall}/100
Concern: ${answers.concern}
Skin type: ${answers.skinType}
Recommended treatment: ${recommendation.treatment.name}

I'd like to book a consultation.`;
        window.location.href = `https://wa.me/+919347871336?text=${encodeURIComponent(
          message
        )}`;
      }
      setIsBooking(false);
    }, 400);
  };

  if (!isOpen) return null;

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const currentStepNumber = typeof step === 'number' ? step : 6;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6'>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className='relative w-full max-w-xl bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]'
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border/50 shrink-0'>
          <div className='flex items-center gap-4'>
            {typeof step === 'number' && step > 1 && (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className='p-2 text-text/60 hover:text-primary transition-colors'
                aria-label='Go back'
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className='font-primary text-[22px] text-primary'>
              Your Skin Score
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 text-text/60 hover:text-primary transition-colors rounded-full hover:bg-black/5'
            aria-label='Close quiz'
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        {typeof step === 'number' && (
          <div className='w-full bg-black/5 h-1 shrink-0'>
            <div
              className='bg-accent h-full transition-all duration-500 ease-out'
              style={{ width: `${(currentStepNumber / 6) * 100}%` }}
            />
          </div>
        )}

        {/* Content Area */}
        <div className='flex-1 overflow-y-auto p-6 md:p-10 relative min-h-[400px]'>
          <div aria-live='polite' className='sr-only'>
            {typeof step === 'string'
              ? 'Quiz complete. Showing result.'
              : `Question ${step} of 6`}
          </div>

          <AnimatePresence mode='wait'>
            {step === 1 && (
              <motion.fieldset
                key='step1'
                variants={slideVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                className='flex flex-col gap-6'
              >
                <legend className='font-secondary text-[24px] text-primary mb-2'>
                  What's your main concern?
                </legend>
                <div className='flex flex-col gap-3'>
                  {[
                    'acne',
                    'aging/fine lines',
                    'pigmentation',
                    'hair loss',
                    'general glow',
                  ].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer('concern', opt)}
                      className={`text-left p-4 rounded-xl border ${
                        answers.concern === opt
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50 hover:bg-black/5'
                      } transition-all font-secondary text-[16px] capitalize`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.fieldset>
            )}

            {step === 2 && (
              <motion.fieldset
                key='step2'
                variants={slideVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                className='flex flex-col gap-6'
              >
                <legend className='font-secondary text-[24px] text-primary mb-2'>
                  How would you describe your skin type?
                </legend>
                <div className='flex flex-col gap-3'>
                  {['oily', 'dry', 'combination', 'sensitive'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer('skinType', opt)}
                      className={`text-left p-4 rounded-xl border ${
                        answers.skinType === opt
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50 hover:bg-black/5'
                      } transition-all font-secondary text-[16px] capitalize`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.fieldset>
            )}

            {step === 3 && (
              <motion.fieldset
                key='step3'
                variants={slideVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                className='flex flex-col gap-6'
              >
                <legend className='font-secondary text-[24px] text-primary mb-2'>
                  How consistent is your daily skincare routine?
                </legend>
                <div className='flex flex-col gap-3'>
                  {[
                    'strict daily routine',
                    'sometimes i forget',
                    "i don't have one",
                  ].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer('routine', opt)}
                      className={`text-left p-4 rounded-xl border ${
                        answers.routine === opt
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50 hover:bg-black/5'
                      } transition-all font-secondary text-[16px] capitalize`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.fieldset>
            )}

            {step === 4 && (
              <motion.fieldset
                key='step4'
                variants={slideVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                className='flex flex-col gap-6'
              >
                <legend className='font-secondary text-[24px] text-primary mb-2'>
                  How often do you wear sunscreen?
                </legend>
                <div className='flex flex-col gap-3'>
                  {['every single day', "only when it's sunny", 'rarely'].map(
                    (opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer('sunProtection', opt)}
                        className={`text-left p-4 rounded-xl border ${
                          answers.sunProtection === opt
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50 hover:bg-black/5'
                        } transition-all font-secondary text-[16px] capitalize`}
                      >
                        {opt}
                      </button>
                    )
                  )}
                </div>
              </motion.fieldset>
            )}

            {step === 5 && (
              <motion.fieldset
                key='step5'
                variants={slideVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                className='flex flex-col gap-6'
              >
                <legend className='font-secondary text-[24px] text-primary mb-2'>
                  How soon are you looking to start treatment?
                </legend>
                <div className='flex flex-col gap-3'>
                  {['ASAP', 'within a month', 'just researching'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer('timeline', opt)}
                      className={`text-left p-4 rounded-xl border ${
                        answers.timeline === opt
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50 hover:bg-black/5'
                      } transition-all font-secondary text-[16px] capitalize`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.fieldset>
            )}

            {step === 6 && (
              <motion.fieldset
                key='step6'
                variants={slideVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                className='flex flex-col gap-6'
              >
                <legend className='font-secondary text-[24px] text-primary mb-2'>
                  Have you had a professional skin/hair treatment before?
                </legend>
                <div className='flex flex-col gap-3'>
                  {['yes', 'no'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer('history', opt)}
                      className={`text-left p-4 rounded-xl border ${
                        answers.history === opt
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50 hover:bg-black/5'
                      } transition-all font-secondary text-[16px] capitalize`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.fieldset>
            )}

            {(step === 'teaser' || step === 'result') &&
              score &&
              recommendation && (
                <motion.div
                  key='final'
                  variants={slideVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  className='flex flex-col h-full justify-between'
                >
                  {/* Score Card */}
                  <div className='bg-alternate rounded-2xl p-6 border border-border/50 relative overflow-hidden flex-shrink-0'>
                    <div className='flex flex-col items-center text-center'>
                      <p className='font-secondary text-[12px] md:text-[14px] uppercase tracking-widest text-primary/70 mb-0 md:mb-2'>
                        Your Overall Skin Score
                      </p>

                      <ScoreNumber
                        value={score.overall}
                        isUnlocked={step === 'result'}
                        reducedMotion={reducedMotion}
                      />

                      <div className='relative w-full mt-4 md:mt-6'>
                        {/* The Bars (Blurred out if locked) */}
                        <div
                          className={`w-full flex flex-col gap-3 md:gap-4 transition-all duration-500 ${
                            step === 'teaser'
                              ? 'opacity-20 blur-[6px] pointer-events-none select-none'
                              : ''
                          }`}
                        >
                          {score.categories.map((cat, i) => (
                            <div key={cat.label} className='w-full'>
                              <div className='flex justify-between font-secondary text-[13px] md:text-[14px] text-text mb-1.5'>
                                <span>{cat.label}</span>
                                <span>
                                  {step === 'result' ? (
                                    `${cat.score}/100`
                                  ) : (
                                    <Lock
                                      size={14}
                                      className='inline opacity-50'
                                    />
                                  )}
                                </span>
                              </div>
                              <div className='w-full h-2 rounded-full bg-black/5 overflow-hidden'>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width:
                                      step === 'result'
                                        ? `${cat.score}%`
                                        : '0%',
                                  }}
                                  transition={{
                                    duration: reducedMotion ? 0 : 0.8,
                                    delay: reducedMotion ? 0 : i * 0.1,
                                    ease: 'easeOut',
                                  }}
                                  className='h-full bg-accent rounded-full'
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Overlaid Unlock Form (Only visible in teaser state) */}
                        {step === 'teaser' && (
                          <div className='absolute inset-0 flex flex-col items-center justify-center z-10 px-2'>
                            <p className='font-secondary text-primary text-[14px] md:text-[15px] font-medium text-center mb-3'>
                              Enter your WhatsApp number to unlock your full
                              score & routine.
                            </p>
                            <form
                              onSubmit={handleUnlock}
                              className='flex flex-col gap-2 w-full max-w-[300px]'
                            >
                              <input
                                type='text'
                                required
                                placeholder='Email or WhatsApp'
                                value={contactInfo}
                                onChange={(e) => setContactInfo(e.target.value)}
                                className='w-full py-2.5 px-4 rounded-xl border border-border bg-white font-secondary text-[14px] focus:outline-none focus:border-accent text-center shadow-sm'
                              />
                              <button
                                type='submit'
                                disabled={isUnlocking}
                                className='w-full bg-primary text-white py-2.5 rounded-xl font-secondary font-medium text-[14px] hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-md'
                              >
                                {isUnlocking ? (
                                  'Unlocking...'
                                ) : (
                                  <>
                                    <Unlock size={16} />
                                    <span>Unlock Score</span>
                                  </>
                                )}
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className='text-center font-secondary text-[11px] text-text/40 mt-4 md:mt-6 italic'>
                      A fun starting point, not a clinical assessment.
                    </p>
                  </div>

                  {/* Recommendation (Unlocked) */}
                  {step === 'result' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className='flex flex-col gap-4 mt-4'
                    >
                      <div className='p-4 md:p-6 bg-accent/5 rounded-2xl border border-accent/20 text-center'>
                        <h3 className='font-secondary text-[12px] text-accent uppercase tracking-wider mb-1'>
                          Recommended For You
                        </h3>
                        <h4 className='font-primary text-[24px] md:text-[28px] text-primary mb-2'>
                          {recommendation.treatment.name}
                        </h4>
                        <p className='font-secondary text-text/80 text-[14px]'>
                          {recommendation.rationale}
                        </p>
                      </div>

                      <div className='w-full flex flex-col gap-2'>
                        <button
                          onClick={handleBook}
                          className={`relative w-full flex items-center justify-center gap-2 py-3 md:py-4 rounded-full font-secondary text-[15px] font-medium transition-all duration-300 ${
                            isBooking
                              ? 'bg-green-500 text-white scale-95'
                              : 'bg-accent text-white hover:bg-primary hover:scale-[1.02]'
                          }`}
                        >
                          {isBooking ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className='flex items-center gap-2'
                            >
                              <Check size={20} strokeWidth={3} />
                              <span>Confirmed</span>
                            </motion.div>
                          ) : (
                            <>
                              <span>Book this treatment</span>
                              <ArrowUpRight size={18} strokeWidth={2} />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Subcomponent for the animated score number
function ScoreNumber({
  value,
  isUnlocked,
  reducedMotion,
}: {
  value: number;
  isUnlocked: boolean;
  reducedMotion: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isUnlocked) {
      if (reducedMotion) {
        setDisplayValue(value);
      } else {
        const controls = animate(count, value, {
          duration: 0.8,
          ease: 'easeOut',
        });
        return controls.stop;
      }
    } else {
      setDisplayValue(0);
      count.set(0);
    }
  }, [isUnlocked, value, count, reducedMotion]);

  useEffect(() => {
    return rounded.on('change', (v) => setDisplayValue(v));
  }, [rounded]);

  if (!isUnlocked) {
    return (
      <div
        className='relative font-primary text-[80px] md:text-[100px] leading-none text-primary'
        aria-hidden='true'
      >
        <span>{String(value).charAt(0)}</span>
        <span className='blur-[8px] select-none opacity-50 ml-1'>0</span>
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none text-accent drop-shadow-xl'>
          <Lock size={48} strokeWidth={2} />
        </div>
      </div>
    );
  }

  return (
    <div className='font-primary text-[80px] md:text-[100px] leading-none text-primary'>
      {displayValue}
    </div>
  );
}
