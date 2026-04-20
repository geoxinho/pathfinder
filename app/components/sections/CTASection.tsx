'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Phone, Download, MapPin } from 'lucide-react';

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="section-padding bg-light-gray relative overflow-hidden">
      <div className="container-custom">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-primary via-primary-light to-primary rounded-4xl overflow-hidden p-10 md:p-16 text-center mb-8"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(rgba(212,175,55,0.8) 1.5px, transparent 1.5px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-gold/30 rounded-tl-4xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-gold/30 rounded-br-4xl" />
          </div>

          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Admissions Now Open — 2025/2026
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-poppins font-black text-white text-3xl md:text-5xl mb-4 leading-tight"
            >
              Give Your Child the <span className="gradient-text">Best Start</span>
              <br />
              in Life
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
            >
              Join thousands of parents who have entrusted their children&apos;s future to
              Pathfinder College. Applications are open for JSS1 and SSS1 entry.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/admissions" className="btn-primary group text-base px-8 py-4">
                Apply Online Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#" download className="btn-secondary group text-base px-8 py-4">
                <Download size={18} />
                Download Prospectus
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-white/10"
            >
              {[
                { label: 'Accredited School', icon: '✅' },
                { label: 'Safe Environment', icon: '🔒' },
                { label: 'Faith-Based', icon: '✝️' },
                { label: 'WAEC Registered', icon: '📜' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/60 text-sm">
                  <span>{item.icon}</span>
                  <span className="font-poppins">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom three cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Phone,
              title: 'Talk to Admissions',
              desc: 'Speak directly with our admissions team for personalized guidance.',
              cta: 'Call Now',
              href: 'tel:+2348012345678',
              color: 'text-blue-500 bg-blue-50',
            },
            {
              icon: MapPin,
              title: 'Book a Campus Visit',
              desc: 'Tour our facilities and experience Pathfinder first-hand.',
              cta: 'Schedule Visit',
              href: '/contact',
              color: 'text-gold bg-gold/10',
            },
            {
              icon: Download,
              title: 'Get the Prospectus',
              desc: 'Download our comprehensive school prospectus for full details.',
              cta: 'Download PDF',
              href: '#',
              color: 'text-emerald-500 bg-emerald-50',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="premium-card flex items-start gap-4 group"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
              >
                <card.icon size={22} />
              </div>
              <div className="flex-1">
                <h4 className="font-poppins font-bold text-primary text-sm mb-1">{card.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{card.desc}</p>
                <Link
                  href={card.href}
                  className="flex items-center gap-1.5 text-primary font-poppins font-semibold text-xs hover:gap-2.5 transition-all"
                >
                  {card.cta}
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}