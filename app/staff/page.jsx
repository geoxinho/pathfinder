"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Star,
  Users,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

const stats = [
  { value: "50+", label: "Teaching Staff" },
  { value: "6", label: "Departments" },
  { value: "25+", label: "Years Experience (Avg)" },
  { value: "100%", label: "Certified Educators" },
];

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function StaffPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch("/api/staff");
        const data = await res.json();
        if (data.success) {
          setStaff(data.data);
        }
      } catch (err) {
        console.error("Failed to load staff", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStaff();
  }, []);

  // Organize data
  const chairman = staff.filter((s) => s.category === "Chairman");
  const leadership = staff.filter((s) => s.category === "Leadership");
  const deptStaff = staff.filter((s) => s.category === "Department");

  // Group department staff by department
  const departmentsMap = {};
  deptStaff.forEach((s) => {
    const deptName = s.department || "Other";
    if (!departmentsMap[deptName]) {
      departmentsMap[deptName] = [];
    }
    departmentsMap[deptName].push(s);
  });

  const departmentEntries = Object.entries(departmentsMap);

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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 font-poppins animate-pulse">Loading staff directory...</p>
        </div>
      ) : (
        <>
          {/* ── CHAIRMAN SECTION ── */}
          {chairman.length > 0 && (
            <section className="section-padding bg-slate-50 border-b border-slate-100">
              <div className="container-custom">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-14"
                >
                  <span className="section-tag mb-4 inline-flex bg-primary text-white border-primary">
                    <ShieldCheck size={12} className="text-gold" /> Governing Board
                  </span>
                  <h2 className="section-title mb-3">
                    Office of the <span className="gradient-text">Chairman</span>
                  </h2>
                  <div className="gold-divider mx-auto mt-5" />
                </motion.div>

                {chairman.map((person, i) => (
                  <motion.div
                    key={person._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-8 max-w-5xl mx-auto"
                  >
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                      <div className="relative z-10 grid md:grid-cols-5 gap-0 items-center">
                        {/* Photo */}
                        <div className="relative h-80 md:h-full md:col-span-2 min-h-[360px] overflow-hidden">
                          {person.img ? (
                            <Image
                              src={person.img}
                              alt={person.name}
                              fill
                              className="object-contain object-bottom"
                            />
                          ) : (
                            <InitialsAvatar initials={person.initials || "CH"} />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
                        </div>
                        {/* Content */}
                        <div className="p-8 md:p-12 md:col-span-3">
                          <span className="inline-flex items-center gap-1.5 bg-primary text-white font-poppins font-bold text-xs tracking-widest uppercase px-3 py-1.5 rounded-full mb-5 shadow-sm">
                            <Award size={11} className="text-gold" /> {person.badge || "Chairman"}
                          </span>
                          <h3 className="font-poppins font-black text-primary text-3xl md:text-4xl mb-2">
                            {person.name}
                          </h3>
                          <p className="text-gold font-poppins font-semibold text-sm mb-5">
                            {person.role} {person.sub && `— ${person.sub}`}
                          </p>
                          <div className="w-12 h-0.5 bg-gold mb-6" />
                          <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">
                            {person.bio || "Leading Pathfinder College with a profound vision and commitment to educational excellence."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── LEADERSHIP ── */}
          {leadership.length > 0 && (
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

                {/* Featured Leaders (e.g. Principal) */}
                {leadership.filter(l => l.featured).map((person, i) => (
                  <motion.div
                    key={person._id}
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
                          {person.img ? (
                            <Image
                              src={person.img}
                              alt={person.name}
                              fill
                              className="object-contain object-bottom w-4xl"
                            />
                          ) : (
                            <InitialsAvatar initials={person.initials || "PR"} index={1} />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/20 hidden md:block" />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent md:hidden" />
                        </div>
                        {/* Content */}
                        <div className="p-8 md:p-12">
                          <span className="inline-flex items-center gap-1.5 bg-gold text-primary font-poppins font-bold text-xs tracking-widest uppercase px-3 py-1.5 rounded-full mb-5">
                            <Award size={11} /> {person.badge || "Principal"}
                          </span>
                          <h3 className="font-poppins font-black text-white text-2xl md:text-3xl mb-1">
                            {person.name}
                          </h3>
                          <p className="text-gold font-poppins font-semibold text-sm mb-5">
                            {person.role} {person.sub && `— ${person.sub}`}
                          </p>
                          <div className="w-10 h-0.5 bg-gold/50 mb-5" />
                          <p className="text-white/70 leading-relaxed text-sm mb-7">
                            {person.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Regular Leaders (e.g. Vice Principals) */}
                <div className="grid md:grid-cols-2 gap-6">
                  {leadership.filter(l => !l.featured).map((person, i) => (
                    <motion.div
                      key={person._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                      className="group premium-card p-0 overflow-hidden hover:-translate-y-2"
                    >
                      <div className="flex flex-col sm:flex-row gap-0 h-full">
                        {/* Photo strip */}
                        <div className="relative w-full sm:w-40 h-48 sm:h-auto flex-shrink-0">
                          {person.img ? (
                            <Image
                              src={person.img}
                              alt={person.name}
                              fill
                              className="object-contain object-bottom"
                            />
                          ) : (
                            <InitialsAvatar initials={person.initials || "VP"} index={i+2} />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                        </div>
                        {/* Info */}
                        <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                          <div>
                            <span
                              className={`inline-flex items-center text-[10px] font-poppins font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${person.badgeColor || 'bg-primary/10 text-primary'}`}
                            >
                              {person.badge || person.role}
                            </span>
                            <h3 className="font-poppins font-bold text-primary text-lg leading-tight mb-1">
                              {person.name}
                            </h3>
                            <p className="text-gold font-poppins font-semibold text-xs mb-3">
                              {person.role} {person.sub && `— ${person.sub}`}
                            </p>
                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                              {person.bio}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

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
          {deptStaff.length > 0 && (
            <section className="section-padding">
              <div className="container-custom">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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

                <div className="space-y-12">
                  {departmentEntries.map(([deptName, members], di) => (
                    <motion.div
                      key={deptName}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * (di % 3) }}
                    >
                      {/* Dept header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradients[di % gradients.length]} flex items-center justify-center text-white shadow-md font-black text-lg`}
                        >
                          {deptName.charAt(0)}
                        </div>
                        <h3 className="font-poppins font-black text-primary text-2xl tracking-tight">
                          {deptName}
                        </h3>
                        <div className="flex-1 h-px bg-gray-200 ml-4" />
                      </div>

                      {/* Staff grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {members.map((member, mi) => (
                          <motion.div
                            key={member._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: 0.05 * (mi % 5) + 0.1,
                            }}
                            className="group bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:border-gold/30 hover:-translate-y-1 transition-all"
                          >
                            {/* Avatar */}
                            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-inner border-2 border-white outline outline-1 outline-gray-100 group-hover:outline-gold/30 transition-all">
                              {member.img ? (
                                <Image
                                  src={member.img}
                                  alt={member.name}
                                  fill
                                  className="object-cover object-center"
                                />
                              ) : (
                                <InitialsAvatar
                                  initials={member.initials || member.name.substring(0, 2).toUpperCase()}
                                  index={di + mi}
                                />
                              )}
                            </div>
                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <p className="font-poppins font-bold text-primary text-sm truncate group-hover:text-gold transition-colors">
                                {member.name}
                              </p>
                              <p className="text-gray-600 text-xs font-medium truncate mt-0.5">
                                {member.role}
                              </p>
                              {/* Qualifications hidden by request */}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

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
