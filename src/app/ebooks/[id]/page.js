'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiBook, FiBookmark, FiHeart, FiUser, FiCalendar, FiTag, FiShoppingBag, FiArrowLeft, FiUnlock, FiClock } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EbookCard from '@/components/ebooks/EbookCard';

export default function EbookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [purchaseChecking, setPurchaseChecking] = useState(true);
  const [bookmarkChecking, setBookmarkChecking] = useState(true);
  const [buying, setBuying] = useState(false);
  const [relatedEbooks, setRelatedEbooks] = useState([]);

  const fetchEbookDetails = useCallback(async () => {
    try {
      const { data } = await api.get(`/ebooks/${id}`);
      if (data.success) {
        setEbook(data.ebook);
        // Fetch related in background
        api.get(`/ebooks/${id}/related`).then(({ data: rel }) => {
          if (rel.success) setRelatedEbooks(rel.ebooks || []);
        }).catch(() => {});
        // Fetch public bookmark count
        api.get(`/bookmarks/count/${id}`).then(({ data: bc }) => {
          if (bc.success) setBookmarkCount(bc.count || 0);
        }).catch(() => {});
      } else {
        toast.error('Ebook not found');
        router.push('/browse');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load ebook details');
      router.push('/browse');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const checkPurchaseStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setPurchaseChecking(false);
      return;
    }
    try {
      const { data } = await api.get(`/transactions/check/${id}`);
      if (data.success) {
        setPurchased(data.purchased);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPurchaseChecking(false);
    }
  }, [id, isAuthenticated]);

  const checkBookmarkStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setBookmarkChecking(false);
      return;
    }
    try {
      const { data } = await api.get(`/bookmarks/check/${id}`);
      if (data.success) {
        setBookmarked(data.bookmarked);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarkChecking(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (id) {
      fetchEbookDetails();
      checkPurchaseStatus();
      checkBookmarkStatus();
    }
  }, [id, fetchEbookDetails, checkPurchaseStatus, checkBookmarkStatus]);

  // Reset buying state if returning via browser back button (bfcache)
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setBuying(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark ebooks');
      router.push('/login');
      return;
    }

    try {
      const { data } = await api.post(`/bookmarks/${id}`);
      if (data.success) {
        setBookmarked(data.bookmarked);
        setBookmarkCount((prev) => data.bookmarked ? prev + 1 : Math.max(0, prev - 1));
        toast.success(data.bookmarked ? 'Bookmarked!' : 'Removed from bookmarks');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle bookmark');
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase ebooks');
      router.push('/login');
      return;
    }

    setBuying(true);
    try {
      const { data } = await api.post('/transactions/checkout', { ebookId: id });
      if (data.success && data.sessionUrl) {
        toast.loading('Redirecting to secure payment...', { duration: 2000 });
        window.location.href = data.sessionUrl;
        setTimeout(() => setBuying(false), 2000);
      } else {
        toast.error('Failed to initiate checkout');
        setBuying(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Payment initiation failed');
      setBuying(false);
    }
  };

  if (loading || purchaseChecking || bookmarkChecking) {
    return <LoadingSpinner size="lg" text="Loading book details..." />;
  }

  if (!ebook) return null;

  const isAuthor = user && user._id === ebook.writer?._id;
  const isAdmin = user && user.role === 'admin';
  const hasAccess = purchased || isAuthor || isAdmin || ebook.price === 0;

  return (
    <div className="page-wrapper" style={{ padding: '4rem 0' }}>
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
          <span>Back to Library</span>
        </button>

        {/* Ebook Main Details Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem'
          }}>
            {/* Left Column: Cover Image */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '3/4.2',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--glass-border)'
              }}>
                <img
                  src={ebook.coverImage}
                  alt={ebook.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x420?text=No+Cover';
                  }}
                />
              </div>
            </div>

            {/* Right Column: Book Details */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="badge badge-primary">{ebook.genre}</span>
                {hasAccess && (
                  <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiUnlock />
                    Unlocked
                  </span>
                )}
              </div>

              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                lineHeight: '1.2',
                marginBottom: '1rem'
              }}>{ebook.title}</h1>

              {/* Writer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '1.05rem',
                color: 'var(--text-secondary)'
              }}>
                {ebook.writer?.avatar ? (
                  <img
                    src={ebook.writer.avatar}
                    alt={ebook.writer.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <FiUser style={{ color: 'var(--accent-secondary)' }} />
                )}
                <span>By <Link href={`/writers/${ebook.writer?._id}`} style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}><strong>{ebook.writer?.name || 'Unknown Writer'}</strong></Link></span>
              </div>

              {/* Book Metadata */}
              <div style={{
                display: 'flex',
                gap: '2rem',
                padding: '1rem 0',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>PUBLISHED</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    <FiCalendar />
                    <span>{new Date(ebook.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>PRICE</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
                    <FiTag style={{ color: 'var(--accent-secondary)' }} />
                    <span>{ebook.price === 0 ? 'Free' : `$${ebook.price.toFixed(2)}`}</span>
                  </div>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>COPIES SOLD</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    <FiShoppingBag />
                    <span>{ebook.totalSold || 0}</span>
                  </div>
                </div>

                {ebook.readingTimeMinutes > 0 && (
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>READ TIME</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      <FiClock style={{ color: 'var(--accent-secondary)' }} />
                      <span>~{ebook.readingTimeMinutes} min</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {hasAccess ? (
                  <a href="#reading-pane" className="btn btn-accent btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiBook />
                    <span>Start Reading Now</span>
                  </a>
                ) : isAuthor ? (
                  <button className="btn btn-secondary btn-lg" disabled>
                    Your Creation
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={buying}
                    className="btn btn-primary btn-lg"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <FiShoppingBag />
                    <span>{buying ? 'Processing...' : `Buy Ebook for $${ebook.price.toFixed(2)}`}</span>
                  </button>
                )}

                <button
                  onClick={handleToggleBookmark}
                  className={`btn ${bookmarked ? 'btn-accent' : 'btn-secondary'} btn-lg`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <FiBookmark fill={bookmarked ? 'currentColor' : 'none'} />
                  <span>{bookmarked ? 'Bookmarked' : 'Add Bookmark'}</span>
                  {bookmarkCount > 0 && (
                    <span style={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.1rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>{bookmarkCount}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Pane / Content View */}
        <div id="reading-pane" style={{ scrollMarginTop: 'var(--nav-height)' }}>
          {hasAccess ? (
            <div className="card" style={{
              background: '#0c1225',
              padding: '3rem',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 0 50px rgba(99, 102, 241, 0.15)',
              position: 'relative'
            }}>
              {/* Decorative brand tag */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--accent-gradient)',
                padding: '0.4rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '0.05em'
              }}>
                FABLE PREMIUM READER
              </div>

              <div style={{
                maxWidth: '750px',
                margin: '0 auto',
                fontFamily: 'Georgia, serif',
                color: '#e2e8f0',
                fontSize: '1.25rem',
                lineHeight: '1.9',
                whiteSpace: 'pre-wrap',
                textAlign: 'justify'
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  textAlign: 'center',
                  marginBottom: '2rem',
                  color: 'white'
                }}>
                  {ebook.title}
                </h2>
                <div style={{
                  width: '50px',
                  height: '2px',
                  background: 'var(--accent-secondary)',
                  margin: '0 auto 3rem auto'
                }}></div>
                
                {ebook.description}
              </div>
            </div>
          ) : (
            <div className="card" style={{
              padding: '3rem',
              textAlign: 'center',
              borderStyle: 'dashed',
              borderWidth: '2px',
              borderColor: 'var(--glass-border)'
            }}>
              <FiUnlock style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
              <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Unlock Full Book</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                Purchase this premium creation to unlock the full text reader and start reading instantly inside your browser.
              </p>
              <button onClick={handlePurchase} disabled={buying} className="btn btn-primary">
                {buying ? 'Processing...' : `Unlock for $${ebook.price.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Ebooks */}
      {relatedEbooks.length > 0 && (
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', padding: '4rem 0', marginTop: '4rem' }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '2rem' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>
                More in <span className="text-gradient">{ebook.genre}</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>You might also enjoy these titles.</p>
            </motion.div>
            <div className="grid-ebooks">
              {relatedEbooks.map((rel, i) => (
                <EbookCard key={rel._id} ebook={rel} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
