'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import AnimatedStatCard from '@/components/ui/AnimatedStatCard';
import { FiShoppingBag, FiBookmark, FiBookOpen, FiUser, FiArrowRight, FiCompass, FiDollarSign } from 'react-icons/fi';

export default function UserOverviewPage() {
  const { user } = useAuth();
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [summaryRes, bookmarksRes] = await Promise.all([
          api.get('/transactions/summary'),
          api.get('/bookmarks'),
        ]);
        if (summaryRes.data.success) {
          setPurchaseCount(summaryRes.data.summary.totalPurchases || 0);
          setTotalSpent(summaryRes.data.summary.totalSpent || 0);
        }
        if (bookmarksRes.data.success) setBookmarkCount(bookmarksRes.data.bookmarks?.length || 0);
      } catch (err) {
        console.error('Failed to load user stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const quickActions = [
    { href: '/browse', label: 'Discover Ebooks', icon: FiCompass, primary: true },
    { href: '/dashboard/user/library', label: 'My Library', icon: FiBookOpen, primary: false },
    { href: '/dashboard/user/purchases', label: 'My Purchases', icon: FiShoppingBag, primary: false },
    { href: '/dashboard/user/bookmarks', label: 'My Bookmarks', icon: FiBookmark, primary: false },
    { href: '/dashboard/user/profile', label: 'My Profile', icon: FiUser, primary: false },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
          Hello, <span className="text-gradient">{user.name}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Welcome to your Fable bookshelf. Access your library, manage bookmarks, or view purchases below.
        </p>
      </motion.div>

      {/* Animated Stats */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="stat-card skeleton-card">
              <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}></div>
              <div className="skeleton skeleton-text lg" style={{ marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-text sm"></div>
            </div>
          ))
        ) : (
          <>
            <AnimatedStatCard icon={FiShoppingBag} value={purchaseCount} label="Purchased Books" color="var(--accent-primary)" delay={0} />
            <AnimatedStatCard icon={FiBookmark} value={bookmarkCount} label="Bookmarked Books" color="var(--accent-secondary)" bgColor="rgba(245,158,11,0.1)" delay={0.1} />
            <AnimatedStatCard icon={FiDollarSign} value={totalSpent} label="Total Spent" color="var(--success)" bgColor="rgba(34,197,94,0.1)" prefix="$" delay={0.2} />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="card"
        style={{ padding: '2.5rem' }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {quickActions.map(({ href, label, icon: Icon, primary }) => (
            <Link key={href} href={href}
              className={`btn ${primary ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', padding: '0.875rem 1.25rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon /> {label}
              </span>
              <FiArrowRight style={{ opacity: 0.6 }} />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
