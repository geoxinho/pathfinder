'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/lib/sanity';

const FALLBACK_EVENTS = [
  {
    _id: '1', title: 'Open Day & School Tour 2025', featured: true,
    description: 'Come experience Pathfinder College first-hand. Tour our facilities, meet our teachers, and learn about our admissions process.',
    eventDate: '2025-02-15T09:00:00Z', location: 'Pathfinder College Campus, Samonda', category: 'Academic',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80',
  },
  {
    _id: '2', title: 'Annual Inter-House Sports Championship',
    description: 'The biggest sporting event of the year. Four houses compete across track, field, football, and swimming events.',
    eventDate: '2025-03-08T08:00:00Z', location: 'Pathfinder Sports Complex', category: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop&q=80',
  },
  {
    _id: '3', title: 'JSS 3 & SSS 3 Graduation Ceremony',
    description: 'Celebrating the milestone achievements of our outgoing students with family, staff, and distinguished guests.',
    eventDate: '2025-06-20T10:00:00Z', location: 'Pathfinder College Auditorium', category: 'Community',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop&q=80',
  },
];

const categoryColors = {
  Academic: 'bg-blue-50 text-blue-600 border-blue-100',
  Cultural: 'bg-purple-50 text-purple-600 border-purple-100',
  Community: 'bg-amber-50 text-amber-600 border-amber-100',
  Sports: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Commencement: 'bg-gray-50 text-gray-600 border-gray-100',
  Technology: 'bg-teal-50 text-teal-600 border-teal-100',
  Fundraising: 'bg-rose-50 text-rose-600 border-rose-100',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function EventsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await client.fetch(
          `*[_type == "event"] | order(eventDate asc) {
            _id, title, subtitle, eventDate, location,
            category, description, featured,
            "image": image.asset->url
          }`
        );
        setEvents(data && data.length > 0 ? data : FALLBACK_EVENTS);
      } catch {
        setEvents(FALLBACK_EVENTS);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const now = new Date();
  const featured = events.find((e) => e.featured);
  const upcoming = events.filter((e) => !e.featured && new Date(e.eventDate) >= now);
  const past = events.filter((e) => !e.featured && new Date(e.eventDate) < now);

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
            <Calendar size={12} />
            Upcoming Events
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-poppins font-black text-white text-4xl md:text-5xl mb-4"
          >
            What&apos;s <span className="gradient-text">Coming Up</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 max-w-lg mx-auto text-base leading-relaxed"
          >
            Discover a vibrant community where knowledge meets action. Join our upcoming academic symposiums, sporting traditions, and cultural celebrations.
          </motion.p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-6" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 70 720 60C480 50 240 20 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-poppins text-sm">Loading events...</p>
            </div>
          ) : (
            <>
              {/* Featured Event */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="premium-card p-0 overflow-hidden mb-12"
                >
                  <div className="grid lg:grid-cols-2">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <span className="inline-flex items-center gap-2 bg-gold/15 text-gold font-poppins font-semibold text-xs tracking-widest uppercase px-3 py-1.5 rounded-full mb-5 w-fit">
                        ⭐ Featured Event
                      </span>
                      <h2 className="font-poppins font-bold text-primary text-2xl md:text-3xl mb-4 leading-tight">
                        {featured.title}
                      </h2>
                      <div className="space-y-2 mb-4">
                        {featured.eventDate && (
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar size={14} className="text-gold" />
                            {formatDate(featured.eventDate)}
                          </div>
                        )}
                        {featured.location && (
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <MapPin size={14} className="text-gold" />
                            {featured.location}
                          </div>
                        )}
                      </div>
                      {featured.description && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">{featured.description}</p>
                      )}
                      <button className="btn-primary w-fit text-sm">Register Attendance</button>
                    </div>
                    <div className="relative min-h-[280px] bg-primary-light">
                      {featured.image ? (
                        <Image src={featured.image} alt={featured.title} fill className="object-cover" sizes="50vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-white/50 font-poppins text-sm uppercase tracking-widest">{featured.category || 'Event'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Upcoming Events */}
              <div className="mb-12">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="section-tag mb-3 inline-flex"><Clock size={12} /> Upcoming</span>
                    <h2 className="section-title">Upcoming <span className="gradient-text">Engagements</span></h2>
                    <div className="gold-divider mt-3" />
                  </div>
                </div>

                {upcoming.length === 0 && !featured ? (
                  <div className="premium-card text-center py-16">
                    <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="font-poppins font-bold text-primary text-lg mb-2">No upcoming events</p>
                    <p className="text-gray-500 text-sm">Check back soon for new events!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcoming.map((event, i) => {
                      const date = event.eventDate ? new Date(event.eventDate) : null;
                      return (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.5, delay: 0.1 * i }}
                          className="premium-card group overflow-hidden p-0"
                        >
                          <div className="relative h-44 overflow-hidden rounded-t-2xl">
                            {event.image ? (
                              <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="33vw" />
                            ) : (
                              <div className="w-full h-full bg-primary-light flex items-center justify-center">
                                <p className="text-white/60 font-poppins text-xs uppercase tracking-widest">{event.category || 'Event'}</p>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
                            {event.category && (
                              <div className="absolute top-3 right-3">
                                <span className={`text-xs font-poppins font-semibold px-3 py-1 rounded-full border ${categoryColors[event.category] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                  {event.category}
                                </span>
                              </div>
                            )}
                            {date && (
                              <div className="absolute bottom-3 left-3 bg-white rounded-xl px-3 py-2 text-center shadow-md">
                                <div className="text-primary font-poppins font-black text-xl leading-none">{date.getDate()}</div>
                                <div className="text-gold font-poppins font-bold text-xs">{date.toLocaleString('en', { month: 'short' }).toUpperCase()}</div>
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="font-poppins font-bold text-primary text-sm mb-2 group-hover:text-gold transition-colors leading-snug">
                              {event.title}
                            </h3>
                            <div className="space-y-1.5 mb-3">
                              {event.eventDate && (
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                  <Calendar size={11} className="text-gold" /> {formatDate(event.eventDate)}
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                  <MapPin size={11} className="text-gold" /> {event.location}
                                </div>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{event.description}</p>
                            )}
                            <span className="flex items-center gap-1.5 text-primary font-poppins font-semibold text-xs hover:gap-2.5 transition-all cursor-pointer">
                              Learn More <ArrowRight size={12} />
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Past Events */}
              {past.length > 0 && (
                <div>
                  <h2 className="font-poppins font-bold text-primary text-xl mb-6">Archived Moments</h2>
                  <div className="space-y-3">
                    {past.map((event) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4 }}
                        className="premium-card flex items-center gap-4 p-4"
                      >
                        <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-primary-light">
                          {event.image ? (
                            <Image src={event.image} alt={event.title} fill className="object-cover" sizes="64px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <p className="text-white/60 text-xs">{event.category}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                            {event.eventDate ? formatDate(event.eventDate) : ''}{event.eventDate && event.category ? ' · ' : ''}{event.category}
                          </p>
                          <p className="font-poppins font-bold text-primary text-sm truncate">{event.title}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
