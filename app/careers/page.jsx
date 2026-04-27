"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Calendar, Clock, Users, ChevronRight,
  X, CheckCircle, AlertCircle, BookOpen, Loader2, Search,
} from "lucide-react";
import Link from "next/link";

/* ── helpers ── */
const deptColors = {
  Sciences:              "from-blue-500 to-cyan-400",
  Humanities:            "from-rose-500 to-pink-400",
  Mathematics:           "from-emerald-500 to-teal-400",
  "ICT & Technology":    "from-violet-500 to-purple-400",
  Languages:             "from-amber-500 to-yellow-400",
  "Social Sciences":     "from-orange-500 to-red-400",
  "Arts & Creative":     "from-fuchsia-500 to-pink-400",
  "Physical Education":  "from-green-500 to-lime-400",
  "Administration & Support": "from-slate-500 to-gray-400",
  Other:                 "from-gray-400 to-gray-500",
};

const deptIcons = {
  Sciences: "🔬", Humanities: "📚", Mathematics: "📐",
  "ICT & Technology": "💻", Languages: "🗣️", "Social Sciences": "🌍",
  "Arts & Creative": "🎨", "Physical Education": "⚽",
  "Administration & Support": "🏛️", Other: "📋",
};

function statusBadge(status) {
  if (status === "Open")   return "bg-emerald-100 text-emerald-700";
  if (status === "Filled") return "bg-blue-100 text-blue-700";
  return "bg-red-100 text-red-700";
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

const QUALIFICATIONS = ["NCE","OND","HND","B.Ed","B.Sc","B.A","PGDE","M.Sc / M.A / M.Ed","Ph.D","Other"];
const EXPERIENCE     = ["Less than 1 year","1 – 3 years","3 – 5 years","5 – 10 years","10+ years"];

/* ─────────────────────────────── APPLY MODAL ─────────────────────────────── */
function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    highestQualification: "", yearsOfExperience: "",
    coverLetter: "", cvLink: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errMsg, setErrMsg] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, jobId: job._id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Submission failed");
      setStatus("success");
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50 focus:bg-white";
  const labelCls = "block text-xs font-poppins font-semibold text-gray-600 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl z-10">

        {/* header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between z-10 rounded-t-3xl">
          <div>
            <p className="text-xs font-poppins font-semibold text-primary/60 uppercase tracking-widest">Applying for</p>
            <h2 className="font-poppins font-black text-primary text-lg leading-tight">{job.subject} Teacher</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <h3 className="font-poppins font-bold text-gray-800 text-xl mb-2">Application Submitted!</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-6">
                Thank you for applying. We will review your application and get back to you shortly.
              </p>
              <button onClick={onClose} className="btn-primary text-sm px-6 py-3">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{errMsg}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                  <input required value={form.fullName} onChange={set("fullName")} className={inputCls} placeholder="e.g. Adebayo Olatunji" />
                </div>
                <div>
                  <label className={labelCls}>Phone Number <span className="text-red-400">*</span></label>
                  <input required type="tel" value={form.phone} onChange={set("phone")} className={inputCls} placeholder="e.g. 08012345678" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
                <input required type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@example.com" />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Highest Qualification</label>
                  <select value={form.highestQualification} onChange={set("highestQualification")} className={inputCls}>
                    <option value="">Select qualification</option>
                    {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Years of Experience</label>
                  <select value={form.yearsOfExperience} onChange={set("yearsOfExperience")} className={inputCls}>
                    <option value="">Select experience</option>
                    {EXPERIENCE.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>CV / Resume Link</label>
                <input type="url" value={form.cvLink} onChange={set("cvLink")} className={inputCls} placeholder="https://drive.google.com/your-cv" />
                <p className="text-gray-400 text-xs mt-1">Upload your CV to Google Drive or Dropbox and paste the shareable link here.</p>
              </div>

              <div>
                <label className={labelCls}>Cover Letter / Brief Statement</label>
                <textarea rows={4} value={form.coverLetter} onChange={set("coverLetter")} className={inputCls} placeholder="Tell us why you're the right fit for this role..." />
              </div>

              <button type="submit" disabled={status === "sending"}
                className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {status === "sending" ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Submit Application <ChevronRight size={15} /></>}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────── PAGE ─────────────────────────────── */
export default function CareersPage() {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    fetch("/api/careers")
      .then((r) => r.json())
      .then((d) => { if (d.success) setJobs(d.jobs); else setError("Could not load jobs."); })
      .catch(() => setError("Could not load jobs."))
      .finally(() => setLoading(false));
  }, []);

  const departments = ["All", ...Array.from(new Set(jobs.map((j) => j.department).filter(Boolean)))];

  const filtered = jobs.filter((j) => {
    const matchSearch = j.subject?.toLowerCase().includes(search.toLowerCase()) ||
                        j.department?.toLowerCase().includes(search.toLowerCase());
    const matchDept   = filterDept === "All" || j.department === filterDept;
    return matchSearch && matchDept;
  });

  const open   = filtered.filter((j) => j.status === "Open");
  const others = filtered.filter((j) => j.status !== "Open");

  return (
    <main className="bg-white">
      {/* ── HERO ── */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/8 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dotsg" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dotsg)" />
          </svg>
        </div>

        <div className="container-custom relative z-10 pt-32 pb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <Briefcase size={12} /> We're Hiring
            </span>
            <h1 className="font-poppins font-black text-white text-4xl md:text-5xl lg:text-6xl mb-5 leading-tight">
              Teach at{" "}<span className="gradient-text">Pathfinder College</span>
            </h1>
            <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Join our family of passionate educators and help shape the next generation of Nigeria's leaders. Browse open positions and apply below.
            </p>
          </motion.div>

          {/* search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto mt-10">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by subject or department…"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 rounded-2xl pl-11 pr-5 py-4 text-sm font-inter focus:outline-none focus:border-gold/50 transition-colors" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 70 720 60C480 50 240 20 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── MAIN ── */}
      <section ref={ref} className="section-padding">
        <div className="container-custom">

          {/* dept filter pills */}
          {departments.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {departments.map((d) => (
                <button key={d} onClick={() => setFilterDept(d)}
                  className={`px-4 py-2 rounded-full text-xs font-poppins font-semibold transition-all border ${filterDept === d
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary"}`}>
                  {d}
                </button>
              ))}
            </div>
          )}

          {/* loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={36} className="animate-spin text-primary/40" />
              <p className="text-gray-400 text-sm font-poppins">Loading open positions…</p>
            </div>
          )}

          {/* error */}
          {!loading && error && (
            <div className="text-center py-20">
              <AlertCircle size={40} className="text-red-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          )}

          {/* no results */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="font-poppins font-bold text-primary text-xl mb-2">No positions found</h3>
              <p className="text-gray-400 text-sm">
                {jobs.length === 0
                  ? "There are no open vacancies at this time. Please check back later."
                  : "Try a different search or filter."}
              </p>
            </div>
          )}

          {/* OPEN POSITIONS */}
          {!loading && !error && open.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-poppins font-bold text-primary text-xl">Open Positions</h2>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-poppins font-bold px-3 py-1 rounded-full">{open.length} available</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-14">
                {open.map((job, i) => (
                  <JobCard key={job._id} job={job} index={i} onApply={() => setSelectedJob(job)} />
                ))}
              </div>
            </>
          )}

          {/* CLOSED / FILLED */}
          {!loading && !error && others.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-poppins font-bold text-gray-400 text-lg">Closed / Filled</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 opacity-60">
                {others.map((job, i) => (
                  <JobCard key={job._id} job={job} index={i} onApply={null} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-12 bg-light-gray">
        <div className="container-custom">
          <div className="bg-primary rounded-3xl px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="relative z-10">
              <p className="font-poppins font-black text-white text-2xl md:text-3xl mb-3">
                Don't see your subject?{" "}<span className="gradient-text">Apply anyway.</span>
              </p>
              <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                We're always open to exceptional educators. Send us your details and we'll be in touch when a suitable vacancy opens.
              </p>
              <button onClick={() => setSelectedJob({ _id: null, subject: "General Teaching" })}
                className="btn-primary text-sm px-8 py-3.5 flex items-center gap-2 mx-auto">
                Submit Open Application <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── APPLY MODAL ── */}
      <AnimatePresence>
        {selectedJob && <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      </AnimatePresence>
    </main>
  );
}

/* ── JOB CARD ── */
function JobCard({ job, index, onApply }) {
  const grad  = deptColors[job.department] || deptColors.Other;
  const icon  = deptIcons[job.department]  || "📋";
  const isOpen = job.status === "Open";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 * index }}
      className="premium-card flex flex-col gap-4 hover:-translate-y-1">

      {/* top */}
      <div className="flex items-start justify-between gap-3">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-xl shadow-md flex-shrink-0`}>
          {icon}
        </div>
        <span className={`text-[10px] font-poppins font-bold px-3 py-1 rounded-full uppercase tracking-wide ${statusBadge(job.status)}`}>
          {job.status}
        </span>
      </div>

      {/* title */}
      <div>
        <h3 className="font-poppins font-bold text-primary text-base leading-tight mb-0.5">
          {job.subject} Teacher
        </h3>
        <p className="text-gray-400 text-xs font-medium">{job.department}</p>
      </div>

      {/* meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {job.level && (
          <span className="flex items-center gap-1.5"><BookOpen size={12} />{job.level}</span>
        )}
        {job.type && (
          <span className="flex items-center gap-1.5"><Users size={12} />{job.type}</span>
        )}
        {job.deadline && (
          <span className="flex items-center gap-1.5"><Calendar size={12} />Deadline: {formatDate(job.deadline)}</span>
        )}
      </div>

      {/* description */}
      {job.description && (
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{job.description}</p>
      )}

      {/* requirements */}
      {job.requirements && (
        <ul className="space-y-1">
          {job.requirements.split("\n").slice(0, 3).map((r, i) => r.trim() && (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
              {r.trim()}
            </li>
          ))}
        </ul>
      )}

      {/* footer */}
      {job.postedAt && (
        <p className="text-gray-300 text-[10px] flex items-center gap-1 mt-auto pt-2 border-t border-gray-100">
          <Clock size={10} /> Posted {formatDate(job.postedAt)}
        </p>
      )}

      {isOpen && onApply && (
        <button onClick={onApply} className="btn-primary w-full text-sm py-3 flex items-center justify-center gap-2 mt-auto">
          Apply Now <ChevronRight size={14} />
        </button>
      )}
    </motion.div>
  );
}
