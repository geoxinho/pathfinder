'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { client } from '@/lib/sanity';
import { useState, useEffect } from 'react';

const FALLBACK_GALLERY = [
  { _id: '1', title: 'Science Fair 2024', images: [{ asset: { url: 'https://images.unsplash.com/photo-1567168539105-d6b1f0e24c48?w=600&h=400&fit=crop&q=80' } }] },
  { _id: '2', title: 'Graduation Day', images: [{ asset: { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=500&fit=crop&q=80' } }] },
  { _id: '3', title: 'Campus Life', images: [{ asset: { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=450&fit=crop&q=80' } }] },
];

export default function GalleryPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const data = await client.fetch(
          `*[_type == "gallery"] | order(publishedAt desc) {
            _id, title, subtitle, publishedAt,
            "images": images[]{ asset->{ _id, url } }
          }`
        );
        setAlbums(data && data.length > 0 ? data : FALLBACK_GALLERY);
      } catch {
        setAlbums(FALLBACK_GALLERY);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

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
            <Camera size={12} />
            Our Gallery
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-poppins font-black text-white text-4xl md:text-5xl mb-4"
          >
            Life at <span className="gradient-text">Pathfinder</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 max-w-lg mx-auto text-base leading-relaxed"
          >
            Capturing the vibrant moments, academic achievements, and memorable events at Pathfinder College.
          </motion.p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-6" />
        </div>
        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 70 720 60C480 50 240 20 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Gallery Content */}
      <section ref={ref} className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-poppins text-sm">Loading gallery...</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="premium-card text-center py-16">
              <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="font-poppins font-bold text-primary text-lg mb-2">No albums yet</p>
              <p className="text-gray-500 text-sm">Check back soon for photos from campus life!</p>
            </div>
          ) : (
            <div className="space-y-16">
              {albums.map((album, albumIdx) => (
                <motion.div
                  key={album._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: albumIdx * 0.15 }}
                >
                  {/* Album Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="gold-divider" />
                    <h2 className="font-poppins font-bold text-primary text-2xl">{album.title}</h2>
                  </div>
                  {album.subtitle && (
                    <p className="text-gray-500 text-sm mb-4 -mt-2">{album.subtitle}</p>
                  )}
                  {album.publishedAt && (
                    <span className="inline-block text-xs font-poppins font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full mb-6">
                      {new Date(album.publishedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}

                  {/* Images Grid */}
                  {album.images?.filter((img) => img?.asset?.url).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {album.images
                        .filter((img) => img?.asset?.url)
                        .map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-1"
                          >
                            <Image
                              src={image.asset.url}
                              alt={`${album.title} ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </motion.div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-sm">No images in this album yet.</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
