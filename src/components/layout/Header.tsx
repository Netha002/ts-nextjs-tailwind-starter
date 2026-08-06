'use client';
import { ArrowUpRight,Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/#about' },
  { name: 'Our Services', href: '/#services' },
  { name: 'Treatments', href: '/treatments' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  // Header should be transparent with white text ONLY on the homepage before scrolling
  const isDarkHeader = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background shadow-md py-4' : (isHome ? 'bg-transparent py-8' : 'bg-background py-6')}`}>
      <div className="layout flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative h-[60px] w-[140px] md:h-[80px] md:w-[180px] flex items-center group">
          <svg 
            viewBox="0 0 220 220" 
            className={`w-full h-full transition-all duration-500 drop-shadow-md group-hover:drop-shadow-xl group-hover:scale-105 ${
              isDarkHeader ? 'text-white' : 'text-primary'
            }`} 
            fill="currentColor"
          >
            {/* Oval Ring with gap at bottom */}
            <path d="M 65,173 A 75,85 0 1,1 125,173" fill="none" stroke="currentColor" strokeWidth="2" />
            
            {/* Left Stem (P) */}
            <path d="M 45,35 h 24 v 2 c -6,0 -8,2 -8,6 v 84 c 0,4 2,6 8,6 v 2 h -24 v -2 c 6,0 8,-2 8,-6 v -84 c 0,-4 -2,-6 -8,-6 z" />
            
            {/* Right Stem (H) */}
            <path d="M 95,35 h 24 v 2 c -6,0 -8,2 -8,6 v 84 c 0,4 2,6 8,6 v 2 h -24 v -2 c 6,0 8,-2 8,-6 v -84 c 0,-4 -2,-6 -8,-6 z" />
            
            {/* P Bowl (Skin Layer) */}
            <path d="M 57,40 C 115,40 115,85 57,85" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            
            {/* H Crossbar (Hair Strand) */}
            <path d="M 57,70 C 80,70 80,100 103,100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            
            {/* The Number 5 */}
            <text x="110" y="135" fontFamily="serif" fontSize="78" fontWeight="bold">5</text>
            
            {/* AESTHETICS - sitting in the gap */}
            <text x="95" y="185" fontFamily="sans-serif" fontSize="13" letterSpacing="0.4em" textAnchor="middle" fontWeight="bold">AESTHETICS</text>
          </svg>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-10">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`font-primary text-[18px] italic tracking-wide transition-colors ${!isDarkHeader ? 'text-primary hover:text-secondary' : 'text-white hover:text-white/70'}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <button className={`transition-colors ${!isDarkHeader ? 'text-primary hover:text-secondary' : 'text-white hover:text-white/70'}`}>
            <Search size={22} strokeWidth={1.5} />
          </button>
          <a
            href="tel:8055855585"
            className={`flex items-center gap-2 px-[28px] py-[14px] rounded-[30px] font-secondary text-[14px] font-medium transition-colors ${!isDarkHeader ? 'bg-accent text-secondary hover:bg-primary hover:text-alternate' : 'bg-accent text-white hover:bg-white hover:text-primary'}`}
          >
            <span>Book Appointment</span>
            <ArrowUpRight size={18} strokeWidth={2} />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className={`lg:hidden p-2 ${!isDarkHeader ? 'text-primary' : 'text-white'}`}>
          <Menu size={28} />
        </button>
      </div>
    </header>
  );
}
