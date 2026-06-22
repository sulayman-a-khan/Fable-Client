'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FiUsers, FiBookOpen, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [overviewRes, monthlyRes, genreRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/monthly-sales'),
          api.get('/analytics/genre-distribution')
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
        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
            <FiUsers />
          </div>
          <p className="stat-value">{stats?.totalUsers}</p>
          <p className="stat-label">Total Registered Users</p>
        </div>

        {/* Total Writers */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-secondary)' }}>
            <FiUsers />
          </div>
          <p className="stat-value">{stats?.totalWriters}</p>
          <p className="stat-label">Verified Authors</p>
        </div>

        {/* Total Ebooks */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <FiBookOpen />
          </div>
          <p className="stat-value">{stats?.totalEbooks}</p>
          <p className="stat-label">Total Ebooks</p>
        </div>

        {/* Sales */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
            <FiShoppingBag />
          </div>
          <p className="stat-value">{stats?.totalSold}</p>
          <p className="stat-label">Purchases</p>
        </div>

        {/* Revenue */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>
            <FiDollarSign />
          </div>
          <p className="stat-value">${stats?.totalRevenue?.toFixed(2)}</p>
          <p className="stat-label">Total Revenue</p>
        </div>
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
    </div>
  );
}
