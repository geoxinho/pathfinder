'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Globe, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const contactInfo = [
  { icon: MapPin, label: 'Address', value: 'Pathfinder College Road,\nIbadan, Oyo State, Nigeria', color: 'text-blue-500 bg-blue-50' },
  { icon: Phone, label: 'Phone', value: '+234 (0) 801 234 5678', color: 'text-emerald-500 bg-emerald-50' },
  { icon: Mail, label: 'Email', value: 'info@pathfindercollege.edu.ng', color: 'text-gold bg-gold/10' },
];

const socials = [
  { icon: '🌐', label: 'Facebook', href: '#' },
  { icon: '🐦', label: 'Twitter', href: '#' },
  { icon: '💼', label: 'LinkedIn', href: '#' },
  { icon: '📸', label: 'Instagram', href: '#' },
];

export default function ContactPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/8 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
        </div>
        <div className="container-custom relative z-10 pt-32 pb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-5"
          >
            <Phone size={12} />
            Contact Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-poppins font-black text-white text-4xl md:text-5xl mb-4"
          >
            Connect with <span className="gradient-text">Pathfinder</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 max-w-lg mx-auto text-base leading-relaxed"
          >
            Whether you are an aspiring student, a fellow academic, or a community partner, we invite you to reach out and explore the future of education with us.
          </motion.p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-6" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 70 720 60C480 50 240 20 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Form + Info */}
      <section ref={ref} className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inquiry Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="premium-card"
            >
              <h2 className="font-poppins font-bold text-primary text-xl mb-6">Inquiry Form</h2>

              {sent ? (
                <div className="text-center py-12">
                  <p className="text-5xl mb-4">✅</p>
                  <p className="font-poppins font-bold text-primary text-lg">Message Sent!</p>
                  <p className="text-gray-500 text-sm mt-2">We&apos;ll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="email@address.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                    <textarea
                      placeholder="How can we help you?"
                      rows={6}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-y"
                    />
                  </div>
                  <button type="submit" className="btn-primary inline-flex items-center gap-2 text-sm">
                    <Send size={14} /> Send Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Get in Touch + Social */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="premium-card"
              >
                <h2 className="font-poppins font-bold text-primary text-xl mb-6">Get in Touch</h2>
                <div className="space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="font-poppins font-semibold text-primary text-sm mb-0.5">{item.label}</p>
                        <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="font-poppins font-bold text-primary text-sm mb-4">Follow the Journey</p>
                  <div className="grid grid-cols-2 gap-3">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className="flex items-center gap-3 bg-light-gray border border-gray-100 rounded-xl px-4 py-3 text-sm font-poppins font-semibold text-primary hover:border-gold/30 hover:bg-gold/5 transition-all"
                      >
                        <span>{s.icon}</span>{s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="relative h-[420px] overflow-hidden">
        <iframe
          title="Pathfinder College Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4321.874039574019!2d3.89682544379241!3d7.430415542403369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1039f2a92fd968ef%3A0x6e60e156bb5c0565!2sPathfinder%20College!5e0!3m2!1sen!2sng!4v1774868616463!5m2!1sen!2sng"
          width="100%"
          height="100%"
          className="border-0 block"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  );
}
