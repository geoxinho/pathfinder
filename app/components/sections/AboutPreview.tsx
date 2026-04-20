'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, ArrowRight, BookOpen, Heart, Shield, Lightbulb } from 'lucide-react';
import Image from 'next/image';

const values = [
  {
    icon: BookOpen,
    title: 'Academic Excellence',
    desc: 'Rigorous curriculum that prepares students for global opportunities.',
    color: 'text-blue-500 bg-blue-50',
  },
  {
    icon: Heart,
    title: 'Faith & Values',
    desc: 'Grounded in Christian principles that shape character and purpose.',
    color: 'text-rose-500 bg-rose-50',
  },
  {
    icon: Shield,
    title: 'Discipline & Order',
    desc: 'A structured environment that builds responsibility and self-control.',
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Encouraging creative thinking and problem-solving for the modern world.',
    color: 'text-amber-500 bg-amber-50',
  },
];

const highlights = [
  'Accredited by Oyo State Ministry of Education',
  'State-of-the-art STEM laboratories',
  'Qualified and passionate teaching staff',
  'Safe, secure and inspiring campus environment',
  'Holistic development — academics, sports, arts',
  'Strong alumni network across the globe',
];

export default function AboutPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="section-padding-lg bg-light-gray relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-premium h-[400px] lg:h-[560px]">
              <Image
                src="/imgi_4_lib.jpg"
                alt="Students at Pathfinder College"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>

            {/* Floating small image */}
            <div className="absolute -bottom-8 -right-6 w-44 h-44 rounded-2xl overflow-hidden shadow-gold border-4 border-white">
              <Image
                src="/imgi_17_blog3.jpg"
                alt="Classroom activity"
                fill
                className="object-cover"
              />
            </div>

            {/* Floating award card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -top-6 -left-4 glass-white rounded-2xl p-4 shadow-glass-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <div className="font-poppins font-bold text-primary text-sm">Award Winning</div>
                  <div className="text-gray-500 text-xs">Best School, SW Nigeria 2024</div>
                </div>
              </div>
            </motion.div>

            {/* Year badge */}
            <div className="absolute bottom-16 left-6 bg-primary/90 backdrop-blur-sm text-white rounded-2xl px-4 py-3">
              <div className="text-3xl font-poppins font-black text-gold leading-none">1999</div>
              <div className="text-white/70 text-xs mt-0.5">Established</div>
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="section-tag mb-5 inline-flex">
              <Heart size={12} />
              About Pathfinder College
            </span>

            <h2 className="section-title mb-5">
              More Than a School —{' '}
              <span className="gradient-text">A Destination</span>
            </h2>

            <div className="gold-divider mb-6" />

            <p className="text-gray-600 leading-relaxed mb-5 text-[0.95rem]">
              Founded in 1999, Pathfinder College is a premier secondary school located in Samonda,
              Ibadan, Nigeria. We are committed to raising holistic individuals who excel
              academically, morally, and socially — equipped to lead in any sphere of life.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 text-[0.95rem]">
              Our faith-based approach to education, combined with a rigorous academic program and
              vibrant extra-curricular activities, creates an environment where every student
              discovers their unique potential and purpose.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 gap-2.5 mb-8">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-2.5 text-gray-700 text-sm"
                >
                  <CheckCircle size={16} className="text-gold flex-shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>

            <Link href="/about" className="btn-primary inline-flex group">
              Discover Our Story
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <h3 className="font-poppins font-bold text-2xl text-primary mb-2">Our Core Values</h3>
            <p className="text-gray-500 text-sm">The pillars that define our educational philosophy</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                className="premium-card text-center group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${val.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <val.icon size={22} />
                </div>
                <h4 className="font-poppins font-bold text-primary text-sm mb-2">{val.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}