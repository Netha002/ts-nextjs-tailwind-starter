import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-alternate pt-20 pb-10">
      <div className="layout">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6 relative w-[160px] h-[100px]">
              <Image
                src="/images/Ayla-Logo-02.svg"
                alt="Ayla Luxe Dermatology"
                fill
                className="object-contain"
              />
            </Link>
            <p className="font-secondary text-alternate/80 mb-6">
              Ayla Luxe Dermatology is a premium skin, hair and aesthetic clinic in Chennai offering advanced treatments and personalized care.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-alternate/20 flex items-center justify-center hover:bg-accent hover:text-secondary hover:border-accent transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-alternate/20 flex items-center justify-center hover:bg-accent hover:text-secondary hover:border-accent transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-primary text-2xl mb-6">Quick Links</h4>
            <ul className="space-y-4 font-secondary text-alternate/80">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/#about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/#services" className="hover:text-accent transition-colors">Our Services</Link></li>
              <li><Link href="/treatments" className="hover:text-accent transition-colors">Treatments</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-primary text-2xl mb-6">Contact Us</h4>
            <ul className="space-y-6 font-secondary text-alternate/80">
              <li className="flex gap-4 items-start">
                <MapPin className="text-accent shrink-0 mt-1" size={20} />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone className="text-accent shrink-0" size={20} />
                <a href="tel:8055855585" className="hover:text-accent transition-colors">8055855585</a>
              </li>
              <li className="flex gap-4 items-center">
                <Mail className="text-accent shrink-0" size={20} />
                <a href="mailto:info@aylaluxedermatology.com" className="hover:text-accent transition-colors">info@aylaluxedermatology.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-alternate/20 flex flex-col md:flex-row justify-between items-center gap-4 font-secondary text-sm text-alternate/60">
          <p>© {new Date().getFullYear()} Ayla Luxe Dermatology. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
