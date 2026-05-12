"use client";

import { useState, useEffect } from "react";
import { 
  Users, Search, Filter, Printer, Download, Trash2, 
  ChevronRight, Calendar, Mail, Phone, MapPin, 
  CreditCard, CheckCircle2, AlertCircle, X, FileText, Loader2
} from "lucide-react";

/* ── Helpers ── */
const formatDate = (date: any) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const statusColors: any = {
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  free: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function AdmissionsTab() {
  const [tab, setTab] = useState("junior");
  const [juniorList, setJuniorList] = useState<any[]>([]);
  const [seniorList, setSeniorList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admissions/list"); // I need to create this route or use separate ones
        // Wait, I don't have /api/admissions/list. I'll use separate calls.
        const [jRes, sRes] = await Promise.all([
           fetch("/api/admissions/junior/list").then(r => r.json()),
           fetch("/api/admissions/senior/list").then(r => r.json())
        ]);
        setJuniorList(jRes.data || []);
        setSeniorList(sRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const list = tab === "junior" ? juniorList : seniorList;
  const filtered = list.filter(item => 
    `${item.surname} ${item.otherNames}`.toLowerCase().includes(search.toLowerCase()) ||
    item.paymentReference?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selected || !confirm(`Delete application for ${selected.surname}?`)) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admissions/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected._id }),
      });
      if (res.ok) {
        if (tab === "junior") setJuniorList(prev => prev.filter(x => x._id !== selected._id));
        else setSeniorList(prev => prev.filter(x => x._id !== selected._id));
        setSelected(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handlePrint = () => {
    if (!selected) return;
    window.open(`/admin/print/admission/${selected._id}`, "_blank");
  };

  const handleDownload = async () => {
    if (!selected) return;
    setPdfLoading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const el = document.getElementById("admission-detail-pane");
      if (!el) {
        window.print();
        return;
      }

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f172a",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pgW = pdf.internal.pageSize.getWidth();
      const pgH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pgW / canvas.width, pgH / canvas.height);
      
      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width * ratio, canvas.height * ratio);
      pdf.save(`${selected.surname}_${selected.otherNames}_Admission.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-amber-400" size={32} /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Users className="text-amber-500" />
            Admissions <span className="text-white/30 font-light">Management</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Review and manage student admission applications</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
          <button 
            onClick={() => { setTab("junior"); setSelected(null); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'junior' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Junior School ({juniorList.length})
          </button>
          <button 
            onClick={() => { setTab("senior"); setSelected(null); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'senior' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            Senior School ({seniorList.length})
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text"
              placeholder="Search by name or ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
            />
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <Users size={32} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/20 text-sm">No applications found</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {filtered.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => setSelected(item)}
                    className={`w-full p-4 flex items-center gap-4 text-left transition-all hover:bg-white/[0.04] ${selected?._id === item._id ? 'bg-white/[0.06] ring-1 ring-inset ring-amber-500/30' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.passportPhoto ? (
                        <img src={item.passportPhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users size={16} className="text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.surname} {item.otherNames}</p>
                      <p className="text-[10px] text-white/30 mt-0.5 truncate">{item.paymentReference}</p>
                    </div>
                    <ChevronRight size={14} className={`text-white/10 transition-transform ${selected?._id === item._id ? 'translate-x-1 text-amber-500' : ''}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          {!selected ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-[32px] p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
                <FileText size={32} className="text-white/10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Application Selected</h3>
              <p className="text-white/40 text-sm max-w-xs">Select an application from the list on the left to view full details and print.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-[24px] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${statusColors[selected.paymentStatus] || statusColors.pending}`}>
                    {selected.paymentStatus || 'pending'}
                  </span>
                  <span className="text-white/20 text-xs hidden sm:inline">|</span>
                  <span className="text-white/40 text-xs hidden sm:inline">Submitted {formatDate(selected.submittedAt)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleDownload} disabled={pdfLoading} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/[0.06] text-white rounded-xl transition-all disabled:opacity-50">
                    <Download size={18} className={pdfLoading ? "animate-bounce" : ""} />
                  </button>
                  <button onClick={handlePrint} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/[0.06] text-white rounded-xl transition-all">
                    <Printer size={18} />
                  </button>
                  <button onClick={handleDelete} disabled={deleting} className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div id="admission-detail-pane" className="bg-white/[0.02] border border-white/[0.06] rounded-[32px] overflow-hidden">
                <div className="p-8 border-b border-white/[0.04] bg-gradient-to-br from-white/[0.02] to-transparent">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="w-32 h-40 rounded-2xl bg-white/[0.05] border border-white/[0.1] p-1 flex-shrink-0 overflow-hidden group relative">
                      {selected.passportPhoto ? (
                        <img src={selected.passportPhoto} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Users size={32} className="text-white/10" /></div>
                      )}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-3xl font-black text-white mb-2">{selected.surname} <span className="text-amber-500">{selected.otherNames}</span></h2>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <Calendar size={14} className="text-amber-500/50" />
                          DOB: {formatDate(selected.dateOfBirth).split(',')[0]}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <Users size={14} className="text-amber-500/50" />
                          Sex: {selected.sex}
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                         <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 font-medium">
                           {selected.levelOfSchooling || 'Junior'} Admission
                         </span>
                         {selected.examDate && (
                           <span className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500 font-bold">
                             Exam: {selected.examDate}
                           </span>
                         )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                        <AlertCircle size={10} /> Personal Information
                      </h4>
                      <div className="space-y-4">
                        <InfoItem label="Nationality" value={selected.nationality} />
                        <InfoItem label="State/LGA" value={`${selected.state} / ${selected.lga}`} />
                        <InfoItem label="Home Town" value={selected.homeTown} />
                        <InfoItem label="Religion" value={selected.religion} />
                        <InfoItem label="Family Position" value={selected.positionInFamily} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                        <MapPin size={10} /> Address Information
                      </h4>
                      <div className="space-y-4">
                        <InfoItem label="Residential" value={selected.residentialAddress} />
                        <InfoItem label="Office" value={selected.officeAddress} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                        <Users size={10} /> Parent / Guardian
                      </h4>
                      <div className="space-y-4">
                        <InfoItem label="Name" value={`${selected.parentSurname} ${selected.parentOtherNames}`} />
                        <InfoItem label="Occupation" value={selected.parentsOccupation} />
                        <div className="grid grid-cols-2 gap-4">
                           <InfoItem label="Father Phone" value={selected.fatherPhone} icon={<Phone size={12} />} />
                           <InfoItem label="Mother Phone" value={selected.motherPhone} icon={<Phone size={12} />} />
                        </div>
                        <InfoItem label="Emergency Contact" value={selected.contactPerson} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={10} /> Health & Medical
                      </h4>
                      <div className="space-y-4">
                        <InfoItem label="Allergies" value={`Food: ${selected.foodAllergy || 'None'} / Drug: ${selected.drugAllergy || 'None'}`} />
                        <InfoItem label="Medical History" value={selected.medicalHistory} />
                        <InfoItem label="Practitioner" value={selected.medicalPractitioner} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-white/20 text-xs">
                    <span className="flex items-center gap-1.5"><CreditCard size={12} /> {selected.paymentReference}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span>ID: {selected._id}</span>
                  </div>
                  <div className="text-[10px] text-white/20 font-medium">PATHFINDER COLLEGE ADMISSION PORTAL</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon }: any) {
  return (
    <div className="group">
      <p className="text-[10px] text-white/20 font-bold uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-2 text-sm text-white/70">
        {icon && <span className="text-amber-500/50">{icon}</span>}
        <span className="truncate">{value || "Not provided"}</span>
      </div>
    </div>
  );
}
