'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, X, Loader2, Newspaper, Upload, Calendar } from 'lucide-react';
import DropdownDatePicker from '../_components/DropdownDatePicker';

interface Post {
  _id: string; title: string; slug: string; excerpt?: string;
  body: string; coverImage?: string; category?: string; author?: string; publishedAt: string;
}

const CATEGORIES = ['Announcement', 'Achievement', 'Academic', 'Sports', 'Community'];
const empty = { title: '', excerpt: '', body: '', coverImage: '', coverImagePublicId: '', category: '', author: '', publishedAt: '' };

export default function NewsTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function fetchPosts() {
    const res = await fetch('/api/news');
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { fetchPosts(); }, []);

  function openCreate() { setForm(empty); setEditId(null); setShowForm(true); }
  function openEdit(p: Post) {
    setForm({ title: p.title, excerpt: p.excerpt || '', body: p.body || '', coverImage: p.coverImage || '', coverImagePublicId: '', category: p.category || '', author: p.author || '', publishedAt: p.publishedAt ? p.publishedAt.slice(0, 10) : '' });
    setEditId(p._id); setShowForm(true);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'pathfinder/news');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setForm(f => ({ ...f, coverImage: data.url, coverImagePublicId: data.publicId }));
    setUploading(false);
  }

  async function savePost(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/news/${editId}` : '/api/news';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false); setShowForm(false);
    fetchPosts();
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/news/${id}`, { method: 'DELETE' });
    fetchPosts();
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">News & Blog</h1>
          <p className="text-white/40 text-sm">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-4 py-2.5 rounded-xl transition-all">
          <Plus size={16} /> New Post
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-full max-w-2xl my-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">{editId ? 'Edit Post' : 'New Post'}</h2>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={savePost} className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 placeholder-white/20" placeholder="Post title" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer">
                      <option value="" className="bg-[#0f172a]">None</option>
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0f172a]">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Author</label>
                    <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                      className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 placeholder-white/20" placeholder="Author name" />
                  </div>
                  <DropdownDatePicker
                    label="Publish Date"
                    name="publishedAt"
                    value={form.publishedAt}
                    onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                    required
                    minYear={new Date().getFullYear() - 1}
                    maxYear={new Date().getFullYear() + 2}
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Excerpt</label>
                  <textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 placeholder-white/20 resize-none" placeholder="Short summary..." />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Body (HTML or plain text)</label>
                  <textarea rows={8} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 placeholder-white/20 resize-y font-mono" placeholder="Write your post content here..." />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Cover Image</label>
                  {form.coverImage ? (
                    <div className="relative rounded-xl overflow-hidden h-40">
                      <img src={form.coverImage} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setForm({ ...form, coverImage: '', coverImagePublicId: '' })}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center"><X size={13} /></button>
                    </div>
                  ) : (
                    <div onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/5 transition-all">
                      {uploading ? <Loader2 size={20} className="animate-spin text-amber-400 mx-auto" /> : <Upload size={20} className="text-white/20 mx-auto mb-1" />}
                      <p className="text-white/30 text-xs mt-1">Click to upload cover image</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/[0.06] text-white/60 hover:text-white py-2.5 rounded-xl text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {editId ? 'Save Changes' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-amber-400" size={32} /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <Newspaper size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No posts yet. Write your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div key={post._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 flex gap-4 items-center">
              {post.coverImage ? (
                <img src={post.coverImage} alt="" className="w-16 h-14 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-14 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <Newspaper size={18} className="text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate mb-0.5">{post.title}</p>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  {post.publishedAt && <span className="flex items-center gap-1"><Calendar size={10} />{new Date(post.publishedAt).toLocaleDateString('en-NG')}</span>}
                  {post.category && <span className="bg-white/[0.06] px-2 py-0.5 rounded-full">{post.category}</span>}
                  {post.author && <span>By {post.author}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(post)} className="text-white/30 hover:text-white p-1.5 hover:bg-white/[0.06] rounded-lg transition-all"><Pencil size={14} /></button>
                <button onClick={() => deletePost(post._id)} className="text-red-400/40 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
