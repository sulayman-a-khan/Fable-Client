'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import EbookCard from '@/components/ebooks/EbookCard';
import { FiArrowRight } from 'react-icons/fi';

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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem'
        }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Curated Selection</span>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Featured Ebooks</h2>
          </div>
          <Link href="/browse" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}>
            <span>View All Library</span>
            <FiArrowRight />
          </Link>
        </div>

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
          <div className="grid-ebooks">
            {ebooks.map((ebook) => (
              <EbookCard key={ebook._id} ebook={ebook} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 style={{ color: 'var(--text-secondary)' }}>No ebooks available</h3>
            <p>Our writers are currently working on fresh stories. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
