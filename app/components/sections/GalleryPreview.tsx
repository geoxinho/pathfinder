'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Camera, ArrowRight, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';

// Fixed gallery images — no CMS fetch
const GALLERY_ITEMS = [
  {
    id: '1',
    title: 'Question and Answer',
    category: 'Events',
    image: '/gallery_1.jpg',
  },
  {
    id: '2',
    title: 'Jss 1 Class',
    category: 'Classes',
    image: '/gallery_2.jpg',
  },
  {
    id: '3',
    title: 'Debate Competition',
    category: 'Events',
    image: '/gallery_5.jpg',
  },
  {
    id: '4',
    title: 'Junior Categories',
    category: 'primary 5',
    image: '/gallery_4.jpg',
  },
  {
    id: '5',
    title: 'Graduation Ceremony',
    category: 'Event',
    image: '/gallery_6.jpg',
  },
  {
    id: '6',
    title: 'Junior Categories',
    category: 'Class Room',
    image: '/gallery_3.jpg',
  },
];

// Fixed heights for masonry-style variety
const heights = ['h-52', 'h-64', 'h-48', 'h-60', 'h-56', 'h-52'];

export default function GalleryPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [lightbox, setLightbox] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section ref={ref} className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/4 rounded-full blur-3xl" />
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
              <Camera size={12} />
              Our Gallery
            </span>
            <h2 className="section-title">
              Life at <span className="gradient-text">Pathfinder</span>
            </h2>
            <div className="gold-divider mt-4" />
          </div>
          <Link href="/gallery" className="btn-outline inline-flex group text-sm">
            View All Photos
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="columns-2 md:columns-3 gap-4"
          style={{ columnGap: '1rem' }}
        >
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`break-inside-avoid mb-4 relative group rounded-2xl overflow-hidden cursor-pointer ${heights[i % heights.length]}`}
              onClick={() => setLightbox(item.image)}
            >
              {/* Image — object-cover fills every inch of the container */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Zoom icon */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <ZoomIn size={14} className="text-white" />
              </div>

              {/* Caption on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-white font-poppins font-semibold text-xs">{item.title}</div>
                <div className="text-white/70 text-xs mt-0.5 capitalize">{item.category}</div>
              </div>

              {/* Category badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-gold/90 text-primary text-xs font-poppins font-semibold rounded-full capitalize opacity-0 group-hover:opacity-100 transition-opacity">
                {item.category}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <p className="text-gray-500 text-sm mb-4">
            See more moments from campus life, events, and achievements
          </p>
          <Link href="/gallery" className="btn-primary inline-flex group">
            Explore Full Gallery
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          <motion.img
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            src={lightbox}
            alt="Gallery preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </section>
  );
}