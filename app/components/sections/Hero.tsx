"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Award, Users } from "lucide-react";

const floatingBadges = [
  { icon: Star, text: "Best School", sub: "Ibadan 2024", color: "from-gold to-gold-light", delay: 0 },
  { icon: Award, text: "98% Pass Rate", sub: "WAEC/NECO", color: "from-primary to-primary-light", delay: 0.2 },
  { icon: Users, text: "1,200+", sub: "Students", color: "from-emerald-500 to-emerald-400", delay: 0.4 },
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

  return (
    <section className="relative min-h-[600px] md:h-screen flex items-center overflow-hidden">
      {/* Background — Next.js Image with priority for optimal LCP */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Hero.jpg"
          alt="Pathfinder College Campus"
          fill
          priority
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIhAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Amm1pvKlttJDSVFJIQ2CokqJJJJJJyfc1qWxbbK2whDaEpSlISkDYAAAAAflKVf/Z"
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      </div>

      {/* Floating Badges — desktop only */}
      <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-10 hidden xl:flex flex-col gap-4">
        {floatingBadges.map((badge) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 + badge.delay, duration: 0.5 }}
            className="glass rounded-2xl p-3.5 flex items-center gap-3 min-w-[160px]"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <badge.icon size={18} className="text-white" />
            </div>
            <div>
              <div className="text-white font-poppins font-bold text-sm">{badge.text}</div>
              <div className="text-white/60 text-xs">{badge.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container-custom w-full pt-24 md:pt-32 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl"
        >
          {/* Tag */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 text-gold font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full mt-20">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Pathfinder College
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-poppins font-black text-white leading-[1.1] mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Raising Future{" "}
            <span className="gradient-text">Leaders</span>
            <br />
            Through{" "}
            <span className="relative inline-block min-w-[260px]">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="gradient-text inline-block"
              >
                {words[currentWord]}
              </motion.span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-xl font-inter">
            A premier faith-based institution in Ibadan, where academic
            brilliance meets character formation. We don&apos;t just educate —
            we shape destiny.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/admissions" className="btn-primary group text-base px-7 py-4 md:mb-20">
              Apply Now — {new Date().getFullYear()} /{" "}
              {new Date().getFullYear() + 1}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80L1440 80L1440 40C1200 80 960 100 720 80C480 60 240 20 0 40L0 80Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
