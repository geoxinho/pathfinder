'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, Eye, EyeOff, X, Reply, Circle } from 'lucide-react';

interface ContactMsg {
  _id: string; name: string; email: string; phone?: string;
  subject?: string; message: string; read: boolean; createdAt: string;
}

export default function ContactsTab() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMsg | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  async function fetchMessages() {
    const res = await fetch('/api/contact');
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { fetchMessages(); }, []);

  async function markRead(id: string, read: boolean) {
    await fetch('/api/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read }),
    });
    setMessages(prev => prev.map(m => m._id === id ? { ...m, read } : m));
    if (selected?._id === id) setSelected(prev => prev ? { ...prev, read } : null);
  }

  function openMessage(msg: ContactMsg) {
    setSelected(msg);
    if (!msg.read) markRead(msg._id, true);
  }

  const displayed = filter === 'unread' ? messages.filter(m => !m.read) : messages;
  const unreadCount = messages.filter(m => !m.read).length;

  function formatDate(d: string) {
    const date = new Date(d);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Contact Inbox</h1>
          <p className="text-white/40 text-sm">
            {messages.length} total · {unreadCount > 0 ? (
              <span className="text-amber-400 font-semibold">{unreadCount} unread</span>
            ) : 'all read'}
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f ? 'bg-amber-500 text-black' : 'bg-white/[0.06] text-white/50 hover:text-white'
              }`}>
              {f === 'unread' ? `Unread (${unreadCount})` : 'All'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-black text-sm flex-shrink-0">
                  {selected.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{selected.name}</p>
                  <p className="text-white/40 text-xs truncate">{selected.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => markRead(selected._id, !selected.read)}
                    className="text-white/30 hover:text-white p-1.5 hover:bg-white/[0.06] rounded-lg transition-all"
                    title={selected.read ? 'Mark unread' : 'Mark read'}>
                    {selected.read ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your Inquiry')}`}
                    className="flex items-center gap-1.5 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                    <Reply size={12} /> Reply
                  </a>
                  <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white p-1.5"><X size={16} /></button>
                </div>
              </div>
              <div className="px-5 py-3 bg-white/[0.02] border-b border-white/[0.06] flex flex-wrap gap-4 text-xs text-white/40">
                {selected.subject && <span><span className="text-white/60 font-semibold">Subject:</span> {selected.subject}</span>}
                {selected.phone && <span><span className="text-white/60 font-semibold">Phone:</span> {selected.phone}</span>}
                <span><span className="text-white/60 font-semibold">Received:</span> {formatDate(selected.createdAt)}</span>
              </div>
              <div className="p-5">
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-amber-400" size={32} /></div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <Mail size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">{filter === 'unread' ? 'No unread messages!' : 'No messages yet.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((msg, i) => (
            <motion.div key={msg._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => openMessage(msg)}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                msg.read
                  ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                  : 'bg-amber-500/[0.04] border-amber-500/20 hover:bg-amber-500/[0.08]'
              }`}>
              <div className="flex-shrink-0">
                {!msg.read
                  ? <Circle size={8} className="text-amber-400 fill-amber-400" />
                  : <Circle size={8} className="text-white/10" />}
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                {msg.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm truncate ${msg.read ? 'text-white/60' : 'text-white font-semibold'}`}>{msg.name}</p>
                  {msg.subject && <span className="text-white/30 text-xs truncate hidden sm:block">— {msg.subject}</span>}
                </div>
                <p className="text-white/30 text-xs truncate">{msg.message}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-white/30 text-xs">{formatDate(msg.createdAt)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
