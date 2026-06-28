'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import EbookCard from '@/components/ebooks/EbookCard';
import { FiArrowRight } from 'react-icons/fi';

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data } = await api.get('/ebooks/featured');
        if (data.success) {
          setEbooks(data.ebooks || []);
        }
      } catch (err) {
        console.error('Failed to fetch featured ebooks', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="section" style={{ background: 'var(--bg-primary)' }}>
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
            marginBottom: '3rem'
          }}
        >
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Curated Selection</span>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Featured Ebooks</h2>
          </div>
          <Link href="/browse" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'var(--accent-primary)'
          }}>
            <span>View All Library</span>
            <FiArrowRight />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid-ebooks">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card skeleton-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="skeleton skeleton-image" style={{ aspectRatio: '3/4.2' }}></div>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                  <div className="skeleton skeleton-text lg" style={{ marginBottom: '0.75rem' }}></div>
                  <div className="skeleton skeleton-text md" style={{ marginBottom: '1.5rem' }}></div>
                  <div className="skeleton skeleton-text sm"></div>
                </div>
              </div>
            ))}
          </div>
        ) : ebooks.length > 0 ? (
          <motion.div
            className="grid-ebooks"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {ebooks.map((ebook, i) => (
              <EbookCard key={ebook._id} ebook={ebook} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="empty-state">
            <h3 style={{ color: 'var(--text-secondary)' }}>No ebooks available yet</h3>
            <p>Our writers are currently working on fresh stories. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
