'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Loader2, FileText, Upload, Download, ExternalLink } from 'lucide-react';

interface FileDoc {
  _id: string; name: string; description?: string; url: string;
  publicId: string; fileType: string; size?: number; category?: string; createdAt: string;
}

const FILE_CATEGORIES = ['Policy', 'Academic', 'Admission', 'Form', 'Report', 'Calendar', 'Other'];
const empty = { name: '', description: '', category: '', url: '', publicId: '', fileType: '', size: 0 };

function fmtSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function FilesTab() {
  const [files, setFiles] = useState<FileDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function fetchFiles() {
    const res = await fetch('/api/files');
    const data = await res.json();
    setFiles(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { fetchFiles(); }, []);

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'pathfinder/files');
    fd.append('resourceType', 'raw');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) {
      setForm(f => ({
        ...f,
        url: data.url,
        publicId: data.publicId,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: data.size,
        name: f.name || file.name.replace(/\.[^.]+$/, ''),
      }));
    }
    setUploading(false);
  }

  async function saveFile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowForm(false);
    setForm(empty);
    fetchFiles();
  }

  async function deleteFile(id: string) {
    if (!confirm('Delete this file?')) return;
    await fetch(`/api/files/${id}`, { method: 'DELETE' });
    fetchFiles();
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Files</h1>
          <p className="text-white/40 text-sm">{files.length} file{files.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setForm(empty); setShowForm(true); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-4 py-2.5 rounded-xl transition-all">
          <Plus size={16} /> Upload File
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">Upload File</h2>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={saveFile} className="space-y-4">
                {form.url ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                    <FileText size={20} className="text-emerald-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{form.name}</p>
                      <p className="text-white/40 text-xs">{form.fileType} · {fmtSize(form.size)}</p>
                    </div>
                    <button type="button" onClick={() => setForm({ ...form, url: '', publicId: '' })}
                      className="text-white/30 hover:text-white"><X size={14} /></button>
                  </div>
                ) : (
                  <div onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/5 transition-all">
                    {uploading ? (
                      <Loader2 size={24} className="animate-spin text-amber-400 mx-auto mb-2" />
                    ) : (
                      <Upload size={24} className="text-white/20 mx-auto mb-2" />
                    )}
                    <p className="text-white/40 text-sm">Click to choose file</p>
                    <p className="text-white/20 text-xs mt-1">PDF, DOC, XLS, images, etc.</p>
                  </div>
                )}
                <input ref={fileRef} type="file" className="hidden"
                  onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} />

                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">File Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 placeholder-white/20"
                    placeholder="e.g. School Fees 2025" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50">
                    <option value="">Select category</option>
                    {FILE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Description</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 placeholder-white/20"
                    placeholder="Optional description" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/[0.06] text-white/60 hover:text-white py-2.5 rounded-xl text-sm">Cancel</button>
                  <button type="submit" disabled={saving || !form.url}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    Save File
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-amber-400" size={32} /></div>
      ) : files.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <FileText size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No files yet. Upload your first one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file, i) => (
            <motion.div key={file._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{file.name}</p>
                <div className="flex items-center gap-2 text-xs text-white/30 mt-0.5">
                  <span className="bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">{file.fileType}</span>
                  {file.size && <span>{fmtSize(file.size)}</span>}
                  {file.category && <span>{file.category}</span>}
                  <span>{new Date(file.createdAt).toLocaleDateString('en-NG')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a href={file.url} target="_blank" rel="noreferrer"
                  className="text-white/30 hover:text-white p-1.5 hover:bg-white/[0.06] rounded-lg transition-all">
                  <ExternalLink size={14} />
                </a>
                <a href={file.url} download
                  className="text-white/30 hover:text-white p-1.5 hover:bg-white/[0.06] rounded-lg transition-all">
                  <Download size={14} />
                </a>
                <button onClick={() => deleteFile(file._id)}
                  className="text-red-400/40 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
