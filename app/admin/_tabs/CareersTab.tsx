"use client";

import { useEffect, useState } from "react";
import {
  Plus, X, Trash2, CheckCircle, AlertCircle, Loader2,
  Briefcase, Users, Calendar, BookOpen, ChevronDown,
  Eye
} from "lucide-react";
import DropdownDatePicker from "../_components/DropdownDatePicker";

/* ─────────────── constants ─────────────── */
const DEPTS = [
  "Sciences","Humanities","Mathematics","ICT & Technology",
  "Languages","Social Sciences","Arts & Creative",
  "Physical Education","Administration & Support","Other",
];
const LEVELS  = ["Junior School (JSS)","Senior School (SSS)","Both"];
const TYPES   = ["Full-Time","Part-Time","Contract"];
const STATUSES = ["Open","Closed","Filled"];

const inputCls  = "w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all";
const labelCls  = "block text-[10px] font-black uppercase tracking-widest text-white/30 mb-1.5";
const selectCls = "w-full bg-white/[0.06] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all appearance-none cursor-pointer";

function statusColor(s: string) {
  if (s === "Open")   return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (s === "Filled") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  return "bg-rose-500/10 text-rose-400 border-rose-500/20";
}

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", { day:"numeric", month:"short", year:"numeric" });
}

const empty = {
  subject:"", department:"Sciences", level:"Both", type:"Full-Time",
  description:"", requirements:"", deadline:"", status:"Open",
};

export default function CareersTab() {
  const [jobs, setJobs]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState("manage"); // manage | post
  const [form, setForm]   = useState(empty);
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState<any>(null);

  function load() {
    setLoading(true);
    fetch("/api/careers")
      .then((r) => r.json())
      .then((d) => { if (d.success) setJobs(d.jobs); })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function showToast(msg: string, type: string) {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to post job");
      setForm(empty);
      showToast("Job posted successfully!", "success");
      load();
      setTab("manage");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(id: string, newStatus: string) {
    try {
      await fetch("/api/careers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setJobs((prev) => prev.map((j) => j._id === id ? { ...j, status: newStatus } : j));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(job: any) {
    if (!confirm(`Delete the "${job.subject}" posting?`)) return;
    try {
      await fetch(`/api/careers?id=${job._id}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } catch (err) {
      console.error(err);
    }
  }

  const openCount   = jobs.filter((j) => j.status === "Open").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Briefcase className="text-amber-500" />
            Careers <span className="text-white/30 font-light">Portal</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">{jobs.length} total postings · {openCount} open</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
          <button 
            onClick={() => setTab("manage")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'manage' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Manage Postings
          </button>
          <button 
            onClick={() => setTab("post")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'post' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Post New Job
          </button>
        </div>
      </div>

      {toast && (
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${toast.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {tab === "manage" ? (
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-amber-400" size={32} /></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-3xl">
              <Briefcase size={40} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No job postings yet.</p>
              <button onClick={() => setTab("post")} className="mt-4 text-amber-500 text-xs font-bold hover:underline">Post your first job →</button>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] transition-all group">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white text-base">{job.subject} Teacher</h3>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-white/30 text-[11px] font-medium">
                      <span className="flex items-center gap-1.5"><Users size={12} className="text-amber-500/50" /> {job.department}</span>
                      <span className="flex items-center gap-1.5"><BookOpen size={12} className="text-amber-500/50" /> {job.level}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-amber-500/50" /> {fmtDate(job.deadline)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <select 
                        value={job.status} 
                        onChange={(e) => changeStatus(job._id, e.target.value)}
                        className="bg-white/[0.04] border border-white/[0.06] text-white/60 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/30 appearance-none pr-8 cursor-pointer hover:text-white transition-all"
                      >
                        {STATUSES.map(s => <option key={s} value={s} className="bg-[#1e293b]">{s}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                    </div>
                    <button onClick={() => handleDelete(job)} className="p-2.5 text-white/20 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 space-y-6 max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Subject / Position</label>
              <input required value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className={inputCls} placeholder="e.g. Mathematics, Biology…" />
            </div>
            <div className="relative">
              <label className={labelCls}>Department</label>
              <select required value={form.department} onChange={(e) => setForm({...form, department: e.target.value})} className={selectCls}>
                {DEPTS.map((d) => <option key={d} value={d} className="bg-[#1e293b]">{d}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 bottom-4 text-white/20 pointer-events-none" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="relative">
              <label className={labelCls}>School Level</label>
              <select value={form.level} onChange={(e) => setForm({...form, level: e.target.value})} className={selectCls}>
                {LEVELS.map((l) => <option key={l} value={l} className="bg-[#1e293b]">{l}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 bottom-4 text-white/20 pointer-events-none" />
            </div>
            <div className="relative">
              <label className={labelCls}>Employment Type</label>
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className={selectCls}>
                {TYPES.map((t) => <option key={t} value={t} className="bg-[#1e293b]">{t}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 bottom-4 text-white/20 pointer-events-none" />
            </div>
            <DropdownDatePicker
              label="Application Deadline"
              name="deadline"
              value={form.deadline}
              onChange={(e) => setForm({...form, deadline: e.target.value})}
              required
              minYear={new Date().getFullYear()}
              maxYear={new Date().getFullYear() + 2}
            />
          </div>

          <div>
            <label className={labelCls}>Job Description</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={inputCls} placeholder="Describe the role, responsibilities and success metrics…" />
          </div>

          <div>
            <label className={labelCls}>Requirements</label>
            <textarea required rows={4} value={form.requirements} onChange={(e) => setForm({...form, requirements: e.target.value})} className={inputCls} placeholder={"Enter each requirement on a new line..."} />
            <p className="text-white/20 text-[10px] mt-2 font-medium">Use one line per requirement for bullet points.</p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/[0.04]">
            <button type="submit" disabled={busy} className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Post Position
            </button>
            <button type="button" onClick={() => setTab("manage")} className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
