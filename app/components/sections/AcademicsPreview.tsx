'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Beaker,
  Calculator,
  Globe,
  Music,
  Dumbbell,
  Monitor,
  Palette,
} from 'lucide-react';

const tabs = [
  {
    id: 'junior',
    label: 'Junior School',
    subtitle: 'Creche – Primary 5',
    image:
      '/imgi_24_pathfinder.jpg',
    description:
      'Our Junior School (Primary) programme nurtures every child from Creche through Primary 5 in a warm, stimulating environment. We build strong literacy, numeracy, and social foundations through play-based and structured learning.',
    highlights: [
      'Creche, Nursery & Primary classes (Creche – Primary 5)',
      'Phonics-based Reading & Writing mastery',
      'Early STEM exploration & Number skills',
      'Creative Arts, Music & Cultural Studies',
      'Physical Education & Social Development',
      'Christian Religious Studies & Moral Education',
    ],
    subjects: [
      'English Language',
      'Mathematics',
      'Basic Science',
      'Social Studies',
      'CRS',
      'French',
      'Computer',
      'Fine Arts',
      'Music',
      'PE',
    ],
    color: 'from-blue-500 to-blue-400',
  },
  {
    id: 'senior',
    label: 'Senior School',
    subtitle: 'JSS 1 – SS3',
    image:
      '/imgi_8_exam.jpg',
    description:
      'Our Senior School (Secondary) covers JSS 1 through SS3, preparing students for BECE, WAEC, NECO, and university entrance with rigorous academic programs, specialised streams, and world-class teaching methodology.',
    highlights: [
      'JSS 1–3 (Junior Secondary) & SS1–SS3 (Senior Secondary)',
      'Science, Commercial & Arts specialisations (SS)',
      'Dedicated WAEC/NECO exam preparation',
      'University Admission coaching (UTME/DE)',
      'Leadership and entrepreneurship training',
      'Career counselling and mentorship',
    ],
    subjects: [
      'Further Math',
      'Physics',
      'Chemistry',
      'Biology',
      'Economics',
      'Government',
      'Literature',
      'Accounting',
      'Commerce',
      'Geography',
    ],
    color: 'from-gold to-gold-light',
  },
];

const facilities = [
  { icon: Beaker, label: 'Science Labs', count: '3 Labs', color: 'bg-blue-50 text-blue-500' },
  { icon: Monitor, label: 'Computer Lab', count: 'Working PC', color: 'bg-indigo-50 text-indigo-500' },
  {
    icon: BookOpen,
    label: 'Library',
    count: '1,000+ Books',
    color: 'bg-emerald-50 text-emerald-500',
  },
  { icon: Music, label: 'Music Room', count: 'Full Studio', color: 'bg-rose-50 text-rose-500' },
  {
    icon: Dumbbell,
    label: 'Music Room',
    count: 'Full Instruments',
    color: 'bg-amber-50 text-amber-500',
  },
  { icon: Palette, label: 'Art Studio', count: 'Equipped', color: 'bg-purple-50 text-purple-500' },
  {
    icon: Globe,
    label: 'Language Lab',
    count: 'Interactive',
    color: 'bg-teal-50 text-teal-500',
  },
  {
    icon: Calculator,
    label: 'Math Centre',
    count: '24/7 Access',
    color: 'bg-orange-50 text-orange-500',
  },
];

export default function AcademicsPreview() {
  const [activeTab, setActiveTab] = useState('junior');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const activeData = tabs.find((t) => t.id === activeTab)!;

  return (
    <section ref={ref} className="section-padding-lg bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/3 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-tag mb-4 inline-flex">
            <BookOpen size={12} />
            Academic Programmes
          </span>
          <h2 className="section-title mb-4">
            World-Class <span className="gradient-text">Curriculum</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Our comprehensive academic programme develops well-rounded individuals ready for
            university and beyond.
          </p>
          <div className="gold-divider mx-auto mt-5" />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-poppins font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 ml-2 text-xs font-normal ${
                    activeTab === tab.id ? 'text-gold' : 'text-gray-400'
                  }`}
                >
                  {tab.subtitle}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
        >
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-premium">
            <img
              src={activeData.image}
              alt={activeData.label}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            <div
              className={`absolute bottom-6 left-6 bg-gradient-to-r ${activeData.color} text-primary font-poppins font-bold text-sm px-4 py-2 rounded-full`}
            >
              {activeData.subtitle}
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="font-poppins font-bold text-2xl text-primary mb-4">
              {activeData.label} Programme
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">{activeData.description}</p>

            {/* Highlights */}
            <div className="space-y-2.5 mb-6">
              {activeData.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-gray-700 text-sm">
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                  {h}
                </div>
              ))}
            </div>

            {/* Subjects */}
            <div className="mb-6">
              <div className="text-xs font-poppins font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Core Subjects
              </div>
              <div className="flex flex-wrap gap-2">
                {activeData.subjects.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-primary/5 border border-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <Link href="/academics" className="btn-primary inline-flex group text-sm">
              View Full Curriculum
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Facilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="text-center ">
            <h3 className="font-poppins font-bold text-xl text-primary">World-Class Facilities</h3>
            <p className="text-gray-500 text-sm mt-1 mb-10">Equipped for 21st-century learning</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {facilities.map((fac, i) => (
              <motion.div
                key={fac.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }}
                className="premium-card text-center p-4 group"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${fac.color} flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform`}
                >
                  <fac.icon size={18} />
                </div>
                <div className="font-poppins font-semibold text-primary text-xs mb-0.5">
                  {fac.label}
                </div>
                <div className="text-gray-400 text-xs">{fac.count}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}