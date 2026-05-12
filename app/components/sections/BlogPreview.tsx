'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Calendar, Tag, Clock } from 'lucide-react';

interface NewsPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  publishedAt: string;
}

function formatDateShort(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const categoryColors: Record<string, string> = {
  'Academic News': 'bg-blue-50 text-blue-600 border-blue-100',
  'Announcement': 'bg-amber-50 text-amber-600 border-amber-100',
  Sports: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Announcements: 'bg-amber-50 text-amber-600 border-amber-100',
  'Arts & Culture': 'bg-purple-50 text-purple-600 border-purple-100',
  Alumni: 'bg-rose-50 text-rose-600 border-rose-100',
};

export default function BlogPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

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
          <Link href="/news" className="btn-outline inline-flex group text-sm">
            All Articles
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-poppins text-sm">Loading news...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
             <Tag size={40} className="text-gray-200 mx-auto mb-3" />
             <p className="text-gray-400 text-sm">No news articles yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-3 gap-6"
          >
            {posts.map((post) => (
              <motion.article
                key={post._id}
                variants={cardVariants}
                className="premium-card group overflow-hidden p-0"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48 rounded-t-2xl bg-gray-100">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag size={24} className="text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                  {post.category && (
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-xs font-poppins font-semibold px-3 py-1 rounded-full border ${
                          categoryColors[post.category] || 'bg-white text-gray-600 border-gray-100'
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>
                  )}
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
                      <Clock size={11} />Read More
                    </span>
                  </div>

                  <h3 className="font-poppins font-bold text-primary text-sm leading-tight mb-2 group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/news/${post.slug}`}
                    className="flex items-center gap-1.5 text-primary font-poppins font-semibold text-xs group-hover:gap-2.5 transition-all"
                  >
                    Read Article
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}