'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import EbookCard from '@/components/ebooks/EbookCard';
import { FiSearch, FiSliders, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const GENRES = [
  'Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror',
  'Thriller', 'Non-Fiction', 'Biography', 'Self-Help', 'History', 'Poetry'
];

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter & Search states (initialized from URL if present)
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // API response states
  const [ebooks, setEbooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEbooks, setTotalEbooks] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounced search text state to avoid immediate api triggers
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');

  // Function to sync filter states to URL query params
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchText) params.set('search', searchText);
    if (genre) params.set('genre', genre);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort !== 'newest') params.set('sort', sort);
    if (page > 1) params.set('page', page);

    router.replace(`/browse?${params.toString()}`);
  }, [searchText, genre, minPrice, maxPrice, sort, page, router]);

  // Fetch ebooks whenever states or parameters update
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchText);
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchEbooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 8,
        sort
      };
      if (search) params.search = search;
      if (genre) params.genre = genre;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await api.get('/ebooks', { params });
      if (data.success) {
        setEbooks(data.ebooks || []);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalEbooks(data.pagination.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch ebooks', err);
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, genre, minPrice, maxPrice]);

  useEffect(() => {
    fetchEbooks();
    updateURL();
  }, [fetchEbooks, updateURL]);

  // Read pre-selected query param from other pages (like categories click on home)
  useEffect(() => {
    const urlGenre = searchParams.get('genre');
    if (urlGenre && urlGenre !== genre) {
      setGenre(urlGenre);
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearchText('');
    setSearch('');
    setGenre('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="page-wrapper" style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
            Browse <span className="text-gradient">Our Library</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Explore through {totalEbooks} original creations uploaded by emerging and established authors.
          </p>
        </motion.div>

        {/* Filters and Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2.5rem'
        }} className="browse-layout">
          
          {/* Top Search & Filter Bar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Search Input and Sort Row */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {/* Search */}
              <div style={{
                position: 'relative',
                flexGrow: 1,
                minWidth: '280px'
              }}>
                <FiSearch style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '1.1rem'
                }} />
                <input
                  type="text"
                  placeholder="Search by book title or writer name..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="form-input"
                  style={{
                    paddingLeft: '2.8rem'
                  }}
                />
              </div>

              {/* Sorting */}
              <div style={{ width: '200px' }}>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="form-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                paddingBottom: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <FiSliders style={{ color: 'var(--accent-secondary)' }} />
                  <span>Filter Options</span>
                </div>
                {(genre || minPrice || maxPrice || search) && (
                  <button
                    onClick={handleResetFilters}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.85rem',
                      color: 'var(--danger)',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <FiX />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Genre Selector */}
                <div>
                  <label className="form-label">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => {
                      setGenre(e.target.value);
                      setPage(1);
                    }}
                    className="form-select"
                  >
                    <option value="">All Genres</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Price range */}
                <div>
                  <label className="form-label">Price Range</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setPage(1);
                      }}
                      className="form-input"
                      style={{ padding: '0.5rem 0.75rem' }}
                      min="0"
                    />
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setPage(1);
                      }}
                      className="form-input"
                      style={{ padding: '0.5rem 0.75rem' }}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ebooks Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {loading ? (
              <div className="grid-ebooks">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
              <>
                <div className="grid-ebooks">
                  {ebooks.map((ebook, i) => (
                    <EbookCard key={ebook._id} ebook={ebook} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={page === 1}
                      className="pagination-btn"
                    >
                      <FiChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`pagination-btn ${page === p ? 'active' : ''}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={page === totalPages}
                      className="pagination-btn"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No ebooks match your query</h3>
                <p>Try searching for a different title, choosing another genre, or clearing filters.</p>
                <button onClick={handleResetFilters} className="btn btn-secondary">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 992px) {
          .browse-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
