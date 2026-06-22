'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiBookOpen, FiUser, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function RoleSelectionModal({ isOpen, onClose }) {
  const { setRole } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error('Please select a role.');
      return;
    }

    setLoading(true);
    try {
      await setRole(selectedRole);
      onClose();
      // Redirect based on selected role
      if (selectedRole === 'writer') {
        router.push('/dashboard/writer');
      } else {
        router.push('/dashboard/user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to set role.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Choose Your Path</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Select how you would like to experience Fable. You can change this later.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {/* Reader Role Option */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${selectedRole === 'user' ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                background: selectedRole === 'user' ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-tertiary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <input
                type="radio"
                name="role"
                value="user"
                checked={selectedRole === 'user'}
                onChange={() => setSelectedRole('user')}
                style={{ display: 'none' }}
              />
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                fontSize: '1.4rem'
              }}>
                <FiUser />
              </div>
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Reader</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Browse library, purchase, read, and bookmark ebooks.</p>
              </div>
            </label>

            {/* Writer Role Option */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${selectedRole === 'writer' ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                background: selectedRole === 'writer' ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-tertiary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <input
                type="radio"
                name="role"
                value="writer"
                checked={selectedRole === 'writer'}
                onChange={() => setSelectedRole('writer')}
                style={{ display: 'none' }}
              />
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-secondary)',
                fontSize: '1.4rem'
              }}>
                <FiBookOpen />
              </div>
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Writer</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Publish books, manage creations, and view dashboard analytics.</p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedRole}
            className="btn btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>{loading ? 'Saving...' : 'Confirm Role Selection'}</span>
            <FiArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
}
