'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';
import EbookCard from '@/components/ebooks/EbookCard';
import { FiArrowLeft, FiBookOpen, FiUser } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function WriterEbooksPage() {
  const { id } = useParams();
  const router = useRouter();

  const [ebooks, setEbooks] = useState([]);
  const [writer, setWriter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWriterEbooks() {
      try {
        const { data } = await api.get(`/ebooks/writer/${id}`);
        if (data.success) {
          setEbooks(data.ebooks || []);
          // Extract writer info from the first ebook
          if (data.ebooks?.length > 0 && data.ebooks[0].writer) {
            setWriter(data.ebooks[0].writer);
          }
        }
      } catch (err) {
        console.error('Failed to fetch writer ebooks', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchWriterEbooks();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading writer's collection..." />;
  }

  if (error) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>We could not load this writer's ebooks. Please try again later.</p>
            <Link href="/browse" className="btn btn-primary">Back to Library</Link>
          </div>
        </div>
      </div>
    );
  }

  const writerName = writer?.name || 'Writer';
  const writerAvatar = writer?.avatar;

  return (
    <div className="page-wrapper" style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        {/* Writer Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '1rem'
          }}>
            {writerAvatar ? (
              <img
                src={writerAvatar}
                alt={writerName}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--accent-primary)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
            ) : (
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--accent-primary)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <FiUser style={{ fontSize: '1.5rem', color: 'var(--accent-secondary)' }} />
              </div>
            )}
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.25rem' }}>
                {writerName}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {ebooks.length} published ebook{ebooks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ebooks Grid */}
        {ebooks.length > 0 ? (
          <motion.div
            className="grid-ebooks"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {ebooks.map((ebook, i) => (
              <EbookCard key={ebook._id} ebook={ebook} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><FiBookOpen /></div>
            <h3>No published ebooks yet</h3>
            <p>This writer has not published any ebooks. Check back later!</p>
            <Link href="/browse" className="btn btn-primary">Browse Library</Link>
          </div>
        )}
      </div>
    </div>
  );
}
