'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

export default function HeroBanner() {
  const { isAuthenticated, isWriter } = useAuth();

  let publishLink = '/register?role=writer';
  if (isAuthenticated) {
    publishLink = isWriter ? '/dashboard/writer/add-ebook' : '/dashboard/user';
  }

  return (
    <section className="section" style={{
      position: 'relative',
      padding: '8rem 0 6rem 0',
      background: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.12), transparent 50%), radial-gradient(circle at 10% 80%, rgba(245, 158, 11, 0.08), transparent 40%)',
      overflow: 'hidden'
    }}>
      {/* Decorative Glow Elements */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'var(--accent-primary)',
        filter: 'blur(120px)',
        top: '-50px',
        right: '10%',
        opacity: 0.15,
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'var(--accent-secondary)',
        filter: 'blur(150px)',
        bottom: '-100px',
        left: '-50px',
        opacity: 0.08,
        pointerEvents: 'none'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          alignItems: 'center',
          gap: '3rem',
          textAlign: 'center'
        }} className="grid-hero">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '2rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ width: '8px', height: '8px', background: 'var(--accent-secondary)', borderRadius: '50%' }}></span>
              Welcome to the Future of Digital Books
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.15',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              fontWeight: 800
            }}>
              Discover & Read <br />
              <span className="text-gradient">Original Ebooks</span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              maxWidth: '650px',
              margin: '0 auto 2.5rem auto',
              lineHeight: '1.7'
            }}>
              Democratizing access to exceptional literature. Fable connects ebook enthusiasts, readers, and avid collectors with talented independent writers.
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/browse" className="btn btn-primary btn-lg">
                <span>Browse Library</span>
                <FiArrowRight />
              </Link>
              <Link href={publishLink} className="btn btn-secondary btn-lg">
                <span>Publish Your Book</span>
                <FiBookOpen style={{ color: 'var(--accent-secondary)' }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 992px) {
          h1 {
            font-size: 4rem !important;
          }
        }
      `}</style>
    </section>
  );
}
