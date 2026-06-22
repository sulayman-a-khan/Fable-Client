'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGrid, FiCompass, FiHeart, FiLock, FiStar } from 'react-icons/fi';
import { FaSkull } from 'react-icons/fa';

const GENRES = [
  { name: 'Fiction', icon: FiCompass, gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)' },
  { name: 'Mystery', icon: FiLock, gradient: 'linear-gradient(135deg, #1e1b4b, #312e81)' },
  { name: 'Romance', icon: FiHeart, gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
  { name: 'Sci-Fi', icon: FiStar, gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { name: 'Fantasy', icon: FiGrid, gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)' },
  { name: 'Horror', icon: FaSkull, gradient: 'linear-gradient(135deg, #450a0a, #7f1d1d)' },
];

export default function GenreGrid() {
  return (
    <section className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>Categories</span>
          <h2 style={{ fontFamily: 'var(--font-heading)' }}>Explore by Genre</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Find your next favorite story by browsing through our collection of carefully categorized genres.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {GENRES.map((genre) => {
            const Icon = genre.icon;
            return (
              <Link key={genre.name} href={`/browse?genre=${genre.name}`} style={{ display: 'block' }}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="card"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    height: '180px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle Background Glow */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: genre.gradient,
                    opacity: 0.04,
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}></div>

                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-lg)',
                    background: genre.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.8rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    zIndex: 1
                  }}>
                    <Icon />
                  </div>

                  <span style={{
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    zIndex: 1
                  }}>
                    {genre.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
