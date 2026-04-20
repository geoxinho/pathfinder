'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Inline testimonials data — replace with your CMS/API data
const TESTIMONIALS = [
  {
    id: '1',
    name: 'Mrs. Adewale Funmilayo',
    role: 'Parent · Nursery Class',
    quote:
      'My daughter has blossomed since joining Pathfinder. The care and attention she receives is unmatched. I recommend this school to every parent in Ibadan.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Mr. Babatunde Olatunji',
    role: 'Parent · Secondary Class',
    quote:
      'Pathfinder gave my son a sense of discipline and purpose. He now leads his class and has excelled in multiple national academic competitions.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Miss Chisom Ezeh',
    role: 'Alumni · Class of 2020',
    quote:
      'The foundation I received at Pathfinder prepared me for university better than anything else could. I am forever grateful to every teacher and staff.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Dr. Segun Afolabi',
    role: 'Alumni · Medical Doctor',
    quote:
      'The rigorous academic environment at Pathfinder shaped who I am today. The teachers genuinely cared about our success and future.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const prev = () => {
    setAutoplay(false);
    setDirection(-1);
    setCurrent((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const next = () => {
    setAutoplay(false);
    setDirection(1);
    setCurrent((p) => (p + 1) % TESTIMONIALS.length);
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.97 }),
  };

  return (
    <section ref={ref} className="section-padding bg-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/8 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(rgba(212,175,55,0.6) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-5">
            <Star size={11} className="fill-gold" />
            Testimonials
          </span>
          <h2 className="font-poppins font-black text-white text-3xl md:text-4xl mb-4">
            What Our Community <span className="gradient-text">Says</span>
          </h2>
          <p className="text-white/60 max-w-lg mx-auto text-sm leading-relaxed">
            Hear from parents, students, and alumni who have experienced the Pathfinder difference
            firsthand.
          </p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-5" />
        </motion.div>

        {/* Main Testimonial */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="glass rounded-3xl p-8 md:p-12 text-center relative">
                  {/* Quote icon */}
                  <div className="absolute top-6 left-8 opacity-20">
                    <Quote size={48} className="text-gold fill-gold" />
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                      <Star key={i} size={18} className="text-gold fill-gold" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-white text-lg md:text-xl leading-relaxed font-inter italic mb-8">
                    &ldquo;{TESTIMONIALS[current].quote}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/40 ring-2 ring-gold/20">
                      <img
                        src={TESTIMONIALS[current].image}
                        alt={TESTIMONIALS[current].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-poppins font-bold text-sm">
                        {TESTIMONIALS[current].name}
                      </div>
                      <div className="text-gold/80 text-xs mt-0.5">
                        {TESTIMONIALS[current].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAutoplay(false);
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Thumbnail row */}
        <div className="flex justify-center gap-4 flex-wrap">
          {TESTIMONIALS.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              onClick={() => {
                setAutoplay(false);
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${
                i === current
                  ? 'bg-gold/20 border-gold/40 scale-105'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="text-white text-xs font-semibold leading-tight">
                  {t.name.split(' ')[0]}
                </div>
                <div className="text-white/40 text-xs">{t.role.split(' ')[0]}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}