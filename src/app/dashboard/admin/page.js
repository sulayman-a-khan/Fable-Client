'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FiUsers, FiBookOpen, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AnimatedStatCard from '@/components/ui/AnimatedStatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444'];

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [topEbooks, setTopEbooks] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [overviewRes, monthlyRes, genreRes, topEbooksRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/monthly-sales'),
          api.get('/analytics/genre-distribution'),
          api.get('/analytics/top-ebooks'),
        ]);

        if (overviewRes.data.success) {
          setStats(overviewRes.data.overview);
        }
        if (monthlyRes.data.success) {
          setMonthlySales(monthlyRes.data.monthlySales || []);
        }
        if (genreRes.data.success) {
          setGenreData(genreRes.data.genreData || []);
        }
        if (topEbooksRes.data.success) {
          setTopEbooks(topEbooksRes.data.topEbooks || []);
        }
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      fetchAnalytics();
    }
  }, [mounted]);

  if (!mounted || loading) {
    return <LoadingSpinner size="lg" text="Loading platform analytics charts..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Platform Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>System analytics, user activity, book counts, and revenue trends.</p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <AnimatedStatCard icon={FiUsers} value={stats?.totalUsers || 0} label="Total Registered Users" color="var(--accent-primary)" delay={0} />
        <AnimatedStatCard icon={FiUsers} value={stats?.totalWriters || 0} label="Verified Authors" color="var(--accent-secondary)" bgColor="rgba(245,158,11,0.1)" delay={0.08} />
        <AnimatedStatCard icon={FiBookOpen} value={stats?.totalEbooks || 0} label="Total Ebooks" color="#10b981" bgColor="rgba(16,185,129,0.1)" delay={0.16} />
        <AnimatedStatCard icon={FiShoppingBag} value={stats?.totalSold || 0} label="Purchases" color="#ec4899" bgColor="rgba(236,72,153,0.1)" delay={0.24} />
        <AnimatedStatCard icon={FiDollarSign} value={stats?.totalRevenue || 0} label="Total Revenue" color="var(--success)" bgColor="rgba(34,197,94,0.1)" prefix="$" suffix="" delay={0.32} />
      </div>

      {/* Charts section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem'
      }}>
        {/* Sales Chart */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Sales Revenue Trend</h3>
          <div style={{ width: '100%', height: '300px' }}>
            {monthlySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="var(--accent-primary)" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" fill="var(--accent-secondary)" name="Sales Count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No transaction data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Genre distribution chart */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Genre Distribution</h3>
          <div style={{ width: '100%', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {genreData.length > 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                <div style={{ flexGrow: 1, height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="genre"
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '1rem' }}>
                  {genreData.slice(0, 5).map((entry, index) => (
                    <div key={entry.genre} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></span>
                      <span style={{ color: 'var(--text-secondary)' }}>{entry.genre} ({entry.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No genre data available yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Performing Ebooks */}
      {topEbooks.length > 0 && (
        <div className="card" style={{ padding: '2rem', marginTop: '2.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            🏆 Top Performing Ebooks
          </h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Price</th>
                  <th>Copies Sold</th>
                </tr>
              </thead>
              <tbody>
                {topEbooks.map((book, i) => (
                  <tr key={book._id}>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'var(--text-muted)',
                        fontSize: '1rem'
                      }}>#{i + 1}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '44px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                          <img
                            src={book.coverImage || 'https://placehold.co/32x44?text=Cover'}
                            alt={book.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://placehold.co/32x44?text=Cover'; }}
                          />
                        </div>
                        <span style={{ fontWeight: 600 }}>{book.title}</span>
                      </div>
                    </td>
                    <td>{book.writer?.name || 'Unknown'}</td>
                    <td><span className="badge badge-primary">{book.genre}</span></td>
                    <td><strong>${book.price?.toFixed(2)}</strong></td>
                    <td>
                      <strong style={{ color: 'var(--success)' }}>{book.totalSold || 0}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
