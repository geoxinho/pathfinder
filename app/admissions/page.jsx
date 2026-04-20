'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const paths = [
  {
    icon: '🎒',
    title: 'Junior School Admissions',
    subtitle: 'Creche – Primary 5',
    fee: '₦15,000',
    desc: 'Nurturing every child from Creche through Primary 5. Our Junior School (Primary) curriculum emphasises play-based learning, phonics, numeracy, and whole-child development.',
    highlights: ['Creche, Nursery & Primary 1–5 classes', 'Character & Social Development'],
    href: '/admissions/junior',
    color: 'from-blue-500 to-blue-400',
  },
  {
    icon: '🏆',
    title: 'Senior School Admissions',
    subtitle: 'JSS 1 – SS3',
    fee: '₦20,000',
    desc: 'Comprehensive secondary education from JSS 1 through SS3. Designed for BECE, WAEC, NECO excellence and university readiness across Science, Arts, and Commercial tracks.',
    highlights: ['JSS 1–3 & SS1–SS3 Specialised Streams', 'WAEC/NECO & University Preparation'],
    href: '/admissions/senior',
    color: 'from-gold to-gold-light',
  },
];

const steps = [
  { num: '01', title: 'Payment', desc: 'Securely pay the application fee via our online portal or bank transfer to initiate your registration.' },
  { num: '02', title: 'Form Filling', desc: 'Complete the digital application form with accurate student details and academic records.' },
  { num: '03', title: 'Submission', desc: 'Upload required documents and submit. Our admissions team will contact you for entrance assessments.' },
];

export default function AdmissionsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/8 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
        </div>
        <div className="container-custom relative z-10 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-5">
                <GraduationCap size={12} /> Admissions Open
              </span>
              <h1 className="font-poppins font-black text-white text-4xl md:text-5xl mb-4 leading-tight">
                Join the <span className="gradient-text">Pathfinder</span> Family
              </h1>
              <p className="text-white/70 text-base leading-relaxed max-w-lg mb-8">
                Embark on an educational journey where excellence is nurtured and leadership is forged. Our holistic curriculum prepares students for global challenges in a supportive academic environment.
              </p>
              <Link href="#choose-your-path" className="btn-primary inline-flex group text-sm">
                Start Application
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="w-12 h-0.5 bg-gold mt-8" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="w-56 h-60 bg-gradient-to-br from-primary-light to-primary rounded-3xl flex flex-col items-center justify-center text-white shadow-premium">
                <span className="text-6xl mb-3">🎓</span>
                <span className="font-poppins font-black text-sm tracking-widest text-gold">PATHFINDER</span>
                <span className="text-xs text-white/50 mt-1">COLLEGE</span>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 70 720 60C480 50 240 20 0 30L0 60Z" fill="#f8f9fa" />
          </svg>
        </div>
      </section>

      {/* Choose Your Path */}
      <section id="choose-your-path" ref={ref} className="section-padding bg-light-gray">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="section-tag mb-4 inline-flex"><GraduationCap size={12} /> Admissions</span>
            <h2 className="section-title mb-4">Choose Your <span className="gradient-text">Path</span></h2>
            <p className="section-subtitle mx-auto text-center">Select the appropriate level to begin the enrolment process.</p>
            <div className="gold-divider mx-auto mt-5" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {paths.map((path, i) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="premium-card flex flex-col"
              >
                <div className="flex justify-between items-start mb-5">
                  <span className="text-4xl">{path.icon}</span>
                  <div className="text-right">
                    <p className="text-xs font-poppins font-semibold text-gray-400 uppercase tracking-widest">Application Fee</p>
                    <p className="text-2xl font-poppins font-black text-primary">{path.fee}</p>
                  </div>
                </div>
                <h3 className="font-poppins font-bold text-primary text-xl mb-1">{path.title}</h3>
                <p className="text-gold text-xs font-poppins font-semibold mb-3">{path.subtitle}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{path.desc}</p>
                <ul className="space-y-2 mb-8">
                  {path.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2.5 text-gray-600 text-sm">
                      <CheckCircle size={14} className="text-gold flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link href={path.href} className="btn-primary w-full text-center text-sm py-3.5 mt-auto">
                  Apply Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="section-tag mb-4 inline-flex">📝 Process</span>
            <h2 className="section-title mb-4">How to <span className="gradient-text">Apply</span></h2>
            <p className="section-subtitle">Three simple steps to joining our prestigious academic community.</p>
            <div className="gold-divider mt-5" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center text-primary font-poppins font-black text-sm">
                  {step.num}
                </div>
                <h3 className="font-poppins font-bold text-primary text-lg">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
