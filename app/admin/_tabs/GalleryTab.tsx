'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, X, Image as ImageIcon, Loader2, Pencil, Check } from 'lucide-react';
import DropdownDatePicker from '../_components/DropdownDatePicker';

interface GalleryImage { url: string; publicId: string; }
interface Album { _id: string; title: string; subtitle?: string; images: GalleryImage[]; publishedAt: string; }

export default function GalleryTab() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', publishedAt: new Date().toISOString().split('T')[0] });
  const [saving, setSaving] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const activeAlbumRef = useRef<string | null>(null);

  async function fetchAlbums() {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setAlbums(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { fetchAlbums(); }, []);

  async function createAlbum(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, images: [] }),
    });
    setForm({ title: '', subtitle: '', publishedAt: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    setSaving(false);
    fetchAlbums();
  }

  async function deleteAlbum(id: string) {
    if (!confirm('Delete this album and all its images?')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    fetchAlbums();
  }

  async function uploadImages(albumId: string, files: FileList) {
    setUploadingFor(albumId);
    const album = albums.find(a => a._id === albumId);
    if (!album) return;
    const newImages = [...album.images];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'pathfinder/gallery');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) newImages.push({ url: data.url, publicId: data.publicId });
    }
    await fetch(`/api/gallery/${albumId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: newImages }),
    });
    setUploadingFor(null);
    fetchAlbums();
  }

  async function removeImage(albumId: string, pubId: string) {
    const album = albums.find(a => a._id === albumId);
    if (!album) return;
    const images = album.images.filter(i => i.publicId !== pubId);
    await fetch(`/api/gallery/${albumId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images }),
    });
    fetchAlbums();
  }

  async function saveTitle(id: string) {
    await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditingId(null);
    fetchAlbums();
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Gallery</h1>
          <p className="text-white/40 text-sm">{albums.length} album{albums.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
        >
          <Plus size={16} /> New Album
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">Create Album</h2>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={createAlbum} className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Album Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Science Fair 2025"
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 placeholder-white/20"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Subtitle</label>
                  <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Optional description"
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 placeholder-white/20"
                  />
                </div>
                <DropdownDatePicker
                  label="Album Date"
                  name="publishedAt"
                  value={form.publishedAt}
                  onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                  required
                  minYear={new Date().getFullYear() - 10}
                  maxYear={new Date().getFullYear()}
                />
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 bg-white/[0.06] text-white/60 hover:text-white py-2.5 rounded-xl text-sm transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileRef} type="file" multiple accept="image/*" className="hidden"
        onChange={e => {
          if (e.target.files && activeAlbumRef.current) {
            uploadImages(activeAlbumRef.current, e.target.files);
          }
          e.target.value = '';
        }}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-amber-400" size={32} />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <ImageIcon size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No albums yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {albums.map(album => (
            <div key={album._id} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                {editingId === album._id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)}
                      className="flex-1 bg-white/[0.08] border border-amber-500/40 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                    />
                    <button onClick={() => saveTitle(album._id)} className="text-emerald-400 hover:text-emerald-300"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="text-white/30 hover:text-white"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base truncate">{album.title}</h3>
                    <button onClick={() => { setEditingId(album._id); setEditTitle(album.title); }}
                      className="text-white/20 hover:text-white/60 flex-shrink-0"><Pencil size={13} />
                    </button>
                  </div>
                )}
                <span className="text-white/30 text-xs flex-shrink-0">{album.images.length} photo{album.images.length !== 1 ? 's' : ''}</span>
                <button
                  onClick={() => { activeAlbumRef.current = album._id; fileRef.current?.click(); }}
                  disabled={uploadingFor === album._id}
                  className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                >
                  {uploadingFor === album._id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  Upload
                </button>
                <button onClick={() => deleteAlbum(album._id)}
                  className="text-red-400/50 hover:text-red-400 transition-colors p-1"><Trash2 size={15} />
                </button>
              </div>

              {album.images.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {album.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-white/[0.04]">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => removeImage(album._id, img.publicId)}
                          className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center">
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => { activeAlbumRef.current = album._id; fileRef.current?.click(); }}
                  className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/5 transition-all"
                >
                  <Upload size={24} className="text-white/20 mx-auto mb-2" />
                  <p className="text-white/30 text-xs">Click to upload photos</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
