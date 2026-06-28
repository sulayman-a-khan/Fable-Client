'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBookOpen, FiHome, FiCompass } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="loading-page" style={{
      minHeight: '80vh',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '5rem', marginBottom: '1.5rem' }}
        >
          <FiBookOpen style={{ color: 'var(--accent-primary)', opacity: 0.6 }} />
        </motion.div>

        <h1 className="text-gradient" style={{
          fontSize: 'clamp(4rem, 15vw, 8rem)',
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1,
        }}>404</h1>

        <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontSize: '1.6rem' }}>
          Page Not Found
        </h2>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '420px', lineHeight: 1.7 }}>
          The book you&apos;re looking for has been moved to another shelf, or this page no longer exists in our library.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiHome /> Go Home
          </Link>
          <Link href="/browse" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCompass /> Browse Library
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
