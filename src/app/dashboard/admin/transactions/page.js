'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FiShoppingBag } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data } = await api.get('/transactions/all');
        if (data.success) {
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading platform transactions..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>All Transactions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Audit and monitor all purchasing activity occurring on the platform.</p>
      </div>

      {transactions.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ebook Title</th>
                <th>Buyer</th>
                <th>Author</th>
                <th>Amount Paid</th>
                <th>Purchase Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{t._id.substring(0, 12)}...</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.ebook?.title || 'Deleted Book'}</span>
                  </td>
                  <td>
                    <div>
                      <p style={{ fontWeight: 500, margin: 0 }}>{t.buyer?.name || 'Deleted Account'}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.buyer?.email}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p style={{ fontWeight: 500, margin: 0 }}>{t.writer?.name || 'Deleted Account'}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.writer?.email}</span>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--success)' }}>${t.amount?.toFixed(2)}</strong>
                  </td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={t.status === 'completed' ? 'badge badge-success' : t.status === 'pending' ? 'badge badge-warning' : 'badge badge-danger'}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FiShoppingBag />
          </div>
          <h3>No transactions recorded</h3>
          <p>No transaction history has been generated on Fable yet.</p>
        </div>
      )}
    </div>
  );
}
