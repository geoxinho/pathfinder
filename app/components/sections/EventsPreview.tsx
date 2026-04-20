'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Clock, CheckCircle2, Hourglass } from 'lucide-react';
import Image from 'next/image';
import { client } from '@/lib/sanity';

// Fallback events used when Sanity returns no data
const FALLBACK_EVENTS = [
  {
    _id: '1',
    title: 'Open Day & School Tour 2025',
    description:
      'Come experience Pathfinder College first-hand. Tour our facilities, meet our teachers, and learn about our admissions process.',
    eventDate: '2025-02-15T09:00:00Z',
    location: 'Pathfinder College Campus, Samonda',
    category: 'Academic',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80',
  },
  {
    _id: '2',
    title: 'Annual Inter-House Sports Championship',
    description:
      'The biggest sporting event of the year. Four houses compete across track, field, football, and swimming events.',
    eventDate: '2025-03-08T08:00:00Z',
    location: 'Pathfinder Sports Complex',
    category: 'Sports',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop&q=80',
  },
  {
    _id: '3',
    title: 'JSS 3 & SSS 3 Graduation Ceremony',
    description:
      'Celebrating the milestone achievements of our outgoing students with family, staff, and distinguished guests.',
    eventDate: '2025-06-20T10:00:00Z',
    location: 'Pathfinder College Auditorium',
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop&q=80',
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const categoryColors: Record<string, string> = {
  'Open Day': 'bg-blue-500',
  Sports: 'bg-emerald-500',
  Graduation: 'bg-gold',
  Academic: 'bg-purple-500',
  Cultural: 'bg-rose-500',
  Community: 'bg-amber-500',
  Commencement: 'bg-gray-500',
  Technology: 'bg-teal-500',
  Fundraising: 'bg-rose-500',
};

interface SanityEvent {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  eventDate: string;
  location?: string;
  category?: string;
  featured?: boolean;
  image?: string;
}

export default function EventsPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [events, setEvents] = useState<SanityEvent[]>([]);
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

  // Show up to 3 events for the preview
  const previewEvents = events.slice(0, 3);

  return (
    <section ref={ref} className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
        >
          <div>
            <span className="section-tag mb-4 inline-flex">
              <Calendar size={12} />
              Upcoming Events
            </span>
            <h2 className="section-title">
              What&apos;s <span className="gradient-text">Coming Up</span>
            </h2>
            <div className="gold-divider mt-4" />
          </div>
          <Link href="/events" className="btn-outline inline-flex group text-sm">
            All Events
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-poppins text-sm">Loading events...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {previewEvents.map((event, i) => {
              const date = event.eventDate ? new Date(event.eventDate) : null;
              const day = date?.getDate();
              const month = date?.toLocaleString('en', { month: 'short' }).toUpperCase();
              const year = date?.getFullYear();

              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="premium-card group overflow-hidden p-0"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden rounded-t-2xl">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-light flex items-center justify-center">
                        <p className="text-white/60 font-poppins text-xs uppercase tracking-widest">
                          {event.category || 'Event'}
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

                    {/* Category badge */}
                    {event.category && (
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-xs text-white font-poppins font-semibold px-3 py-1 rounded-full ${
                            categoryColors[event.category] || 'bg-primary'
                          }`}
                        >
                          {event.category}
                        </span>
                      </div>
                    )}

                    {/* Status tag — Done or Coming Soon */}
                    {date && (
                      <div className="absolute top-3 left-3">
                        {date < new Date() ? (
                          <span className="inline-flex items-center gap-1 text-xs font-poppins font-bold px-3 py-1 rounded-full bg-gray-800/80 text-white backdrop-blur-sm">
                            <CheckCircle2 size={11} className="text-emerald-400" />
                            Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-poppins font-bold px-3 py-1 rounded-full bg-gold text-primary backdrop-blur-sm">
                            <Hourglass size={11} />
                            Coming Soon
                          </span>
                        )}
                      </div>
                    )}

                    {/* Date badge */}
                    {date && (
                      <div className="absolute bottom-3 left-3 bg-white rounded-xl px-3 py-2 text-center shadow-md">
                        <div className="text-primary font-poppins font-black text-xl leading-none">
                          {day}
                        </div>
                        <div className="text-gold font-poppins font-bold text-xs">{month}</div>
                        <div className="text-gray-400 text-xs">{year}</div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-poppins font-bold text-primary text-sm mb-2 group-hover:text-gold transition-colors leading-snug">
                      {event.title}
                    </h3>

                    <div className="space-y-1.5 mb-4">
                      {event.eventDate && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Calendar size={11} className="text-gold" />
                          {formatDate(event.eventDate)}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <MapPin size={11} className="text-gold" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <Link
                      href="/events"
                      className="flex items-center gap-1.5 text-primary font-poppins font-semibold text-xs hover:gap-2.5 transition-all"
                    >
                      Learn More
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Academic Calendar CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 bg-gradient-to-r from-gray-50 to-white rounded-3xl border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Clock size={22} className="text-primary" />
            </div>
            <div>
              <h4 className="font-poppins font-bold text-primary text-sm">
                Academic Calendar 2024/2025
              </h4>
              <p className="text-gray-500 text-xs mt-0.5">
                Download the full academic calendar for the session
              </p>
            </div>
          </div>
          <button className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap">
            Download Calendar
          </button>
        </motion.div>
      </div>
    </section>
  );
}