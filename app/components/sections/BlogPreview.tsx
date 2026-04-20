'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Calendar, Tag, Clock } from 'lucide-react';

// Inline mock blog data — replace with your CMS/API data
const MOCK_BLOG_POSTS = [
  {
    _id: '1',
    title: 'Pathfinder Students Sweep Regional Science Competition',
    slug: { current: 'pathfinder-students-sweep-regional-science-competition' },
    excerpt:
      'Our JSS 3 students took home three gold medals at the 2024 South-West Regional Science Fair, proving that excellence is a culture at Pathfinder College.',
    mainImage:
      'https://images.unsplash.com/photo-1567168539105-d6b1f0e24c48?w=600&h=400&fit=crop&q=80',
    category: 'Academic News',
    publishedAt: '2024-11-15T10:00:00Z',
    tags: ['science', 'achievement'],
  },
  {
    _id: '2',
    title: 'Inter-House Sports Day 2024 — A Celebration of Spirit',
    slug: { current: 'inter-house-sports-day-2024' },
    excerpt:
      'The Pathfinder campus came alive this October as students from all four houses competed in track, field, and team events in our annual Inter-House Sports Day.',
    mainImage:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop&q=80',
    category: 'Sports',
    publishedAt: '2024-10-28T09:00:00Z',
    tags: ['sports', 'events'],
  },
  {
    _id: '3',
    title: 'Admissions Open for 2025/2026 Academic Session',
    slug: { current: 'admissions-open-2025-2026' },
    excerpt:
      "Applications are now open for both Junior (JSS 1) and Senior (SSS 1) entry. Secure your child's spot in one of Ibadan's most prestigious schools.",
    mainImage:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80',
    category: 'Announcements',
    publishedAt: '2024-10-01T08:00:00Z',
    tags: ['admissions', 'news'],
  },
];

function formatDateShort(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const categoryColors: Record<string, string> = {
  'Academic News': 'bg-blue-50 text-blue-600 border-blue-100',
  Sports: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Announcements: 'bg-amber-50 text-amber-600 border-amber-100',
  'Arts & Culture': 'bg-purple-50 text-purple-600 border-purple-100',
  Alumni: 'bg-rose-50 text-rose-600 border-rose-100',
};

export default function BlogPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } },
  };

  return (
    <section ref={ref} className="section-padding bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-primary/4 rounded-full translate-y-1/2 blur-3xl" />
      </div>

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
              <Tag size={12} />
              News & Blog
            </span>
            <h2 className="section-title">
              Latest from <span className="gradient-text">Our Campus</span>
            </h2>
            <div className="gold-divider mt-4" />
          </div>
          <Link href="/blog" className="btn-outline inline-flex group text-sm">
            All Articles
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6"
        >
          {MOCK_BLOG_POSTS.map((post) => (
            <motion.article
              key={post._id}
              variants={cardVariants}
              className="premium-card group overflow-hidden p-0"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48 rounded-t-2xl">
                <Image
                  src={post.mainImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-xs font-poppins font-semibold px-3 py-1 rounded-full border ${
                      categoryColors[post.category] || 'bg-gray-50 text-gray-600 border-gray-100'
                    }`}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDateShort(post.publishedAt)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="flex items-center gap-1">
                    <Clock size={11} />5 min read
                  </span>
                </div>

                <h3 className="font-poppins font-bold text-primary text-sm leading-tight mb-2 group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-primary/5 text-primary/60 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/blog/${post.slug.current}`}
                  className="flex items-center gap-1.5 text-primary font-poppins font-semibold text-xs group-hover:gap-2.5 transition-all"
                >
                  Read Article
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}