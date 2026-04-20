'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Tag, ArrowRight, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { client, urlFor } from '@/lib/sanity';

const categoryColors = {
  Announcement: 'bg-blue-50 text-blue-600 border-blue-100',
  Achievement: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Academic: 'bg-purple-50 text-purple-600 border-purple-100',
  Sports: 'bg-amber-50 text-amber-600 border-amber-100',
  Community: 'bg-rose-50 text-rose-600 border-rose-100',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function getExcerpt(post) {
  if (post.excerpt) return post.excerpt;
  if (typeof post.body === 'string') return post.body.slice(0, 140) + '…';
  if (Array.isArray(post.body)) {
    const text = post.body
      .filter((b) => b._type === 'block')
      .flatMap((b) => b.children?.map((c) => c.text) ?? [])
      .join(' ');
    return text.slice(0, 140) + (text.length > 140 ? '…' : '');
  }
  return '';
}

function getImageUrl(post) {
  if (!post.coverImage) return null;
  try {
    return urlFor(post.coverImage).width(600).height(400).url();
  } catch {
    return null;
  }
}

export default function NewsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await client.fetch(
          `*[_type == "news"] | order(publishedAt desc) {
            _id, title, slug, excerpt, body, coverImage, publishedAt, category, author
          }`
        );
        setPosts(data || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const [featured, ...rest] = posts;

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
            <Tag size={12} />
            News & Blog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-poppins font-black text-white text-4xl md:text-5xl mb-4"
          >
            News & <span className="gradient-text">Announcements</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 max-w-lg mx-auto text-base leading-relaxed"
          >
            Stay informed with the latest happenings, achievements, and updates from across the Pathfinder College community.
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
              <p className="text-gray-500 font-poppins text-sm">Loading news...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="premium-card text-center py-16">
              <p className="text-4xl mb-4">📭</p>
              <p className="font-poppins font-bold text-primary text-lg mb-2">No announcements yet</p>
              <p className="text-gray-500 text-sm">Check back soon — great things are coming!</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <Link href={`/news/${featured.slug?.current}`} className="block">
                    <div className="premium-card p-0 overflow-hidden group">
                      <div className="grid lg:grid-cols-2">
                        {/* Image */}
                        <div className="relative min-h-[280px] bg-primary-light overflow-hidden">
                          {getImageUrl(featured) ? (
                            <img
                              src={getImageUrl(featured)}
                              alt={featured.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                              <span className="text-5xl">📰</span>
                              <span className="text-white/40 text-xs uppercase tracking-widest font-poppins">Featured Story</span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="bg-gold text-primary font-poppins font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                              Featured
                            </span>
                          </div>
                        </div>
                        {/* Text */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-5">
                            {featured.category && (
                              <span className={`text-xs font-poppins font-semibold px-3 py-1 rounded-full border ${categoryColors[featured.category] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                {featured.category}
                              </span>
                            )}
                            <span className="text-gray-400 text-xs">{formatDate(featured.publishedAt)}</span>
                          </div>
                          <h2 className="font-poppins font-bold text-primary text-2xl md:text-3xl mb-4 leading-tight group-hover:text-gold transition-colors">
                            {featured.title}
                          </h2>
                          <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            {getExcerpt(featured)}
                          </p>
                          <span className="flex items-center gap-2 text-primary font-poppins font-semibold text-sm group-hover:gap-3 transition-all">
                            Read Full Story <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <>
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <h2 className="font-poppins font-bold text-primary text-xl">Latest Stories</h2>
                      <div className="gold-divider mt-3" />
                    </div>
                    <span className="text-gray-400 text-sm">{rest.length} article{rest.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post, i) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 * i }}
                      >
                        <Link href={`/news/${post.slug?.current}`} className="block h-full">
                          <article className="premium-card p-0 overflow-hidden group h-full flex flex-col">
                            {/* Thumbnail */}
                            <div className="relative h-44 overflow-hidden rounded-t-2xl bg-primary-light flex-shrink-0">
                              {getImageUrl(post) ? (
                                <img
                                  src={getImageUrl(post)}
                                  alt={post.title}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-4xl">📄</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                              {post.category && (
                                <div className="absolute top-3 left-3">
                                  <span className={`text-xs font-poppins font-semibold px-3 py-1 rounded-full border ${categoryColors[post.category] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                    {post.category}
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* Body */}
                            <div className="p-5 flex-1 flex flex-col">
                              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(post.publishedAt)}</span>
                              </div>
                              <h3 className="font-poppins font-bold text-primary text-sm leading-tight mb-2 group-hover:text-gold transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3 flex-1">
                                {getExcerpt(post)}
                              </p>
                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                {post.author && <span className="text-gray-400 text-xs">By {post.author}</span>}
                                <span className="flex items-center gap-1.5 text-primary font-poppins font-semibold text-xs ml-auto">
                                  Read more <ArrowRight size={12} />
                                </span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
