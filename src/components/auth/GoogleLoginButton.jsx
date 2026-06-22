'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function GoogleLoginButton() {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const user = await googleLogin({ token: credentialResponse.credential });
      if (user && !user.role) {
        router.push('/register?selectRole=true');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem', width: '100%' }}>
      {clientId ? (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google Sign-In failed. Please try again.');
            }}
            theme="filled_blue"
            size="large"
            shape="pill"
            width="350"
          />
        </div>
      ) : (
        <div style={{ width: '100%' }}>
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              border: '1px dashed var(--warning)',
              background: 'rgba(245, 158, 11, 0.05)',
            }}
          >
            <FcGoogle style={{ fontSize: '1.3rem' }} />
            <span>Configure Google Login</span>
          </button>
          
          <div style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <FiAlertTriangle style={{ color: 'var(--warning)', marginTop: '0.1rem', flexShrink: 0 }} />
            <div>
              <strong>Google Client ID is missing.</strong> Click the button above to view manual setup instructions.
            </div>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <FcGoogle />
                <span>Google OAuth Setup Guide</span>
              </h3>
              <button onClick={() => setShowGuide(false)} className="modal-close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <FiX size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <p>To enable real Google authentication, you must create web credentials in the Google Cloud Console.</p>
              
              <h4 style={{ color: 'var(--text-primary)', marginTop: '1rem', marginBottom: '0.5rem' }}>Step 1: Get Credentials</h4>
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Google Cloud Console</a>.</li>
                <li>Create a new project or select an existing one.</li>
                <li>Search for <strong>APIs & Services</strong> &gt; <strong>OAuth consent screen</strong>. Configure it as <strong>External</strong> and fill in the required fields.</li>
                <li>Go to <strong>Credentials</strong>, click <strong>Create Credentials</strong> &gt; <strong>OAuth client ID</strong>.</li>
                <li>Select Application type: <strong>Web application</strong>.</li>
                <li>Under <strong>Authorized JavaScript origins</strong>, add:
                  <code style={{ display: 'block', background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', marginTop: '0.25rem', borderRadius: '4px' }}>http://localhost:3000</code>
                </li>
                <li>Under <strong>Authorized redirect URIs</strong>, add:
                  <code style={{ display: 'block', background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', marginTop: '0.25rem', borderRadius: '4px' }}>http://localhost:3000</code>
                  <code style={{ display: 'block', background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', marginTop: '0.25rem', borderRadius: '4px' }}>http://localhost:5000/api/auth/google</code>
                </li>
                <li>Click <strong>Create</strong> to get your Client ID and Client Secret.</li>
              </ol>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>Step 2: Update Environment Variables</h4>
              <p>Add the Client ID to both your client and server configurations:</p>
              
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>For Client (c:\projects\assignment10\client\.env.local):</strong>
              <pre style={{ background: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
              </pre>

              <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>For Server (c:\projects\assignment10\server\.env):</strong>
              <pre style={{ background: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', overflowX: 'auto', marginTop: '0.25rem' }}>
                GOOGLE_CLIENT_ID=your_client_id_here<br />
                GOOGLE_CLIENT_SECRET=your_client_secret_here
              </pre>

              <div style={{
                marginTop: '1.25rem',
                padding: '0.75rem',
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid var(--accent-primary)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontSize: '0.8rem'
              }}>
                <FiInfo style={{ color: 'var(--accent-primary)', marginTop: '0.1rem', flexShrink: 0 }} />
                <div>
                  After adding the environment variables, restart both the client and server processes for the changes to take effect.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
