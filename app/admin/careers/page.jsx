"use client";

import { useEffect, useState } from "react";
import {
  Plus, X, Trash2, CheckCircle, AlertCircle, Loader2,
  Briefcase, Users, Calendar, BookOpen, ChevronDown,
  Edit2, Save, Eye
} from "lucide-react";
import Link from "next/link";

/* ─────────────── constants ─────────────── */
const DEPTS = [
  "Sciences","Humanities","Mathematics","ICT & Technology",
  "Languages","Social Sciences","Arts & Creative",
  "Physical Education","Administration & Support","Other",
];
const LEVELS  = ["Junior School (JSS)","Senior School (SSS)","Both"];
const TYPES   = ["Full-Time","Part-Time","Contract"];
const STATUSES = ["Open","Closed","Filled"];

const inputCls  = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50 focus:bg-white";
const labelCls  = "block text-xs font-poppins font-semibold text-gray-600 mb-1.5";
const selectCls = inputCls;

function statusColor(s) {
  if (s === "Open")   return "bg-emerald-100 text-emerald-700";
  if (s === "Filled") return "bg-blue-100 text-blue-700";
  return "bg-red-100 text-red-700";
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day:"numeric", month:"short", year:"numeric" });
}

const empty = {
  subject:"", department:"Sciences", level:"Both", type:"Full-Time",
  description:"", requirements:"", deadline:"", status:"Open",
};

/* ─────────────── POST FORM ─────────────── */
function PostForm({ onPosted }) {
  const [form, setForm]   = useState(empty);
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to post job");
      setForm(empty);
      showToast("Job posted successfully!", "success");
      onPosted?.();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-5">
        <h2 className="font-poppins font-bold text-white text-lg flex items-center gap-2">
          <Plus size={18} /> Post a New Teaching Position
        </h2>
        <p className="text-white/60 text-xs mt-1">Fill in the details below and hit Post Job</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {toast && (
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${toast.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Subject / Position <span className="text-red-400">*</span></label>
            <input required value={form.subject} onChange={set("subject")} className={inputCls} placeholder="e.g. Mathematics, Biology…" />
          </div>
          <div>
            <label className={labelCls}>Department <span className="text-red-400">*</span></label>
            <select required value={form.department} onChange={set("department")} className={selectCls}>
              {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={labelCls}>School Level</label>
            <select value={form.level} onChange={set("level")} className={selectCls}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Employment Type</label>
            <select value={form.type} onChange={set("type")} className={selectCls}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Application Deadline <span className="text-red-400">*</span></label>
            <input required type="date" value={form.deadline} onChange={set("deadline")} className={inputCls} min={new Date().toISOString().split("T")[0]} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Job Description <span className="text-red-400">*</span></label>
          <textarea required rows={4} value={form.description} onChange={set("description")} className={inputCls} placeholder="Describe the role, responsibilities and what success looks like…" />
        </div>

        <div>
          <label className={labelCls}>Requirements <span className="text-red-400">*</span></label>
          <textarea required rows={4} value={form.requirements} onChange={set("requirements")} className={inputCls} placeholder={"Enter each requirement on a new line, e.g.:\nB.Ed or B.Sc in Mathematics\nMinimum 2 years teaching experience\nNCE or PGDE is an advantage"} />
          <p className="text-gray-400 text-xs mt-1">One requirement per line — they will display as bullet points.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={busy} className="btn-primary text-sm px-6 py-3 flex items-center gap-2 disabled:opacity-60">
            {busy ? <><Loader2 size={15} className="animate-spin" /> Posting…</> : <><Plus size={15} /> Post Job</>}
          </button>
          <Link href="/careers" target="_blank"
            className="btn-outline text-sm px-5 py-3 flex items-center gap-2">
            <Eye size={14} /> Preview Page
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ─────────────── JOB ROW ─────────────── */
function JobRow({ job, onStatusChange, onDelete }) {
  const [busy, setBusy] = useState(false);

  async function changeStatus(newStatus) {
    setBusy(true);
    try {
      await fetch("/api/admin/careers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: job._id, status: newStatus }),
      });
      onStatusChange?.(job._id, newStatus);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete the "${job.subject}" posting? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/careers?id=${job._id}`, { method: "DELETE" });
      onDelete?.(job._id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-poppins font-bold text-primary text-sm">{job.subject} Teacher</h3>
            <span className={`text-[10px] font-poppins font-bold px-2.5 py-0.5 rounded-full ${statusColor(job.status)}`}>
              {job.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-gray-400 text-xs mt-1">
            <span className="flex items-center gap-1"><Briefcase size={11} />{job.department}</span>
            {job.level && <span className="flex items-center gap-1"><BookOpen size={11} />{job.level}</span>}
            {job.type && <span className="flex items-center gap-1"><Users size={11} />{job.type}</span>}
            {job.deadline && <span className="flex items-center gap-1"><Calendar size={11} />Deadline: {fmtDate(job.deadline)}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* status dropdown */}
          <div className="relative">
            <select value={job.status} onChange={(e) => changeStatus(e.target.value)} disabled={busy}
              className="text-xs font-poppins font-semibold border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50 appearance-none pr-7">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button onClick={handleDelete} disabled={busy}
            className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function AdminCareersPage() {
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState("post"); // post | manage

  function load() {
    setLoading(true);
    fetch("/api/careers")
      .then((r) => r.json())
      .then((d) => { if (d.success) setJobs(d.jobs); })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function handleStatusChange(id, newStatus) {
    setJobs((prev) => prev.map((j) => j._id === id ? { ...j, status: newStatus } : j));
  }

  function handleDelete(id) {
    setJobs((prev) => prev.filter((j) => j._id !== id));
  }

  const open   = jobs.filter((j) => j.status === "Open").length;
  const filled = jobs.filter((j) => j.status === "Filled").length;
  const closed = jobs.filter((j) => j.status === "Closed").length;

  return (
    <div className="min-h-screen bg-light-gray">
      {/* header */}
      <div className="bg-primary px-6 py-5 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-gold text-xs font-poppins font-semibold uppercase tracking-widest mb-0.5">Admin Panel</p>
            <h1 className="font-poppins font-black text-white text-2xl">Careers & Recruitment</h1>
          </div>
          <Link href="/careers" target="_blank"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-poppins font-semibold px-4 py-2.5 rounded-xl transition-all">
            <Eye size={14} /> View Public Page
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Postings", value: jobs.length, color: "text-primary" },
            { label: "Open",           value: open,        color: "text-emerald-600" },
            { label: "Filled",         value: filled,      color: "text-blue-600" },
            { label: "Closed",         value: closed,      color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <p className={`font-poppins font-black text-3xl ${s.color}`}>{s.value}</p>
              <p className="text-gray-400 text-xs font-poppins mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 p-1 rounded-2xl w-fit shadow-sm">
          {[{ key: "post", label: "Post a Job" }, { key: "manage", label: `Manage (${jobs.length})` }].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-poppins font-semibold transition-all ${tab === t.key ? "bg-primary text-white shadow-md" : "text-gray-500 hover:text-primary"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* tab content */}
        {tab === "post" && (
          <PostForm onPosted={() => { load(); setTab("manage"); }} />
        )}

        {tab === "manage" && (
          <div className="space-y-3">
            {loading && (
              <div className="flex items-center justify-center py-16 gap-3">
                <Loader2 size={28} className="animate-spin text-primary/40" />
                <p className="text-gray-400 text-sm">Loading postings…</p>
              </div>
            )}
            {!loading && jobs.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <p className="text-5xl mb-3">📋</p>
                <p className="font-poppins font-bold text-gray-400">No job postings yet</p>
                <p className="text-gray-300 text-xs mt-1">Switch to the "Post a Job" tab to create one.</p>
              </div>
            )}
            {!loading && jobs.map((job) => (
              <JobRow key={job._id} job={job} onStatusChange={handleStatusChange} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
