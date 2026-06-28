'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import EbookCard from '@/components/ebooks/EbookCard';
import { FiBookOpen } from 'react-icons/fi';

export default function UserLibraryPage() {
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const { data } = await api.get('/transactions/user');
        if (data.success) {
          const books = data.transactions
            .filter((t) => t.status === 'completed' && t.ebook)
            .map((t) => ({ ...t.ebook, writer: t.writer }));
          const uniqueBooks = Array.from(new Map(books.map((item) => [item._id, item])).values());
          setLibraryBooks(uniqueBooks);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLibrary();
  }, []);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>My Digital Library</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {loading ? 'Loading…' : `${libraryBooks.length} unlocked book${libraryBooks.length !== 1 ? 's' : ''} — click any to start reading`}
        </p>
      </motion.div>

      {loading ? (
        <div className="grid-ebooks">
          {[1, 2, 3, 4].map((i) => (
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
      ) : libraryBooks.length > 0 ? (
        <motion.div
          className="grid-ebooks"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {libraryBooks.map((book, i) => (
            <EbookCard key={book._id} ebook={book} index={i} />
          ))}
        </motion.div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><FiBookOpen /></div>
          <h3>Your bookshelf is empty</h3>
          <p>You haven't unlocked any books yet. Start exploring now!</p>
          <Link href="/browse" className="btn btn-primary">Find Books</Link>
        </div>
      )}
    </div>
  );
}
