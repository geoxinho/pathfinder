'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Calendar, Newspaper, FileText, Mail, TrendingUp, Eye, Clock, Loader2 } from 'lucide-react';

interface Stats {
  galleries: number;
  events: number;
  news: number;
  files: number;
  contacts: number;
  unread: number;
}

export default function DashboardTab({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const [stats, setStats] = useState<Stats>({ galleries: 0, events: 0, news: 0, files: 0, contacts: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [galleries, events, news, files, contacts] = await Promise.all([
          fetch('/api/gallery').then(r => r.json()),
          fetch('/api/events').then(r => r.json()),
          fetch('/api/news').then(r => r.json()),
          fetch('/api/files').then(r => r.json()),
          fetch('/api/contact').then(r => r.json()),
        ]);
        setStats({
          galleries: Array.isArray(galleries) ? galleries.length : 0,
          events: Array.isArray(events) ? events.length : 0,
          news: Array.isArray(news) ? news.length : 0,
          files: Array.isArray(files) ? files.length : 0,
          contacts: Array.isArray(contacts) ? contacts.length : 0,
          unread: Array.isArray(contacts) ? contacts.filter((c: any) => !c.read).length : 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: 'Gallery Albums', value: stats.galleries, icon: Image, color: 'from-violet-500 to-purple-600', tab: 'gallery' },
    { label: 'Events', value: stats.events, icon: Calendar, color: 'from-blue-500 to-cyan-600', tab: 'events' },
    { label: 'News & Blog', value: stats.news, icon: Newspaper, color: 'from-emerald-500 to-teal-600', tab: 'news' },
    { label: 'Files', value: stats.files, icon: FileText, color: 'from-orange-500 to-amber-600', tab: 'files' },
    { label: 'Total Messages', value: stats.contacts, icon: Mail, color: 'from-rose-500 to-pink-600', tab: 'contacts' },
    { label: 'Unread Messages', value: stats.unread, icon: Eye, color: 'from-amber-400 to-orange-500', tab: 'contacts' },
  ];

  const quickLinks = [
    { label: 'Add Gallery Album', tab: 'gallery', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20' },
    { label: 'Create Event', tab: 'events', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' },
    { label: 'Write Blog Post', tab: 'news', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
    { label: 'Upload File', tab: 'files', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20' },
    { label: 'View Inbox', tab: 'contacts', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-white/40 text-sm">Welcome back — here&apos;s an overview of your content.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.button
            key={card.label}
            onClick={() => onTabChange(card.tab)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="text-left group"
          >
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.07] transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg`}>
                <card.icon size={18} className="text-white" />
              </div>
              <p className="text-white/40 text-xs mb-1">{card.label}</p>
              <p className="text-white text-3xl font-bold">
                {loading ? <span className="inline-block w-8 h-7 bg-white/10 rounded animate-pulse" /> : card.value}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-amber-400" />
            <h2 className="text-white font-semibold text-sm">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            {quickLinks.map(l => (
              <button key={l.label} onClick={() => onTabChange(l.tab)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${l.color}`}
              >
                {l.label}
                <span className="text-xs opacity-60">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={16} className="text-amber-400" />
            <h2 className="text-white font-semibold text-sm">System Status</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Database', status: 'Connected', ok: true },
              { label: 'Image Storage', status: 'Active', ok: true },
              { label: 'Email SMTP', status: 'Configured', ok: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
                <span className="text-white/50 text-sm">{item.label}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.ok ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  {item.status}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2">
              <span className="text-white/50 text-sm">Admin Access</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400">Passcode Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
