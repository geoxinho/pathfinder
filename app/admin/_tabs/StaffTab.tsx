"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Users, UserPlus, Trash2, Edit2, Shield, Loader2, 
  CheckCircle2, AlertCircle, X, ChevronDown, Upload, Image as ImageIcon
} from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["Chairman", "Leadership", "Department"];

export default function StaffTab() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialForm = {
    _id: "",
    name: "",
    category: "Department",
    role: "",
    sub: "",
    department: "",
    img: "",
    bio: "",
    badge: "",
    badgeColor: "",
    featured: false,
    qual: "",
    initials: "",
    order: 0
  };

  const [form, setForm] = useState(initialForm);

  const loadStaff = async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (data.success) setStaff(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStaff(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "pathfinder/staff");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setForm((prev) => ({ ...prev, img: data.url }));
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("An unexpected error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const isEdit = !!form._id;
      const url = isEdit ? `/api/staff/${form._id}` : "/api/staff";
      const method = isEdit ? "PUT" : "POST";

      const payload = { ...form };
      if (!isEdit) {
        delete payload._id;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess(`Staff member ${isEdit ? "updated" : "created"} successfully!`);
        setForm(initialForm);
        setShowForm(false);
        loadStaff();
      } else {
        setError(data.error || `Failed to ${isEdit ? "update" : "create"} staff`);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setBusy(false);
    }
  };

  const deleteStaff = async (member: any) => {
    if (!confirm(`Are you sure you want to delete ${member.name}?`)) return;
    try {
      const res = await fetch(`/api/staff/${member._id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Staff deleted");
        loadStaff();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editStaff = (member: any) => {
    setForm({
      ...initialForm,
      ...member
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Users className="text-amber-500" />
            Staff <span className="text-white/30 font-light">Management</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage all school staff and leadership</p>
        </div>
        
        <button 
          onClick={() => {
            setForm(initialForm);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
        >
          <UserPlus size={18} />
          Add Staff Member
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
          <div className="bg-[#1e293b] border border-white/10 rounded-[32px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{form._id ? "Edit Staff" : "Add New Staff"}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/20 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Full Name *</label>
                  <input 
                    required 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                    placeholder="e.g. Dr. Jane Doe"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Category *</label>
                  <div className="relative">
                    <select 
                      value={form.category} 
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-amber-500/50 transition-all"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1e293b]">{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Role / Position</label>
                  <input 
                    value={form.role} 
                    onChange={(e) => setForm({...form, role: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                    placeholder="e.g. Principal, Biology Teacher"
                  />
                </div>

                {form.category === 'Department' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Department</label>
                    <input 
                      value={form.department} 
                      onChange={(e) => setForm({...form, department: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                      placeholder="e.g. Sciences, Humanities"
                    />
                  </div>
                )}

                {(form.category === 'Leadership' || form.category === 'Chairman') && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Sub Role (Leadership)</label>
                    <input 
                      value={form.sub} 
                      onChange={(e) => setForm({...form, sub: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                      placeholder="e.g. Chief Academic Officer"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Qualifications</label>
                  <input 
                    value={form.qual} 
                    onChange={(e) => setForm({...form, qual: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                    placeholder="e.g. B.Sc, M.Sc Physics"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Initials (Fallback)</label>
                  <input 
                    value={form.initials} 
                    onChange={(e) => setForm({...form, initials: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                    placeholder="e.g. JD"
                  />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Bio</label>
                  <textarea 
                    value={form.bio} 
                    onChange={(e) => setForm({...form, bio: e.target.value})}
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                    placeholder="Short biography..."
                  />
                </div>

                {/* Additional badge and order fields */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Badge Text</label>
                  <input 
                    value={form.badge} 
                    onChange={(e) => setForm({...form, badge: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                    placeholder="e.g. Principal"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Sort Order</label>
                  <input 
                    type="number"
                    value={form.order} 
                    onChange={(e) => setForm({...form, order: Number(e.target.value)})}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-1.5 md:col-span-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Profile Image</label>
                   <div className="flex items-center gap-4">
                     {form.img ? (
                       <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                         <Image src={form.img} alt="Preview" fill className="object-cover" />
                         <button 
                           type="button"
                           onClick={() => setForm({...form, img: ""})}
                           className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
                         >
                           <X size={12} />
                         </button>
                       </div>
                     ) : (
                       <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center text-white/30">
                         <ImageIcon size={24} className="mb-1" />
                         <span className="text-[10px]">No Image</span>
                       </div>
                     )}
                     
                     <input 
                       type="file" 
                       accept="image/*" 
                       className="hidden" 
                       ref={fileInputRef}
                       onChange={handleFileUpload}
                     />
                     <button
                       type="button"
                       disabled={uploading}
                       onClick={() => fileInputRef.current?.click()}
                       className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all border border-white/10 disabled:opacity-50"
                     >
                       {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                       {uploading ? "Uploading..." : "Upload Image"}
                     </button>
                   </div>
                </div>
                
                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm({...form, featured: e.target.checked})}
                    className="rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500 focus:ring-offset-[#1e293b]"
                  />
                  <label htmlFor="featured" className="text-sm text-white/80 select-none cursor-pointer">
                    Featured (Use large card display)
                  </label>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={busy || uploading}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {busy ? <Loader2 className="animate-spin" size={18} /> : (form._id ? "Update Staff" : "Create Staff")}
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
          {staff.map((member) => (
            <div key={member._id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 group hover:bg-white/[0.04] transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => editStaff(member)} className="p-2 text-white/20 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteStaff(member)} className="p-2 text-white/20 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/[0.05] flex items-center justify-center overflow-hidden relative">
                  {member.img ? (
                    <Image src={member.img} alt={member.name} fill className="object-cover" />
                  ) : (
                    <span className="text-white/40 font-black text-xl">{member.initials || "?"}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
                  <p className="text-amber-500 text-xs font-semibold truncate">{member.role}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest bg-white/5 text-white/60 border-white/10">
                  <Shield size={10} />
                  {member.category}
                </div>
                {member.department && (
                  <div className="text-[10px] text-white/40 font-medium truncate max-w-[100px]">{member.department}</div>
                )}
              </div>
            </div>
          ))}
          {staff.length === 0 && (
            <div className="col-span-full py-10 text-center text-white/30 text-sm">
              No staff members found. Add one above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
