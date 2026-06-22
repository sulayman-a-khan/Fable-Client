'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import EbookCard from '@/components/ebooks/EbookCard';
import { FiBookmark } from 'react-icons/fi';

export default function WriterBookmarksPage() {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const { data } = await api.get('/bookmarks');
        if (data.success) {
          const books = data.bookmarks
            .filter((b) => b.ebook)
            .map((b) => b.ebook);
          setBookmarkedBooks(books);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>My Bookmarked Stories</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Ebooks you have saved to read or reference later.</p>
      </div>

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
      ) : bookmarkedBooks.length > 0 ? (
        <div className="grid-ebooks">
          {bookmarkedBooks.map((book) => (
            <EbookCard key={book._id} ebook={book} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FiBookmark />
          </div>
          <h3>No bookmarked books</h3>
          <p>You haven't bookmarked any ebooks yet. Keep track of what you like!</p>
          <Link href="/browse" className="btn btn-primary">
            Explore Books
          </Link>
        </div>
      )}
    </div>
  );
}
