'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

function buildMonthlyChart(sales) {
  const map = {};
  sales.forEach((sale) => {
    const d = new Date(sale.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const short = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!map[key]) map[key] = { month: short, revenue: 0, sales: 0 };
    map[key].revenue += sale.amount || 0;
    map[key].sales += 1;
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
}

export default function WriterSalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    async function fetchSales() {
      try {
        const { data } = await api.get('/transactions/writer');
        if (data.success) {
          setSales(data.transactions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  const totalRevenue = sales.reduce((sum, item) => sum + (item.amount || 0), 0);
  const chartData = buildMonthlyChart(sales);

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Sales History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track purchases of your uploaded ebooks and total earnings.</p>
        </div>
        <div className="card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--success)' }}>
          <FiDollarSign style={{ color: 'var(--success)' }} />
          <span>Total Earnings: <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>${totalRevenue.toFixed(2)}</strong></span>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {mounted && chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
          style={{ padding: '2rem', marginBottom: '2rem' }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiTrendingUp style={{ color: 'var(--accent-secondary)' }} />
            Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="writerRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: '#1a2342', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f1f5f9' }}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#writerRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {loading ? (
        <div className="card" style={{ padding: '2rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '50px', marginBottom: '1rem', width: '100%' }}></div>
          ))}
        </div>
      ) : sales.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Ebook Title</th>
                  <th>Buyer Name</th>
                  <th>Buyer Email</th>
                  <th>Amount Paid</th>
                  <th>Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => {
                  const book = sale.ebook || {};
                  return (
                    <tr key={sale._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '36px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
                            <img
                              src={book.coverImage}
                              alt={book.title || 'Book Cover'}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = 'https://placehold.co/36x48?text=Cover'; }}
                            />
                          </div>
                          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{book.title || 'Deleted Book'}</p>
                        </div>
                      </td>
                      <td>{sale.buyer?.name || 'N/A'}</td>
                      <td>{sale.buyer?.email || 'N/A'}</td>
                      <td><strong style={{ color: 'var(--success)' }}>${sale.amount?.toFixed(2)}</strong></td>
                      <td>{new Date(sale.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><FiShoppingBag /></div>
          <h3>No sales recorded yet</h3>
          <p>You haven't sold any copies yet. Try publishing more ebooks or updating your pricing to attract readers.</p>
        </div>
      )}
    </div>
  );
}
