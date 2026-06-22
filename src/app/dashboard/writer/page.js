'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { FiBookOpen, FiShoppingBag, FiDollarSign, FiPlusCircle, FiTrendingUp } from 'react-icons/fi';

export default function WriterOverviewPage() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    booksCount: 0,
    salesCount: 0,
    revenue: 0
  });

  useEffect(() => {
    async function fetchWriterStats() {
      try {
        const [ebooksRes, salesRes] = await Promise.all([
          api.get(`/ebooks/writer/${user._id}`),
          api.get('/transactions/writer')
        ]);

        if (ebooksRes.data.success && salesRes.data.success) {
          const ebooks = ebooksRes.data.ebooks || [];
          const sales = salesRes.data.transactions || [];
          
          const booksCount = ebooks.length;
          const salesCount = sales.length;
          const revenue = sales.reduce((sum, item) => sum + (item.amount || 0), 0);

          setStats({ booksCount, salesCount, revenue });
        }
      } catch (err) {
        console.error('Failed to load writer dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) {
      fetchWriterStats();
    }
  }, [user]);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
          Writer Hub: <span className="text-gradient">{user.name}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor your ebook uploads, total sales, and platform revenue.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        {/* Total Ebooks */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
            <FiBookOpen />
          </div>
          <p className="stat-value">{loading ? '...' : stats.booksCount}</p>
          <p className="stat-label">Total Creations</p>
        </div>

        {/* Total Sales */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-secondary)' }}>
            <FiShoppingBag />
          </div>
          <p className="stat-value">{loading ? '...' : stats.salesCount}</p>
          <p className="stat-label">Copies Sold</p>
        </div>

        {/* Total Revenue */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>
            <FiDollarSign />
          </div>
          <p className="stat-value">${loading ? '...' : stats.revenue.toFixed(2)}</p>
          <p className="stat-label">Total Sales Revenue</p>
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="card" style={{ padding: '2.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiTrendingUp style={{ color: 'var(--accent-secondary)' }} />
          <span>Quick Actions</span>
        </h3>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/dashboard/writer/add-ebook" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiPlusCircle />
            <span>Publish New Ebook</span>
          </Link>
          <Link href="/dashboard/writer/ebooks" className="btn btn-secondary">
            Manage Creations
          </Link>
          <Link href="/dashboard/writer/sales" className="btn btn-secondary">
            Sales History
          </Link>
        </div>
      </div>
    </div>
  );
}
