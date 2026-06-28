'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { FiShoppingBag, FiSearch, FiDollarSign } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data } = await api.get('/transactions/all');
        if (data.success) {
          setTransactions(data.transactions || []);
          setFiltered(data.transactions || []);
        }
      } catch (err) {
        console.error('Failed to load transactions', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(transactions);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      transactions.filter(
        (t) =>
          t.buyer?.name?.toLowerCase().includes(q) ||
          t.buyer?.email?.toLowerCase().includes(q) ||
          t.ebook?.title?.toLowerCase().includes(q)
      )
    );
  }, [search, transactions]);

  const totalRevenue = filtered.reduce((sum, t) => sum + (t.amount || 0), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>All Transactions</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} — platform revenue: <strong style={{ color: 'var(--success)' }}>${totalRevenue.toFixed(2)}</strong>
            </p>
          </div>
          <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '260px' }}>
            <FiSearch style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search buyer or title…"
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
        </div>
      </motion.div>

      {filtered.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="table-container"
        >
          <table className="table">
            <thead>
              <tr>
                <th>Ebook</th>
                <th>Buyer</th>
                <th>Writer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '44px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src={t.ebook?.coverImage || 'https://placehold.co/32x44?text=Cover'}
                          alt={t.ebook?.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://placehold.co/32x44?text=Cover'; }}
                        />
                      </div>
                      <span style={{ fontWeight: 600, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.ebook?.title || 'Deleted Book'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.buyer?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.buyer?.email}</div>
                    </div>
                  </td>
                  <td>{t.writer?.name || 'N/A'}</td>
                  <td><strong style={{ color: 'var(--success)' }}>${t.amount?.toFixed(2)}</strong></td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: t.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: t.status === 'completed' ? 'var(--success)' : 'var(--danger)',
                    }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(t.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><FiShoppingBag /></div>
          <h3>{search ? 'No results found' : 'No transactions yet'}</h3>
          <p>{search ? `No transactions match "${search}". Try a different search.` : 'Transactions will appear here once users start purchasing ebooks.'}</p>
        </div>
      )}
    </div>
  );
}
