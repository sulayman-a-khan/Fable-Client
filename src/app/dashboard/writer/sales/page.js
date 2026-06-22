'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FiShoppingBag, FiDollarSign } from 'react-icons/fi';

export default function WriterSalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <span>Earnings: <strong style={{ color: 'var(--text-primary)' }}>${totalRevenue.toFixed(2)}</strong></span>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '2rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '50px', marginBottom: '1rem', width: '100%' }}></div>
          ))}
        </div>
      ) : sales.length > 0 ? (
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
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/36x48?text=Cover';
                            }}
                          />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{book.title || 'Deleted Book'}</p>
                        </div>
                      </div>
                    </td>
                    <td>{sale.buyer?.name || 'N/A'}</td>
                    <td>{sale.buyer?.email || 'N/A'}</td>
                    <td>
                      <strong style={{ color: 'var(--success)' }}>${sale.amount?.toFixed(2)}</strong>
                    </td>
                    <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FiShoppingBag />
          </div>
          <h3>No sales recorded</h3>
          <p>You haven't sold any copies yet. Try publishing more or updating pricing to attract readers.</p>
        </div>
      )}
    </div>
  );
}
