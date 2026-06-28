'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import AnimatedStatCard from '@/components/ui/AnimatedStatCard';
import { FiBookOpen, FiShoppingBag, FiDollarSign, FiPlusCircle, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

export default function WriterOverviewPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBooks: 0, totalSold: 0, totalRevenue: 0, recentSales: [] });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await api.get('/analytics/writer-stats');
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error('Failed to load writer stats', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) fetchStats();
  }, [user]);

  const quickActions = [
    { href: '/dashboard/writer/add-ebook', label: 'Publish New Ebook', icon: FiPlusCircle, primary: true },
    { href: '/dashboard/writer/ebooks', label: 'Manage Creations', icon: FiBookOpen, primary: false },
    { href: '/dashboard/writer/sales', label: 'Sales History', icon: FiShoppingBag, primary: false },
    { href: '/dashboard/writer/bookmarks', label: 'My Bookmarks', icon: FiTrendingUp, primary: false },
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
          Writer Hub: <span className="text-gradient">{user.name}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor your ebook uploads, total sales, and platform revenue.
        </p>
      </motion.div>

      {/* Animated Stats Grid */}
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
            <AnimatedStatCard icon={FiBookOpen} value={stats.totalBooks} label="Total Creations" color="var(--accent-primary)" delay={0} />
            <AnimatedStatCard icon={FiShoppingBag} value={stats.totalSold} label="Copies Sold" color="var(--accent-secondary)" bgColor="rgba(245,158,11,0.1)" delay={0.1} />
            <AnimatedStatCard icon={FiDollarSign} value={stats.totalRevenue} label="Total Revenue" color="var(--success)" bgColor="rgba(34,197,94,0.1)" prefix="$" delay={0.2} />
          </>
        )}
      </div>

      {/* Recent Sales */}
      {!loading && stats.recentSales?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card"
          style={{ padding: '2rem', marginBottom: '2rem' }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Recent Sales</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.recentSales.map((sale) => (
              <div key={sale._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={sale.ebook?.coverImage || 'https://placehold.co/32x44?text=Cover'}
                    alt={sale.ebook?.title}
                    style={{ width: '32px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    onError={(e) => { e.target.src = 'https://placehold.co/32x44?text=Cover'; }}
                  />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{sale.ebook?.title || 'Deleted Book'}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>by {sale.buyer?.name || 'Unknown'}</p>
                  </div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.95rem' }}>${sale.amount?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="card"
        style={{ padding: '2.5rem' }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiTrendingUp style={{ color: 'var(--accent-secondary)' }} />
          Quick Actions
        </h3>
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
