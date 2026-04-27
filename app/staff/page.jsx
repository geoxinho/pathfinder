"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Star,
  Users,
  BookOpen,
  Award,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const leadership = [
  {
    name: "Mr. Adebayo O. Olatunji",
    role: "Principal",
    sub: "Chief Academic Officer",
    img: "/staff_principal.png",
    bio: "With over 25 years of experience in education, Mr. Olatunji leads Pathfinder College with a visionary approach that balances academic rigour with holistic character development.",
    badge: "Principal",
    badgeColor: "bg-gold text-primary",
    featured: true,
  },
  {
    name: "Mrs. Funke A. Adeyemi",
    role: "Vice Principal",
    sub: "Administration",
    img: "/staff_vice1.png",
    bio: "Mrs. Adeyemi oversees the day-to-day administrative operations of the school, ensuring a smooth, disciplined and student-centred environment.",
    badge: "Vice Principal I",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    name: "Mr. Emeka C. Nwachukwu",
    role: "Vice Principal",
    sub: "Academics",
    img: "/staff_vice2.png",
    bio: "Mr. Nwachukwu drives the academic agenda of Pathfinder College, coordinating curriculum delivery, staff development and student performance improvement.",
    badge: "Vice Principal II",
    badgeColor: "bg-primary/10 text-primary",
  },
];

const departments = [
  {
    dept: "Sciences",
    color: "from-blue-500 to-cyan-500",
    light: "bg-blue-50",
    icon: "🔬",
    staff: [
      {
        name: "Mr. Samuel Adeleke",
        role: "Head of Sciences",
        img: "/staff_teacher2.png",
        qual: "B.Sc, M.Sc Physics",
      },
      {
        name: "Mrs. Grace Okonkwo",
        role: "Biology Teacher",
        img: null,
        initials: "GO",
        qual: "B.Sc Biology",
      },
      {
        name: "Mr. Femi Olawale",
        role: "Chemistry Teacher",
        img: null,
        initials: "FO",
        qual: "B.Sc Chemistry",
      },
    ],
  },
  {
    dept: "Humanities",
    color: "from-rose-500 to-pink-500",
    light: "bg-rose-50",
    icon: "📚",
    staff: [
      {
        name: "Mrs. Blessing Eze",
        role: "Head of Humanities",
        img: "/staff_teacher1.png",
        qual: "B.A English, M.A Literature",
      },
      {
        name: "Mr. Chukwudi Obi",
        role: "History Teacher",
        img: null,
        initials: "CO",
        qual: "B.A History",
      },
      {
        name: "Mrs. Amaka Nwosu",
        role: "CRS Teacher",
        img: null,
        initials: "AN",
        qual: "B.Th Theology",
      },
    ],
  },
  {
    dept: "Mathematics",
    color: "from-emerald-500 to-teal-500",
    light: "bg-emerald-50",
    icon: "📐",
    staff: [
      {
        name: "Mr. Taiwo Adeola",
        role: "Head of Mathematics",
        img: null,
        initials: "TA",
        qual: "B.Sc, M.Sc Mathematics",
      },
      {
        name: "Mrs. Ngozi Okafor",
        role: "Mathematics Teacher",
        img: null,
        initials: "NO",
        qual: "B.Sc Mathematics",
      },
      {
        name: "Mr. Biodun Adesanya",
        role: "Further Maths Teacher",
        img: null,
        initials: "BA",
        qual: "B.Sc Statistics",
      },
    ],
  },
  {
    dept: "ICT & Technology",
    color: "from-violet-500 to-purple-500",
    light: "bg-violet-50",
    icon: "💻",
    staff: [
      {
        name: "Mr. Tunde Fashola",
        role: "ICT Coordinator",
        img: null,
        initials: "TF",
        qual: "B.Sc Computer Science",
      },
      {
        name: "Miss Kemi Babatunde",
        role: "ICT Teacher",
        img: null,
        initials: "KB",
        qual: "HND Computer Science",
      },
    ],
  },
  {
    dept: "Student Welfare",
    color: "from-amber-500 to-orange-500",
    light: "bg-amber-50",
    icon: "🤝",
    staff: [
      {
        name: "Mrs. Remi Ogunleye",
        role: "School Counselor",
        img: "/staff_teacher3.png",
        qual: "B.Sc Psychology, M.Sc Counselling",
      },
      {
        name: "Mr. Adewale Salami",
        role: "Sports Coordinator",
        img: null,
        initials: "AS",
        qual: "B.Ed Physical Education",
      },
    ],
  },
  {
    dept: "Administration & Support",
    color: "from-slate-500 to-gray-600",
    light: "bg-slate-50",
    icon: "🏛️",
    staff: [
      {
        name: "Mrs. Folake Abiodun",
        role: "School Bursar",
        img: null,
        initials: "FA",
        qual: "B.Sc Accounting",
      },
      {
        name: "Mr. Lanre Oduola",
        role: "Head Librarian",
        img: null,
        initials: "LO",
        qual: "B.Sc Library Science",
      },
      {
        name: "Miss Chisom Eze",
        role: "Front Desk Officer",
        img: null,
        initials: "CE",
        qual: "OND Business Admin",
      },
    ],
  },
];

const stats = [
  { value: "50+", label: "Teaching Staff" },
  { value: "6", label: "Departments" },
  { value: "25+", label: "Years Experience (Avg)" },
  { value: "100%", label: "Certified Educators" },
];

/* ─────────────────────────────────────────────
   AVATAR FALLBACK (initials-based)
───────────────────────────────────────────── */
const gradients = [
  "from-blue-400 to-cyan-500",
  "from-violet-400 to-purple-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-slate-400 to-gray-500",
];
function InitialsAvatar({ initials, index = 0 }) {
  const g = gradients[index % gradients.length];
  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${g}`}
    >
      <span className="text-white font-poppins font-black text-3xl select-none">
        {initials}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function StaffPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <main className="bg-white">
      {/* ── HERO ── */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/8 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
          {/* decorative dots */}
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="container-custom relative z-10 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <Users size={12} /> Meet Our Team
            </span>
            <h1 className="font-poppins font-black text-white text-4xl md:text-5xl lg:text-6xl mb-5 leading-tight">
              The People Behind{" "}
              <span className="gradient-text">Our Excellence</span>
            </h1>
            <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              At Pathfinder College, our dedicated staff are the heartbeat of
              everything we do — shaping minds, building character and inspiring
              the next generation of leaders.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 text-center"
              >
                <p className="font-poppins font-black text-gold text-3xl leading-none mb-1">
                  {s.value}
                </p>
                <p className="text-white/60 text-xs font-poppins">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 60L1440 60L1440 30C1200 60 960 70 720 60C480 50 240 20 0 30L0 60Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section ref={ref} className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="section-tag mb-4 inline-flex">
              <Star size={12} /> School Leadership
            </span>
            <h2 className="section-title mb-3">
              Our <span className="gradient-text">Leadership Team</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Guiding Pathfinder College with wisdom, experience and an
              unwavering commitment to excellence
            </p>
            <div className="gold-divider mx-auto mt-5" />
          </motion.div>

          {/* Principal — featured card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative bg-gradient-to-br from-primary to-primary-light rounded-3xl overflow-hidden shadow-premium">
              {/* bg decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-xl pointer-events-none" />

              <div className="relative z-10 grid md:grid-cols-2 gap-0 items-center">
                {/* Photo */}
                <div className="relative h-80 md:h-full min-h-[320px] overflow-hidden">
                  <Image
                    src={leadership[0].img}
                    alt={leadership[0].name}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/20 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent md:hidden" />
                </div>
                {/* Content */}
                <div className="p-8 md:p-12">
                  <span className="inline-flex items-center gap-1.5 bg-gold text-primary font-poppins font-bold text-xs tracking-widest uppercase px-3 py-1.5 rounded-full mb-5">
                    <Award size={11} /> Principal
                  </span>
                  <h3 className="font-poppins font-black text-white text-2xl md:text-3xl mb-1">
                    {leadership[0].name}
                  </h3>
                  <p className="text-gold font-poppins font-semibold text-sm mb-5">
                    {leadership[0].sub}
                  </p>
                  <div className="w-10 h-0.5 bg-gold/50 mb-5" />
                  <p className="text-white/70 leading-relaxed text-sm mb-7">
                    {leadership[0].bio}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="mailto:principal@pathfindercollege.edu.ng"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-poppins font-semibold px-4 py-2.5 rounded-xl transition-all"
                    >
                      <Mail size={13} /> Email
                    </a>
                    <a
                      href="tel:+2348012345678"
                      className="flex items-center gap-2 bg-gold/20 hover:bg-gold/30 border border-gold/30 text-gold text-xs font-poppins font-semibold px-4 py-2.5 rounded-xl transition-all"
                    >
                      <Phone size={13} /> Call Office
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vice Principals */}
          <div className="grid md:grid-cols-2 gap-6">
            {leadership.slice(1).map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="group premium-card p-0 overflow-hidden hover:-translate-y-2"
              >
                <div className="flex gap-0">
                  {/* Photo strip */}
                  <div className="relative w-36 flex-shrink-0 min-h-[240px]">
                    <Image
                      src={person.img}
                      alt={person.name}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <span
                        className={`inline-flex items-center text-[10px] font-poppins font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${person.badgeColor}`}
                      >
                        {person.badge}
                      </span>
                      <h3 className="font-poppins font-bold text-primary text-base leading-tight mb-0.5">
                        {person.name}
                      </h3>
                      <p className="text-gold font-poppins font-semibold text-xs mb-3">
                        {person.role} — {person.sub}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                        {person.bio}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <a
                        href={`mailto:vp${i + 1}@pathfindercollege.edu.ng`}
                        className="flex items-center gap-1.5 text-primary/80 hover:text-primary text-xs font-poppins font-semibold transition-colors"
                      >
                        <Mail size={12} /> Email
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER BANNER ── */}
      <section className="py-10 bg-light-gray">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 border border-primary/10 rounded-3xl px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-poppins font-bold text-primary text-base">
                  Professionally Trained Educators
                </p>
                <p className="text-gray-500 text-sm">
                  Every member of our staff is certified and continuously
                  trained to deliver world-class education.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="btn-outline flex-shrink-0 text-sm px-6 py-3 flex items-center gap-2"
            >
              Contact Us <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="section-tag mb-4 inline-flex">
              <Users size={12} /> All Departments
            </span>
            <h2 className="section-title mb-3">
              Our <span className="gradient-text">Staff Directory</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              A dedicated team of educators and professionals across every
              department
            </p>
            <div className="gold-divider mx-auto mt-5" />
          </motion.div>

          <div className="space-y-10">
            {departments.map((dept, di) => (
              <motion.div
                key={dept.dept}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * di }}
              >
                {/* Dept header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-lg shadow-md`}
                  >
                    {dept.icon}
                  </div>
                  <h3 className="font-poppins font-bold text-primary text-xl">
                    {dept.dept}
                  </h3>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Staff grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dept.staff.map((member, mi) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.05 * mi + 0.1 * di }}
                      className="group premium-card flex items-center gap-4 hover:-translate-y-1"
                    >
                      {/* Avatar */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                        {member.img ? (
                          <Image
                            src={member.img}
                            alt={member.name}
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <InitialsAvatar
                            initials={member.initials}
                            index={di}
                          />
                        )}
                      </div>
                      {/* Info */}
                      <div className="min-w-0">
                        <p className="font-poppins font-bold text-primary text-sm truncate">
                          {member.name}
                        </p>
                        <p className="text-gray-600 text-xs font-medium truncate">
                          {member.role}
                        </p>
                        <p className="text-gray-400 text-[10px] mt-0.5 truncate">
                          {member.qual}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <span className="section-tag mb-5 inline-flex border-gold/30 text-gold">
            🤝 Join Our Team
          </span>
          <h2 className="font-poppins font-black text-white text-3xl md:text-4xl mb-4">
            Interested in{" "}
            <span className="gradient-text">Teaching at Pathfinder?</span>
          </h2>
          <p className="text-white/60 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            We are always looking for passionate, qualified educators who share
            our commitment to shaping the next generation.
          </p>
          <Link href="/contact" className="btn-primary text-sm px-8 py-3.5">
            Get In Touch <ChevronRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
