'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Image as ImageIcon, Calendar, Newspaper, FileText,
  Mail, ChevronRight, Menu, X, GraduationCap, Briefcase, LogOut, Users as UsersIcon
} from 'lucide-react';

// Import Tab Components
import DashboardTab from './_tabs/DashboardTab';
import GalleryTab from './_tabs/GalleryTab';
import NewsTab from './_tabs/NewsTab';
import EventsTab from './_tabs/EventsTab';
import FilesTab from './_tabs/FilesTab';
import ContactsTab from './_tabs/ContactsTab';
import AdmissionsTab from './_tabs/AdmissionsTab';
import CareersTab from './_tabs/CareersTab';
import UsersTab from './_tabs/UsersTab';
import StaffTab from './_tabs/StaffTab';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; username: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (e) {
        console.error(e);
      }
    }
    fetchUser();
  }, []);

  // Auto-close sidebar on mobile when tab changes
  useEffect(() => { setSidebarOpen(false); }, [activeTab]);

  const navItems = useMemo(() => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'gallery', label: 'Gallery', icon: ImageIcon },
      { id: 'news', label: 'News & Blog', icon: Newspaper },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'files', label: 'Files', icon: FileText },
      { id: 'contacts', label: 'Contact Inbox', icon: Mail },
      { id: 'admissions', label: 'Admissions', icon: GraduationCap },
      { id: 'careers', label: 'Careers', icon: Briefcase },
      { id: 'staff', label: 'Staff & Team', icon: UsersIcon },
    ];

    if (user?.role === 'admin') {
      items.push({ id: 'users', label: 'Manage Staff', icon: UsersIcon });
    }

    return items;
  }, [user]);

  const CurrentTab = useMemo(() => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab onTabChange={setActiveTab} />;
      case 'gallery': return <GalleryTab />;
      case 'news': return <NewsTab />;
      case 'events': return <EventsTab />;
      case 'files': return <FilesTab />;
      case 'contacts': return <ContactsTab />;
      case 'admissions': return <AdmissionsTab />;
      case 'careers': return <CareersTab />;
      case 'staff': return <StaffTab />;
      case 'users': return <UsersTab />;
      default: return <DashboardTab onTabChange={setActiveTab} />;
    }
  }, [activeTab]);

  const handleLogout = async () => {
    if (!confirm('Sign out of the admin portal?')) return;
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.reload(); // Redirects to LoginGate via session check
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-[#0f172a] border-r border-white/[0.06] z-[70]
        flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${sidebarOpen ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo Section */}
        <div className="flex items-center gap-4 px-8 py-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-2xl shadow-amber-500/20 rotate-3 group hover:rotate-0 transition-transform duration-500">
            <span className="text-white font-black text-xl tracking-tighter">P</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-lg leading-tight tracking-tight">Pathfinder</p>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">Control Center</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] px-4 mb-4">Main Navigation</p>
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl
                  text-sm font-bold transition-all duration-300 group relative overflow-hidden
                  ${active
                    ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
                  }
                `}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent opacity-50" />
                )}
                <item.icon size={18} className={`relative z-10 ${active ? 'text-white' : 'text-white/20 group-hover:text-white/50 group-hover:scale-110 transition-all duration-300'} transition-colors`} />
                <span className="relative z-10 flex-1 text-left">{item.label}</span>
                {active && <ChevronRight size={14} className="relative z-10 opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6">
          <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.04] space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                 <UsersIcon size={14} className="text-white/30" />
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{user?.role || 'Staff'} Active</p>
                 <p className="text-xs text-white/60 font-bold truncate">{user?.name || 'Administrator'}</p>
               </div>
             </div>
             <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all duration-300 group"
             >
              <LogOut size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 relative">
        {/* Glass Header */}
        <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/[0.04] px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white transition-all shadow-inner"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
               <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Current View</p>
               <p className="text-sm font-bold text-white/80">{navItems.find(i => i.id === activeTab)?.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">{new Date().toLocaleDateString('en-NG', { weekday: 'short' })}</p>
              <p className="text-xs font-bold text-white/60">
                {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="w-px h-8 bg-white/[0.04]" />
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group cursor-help">
               <Calendar size={18} className="text-white/20 group-hover:text-amber-500 transition-colors" />
            </div>
          </div>
        </header>

        {/* Tab Content Rendering */}
        <main className="flex-1 p-6 lg:p-10 overflow-auto scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">
            {CurrentTab}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
}
