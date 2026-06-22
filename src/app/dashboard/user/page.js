'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { FiShoppingBag, FiBookmark, FiBookOpen, FiUser, FiArrowRight } from 'react-icons/fi';

export default function UserOverviewPage() {
  const { user } = useAuth();
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [purchasesRes, bookmarksRes] = await Promise.all([
          api.get('/transactions/user'),
          api.get('/bookmarks')
        ]);
        
        if (purchasesRes.data.success) {
          setPurchaseCount(purchasesRes.data.transactions?.length || 0);
        }
        if (bookmarksRes.data.success) {
          setBookmarkCount(bookmarksRes.data.bookmarks?.length || 0);
        }
      } catch (err) {
        console.error('Failed to load user overview stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      {/* Welcome header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
          Hello, <span className="text-gradient">{user.name}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Welcome to your Fable bookshelf. Access your library, manage bookmarks, or view purchases below.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        {/* Purchases stat */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
            <FiShoppingBag />
          </div>
          <p className="stat-value">{loading ? '...' : purchaseCount}</p>
          <p className="stat-label">Purchased Books</p>
        </div>

        {/* Bookmarks stat */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-secondary)' }}>
            <FiBookmark />
          </div>
          <p className="stat-value">{loading ? '...' : bookmarkCount}</p>
          <p className="stat-label">Bookmarked Books</p>
        </div>

        {/* Profile Card */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>
            <FiUser />
          </div>
          <p className="stat-value" style={{ fontSize: '1.25rem', height: '2rem', display: 'flex', alignItems: 'center' }}>
            {user.role.toUpperCase()}
          </p>
          <p className="stat-label">Account Membership</p>
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/browse" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiBookOpen />
            <span>Discover Ebooks</span>
            <FiArrowRight />
          </Link>
          <Link href="/dashboard/user/library" className="btn btn-secondary">
            Go to Library
          </Link>
          <Link href="/dashboard/user/bookmarks" className="btn btn-secondary">
            View Bookmarks
          </Link>
        </div>
      </div>
    </div>
  );
}
