'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Music, Music2 } from 'lucide-react';

const anthem = {
  title: 'School Anthem',
  icon: Music,
  lines: [
    'Pathfinder, the citadel of knowledge',
    'Pathfinder, my school',
    'We are pattern unto God\'s moral life',
    'Fountain of knowledge and character',
    'In full stature',
    'A total Nigerian Child',
    'Pathfinder Pathfinder',
    'Leads the way…',
  ],
};

const song = {
  title: 'School Song',
  icon: Music2,
  lines: [
    'Pathfinder, Pathfinder,',
    'We are the Success Model',
    'We are the Peculiar Students',
    'We are the Future Leaders',
    'We are the Future Heroes',
    'In all areas of Life',
    'We are the Best',
  ],
};

const NOTE_POSITIONS = [
  { top: '8%',  left: '4%',  size: 28, delay: 0,    dur: 6   },
  { top: '18%', left: '92%', size: 20, delay: 1.2,  dur: 7.5 },
  { top: '55%', left: '2%',  size: 16, delay: 2.5,  dur: 5.5 },
  { top: '72%', left: '95%', size: 24, delay: 0.8,  dur: 8   },
  { top: '40%', left: '88%', size: 14, delay: 3.1,  dur: 6.5 },
  { top: '85%', left: '10%', size: 18, delay: 1.7,  dur: 7   },
  { top: '30%', left: '50%', size: 12, delay: 4,    dur: 9   },
];

function LyricCard({ data, delay = 0 }: { data: typeof anthem; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const Icon = data.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="relative rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
        border: '1px solid rgba(255,255,255,0.13)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Card glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 0%, rgba(212,175,55,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 px-8 pt-8 pb-5 border-b border-white/10">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.3)' }}
        >
          <Icon size={18} className="text-gold" />
        </div>
        <h3 className="font-poppins font-bold text-white text-lg tracking-wide">
          {data.title}
        </h3>
      </div>

      {/* Lyrics */}
      <div className="px-8 py-7 flex flex-col gap-3 flex-1">
        {data.lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: delay + 0.15 + i * 0.07 }}
            className={`font-poppins leading-relaxed ${
              i === 0
                ? 'text-gold font-semibold text-base'
                : i === data.lines.length - 1
                ? 'text-gold/80 font-semibold text-sm italic'
                : 'text-white/75 text-sm'
            }`}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* Bottom accent */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }} />
    </motion.div>
  );
}

export default function SchoolAnthem() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.3 });

  return (
    <section
      className="relative overflow-hidden section-padding"
      style={{
        background: 'linear-gradient(160deg, #040e26 0%, #071d4a 45%, #0a2a6e 100%)',
      }}
    >
      {/* ── Animated music notes ── */}
      {NOTE_POSITIONS.map((n, i) => (
        <motion.span
          key={i}
          className="absolute select-none pointer-events-none text-gold/20 font-bold"
          style={{ top: n.top, left: n.left, fontSize: n.size }}
          animate={{ y: [0, -18, 0], opacity: [0.18, 0.45, 0.18], rotate: [0, 8, -8, 0] }}
          transition={{ duration: n.dur, delay: n.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          ♪
        </motion.span>
      ))}

      {/* ── Radial glow blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
             style={{ background: 'radial-gradient(circle, rgba(14,83,156,0.35) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
             style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }} />
      </div>

      <div className="container-custom relative z-10">

        {/* ── Heading ── */}
        <div ref={headRef} className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-poppins font-semibold text-xs tracking-widest uppercase mb-5"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
          >
            <Music size={12} />
            Our Identity in Song
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-poppins font-black text-white text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight"
          >
            The Voice of{' '}
            <span
              className="inline-block"
              style={{
                background: 'linear-gradient(90deg, #D4AF37, #f7e08a, #D4AF37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Pathfinder
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed"
          >
            These words echo through our halls — a declaration of purpose, identity, and excellence
            that every Pathfinder student carries in their heart.
          </motion.p>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={headInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mx-auto mt-6"
            style={{
              height: 2,
              width: 60,
              background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              transformOrigin: 'center',
            }}
          />
        </div>

        {/* ── Two cards ── */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto">
          <LyricCard data={anthem} delay={0.1} />
          <LyricCard data={song}   delay={0.3} />
        </div>

        {/* ── Bottom note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={headInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center text-white/25 text-xs mt-10 font-poppins italic"
        >
          ♪ Sung with pride at every Pathfinder gathering ♪
        </motion.p>
      </div>
    </section>
  );
}
