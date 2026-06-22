'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiBookOpen, FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing to Fable Newsletter!');
    setEmail('');
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: '4rem 0 2rem 0',
      color: 'var(--text-secondary)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Column */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }} className="text-gradient">
              <FiBookOpen style={{ color: 'var(--accent-secondary)' }} />
              <span>FABLE</span>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Democratizing literature by connecting passionate readers with talented writers worldwide. Browse, purchase, and read original ebooks in a premium digital library experience.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }} className="dropdown-item-hover">
                <FiTwitter />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }} className="dropdown-item-hover">
                <FiInstagram />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }} className="dropdown-item-hover">
                <FiGithub />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>Explore</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Home</Link>
              </li>
              <li>
                <Link href="/browse" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Browse Ebooks</Link>
              </li>
              <li>
                <Link href="/browse?genre=Fiction" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Fiction Ebooks</Link>
              </li>
              <li>
                <Link href="/browse?genre=Sci-Fi" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Sci-Fi Novels</Link>
              </li>
            </ul>
          </div>

          {/* Support / Legal */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>About Us</a>
              </li>
              <li>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Privacy Policy</a>
              </li>
              <li>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Terms of Service</a>
              </li>
              <li>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Contact Support</a>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>Newsletter</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Subscribe to get notified about new books, top writers, and exclusive literary events.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                <FiMail />
              </button>
            </form>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <p>&copy; {new Date().getFullYear()} Fable Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Terms</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
