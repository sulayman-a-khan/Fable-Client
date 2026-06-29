'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiCalendar, FiShield, FiEdit2, FiCheck, FiX, FiLock } from 'react-icons/fi';

export default function UserProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setNewName(user.name);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveProfile = async () => {
    if (!newName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.patch('/users/profile', { name: newName.trim() });
      if (data.success) {
        await refreshUser();
        toast.success('Profile updated!');
        setEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const changePw = async () => {
    if (pwForm.next !== pwForm.confirm) { toast.error('New passwords do not match'); return; }
    if (pwForm.next.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setPwSaving(true);
    try {
      const { data } = await api.post('/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.next });
      if (data.success) { toast.success('Password changed!'); setPwForm({ current: '', next: '', confirm: '' }); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  const rolePerks = {
    user: [
      'Browse and search the entire ebook catalog.',
      'Securely purchase premium books via Stripe checkout.',
      'Read unlocked ebooks inside your browser with Fable Reader.',
      'Bookmark ebooks to organize your personal reading list.',
    ],
    writer: [
      'All reader privileges above.',
      'Upload and manage your own ebook listings.',
      'Set pricing and cover images via imgBB.',
      'Track your sales and earnings with detailed reports.',
      'Monitor monthly revenue trends with analytics charts.',
    ],
    admin: [
      'All platform privileges.',
      'Manage all users, roles, and accounts.',
      'Publish or unpublish any ebook on the platform.',
      'View all transactions and platform-wide analytics.',
    ],
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Account Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your registered credentials and platform privileges.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem'
      }}>
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card"
          style={{ padding: '2.5rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem', cursor: 'pointer' }} className="avatar-container">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
                />
              ) : (
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'var(--bg-tertiary)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-secondary)', border: '2px solid var(--glass-border)'
                }}>
                  <FiUser style={{ fontSize: '3rem' }} />
                </div>
              )}
              
              <label htmlFor="avatar-upload" style={{
                position: 'absolute', bottom: 0, right: 0,
                background: 'var(--accent-primary)', color: 'white',
                borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2px solid var(--bg-primary)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <FiEdit2 style={{ fontSize: '0.9rem' }} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('image', file);

                  const uploadToast = toast.loading('Uploading profile picture...');
                  try {
                    const { data: uploadData } = await api.post('/upload/image', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    if (uploadData.success && uploadData.imageUrl) {
                      const { data: profileData } = await api.patch('/users/profile', { avatar: uploadData.imageUrl });
                      if (profileData.success) {
                        await refreshUser();
                        toast.success('Profile picture updated!', { id: uploadToast });
                      }
                    }
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to upload profile picture', { id: uploadToast });
                  }
                }}
              />
            </div>

            {/* Editable Name */}
            {editing ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input"
                  style={{ textAlign: 'center', fontSize: '1.1rem' }}
                  maxLength={100}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') saveProfile(); if (e.key === 'Escape') cancelEdit(); }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={saveProfile} disabled={saving} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiCheck /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={cancelEdit} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>{user.name}</h3>
                <button
                  onClick={startEdit}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                  title="Edit name"
                >
                  <FiEdit2 />
                </button>
              </div>
            )}

            <span className="badge badge-primary" style={{ marginTop: '0.5rem' }}>{user.role}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
              <FiMail style={{ color: 'var(--accent-secondary)', fontSize: '1.2rem', flexShrink: 0 }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>EMAIL ADDRESS</span>
                <span style={{ color: 'var(--text-primary)' }}>{user.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
              <FiCalendar style={{ color: 'var(--accent-secondary)', fontSize: '1.2rem', flexShrink: 0 }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>MEMBER SINCE</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>

            {user.googleId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Linked with Google</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Platform Permissions Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="card"
          style={{ padding: '2.5rem' }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiShield style={{ color: 'var(--accent-secondary)' }} />
            Platform Privileges
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(privilegeMap[user.role] || privilegeMap.user).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '0.1rem', fontSize: '0.7rem', fontWeight: 700
                }}>✓</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Change Password Section — only for non-Google accounts */}
      {!user.googleId && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card"
          style={{ padding: '2.5rem', marginTop: '2.5rem' }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiLock style={{ color: 'var(--accent-secondary)' }} />
            Change Password
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', maxWidth: '700px' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="input" value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                placeholder="Current password" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="input" value={pwForm.next}
                onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                placeholder="Min 8 characters" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="input" value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                placeholder="Repeat new password" />
            </div>
          </div>
          <button
            onClick={changePw}
            disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm}
            className="btn btn-primary"
            style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiLock /> {pwSaving ? 'Updating...' : 'Update Password'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
