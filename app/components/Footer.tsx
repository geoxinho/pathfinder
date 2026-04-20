import Link from 'next/link';
import { Phone, Mail, MapPin, Globe, X, Camera, Video } from 'lucide-react';
import Image from 'next/image';

const footerLinks = {
  'Quick Links': [
    { label: 'About Us', href: '/about' },
    { label: 'Academics', href: '/academics' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog & News', href: '/blog' },
    { label: 'Events', href: '/events' },
    { label: 'Contact Us', href: '/contact' },
  ],
  'Admissions': [
    { label: 'Junior School (Creche–Pri 5)', href: '/admissions/junior' },
    { label: 'Senior School (JSS 1–SS3)', href: '/admissions/senior' },
    { label: 'Fees & Payment', href: '/admissions#fees' },
    { label: 'Requirements', href: '/admissions#requirements' },
    { label: 'Apply Online', href: '/admissions' },
  ],
  'Academics': [
    { label: 'Primary Programme (Creche–Pri 5)', href: '/academics#junior' },
    { label: 'Secondary Programme (JSS 1–SS3)', href: '/academics#senior' },
    { label: 'WAEC Preparation', href: '/academics#waec' },
    { label: 'Science Labs', href: '/academics#facilities' },
    { label: 'Extra-Curriculars', href: '/academics#extra' },
  ],
};

const socials = [
  { icon: Globe, href: '#', label: 'Facebook' },
  { icon: X, href: '#', label: 'Twitter' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: Video, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              {/* <div className="w-11 h-11 rounded-xl bg-gold flex items-center justify-center shadow-md">
                <span className="text-primary font-poppins font-black text-xl leading-none">P</span>
              </div>
              <div>
                <div className="font-poppins font-black text-base text-white leading-tight">
                  Pathfinder College
                </div>
                <div className="text-gold text-xs">Samonda, Ibadan</div>
              </div> */}
              <Image src="/white_logo.png" alt="Pathfinder College" width={200} height={80} />
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              A premier faith-based secondary school in Samonda, Ibadan, raising future leaders
              through academic excellence, character, and purpose.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-6">
              <a
                href="tel:+2348012345678"
                className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} />
                </div>
                +234 801 234 5678
              </a>
              <a
                href="mailto:info@pathfindercollege.edu.ng"
                className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} />
                </div>
                info@pathfindercollege.edu.ng
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                Samonda Area, Ibadan, Oyo State, Nigeria
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-gold/80 flex items-center justify-center transition-colors group"
                >
                  <s.icon size={16} className="text-white/70 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-poppins font-bold text-white text-sm mb-4 pb-2 border-b border-white/10">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-gold text-sm transition-colors font-inter"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs font-inter">
            © {new Date().getFullYear()} Pathfinder College, Ibadan. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-white/40 hover:text-white/70 text-xs transition-colors">
             Design By George 
            </Link>
            
          </div>
        </div>
      </div>
    </footer>
  );
}