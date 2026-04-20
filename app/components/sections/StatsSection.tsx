"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Star,
  Award,
} from "lucide-react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const stats: StatItem[] = [
  {
    value: 1200,
    suffix: "+",
    label: "Students Enrolled",
    icon: Users,
    description: "Active students across all levels",
    color: "from-blue-500 to-blue-400",
  },
  {
    value: 25,
    suffix: "+",
    label: "Years of Excellence",
    icon: Star,
    description: "Decades of academic distinction",
    color: "from-gold to-gold-light",
  },
  {
    value: 98,
    suffix: "%",
    label: "Pass Rate",
    icon: Trophy,
    description: "WAEC & NECO combined results",
    color: "from-emerald-500 to-emerald-400",
  },
  // {
  //   value: 85,
  //   suffix: "+",
  //   label: "Qualified Staff",
  //   icon: GraduationCap,
  //   description: "Expert, certified educators",
  //   color: "from-purple-500 to-purple-400",
  // },
  {
    value: 5000,
    suffix: "+",
    label: "Alumni Worldwide",
    icon: Award,
    description: "Making an impact globally",
    color: "from-rose-500 to-rose-400",
  },
  // {
  //   value: 30,
  //   suffix: '+',
  //   label: 'Clubs & Activities',
  //   icon: BookOpen,
  //   description: 'Extra-curricular opportunities',
  //   color: 'from-amber-500 to-amber-400',
  // },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = value / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/3 rounded-full -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/5 rounded-full translate-y-1/2 blur-3xl" />
      </div>

      <div className="container-custom relative z-10 ">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-tag mb-4 inline-flex">
            <Trophy size={12} />
            Our Achievements
          </span>
          <h2 className="section-title mb-4">
            Excellence in <span className="gradient-text">Numbers</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Our track record speaks for itself — years of consistent academic
            excellence, student growth, and community impact.
          </p>
          <div className="gold-divider mx-auto mt-5" />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              className="premium-card text-center group cursor-default stat-card mx-auto justify-center content-center"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon size={22} className="text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-poppins font-black text-primary mb-1 leading-none">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-poppins font-semibold text-gray-800 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-400 leading-snug">
                {stat.description}
              </div>
              <div
                className={`h-0.5 bg-gradient-to-r ${stat.color} rounded-full mt-4 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-14 bg-gradient-to-r from-primary via-primary-light to-primary rounded-3xl p-8 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-0 top-0 w-48 h-48 bg-gold/10 rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/4 -translate-x-1/4" />
          </div>
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-poppins uppercase tracking-widest mb-2">
              Join the Pathfinder Family
            </p>
            <h3 className="text-white font-poppins font-bold text-2xl md:text-3xl mb-4">
              Be Part of Our Growing Legacy
            </h3>
            <p className="text-white/60 mb-6 max-w-lg mx-auto text-sm">
              Applications for the 2025/2026 academic session are now open.
              Secure your child&apos;s future at Pathfinder College.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/admissions" className="btn-primary text-sm px-6 py-3">
                Start Application
              </a>
              <a href="/contact" className="btn-secondary text-sm px-6 py-3">
                Contact
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
