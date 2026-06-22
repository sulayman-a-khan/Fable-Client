'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiBookOpen, FiEdit, FiTrash2, FiEye, FiEyeOff, FiPlusCircle, FiX } from 'react-icons/fi';

export default function WriterEbooksPage() {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Delete Confirmation Modal
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchWriterEbooks = async () => {
    try {
      const { data } = await api.get(`/ebooks/writer/${user._id}`);
      if (data.success) {
        setEbooks(data.ebooks || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load ebooks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchWriterEbooks();
    }
  }, [user]);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'unpublished' : 'published';
    try {
      const { data } = await api.patch(`/ebooks/${id}/status`, { status: nextStatus });
      if (data.success) {
        toast.success(`Ebook ${nextStatus} successfully!`);
        setEbooks(ebooks.map((book) => book._id === id ? { ...book, status: nextStatus } : book));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to change status.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteBookId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteBookId) return;
    setDeleting(true);
    try {
      const { data } = await api.delete(`/ebooks/${deleteBookId}`);
      if (data.success) {
        toast.success('Ebook deleted successfully!');
        setEbooks(ebooks.filter((book) => book._id !== deleteBookId));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete ebook.');
    } finally {
      setDeleting(false);
      setDeleteBookId(null);
    }
  };

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
          <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Manage Ebooks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Publish, edit, delete, or manage your catalog status.</p>
        </div>
        <Link href="/dashboard/writer/add-ebook" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlusCircle />
          <span>Upload Ebook</span>
        </Link>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '2rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '50px', marginBottom: '1rem', width: '100%' }}></div>
          ))}
        </div>
      ) : ebooks.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Status</th>
                <th>Sales Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ebooks.map((book) => (
                <tr key={book._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '56px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40x56?text=Cover';
                          }}
                        />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{book.title}</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {book._id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </td>
                  <td>{book.genre}</td>
                  <td>
                    <strong>${book.price?.toFixed(2)}</strong>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(book._id, book.status)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        cursor: 'pointer',
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.75rem',
                        border: 'none',
                        background: 'transparent'
                      }}
                      className={book.status === 'published' ? 'badge badge-success' : 'badge badge-danger'}
                      title={`Click to ${book.status === 'published' ? 'unpublish' : 'publish'}`}
                    >
                      {book.status === 'published' ? (
                        <>
                          <FiEye />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <FiEyeOff />
                          <span>Unpublished</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <span>{book.totalSold || 0}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/ebooks/${book._id}`} className="btn btn-secondary btn-sm" title="View details">
                        <FiEye />
                      </Link>
                      <Link href={`/dashboard/writer/edit-ebook/${book._id}`} className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-primary-hover)' }} title="Edit ebook">
                        <FiEdit />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(book._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Delete ebook"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FiBookOpen />
          </div>
          <h3>No creations uploaded yet</h3>
          <p>Click below to upload your first original ebook and set your price.</p>
          <Link href="/dashboard/writer/add-ebook" className="btn btn-primary">
            Upload Ebook
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBookId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--danger)' }}>Confirm Deletion</h3>
              <button onClick={() => setDeleteBookId(null)} className="modal-close">
                <FiX />
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Are you sure you want to delete this ebook? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteBookId(null)} className="btn btn-secondary btn-sm" disabled={deleting}>
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-danger btn-sm" disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
