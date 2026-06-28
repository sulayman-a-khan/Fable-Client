'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { FiAward, FiBookOpen, FiUser, FiShoppingBag } from 'react-icons/fi';

const RANK_COLORS = ['#f59e0b', '#94a3b8', '#b45309'];
const RANK_LABELS = ['Gold', 'Silver', 'Bronze'];

export default function TopWriters() {
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopWriters() {
      try {
        const { data } = await api.get('/users/top-writers');
        if (data.success) {
          setWriters(data.writers || []);
        }
      } catch (err) {
        console.error('Failed to fetch top writers', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopWriters();
  }, []);

  return (
    <section className="section" style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>Top Talents</span>
          <h2 style={{ fontFamily: 'var(--font-heading)' }}>Featured Writers</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Meet our most popular authors, contributing exceptional books and inspiring our global reading community.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card skeleton-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div className="skeleton skeleton-avatar" style={{ width: '80px', height: '80px' }}></div>
                <div className="skeleton skeleton-text md"></div>
                <div className="skeleton skeleton-text sm"></div>
              </div>
            ))}
          </div>
        ) : writers.length > 0 ? (
          <div className="grid-3">
            {writers.map((writer, index) => (
              <motion.div
                key={writer._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                className="card"
                style={{
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Rank glow background */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${RANK_COLORS[index]}, transparent)`,
                }} />

                {/* Ranking Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: RANK_COLORS[index],
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}>
                  <FiAward style={{ fontSize: '1.1rem' }} />
                  <span>#{index + 1}</span>
                </div>

                {/* Avatar */}
                <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
                  {writer.avatar ? (
                    <img
                      src={writer.avatar}
                      alt={writer.name}
                      style={{
                        width: '88px',
                        height: '88px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `2px solid ${RANK_COLORS[index]}`,
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      background: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${RANK_COLORS[index]}`,
                    }}>
                      <FiUser style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }} />
                    </div>
                  )}
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                  color: 'var(--text-primary)',
                }}>{writer.name}</h3>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-tertiary)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    <FiBookOpen style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }} />
                    <span><strong>{writer.ebookCount || 0}</strong> Books</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-tertiary)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    <FiShoppingBag style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem' }} />
                    <span><strong>{writer.totalSold || 0}</strong> Sales</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 style={{ color: 'var(--text-secondary)' }}>No featured writers yet</h3>
            <p>Become a writer and publish your first ebook to join our top authors!</p>
          </div>
        )}
      </div>
    </section>
  );
}
