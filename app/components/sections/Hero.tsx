"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Award, Users, Play, MousePointer2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const floatingBadges = [
  { icon: Star, text: "Great School", sub: "Since 2010", color: "from-gold to-yellow-500", delay: 0 },
  { icon: Award, text: "16+ Years", sub: "Experience", color: "from-blue-500 to-indigo-500", delay: 0.2 },
  { icon: Users, text: "500+", sub: "Students", color: "from-emerald-500 to-teal-500", delay: 0.4 },
];

const words = ["Excellence", "Purpose", "Faith", "Leadership"];

export default function Hero() {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[100dvh] flex items-center overflow-hidden bg-black">
      {/* Background — Sticky effect constrained to the section */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="md:sticky top-0 h-full md:h-screen w-full transition-transform duration-700 ease-out scale-105">
          <Image
            src="/hero_image.png"
            alt="Pathfinder College Campus"
            fill
            priority
            quality={80}
            className="object-cover object-center w-full h-full opacity-80"
            sizes="100vw"
          />
          {/* Multi-layered Overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-black/40 to-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />
          
          {/* Animated Particles/Orbs */}
          <div className="absolute inset-0 z-20 opacity-30">
            <motion.div 
              animate={{ 
                x: [0, 100, 0], 
                y: [0, -50, 0],
                scale: [1, 1.2, 1] 
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[120px]"
            />
            <motion.div 
              animate={{ 
                x: [0, -120, 0], 
                y: [0, 80, 0],
                scale: [1, 1.3, 1] 
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]"
            />
          </div>
        </div>
      </div>

      {/* Floating Badges — desktop only with enhanced glassmorphism */}
      <div className="absolute right-12 lg:right-20 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-6">
        {floatingBadges.map((badge, i) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -10, scale: 1.05 }}
            transition={{ delay: 0.8 + badge.delay, duration: 0.6, type: "spring" }}
            className="glass-dark rounded-3xl p-4 flex items-center gap-4 min-w-[200px] border border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20`}>
              <badge.icon size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-poppins font-bold text-base tracking-tight">{badge.text}</div>
              <div className="text-white/50 text-xs font-medium uppercase tracking-wider">{badge.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-30 container-custom w-full pt-20 md:pt-0">
        <div className="max-w-4xl">
          {/* Premium Tagline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full mb-8"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold"></span>
            </span>
            <span className="text-white/80 font-poppins font-medium text-[11px] tracking-[0.2em] uppercase">
              Est. 2010 — Ibadan's Leading Institution
            </span>
          </motion.div>

          {/* Dynamic Headline */}
          <h1
            className="font-poppins font-black text-white leading-[1.05] mb-8"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="block"
            >
              Raising Future
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="gradient-text-gold inline-block mr-4"
            >
              Leaders
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block"
            >
              Through
            </motion.span>
            <br />
            <div className="relative h-[1.2em] overflow-hidden mt-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 40, skewY: 5 }}
                  animate={{ opacity: 1, y: 0, skewY: 0 }}
                  exit={{ opacity: 0, y: -40, skewY: -5 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="gradient-text inline-block italic font-serif tracking-tight"
                >
                  {words[currentWord]}.
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>

          {/* Narrative Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl font-inter font-light"
          >
            A sanctuary of academic excellence where faith, discipline, and innovation 
            converge to sculpt the visionary minds of tomorrow.
          </motion.p>

          {/* Captivating CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-5"
          >
            <Link href="/admissions" className="btn-primary-gold group w-full sm:w-auto px-10 py-5 rounded-2xl flex items-center justify-center gap-3 text-lg">
              Apply Now — {new Date().getFullYear()} / {new Date().getFullYear()+1}
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            
            {/* <button className="flex items-center gap-4 text-white/90 font-poppins font-semibold hover:text-gold transition-colors group px-6 py-4">
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-gold/50 transition-all bg-white/5 backdrop-blur-sm">
                <Play size={20} fill="currentColor" className="ml-1 text-gold" />
              </div>
              <span className="text-base tracking-wide">Tour our Campus</span>
            </button> */}
          </motion.div>
        </div>
      </div>

      {/* Scroll Hint */}
      {/* <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[10px] font-poppins tracking-[0.3em] uppercase">Scroll to Discover</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold/50 to-transparent animate-bounce-slow" />
      </motion.div> */}
      
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 right-0 p-8 z-30 opacity-20 pointer-events-none hidden md:block">
        <MousePointer2 size={120} className="text-gold rotate-12" />
      </div>
    </section>
  );
}
