export type TreatmentCategory = 'Skin' | 'Hair' | 'Aesthetics';

export interface TreatmentData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: TreatmentCategory;
  beforeAfterPair?: {
    beforeImage: string;
    afterImage: string;
    caption?: string;
  };
}

// WARNING: Placeholder images used for Before/Afters. 
// MUST be replaced with real, consent-approved patient photos before launch.
export const treatments: TreatmentData[] = [
  {
    id: 't-01',
    name: 'Acne Clear Peel',
    slug: 'acne-clear-peel',
    category: 'Skin',
    shortDescription: 'Advanced chemical exfoliation targeting active acne and residual scarring.',
    fullDescription: 'Our signature Acne Clear Peel uses a proprietary blend of salicylic and mandelic acids to dive deep into pores, dissolving sebum and neutralizing acne-causing bacteria. This medical-grade treatment reduces inflammation, prevents future breakouts, and accelerates the fading of post-inflammatory hyperpigmentation.',
    beforeAfterPair: {
      beforeImage: '/images/luxury-woman-face.jpg',
      afterImage: '/images/young-woman-skin-care-model-2-scaled.jpg',
      caption: 'Results after 3 sessions of Acne Clear Peel'
    }
  },
  {
    id: 't-02',
    name: 'Anti-Aging Resurfacing',
    slug: 'anti-aging-resurfacing',
    category: 'Aesthetics',
    shortDescription: 'Laser resurfacing to smooth fine lines and restore youthful collagen production.',
    fullDescription: 'Utilizing state-of-the-art fractional laser technology, this treatment creates micro-injuries in the dermis to trigger your bodys natural healing response. The result is a surge in collagen and elastin production, effectively erasing fine lines, tightening loose skin, and restoring a youthful, luminous glow.',
    beforeAfterPair: {
      beforeImage: '/images/Screenshot-2026-03-13-100436.webp',
      afterImage: '/images/luxury-woman-face.jpg',
      caption: 'Before and 6 weeks post-treatment'
    }
  },
  {
    id: 't-03',
    name: 'Pigmentation Corrector',
    slug: 'pigmentation-corrector',
    category: 'Skin',
    shortDescription: 'Targeted laser therapy to break down melasma, sun spots, and uneven skin tone.',
    fullDescription: 'A highly customized laser and topical protocol designed to shatter excess melanin in the skin. Perfect for treating sun damage, age spots, and stubborn melasma, leaving you with an incredibly even and radiant complexion without extensive downtime.',
    beforeAfterPair: {
      beforeImage: '/images/young-woman-skin-care-model-2-scaled.jpg',
      afterImage: '/images/Screenshot-2026-03-13-100436.webp',
      caption: 'Significant reduction in sun damage after 2 sessions'
    }
  },
  {
    id: 't-04',
    name: 'PRP Hair Restoration',
    slug: 'prp-hair-restoration',
    category: 'Hair',
    shortDescription: 'Platelet-Rich Plasma therapy to stimulate dormant follicles and thicken hair.',
    fullDescription: 'Harnessing the regenerative power of your own blood, PRP therapy isolates concentrated growth factors and injects them directly into the scalp. This scientifically proven method awakens dormant hair follicles, increases blood supply, and significantly thickens hair density over a series of treatments.',
    beforeAfterPair: {
      beforeImage: '/images/luxury-woman-face.jpg',
      afterImage: '/images/Screenshot-2026-03-13-100436.webp',
      caption: 'Hair density improvement after 4 PRP sessions'
    }
  },
  {
    id: 't-05',
    name: 'pH5 Signature Glow',
    slug: 'ph5-signature-glow',
    category: 'Aesthetics',
    shortDescription: 'Our ultimate red-carpet facial combining dermaplaning, hydration, and LED therapy.',
    fullDescription: 'The pinnacle of luxury skincare. This comprehensive treatment begins with gentle dermaplaning to remove peach fuzz and dead cells, followed by a deeply hydrating customized serum infusion, and finishes with medical-grade LED light therapy to calm the skin and seal in a radiant, glass-skin glow.',
  }
];

export function getTreatmentBySlug(slug: string): TreatmentData | undefined {
  return treatments.find(t => t.slug === slug);
}
