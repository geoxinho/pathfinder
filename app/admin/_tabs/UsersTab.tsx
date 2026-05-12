"use client";

import { useEffect, useState } from "react";
import { 
  Users, UserPlus, Trash2, Shield, User as UserIcon, 
  Loader2, CheckCircle2, AlertCircle, X, ChevronDown 
} from "lucide-react";

const ROLES = ["admin", "editor"];

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "editor"
  });

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/auth/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("User created successfully!");
        setForm({ name: "", username: "", password: "", role: "editor" });
        setShowForm(false);
        loadUsers();
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setBusy(false);
    }
  };

  const deleteUser = async (user: any) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      const res = await fetch(`/api/auth/users?id=${user._id}`, { method: "DELETE" });
      if (res.ok) loadUsers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Users className="text-amber-500" />
            User <span className="text-white/30 font-light">Management</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage dashboard administrators and editors</p>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
        >
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {(error || success) && (
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm animate-in slide-in-from-top-2 ${error ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
          {error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {error || success}
          <button onClick={() => { setError(""); setSuccess(""); }} className="ml-auto opacity-40 hover:opacity-100 transition-opacity"><X size={14} /></button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1e293b] border border-white/10 rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New User</h2>
              <button onClick={() => setShowForm(false)} className="text-white/20 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Full Name</label>
                <input 
                  required 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Username</label>
                <input 
                  required 
                  value={form.username} 
                  onChange={(e) => setForm({...form, username: e.target.value.toLowerCase().replace(/\s+/g, '')})}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                  placeholder="e.g. johndoe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Password</label>
                <input 
                  required 
                  type="password"
                  value={form.password} 
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Account Role</label>
                <div className="relative">
                  <select 
                    value={form.role} 
                    onChange={(e) => setForm({...form, role: e.target.value})}
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-amber-500/50 transition-all"
                  >
                    {ROLES.map(r => <option key={r} value={r} className="bg-[#1e293b] capitalize">{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={busy}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {busy ? <Loader2 className="animate-spin" size={18} /> : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-amber-400" size={32} /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user._id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 group hover:bg-white/[0.04] transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => deleteUser(user)} className="p-2 text-white/20 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] flex items-center justify-center">
                  <UserIcon size={20} className="text-white/20" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{user.name}</h3>
                  <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase">@{user.username}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  <Shield size={10} />
                  {user.role}
                </div>
                <div className="text-[10px] text-white/20 font-medium">Added {new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
