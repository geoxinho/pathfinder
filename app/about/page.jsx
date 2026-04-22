"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Heart,
  BookOpen,
  Shield,
  Lightbulb,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SchoolAnthem from "@/components/sections/SchoolAnthem";

const values = [
  {
    icon: BookOpen,
    title: "Academic Excellence",
    desc: "Rigorous curriculum that prepares students for global opportunities.",
    color: "text-blue-500 bg-blue-50",
  },
  {
    icon: Heart,
    title: "Faith & Values",
    desc: "Grounded in Christian principles that shape character and purpose.",
    color: "text-rose-500 bg-rose-50",
  },
  {
    icon: Shield,
    title: "Discipline & Order",
    desc: "A structured environment that builds responsibility and self-control.",
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Encouraging creative thinking and problem-solving for the modern world.",
    color: "text-amber-500 bg-amber-50",
  },
];

const milestones = [
  {
    year: "1999",
    title: "Foundation of Pathfinder",
    desc: "Pathfinder College opens its doors, welcoming its first cohort of students with a commitment to quality education.",
    featured: true,
  },
  {
    year: "2008",
    title: "Secondary School Launch",
    desc: "Pathfinder College expands to include secondary education, becoming a full cradle-to-graduation institution.",
  },
  {
    year: "2015",
    title: "Campus Expansion",
    desc: "New classrooms, a library, and a sports facility added to serve our growing student community.",
  },
  {
    year: "2024",
    title: "Digital Admission Launch",
    desc: "Parents can now apply, pay, and submit admission forms entirely online — a first for schools in our community.",
    highlight: true,
  },
];

export default function AboutPage() {
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
                <Heart size={12} /> About Us
              </span>
              <h1 className="font-poppins font-black text-white text-4xl md:text-5xl mb-4 leading-tight">
                Cultivating the{" "}
                <span className="gradient-text">Next Generation</span>
              </h1>
              <p className="text-white/70 text-base leading-relaxed max-w-lg">
                At Pathfinder College, we don&apos;t just teach students — we
                nurture curious minds into the leaders of tomorrow through a
                tradition of academic excellence and holistic development.
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
                  src="/imgi_17_blog3.jpg"
                  alt="Pathfinder College Campus"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
              <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm text-white rounded-2xl px-4 py-3">
                <div className="text-3xl font-poppins font-black text-gold leading-none">
                  1999
                </div>
                <div className="text-white/70 text-xs mt-0.5">Established</div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60L1440 60L1440 30C1200 60 960 70 720 60C480 50 240 20 0 30L0 60Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Heritage */}
      <section id="story" ref={ref} className="section-padding bg-light-gray">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl overflow-hidden h-80 shadow-premium"
            >
              <Image
                src="/imgi_17_blog3.jpg"
                alt="Students at Pathfinder College"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="section-tag mb-5 inline-flex">
                <BookOpen size={12} /> Our Heritage
              </span>
              <h2 className="section-title mb-5">
                A Legacy of <span className="gradient-text">Excellence</span>
              </h2>
              <div className="gold-divider mb-6" />
              <p className="text-gray-600 leading-relaxed mb-4 text-[0.95rem]">
                Founded with a vision to bridge the gap between quality
                education and the needs of every Nigerian child, Pathfinder
                College has grown into a prestigious institution serving
                families across Ibadan and beyond.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4 text-[0.95rem]">
                What started as a small school with a handful of eager scholars
                has transformed into a thriving educational community —
                surviving challenges, embracing change, and maintaining its core
                commitment to excellence at every level.
              </p>
              <p className="text-gray-600 leading-relaxed text-[0.95rem]">
                Every corner of our campus tells a story of perseverance,
                growth, and the unwavering belief that every child deserves the
                best possible foundation in life.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section id="mission" className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="section-tag mb-4 inline-flex">
              <Shield size={12} /> Foundation of Purpose
            </span>
            <h2 className="section-title mb-4">
              Our Core <span className="gradient-text">Values</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              The pillars that define our educational philosophy
            </p>
            <div className="gold-divider mx-auto mt-5" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="premium-card text-center group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${val.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <val.icon size={22} />
                </div>
                <h3 className="font-poppins font-bold text-primary text-sm mb-2">
                  {val.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-padding bg-light-gray">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-tag mb-4 inline-flex">🏆 Milestones</span>
            <h2 className="section-title mb-4">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <div className="gold-divider mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="bg-primary text-white rounded-3xl p-8 md:row-span-2 flex flex-col justify-end"
            >
              <p className="text-5xl font-poppins font-black text-gold mb-2">
                1999
              </p>
              <p className="font-poppins font-bold text-lg mb-2">
                Foundation of Pathfinder
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                Pathfinder College opens its doors, welcoming its first cohort
                of students with a commitment to quality education for all.
              </p>
            </motion.div>
            {milestones
              .filter((m) => !m.featured)
              .map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                  className={`rounded-3xl p-6 ${m.highlight ? "bg-gradient-to-br from-gold to-gold-light" : "premium-card"}`}
                >
                  <p
                    className={`text-3xl font-poppins font-black mb-1 ${m.highlight ? "text-primary" : "text-primary"}`}
                  >
                    {m.year}
                  </p>
                  <p
                    className={`font-poppins font-semibold mb-2 ${m.highlight ? "text-primary" : "text-gray-700"}`}
                  >
                    {m.title}
                  </p>
                  <p
                    className={`text-xs leading-relaxed ${m.highlight ? "text-primary/70" : "text-gray-500"}`}
                  >
                    {m.desc}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section id="leadership" className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl overflow-hidden h-80 shadow-premium bg-gray-100 flex items-center justify-center"
            >
              <Image
                src="/imgi_17_blog3.jpg"
                alt="The Principal"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="section-tag mb-5 inline-flex">
                💬 Principal&apos;s Message
              </span>
              <h2 className="section-title mb-6">
                A Word from <span className="gradient-text">Our Leader</span>
              </h2>
              <blockquote className="text-gray-600 italic leading-relaxed mb-4 border-l-4 border-gold/30 pl-5 text-[0.95rem]">
                &ldquo;Welcome to Pathfinder College. Here, we believe that
                education is not just the filling of a bucket, but the lighting
                of a fire. Our heritage is one of purpose, perseverance, and
                pride.&rdquo;
              </blockquote>
              <blockquote className="text-gray-600 italic leading-relaxed mb-6 border-l-4 border-primary/20 pl-5 text-[0.95rem]">
                &ldquo;As you walk through our halls, you will find a vibrant
                community dedicated to the pursuit of truth and the development
                of character. We invite you to be part of our story.&rdquo;
              </blockquote>
              <div>
                <p className="font-poppins font-bold text-primary">
                  The Principal
                </p>
                <p className="text-sm text-gray-500">
                  Principal & Chief Academic Officer, Pathfinder College
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* School Anthem */}
      <SchoolAnthem />

      {/* CTA */}
      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="font-poppins font-black text-white text-3xl md:text-4xl mb-4">
            Ready to Join the{" "}
            <span className="gradient-text">Pathfinder Family</span>?
          </h2>
          <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
            Apply online today and secure your child&apos;s future at one of
            Ibadan&apos;s most prestigious schools.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/admissions/junior"
              className="btn-primary text-sm px-6 py-3"
            >
              Junior Admission — ₦30,000
            </Link>
            <Link
              href="/admissions/senior"
              className="btn-secondary text-sm px-6 py-3"
            >
              Senior Admission — ₦50,000
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
