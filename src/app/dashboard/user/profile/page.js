'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FiUser, FiMail, FiCalendar, FiShield } from 'react-icons/fi';

export default function UserProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Account Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and verify your registered credentials and platform rights.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem'
      }}>
        {/* Info Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-primary)'
                  }}
                />
              ) : (
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-secondary)',
                  border: '2px solid var(--glass-border)'
                }}>
                  <FiUser style={{ fontSize: '3rem' }} />
                </div>
              )}
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>{user.name}</h3>
            <span className="badge badge-primary" style={{ marginTop: '0.5rem' }}>{user.role}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
              <FiMail style={{ color: 'var(--accent-secondary)', fontSize: '1.2rem' }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>EMAIL ADDRESS</span>
                <span style={{ color: 'var(--text-primary)' }}>{user.email}</span>
              </div>
            </div>

            {/* Registration date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
              <FiCalendar style={{ color: 'var(--accent-secondary)', fontSize: '1.2rem' }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>MEMBER SINCE</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform permissions / instructions card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiShield style={{ color: 'var(--accent-secondary)' }} />
            <span>Platform Privileges</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            <p>
              As a registered <strong>Reader</strong>, you have access to the following benefits:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Browse and search the entire catalog of ebooks.</li>
              <li>Securely purchase premium books via Stripe payment checkout.</li>
              <li>Instantly read unlocked ebooks inside your browser with Fable Reader.</li>
              <li>Bookmark stories to organize your personalized reading list.</li>
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Want to publish your own books? You can contact administrative support to transition your account to a writer profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
