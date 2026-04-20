"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  ChevronDown,
  Star,
  Award,
  Users,
} from "lucide-react";
import Image from "next/image";

const floatingBadges = [
  {
    icon: Star,
    text: "Best School",
    sub: "Ibadan 2024",
    color: "from-gold to-gold-light",
    delay: 0,
  },
  {
    icon: Award,
    text: "98% Pass Rate",
    sub: "WAEC/NECO",
    color: "from-primary to-primary-light",
    delay: 0.3,
  },
  {
    icon: Users,
    text: "1,200+",
    sub: "Students",
    color: "from-emerald-500 to-emerald-400",
    delay: 0.6,
  },
];

const words = ["Excellence", "Purpose", "Faith", "Leadership"];

export default function Hero() {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Pathfinder College Campus"
          fill
          priority
          className="object-cover"
        />
        {/* Single light dark overlay — no blue, not too heavy */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Geometric decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 border border-gold/15 rounded-full animate-pulse-ring opacity-40" />
        <div
          className="absolute w-48 h-48 border border-gold/20 rounded-full"
          style={{ top: "10rem", right: "7rem" }}
        />
        <div className="absolute bottom-32 left-10 w-20 h-20 border-2 border-gold/25 rounded-2xl rotate-12 animate-float" />
        <div className="absolute top-1/3 left-8 w-10 h-10 bg-gold/20 rounded-xl rotate-45" />
        <div className="absolute top-1/4 right-1/3 w-6 h-6 bg-gold/30 rounded-full" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Badges */}
      <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-10 hidden xl:flex flex-col gap-4">
        {floatingBadges.map((badge) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + badge.delay, duration: 0.6 }}
            className="glass rounded-2xl p-3.5 flex items-center gap-3 min-w-[160px] hover:-translate-y-1 transition-transform duration-300 cursor-default"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center flex-shrink-0 shadow-md`}
            >
              <badge.icon size={18} className="text-white" />
            </div>
            <div>
              <div className="text-white font-poppins font-bold text-sm">
                {badge.text}
              </div>
              <div className="text-white/60 text-xs">{badge.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content — padded to clear the fixed navbar on all devices */}
      <div className="relative z-10 container-custom w-full pt-24 md:pt-28 lg:pt-32 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Tag */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 text-gold font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Pathfinder College
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-poppins font-black text-white leading-[1.1] mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Raising Future{" "}
            <span className="relative">
              <span className="gradient-text">Leaders</span>
            </span>
            <br />
            Through{" "}
            <span className="relative inline-block min-w-[260px]">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="gradient-text inline-block"
              >
                {words[currentWord]}
              </motion.span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-xl font-inter"
          >
            A premier faith-based institution in Ibadan, where academic
            brilliance meets character formation. We don&apos;t just educate —
            we shape destiny.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link
              href="/admissions"
              className="btn-primary group text-base px-7 py-4"
            >
              Apply Now — {new Date().getFullYear()} /{" "}
              {new Date().getFullYear() + 1}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-6 md:gap-10"
          >
            {[
              { value: "1,200+", label: "Students" },
              { value: "25 Yrs", label: "Excellence" },
              { value: "98%", label: "Pass Rate" },
              { value: "85+", label: "Staff" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-poppins font-black text-white leading-none">
                  {stat.value}
                </span>
                <span className="text-white/50 text-xs mt-1 tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase font-poppins">
          Scroll
        </span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
        <ChevronDown size={16} className="text-white/30 animate-bounce" />
      </motion.div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 80L1440 80L1440 40C1200 80 960 100 720 80C480 60 240 20 0 40L0 80Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
