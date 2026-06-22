'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiUsers, FiTrash2, FiShield, FiX, FiCheck } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Role modification helper state
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch platform users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const { data } = await api.patch(`/users/${userId}/role`, { role: newRole });
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers(users.map((u) => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to modify role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;
    setDeleting(true);
    try {
      const { data } = await api.delete(`/users/${deleteUserId}`);
      if (data.success) {
        toast.success('User deleted successfully.');
        setUsers(users.filter((u) => u._id !== deleteUserId));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeleting(false);
      setDeleteUserId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading platform users..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Manage Users</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Modify user permissions or delete user accounts.</p>
      </div>

      {users.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--bg-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)'
                        }}>
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {item._id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </td>
                  <td>{item.email}</td>
                  <td>
                    <select
                      value={item.role}
                      disabled={updatingId === item._id}
                      onChange={(e) => handleRoleChange(item._id, e.target.value)}
                      className="form-select"
                      style={{
                        padding: '0.25rem 2rem 0.25rem 0.5rem',
                        fontSize: '0.85rem',
                        width: '120px',
                        backgroundPosition: 'right 0.5rem center'
                      }}
                    >
                      <option value="user">Reader</option>
                      <option value="writer">Writer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)' }}
                      title="Delete User"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FiUsers />
          </div>
          <h3>No users found</h3>
          <p>No platform users registered yet.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--danger)' }}>Confirm Account Deletion</h3>
              <button onClick={() => setDeleteUserId(null)} className="modal-close">
                <FiX />
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Are you sure you want to delete this user? This will delete all their details. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteUserId(null)} className="btn btn-secondary btn-sm" disabled={deleting}>
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
