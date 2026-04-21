'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { client, urlFor } from '@/lib/sanity';

/* ─────────────────────────────────────────────────
   Fallback galleries (used when Sanity returns empty)
───────────────────────────────────────────────── */
const FALLBACK_GALLERY = [
  {
    _id: 'f1',
    title: 'Science Fair 2024',
    images: [
      { _isFallback: true, url: 'https://images.unsplash.com/photo-1567168539105-d6b1f0e24c48?w=800&h=600&fit=crop&q=80' },
      { _isFallback: true, url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop&q=80' },
      { _isFallback: true, url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop&q=80' },
    ],
  },
  {
    _id: 'f2',
    title: 'Graduation Day',
    images: [
      { _isFallback: true, url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=80' },
      { _isFallback: true, url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop&q=80' },
    ],
  },
  {
    _id: 'f3',
    title: 'Campus Life',
    images: [
      { _isFallback: true, url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop&q=80' },
      { _isFallback: true, url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop&q=80' },
    ],
  },
];

/* helper — get a usable URL from either a Sanity image object or a fallback */
function getImageUrl(img) {
  if (!img) return null;
  if (img._isFallback) return img.url;
  // Sanity reference via asset->
  if (img.asset?.url) return img.asset.url;
  // Sanity reference object (use urlFor builder)
  if (img.asset?._ref || img._ref || img.asset) {
    try { return urlFor(img).width(1200).quality(85).url(); } catch { return null; }
  }
  return null;
}

/* ─────────────────────────────────────────────────
   Lightbox component
───────────────────────────────────────────────── */
function Lightbox({ images, startIndex, albumTitle, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const [dir,     setDir]     = useState(0);

  const go = useCallback((delta) => {
    setDir(delta);
    setCurrent((prev) => (prev + delta + images.length) % images.length);
  }, [images.length]);

  /* keyboard nav */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft')  go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  /* lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const slideVariants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.97 }),
    center:       ({ opacity: 1, x: 0,                  scale: 1    }),
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.97 }),
  };

  const imgUrl = getImageUrl(images[current]);

  return (
    /* ── Outermost backdrop — clicking here closes the lightbox ── */
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(3, 10, 30, 0.96)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >

      {/* ── Close button — outside the stop-propagation wrapper ── */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-4 right-4 z-[10001] w-11 h-11 rounded-full flex items-center justify-center
                   bg-white/15 hover:bg-white/30 text-white border border-white/20
                   transition-all duration-200 active:scale-95"
      >
        <X size={20} />
      </button>

      {/* ── Counter ── */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10001]
                        bg-black/40 text-white/80 font-poppins text-xs px-4 py-1.5 rounded-full select-none
                        border border-white/10 backdrop-blur-sm">
          {current + 1} / {images.length}
        </div>
      )}

      {/* ── Prev arrow ── */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); go(-1); }}
          aria-label="Previous image"
          className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-[10001]
                     w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center
                     bg-white/15 hover:bg-primary border border-white/20 hover:border-primary
                     text-white transition-all duration-200 active:scale-95"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* ── Image area — stop propagation so clicking image doesn't close ── */}
      <div
        className="relative flex items-center justify-center w-full h-full px-16 md:px-24"
        style={{ paddingTop: 'env(safe-area-inset-top, 60px)', paddingBottom: 'env(safe-area-inset-bottom, 60px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={current}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center max-w-5xl w-full"
          >
            {imgUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgUrl}
                alt={`${albumTitle} — photo ${current + 1}`}
                draggable={false}
                className="select-none rounded-2xl shadow-2xl"
                style={{
                  maxWidth:  '100%',
                  maxHeight: 'calc(100dvh - 140px)',
                  width:  'auto',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div className="w-64 h-64 rounded-2xl bg-white/5 flex items-center justify-center text-white/30">
                <ImageIcon size={40} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Next arrow ── */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); go(1); }}
          aria-label="Next image"
          className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-[10001]
                     w-11 h-11 rounded-full flex items-center justify-center
                     bg-white/15 hover:bg-primary border border-white/20 hover:border-primary
                     text-white transition-all duration-200 active:scale-95"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* ── Album title + dot strip ── */}
      <div className="absolute bottom-4 left-0 right-0 z-[10001] flex flex-col items-center gap-3 pointer-events-none">
        <p className="text-white/40 font-poppins text-xs tracking-wide select-none">{albumTitle}</p>
        {images.length > 1 && (
          <div className="flex gap-1.5 pointer-events-auto">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setDir(i > current ? 1 : -1); setCurrent(i); }}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-5 h-2 bg-amber-400'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────
   Main Gallery Page
───────────────────────────────────────────────── */
export default function GalleryPage() {
  const ref     = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  const [albums,   setAlbums]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [lightbox, setLightbox] = useState(null); // { images, index, albumTitle }

  const openLightbox  = (images, index, albumTitle) => setLightbox({ images, index, albumTitle });
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    async function fetchGallery() {
      try {
        /* Fetch both a direct URL (if stored that way) and the raw reference */
        const data = await client.fetch(
          `*[_type == "gallery"] | order(publishedAt desc) {
            _id, title, subtitle, publishedAt,
            "images": images[]{
              asset->{ _id, url, _ref },
              "ref": asset._ref
            }
          }`,
        );
        if (data?.length > 0) {
          setAlbums(data);
        } else {
          setAlbums(FALLBACK_GALLERY);
        }
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setAlbums(FALLBACK_GALLERY);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  /* Normalise images array for each album */
  function getValidImages(album) {
    if (!album.images) return [];
    return album.images.filter((img) => {
      if (img?._isFallback) return true;
      return getImageUrl(img) !== null;
    });
  }

  return (
    <main className="bg-white">

      {/* ── Hero ── */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/8 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
        </div>
        <div className="container-custom relative z-10 pt-32 pb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold
                       font-poppins font-semibold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-5"
          >
            <Camera size={12} /> Our Gallery
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-poppins font-black text-white text-4xl md:text-5xl mb-4"
          >
            Life at <span className="gradient-text">Pathfinder</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 max-w-lg mx-auto text-base leading-relaxed"
          >
            Capturing vibrant moments, achievements, and memorable events at Pathfinder College.
          </motion.p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-6" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 70 720 60C480 50 240 20 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Gallery grid ── */}
      <section ref={ref} className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-poppins text-sm">Loading gallery…</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="premium-card text-center py-16">
              <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="font-poppins font-bold text-primary text-lg mb-2">No albums yet</p>
              <p className="text-gray-500 text-sm">Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-16">
              {albums.map((album, albumIdx) => {
                const validImages = getValidImages(album);
                return (
                  <motion.div
                    key={album._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: albumIdx * 0.12 }}
                  >
                    {/* Album header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="gold-divider" />
                      <h2 className="font-poppins font-bold text-primary text-xl md:text-2xl">{album.title}</h2>
                    </div>
                    {album.subtitle && <p className="text-gray-500 text-sm mb-3">{album.subtitle}</p>}
                    {album.publishedAt && (
                      <span className="inline-block text-xs font-poppins font-semibold text-gray-400
                                       bg-gray-100 px-3 py-1 rounded-full mb-5">
                        {new Date(album.publishedAt).toLocaleDateString('en-NG', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </span>
                    )}

                    {validImages.length > 0 ? (
                      /* 2-col on mobile, 3-col on desktop */
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                        {validImages.map((image, idx) => {
                          const thumbUrl = getImageUrl(image);
                          if (!thumbUrl) return null;
                          return (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : {}}
                              transition={{ duration: 0.35, delay: 0.05 * idx }}
                              onClick={() => openLightbox(validImages, idx, album.title)}
                              className="relative aspect-square rounded-2xl overflow-hidden group
                                         shadow-sm hover:shadow-xl transition-all duration-300
                                         hover:-translate-y-1 focus:outline-none focus:ring-2
                                         focus:ring-primary focus:ring-offset-2"
                              aria-label={`Open ${album.title} – photo ${idx + 1}`}
                            >
                              <Image
                                src={thumbUrl}
                                alt={`${album.title} ${idx + 1}`}
                                fill
                                unoptimized={thumbUrl.startsWith('https://images.unsplash')}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                              />
                              {/* Hover overlay with zoom icon */}
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                              flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center
                                                translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                  <ZoomIn size={18} className="text-white" />
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No images in this album yet.</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox portal ── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.index}
            albumTitle={lightbox.albumTitle}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
