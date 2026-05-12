"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Calendar, Plus, Search, Trash2, Edit2, 
  MapPin, Clock, Star, Loader2, X, Image as ImageIcon,
  CheckCircle2, AlertCircle, Upload
} from "lucide-react";
import DropdownDatePicker from "../_components/DropdownDatePicker";

export default function EventsTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    eventDate: "",
    location: "",
    category: "General",
    featured: false,
    image: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'pathfinder/events');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setForm(f => ({ ...f, image: data.url }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingEvent ? `/api/events/${editingEvent._id}` : "/api/events";
      const method = editingEvent ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        fetchEvents();
        closeModal();
      }
    } catch (err) {
      console.error("Error saving event:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const openModal = (event: any = null) => {
    if (event) {
      setEditingEvent(event);
      setForm({
        title: event.title,
        subtitle: event.subtitle || "",
        description: event.description || "",
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : "",
        location: event.location || "",
        category: event.category || "General",
        featured: event.featured || false,
        image: event.image || ""
      });
    } else {
      setEditingEvent(null);
      setForm({
        title: "",
        subtitle: "",
        description: "",
        eventDate: "",
        location: "",
        category: "General",
        featured: false,
        image: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={32} /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Calendar className="text-amber-500" />
            Events <span className="text-white/30 font-light">Manager</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Schedule and manage upcoming school events</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Plus size={18} />
          Add New Event
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text"
            placeholder="Search events by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
          />
        </div>
        <div className="md:col-span-4 flex gap-4">
          <div className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Calendar className="text-amber-500" size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total Events</p>
              <p className="text-lg font-black text-white">{events.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[32px] py-20 text-center">
          <Calendar size={48} className="text-white/5 mx-auto mb-4" />
          <p className="text-white/20 font-medium italic">No events found matching your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event._id}
              className="group bg-white/[0.02] border border-white/[0.06] rounded-[32px] overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 bg-white/[0.03] overflow-hidden">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={40} className="text-white/5" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border border-white/10">
                    {event.category || "General"}
                  </span>
                  {event.featured && (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-amber-500/60 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg">
                    <Clock size={12} />
                    {new Date(event.eventDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white/40">
                      <MapPin size={12} />
                      {event.location}
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-black text-white leading-tight mb-2 group-hover:text-amber-500 transition-colors">{event.title}</h3>
                <p className="text-white/40 text-xs line-clamp-2 mb-6">{event.description}</p>
                
                <div className="mt-auto pt-6 border-t border-white/[0.04] flex items-center justify-between">
                  <button 
                    onClick={() => openModal(event)}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold"
                  >
                    <Edit2 size={14} />
                    Edit Details
                  </button>
                  <button 
                    onClick={() => handleDelete(event._id)}
                    className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />
          <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h2 className="text-xl font-black text-white">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-white/40 text-xs mt-1">Fill in the details for the school event</p>
              </div>
              <button onClick={closeModal} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Event Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Annual Inter-house Sports"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
                      value={form.title}
                      onChange={e => setForm({...form, title: e.target.value})}
                    />
                  </div>
                  <DropdownDatePicker
                    label="Event Date"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={(e) => setForm({...form, eventDate: e.target.value})}
                    required
                    minYear={new Date().getFullYear()}
                    maxYear={new Date().getFullYear() + 5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. School Main Field"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
                      value={form.location}
                      onChange={e => setForm({...form, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 appearance-none"
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                    >
                      <option value="General" className="bg-[#0f172a]">General</option>
                      <option value="Academic" className="bg-[#0f172a]">Academic</option>
                      <option value="Sport" className="bg-[#0f172a]">Sport</option>
                      <option value="Cultural" className="bg-[#0f172a]">Cultural</option>
                      <option value="Holiday" className="bg-[#0f172a]">Holiday</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Event Image</label>
                  {form.image ? (
                    <div className="relative rounded-2xl overflow-hidden h-40 group">
                      <img src={form.image} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setForm({ ...form, image: '' })}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group"
                    >
                      {uploading ? (
                        <Loader2 size={24} className="animate-spin text-amber-500 mx-auto" />
                      ) : (
                        <Upload size={24} className="text-white/20 mx-auto mb-2 group-hover:text-amber-500 transition-colors" />
                      )}
                      <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Click to upload image</p>
                      <p className="text-[10px] text-white/10 mt-1 uppercase tracking-tight">Best size: 1200 x 800px</p>
                    </div>
                  )}
                  <input 
                    ref={fileRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} 
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-white/10 font-bold uppercase">Or paste URL:</span>
                    <input 
                      type="url" 
                      placeholder="https://..."
                      className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-amber-500/50"
                      value={form.image}
                      onChange={e => setForm({...form, image: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us more about the event..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 resize-none"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                   <div className={`w-12 h-6 rounded-full p-1 transition-all ${form.featured ? 'bg-amber-500' : 'bg-white/10 group-hover:bg-white/20'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-all ${form.featured ? 'translate-x-6' : 'translate-x-0'}`} />
                   </div>
                   <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={form.featured}
                      onChange={e => setForm({...form, featured: e.target.checked})}
                   />
                   <div>
                      <p className="text-sm font-bold text-white">Feature this event</p>
                      <p className="text-[10px] text-white/30 tracking-tight">Highlighted events appear on the home page</p>
                   </div>
                </label>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 py-3.5 rounded-2xl border border-white/5 text-white/40 font-bold text-sm hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                form="event-form"
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3.5 rounded-2xl bg-amber-500 text-white font-black text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : (editingEvent ? <CheckCircle2 size={18} /> : <Plus size={18} />)}
                {submitting ? "Saving..." : (editingEvent ? "Update Event" : "Publish Event")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
