'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FiAward, FiBookOpen, FiUser } from 'react-icons/fi';

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
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>Top Talents</span>
          <h2 style={{ fontFamily: 'var(--font-heading)' }}>Featured Writers</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Meet our most popular authors, contributing exceptional books and inspiring our global reading community.
          </p>
        </div>

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
              <div key={writer._id} className="card" style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
              }}>
                {/* Ranking Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: index === 0 ? '#f59e0b' : index === 1 ? '#cbd5e1' : '#b45309',
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  <FiAward style={{ fontSize: '1.2rem' }} />
                  <span>#{index + 1}</span>
                </div>

                {/* Avatar */}
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  {writer.avatar ? (
                    <img
                      src={writer.avatar}
                      alt={writer.name}
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--glass-border)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      background: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--glass-border)'
                    }}>
                      <FiUser style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }} />
                    </div>
                  )}
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>{writer.name}</h3>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.5rem'
                }}>{writer.email}</p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-tertiary)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  <FiBookOpen style={{ color: 'var(--accent-secondary)' }} />
                  <span>
                    <strong>{writer.salesCount || 0}</strong> Ebook Sales
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 style={{ color: 'var(--text-secondary)' }}>No writers featured</h3>
            <p>Become a writer and upload your creation to become our top author!</p>
          </div>
        )}
      </div>
    </section>
  );
}
