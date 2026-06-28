'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCompass, FiHeart, FiLock, FiStar, FiGrid, FiBookOpen, FiZap, FiUser, FiClock, FiFeather } from 'react-icons/fi';
import { FaSkull } from 'react-icons/fa';

const GENRES = [
  { name: 'Fiction', icon: FiCompass, gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)' },
  { name: 'Mystery', icon: FiLock, gradient: 'linear-gradient(135deg, #1e1b4b, #6366f1)' },
  { name: 'Romance', icon: FiHeart, gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
  { name: 'Sci-Fi', icon: FiStar, gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { name: 'Fantasy', icon: FiGrid, gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)' },
  { name: 'Horror', icon: FaSkull, gradient: 'linear-gradient(135deg, #450a0a, #991b1b)' },
  { name: 'Thriller', icon: FiZap, gradient: 'linear-gradient(135deg, #d97706, #b45309)' },
  { name: 'Non-Fiction', icon: FiBookOpen, gradient: 'linear-gradient(135deg, #059669, #047857)' },
  { name: 'Biography', icon: FiUser, gradient: 'linear-gradient(135deg, #0891b2, #0e7490)' },
  { name: 'Self-Help', icon: FiFeather, gradient: 'linear-gradient(135deg, #16a34a, #15803d)' },
  { name: 'History', icon: FiClock, gradient: 'linear-gradient(135deg, #92400e, #78350f)' },
  { name: 'Poetry', icon: FiFeather, gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function GenreGrid() {
  return (
    <section className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>Categories</span>
          <h2 style={{ fontFamily: 'var(--font-heading)' }}>Explore by Genre</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Find your next favorite story by browsing through our carefully categorized collection.
          </p>
        </motion.div>

        <motion.div
          className="grid-3"
          style={{ gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {GENRES.map((genre) => {
            const Icon = genre.icon;
            return (
              <motion.div key={genre.name} variants={itemVariants}>
                <Link href={`/browse?genre=${genre.name}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="card"
                    style={{
                      padding: '1.75rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.85rem',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      height: '160px',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Subtle Background Glow */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: genre.gradient,
                      opacity: 0.05,
                      pointerEvents: 'none',
                    }} />

                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: 'var(--radius-md)',
                      background: genre.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
                      zIndex: 1,
                    }}>
                      <Icon />
                    </div>

                    <span style={{
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-heading)',
                      zIndex: 1,
                    }}>
                      {genre.name}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
