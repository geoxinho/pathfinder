'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import Image from 'next/image';

export default function DirectorMessage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="section-padding bg-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/4 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/6 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        {/* Decorative quote marks */}
        <div
          className="absolute top-10 right-10 text-[12rem] font-serif text-primary/5 leading-none select-none pointer-events-none hidden lg:block"
          aria-hidden="true"
        >
          &ldquo;
        </div>
      </div>

      <div className="container-custom relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-tag mb-4 inline-flex">
            <Star size={12} />
            Leadership
          </span>
          <h2 className="section-title mb-4">
            Message from Our <span className="gradient-text">Director</span>
          </h2>
          <div className="gold-divider mx-auto mt-5" />
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-premium overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Director photo — left column */}
              <div className="lg:col-span-2 relative min-h-[320px] lg:min-h-[480px] bg-primary overflow-hidden">
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 " />

                {/* Director portrait */}
                <Image
                  src="/imgi_3_director.png"
                  alt="School Director"
                  fill
                  className="object-cover object-top opacity-60"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />

                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
                  <div className="w-12 h-0.5 bg-gold mb-4" />
                  <p className="font-poppins font-black text-white text-xl leading-tight">
                    Evangelist (Mrs) Toun Soetan
                  </p>
                  <p className="text-gold text-sm font-poppins font-semibold mt-1">
                    Founder &amp; Director
                  </p>
                  <p className="text-white/60 text-xs mt-1">Pathfinder College, Ibadan</p>

                  {/* Stars */}
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="text-gold fill-gold"
                      />
                    ))}
                  </div>
                </div>

                {/* Quote icon top-right */}
                <div className="absolute top-6 right-6 z-20 w-12 h-12 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center">
                  <Quote size={20} className="text-gold" />
                </div>
              </div>

              {/* Message content — right column */}
              <div className="lg:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                {/* Large decorative quote */}
                <Quote
                  size={48}
                  className="text-gold/20 mb-6 fill-gold/10"
                />

                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 font-inter italic"
                >
                  &ldquo;At Pathfinder College, we believe that every child carries within them an
                  extraordinary spark — a unique God-given potential waiting to be discovered and
                  nurtured. Our mission is not merely to educate minds, but to shape character,
                  instil values, and raise a generation of purposeful leaders who will transform
                  their communities and our nation.&rdquo;
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="text-gray-500 text-sm leading-relaxed mb-8"
                >
                  From our Creche through Senior Secondary, every level of our programme is
                  intentionally designed to challenge students academically, strengthen them
                  spiritually, and empower them with 21st-century skills. We partner with parents
                  because together — school and home — we can produce truly exceptional young people.
                </motion.p>

                {/* Key values */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100"
                >
                  {[
                    { value: 'Excellence', icon: '🏆' },
                    { value: 'Character', icon: '❤️' },
                    { value: 'Purpose', icon: '🌟' },
                  ].map((item) => (
                    <div key={item.value} className="text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="text-primary font-poppins font-bold text-xs">{item.value}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
