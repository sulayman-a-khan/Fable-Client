'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import api from '@/lib/api';
import { FiArrowRight, FiTag, FiUser } from 'react-icons/fi';

// Import Swiper styles (loaded via CDN in globals or inline)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function NewReleasesCarousel() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNew() {
      try {
        const { data } = await api.get('/ebooks?sort=newest&limit=10');
        if (data.success) {
          setEbooks(data.ebooks || []);
        }
      } catch (err) {
        console.error('Failed to fetch new releases', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNew();
  }, []);

  if (loading || ebooks.length === 0) return null;

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)', overflow: 'hidden' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem'
          }}
        >
          <div>
            <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-secondary)', marginBottom: '0.75rem' }}>
              Just Added
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>New Releases</h2>
          </div>
          <Link href="/browse?sort=newest" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'var(--accent-secondary)'
          }}>
            <span>See All</span>
            <FiArrowRight />
          </Link>
        </motion.div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={2}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          style={{ paddingBottom: '3rem' }}
        >
          {ebooks.map((ebook) => (
            <SwiperSlide key={ebook._id}>
              <Link href={`/ebooks/${ebook._id}`} style={{ display: 'block', textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.03 }}
                  transition={{ duration: 0.25 }}
                  className="card"
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '3/4.2', overflow: 'hidden' }}>
                    <img
                      src={ebook.coverImage || 'https://placehold.co/300x420?text=No+Cover'}
                      alt={ebook.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onError={(e) => { e.target.src = 'https://placehold.co/300x420?text=No+Cover'; }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(6,11,24,0.9) 0%, transparent 60%)',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      left: '0.75rem',
                      right: '0.75rem',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'white',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '0.25rem'
                      }}>{ebook.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FiUser style={{ fontSize: '0.7rem' }} />{ebook.writer?.name}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <FiTag style={{ fontSize: '0.7rem' }} />
                          {ebook.price === 0 ? 'Free' : `$${ebook.price.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: var(--accent-primary) !important;
          background: var(--bg-elevated);
          width: 40px !important;
          height: 40px !important;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
        }
        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 14px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet {
          background: var(--text-muted) !important;
        }
        .swiper-pagination-bullet-active {
          background: var(--accent-primary) !important;
        }
      `}</style>
    </section>
  );
}
