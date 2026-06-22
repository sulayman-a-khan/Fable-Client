'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { FiShoppingBag, FiBookOpen } from 'react-icons/fi';

export default function UserPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const { data } = await api.get('/transactions/user');
        if (data.success) {
          setPurchases(data.transactions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Purchase History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and access all ebooks you have purchased on Fable.</p>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '2rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '50px', marginBottom: '1rem', width: '100%' }}></div>
          ))}
        </div>
      ) : purchases.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Book Details</th>
                <th>Author</th>
                <th>Price Paid</th>
                <th>Purchase Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => {
                const book = purchase.ebook || {};
                return (
                  <tr key={purchase._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '56px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
                          <img
                            src={book.coverImage}
                            alt={book.title || 'Book Cover'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40x56?text=Cover';
                            }}
                          />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{book.title || 'Deleted Book'}</p>
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{book.genre}</span>
                        </div>
                      </div>
                    </td>
                    <td>{purchase.writer?.name || 'Unknown Author'}</td>
                    <td>
                      <strong>${purchase.amount?.toFixed(2)}</strong>
                    </td>
                    <td>{new Date(purchase.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-success">{purchase.status}</span>
                    </td>
                    <td>
                      {book._id ? (
                        <Link href={`/ebooks/${book._id}#reading-pane`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FiBookOpen />
                          <span>Read Now</span>
                        </Link>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unavailable</span>
                      )}
                    </td>
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
          <h3>No purchases yet</h3>
          <p>You haven't bought any ebooks yet. Discover great literature in our library!</p>
          <Link href="/browse" className="btn btn-primary">
            Browse Library
          </Link>
        </div>
      )}
    </div>
  );
}
