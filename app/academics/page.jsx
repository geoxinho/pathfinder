'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, FlaskConical, Monitor, Library, Dumbbell, ArrowRight, CheckCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const juniorHighlights = [
  'Nigeria UBE-aligned primary curriculum',
  'Dedicated class teachers for each level',
  'Phonics, literacy & early numeracy focus',
  'Creative Arts, Music & co-curricular clubs',
  'Regular parent-teacher conferences',
  'Character & moral development',
];

const seniorHighlights = [
  'BECE, WAEC & NECO exam preparation',
  'Science, Arts & Commercial streams (SS)',
  'Advanced laboratory facilities',
  'Career guidance & counselling',
  'University admission coaching (UTME/DE)',
  'Leadership & entrepreneurship programs',
];

const facilities = [
  {
    icon: FlaskConical,
    title: 'Science Laboratories',
    desc: 'Fully equipped Physics, Chemistry, and Biology labs with modern apparatus for hands-on experiments.',
    color: 'text-blue-500 bg-blue-50',
  },
  {
    icon: Monitor,
    title: 'ICT Centre',
    desc: 'A modern computer laboratory with high-speed internet, enabling students to develop essential digital skills.',
    color: 'text-teal-500 bg-teal-50',
  },
  {
    icon: Library,
    title: 'Library & Resource Centre',
    desc: 'A comprehensive library with thousands of titles spanning academics, fiction, and reference materials.',
    color: 'text-amber-500 bg-amber-50',
  },
  {
    icon: Dumbbell,
    title: 'Sports Complex',
    desc: 'Football pitch, basketball court, table tennis, and track facilities for inter-house and inter-school competitions.',
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    icon: Users,
    title: 'Assembly Hall',
    desc: 'A spacious, well-ventilated hall used for assemblies, examinations, drama productions, and special events.',
    color: 'text-purple-500 bg-purple-50',
  },
  {
    icon: BookOpen,
    title: 'Classrooms',
    desc: 'Bright, well-furnished classrooms with whiteboards and projectors, designed for an optimal learning environment.',
    color: 'text-rose-500 bg-rose-50',
  },
];

/* ── Facilities Carousel ── */
const VISIBLE = { base: 1, md: 2, lg: 3 };

function FacilitiesCarousel() {
  const [index, setIndex]     = useState(0);
  const [perPage, setPerPage] = useState(VISIBLE.lg);
  const [dir, setDir]         = useState(1);   // 1 = forward, -1 = backward
  const [paused, setPaused]   = useState(false);
  const dragStart              = useRef(null);

  /* update perPage on resize */
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768)       setPerPage(VISIBLE.base);
      else if (window.innerWidth < 1024) setPerPage(VISIBLE.md);
      else                               setPerPage(VISIBLE.lg);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const totalSlides = Math.ceil(facilities.length / perPage);
  const clamp = (n) => ((n % totalSlides) + totalSlides) % totalSlides;

  const go = useCallback((direction) => {
    setDir(direction);
    setIndex((prev) => clamp(prev + direction));
  }, [totalSlides]);

  /* auto-play */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 4000);
    return () => clearInterval(id);
  }, [go, paused]);

  /* drag / swipe */
  const onDragStart = (e) => {
    dragStart.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  };
  const onDragEnd = (e) => {
    if (dragStart.current === null) return;
    const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStart.current - endX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
    dragStart.current = null;
  };

  const variants = {
    enter:  (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0, scale: 0.96 }),
    center: {         x: 0,          opacity: 1, scale: 1    },
    exit:   (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0, scale: 0.96 }),
  };

  const slide = facilities.slice(index * perPage, index * perPage + perPage);
  /* pad last slide if needed */
  const padded = [...slide, ...Array(perPage - slide.length).fill(null)];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide track */}
      <div
        className="relative"
        style={{ minHeight: 230 }}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
      >
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.44, ease: [0.4, 0, 0.2, 1] }}
            className={`grid gap-6 ${
              perPage === 3 ? 'grid-cols-3' :
              perPage === 2 ? 'grid-cols-2' :
              'grid-cols-1'
            }`}
          >
            {padded.map((facility, i) =>
              facility ? (
                <motion.div
                  key={facility.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.06 * i }}
                  className="premium-card group select-none cursor-grab active:cursor-grabbing"
                >
                  <div className={`w-12 h-12 rounded-2xl ${facility.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <facility.icon size={22} />
                  </div>
                  <h3 className="font-poppins font-bold text-primary text-sm mb-2">{facility.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{facility.desc}</p>
                </motion.div>
              ) : (
                /* invisible spacer so grid columns stay even */
                <div key={`pad-${i}`} className="premium-card opacity-0 pointer-events-none" />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-5 mt-8">
        {/* Prev */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className="w-10 h-10 rounded-full border-2 border-primary/20 bg-white text-primary flex items-center justify-center
                     hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-6 h-2.5 bg-primary'
                  : 'w-2.5 h-2.5 bg-primary/25 hover:bg-primary/50'
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className="w-10 h-10 rounded-full border-2 border-primary/20 bg-white text-primary flex items-center justify-center
                     hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function AcademicsPage() {
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
                <GraduationCap size={12} /> Academics
              </span>
              <h1 className="font-poppins font-black text-white text-4xl md:text-5xl mb-4 leading-tight">
                Building Strong <span className="gradient-text">Academic Foundations</span>
              </h1>
              <p className="text-white/70 text-base leading-relaxed max-w-lg">
                At Pathfinder College, our academic programs are designed to challenge, inspire,
                and prepare every student for success — from Junior School (Creche–Primary 5) through Senior School (JSS 1–SS3) and beyond.
              </p>
              <div className="w-12 h-0.5 bg-gold mt-6" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden h-72 shadow-premium">
                <Image
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=700&h=400&fit=crop&q=80"
                  alt="Students in classroom"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gold rounded-2xl px-5 py-3 shadow-lg">
                <div className="text-3xl font-poppins font-black text-primary leading-none">Creche – SS3</div>
                <div className="text-primary/70 text-xs mt-0.5">Primary & Secondary Education</div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 70 720 60C480 50 240 20 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Junior School Section */}
      <section id="junior" ref={ref} className="section-padding scroll-mt-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="section-tag mb-5 inline-flex"><BookOpen size={12} /> Primary School</span>
              <h2 className="section-title mb-5">Junior School <span className="gradient-text">(Creche – Primary 5)</span></h2>
              <div className="gold-divider mb-6" />
              <p className="text-gray-600 leading-relaxed mb-4 text-[0.95rem]">
                Our Junior School (Primary) nurtures every child from Creche through Primary 5 in a
                warm, stimulating environment grounded in the Nigerian Universal Basic Education
                framework. We combine play-based and structured learning to build strong literacy,
                numeracy, and social foundations.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-[0.95rem]">
                Small class sizes ensure every child receives personalised attention, and our dedicated
                class teachers guide pupils through each crucial stage of early childhood and primary education.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {juniorHighlights.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle size={15} className="text-gold flex-shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden h-80 shadow-premium"
            >
              <Image
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=500&fit=crop&q=80"
                alt="Junior school students"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Senior School Section */}
      <section id="senior" className="section-padding bg-light-gray scroll-mt-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl overflow-hidden h-80 shadow-premium order-2 lg:order-1"
            >
              <Image
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&h=500&fit=crop&q=80"
                alt="Senior school students"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <span className="section-tag mb-5 inline-flex"><GraduationCap size={12} /> Secondary School</span>
              <h2 className="section-title mb-5">Senior School <span className="gradient-text">(JSS 1 – SS3)</span></h2>
              <div className="gold-divider mb-6" />
              <p className="text-gray-600 leading-relaxed mb-4 text-[0.95rem]">
                Our Senior School (Secondary) spans JSS 1 through SS3, preparing students for BECE,
                WAEC, NECO, and university entrance with a rigorous, examination-focused curriculum
                across Science, Arts, and Commercial departments.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-[0.95rem]">
                Beyond academics, our secondary students participate in leadership programs, career
                counselling, and entrepreneurship initiatives that equip them with real-world skills
                for life after Pathfinder.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {seniorHighlights.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle size={15} className="text-gold flex-shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="section-padding scroll-mt-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="section-tag mb-4 inline-flex"><FlaskConical size={12} /> Our Campus</span>
            <h2 className="section-title mb-4">World-Class <span className="gradient-text">Facilities</span></h2>
            <p className="section-subtitle mx-auto text-center">
              State-of-the-art infrastructure that supports academic excellence and holistic development
            </p>
            <div className="gold-divider mx-auto mt-5" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FacilitiesCarousel />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="font-poppins font-black text-white text-3xl md:text-4xl mb-4">
            Give Your Child the <span className="gradient-text">Best Start</span>
          </h2>
          <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
            Join the Pathfinder family today. Apply online and secure a place for your child at one of Ibadan&apos;s most prestigious schools.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/admissions/junior" className="btn-primary text-sm px-6 py-3 inline-flex items-center gap-2">
              Junior Admission
              <ArrowRight size={14} />
            </Link>
            <Link href="/admissions/senior" className="btn-secondary text-sm px-6 py-3 inline-flex items-center gap-2">
              Senior Admission
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
